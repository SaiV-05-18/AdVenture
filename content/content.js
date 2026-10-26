/**
 * Content Script: Injects personalized ad pop-ups into any webpage.
 * Uses Shadow DOM to guarantee total CSS isolation from the host page.
 */

// Synthesize audio without external files
function playAdSound(soundType = "chime") {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    if (soundType === "retro_ding") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, ctx.currentTime);
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } else {
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();
      osc1.type = "sine";
      osc2.type = "sine";
      osc1.frequency.setValueAtTime(523.25, ctx.currentTime);
      osc1.frequency.setValueAtTime(659.25, ctx.currentTime + 0.08);
      osc2.frequency.setValueAtTime(1046.50, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);
      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);
      osc1.start();
      osc2.start();
      osc1.stop(ctx.currentTime + 0.45);
      osc2.stop(ctx.currentTime + 0.45);
    }
  } catch (e) {
    // Autoplay restrictions or muted
  }
}

// Extract lightweight page context for ad personalization
function getPageContext() {
  const title = document.title || "";
  const url = window.location.href || "";
  const metaDesc = document.querySelector('meta[name="description"]')?.content || "";
  const h1 = document.querySelector('h1')?.innerText || "";
  const snippet = (metaDesc || h1 || "").slice(0, 200).trim();

  return { title, url, snippet };
}

