# Claude Code Implementation Brief — আর-রিসালাহ

> **এই ফাইলটি Claude Code Agent-এর জন্য।** পড়ার পর `CLAUDE.md` হিসেবে প্রজেক্ট রুটে রাখুন।

---

## ০. তোমার স্বাধীনতা

এই ব্রিফটি **দিকনির্দেশনা, কারাগার নয়।** আমি লাইভ সাইট দেখতে পাই না, তুমি পারো। কোনো সিদ্ধান্ত বাস্তবে কাজ না করলে বদলাও—শুধু কেন বদলালে তা `DECISIONS.md`-এ লিখে রাখো।

তবে চারটি বিষয় অপরিবর্তনীয়:
1. **মোবাইল-ফার্স্ট, দ্রুত।** পারফরম্যান্স বাজেট আলোচনাসাপেক্ষ নয়।
2. **ডিজাইনের স্বাক্ষর—মাত্রা-রুল ও রুবরিক।** এটি এই সাইটের পরিচয়।
3. **কনটেন্টে কোনো placeholder, lorem ipsum, demo, sample শব্দ নয়।**
4. **অ্যাক্সেসিবিলিটি ফ্লোর।** ফোকাস রিং, কনট্রাস্ট, কীবোর্ড—কখনো বাদ নয়।

---

## ১. স্ট্যাক

```
Astro 5              — static site generator, islands architecture
Content Collections  — MDX + Zod schema
Tailwind CSS v4      — CSS-first config, @theme দিয়ে টোকেন
Pagefind             — static search index (build-time)
Sharp                — ছবি অপ্টিমাইজেশন (astro:assets)
GitHub → Cloudflare Pages
```

**যা ব্যবহার করবে না:** React (দরকার নেই), কোনো UI লাইব্রেরি, কোনো অ্যানিমেশন লাইব্রেরি, Google Fonts CDN, কোনো তৃতীয়-পক্ষ ট্র্যাকিং স্ক্রিপ্ট।

**JavaScript কেবল তিন জায়গায়:** মোবাইল মেনু, খোঁজ, পাঠ-অগ্রগতি রেখা। তিনটিই vanilla, ইনলাইন, ~৩kb-এর মধ্যে।

---

## ২. ফোল্ডার কাঠামো

```
ar-risalah/
├── src/
│   ├── content/
│   │   ├── config.ts               # Zod schema
│   │   ├── articles/               # ১৪টি .mdx (এই প্যাকেজে দেওয়া)
│   │   ├── authors/                # ৫টি .md
│   │   ├── resources/              # a11y রিসোর্স এন্ট্রি
│   │   ├── glossary/
│   │   └── announcements/
│   ├── components/
│   │   ├── layout/    Header, Footer, MobileBar, SkipLink
│   │   ├── cards/     ArticleCard, ResourceCard, AuthorCard, TopicCard
│   │   ├── article/   Ayah, PullQuote, KeyTakeaways, ResearchLayer,
│   │   │              References, TOC, ReadingProgress, ShareRow
│   │   └── forms/     SubscribeInline, SubscribeSection, ContactForm
│   ├── layouts/       Base.astro, Article.astro, Archive.astro
│   ├── pages/         (সাইটম্যাপ অনুযায়ী)
│   ├── styles/        tokens.css, base.css, bangla.css
│   └── lib/           toBn.ts, readingTime.ts, related.ts, dates.ts
├── public/
│   ├── fonts/                      # self-hosted WOFF2
│   └── og/                         # OG ছবি
├── CLAUDE.md
└── DECISIONS.md
```

---

## ৩. নির্মাণের ক্রম

কাজটি এই ক্রমে করো। প্রতিটি ধাপ শেষে Playwright দিয়ে মোবাইল (৩৯০px) ও ডেস্কটপ (১৪৪০px) স্ক্রিনশট নিয়ে নিজে যাচাই করো।

