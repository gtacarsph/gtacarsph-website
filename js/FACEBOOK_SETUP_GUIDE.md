# Facebook Page Auto-Fetch Setup Guide

## Overview
Auto-fetch latest posts from **BentaKotse Manila** Facebook Page (ID: 804238446305658) and display on GTACarsPH website with SEO optimization.

## Files Created
- `js/facebook-autofetch.js` - Main auto-fetch script
- Updated `index.html` - Added Facebook container
- Updated `styles.css` - Added Facebook styles

## Features
- ✅ Auto-fetch latest 5 posts from Facebook Page
- ✅ SocialMediaPosting Schema markup for SEO
- ✅ Caching (30 mins) - saves API calls
- ✅ Fallback to Page embed if API fails
- ✅ Engagement stats (likes, comments, shares)
- ✅ Hashtag extraction and display
- ✅ Relative timestamps (2h ago, yesterday)
- ✅ Responsive grid layout
- ✅ Link to view on Facebook

## Setup Steps

### 1. Get Facebook Page Access Token

You need a **Page Access Token** to fetch posts. Here's how:

#### Option A: Facebook Graph API Explorer (Quick Test)
1. Go to https://developers.facebook.com/tools/explorer/
2. Click **"Get Token"** → **"Get Page Access Token"**
3. Select your Facebook account
4. Select **BentaKotse Manila** page
5. Copy the generated token
6. Note: This token expires in ~1 hour (for testing only)

#### Option B: Long-Lived Token (Recommended for Production)
1. Create a Meta App at https://developers.facebook.com/apps/
2. Add **Facebook Login** product
3. Add **pages_read_engagement** permission
4. Get User Access Token with `pages_read_engagement`
5. Exchange for Long-Lived Token (valid 60 days)
6. Exchange for Page Access Token (never expires)

Full guide: https://developers.facebook.com/docs/pages/access-tokens

### 2. Update the Script

Edit `js/facebook-autofetch.js`:

```javascript
const CONFIG = {
    PAGE_ID: '804238446305658', // Already set ✓
    ACCESS_TOKEN: 'YOUR_PAGE_ACCESS_TOKEN_HERE', // ← Paste token here
    MAX_RESULTS: 5,
    CACHE_DURATION: 1800000, // 30 minutes
    CONTAINER_ID: 'facebook-posts-container',
    DEFAULT_IMAGE: 'https://gtacarsph.com/logo.jpg'
};
```

### 3. Test It

1. Open `index.html` in browser
2. Check browser console (F12) for errors
3. Posts should load automatically
4. If API fails, fallback embed will show

## How It Works

```
Page Load → Check Cache → If fresh: Show cached
                     ↓
              If expired/missing: Call FB API
                     ↓
              Parse posts → Save to cache → Display
                     ↓
              If API fails: Show Page Embed
```

## API Permissions Needed

- `pages_read_engagement` - Read posts and engagement
- `pages_read_user_content` - Read post content

## Rate Limits

- Facebook Graph API: ~200 calls/hour/user (for Page tokens)
- Script caches for 30 mins to stay under limits

## Security Note

**Never commit the ACCESS_TOKEN to GitHub!**

Options for production:
1. Use environment variables (if using a build system)
2. Store token in separate `config.js` (add to .gitignore)
3. Use server-side proxy to hide token

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Loading..." forever | Check token is valid, check browser console |
| "Failed to fetch" | Token expired or missing permissions |
| No posts showing | Page might have no public posts |
| CORS errors | Normal for Facebook API, fallback will show |

## Fallback Behavior

If the API call fails (expired token, no permission, etc.):
- Script automatically shows Facebook Page Plugin embed
- Users can still see your Page feed
- No broken/empty sections

## SEO Benefits

Each post includes Schema.org markup:
- `@type`: SocialMediaPosting
- `author`: BentaKotse Manila
- `datePublished`: Post timestamp
- `articleBody`: Post message
- `url`: Direct link to post

This helps Google understand and index your social content.

## Next Steps

1. [ ] Get Page Access Token
2. [ ] Update `ACCESS_TOKEN` in facebook-autofetch.js
3. [ ] Test locally
4. [ ] Deploy to gtacarsph.com
5. [ ] Verify posts are loading

## Live Demo

Once set up, visit:
- https://gtacarsph.github.io/gtacarsph-website/ (GitHub Pages)
- https://gtacarsph.com (Production)

Scroll to "Facebook Updates" section to see auto-fetched posts! 🎉
