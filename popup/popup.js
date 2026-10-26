/**
 * Popup Manager Script: Orchestrates dashboard interactions,
 * category toggling, custom ad creation, and start/stop controls.
 */

import { DEFAULT_CATEGORIES } from "../lib/ad-engine.js";

// DOM Elements
const statusPill = document.getElementById("status-pill");
const statusText = document.getElementById("status-text");
const togglePowerBtn = document.getElementById("toggle-power-btn");
const powerBtnLabel = document.getElementById("power-btn-label");
const testAdBtn = document.getElementById("test-ad-btn");

const tabBtns = document.querySelectorAll(".tab-btn");
const tabContents = document.querySelectorAll(".tab-content");

const categoriesList = document.getElementById("categories-list");
const customAdsList = document.getElementById("custom-ads-list");
const customCount = document.getElementById("custom-count");

const openNewAdBtn = document.getElementById("open-new-ad-modal-btn");
const newAdForm = document.getElementById("new-ad-form");
const cancelAdBtn = document.getElementById("cancel-ad-btn");
const saveCustomAdBtn = document.getElementById("save-custom-ad-btn");

const customHeadline = document.getElementById("custom-headline");
const customBody = document.getElementById("custom-body");
const customCta = document.getElementById("custom-cta");
const customEmoji = document.getElementById("custom-emoji");

const settingBatchCount = document.getElementById("setting-batch-count");
const settingBatchCountDetail = document.getElementById("setting-batch-count-detail");
const settingFrequencyQuick = document.getElementById("setting-frequency-quick");
const settingFrequency = document.getElementById("setting-frequency");
const settingSound = document.getElementById("setting-sound");
const settingUseAi = document.getElementById("setting-use-ai");
const aiConfigPanel = document.getElementById("ai-config-panel");
const settingApiKey = document.getElementById("setting-api-key");
const settingUserPersona = document.getElementById("setting-user-persona");

let currentSettings = {};

// Initialize popup on open
document.addEventListener("DOMContentLoaded", async () => {
  currentSettings = await chrome.storage.local.get(null);
  renderStatus(currentSettings.isRunning);
  renderCategories(currentSettings.categories || {});
  renderCustomAds(currentSettings.customAds || []);
  renderSettings(currentSettings);
  setupEventListeners();
});

// Update Start / Stop UI
function renderStatus(isRunning) {
  if (isRunning) {
    statusPill.className = "status-pill running";
    statusText.textContent = "RUNNING";
    togglePowerBtn.className = "power-btn btn-stop";
    togglePowerBtn.querySelector(".power-icon").textContent = "■";
    powerBtnLabel.textContent = "STOP GENERATOR";
  } else {
    statusPill.className = "status-pill stopped";
    statusText.textContent = "STOPPED";
    togglePowerBtn.className = "power-btn btn-start";
    togglePowerBtn.querySelector(".power-icon").textContent = "▶";
    powerBtnLabel.textContent = "START GENERATOR";
  }
}

// Render categories list
function renderCategories(userCategories) {
  categoriesList.innerHTML = "";
  for (const [id, meta] of Object.entries(DEFAULT_CATEGORIES)) {
    const isEnabled = userCategories[id] !== false;

    const row = document.createElement("div");
    row.className = "category-item";
    row.innerHTML = `
      <div class="category-info">
        <span class="category-icon">${meta.icon}</span>
        <div>
          <div class="category-name">${meta.name}</div>
          <div class="category-desc" title="${meta.description}">${meta.description}</div>
        </div>
      </div>
      <label class="switch">
        <input type="checkbox" data-category="${id}" ${isEnabled ? "checked" : ""}>
        <span class="slider"></span>
      </label>
    `;

    const checkbox = row.querySelector("input");
    checkbox.addEventListener("change", async (e) => {
      const updated = { ...(currentSettings.categories || {}) };
      updated[id] = e.target.checked;
      currentSettings.categories = updated;
      await chrome.storage.local.set({ categories: updated });
    });

    categoriesList.appendChild(row);
  }
}

