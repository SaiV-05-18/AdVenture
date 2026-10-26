/**
 * AdVenture - Personalized Ad Pop-Up Engine
 * Handles ad catalogues, context-aware ad synthesizers, and AI generation.
 */

export const DEFAULT_CATEGORIES = {
  dev: {
    id: "dev",
    name: "Developer & Tech Roasts",
    icon: "💻",
    description: "Hilarious ads targeting coders, open tabs, and terminal dwellers.",
    enabled: true
  },
  procrastination: {
    id: "procrastination",
    name: "Procrastination Enablers",
    icon: "🛋️",
    description: "Ads that call you out for avoiding work and doom-scrolling.",
    enabled: true
  },
  future_tech: {
    id: "future_tech",
    name: "Absurd AI & Future Gadgets",
    icon: "🚀",
    description: "Over-engineered Silicon Valley tech parodies.",
    enabled: true
  },
  wellness: {
    id: "wellness",
    name: "Aggressive Wellness",
    icon: "🧘",
    description: "Intense reminders to hydrate, blink, and fix posture.",
    enabled: true
  },
  retro: {
    id: "retro",
    name: "Vintage 90s Adware",
    icon: "💾",
    description: "Nostalgic Y2K flashing banners and 1,000,000th visitor prizes.",
    enabled: true
  },
  contextual: {
    id: "contextual",
    name: "Dynamic Page Context Ads",
    icon: "🧠",
    description: "Ads tailored to the specific webpage title and domain you're on.",
    enabled: true
  }
};

export const BUILTIN_ADS = [
  // Developer & Tech Roasts
  {
    id: "dev-1",
    category: "dev",
    headline: "Stuck on a Bug for 3 Hours?",
    body: "Why fix the bug when you can rewrite the entire codebase in Rust? Guaranteed to take 6 months longer!",
    cta: "Rewrite in Rust",
    badge: "99% OFF",
    emoji: "🦀"
  },
  {
    id: "dev-2",
    category: "dev",
    headline: "Need More RAM For Your 84 Tabs?",
    body: "Download 128GB of organic, cloud-delivered DDR5 RAM directly into your browser cache today!",
    cta: "Download 128GB Free",
    badge: "FREE DOWNLOAD",
    emoji: "💾"
  },
  {
    id: "dev-3",
    category: "dev",
    headline: "Is CSS Giving You Existential Dread?",
    body: "Try our new `!important` Aerosol Spray. One spray centers any div instantly (or breaks your entire layout)!",
    cta: "Order Spray ($19.99)",
    badge: "HOT ITEM",
    emoji: "🎨"
  },
  {
    id: "dev-4",
    category: "dev",
    headline: "Git Merge Conflict Got You Down?",
    body: "Skip the conflict resolution. Run `git push --force` and blame the intern. Life is too short for rebase.",
    cta: "Learn Pro Git Hacks",
    badge: "DANGEROUS TIP",
    emoji: "🔥"
  },

  // Procrastination Enablers
  {
    id: "proc-1",
    category: "procrastination",
    headline: "You're Doing Great Pretending to Work!",
    body: "Those 14 tabs you just opened? Vital research. Don't let your boss or conscience tell you otherwise.",
    cta: "Open 10 More Tabs",
    badge: "CONFIRMED VALID",
    emoji: "👀"
  },
  {
    id: "proc-2",
    category: "procrastination",
    headline: "Why Finish Today When Tomorrow Exists?",
    body: "Procrastination isn't laziness—it's waiting for panic-induced inspiration to strike at 2:00 AM.",
    cta: "Watch Cat Video",
    badge: "LIFE HACK",
    emoji: "🐱"
  },
  {
    id: "proc-3",
    category: "procrastination",
    headline: "URGENT: Research Deep Dive Needed",
    body: "Did you know that mantis shrimp have 16 color receptors? Stop your project immediately and look this up.",
    cta: "Fall Down Rabbit Hole",
    badge: "CRUCIAL TRIVIA",
    emoji: "🦐"
  },

  // Absurd AI & Future Gadgets
  {
    id: "tech-1",
    category: "future_tech",
    headline: "Introducing: The AI Toaster™",
    body: "Leverages a 70B parameter multimodal model to predict your toast crunchiness preferences using facial recognition.",
    cta: "Pre-order for $4,999",
    badge: "AI POWERED",
    emoji: "🍞"
  },
  {
    id: "tech-2",
    category: "future_tech",
    headline: "Smart Socks with LiDAR Sensor",
    body: "Never stub your toe again. Features real-time obstacle avoidance and alerts your smart fridge automatically.",
    cta: "Claim Kickstarter Tier",
    badge: "INNOVATION",
    emoji: "🧦"
  },
  {
    id: "tech-3",
    category: "future_tech",
    headline: "Quantum Coffee Mug",
    body: "Your coffee is simultaneously scalding hot and ice cold until you look at it. Physics-certified refreshment.",
    cta: "Observe Quantum Sip",
    badge: "SCHRODINGER ED.",
    emoji: "☕"
  },

  // Aggressive Wellness
  {
    id: "well-1",
    category: "wellness",
    headline: "HYDRATE OR FACE THE CONSEQUENCES",
    body: "Your cells are screaming. You are 70% water, but right now you're feeling like a dried prune. Drink a glass NOW.",
    cta: "I Drank Water!",
    badge: "HEALTH ALERT",
    emoji: "💧"
  },
  {
    id: "well-2",
    category: "wellness",
    headline: "Your Posture Looks Like A Cooked Shrimp",
    body: "Unclench your jaw. Drop your shoulders away from your ears. Sit up straight before your spine files a complaint.",
    cta: "Posture Corrected",
    badge: "ALIGNMENT",
    emoji: "🦐"
  },
  {
    id: "well-3",
    category: "wellness",
    headline: "BLINK! YOUR EYES ARE BEGGING YOU",
    body: "You've been staring at backlit pixels without blinking for 8 minutes straight. Give your corneas a break.",
    cta: "Blink 5 Times",
    badge: "VISION CHECK",
    emoji: "👁️"
  },

  // Vintage 90s Adware
  {
    id: "retro-1",
    category: "retro",
    headline: "★★★ CONGRATULATIONS VISITOR #1,000,000 ★★★",
    body: "You have been chosen! Click below to claim your Brand New Flat Screen CRT Monitor and 500 Free AOL Hours!",
    cta: ">>> CLAIM PRIZE NOW <<<",
    badge: "WINNER!!",
    emoji: "🎉"
  },
  {
    id: "retro-2",
    category: "retro",
    headline: "DOWNLOAD FREE 3D CURSORS & SMILEYS",
    body: "Make your pointer a flaming skull or a spinning globe! 100% Virus-Free (mostly). Compatible with Windows 98/ME.",
    cta: "Download CursorPack.exe",
    badge: "TOP DOWNLOAD",
    emoji: "⭐"
  },
  {
    id: "retro-3",
    category: "retro",
    headline: "HOT SINGLE CPUs IN YOUR AREA!",
    body: "Fast, overclocked, and ready to calculate floating-point operations tonight. No heatsink required!",
    cta: "Meet Overclocked CPUs",
    badge: "EXCLUSIVE",
    emoji: "🔥"
  }
];

