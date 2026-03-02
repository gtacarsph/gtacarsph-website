/**
 * GTACarsPH Gallery Management System
 * Manage testimonial and gallery photos
 */

const GALLERY_KEY = 'gtacarsph_gallery';

// Initialize gallery if empty
function initGallery() {
    if (!localStorage.getItem(GALLERY_KEY)) {
        localStorage.setItem(GALLERY_KEY, JSON.stringify([]));
    }
}

// Get all gallery items
function getAllGalleryItems() {
    return JSON.parse(localStorage.getItem(GALLERY_KEY) || '[]');
}

// Add gallery item
function addGalleryItem(itemData) {
    const items = getAllGalleryItems();
    const newItem = {
        id: Date.now().toString(),
        ...itemData,
        createdAt: new Date().toISOString()
    };
    items.push(newItem);
    localStorage.setItem(GALLERY_KEY, JSON.stringify(items));
    return newItem;
}

// Update gallery item
function updateGalleryItem(id, updates) {
    const items = getAllGalleryItems();
    const index = items.findIndex(item => item.id === id);
    if (index !== -1) {
        items[index] = { ...items[index], ...updates };
        localStorage.setItem(GALLERY_KEY, JSON.stringify(items));
        return items[index];
    }
    return null;
}

// Delete gallery item
function deleteGalleryItem(id) {
    const items = getAllGalleryItems();
    const filtered = items.filter(item => item.id !== id);
    localStorage.setItem(GALLERY_KEY, JSON.stringify(filtered));
    return filtered.length < items.length;
}

// Get gallery items by category
function getGalleryByCategory(category) {
    if (category === 'all') return getAllGalleryItems();
    return getAllGalleryItems().filter(item => item.category === category);
}

// Get gallery categories
function getGalleryCategories() {
    return [
        { value: 'testimonials', label: 'Client Testimonials', icon: 'fa-comments' },
        { value: 'transformations', label: 'Car Transformations', icon: 'fa-magic' },
        { value: 'showroom', label: 'Showroom', icon: 'fa-store' },
        { value: 'events', label: 'Events', icon: 'fa-calendar' },
        { value: 'team', label: 'Team', icon: 'fa-users' }
    ];
}

// Search gallery
function searchGallery(query) {
    const items = getAllGalleryItems();
    const lowerQuery = query.toLowerCase();
    return items.filter(item => 
        item.title?.toLowerCase().includes(lowerQuery) ||
        item.description?.toLowerCase().includes(lowerQuery) ||
        item.clientName?.toLowerCase().includes(lowerQuery)
    );
}

// Convert file to base64
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// Initialize on load
initGallery();