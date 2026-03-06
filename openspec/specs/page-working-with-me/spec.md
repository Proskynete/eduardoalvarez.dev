## ADDED Requirements

### Requirement: Working with me page
The `/working-with-me` route SHALL communicate how Eduardo collaborates with external clients and teams, what types of engagement he offers, and how to get in touch. There is NO contact form — contact is via email or Calendly link.

**Page header:**
```
Working with Me
I work with engineering teams navigating growth, AI adoption, and platform decisions.
```

**Page sections:**
1. **What I do** — Types of collaboration offered
2. **Who it's for** — Explicit audience (Engineering Managers, CTOs, Technical Founders)
3. **How to start** — Direct call to action (email + Calendly link)

#### Scenario: Page renders all three sections
- **WHEN** user navigates to `/working-with-me`
- **THEN** What I do, Who it's for, and How to start sections SHALL all render

---

### Requirement: Collaboration types
The "What I do" section SHALL list the types of engagement Eduardo offers, each with a name, short description, and format/duration.

**Engagement types (initial set):**
```
Advisory
Short-term strategic guidance for engineering teams making architectural or
organizational decisions. Format: bi-weekly calls + async.

Consulting
Hands-on collaboration on platform architecture, team structure, or AI strategy.
Format: defined engagement (4–12 weeks).

Speaking
Talks and workshops for engineering teams and conferences. Topics: engineering
leadership, platform thinking, AI in engineering orgs.
```

**Visual:** Three cards with `surface` background, `surface-border` border, `card-pad` (24px) padding. No hover animation — these are informational, not CTAs.

#### Scenario: Three engagement cards render
- **WHEN** the working-with-me page loads
- **THEN** Advisory, Consulting, and Speaking cards SHALL all be visible

---

### Requirement: Contact CTA
The "How to start" section SHALL contain direct contact methods with no form.

**CTA content:**
```
Ready to talk?
Send me an email at soy@eduardoalvarez.dev or book a 30-min intro call.

[→ soy@eduardoalvarez.dev]   [→ Book a call (Calendly)]
```

**Visual:**
- Email link: `mailto:` href, `text-accent`
- Calendly link: external URL in `target="_blank"`, `text-accent`
- Both rendered as inline text links with arrow, not buttons

#### Scenario: Email link opens mail client
- **WHEN** user clicks the email contact link
- **THEN** the default mail client SHALL open with `soy@eduardoalvarez.dev` pre-filled as recipient

#### Scenario: Calendly link opens in new tab
- **WHEN** user clicks the "Book a call" link
- **THEN** the Calendly URL SHALL open in a new browser tab

---

### Requirement: Who it's for section
The page SHALL explicitly name the target audience to prequalify visitors. This reduces misdirected contact.

**Content:**
```
Who this is for:
— Engineering Managers and Directors navigating team scaling or AI adoption
— Staff and Principal Engineers leading platform or architecture initiatives
— Technical Founders making foundational technology decisions
```

#### Scenario: Audience list renders as structured items
- **WHEN** the working-with-me page loads
- **THEN** the three audience types SHALL render as a distinct list with visual separators