// Render custom ads
function renderCustomAds(ads = []) {
  customCount.textContent = ads.length;
  customAdsList.innerHTML = "";

  if (ads.length === 0) {
    customAdsList.innerHTML = `
      <div style="text-align:center; padding: 20px; color: var(--text-muted); font-size: 11px;">
        No custom ads created yet. Click "+ New Ad" to add your own inside jokes or goals!
      </div>
    `;
    return;
  }

  ads.forEach((ad, index) => {
    const card = document.createElement("div");
    card.className = "custom-ad-card";
    card.innerHTML = `
      <div class="custom-ad-header">
        <span class="custom-ad-headline">${ad.emoji || "📢"} ${escapeHtml(ad.headline)}</span>
        <label class="switch" style="transform: scale(0.8);">
          <input type="checkbox" class="custom-toggle" data-index="${index}" ${ad.enabled !== false ? "checked" : ""}>
          <span class="slider"></span>
        </label>
      </div>
      <div class="custom-ad-body">${escapeHtml(ad.body)}</div>
      <div class="custom-ad-actions">
        <button class="btn-icon delete-custom-btn" data-index="${index}" title="Delete Ad">🗑️ Remove</button>
      </div>
    `;

    // Toggle custom ad active state
    card.querySelector(".custom-toggle").addEventListener("change", async (e) => {
      ads[index].enabled = e.target.checked;
      currentSettings.customAds = ads;
      await chrome.storage.local.set({ customAds: ads });
    });

    // Delete custom ad
    card.querySelector(".delete-custom-btn").addEventListener("click", async () => {
      ads.splice(index, 1);
      currentSettings.customAds = ads;
      await chrome.storage.local.set({ customAds: ads });
      renderCustomAds(ads);
    });

    customAdsList.appendChild(card);
  });
}

// Render Settings inputs
function renderSettings(settings) {
  const batchVal = settings.adBatchCount || 3;
  if (settingBatchCount) settingBatchCount.value = batchVal;
  if (settingBatchCountDetail) settingBatchCountDetail.value = batchVal;

  const sec = settings.frequencySeconds || (settings.frequencyMinutes ? Math.round(settings.frequencyMinutes * 60) : 30);
  if (settingFrequency) settingFrequency.value = sec;
  if (settingFrequencyQuick) settingFrequencyQuick.value = sec;

  if (settings.theme) {
    const radio = document.querySelector(`input[name="theme"][value="${settings.theme}"]`);
    if (radio) radio.checked = true;
  }

  settingSound.checked = settings.soundEnabled !== false;

  settingUseAi.checked = !!settings.useAi;
  aiConfigPanel.style.display = settings.useAi ? "block" : "none";

  if (settings.geminiApiKey) {
    settingApiKey.value = settings.geminiApiKey;
  }
  if (settings.userPersona) {
    settingUserPersona.value = settings.userPersona;
  }
}