**ধাপ ১ — ভিত্তি**
Astro + Tailwind v4 সেটআপ। `tokens.css`-এ ডিজাইন সিস্টেমের সব টোকেন (`03-design-system.md` দেখো)। ফন্ট self-host করো: Tiro Bangla, Noto Serif Bengali, Anek Bangla, Amiri, Newsreader, Inter। বাংলা + ল্যাটিন সাবসেট, WOFF2, `font-display: swap`, দুটি ক্রিটিক্যাল ফন্ট preload।

**ধাপ ২ — টাইপোগ্রাফি যাচাই**
এটি আলাদা ধাপ হিসেবে করো, কারণ বাংলা রেন্ডারিং-ই এখানে সবচেয়ে বড় ঝুঁকি। একটি টেস্ট পাতায় যাচাই করো:
- যুক্তাক্ষর ঠিকমতো রেন্ডার হচ্ছে (ক্ষ, জ্ঞ, ঙ্গ, ত্র, দ্ধ, ষ্ণ)
- মাত্রা অটুট, কোনো letter-spacing প্রয়োগ হয়নি
- আরবি টেক্সট RTL-এ ঠিক, হরকত কাটা যাচ্ছে না
- বাংলা ও আরবি একই লাইনে মিশলে বেসলাইন ঠিক
- ৩২০px প্রস্থে দীর্ঘ শব্দ ওভারফ্লো করছে না

সমস্যা পেলে ফন্ট বদলাও—Hind Siliguri বা Baloo Da 2 বিকল্প। **রেন্ডারিংয়ের নির্ভুলতা নান্দনিক পছন্দের চেয়ে অগ্রাধিকার পাবে।**

**ধাপ ৩ — কনটেন্ট স্কিমা ও ডেটা**
`config.ts`-এ Zod schema (`02-information-architecture.md`-এ দেওয়া)। ১৪টি প্রবন্ধ ও ৫টি লেখক ফাইল বসাও। `astro build` চালিয়ে নিশ্চিত করো সব ভ্যালিডেট হচ্ছে।

**ধাপ ৪ — একক প্রবন্ধ পাতা**
এটি সবচেয়ে গুরুত্বপূর্ণ পাতা—তাই প্রথমে। সব কম্পোনেন্ট এখানেই জন্ম নেবে। মোবাইলে নিখুঁত না হওয়া পর্যন্ত পরের ধাপে যেয়ো না।

**ধাপ ৫ — হেডার, ফুটার, মোবাইল বার**

**ধাপ ৬ — হোমপেজ**

**ধাপ ৭ — আর্কাইভ পাতা** (articles, categories, topics, authors, research, resources)

**ধাপ ৮ — স্থির পাতা** (about, contact, start-here, for-khateebs, privacy, terms, 404)

**ধাপ ৯ — খোঁজ (Pagefind)**
বাংলা ইনডেক্সিং যাচাই করো। "যৌতুক", "শাশুড়ি", "আখলাক" লিখে ফল আসছে কি না দেখো। না এলে Fuse.js দিয়ে `searchKeywords[]` ভিত্তিক বিকল্প বানাও।

**ধাপ ১০ — লোগো ও ভিজ্যুয়াল অ্যাসেট** (নিচে বিস্তারিত)

**ধাপ ১১ — SEO, RSS, sitemap, OG ছবি**

**ধাপ ১২ — চূড়ান্ত অডিট** (নিচে চেকলিস্ট)

---

## ৪. ভিজ্যুয়াল অ্যাসেট — Magnific ব্যবহার

Magnific MCP কানেক্টেড। ব্যবহারের নিয়ম:

**কভার ছবি।** প্রতিটি প্রবন্ধের frontmatter-এ `cover.prompt` দেওয়া আছে। সেগুলো দিয়ে `images_generate` চালাও, ৩:২ অনুপাতে। তারপর ডাউনলোড করে `src/assets/covers/`-এ রাখো এবং `astro:assets` দিয়ে AVIF + WebP তৈরি করো। প্রতিটি ৭০kb-এর নিচে রাখো।

