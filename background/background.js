/**
 * Background Service Worker: Handles scheduling, state, and ad dispatching.
 */

import { pickNextAd, pickMultipleAds, DEFAULT_CATEGORIES } from "../lib/ad-engine.js";

const ALARM_NAME = "adventure_ad_alarm";

// Initialize default storage settings on extension installation
chrome.runtime.onInstalled.addListener(async () => {
  const current = await chrome.storage.local.get(null);
  const defaults = {
    isRunning: false, // Starts paused so user can configure and start with intention
    frequencySeconds: 30, // Every 30 seconds by default
    frequencyMinutes: 0.5,
    adBatchCount: 3, // Number of ads popping up simultaneously at once!
    theme: "retro90s", // Default retro 90s aesthetic
    soundEnabled: true,
    categories: Object.fromEntries(Object.keys(DEFAULT_CATEGORIES).map(k => [k, true])),
    customAds: [
      {
        id: "custom-demo-1",
        headline: "Have you drank any water today?",
        body: "Seriously, take a sip right now. Your hydration levels are concerningly low.",
        cta: "I Took A Sip",
        badge: "HYDRATION CHECK",
        emoji: "💧",
        enabled: true
      }
    ],
    useAi: false,
    geminiApiKey: "",
    userPersona: ""
  };

  const toSet = {};
  for (const [key, val] of Object.entries(defaults)) {
    if (current[key] === undefined) {
      toSet[key] = val;
    }
  }

  if (Object.keys(toSet).length > 0) {
    await chrome.storage.local.set(toSet);
  }

  console.log("AdVenture extension initialized.");
});

// Configure alarm based on frequency
async function updateAlarm(isRunning, frequencyMinutes) {
  await chrome.alarms.clear(ALARM_NAME);
  if (isRunning) {
    const period = Math.max(0.2, parseFloat(frequencyMinutes) || 1);
    chrome.alarms.create(ALARM_NAME, {
      delayInMinutes: period,
      periodInMinutes: period
    });
    console.log(`Ad alarm scheduled for every ${period} minutes.`);
  } else {
    console.log("Ad alarm cleared. Generator is stopped.");
  }
}

// When alarm triggers, display an ad on the active tab
chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name !== ALARM_NAME) return;

  const data = await chrome.storage.local.get(null);
  if (!data.isRunning) return;

  await triggerAdOnActiveTab(data);
});

// Dispatch an ad to the active tab
async function triggerAdOnActiveTab(settings) {
  try {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tabs || tabs.length === 0) return;

    const tab = tabs[0];
    if (!tab.id || !tab.url) return;

    // Skip restricted browser-internal pages
    if (
      tab.url.startsWith("chrome://") ||
      tab.url.startsWith("chrome-extension://") ||
      tab.url.startsWith("edge://") ||
      tab.url.startsWith("about:") ||
      tab.url.startsWith("view-source:")
    ) {
      return;
    }

    // Try to get page context from the tab's content script
    let pageContext = {
      title: tab.title || "",
      url: tab.url || ""
    };

    try {
      const response = await chrome.tabs.sendMessage(tab.id, { action: "GET_PAGE_CONTEXT" });
      if (response && response.context) {
        pageContext = { ...pageContext, ...response.context };
      }
    } catch (e) {
      // Content script may not be loaded yet or tab is not ready
    }

    // Pick or synthesize batch of ads for random sides of the screen
    const batchCount = Math.max(1, Math.min(10, parseInt(settings.adBatchCount) || 3));
    const ads = await pickMultipleAds(settings, pageContext, batchCount);
    if (!ads || ads.length === 0) return;

    const payload = {
      action: "SHOW_ADS",
      ads: ads,
      settings: {
        theme: settings.theme || "retro90s",
        soundEnabled: settings.soundEnabled !== false
      }
    };

    // Send the ads to the content script
    try {
      await chrome.tabs.sendMessage(tab.id, payload);
    } catch (err) {
      // If content script was not injected on that tab yet, inject dynamically
      try {
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ["content/content.js"]
        });
        // Retry message
        await chrome.tabs.sendMessage(tab.id, payload);
      } catch (injectionErr) {
        console.warn("Could not show ads on active tab:", injectionErr);
      }
    }
  } catch (error) {
    console.error("Error triggering ad:", error);
  }
}

// Handle messages from the manager popup and content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "GET_ADS_BATCH") {
    (async () => {
      const settings = await chrome.storage.local.get(null);
      const count = message.count || settings.adBatchCount || 3;
      const ads = await pickMultipleAds(settings, message.pageContext || {}, count);
      sendResponse({
        ads,
        settings: {
          theme: settings.theme || "retro90s",
          soundEnabled: settings.soundEnabled !== false
        }
      });
    })();
    return true;
  }

  if (message.action === "START") {
    (async () => {
      const settings = await chrome.storage.local.get(null);
      await chrome.storage.local.set({ isRunning: true });
      const sec = settings.frequencySeconds || 30;
      await updateAlarm(true, sec / 60);
      // Immediately trigger first batch on active tab upon starting!
      await triggerAdOnActiveTab({ ...settings, isRunning: true });
      sendResponse({ success: true, isRunning: true });
    })();
    return true;
  }

  if (message.action === "STOP") {
    (async () => {
      await chrome.storage.local.set({ isRunning: false });
      await updateAlarm(false);
      sendResponse({ success: true, isRunning: false });
    })();
    return true;
  }

  if (message.action === "TRIGGER_TEST_AD") {
    (async () => {
      const settings = await chrome.storage.local.get(null);
      await triggerAdOnActiveTab(settings);
      sendResponse({ success: true });
    })();
    return true;
  }

  if (message.action === "CLEAR_ALL_ADS") {
    (async () => {
      let totalCleared = 0;
      try {
        const tabs = await chrome.tabs.query({});
        for (const tab of tabs) {
          if (!tab.id) continue;
          if (
            tab.url?.startsWith("chrome://") ||
            tab.url?.startsWith("chrome-extension://") ||
            tab.url?.startsWith("edge://") ||
            tab.url?.startsWith("about:") ||
            tab.url?.startsWith("view-source:")
          ) {
            continue;
          }

          try {
            const res = await chrome.tabs.sendMessage(tab.id, { action: "CLEAR_ALL_ADS" });
            if (res && typeof res.count === "number") {
              totalCleared += res.count;
            }
          } catch (e) {
            // Tab might not have content script running
          }
        }
      } catch (err) {
        console.warn("Error broadcasting CLEAR_ALL_ADS:", err);
      }
      sendResponse({ success: true, count: totalCleared });
    })();
    return true;
  }

  if (message.action === "SETTINGS_UPDATED") {
    (async () => {
      const data = await chrome.storage.local.get(["isRunning", "frequencySeconds", "frequencyMinutes"]);
      if (data.isRunning) {
        const sec = data.frequencySeconds || 30;
        await updateAlarm(true, sec / 60);
      }
      sendResponse({ success: true });
    })();
    return true;
  }
});