// Generate the CSS styles for the Shadow DOM
function getShadowStyles(theme = "retro90s") {
  return `
    :host {
      all: initial;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    .ad-container {
      position: fixed;
      z-index: 2147483647; /* Maximum z-index */
      width: 360px;
      max-width: 90vw;
      border-radius: 8px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.4), 0 0 15px rgba(0,0,0,0.2);
      cursor: default;
      user-select: none;
      animation: adPopIn 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    @keyframes adPopIn {
      0% { opacity: 0; transform: scale(0.6) translateY(30px); }
      100% { opacity: 1; transform: scale(1) translateY(0); }
    }

    @keyframes adPopOut {
      0% { opacity: 1; transform: scale(1); }
      100% { opacity: 0; transform: scale(0.7) translateY(20px); }
    }

    /* THEME: RETRO 90s (Windows 95 / Classic Adware) */
    .theme-retro90s {
      background: #c0c0c0;
      border: 3px outset #ffffff;
      font-family: "MS Sans Serif", Tahoma, sans-serif;
      color: #000000;
    }
    .theme-retro90s .ad-header {
      background: linear-gradient(90deg, #000080, #1084d0);
      color: white;
      padding: 4px 6px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      cursor: move;
      font-weight: bold;
      font-size: 13px;
    }
    .theme-retro90s .header-buttons {
      display: flex;
      gap: 3px;
    }
    .theme-retro90s .win-btn {
      background: #c0c0c0;
      border: 2px outset #ffffff;
      color: #000;
      font-weight: bold;
      font-size: 11px;
      width: 18px;
      height: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }
    .theme-retro90s .win-btn:active {
      border: 2px inset #ffffff;
    }
    .theme-retro90s .ad-body {
      padding: 12px;
      background: #dfdfdf;
      margin: 4px;
      border: 2px inset #ffffff;
    }
    .theme-retro90s .badge {
      display: inline-block;
      background: #ffff00;
      color: #ff0000;
      font-weight: 900;
      font-size: 10px;
      padding: 2px 6px;
      border: 1px dashed red;
      animation: blink 0.8s infinite alternate;
      margin-bottom: 8px;
    }
    @keyframes blink {
      0% { opacity: 1; }
      100% { opacity: 0.3; }
    }
    .theme-retro90s .headline {
      font-size: 15px;
      font-weight: bold;
      color: #000080;
      margin-bottom: 6px;
      line-height: 1.25;
    }
    .theme-retro90s .description {
      font-size: 12px;
      color: #333333;
      line-height: 1.4;
      margin-bottom: 12px;
    }
    .theme-retro90s .cta-btn {
      width: 100%;
      background: #c0c0c0;
      border: 2px outset #ffffff;
      font-size: 13px;
      font-weight: bold;
      padding: 7px;
      cursor: pointer;
      color: #000;
      text-transform: uppercase;
    }
    .theme-retro90s .cta-btn:hover {
      background: #d4d4d4;
    }
    .theme-retro90s .cta-btn:active {
      border: 2px inset #ffffff;
    }

    /* THEME: MODERN GLASS / DARK */
    .theme-modern {
      background: rgba(24, 24, 32, 0.96);
      backdrop-filter: blur(16px);
      border: 1px solid rgba(255, 255, 255, 0.15);
      color: #f1f5f9;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 20px rgba(99, 102, 241, 0.25);
    }
    .theme-modern .ad-header {
      padding: 12px 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      cursor: move;
    }
    .theme-modern .header-title {
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: #818cf8;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .theme-modern .close-btn {
      background: rgba(255, 255, 255, 0.08);
      border: none;
      color: #94a3b8;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.15s ease;
      font-size: 14px;
    }
    .theme-modern .close-btn:hover {
      background: rgba(239, 68, 68, 0.2);
      color: #f87171;
    }
    .theme-modern .ad-body {
      padding: 16px;
    }
    .theme-modern .badge {
      display: inline-block;
      background: rgba(99, 102, 241, 0.2);
      color: #a5b4fc;
      border: 1px solid rgba(99, 102, 241, 0.35);
      border-radius: 9999px;
      font-size: 10px;
      font-weight: 700;
      padding: 2px 8px;
      margin-bottom: 10px;
    }
    .theme-modern .headline {
      font-size: 16px;
      font-weight: 700;
      line-height: 1.3;
      margin-bottom: 8px;
      color: #ffffff;
    }
    .theme-modern .description {
      font-size: 13px;
      color: #94a3b8;
      line-height: 1.5;
      margin-bottom: 16px;
    }
    .theme-modern .cta-btn {
      width: 100%;
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      color: white;
      border: none;
      padding: 10px 16px;
      border-radius: 6px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: filter 0.15s ease, transform 0.1s ease;
    }
    .theme-modern .cta-btn:hover {
      filter: brightness(1.15);
      transform: translateY(-1px);
    }

    /* THEME: CYBERPUNK NEON */
    .theme-cyberpunk {
      background: #0d0e15;
      border: 2px solid #00f0ff;
      color: #fce700;
      box-shadow: 0 0 15px rgba(0, 240, 255, 0.4), inset 0 0 10px rgba(0, 240, 255, 0.1);
      font-family: monospace, sans-serif;
    }
    .theme-cyberpunk .ad-header {
      background: #00f0ff;
      color: #0d0e15;
      padding: 6px 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: 900;
      letter-spacing: 1px;
      cursor: move;
    }
    .theme-cyberpunk .close-btn {
      background: #0d0e15;
      color: #ff003c;
      border: 1px solid #ff003c;
      padding: 0 6px;
      font-weight: bold;
      cursor: pointer;
    }
    .theme-cyberpunk .ad-body {
      padding: 14px;
    }
    .theme-cyberpunk .badge {
      display: inline-block;
      background: #ff003c;
      color: #ffffff;
      font-weight: bold;
      font-size: 10px;
      padding: 2px 6px;
      margin-bottom: 8px;
      text-transform: uppercase;
    }
    .theme-cyberpunk .headline {
      font-size: 15px;
      color: #00f0ff;
      margin-bottom: 8px;
      font-weight: bold;
    }
    .theme-cyberpunk .description {
      font-size: 12px;
      color: #e2e8f0;
      line-height: 1.4;
      margin-bottom: 12px;
    }
    .theme-cyberpunk .cta-btn {
      width: 100%;
      background: #fce700;
      color: #0d0e15;
      border: none;
      font-weight: 900;
      padding: 8px;
      cursor: pointer;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    /* Feedback notice */
    .cta-feedback {
      margin-top: 8px;
      font-size: 11px;
      text-align: center;
      padding: 4px;
      border-radius: 4px;
      animation: fadeIn 0.2s ease;
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  `;
}

// Global state for multi-popup management
let globalZIndex = 2147483600;
const activePopups = new Set();
const MAX_CONCURRENT_POPUPS = 16;

