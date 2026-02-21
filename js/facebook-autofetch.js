/**
 * GTACarsPH Facebook Page Auto-Fetcher
 * Fetches latest posts from BentaKotse Manila Facebook Page
 * SEO-optimized with SocialMediaPosting Schema
 */

(function() {
    'use strict';
    
    // Configuration
    const CONFIG = {
        PAGE_ID: '804238446305658', // BentaKotse Manila
        ACCESS_TOKEN: 'YOUR_PAGE_ACCESS_TOKEN', // Replace with Page Access Token
        MAX_RESULTS: 5,
        CACHE_DURATION: 1800000, // 30 minutes in milliseconds
        CONTAINER_ID: 'facebook-posts-container',
        DEFAULT_IMAGE: 'https://gtacarsph.com/logo.jpg'
    };
    
    // Cache mechanism
    const CACHE_KEY = 'gtacarsph_fb_cache';
    const CACHE_TIMESTAMP_KEY = 'gtacarsph_fb_cache_time';
    
    /**
     * Initialize Facebook fetcher
     */
    function init() {
        const container = document.getElementById(CONFIG.CONTAINER_ID);
        if (!container) {
            console.warn('Facebook container not found:', CONFIG.CONTAINER_ID);
            return;
        }
        
        // Try to load from cache first
        const cached = loadFromCache();
        if (cached) {
            renderPosts(cached);
            return;
        }
        
        // Fetch from API
        fetchPosts();
    }
    
    /**
     * Load posts from cache
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
     * Save posts to cache
     */
    function saveToCache(posts) {
        try {
            localStorage.setItem(CACHE_KEY, JSON.stringify(posts));
            localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
        } catch (e) {
            console.error('Save cache error:', e);
        }
    }
    
    /**
     * Fetch posts from Facebook Graph API
     */
    async function fetchPosts() {
        const container = document.getElementById(CONFIG.CONTAINER_ID);
        
        // Show loading state
        container.innerHTML = '<div class="fb-loading"><i class="fab fa-facebook fa-spin"></i> Loading posts...</div>';
        
        try {
            // Facebook Graph API endpoint
            const fields = 'id,message,created_time,full_picture,permalink_url,likes.summary(true),comments.summary(true),shares';
            const apiUrl = `https://graph.facebook.com/v18.0/${CONFIG.PAGE_ID}/posts?access_token=${CONFIG.ACCESS_TOKEN}&fields=${fields}&limit=${CONFIG.MAX_RESULTS}`;
            
            const response = await fetch(apiUrl);
            
            if (!response.ok) {
                // If API fails, show fallback embed
                showFallbackEmbed(container);
                return;
            }
            
            const data = await response.json();
            
            if (!data.data || data.data.length === 0) {
                showFallbackEmbed(container);
                return;
            }
            
            // Process posts
            const posts = data.data.map(post => ({
                id: post.id,
                message: post.message || '',
                createdTime: post.created_time,
                image: post.full_picture || null,
                permalink: post.permalink_url,
                likes: post.likes?.summary?.total_count || 0,
                comments: post.comments?.summary?.total_count || 0,
                shares: post.shares?.count || 0
            }));
            
            // Save to cache
            saveToCache(posts);
            
            // Render
            renderPosts(posts);
            
        } catch (error) {
            console.error('Facebook fetch error:', error);
            showFallbackEmbed(container);
        }
    }
    
    /**
     * Show fallback Facebook Page embed if API fails
     */
    function showFallbackEmbed(container) {
        container.innerHTML = `
            <div class="fb-page-embed">
                <iframe 
                    src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2FBentaKotseManila&tabs=timeline&width=500&height=500&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&appId"
                    width="100%" 
                    height="500" 
                    style="border:none;overflow:hidden;border-radius:12px;"
                    scrolling="no" 
                    frameborder="0" 
                    allowfullscreen="true" 
                    allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share">
                </iframe>
            </div>
        `;
    }
    
    /**
     * Format relative time (e.g., 2026-02-20 -> 2 hours ago)
     */
    function formatRelativeTime(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        
        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return diffMins + 'm ago';
        if (diffHours < 24) return diffHours + 'h ago';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return diffDays + ' days ago';
        if (diffDays < 30) return Math.floor(diffDays / 7) + ' weeks ago';
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
    
    /**
     * Format engagement numbers
     */
    function formatCount(count) {
        if (count >= 1000) return (count / 1000).toFixed(1) + 'K';
        return count.toString();
    }
    
    /**
     * Extract hashtags and mentions from message
     */
    function extractTags(message) {
        const hashtags = message.match(/#[\w\u4e00-\u9fa5]+/g) || [];
        const mentions = message.match(/@[\w\.]+/g) || [];
        return { hashtags, mentions };
    }
    
    /**
     * Truncate message with read more link
     */
    function truncateMessage(message, maxLength = 150) {
        if (message.length <= maxLength) return escapeHtml(message);
        
        const truncated = message.substring(0, maxLength).trim();
        return escapeHtml(truncated) + '...';
    }
    
    /**
     * Render posts to container
     */
    function renderPosts(posts) {
        const container = document.getElementById(CONFIG.CONTAINER_ID);
        
        if (!posts || posts.length === 0) {
            showFallbackEmbed(container);
            return;
        }
        
        const html = `
            <div class="fb-posts-grid">
                ${posts.map((post, index) => {
                    const { hashtags } = extractTags(post.message);
                    const cleanMessage = post.message.replace(/#[\w\u4e00-\u9fa5]+/g, '').replace(/@[\w\.]+/g, '').trim();
                    const uniqueId = `fb-post-${post.id.replace('_', '-')}`;
                    
                    return `
                        <article class="fb-post-card scroll-reveal" itemscope itemtype="https://schema.org/SocialMediaPosting">
                            <meta itemprop="@id" content="https://gtacarsph.com/#fb-${post.id}">
                            <meta itemprop="url" content="${post.permalink}">
                            <meta itemprop="datePublished" content="${post.createdTime}">
                            <meta itemprop="author" content="BentaKotse Manila">
                            
                            <div class="fb-post-header">
                                <img src="https://graph.facebook.com/${CONFIG.PAGE_ID}/picture?type=small" 
                                     alt="BentaKotse Manila" 
                                     class="fb-page-avatar"
                                     loading="lazy">
                                <div class="fb-post-meta">
                                    <h4 itemprop="author">BentaKotse Manila</h4>
                                    <span class="fb-post-time">${formatRelativeTime(post.createdTime)}</span>
                                </div>
                                <a href="${post.permalink}" target="_blank" class="fb-icon-link" aria-label="View on Facebook">
                                    <i class="fab fa-facebook"></i>
                                </a>
                            </div>
                            
                            <div class="fb-post-content">
                                <p itemprop="articleBody">${truncateMessage(cleanMessage || 'Check out our latest update!')}</p>
                                ${hashtags.length > 0 ? `
                                    <div class="fb-hashtags">
                                        ${hashtags.slice(0, 3).map(tag => `<span>${tag}</span>`).join('')}
                                    </div>
                                ` : ''}
                            </div>
                            
                            ${post.image ? `
                                <div class="fb-post-image">
                                    <img src="${post.image}" 
                                         alt="Facebook post image" 
                                         loading="lazy"
                                         itemprop="image"
                                         onerror="this.style.display='none'">
                                </div>
                            ` : ''}
                            
                            <div class="fb-post-stats">
                                <span><i class="fas fa-thumbs-up"></i> ${formatCount(post.likes)}</span>
                                <span><i class="fas fa-comment"></i> ${formatCount(post.comments)}</span>
                                <span><i class="fas fa-share"></i> ${formatCount(post.shares)}</span>
                            </div>
                            
                            <a href="${post.permalink}" target="_blank" class="fb-view-btn" itemprop="url">
                                <i class="fab fa-facebook"></i> View on Facebook
                            </a>
                        </article>
                    `;
                }).join('')}
            </div>
            
            <div class="fb-follow-cta">
                <a href="https://facebook.com/BentaKotseManila" target="_blank" class="fb-follow-btn">
                    <i class="fab fa-facebook"></i> Follow BentaKotse Manila
                </a>
            </div>
        `;
        
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
    window.GTACarsPH.refreshFacebook = fetchPosts;
    
})();
