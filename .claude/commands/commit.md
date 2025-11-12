---
description: "Creates well-formatted commits with conventional commit messages and emoji"
allowed-tools: ["Bash(git add:*)", "Bash(git status:*)", "Bash(git commit:*)", "Bash(git diff:*)", "Bash(git log:*)"]
---

# Claude Command: Commit

Creates well-formatted commits with conventional commit messages and emoji.

## Usage

```
/commit
/commit --no-verify
```

## Process

1. Check staged files, commit only staged files if any exist
2. Analyze diff for multiple logical changes
3. Suggest splitting if needed
4. **Determine commit type and SELECT the corresponding emoji from the emoji map**
5. Create commit with the complete structure: `<emoji> <type>[optional scope]: <description>`
6. Husky handles pre-commit hooks automatically

## Commit Format

**Complete Structure:**

```
<emoji> <type>[optional scope]: <description>
[optional body]
[optional footer(s)]
```

**Types:**

- `build`: Build system or external dependencies
- `chore`: Build/tools and maintenance tasks
- `ci`: Continuous integration changes
- `docs`: Documentation
- `feat`: New feature
- `fix`: Bug fix
- `perf`: Performance improvements
- `refactor`: Code restructuring
- `revert`: Revert previous commit
- `style`: Formatting and code style
- `test`: Tests

**Rules:**

- **ALWAYS start with emoji from emoji map (based on commit type)**
- **Complete structure:** `<emoji> <type>[optional scope]: <description>` (emoji is MANDATORY)
- Imperative mood ("add" not "added")
- First line <72 chars (including emoji)
- Atomic commits (single purpose)
- Split unrelated changes
- Body and footer are optional but should be used for complex changes
- The body should be written using bullet points.

## Emoji Map

👷 build | 🔧 chore | 🚀 ci | 📝 docs | ✨ feat | 🐛 fix | ⚡ perf | ♻️ refactor | ⏪️ revert | 🎨 style | ✅ test

## Split Criteria

Different concerns | Mixed types | File patterns | Large changes

## Options

`--no-verify`: Skip Husky hooks

## Notes

- **CRITICAL: Every commit MUST start with an emoji from the emoji map**
- **Structure:** `<emoji> <type>[optional scope]: <description>` with optional body and footer
- Husky handles pre-commit checks
- Only commit staged files if any exist
- Analyze diff for splitting suggestions
- **NEVER add Claude signature to commits**

**Examples:**

Simple commit:

```
✨ feat: add user authentication
```

With scope:

```
🐛 fix(auth): correct token validation logic
```

With body and footer:

```
♻️ refactor(api): restructure endpoint handlers

- Move handler logic to separate files for better maintainability and testability.
- Update tests to reflect new structure.

BREAKING CHANGE: API endpoint paths have changed
```

Breaking change with **!** (recommended):

```
✨ feat(api)!: send an email to the customer when a product is shipped
```

Breaking change with **!** and footer:

```
🔧 chore!: drop support for Node 14

BREAKING CHANGE: use JavaScript features not available in Node 14
```

Breaking change with scope and detailed explanation:

```
✨ feat(auth)!: require authentication for all API endpoints

- All endpoints now require a valid JWT token in the Authorization header.
- Public endpoints have been moved to /public/* routes.

BREAKING CHANGE: unauthenticated requests to /api/* will now return 401
```

Invalid (missing emoji):

```
feat: add user authentication
```
