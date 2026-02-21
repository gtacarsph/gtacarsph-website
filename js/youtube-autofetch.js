/**
 * GTACarsPH YouTube Auto-Fetcher
 * Fetches latest videos from YouTube channel and displays with SEO optimization
 */

(function() {
    'use strict';
    
    // Configuration
    const CONFIG = {
        API_KEY: 'YOUR_YOUTUBE_API_KEY', // Replace with your API key
        CHANNEL_ID: 'YOUR_CHANNEL_ID', // Replace with your channel ID
        MAX_RESULTS: 3,
        CACHE_DURATION: 3600000, // 1 hour in milliseconds
        CONTAINER_ID: 'youtube-videos-container'
    };
    
    // Cache mechanism
    const CACHE_KEY = 'gtacarsph_yt_cache';
    const CACHE_TIMESTAMP_KEY = 'gtacarsph_yt_cache_time';
    
    /**
     * Initialize YouTube fetcher
     */
    function init() {
        const container = document.getElementById(CONFIG.CONTAINER_ID);
        if (!container) {
            console.warn('YouTube container not found:', CONFIG.CONTAINER_ID);
            return;
        }
        
        // Try to load from cache first
        const cached = loadFromCache();
        if (cached) {
            renderVideos(cached);
            return;
        }
        
        // Fetch from API
        fetchVideos();
    }
    
    /**
     * Load videos from cache
     */
    function loadFromCache() {
        try {
            const cached = localStorage.getItem(CACHE_KEY);
            const timestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);
            
            if (!cached || !timestamp) return null;
            
            const age = Date.now() - parseInt(timestamp);
            if (age > CONFIG.CACHE_DURATION) {
                // Cache expired
                localStorage.removeItem(CACHE_KEY);
                localStorage.removeItem(CACHE_TIMESTAMP_KEY);
                return null;
            }
            
            return JSON.parse(cached);
        } catch (e) {
            console.error('Cache error:', e);
            return null;
        }
    }
    
    /**
     * Save videos to cache
     */
    function saveToCache(videos) {
        try {
            localStorage.setItem(CACHE_KEY, JSON.stringify(videos));
            localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
        } catch (e) {
            console.error('Save cache error:', e);
        }
    }
    
    /**
     * Fetch videos from YouTube API
     */
    async function fetchVideos() {
        const container = document.getElementById(CONFIG.CONTAINER_ID);
        
        // Show loading state
        container.innerHTML = '<div class="yt-loading"><i class="fas fa-spinner fa-spin"></i> Loading videos...</div>';
        
        try {
            // Search for latest videos from channel
            const searchUrl = `https://www.googleapis.com/youtube/v3/search?key=${CONFIG.API_KEY}&channelId=${CONFIG.CHANNEL_ID}&part=snippet,id&order=date&maxResults=${CONFIG.MAX_RESULTS}&type=video`;
            
            const searchResponse = await fetch(searchUrl);
            if (!searchResponse.ok) throw new Error('Failed to fetch videos');
            
            const searchData = await searchResponse.json();
            
            if (!searchData.items || searchData.items.length === 0) {
                container.innerHTML = '<div class="yt-error">No videos found</div>';
                return;
            }
            
            // Get video details (statistics)
            const videoIds = searchData.items.map(item => item.id.videoId).join(',');
            const detailsUrl = `https://www.googleapis.com/youtube/v3/videos?key=${CONFIG.API_KEY}&id=${videoIds}&part=statistics,snippet`;
            
            const detailsResponse = await fetch(detailsUrl);
            if (!detailsResponse.ok) throw new Error('Failed to fetch video details');
            
            const detailsData = await detailsResponse.json();
            
            // Combine search and details data
            const videos = searchData.items.map(searchItem => {
                const details = detailsData.items.find(d => d.id === searchItem.id.videoId);
                return {
                    id: searchItem.id.videoId,
                    title: searchItem.snippet.title,
                    description: searchItem.snippet.description,
                    thumbnail: searchItem.snippet.thumbnails.high?.url || searchItem.snippet.thumbnails.medium?.url || searchItem.snippet.thumbnails.default.url,
                    publishedAt: searchItem.snippet.publishedAt,
                    viewCount: details?.statistics?.viewCount || '0',
                    likeCount: details?.statistics?.likeCount || '0',
                    channelTitle: searchItem.snippet.channelTitle
                };
            });
            
            // Save to cache
            saveToCache(videos);
            
            // Render
            renderVideos(videos);
            
        } catch (error) {
            console.error('YouTube fetch error:', error);
            container.innerHTML = '<div class="yt-error"><i class="fas fa-exclamation-circle"></i> Unable to load videos. Please try again later.</div>';
        }
    }
    
    /**
     * Format view count (e.g., 15000 -> 15K)
     */
    function formatViewCount(count) {
        const num = parseInt(count);
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toString();
    }
    
    /**
     * Format relative time (e.g., 2026-02-20 -> 2 days ago)
     */
    function formatRelativeTime(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return diffDays + ' days ago';
        if (diffDays < 30) return Math.floor(diffDays / 7) + ' weeks ago';
        if (diffDays < 365) return Math.floor(diffDays / 30) + ' months ago';
        return Math.floor(diffDays / 365) + ' years ago';
    }
    
    /**
     * Generate hashtags from title and description
     */
    function generateHashtags(title, description) {
        const combined = (title + ' ' + description).toLowerCase();
        const keywords = [];
        
        // Car brand keywords
        const brands = ['toyota', 'honda', 'ford', 'mitsubishi', 'nissan', 'hyundai', 'kia', 'suzuki', 'mazda'];
        brands.forEach(brand => {
            if (combined.includes(brand)) keywords.push('#' + brand.charAt(0).toUpperCase() + brand.slice(1));
        });
        
        // Generic car keywords
        if (combined.includes('review')) keywords.push('#CarReviewPH');
        if (combined.includes('buy') || combined.includes('bili')) keywords.push('#BuyCarPH');
        if (combined.includes('sell')) keywords.push('#SellCarPH');
        if (combined.includes('second hand') || combined.includes('used')) keywords.push('#SecondHandCars');
        if (combined.includes('tips')) keywords.push('#CarTips');
        
        // Always add brand hashtag
        keywords.push('#GTACarsPH');
        
        return keywords.slice(0, 5); // Max 5 hashtags
    }
    
    /**
     * Render videos to container
     */
    function renderVideos(videos) {
        const container = document.getElementById(CONFIG.CONTAINER_ID);
        
        if (!videos || videos.length === 0) {
            container.innerHTML = '<div class="yt-error">No videos available</div>';
            return;
        }
        
        const html = videos.map((video, index) => {
            const hashtags = generateHashtags(video.title, video.description);
            const uniqueId = `video-schema-${video.id}`;
            
            return `
                <article class="video-card scroll-reveal" itemscope itemtype="https://schema.org/VideoObject">
                    <meta itemprop="@id" content="https://gtacarsph.com/#${video.id}">
                    <meta itemprop="name" content="${escapeHtml(video.title)}">
                    <meta itemprop="description" content="${escapeHtml(video.description.substring(0, 200))}">
                    <meta itemprop="thumbnailUrl" content="${video.thumbnail}">
                    <meta itemprop="uploadDate" content="${video.publishedAt}">
                    <meta itemprop="contentUrl" content="https://youtube.com/watch?v=${video.id}">
                    <meta itemprop="embedUrl" content="https://youtube.com/embed/${video.id}">
                    <link itemprop="author" href="https://youtube.com/@RaffaGTACARS">
                    
                    <div class="video-thumbnail">
                        <iframe 
                            src="https://www.youtube.com/embed/${video.id}" 
                            title="${escapeHtml(video.title)}"
                            allowfullscreen 
                            loading="lazy"
                            itemprop="video"
                        ></iframe>
                    </div>
                    
                    <div class="video-content">
                        <h4 itemprop="headline">${escapeHtml(video.title)}</h4>
                        <p class="video-desc" itemprop="description">${escapeHtml(video.description.substring(0, 150))}...</p>
                        <div class="hashtags">
                            ${hashtags.map(tag => `<span>${tag}</span>`).join('')}
                        </div>
                        <div class="video-meta">
                            <span><i class="fas fa-eye"></i> ${formatViewCount(video.viewCount)} views</span>
                            <span><i class="fas fa-calendar"></i> ${formatRelativeTime(video.publishedAt)}</span>
                        </div>
                    </div>
                </article>
            `;
        }).join('');
        
        container.innerHTML = html;
        
        // Re-trigger scroll reveal animations
        if (typeof observeScrollReveal === 'function') {
            observeScrollReveal();
        }
    }
    
    /**
     * Escape HTML to prevent XSS
     */
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // Expose for manual refresh
    window.GTACarsPH = window.GTACarsPH || {};
    window.GTACarsPH.refreshYouTube = fetchVideos;
    
})();
