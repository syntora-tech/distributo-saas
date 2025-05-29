# Git Rules

## Branching Strategy
- Main branch: `main`
- Feature branches: `feature/*`
- Bug fixes: `fix/*`
- Hotfixes: `hotfix/*`
- Releases: `release/*`

## Commit Messages
- Use Conventional Commits
- Format: `type(scope): description`
- Types: feat, fix, docs, style, refactor, test, chore
- Keep messages clear and concise
- Reference issues when applicable
- Commit after each feature completion with precise description
- Example: `feat(auth): add google oauth login`

## Feature Commits
- Commit after each completed feature
- Use clear and specific commit messages
- Include what was added/changed
- Example: `feat(posts): add post creation form`
- Example: `feat(users): implement user profile editing`

## Pull Requests
- Require at least one reviewer
- All tests must pass
- No merge conflicts
- Up-to-date with main branch
- Clear description of changes

## Version Control
- Use semantic versioning
- Tag releases
- Keep commit history clean
- Regular pushes to remote
- Use .gitignore properly 