const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const SCREEN_ZONES = [
  { side: "top-left", getPos: () => ({ top: `${rand(20, 70)}px`, left: `${rand(20, 60)}px` }) },
  { side: "top-right", getPos: () => ({ top: `${rand(20, 70)}px`, right: `${rand(20, 60)}px` }) },
  { side: "bottom-left", getPos: () => ({ bottom: `${rand(25, 75)}px`, left: `${rand(20, 60)}px` }) },
  { side: "bottom-right", getPos: () => ({ bottom: `${rand(25, 75)}px`, right: `${rand(20, 60)}px` }) },
  { side: "mid-left", getPos: () => ({ top: `${rand(25, 50)}%`, left: `${rand(20, 50)}px` }) },
  { side: "mid-right", getPos: () => ({ top: `${rand(25, 50)}%`, right: `${rand(20, 50)}px` }) },
  { side: "top-center", getPos: () => ({ top: `${rand(20, 60)}px`, left: `${rand(25, 45)}%` }) },
  { side: "bottom-center", getPos: () => ({ bottom: `${rand(25, 65)}px`, left: `${rand(25, 45)}%` }) }
];

// Injected Pop-up Controller
class AdVenturePopup {
  constructor(ad, settings = {}, zone = null) {
    this.ad = ad;
    this.settings = settings;
    this.zone = zone || SCREEN_ZONES[Math.floor(Math.random() * SCREEN_ZONES.length)];
    this.id = `ad-${Date.now()}-${rand(1000, 9999)}`;
    this.host = null;
    this.shadow = null;
    this.container = null;
    this.isDragging = false;
    this.dragOffset = { x: 0, y: 0 };
    this.init();
  }

  init() {
    // Prevent memory leaks by capping maximum open popups
    if (activePopups.size >= MAX_CONCURRENT_POPUPS) {
      const oldest = activePopups.values().next().value;
      if (oldest) oldest.dismiss();
    }

    // Create unique host element with Shadow Root
    this.host = document.createElement("div");
    this.host.id = `adventure-ad-host-${this.id}`;
    this.shadow = this.host.attachShadow({ mode: "open" });

    // Attach styles
    const styleEl = document.createElement("style");
    const theme = this.settings.theme || "retro90s";
    styleEl.textContent = getShadowStyles(theme);
    this.shadow.appendChild(styleEl);

    // Create container
    this.container = document.createElement("div");
    this.container.className = `ad-container theme-${theme}`;
    this.container.style.zIndex = ++globalZIndex;

    // Apply random quadrant / side positioning
    const pos = this.zone.getPos();
    for (const [prop, val] of Object.entries(pos)) {
      this.container.style[prop] = val;
    }

    // Click to bring this specific ad to the front
    this.container.addEventListener("mousedown", () => {
      this.container.style.zIndex = ++globalZIndex;
    });

    // Render HTML inside container
    this.container.innerHTML = this.renderHTML(theme);
    this.shadow.appendChild(this.container);
    document.documentElement.appendChild(this.host);

    activePopups.add(this);

    // Bind event handlers
    this.setupEvents(theme);

    // Play sound if enabled
    if (this.settings.soundEnabled !== false) {
      const soundType = theme === "retro90s" ? "retro_ding" : "chime";
      playAdSound(soundType);
    }
  }

