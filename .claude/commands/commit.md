---
description: "Creates well-formatted commits with conventional commit messages and emoji"
allowed-tools: ["Bash(git add:*)", "Bash(git status:*)", "Bash(git commit:*)", "Bash(git diff:*)", "Bash(git log:*)"]
argument-hint: [message] | --no-verify | --amend
---

# Smart Git Commit

Create well-formatted commit: $ARGUMENTS

## Current Repository State

- Git status: !git status --porcelain
- Current branch: !git branch --show-current
- Staged changes: !git diff --cached --stat
- Unstaged changes: !git diff --stat
- Recent commits: !git log --oneline -5

## Usage

```
/commit
/commit --no-verify
```

## Process

1. Unless specified with --no-verify, automatically runs pre-commit checks:
   - npm lint to ensure code quality
   - npm build to verify the build succeeds
2. Check staged files, commit only staged files if any exist
3. If 0 files are staged, automatically adds all modified and new files with git add
4. Performs a git diff to understand what changes are being committed
5. Analyzes the diff to determine if multiple distinct logical changes are present
6. If multiple distinct changes are detected, suggests breaking the commit into multiple smaller commits
7. For each commit (or the single commit if not split), determine commit type and SELECT the corresponding emoji from the emoji map
8. Create commit with the complete structure: `<emoji> <type>[optional scope]: <description>`
9. Husky handles pre-commit hooks automatically

## Commit Format

```
<emoji> <type>[optional scope]: <description>
[optional body]
[optional footer(s)]
```

## Types

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc)
- `refactor`: Code changes that neither fix bugs nor add features
- `perf`: Performance improvements
- `test`: Adding or fixing tests
- `chore`: Changes to the build process, tools, etc.
- `build`: Build system or external dependencies
- `ci`: Continuous integration changes
- `revert`: Revert previous commit

## Rules

- **ALWAYS start with emoji from emoji map (based on commit type)**
- **Complete structure:** `<emoji> <type>[optional scope]: <description>` (emoji is MANDATORY)
- **Present tense, imperative mood**: Write commit messages as commands (e.g., "add feature" not "added feature")
- **Concise first line**: Keep the first line under 72 characters
- **Emoji**: Each commit type is paired with an appropriate emoji:- Atomic commits (single purpose)
- Split unrelated changes
- Body and footer are optional but should be used for complex changes
- The body should be written using bullet points.
- **NEVER add Claude signature to commits**

## Emoji Map

- ✨ feat: New feature
- 🐛 fix: Bug fix
- 📝 docs: Documentation
- 💄 style: Formatting/style
- ♻️ refactor: Code refactoring
- ⚡️ perf: Performance improvements
- ✅ test: Tests
- 🔧 chore: Tooling, configuration
- 🚀 ci: CI/CD improvements
- 🗑️ revert: Reverting changes
- 🧪 test: Add a failing test
- 🚨 fix: Fix compiler/linter warnings
- 🔒️ fix: Fix security issues
- 👥 chore: Add or update contributors
- 🚚 refactor: Move or rename resources
- 🏗️ refactor: Make architectural changes
- 🔀 chore: Merge branches
- 📦️ chore: Add or update compiled files or packages
- ➕ chore: Add a dependency
- ➖ chore: Remove a dependency
- 🌱 chore: Add or update seed files
- 🧑‍💻 chore: Improve developer experience
- 🧵 feat: Add or update code related to multithreading or concurrency
- 🔍️ feat: Improve SEO
- 🏷️ feat: Add or update types
- 💬 feat: Add or update text and literals
- 🌐 feat: Internationalization and localization
- 👔 feat: Add or update business logic
- 📱 feat: Work on responsive design
- 🚸 feat: Improve user experience / usability
- 🩹 fix: Simple fix for a non-critical issue
- 🥅 fix: Catch errors
- 👽️ fix: Update code due to external API changes
- 🔥 fix: Remove code or files
- 🎨 style: Improve structure/format of the code
- 🚑️ fix: Critical hotfix
- 🎉 chore: Begin a project
- 🔖 chore: Release/Version tags
- 🚧 wip: Work in progress
- 💚 fix: Fix CI build
- 📌 chore: Pin dependencies to specific versions
- 👷 ci: Add or update CI build system
- 📈 feat: Add or update analytics or tracking code
- ✏️ fix: Fix typos
- ⏪️ revert: Revert changes
- 📄 chore: Add or update license
- 💥 feat: Introduce breaking changes
- 🍱 assets: Add or update assets
- ♿️ feat: Improve accessibility
- 💡 docs: Add or update comments in source code
- 🗃️ db: Perform database related changes
- 🔊 feat: Add or update logs
- 🔇 fix: Remove logs
- 🤡 test: Mock things
- 🥚 feat: Add or update an easter egg
- 🙈 chore: Add or update .gitignore file
- 📸 test: Add or update snapshots
- ⚗️ experiment: Perform experiments
- 🚩 feat: Add, update, or remove feature flags
- 💫 ui: Add or update animations and transitions
- ⚰️ refactor: Remove dead code
- 🦺 feat: Add or update code related to validation
- ✈️ feat: Improve offline support

## Guidelines for Splitting Commits

When analyzing the diff, consider splitting commits based on these criteria:

1. **Different concerns**: Changes to unrelated parts of the codebase
2. **Different types of changes**: Mixing features, fixes, refactoring, etc.
3. **File patterns**: Changes to different types of files (e.g., source code vs documentation)
4. **Logical grouping**: Changes that would be easier to understand or review separately
5. **Size**: Very large changes that would be clearer if broken down

## Options

`--no-verify`: Skip running the pre-commit checks (lint, build, generate:docs)

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

Breaking change with **!** (MANDATORY):

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

## Important Notes

- By default, pre-commit checks (npm lint, npm build) will run to ensure code quality
- If these checks fail, you'll be asked if you want to proceed with the commit anyway or fix the issues first
- If specific files are already staged, the command will only commit those files
- If no files are staged, it will automatically stage all modified and new files
- The commit message will be constructed based on the changes detected
- Before committing, the command will review the diff to identify if multiple commits would be more appropriate
- If suggesting multiple commits, it will help you stage and commit the changes separately
- Always reviews the commit diff to ensure the message matches the changes
- **NEVER add Claude signature to commits**
