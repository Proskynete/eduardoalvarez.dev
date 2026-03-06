## ADDED Requirements

### Requirement: Newsletter dedicated page
The `/newsletter` route SHALL be a standalone page for the newsletter. It has a value proposition, a subscribe form, and a placeholder for future issue archives. The newsletter does not have a name yet — use "Newsletter" as the label until a name is defined.

**Page header:**
```
Newsletter
Thoughts on engineering leadership, platform architecture, and AI — direct to your inbox.
Sent when there's something worth saying. No cadence pressure.
```

#### Scenario: Newsletter page loads
- **WHEN** user navigates to `/newsletter`
- **THEN** the page SHALL render with header, value proposition, and subscribe form

---

### Requirement: Subscribe form on newsletter page
The newsletter page SHALL include the full subscribe form (email + name fields), reusing the existing subscribe component and API.

#### Scenario: Subscribe form works from newsletter page
- **WHEN** user fills in name and email on the newsletter page and submits
- **THEN** the API POST to `/api/subscribe` SHALL be called and appropriate success/error state SHALL render

---

### Requirement: Value proposition section
Before the form, the page SHALL communicate what the reader gets and at what frequency.

**Content:**
```
What you'll get:
— Takes on engineering culture and leadership decisions
— Platform and AI architecture patterns from real experience
— Occasional links worth reading, without the curation fatigue

Frequency: when there's something worth saying (not weekly for the sake of it)
```

**Visual:** Simple list, `text-secondary`, no card container — flush with page.

#### Scenario: Value proposition renders above subscribe form
- **WHEN** the newsletter page loads
- **THEN** the value proposition list SHALL appear above the subscribe form

---

### Requirement: Issues archive placeholder
The page SHALL include an archive section below the subscribe form. Initially empty with a placeholder message. When issues are published in the future, they will appear here.

**Placeholder state:**
```
Past Issues
The archive is empty — you'll be among the first subscribers.
```

**Future state (when issues exist):** A list of past issue titles, dates, and links. Data source TBD when first issue is published.

#### Scenario: Empty archive shows placeholder
- **WHEN** the newsletter page loads and no issues exist in the archive
- **THEN** the placeholder message SHALL render instead of an empty list