  renderHTML(theme) {
    const { headline, body, cta, badge, emoji = "📢" } = this.ad;

    if (theme === "retro90s") {
      return `
        <div class="ad-header" id="drag-handle">
          <span>${emoji} Special Notice</span>
          <div class="header-buttons">
            <div class="win-btn">_</div>
            <div class="win-btn">□</div>
            <div class="win-btn" id="ad-close-btn">✕</div>
          </div>
        </div>
        <div class="ad-body">
          ${badge ? `<div class="badge">${badge}</div>` : ""}
          <div class="headline">${headline}</div>
          <div class="description">${body}</div>
          <button class="cta-btn" id="ad-cta-btn">${cta || "Claim Offer"}</button>
          <div id="cta-feedback" class="cta-feedback" style="display:none;"></div>
        </div>
      `;
    }

    if (theme === "cyberpunk") {
      return `
        <div class="ad-header" id="drag-handle">
          <span>// AD_STREAM: ${emoji}</span>
          <button class="close-btn" id="ad-close-btn">[X]</button>
        </div>
        <div class="ad-body">
          ${badge ? `<div class="badge">${badge}</div>` : ""}
          <div class="headline">${headline}</div>
          <div class="description">${body}</div>
          <button class="cta-btn" id="ad-cta-btn">${cta || "EXECUTE_DEAL"}</button>
          <div id="cta-feedback" class="cta-feedback" style="display:none;"></div>
        </div>
      `;
    }

    // Default Modern
    return `
      <div class="ad-header" id="drag-handle">
        <div class="header-title">
          <span>${emoji}</span>
          <span>Sponsored Recommendation</span>
        </div>
        <button class="close-btn" id="ad-close-btn" aria-label="Close">✕</button>
      </div>
      <div class="ad-body">
        ${badge ? `<div class="badge">${badge}</div>` : ""}
        <div class="headline">${headline}</div>
        <div class="description">${body}</div>
        <button class="cta-btn" id="ad-cta-btn">${cta || "Learn More"}</button>
        <div id="cta-feedback" class="cta-feedback" style="display:none;"></div>
      </div>
    `;
  }

  setupEvents(theme) {
    const closeBtn = this.shadow.getElementById("ad-close-btn");
    if (closeBtn) {
      closeBtn.addEventListener("click", () => this.dismiss());
    }

    const ctaBtn = this.shadow.getElementById("ad-cta-btn");
    const feedback = this.shadow.getElementById("cta-feedback");
    if (ctaBtn) {
      ctaBtn.addEventListener("click", () => {
        ctaBtn.disabled = true;
        ctaBtn.style.opacity = "0.7";
        if (feedback) {
          const funnyReplies = [
            "🎉 Deal claimed! Delivery arriving in 4-6 business eons.",
            "✅ Offer applied! Your karma increased by 50 points.",
            "📦 Processing request... (just kidding, this is simulated!)",
            "🚀 Confirmed! Added to your imaginary shopping cart."
          ];
          feedback.textContent = funnyReplies[Math.floor(Math.random() * funnyReplies.length)];
          feedback.style.display = "block";
          feedback.style.color = theme === "retro90s" ? "#008000" : "#34d399";
        }
        setTimeout(() => this.dismiss(), 2600);
      });
    }

    // Draggable header logic
    const handle = this.shadow.getElementById("drag-handle");
    if (handle) {
      handle.addEventListener("mousedown", (e) => {
        this.isDragging = true;
        const rect = this.container.getBoundingClientRect();
        this.dragOffset.x = e.clientX - rect.left;
        this.dragOffset.y = e.clientY - rect.top;

        // Switch to top/left positioning for smooth dragging
        this.container.style.right = "auto";
        this.container.style.bottom = "auto";
        this.container.style.left = `${rect.left}px`;
        this.container.style.top = `${rect.top}px`;

        const onMouseMove = (ev) => {
          if (!this.isDragging) return;
          const newX = Math.max(10, Math.min(window.innerWidth - rect.width - 10, ev.clientX - this.dragOffset.x));
          const newY = Math.max(10, Math.min(window.innerHeight - rect.height - 10, ev.clientY - this.dragOffset.y));
          this.container.style.left = `${newX}px`;
          this.container.style.top = `${newY}px`;
        };

        const onMouseUp = () => {
          this.isDragging = false;
          window.removeEventListener("mousemove", onMouseMove);
          window.removeEventListener("mouseup", onMouseUp);
        };

        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);
      });
    }
  }

  dismiss() {
    activePopups.delete(this);
    if (!this.container) return;
    this.container.style.animation = "adPopOut 0.25s forwards";
    setTimeout(() => {
      if (this.host) {
        this.host.remove();
        this.host = null;
      }
    }, 250);
  }
}

