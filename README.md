# 📢 AdVenture - Personalized Ad Pop-Up Simulator & Manager

An interactive, customizable browser extension (Manifest V3) that generates personalized, witty, and contextual ad pop-ups as you browse any website. Equipped with a **Manager Dashboard**, an instant **Start/Stop toggle**, topic filters, custom ad creation, and multiple aesthetic styles.

---

## 🚀 Features

- **Periodic Multi-Ad Bursts (Active Tab Ticker)**: Set your batch count and interval (e.g. **5 ads every 30 seconds**). As you browse, exactly 5 ads will pop up simultaneously across random sides of your active tab on every scheduled interval!
- **Granular Interval Speed**: Choose between **10s**, **15s**, **30s**, **1m**, **2m**, or **5m** intervals directly from the header banner or the Settings tab.
- **Multiple Ads Simultaneously & Random Screen Positions**: Ads pop up across different random quadrants and edges of your screen (Top-Left, Top-Right, Bottom-Left, Bottom-Right, Mid-Left, Mid-Right, etc.) with an authentic cascading burst.
- **Batch Count Controller**: Choose how many ads pop up per burst (1, 2, 3, 4, 5, or 7 ads).
- **Master Start / Stop Controller**: Turn the pop-up generator on or off with a single click from the toolbar popup.
- **🧹 One-Click "Clear All Ads on Screen"**: Overwhelmed by a swarm of pop-ups? Head to the **Settings & AI** tab and click **"Clear All Ads on Screen"** to immediately dismiss and wipe every active pop-up from your view in a single click!
- **🎨 Beautified Simple Dark Theme Manager**: A sleek, modern dashboard styled in rich obsidian/slate tones with glowing status badges, custom dark scrollbars, smooth segmented navigation tabs, and tactile controls.
- **Instant Test Trigger (`⚡ Test Burst Now`)**: Fire a batch of ads right away onto random sides of your current tab to preview ads without waiting.
- **Granular Category Manager**: Toggle specific ad topics on or off:
  - 💻 **Developer & Tech Roasts** *(Git force-pushes, CSS despair, 99 open tabs, Rust rewrites)*
  - 🛋️ **Procrastination Enablers** *(Validating your urge to avoid work and watch cat videos)*
  - 🚀 **Absurd Future Tech** *(AI-powered toasters, LiDAR socks, Quantum coffee)*
  - 🧘 **Aggressive Wellness** *(Urgent hydration checks, posture correction, eye blinking)*
  - 💾 **Vintage 90s Adware** *(1,000,000th visitor prizes, free cursor packs, hot single CPUs)*
  - 🧠 **Dynamic Page Context** *(Ads tailored in real time to the title and domain of the page you are viewing)*
- **Custom Ads Creator**: Add your own personalized inside jokes, goals, reminders, or hilarious pitches. Toggle individual custom ads on/off or delete them at any time.
- **Aesthetic Themes**:
  - **Retro 90s (Windows 95)**: Classic beveled gray windows, blue gradient title bars, blinking badges, and retro ding audio.
  - **Modern Dark Glass**: Sleek dark card with glassmorphism blur and indigo gradient button.
  - **Cyberpunk Neon**: Glitchy cyan/yellow terminal styling with retrofuturistic fonts.
- **Draggable & Isolated Pop-ups**: Injected into the page using **Shadow DOM** so it never breaks the webpage layout and cannot be disrupted by host CSS. Click and drag the pop-up header to move it anywhere on your screen.
- **AI Hyper-Personalization (Optional)**: Connect your Gemini API key to have Gemini read the active page context and invent hyper-targeted fake ads on the fly!

---

## 📦 How to Load in Your Browser (30 Seconds)

Compatible with **Google Chrome**, **Brave**, **Microsoft Edge**, **Vivaldi**, and all Chromium-based browsers.

1. Open your browser and navigate to the extensions page:
   - Chrome / Brave: `chrome://extensions`
   - Edge: `edge://extensions`
2. Enable **"Developer mode"** (toggle in the top-right corner).
3. Click the **"Load unpacked"** button in the top-left.
4. Select this directory:
   ```
   /home/SaiV-05-18/Projects/useless1
   ```
5. Pin **AdVenture (📢)** to your toolbar for easy access!

---

## 🧪 Testing Locally

We've included a test article page in `test/demo-page.html`.

1. In your browser, open `file:///home/SaiV-05-18/Projects/useless1/test/demo-page.html` (or any public site like Wikipedia, GitHub, or news sites).
2. Click the **AdVenture icon (📢)** in your browser toolbar.
3. Click **"⚡ Test Burst Now"** to instantly inject a batch of pop-ups across random sides of the active tab.
4. Click **"START GENERATOR"** to begin automatic pop-ups at your chosen frequency (e.g., every 30 seconds or every 1–5 minutes).
5. Open the **"Settings & AI"** tab to:
   - Click **"🧹 Clear All Ads on Screen"** to wipe away all active pop-ups with a single click.
   - Switch pop-up themes (Retro 90s, Modern Dark Glass, Cyberpunk Neon).
   - Configure sound effects and batch size.

---

## 🗂️ Project Structure

```
useless1/
├── manifest.json              # Extension manifest (MV3)
├── background/
│   └── background.js          # Service worker: timers, state management, tab dispatch
├── content/
│   └── content.js             # Shadow-DOM isolated in-page pop-up renderer & drag handler
├── popup/
│   ├── popup.html             # The Manager Dashboard UI
│   ├── popup.css              # Dashboard styling & themes
│   └── popup.js               # Start/stop controller, categories sync, custom ads editor
├── lib/
│   ├── ad-engine.js           # Built-in ad catalog, contextual generator, and Gemini API bridge
│   └── sound.js               # Pure Web Audio API synthesized retro/modern sound effects
├── icons/                     # Generated extension icons (16px, 48px, 128px)
└── test/
    └── demo-page.html         # Test sandbox article page
```
