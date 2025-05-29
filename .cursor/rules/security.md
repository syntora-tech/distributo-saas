# Security Rules

## Authentication
- Use Auth.js for authentication
- Protect routes with middleware
- Implement proper session management
- Use secure password hashing
- Implement rate limiting

## Data Protection
- Validate all input data
- Sanitize user inputs
- Use CSRF protection
- Implement proper CORS policies
- Secure cookie settings

## Environment Variables
- Store secrets in .env
- Never commit .env files
- Use different env files for different environments
- Validate environment variables on startup
- Use strong encryption for sensitive data

## API Security
- Use HTTPS only
- Implement proper authentication for all API routes
- Rate limit API endpoints
- Validate all API requests
- Use proper error handling without exposing internals 