/**
 * Generate a dynamic context-aware ad from webpage metadata
 */
export function generateContextualAd(pageContext = {}) {
  const { title = "this webpage", url = "https://example.com" } = pageContext;
  let domain = "this site";
  try {
    domain = new URL(url).hostname.replace(/^www\./, "");
  } catch (e) {
    domain = "this site";
  }

  const cleanTitle = title.length > 40 ? title.substring(0, 37) + "..." : title;

  const templates = [
    {
      headline: `Tired of browsing ${domain}?`,
      body: `Instead of reading "${cleanTitle}", our experts recommend napping. Studies show naps increase happiness by 400%!`,
      cta: "Schedule Instant Nap",
      badge: "RECOMMENDED",
      emoji: "😴"
    },
    {
      headline: `Is ${domain} too thrilling?`,
      body: `Balance the excitement of "${cleanTitle}" with our premium lukewarm herbal chamomile tea. Zero caffeine, 100% cozy.`,
      cta: "Order Lukewarm Tea",
      badge: "SPONSORED",
      emoji: "🍵"
    },
    {
      headline: `VIP Offer for ${domain} Visitors!`,
      body: `Only high-IQ web navigators explore "${cleanTitle}". Unlock your honorary degree in Web Surfing Sciences!`,
      cta: "Print Diploma",
      badge: "VIP EXCLUSIVE",
      emoji: "🎓"
    },
    {
      headline: `Attention ${domain} Reader:`,
      body: `You have consumed 4,200 words on "${cleanTitle}". Give your brain a reward: gaze at a houseplant for 60 seconds.`,
      cta: "Find A Plant",
      badge: "COGNITIVE REST",
      emoji: "🪴"
    }
  ];

  const picked = templates[Math.floor(Math.random() * templates.length)];
  return {
    id: `contextual-${Date.now()}`,
    category: "contextual",
    ...picked
  };
}

/**
 * Call the Gemini API if an API key is configured to generate a hyper-personalized ad
 */
