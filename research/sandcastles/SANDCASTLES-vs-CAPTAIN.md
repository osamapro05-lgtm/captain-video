# Sandcastles AI → what CAPTAIN should take

Sources: 4 videos in `videos/` (watched as frames in `frames/` + transcripts), sandcastles.ai home, /collections, /mcp. Date: 2026-11-14.

## 1. What Sandcastles is

A data layer for short-form content (IG Reels, TikTok, YT Shorts) plus an MCP that pipes that data into Claude. The person behind it (Callaway) says it plainly: *without performance data Claude just guesses → slop.*

| Area | What it does |
|---|---|
| **Channels / Watchlists** | Track competitors per niche ("Tech: 18 channels"). ~hundreds of thousands pre-indexed; paste a URL to import anyone. Find similar channels with one click. |
| **Videos feed** | All watchlist posts. Filters: watchlist, channel, posted date (last 30/60 d), platform, outlier score, views, **engagement rate ≥ 0.5 % (drops paid brand deals)**. Sort by outlier (favors small channels), views (big proven winners), or date. |
| **Outlier score** | Views ÷ the creator's usual (e.g. "10.2× his usual"). |
| **Breakdown** | Per video: transcript (with sections), hook, story structure, format, editing style, "why it worked". |
| **The 7 variables** | Topic · Angle · Hook (spoken + visual) · Story style · Visual format · Visuals · Audio. Keep some, swap some = a new video. |
| **Vault** | "Add to vault" on any video → save **hook** (first N sentences, auto-turned into a Mad-Lib template) and/or **style** (whole transcript, used as a rhythm/structure lens). Can add your own manually. |
| **Scripts** | Topic+angle → research report (editable, with sources) → pick hook template (generates 2 per click) → pick style → script. Google-doc editor, highlight-to-edit, length slider (60 s ≈ 240 words), version diff. |
| **Collections** | Curated library: ~40 **Formats** (Listicle, A vs B, Case Study, Hero's Journey, Tier List, Q&A, Problem/Solution, Day in the Life, Common Mistake…) and ~30 **Editing styles** (Split Screen, Visual Greenscreen, Car Yap, Office Yap, Podcast Clips, Faceless Reaction, Vlog POV, Stop-Motion…). |
| **Reports (scheduled)** | Hook Genius (3–5 winning hook strategies + "stop doing"), Monthly Content Strategy Audit (every 30 d). "Continue with MCP" → talk to it in Claude. |
| **Claude skill pack** | Niche Interviewer · Unique Positioning (7 attributes) · Bullseye Builder (5 rings, 3-2-1 mix) · Topic Scanner (top 50 screened) · Format Finder (format × visual-layout heat map, empty squares) · Content Formulas (topic × format × layout) · CTA Analysis · Strategy Coach (growth "eras") · Positioning Canvas. |
| **Price** | Pro $49 / Visionary $99 / Titan $499 per month, credit-based. |

**Honest review:** "rough-draft machine, not a finished product factory" — inconsistent outputs, still edit a lot. Callaway himself writes final hooks/scripts by hand and says **editing has no good AI tool** — that's exactly what captain-video already does.

## 2. What CAPTAIN already has (no need to rebuild)

| Sandcastles | CAPTAIN today |
|---|---|
| Channels / watchlist | `captain-content` MCP `fetch_account` (IG/TT/YT) + `config/competitors` + dashboard competitor leaderboard |
| Outlier score | Dashboard: `score` = views ÷ account median, outlier = ≥ 2× |
| Format wins | Dashboard "Which format wins", duration buckets, hashtags on winners |
| Ideas / hooks / scripts | Dashboard: Ideas from winners, 6 new hooks, Write script, Series, Carousels, "What should I do next?" |
| Watch a video | `get_reel` (download + preview Claude can view) |
| Editing styles | captain-video styles (vet-vision, clinic-offers, serif-editorial-1, influencer-1…) |
| Editing (Sandcastles has **none**) | video-ad-editor, montage-video, motion-video, real-sfx |
| Script → voice → video | vet-creative-engine (ElevenLabs) |

## 3. Gaps worth adding (ranked by value ÷ effort)

1. **Reel breakdown tool** — new MCP tool `analyze_reel`: reuse `get_reel` file → local Whisper transcript + 6 frames → Claude fills the **7 variables**; cache as JSON next to the reel. Analyze once, slice many ways (Callaway's key point). *Everything below depends on this.*
2. **Vault in the dashboard** — "Save hook" (first N sentences → Mad-Lib template) / "Save style" (transcript). The existing "Write script" button then takes *hook template + style* as input instead of one-shotting.
3. **Feed filters** — last 30/60 d, ER ≥ 0.5 % (cuts paid ads), sort by outlier / views / date across the whole watchlist.
4. **Format × Editing-style matrix** — label each analyzed outlier with a format (Sandcastles' list) and a visual layout; heat map with empty squares. **CAPTAIN's edge:** each column maps to a captain-video style, so a cell gets a "Make this" button → editing-style → video-ad-editor. Sandcastles stops at the idea; CAPTAIN can ship the video.
5. **Strategy skills** (one skill, staged): Niche Interviewer (6 questions → positioning doc saved per account) → Bullseye (5 rings + weekly **3-2-1 mix**: 2 narrow buckets × 2 videos, 1 broad × 2, 1 chaos) → Topic Scanner (screen off-niche/lifestyle posts, top 50 list).
6. **Weekly Content Coach** — scheduled task every 7 days: pull own account, compare buckets/formats/hooks vs last week, "do more / do less". Plus "eras" view for any competitor that suddenly broke out.
7. **Research step** — Callaway's 3 questions (what did I wish they said more / what's unanswered / what would a beginner ask) + "max shock + contrarian take" report, before scripting.
8. **CTA analysis** — only once lead data exists per video (e.g. WhatsApp clicks from GTM for the clinic). Skip for now.

**Don't build:** a global creator database (can't match theirs), AI avatar recording, a script editor UI (Claude chat already is one).

## 4. Found while checking

- `Z:\AI\CAPTAIN Content SYSTEM\config\settings.json` holds an **Apify API token in plain text**. If that folder is ever zipped, shared or pushed, rotate the token and move it to an env var.
