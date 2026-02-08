# patryk.uk v2.0

Personal portfolio website built with React, Vite, and Three.js. Hosted on Firebase.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 🔧 Environment Variables

Copy `.env.example` to `.env` and add your API keys:

```bash
cp .env.example .env
```

Required variables:
- `VITE_ALPHA_VANTAGE_API_KEY` - Stock data API key from [Alpha Vantage](https://www.alphavantage.co/support/#api-key)

## 🔥 Firebase Setup

### Prerequisites
1. Create a project at [Firebase Console](https://console.firebase.google.com)
2. Install Firebase CLI: `npm install -g firebase-tools`
3. Login: `firebase login`

### Configure Project
Update `.firebaserc` with your project ID:
```json
{
  "projects": {
    "default": "your-firebase-project-id"
  }
}
```

### Manual Deploy
```bash
npm run deploy
```

## 🔄 GitHub Actions CI/CD

The repository includes automated deployment via GitHub Actions. On every push to `main`:
1. Installs dependencies and lints
2. Builds with environment variables from secrets
3. Deploys to Firebase Hosting

### Required GitHub Secrets

Go to **Settings → Secrets and variables → Actions** and add:

| Secret | Description |
|--------|-------------|
| `VITE_ALPHA_VANTAGE_API_KEY` | Alpha Vantage API key |
| `FIREBASE_PROJECT_ID` | Your Firebase project ID |
| `FIREBASE_SERVICE_ACCOUNT` | Firebase service account JSON (see below) |

### Getting Firebase Service Account
1. Firebase Console → Project Settings → Service Accounts
2. Click "Generate new private key"
3. Copy entire JSON as the secret value

## 📁 Project Structure

```
├── src/
│   ├── components/     # React components
│   ├── styles/         # CSS styles
│   └── utils/          # Utilities and helpers
├── public/             # Static assets
├── .github/workflows/  # CI/CD pipeline
└── firebase.json       # Firebase config
```

## 📄 License

MIT
