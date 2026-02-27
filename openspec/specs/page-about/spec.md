## ADDED Requirements

### Requirement: About page
The `/about` route SHALL be a semi-static page communicating who Eduardo is, what he builds, and why it matters to his audience. It replaces any existing about content that was embedded in the homepage.

**Page sections:**
1. **Intro** — Short professional bio (3–5 sentences). First person, opinionated tone. No bullet list of technologies.
2. **What I work on** — Current focus areas: Engineering Leadership, Platform Architecture, AI integration in engineering orgs.
3. **Where I've been** — Career highlights (text, not a timeline). Notable companies, roles, outcomes.
4. **How I think** — 3–4 one-liners that capture the POV: "I believe X", "I've learned Y". These replace a long philosophy section.
5. **Connect** — Links: GitHub, LinkedIn, Twitter/X, Email, Resume.

**Content type:** MDX file at `src/pages/about/index.mdx` — content is authored manually, not generated from settings.

#### Scenario: About page loads with all sections
- **WHEN** user navigates to `/about`
- **THEN** all five content sections SHALL render in order

#### Scenario: Connect section links are functional
- **WHEN** user clicks a connect link
- **THEN** the link SHALL navigate to the correct external profile or open the mail client

---

### Requirement: About page profile image
The about page SHALL include a profile image. The image SHALL use the existing `eduardo_alvarez.webp` or a new high-resolution version.

**Image spec:**
- Size: 160×160px rendered, source ≥ 320×320px
- Shape: `rounded-full` (circle)
- Position: left-aligned on desktop, centered on mobile, above the intro text

#### Scenario: Profile image renders with alt text
- **WHEN** the about page loads
- **THEN** the profile image SHALL have a descriptive `alt` attribute and render at the defined size

---

### Requirement: "How I think" statements
The about page SHALL include 3–4 short opinionated statements that reflect Eduardo's engineering philosophy. These are not a mission statement — they are concrete beliefs.

**Format:**
```
"Shipping beats planning. But shipping without a mental model creates legacy debt."
"AI doesn't replace engineering judgment. It amplifies it — for better or worse."
"The best platform teams are invisible to the engineers who use them."
```

**Visual:** Large `text-xl` quotes, `text-secondary`, left border `accent`, separated by spacing.

#### Scenario: Philosophy quotes render with accent border
- **WHEN** the about page loads
- **THEN** each "How I think" statement SHALL have a 3px left border in `accent` color
