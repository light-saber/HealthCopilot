# Health Copilot - Setup Complete! ✅

## What's Configured

✅ **Gemini API** - For AI chat and action generation  
✅ **Ultrahuman API** - For health metrics  
❌ **Perplexity** - Removed (using Gemini instead)

## Quick Start

### 1. Start the Application

```bash
npm run dev:all
```

This will start:
- ✅ Ultrahuman MCP server (via npx)
- ✅ Backend API (http://localhost:4000)
- ✅ Frontend dashboard (http://localhost:5173)

### 2. Access the Dashboard

Open your browser to: **http://localhost:5173**

## What Works Now

- ✅ **Health Metrics** - View sleep, HRV, RHR, activity from Ultrahuman
- ✅ **Recovery Score** - Composite health score
- ✅ **AI Chat** - Chat with Gemini about your health data
- ✅ **Action Plans** - Generate research-backed recommendations using Gemini

## Changes Made

**Removed Perplexity dependency:**
- Replaced Perplexity MCP with direct Gemini API integration
- Action generation now uses Gemini (same as chat)
- Simplified setup - only need 2 API keys instead of 3

## Architecture

```
Frontend (React) → Backend (Express) → Gemini API (Actions + Chat)
                                    → Ultrahuman MCP → Ultrahuman API
```

## Troubleshooting

**If you see "Module not found" errors:**
- Make sure you're in the project root directory
- Run `npm install` again if needed

**If Ultrahuman MCP fails:**
- Check that your API token and email are correct in `.env`
- Verify Partner ID is configured in the Ultrahuman mobile app

**If Gemini API fails:**
- Verify your API key is correct in `.env`
- Check you have API quota remaining

## Next Steps

1. Make sure your `.env` has both keys:
   - `GEMINI_API_KEY` ✅
   - `ULTRAHUMAN_AUTH_TOKEN` ✅
   - `ULTRAHUMAN_USER_EMAIL` ✅

2. Start the app with `npm run dev:all`

3. Open http://localhost:5173 and explore!

## Full Documentation

See [README.md](./README.md) for complete documentation.