**ঐক্যের শর্ত।** সব কভার একই পরিবারভুক্ত মনে হতে হবে। প্রতিটি প্রম্পটের শেষে যোগ করো: `muted desaturated palette, warm olive-cream and deep charcoal tones, single soft directional light, no people, no faces, no animals, no legible text, editorial minimalism`। তারপর CSS ফিল্টার লেয়ার (ডিজাইন সিস্টেমে দেওয়া) প্রয়োগ করো।

**প্রথমে তিনটি বানাও, পাশাপাশি দেখো।** একসঙ্গে দেখতে অসংগত লাগলে প্রম্পট সংশোধন করে তারপর বাকিগুলো।

**যা কখনো বানাবে না:** মানুষ বা প্রাণীর প্রতিকৃতি, মসজিদ-গম্বুজ-মিনারের ক্লিশে, চাঁদ-তারা, সবুজ-সোনালি গ্রেডিয়েন্ট, ঝুলন্ত লণ্ঠন, AI-দিয়ে-লেখা আরবি ক্যালিগ্রাফি (প্রায় সবসময় অর্থহীন অক্ষর তৈরি হয়—কখনো ব্যবহার করবে না)।

**OG ছবি।** প্রতি প্রবন্ধের জন্য build-time-এ তৈরি করো (`satori` বা Astro-র OG ইন্টিগ্রেশন): কাগজের পটভূমি, মাত্রা-রুল, শিরোনাম, ক্যাটাগরি, "আর-রিসালাহ"। ছবি নয়—টাইপোগ্রাফিক। হোয়াটসঅ্যাপ প্রিভিউতে এটিই দেখা যাবে, তাই শিরোনাম বড় ও পাঠযোগ্য হতে হবে।

---

## ৫. লোগো

Magnific দিয়ে র‍্যাস্টার লোগো বানাবে না। **SVG-তে হাতে বানাও** (অথবা ফন্ট থেকে path নিয়ে)।

**গঠন:**
```
  ─────────────────────────      ← মাত্রা, শব্দচিহ্নের ওপরে বর্ধিত
   আর-রিসালাহ                    ← Tiro Bangla, medium weight
        الرسالة                   ← Amiri, ছোট, নিচে কেন্দ্রে
```

**ধারণা:** বাংলা "আ"-এর মাত্রাটি বাড়িয়ে পুরো শব্দচিহ্নের ওপর দিয়ে টেনে নাও। এটি সাইটের মাত্রা-রুলের বড় সংস্করণ—লোগো ও লেআউট একই ভাষা বলবে।

**শর্ত:** কেবল টাইপোগ্রাফিক, কোনো চিত্রকল্প নয়। এক রঙে কাজ করবে। ২৪px উচ্চতায় পাঠযোগ্য। হালকা ও গাঢ় দুই সংস্করণ। ফেভিকন: বর্গক্ষেত্রে কেবল "রি" যুক্তাক্ষর, মাত্রাসহ।

তিনটি বিকল্প বানিয়ে স্ক্রিনশট নাও, তারপর সবচেয়ে সংযতটি বেছে নাও।

---

## ৬. মূল কম্পোনেন্টের বিবরণ

### ArticleCard
```
<article>
  <div class="matra"></div>              ← 1px --rule, হোভারে --ink
  <p class="eyebrow">ক্যাটাগরি</p>       ← --rubric, --font-ui, --step--1
  <h3><a>শিরোনাম</a></h3>                ← --font-display, --step-1
  <p class="excerpt">…</p>               ← ২ লাইন ক্ল্যাম্প, --ink-soft
  <p class="meta">১২ মিনিট · লেখক</p>    ← --ink-faint
</article>
```
সম্পূর্ণ কার্ড ক্লিকযোগ্য `::after` overlay দিয়ে, কিন্তু ফোকাস-রিং শিরোনামে। বক্স-শ্যাডো নেই, চারদিকে বর্ডার নেই, transform নেই।