// Helper: Spawns a batch of ads across random sides of the active screen
function spawnAdsBurst(ads = [], settings = {}) {
  const adList = Array.isArray(ads) ? ads : [ads];
  if (adList.length === 0) return;

  const shuffledZones = [...SCREEN_ZONES].sort(() => 0.5 - Math.random());

  adList.forEach((ad, idx) => {
    const zone = shuffledZones[idx % shuffledZones.length];
    // Stagger slightly (140ms) for an authentic cascading pop-up swarm!
    setTimeout(() => {
      new AdVenturePopup(ad, settings, zone);
    }, idx * 140);
  });
}

// Foreground Active-Tab Interval Controller
// Drives exact timing (e.g., exactly every 30s) while the tab is active
let foregroundTimer = null;

async function initForegroundTimer() {
  if (foregroundTimer) {
    clearInterval(foregroundTimer);
    foregroundTimer = null;
  }

  // Check state from storage
  let data;
  try {
    data = await chrome.storage.local.get([
      "isRunning",
      "frequencySeconds",
      "frequencyMinutes",
      "adBatchCount",
      "theme",
      "soundEnabled"
    ]);
  } catch (e) {
    return;
  }

  if (!data || !data.isRunning) return;

  const sec = parseInt(data.frequencySeconds) || (data.frequencyMinutes ? Math.round(data.frequencyMinutes * 60) : 30);
  const intervalMs = Math.max(5000, sec * 1000); // minimum 5s to avoid accidental lockup

  foregroundTimer = setInterval(async () => {
    // Only pop up if the user is actively viewing this tab
    if (document.hidden) return;

    try {
      const current = await chrome.storage.local.get([
        "isRunning",
        "adBatchCount",
        "theme",
        "soundEnabled"
      ]);
      if (!current.isRunning) {
        clearInterval(foregroundTimer);
        foregroundTimer = null;
        return;
      }

      const count = parseInt(current.adBatchCount) || 3;
      const pageContext = getPageContext();

      chrome.runtime.sendMessage(
        { action: "GET_ADS_BATCH", count, pageContext },
        (res) => {
          if (chrome.runtime.lastError) return;
          if (res && res.ads && res.ads.length > 0) {
            spawnAdsBurst(res.ads, res.settings || {
              theme: current.theme || "retro90s",
              soundEnabled: current.soundEnabled !== false
            });
          }
        }
      );
    } catch (err) {
      // Tab or context changed
    }
  }, intervalMs);
}

// Start foreground timer on load
initForegroundTimer();

// React immediately when user changes start/stop or frequency settings in the popup
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local") {
    if (
      changes.isRunning ||
      changes.frequencySeconds ||
      changes.frequencyMinutes ||
      changes.adBatchCount
    ) {
      initForegroundTimer();
    }
  }
});

// Restart or check timer when tab becomes visible
document.addEventListener("visibilitychange", () => {
  if (!document.hidden) {
    initForegroundTimer();
  }
});

// Listen for background service worker messages
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "SHOW_ADS") {
    spawnAdsBurst(message.ads, message.settings);
    sendResponse({ success: true, count: message.ads?.length || 0 });
  } else if (message.action === "SHOW_AD") {
    const zone = SCREEN_ZONES[Math.floor(Math.random() * SCREEN_ZONES.length)];
    new AdVenturePopup(message.ad, message.settings, zone);
    sendResponse({ success: true });
  } else if (message.action === "CLEAR_ALL_ADS") {
    let clearedCount = activePopups.size;
    const lingering = document.querySelectorAll('[id^="adventure-ad-host-"]');
    clearedCount = Math.max(clearedCount, lingering.length);

    // Dismiss and remove active popups
    for (const popup of Array.from(activePopups)) {
      try {
        if (popup.host) {
          popup.host.remove();
          popup.host = null;
        }
      } catch (e) {}
    }
    activePopups.clear();

    // Remove any lingering host DOM elements
    lingering.forEach((node) => {
      try {
        node.remove();
      } catch (e) {}
    });

    sendResponse({ success: true, count: clearedCount });
  } else if (message.action === "GET_PAGE_CONTEXT") {
    sendResponse({ context: getPageContext() });
  }
  return true;
});
