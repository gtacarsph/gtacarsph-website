# GTACarsPH YouTube Auto-Fetch Setup Guide

## Overview
This JavaScript module automatically fetches and displays your latest YouTube videos with full SEO optimization.

## Features
- ✅ Auto-fetch latest 3 videos from your channel
- ✅ Full VideoObject Schema.org markup for Google indexing
- ✅ View count formatting (15K, 1.2M)
- ✅ Relative time display (2 days ago, 1 week ago)
- ✅ Auto-generated hashtags based on video content
- ✅ Caching (1 hour) to save API quota
- ✅ Lazy loading for performance
- ✅ Error handling with fallback messages

## Setup Instructions

### Step 1: Get YouTube Data API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select existing)
3. Enable **YouTube Data API v3**
   - APIs & Services → Library → Search "YouTube Data API" → Enable
4. Create API Key
   - APIs & Services → Credentials → Create Credentials → API Key
5. Copy the API key (looks like: `AIzaSy...`)

### Step 2: Get Your Channel ID

**Option A: From YouTube Studio**
1. Go to [YouTube Studio](https://studio.youtube.com/)
2. Settings → Channel → Basic info
3. Copy Channel ID

**Option B: From Your Channel URL**
- If URL is: `youtube.com/@RaffaGTACARS`
- Go to: `youtube.com/@RaffaGTACARS/about`
- View page source, search for `"channelId":"` or use [this tool](https://www.youtube.com/account_advanced)

### Step 3: Update the Configuration

Edit `js/youtube-autofetch.js`:

```javascript
const CONFIG = {
    API_KEY: 'YOUR_ACTUAL_API_KEY_HERE',  // Replace with your API key
    CHANNEL_ID: 'YOUR_CHANNEL_ID_HERE',    // Replace with your channel ID
    MAX_RESULTS: 3,
    // ... rest of config
};
```

### Step 4: Update HTML

Replace your current YouTube section with:

```html
<!-- YouTube Videos Section -->
<div class="social-section">
    <h3 class="social-platform-title"><i class="fab fa-youtube"></i> YouTube Vlogs</h3>
    <div id="youtube-videos-container" class="youtube-grid">
        <!-- Videos will be auto-loaded here -->
        <div class="yt-loading"><i class="fas fa-spinner fa-spin"></i> Loading videos...</div>
    </div>
    <div class="social-cta">
        <a href="https://youtube.com/@RaffaGTACARS" target="_blank" class="btn btn-youtube">
            <i class="fab fa-youtube"></i> Subscribe on YouTube
        </a>
    </div>
</div>
```

### Step 5: Include the Script

Add before closing `</body>` tag:

```html
<script src="js/youtube-autofetch.js"></script>
```

## CSS Styling (Add to styles.css)

```css
/* YouTube Auto-Fetch Styles */
.yt-loading {
    text-align: center;
    padding: 2rem;
    color: #64748b;
}

.yt-loading i {
    margin-right: 0.5rem;
}

.yt-error {
    text-align: center;
    padding: 2rem;
    color: #dc2626;
}

.yt-error i {
    margin-right: 0.5rem;
}

/* VideoObject Schema - hidden but indexed by Google */
[itemtype="https://schema.org/VideoObject"] meta {
    display: none;
}
```

## API Quota Information

- **Daily quota:** 10,000 units (free tier)
- **Search request:** 100 units
- **Video details request:** 1 unit per video
- **Per fetch cost:** ~103 units (1 search + 3 video details)
- **Max fetches per day:** ~97 fetches
- **With caching:** Effectively unlimited (refreshes every 1 hour)

## Testing

1. Open browser console (F12)
2. Look for errors
3. Check Network tab for API calls
4. Verify videos appear in container

## Troubleshooting

### "Unable to load videos"
- Check API key is correct
- Verify API key has YouTube Data API enabled
- Check browser console for specific errors

### Videos not showing
- Check container ID matches: `youtube-videos-container`
- Verify script is loaded: Check Sources tab in DevTools

### API quota exceeded
- Wait 24 hours for quota reset
- Increase `CACHE_DURATION` to reduce API calls

## Security Notes

⚠️ **API Key Exposure:** The API key is visible in client-side JavaScript. This is acceptable for read-only public data (like YouTube videos), but:
- Restrict your API key to HTTP referrers in Google Cloud Console
- Only enable "YouTube Data API v3" for this key
- Don't use this key for other Google APIs

### To Restrict API Key:
1. Google Cloud Console → Credentials
2. Click your API key
3. Application restrictions → HTTP referrers
4. Add your domains:
   - `gtacarsph.com/*`
   - `www.gtacarsph.com/*`
   - `gtacarsph.github.io/*`

## Advanced: Manual Refresh

To manually refresh videos from browser console:
```javascript
GTACarsPH.refreshYouTube();
```

## SEO Benefits

Each video includes:
- ✅ VideoObject Schema markup
- ✅ Thumbnail URL for rich snippets
- ✅ Upload date for freshness
- ✅ View count for social proof
- ✅ Unique description for indexing
- ✅ Proper heading hierarchy

This helps Google:
1. Index your videos
2. Show video rich snippets in search results
3. Understand video content
4. Display in Google Video search

## Next Steps

1. Get API key and channel ID
2. Update the configuration
3. Test locally
4. Deploy to production
5. Submit sitemap to Google Search Console
6. Monitor performance