### Ayah
```astro
<figure class="ayah">
  <p lang="ar" dir="rtl" class="arabic">{arabic}</p>
  <p class="translation">{bangla}</p>
  <figcaption>— {source}</figcaption>
</figure>
```
বাম দিকে ২px `--rubric` রেখা, `--paper-deep` পটভূমি। মোবাইলে আরবি `--step-1`।

### ResearchLayer
```astro
<details class="research-layer">
  <summary>
    <span>গবেষণা স্তর: গভীরে যেতে চাইলে</span>
    <span class="est">আনুমানিক ১৫ মিনিট</span>
  </summary>
  <div><slot /></div>
</details>
```
শূন্য JavaScript। বন্ধ অবস্থায় চারদিকে ১px বর্ডার (একমাত্র ব্যতিক্রম), খোলা অবস্থায় বাম দিকে ২px রেখা।

### ReadingProgress
`scroll` ইভেন্টে `requestAnimationFrame`-throttled, উপরে ২px রুবরিক রেখার প্রস্থ বদলায়। `prefers-reduced-motion` হলে instant। ~০.৪kb।

### ShareRow
হোয়াটসঅ্যাপ প্রথমে। শিরোনাম ও লিংক আগে থেকে বসানো:
```
https://wa.me/?text={encodeURIComponent(title + '\n\n' + url)}
```

### MobileBar
নিচে fixed, তিনটি আইটেম, প্রতিটি ন্যূনতম ৪৪px উঁচু, `env(safe-area-inset-bottom)` সম্মান করে। স্ক্রল করলে লুকায় না—সবসময় দৃশ্যমান।

---

## ৭. ইউটিলিটি

```ts
// toBn.ts — বাংলা সংখ্যা
const bn = ['০','১','২','৩','৪','৫','৬','৭','৮','৯'];
export const toBn = (n: number|string) =>
  String(n).replace(/\d/g, d => bn[+d]);

// dates.ts — বাংলা তারিখ: "৬ আগস্ট ২০২৬"
// readingTime.ts — বাংলা শব্দ গণনা; ~১৮০ শব্দ/মিনিট ধরো
//   (ল্যাটিনের ২৩৮ নয়—বাংলা পড়া ধীর, বিশেষত মোবাইলে)
// related.ts — IA ডকে দেওয়া চার-স্তরের যুক্তি,
//   চতুর্থ নিয়মটি (আখলাক↔চিন্তা সেতু) অবশ্যই বাস্তবায়ন করবে
```

---

## ৮. SEO

- প্রতিটি প্রবন্ধে `Article` JSON-LD: headline, author, datePublished, image, inLanguage: "bn"
- একক পাতায় `BreadcrumbList`
- হোমপেজে `Organization` + `WebSite` (SearchAction সহ)
- ক্যানোনিকাল URL সর্বত্র
- `<html lang="bn">`; আরবি অংশে `lang="ar" dir="rtl"`
- মেটা description = excerpt (১৬০ অক্ষরের মধ্যে ছাঁটাই)
- `/rss.xml` — সম্পূর্ণ কনটেন্ট নয়, excerpt + লিংক
- `/sitemap-index.xml` — `@astrojs/sitemap`

---

## ৯. পারফরম্যান্স বাজেট (কঠোর)

| পরিমাপ | সীমা |
|---|---|
| LCP (মোবাইল, 4G) | < ২.৫s |
| CLS | < ০.১ |
| JS (যেকোনো পাতা) | < ২৫kb |
| ফন্ট মোট | < ১৮০kb |
| যেকোনো কভার ছবি | < ১২০kb |
| Lighthouse মোবাইল (চারটি) | ≥ ৯০ |

Lighthouse চালিয়ে ফল `DECISIONS.md`-এ লিখে রাখো। বাজেট ছাড়ালে ফিচার কাটো, বাজেট বাড়িয়ো না।

---

## ১০. চূড়ান্ত অডিট চেকলিস্ট

Playwright দিয়ে স্ক্রিনশট নিয়ে প্রতিটি যাচাই করো:

