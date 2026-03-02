/**
 * GTACarsPH Theme Customization System
 * Handle website background and styling changes
 */

const THEME_KEY = 'gtacarsph_theme';

// Default theme settings
const defaultTheme = {
    backgroundColor: '#0f0f0f',
    backgroundGradient: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 50%, #16213e 100%)',
    accentColor: '#dc2626',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    customCSS: '',
    backgroundImage: '',
    updatedAt: new Date().toISOString()
};

// Initialize theme
function initTheme() {
    if (!localStorage.getItem(THEME_KEY)) {
        localStorage.setItem(THEME_KEY, JSON.stringify(defaultTheme));
    }
    applyTheme();
}

// Get current theme
function getTheme() {
    return JSON.parse(localStorage.getItem(THEME_KEY) || JSON.stringify(defaultTheme));
}

// Update theme
function updateTheme(updates) {
    const currentTheme = getTheme();
    const newTheme = { 
        ...currentTheme, 
        ...updates, 
        updatedAt: new Date().toISOString() 
    };
    localStorage.setItem(THEME_KEY, JSON.stringify(newTheme));
    applyTheme();
    return newTheme;
}

// Apply theme to website
function applyTheme() {
    const theme = getTheme();
    
    // Remove existing custom theme styles
    const existingStyle = document.getElementById('gtacarsph-custom-theme');
    if (existingStyle) {
        existingStyle.remove();
    }
    
    // Create new style element
    const style = document.createElement('style');
    style.id = 'gtacarsph-custom-theme';
    
    let css = `
        :root {
            --gt-accent-color: ${theme.accentColor};
            --gt-bg-color: ${theme.backgroundColor};
        }
        
        body {
            background: ${theme.backgroundImage ? `url(${theme.backgroundImage})` : theme.backgroundGradient} !important;
            background-size: cover !important;
            background-position: center !important;
            background-attachment: fixed !important;
        }
        
        body::before {
            content: '';
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: ${theme.backgroundGradient};
            opacity: ${theme.backgroundImage ? '0.85' : '1'};
            z-index: -1;
        }
    `;
    
    // Add custom CSS if any
    if (theme.customCSS) {
        css += '\n' + theme.customCSS;
    }
    
    style.textContent = css;
    document.head.appendChild(style);
}

// Reset to default theme
function resetTheme() {
    localStorage.setItem(THEME_KEY, JSON.stringify(defaultTheme));
    applyTheme();
    return defaultTheme;
}

// Get preset gradients
function getGradientPresets() {
    return [
        { name: 'Midnight', value: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 50%, #16213e 100%)' },
        { name: 'Red Dark', value: 'linear-gradient(135deg, #1a0505 0%, #2d0a0a 50%, #450a0a 100%)' },
        { name: 'Blue Ocean', value: 'linear-gradient(135deg, #0a1628 0%, #1e3a5f 50%, #2d5a87 100%)' },
        { name: 'Purple Dark', value: 'linear-gradient(135deg, #1a0a2e 0%, #2d1b4e 50%, #4a1c6b 100%)' },
        { name: 'Green Dark', value: 'linear-gradient(135deg, #0a2815 0%, #1a4a2e 50%, #2d6a4f 100%)' },
        { name: 'Pure Black', value: '#0a0a0a' },
        { name: 'Charcoal', value: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #404040 100%)' }
    ];
}

// Get accent color presets
function getAccentPresets() {
    return [
        { name: 'Red', value: '#dc2626' },
        { name: 'Blue', value: '#2563eb' },
        { name: 'Green', value: '#16a34a' },
        { name: 'Orange', value: '#ea580c' },
        { name: 'Purple', value: '#9333ea' },
        { name: 'Pink', value: '#db2777' },
        { name: 'Cyan', value: '#0891b2' },
        { name: 'Yellow', value: '#ca8a04' }
    ];
}

// Export theme settings
function exportTheme() {
    const theme = getTheme();
    const dataStr = JSON.stringify(theme, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `gtacarsph-theme-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
}

// Import theme settings
function importTheme(jsonString) {
    try {
        const theme = JSON.parse(jsonString);
        localStorage.setItem(THEME_KEY, JSON.stringify(theme));
        applyTheme();
        return { success: true };
    } catch (e) {
        return { success: false, error: 'Invalid theme file' };
    }
}

// Handle background image upload (base64)
function setBackgroundImage(base64Image) {
    updateTheme({ backgroundImage: base64Image });
}

// Remove background image
function removeBackgroundImage() {
    updateTheme({ backgroundImage: '' });
}

// Get theme last updated
function getThemeLastUpdated() {
    const theme = getTheme();
    return theme.updatedAt ? new Date(theme.updatedAt).toLocaleString('en-PH') : 'Never';
}

// Initialize on load
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', initTheme);
}