# Cursor Project Rules

## Package Validation Rules

Before suggesting to install any package, check the following criteria:

1. Weekly downloads must be > 100,000
2. GitHub stars (if applicable) should be > 1,000
3. Last update should be within the last year
4. Should be used in popular projects or by major companies
5. Should have good documentation
6. Should have active maintenance
7. Should have good community support
8. Should have no major security issues
9. Should have no major bugs
10. Should have no major performance issues

## Package Information Format

When suggesting a package, provide the following information:

```markdown
Package Name:
- Weekly downloads: X
- GitHub stars: X
- Last update: X
- Used in: X
- Security: X
- Maintenance: X
- Community: X
```

## Package Categories

1. Core Dependencies:
   - Must meet all criteria
   - Must be stable and well-tested
   - Must have good TypeScript support

2. Development Dependencies:
   - Can be less strict on criteria
   - Must have good documentation
   - Must be actively maintained

3. Testing Dependencies:
   - Can be less strict on criteria
   - Must be stable
   - Must have good documentation

## Package Alternatives

If a package doesn't meet the criteria, suggest alternatives:
1. Built-in solutions
2. More popular packages
3. More maintained packages
4. More secure packages
5. More performant packages

## Package Installation

When installing packages:
1. Use exact versions
2. Add to appropriate dependency section (dependencies/devDependencies)
3. Update package.json and yarn.lock
4. Document the reason for installation
5. Document the version used
6. Document the alternatives considered 