export async function generateAIAd(apiKey, pageContext = {}, userPersona = "") {
  if (!apiKey) return null;

  const prompt = `You are a humorous, witty personalized ad pop-up generator.
The user is currently browsing a webpage with:
- Title: "${pageContext.title || 'Unknown'}"
- URL / Domain: "${pageContext.url || 'Unknown'}"
- Page Keywords/Snippet: "${pageContext.snippet || ''}"
${userPersona ? `- User Interests/Persona: "${userPersona}"` : ''}

Generate a single satirical, hyper-targeted fake advertisement or friendly callout that playfully references the current page content.
Respond ONLY with a valid JSON object with these exact keys:
{
  "headline": "Short punchy hook (under 8 words)",
  "body": "Witty, humorous pitch (under 25 words)",
  "cta": "Funny call-to-action button text (under 4 words)",
  "badge": "Short badge tag (e.g. 'SPONSORED', 'FLASH DEAL', 'URGENT', 'AI SUGGESTION')",
  "emoji": "Single relevant emoji"
}`;

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.9
          }
        })
      }
    );

    if (!res.ok) {
      console.warn("Gemini API request failed:", res.status, res.statusText);
      return null;
    }

    const data = await res.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (text) {
      const parsed = JSON.parse(text);
      return {
        id: `ai-${Date.now()}`,
        category: "ai",
        ...parsed
      };
    }
  } catch (err) {
    console.warn("AI generation failed, falling back to local engine:", err);
  }
  return null;
}

/**
 * Pick the best ad based on enabled categories, custom ads, and page context
 */
export async function pickNextAd(settings = {}, pageContext = {}) {
  const {
    categories = {},
    customAds = [],
    geminiApiKey = "",
    useAi = false,
    userPersona = ""
  } = settings;

  // 1. If AI mode is enabled and API key exists, try AI generation (50% probability to balance speed & cost)
  if (useAi && geminiApiKey && Math.random() < 0.6) {
    const aiAd = await generateAIAd(geminiApiKey, pageContext, userPersona);
    if (aiAd) return aiAd;
  }

  // 2. Build candidate pool
  let pool = [];

  // Add custom ads if enabled
  if (Array.isArray(customAds) && customAds.length > 0) {
    const activeCustom = customAds.filter(ad => ad.enabled !== false);
    pool.push(...activeCustom);
  }

  // Add enabled built-in ads
  const enabledCategoryIds = Object.keys(DEFAULT_CATEGORIES).filter(
    catId => categories[catId] !== false
  );

  const activeBuiltin = BUILTIN_ADS.filter(ad => enabledCategoryIds.includes(ad.category));
  pool.push(...activeBuiltin);

  // If contextual is enabled, optionally generate a fresh contextual ad
  if (categories["contextual"] !== false && Math.random() < 0.4) {
    return generateContextualAd(pageContext);
  }

  if (pool.length === 0) {
    // Ultimate fallback if user disabled everything
    return generateContextualAd(pageContext);
  }

  const chosen = pool[Math.floor(Math.random() * pool.length)];
  return chosen;
}

/**
 * Pick multiple distinct ads for batch / simultaneous popping up
 */
export async function pickMultipleAds(settings = {}, pageContext = {}, count = 3) {
  const desiredCount = Math.max(1, Math.min(10, parseInt(count) || 1));
  const {
    categories = {},
    customAds = [],
    geminiApiKey = "",
    useAi = false,
    userPersona = ""
  } = settings;

  let pool = [];

  // Add custom ads
  if (Array.isArray(customAds) && customAds.length > 0) {
    const activeCustom = customAds.filter(ad => ad.enabled !== false);
    pool.push(...activeCustom);
  }

  // Add enabled built-in ads
  const enabledCategoryIds = Object.keys(DEFAULT_CATEGORIES).filter(
    catId => categories[catId] !== false
  );
  const activeBuiltin = BUILTIN_ADS.filter(ad => enabledCategoryIds.includes(ad.category));
  pool.push(...activeBuiltin);

  // Fallback if empty
  if (pool.length === 0) {
    pool.push(generateContextualAd(pageContext));
  }

  // Shuffle pool copy
  let shuffled = [...pool].sort(() => 0.5 - Math.random());
  let results = [];

  // 1. AI ad if enabled
  if (useAi && geminiApiKey) {
    try {
      const aiAd = await generateAIAd(geminiApiKey, pageContext, userPersona);
      if (aiAd) results.push(aiAd);
    } catch (e) {
      // ignore
    }
  }

  // 2. Add contextual ad if enabled
  if (categories["contextual"] !== false && results.length < desiredCount) {
    results.push(generateContextualAd(pageContext));
  }

  // 3. Fill the rest from shuffled pool (without immediate duplicates)
  let poolIdx = 0;
  while (results.length < desiredCount) {
    if (poolIdx < shuffled.length) {
      const candidate = shuffled[poolIdx++];
      if (!results.some(r => r.id === candidate.id)) {
        results.push(candidate);
      }
    } else {
      // If pool exhausted, add contextual variations or repeat with distinct instance id
      const extra = generateContextualAd(pageContext);
      extra.id = `batch-${Date.now()}-${results.length}`;
      results.push(extra);
    }
  }

  return results;
}

