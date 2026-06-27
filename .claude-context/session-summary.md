# Claude Session Summary
**Project:** UX Arena — Ghost Theme (ux-arena)
**Session date:** 2026-06-27
**User:** alaa.jabawi@gmail.com

---

## Project Overview
- **Theme name:** `ux-arena` (previously named "woords")
- **Version:** 1.1.0
- **Type:** Ghost CMS theme (Handlebars / HBS)
- **Author credit:** Trexthemes
- **Ghost compatibility:** >= 5.0.0
- **Build tool:** Gulp + Tailwind CSS v4 + PostCSS
- **License:** MIT

## What this project is
A minimal blog and magazine Ghost theme. The theme has a dark-mode capable design, custom portfolio page, protected content gate, member sections, and custom Ghost settings for hero text, footer text, social links, and BeyondWords audio integration.

---

## Last 3 Updates (as of session date, based on file timestamps — no git history)

### 1. May 4, 14:14 — `tag.hbs` + `production/ux-arena.zip`
- Tag archive page was reworked: the tag image/avatar block is now hidden (`hidden` class on both image and fallback div)
- Only the tag name, description, and post count badge are shown in the hero
- Post grid uses 4 columns on xl screens (`xl:grid-cols-4`)
- A new production zip (`ux-arena.zip`) was built and placed in `production/`

### 2. May 4, 11:59 — `package.json`
- Theme version bumped from unknown → `1.1.0`
- Several new Ghost custom settings added:
  - `hero_headline`, `hero_subheadline`, `hero_thought_quote`, `hero_image`
  - `footer_quote`, `footer_statement`, `footer_statement_sub`
  - `editor_section_title`
- Default copy written for hero and footer fields (UX Arena editorial voice)

### 3. May 3, 15:07 — `custom-portfolio.hbs`
- Portfolio page received major styling overhaul
- Dark theme: `#0d0d0d` background, `#e8e8e8` text, Roboto font (Google Fonts)
- Scoped CSS reset inside `#portfolio-page` to avoid leaking into the main theme
- Password gate system added (`page-gate-content` hidden by default)
- Max-width container: 1300px with 32px padding

---

## Key Files
| File | Purpose |
|---|---|
| `default.hbs` | Main layout shell |
| `index.hbs` | Home page |
| `post.hbs` | Single post |
| `page.hbs` | Static page |
| `tag.hbs` | Tag archive |
| `author.hbs` | Author archive |
| `custom-portfolio.hbs` | Portfolio page (dark, scoped) |
| `custom-about.hbs` | About page |
| `custom-authors.hbs` | Authors listing |
| `custom-protected.hbs` | Password-protected page |
| `custom-tags.hbs` | Tags listing |
| `partials/` | Reusable HBS partials (header, footer, loops, etc.) |
| `members/` | Member-facing pages |
| `assets/` | CSS, JS, images |
| `scripts/` | Build scripts |
| `gulpfile.js` | Gulp build config |
| `production/ux-arena.zip` | Latest built theme zip for Ghost upload |

---

## How to Restore Context on a New Mac

1. Copy this entire project folder to the new Mac.
2. Install Claude Code: `npm install -g @anthropic-ai/claude-code`
3. Open the project folder in VS Code or terminal.
4. Launch Claude Code (`claude`) from inside the project directory.
5. Tell Claude: *"Read the .claude-context folder to get up to speed on this project."*
6. Claude will have full context of the project, last updates, and your preferences.

---

## User Preferences & Notes
- User works on a Mac (macOS)
- Project is a Ghost CMS theme being actively developed
- No git repository initialized — version history tracked by file timestamps only
- User email: alaa.jabawi@gmail.com
