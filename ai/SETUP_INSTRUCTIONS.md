# Epic Stack Setup Steps for Vitae Project

### **Important URLs to Bookmark:**

- GitHub Repository: `https://github.com/weco-dev/vitae`
- Fly.io Dashboard: `https://web.fly.io/dashboard`
- Resend Dashboard: `https://resend.com/dashboard`
- Sentry Dashboard: `https://sentry.io/organizations/YOUR_ORG/projects/`

---

### Install the latest version of Nodejs

```bash
asdf list all nodejs # see all versions of nodejs
asdf install nodejs LATEST_VERSION
touch touch .tool-versions
```

In `.tool-versions` put the nodejs version

```bash
# example extract .tool-versions
nodejs 24.3.0 # LATEST_VERSION
```

### **Install Epic Stack**

```bash
cd /Users/andreareginato/Dev/weco/vitae
npx epicli new vitae
```

### **Navigate to project and run initial setup**

```bash
cd vitae
npm run setup
prisma db seed
```

### **Check prisma studio**

```bash
# Check if the data has been seeded
npx prisma studio
```

Open your browser to `http://localhost:5555` to view the seeded data. You should
see:

- Users table with the default `kody` user
- Any other seeded data from your `prisma/seed.ts` file

### **Verify app**

```bash
# Make sure your dev server is running
npm run dev
```

Navigate to `http://localhost:3000` and try logging in with:

- Username: `kody`
- Password: `kodylovesyou`

If login works, you're ready to proceed with deployment setup.

### **Install and setup Fly CLI**

```bash
# Check if already installed
flyctl version

# Install Fly CLI if not installed
curl -L https://fly.io/install.sh | sh
# Or via Homebrew on macOS
brew install flyctl
```

### **Authenticate with Fly**

```bash
fly auth login  # if you have an account (otherwise fly auth signup)
fly auth whoami  # verify authentication
```

### **Create Fly apps (production and staging)**

```bash
fly apps create nodes-vitae
fly apps create nodes-vitae-staging
```

> **Note** : Make sure this name matches the `app` set in your `fly.toml` file.
> Otherwise, you will not be able to deploy.

### **Initialize Git and connect to GitHub**

```bash
# Init repository
git init
git add .
git commit -m "initial message"

# Add git flow
git flow init

# Create new GitHub repository at https://github.com/weco-dev
git remote add origin <YOUR_GITHUB_REPO_URL>
# Don't push yet!
```

### **Add GitHub Secrets**

1. Go to your GitHub repo settings → Secrets and variables → Actions
2. Add `FLY_API_TOKEN` (get from
   https://web.fly.io/user/personal_access_tokens/new)

### **Set app secrets**

```bash
# Generate and set session secrets
fly secrets set SESSION_SECRET=$(openssl rand -hex 32) HONEYPOT_SECRET=$(openssl rand -hex 32) --app vitae
fly secrets set SESSION_SECRET=$(openssl rand -hex 32) HONEYPOT_SECRET=$(openssl rand -hex 32) --app vitae-staging

# Prevent staging from being indexed
fly secrets set ALLOW_INDEXING=false --app vitae-staging
```

### **Create persistent volumes for database**

```bash
fly volumes create data --region fra --size 1 --app vitae
fly volumes create data --region fra --size 1 --app vitae-staging
```

If you need to change regions check with `fly platform regions`

### **Attach Consul for data replication**

```bash
fly consul attach --app vitae
fly consul attach --app vitae-staging
```

### **Set up Tigris object storage (for image uploads)**

```bash
fly storage create --app vitae
fly storage create --app vitae-staging
```

### **Create Resend account and API key**

1. Sign up at https://resend.com/
2. Create API key at https://resend.com/api-keys
3. Set up custom sending domain at https://resend.com/domains

### **Configure email secrets**

```bash
fly secrets set RESEND_API_KEY="your_resend_api_key" --app vitae
fly secrets set RESEND_API_KEY="your_resend_api_key" --app vitae-staging
```

### **Update email configuration in code**

- Update `from` email address in `app/utils/email.server.ts`
- Update email test in `tests/e2e/onboarding.test.ts`

### **Create Sentry account and project**

1. Sign up at https://sentry.io/signup/?project_platform=javascript-remix
2. Create a Remix project
3. Copy the DSN

### **Configure Sentry secrets**

```bash
fly secrets set SENTRY_DSN="your_sentry_dsn" --app vitae
fly secrets set SENTRY_DSN="your_sentry_dsn" --app vitae-staging
```

### **Set up Sentry build-time configuration (OPTIONAL)**

> **Note**: This step is optional. Without it, Sentry will still work for error
> monitoring, but you won't get source maps, release tracking, or commit
> association.

1. Create internal integration at Sentry for auth token
2. Add scopes: `Releases:Admin` and `Organization:Read`
3. Get organization slug and project slug
4. Add to GitHub Secrets (optional for enhanced Sentry features):
   - `SENTRY_AUTH_TOKEN` (only this one is actually used)
   - `SENTRY_ORG` (not used in current implementation)
   - `SENTRY_PROJECT` (not used in current implementation)

### **Update fly.toml configuration**

- Verify app names match your created apps
- Adjust region if needed (default is `sjc`)

### **Commit and deploy**

```bash
git add .
git commit -m "Initial Epic Stack setup"
git push origin main
```

### **Verify deployment**

- Check Fly.io dashboard for app status
- Test production and staging URLs
- Verify email functionality
- Test error monitoring with Sentry
- Confirm image upload functionality

### **Local development verification**

```bash
npm run dev
npm run test
npm run test:e2e
```

---

### **Summary of Required External Services:**

1. **GitHub account** - Code repository and CI/CD
2. **Fly.io account** - Hosting and deployment
3. **Resend account** - Transactional email service
4. **Sentry account** - Error monitoring and performance tracking

### **Environment Variables to Configure:**

#### Fly.io App Secrets:

- `SESSION_SECRET` & `HONEYPOT_SECRET` (auto-generated)
- `RESEND_API_KEY` (from Resend)
- `SENTRY_DSN` (from Sentry)
- `ALLOW_INDEXING=false` (staging only)

#### GitHub Repository Secrets:

- `FLY_API_TOKEN` (required for deployments)
- `SENTRY_AUTH_TOKEN` (optional - for enhanced Sentry features like source maps)

---

**Follow these steps sequentially for a complete Epic Stack setup with all
services configured.**