// Set up UI interactions
function setupEventListeners() {
  // Master Start / Stop
  togglePowerBtn.addEventListener("click", async () => {
    const nextState = !currentSettings.isRunning;
    const action = nextState ? "START" : "STOP";

    chrome.runtime.sendMessage({ action }, (res) => {
      if (res && res.success) {
        currentSettings.isRunning = res.isRunning;
        renderStatus(res.isRunning);
      }
    });
  });

  // Test Ad Button
  testAdBtn.addEventListener("click", () => {
    testAdBtn.disabled = true;
    const originalText = testAdBtn.innerHTML;
    testAdBtn.innerHTML = "<span>🚀 Injected!</span>";

    chrome.runtime.sendMessage({ action: "TRIGGER_TEST_AD" }, () => {
      setTimeout(() => {
        testAdBtn.disabled = false;
        testAdBtn.innerHTML = originalText;
      }, 1200);
    });
  });

  // Tabs Switching
  tabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      tabBtns.forEach(b => b.classList.remove("active"));
      tabContents.forEach(c => c.classList.remove("active"));

      btn.classList.add("active");
      const target = document.getElementById(btn.dataset.tab);
      if (target) target.classList.add("active");
    });
  });

  // Custom Ad Form Show / Hide
  openNewAdBtn.addEventListener("click", () => {
    newAdForm.style.display = "block";
    customHeadline.focus();
  });

  cancelAdBtn.addEventListener("click", () => {
    newAdForm.style.display = "none";
    clearNewAdForm();
  });

  saveCustomAdBtn.addEventListener("click", async () => {
    const headline = customHeadline.value.trim();
    const body = customBody.value.trim();
    const cta = customCta.value.trim() || "Check It Out";
    const emoji = customEmoji.value.trim() || "📢";

    if (!headline || !body) {
      alert("Please provide both a headline and a pitch for your custom ad!");
      return;
    }

    const newAd = {
      id: `custom-${Date.now()}`,
      headline,
      body,
      cta,
      emoji,
      badge: "CUSTOM AD",
      enabled: true
    };

    const ads = currentSettings.customAds || [];
    ads.unshift(newAd);
    currentSettings.customAds = ads;
    await chrome.storage.local.set({ customAds: ads });

    newAdForm.style.display = "none";
    clearNewAdForm();
    renderCustomAds(ads);
  });

  // Simultaneous Ads Batch Count
  const onBatchChange = async (e) => {
    const val = parseInt(e.target.value) || 3;
    currentSettings.adBatchCount = val;
    if (settingBatchCount) settingBatchCount.value = val;
    if (settingBatchCountDetail) settingBatchCountDetail.value = val;
    await chrome.storage.local.set({ adBatchCount: val });
  };
  if (settingBatchCount) settingBatchCount.addEventListener("change", onBatchChange);
  if (settingBatchCountDetail) settingBatchCountDetail.addEventListener("change", onBatchChange);

  // Frequency Setting (in seconds)
  const onFrequencyChange = async (e) => {
    const sec = parseInt(e.target.value) || 30;
    currentSettings.frequencySeconds = sec;
    currentSettings.frequencyMinutes = sec / 60;
    if (settingFrequency) settingFrequency.value = sec;
    if (settingFrequencyQuick) settingFrequencyQuick.value = sec;
    await chrome.storage.local.set({
      frequencySeconds: sec,
      frequencyMinutes: sec / 60
    });
    chrome.runtime.sendMessage({ action: "SETTINGS_UPDATED" });
  };
  if (settingFrequency) settingFrequency.addEventListener("change", onFrequencyChange);
  if (settingFrequencyQuick) settingFrequencyQuick.addEventListener("change", onFrequencyChange);

  // Theme Setting
  document.querySelectorAll('input[name="theme"]').forEach(radio => {
    radio.addEventListener("change", async (e) => {
      currentSettings.theme = e.target.value;
      await chrome.storage.local.set({ theme: e.target.value });
    });
  });

  // Sound Setting
  settingSound.addEventListener("change", async (e) => {
    currentSettings.soundEnabled = e.target.checked;
    await chrome.storage.local.set({ soundEnabled: e.target.checked });
  });

  // AI Toggle & Inputs
  settingUseAi.addEventListener("change", async (e) => {
    const enabled = e.target.checked;
    currentSettings.useAi = enabled;
    aiConfigPanel.style.display = enabled ? "block" : "none";
    await chrome.storage.local.set({ useAi: enabled });
  });

  settingApiKey.addEventListener("input", async (e) => {
    currentSettings.geminiApiKey = e.target.value.trim();
    await chrome.storage.local.set({ geminiApiKey: currentSettings.geminiApiKey });
  });

  settingUserPersona.addEventListener("input", async (e) => {
    currentSettings.userPersona = e.target.value.trim();
    await chrome.storage.local.set({ userPersona: currentSettings.userPersona });
  });
}

function clearNewAdForm() {
  customHeadline.value = "";
  customBody.value = "";
  customCta.value = "";
  customEmoji.value = "📢";
}

function escapeHtml(str) {
  if (!str) return "";
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