**রেন্ডারিং**
- [ ] ৩২০px, ৩৯০px, ৭৬৮px, ১০২৪px, ১৪৪০px — কোনো অনুভূমিক স্ক্রল নেই
- [ ] সব যুক্তাক্ষর সঠিক; মাত্রা অটুট
- [ ] আরবি RTL সঠিক, হরকত কাটা যায়নি
- [ ] দীর্ঘ শিরোনাম কার্ড ভাঙছে না

**অ্যাক্সেসিবিলিটি**
- [ ] Tab দিয়ে পুরো সাইট নেভিগেট করা যায়
- [ ] প্রতিটি ফোকাসযোগ্য উপাদানে দৃশ্যমান রিং
- [ ] স্কিপ-লিংক কাজ করে
- [ ] শিরোনামের ক্রম H1→H2→H3, কোনো লাফ নেই
- [ ] সব ছবিতে যথাযথ alt
- [ ] ফর্মে দৃশ্যমান label
- [ ] মোবাইল মেনুতে ফোকাস-ট্র্যাপ ও Esc

**কনটেন্ট**
- [ ] কোথাও "demo", "sample", "placeholder", "lorem" নেই
- [ ] সব সংখ্যা বাংলায় (URL ও ইংরেজি রেফারেন্স ছাড়া)
- [ ] প্রতিটি প্রবন্ধে references ও academicResources দৃশ্যমান
- [ ] ৪০৪ ও খালি খোঁজের বার্তা ডিজাইন সিস্টেমের ভয়েস অনুযায়ী

**কার্যকারিতা**
- [ ] খোঁজ বাংলা শব্দে ফল দেয়
- [ ] শেয়ার লিংক হোয়াটসঅ্যাপে সঠিক প্রিভিউ দেখায়
- [ ] `<details>` JavaScript বন্ধ থাকলেও কাজ করে
- [ ] JavaScript সম্পূর্ণ বন্ধ করে সাইট পড়া যায়

**নকশা**
- [ ] মাত্রা-রুল সর্বত্র ধারাবাহিক
- [ ] রুবরিক রঙ কেবল তিন জায়গায় (আইব্রাউ, বিভাজক, রেফারেন্স সংখ্যা)
- [ ] কোনো box-shadow, কোনো ৪px-এর বেশি radius, কোনো গ্রেডিয়েন্ট
- [ ] `prefers-reduced-motion` সম্মানিত

---

## ১১. যা তুমি সিদ্ধান্ত নেবে

এগুলোতে আমি ইচ্ছাকৃতভাবে নির্দেশ দিইনি:

- Tailwind v4-এর `@theme` না আলাদা `tokens.css`—যেটি পরিষ্কার লাগে
- ফর্ম ব্যাকএন্ড (Buttondown / Cloudflare Worker / অন্য)
- ঠিক কোন ফন্ট weight ও সাবসেট রাখবে
- আর্কাইভে pagination না "আরও দেখুন"
- বিষয়-হাবের সঠিক লেআউট
- ক্যাটাগরির URL slug-এর প্রতিবর্ণীকরণ (আমার প্রস্তাব IA ডকে আছে, বদলাতে পারো)

সিদ্ধান্ত নিয়ে `DECISIONS.md`-এ এক লাইনে কারণ লিখে রাখো।

---

## ১২. প্রথম কমিটের আগে

```bash
npm run build          # কোনো warning ছাড়া পাস করতে হবে
npx astro check        # টাইপ ত্রুটি নেই
npx lighthouse --preset=desktop  # এবং mobile
```

`README.md`-এ লিখে রাখো: কীভাবে নতুন প্রবন্ধ যোগ করতে হয় (frontmatter সহ একটি উদাহরণ), কীভাবে ছবি যোগ করতে হয়, কীভাবে ডিপ্লয় হয়।

এটি গুরুত্বপূর্ণ—কারণ ভবিষ্যতে যাঁরা লিখবেন, তাঁরা ডেভেলপার নন।
