# Carbon Footprint Awareness Platform

## Deployment

### GitHub + Vercel setup
1. Push this project to a GitHub repository.
2. In Vercel, import the repository and use the existing project settings from `.vercel/project.json`.
3. Add these GitHub repository secrets for automated deployment:
   - `VERCEL_TOKEN`
   - `VERCEL_ORG_ID`
   - `VERCEL_PROJECT_ID`
4. The workflow in `.github/workflows/deploy.yml` will build on every push/PR and deploy to Vercel on `main`.

### Local checks
- `npm ci`
- `npm run build`
