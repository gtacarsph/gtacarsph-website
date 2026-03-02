// GTACarsPH Admin Dashboard Controller

// Initialize dashboard
function initDashboard() {
    if (!requireAuth()) return;

    loadUserInfo();
    loadDashboardStats();
    loadCarsTable();
    loadSubmissionsTable();
    loadRecentSubmissions();
    loadGalleryTable();
    initThemePresets();
    loadProfileInfo();
}

// Temporary storage for car images before save
let tempCarImages = [];
// Temporary storage for gallery image
let tempGalleryImage = null;

// Load user info
function loadUserInfo() {
    const user = getCurrentUser();
    if (user) {
        document.getElementById('userName').textContent = user.fullName || user.username;
        document.getElementById('userRole').textContent = user.role || 'Administrator';
    }
}

// Load dashboard stats
function loadDashboardStats() {
    const cars = getAllCars();
    const available = getAvailableCars();
    const submissions = getAllSubmissions();
    const stats = getSubmissionStats();
    const gallery = getAllGalleryItems();

    document.getElementById('totalCars').textContent = cars.length;
    document.getElementById('availableCars').textContent = available.length;
    document.getElementById('carsBadge').textContent = available.length;

    document.getElementById('totalSubmissions').textContent = submissions.length;
    document.getElementById('newSubmissions').textContent = stats.new;
    document.getElementById('submissionsBadge').textContent = stats.new;

    document.getElementById('galleryBadge').textContent = gallery.length;
}

// Navigation
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.section-content').forEach(el => {
        el.classList.remove('active');
    });
    
    // Show selected section
    document.getElementById(sectionId + '-section').classList.add('active');
    
    // Update nav items
    document.querySelectorAll('.nav-item').forEach(el => {
        el.classList.remove('active');
    });
    event.target.closest('.nav-item').classList.add('active');
    
    // Refresh data
    if (sectionId === 'cars') loadCarsTable();
    if (sectionId === 'submissions') loadSubmissionsTable();
    if (sectionId === 'gallery') loadGalleryTable();
    if (sectionId === 'dashboard') {
        loadDashboardStats();
        loadRecentSubmissions();
    }
}

// Cars Management
function loadCarsTable() {
    const cars = getAllCars();
    const tbody = document.getElementById('carsTable');

    if (cars.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="empty-state">No cars yet. Add your first car!</td></tr>';
        return;
    }

    tbody.innerHTML = cars.map(car => {
        const thumbnail = getCarThumbnail(car);
        return `
        <tr>
            <td>
                <div style="display: flex; align-items: center; gap: 15px;">
                    ${thumbnail
                        ? `<img src="${thumbnail}" class="car-thumbnail" alt="${car.brand}">`
                        : `<div class="car-thumbnail-placeholder"><i class="fas fa-car"></i></div>`
                    }
                    <div>
                        <strong>${car.brand} ${car.model}</strong>
                        <br><small style="color:#888">${car.description?.substring(0, 40) || ''}...</small>
                        ${car.images && car.images.length > 0 ? `<br><small style="color:#dc2626"><i class="fas fa-images"></i> ${car.images.length} photo${car.images.length > 1 ? 's' : ''}</small>` : ''}
                    </div>
                </div>
            </td>
            <td>${car.year}</td>
            <td>₱${car.price?.toLocaleString() || '0'}</td>
            <td>${car.category || 'N/A'}</td>
            <td><span class="status-badge status-${car.status}">${car.status}</span></td>
            <td>
                <div class="action-btns">
                    <button class="action-btn" onclick="editCar('${car.id}')" title="Edit"><i class="fas fa-edit"></i></button>
                    <button class="action-btn" onclick="deleteCarItem('${car.id}')" title="Delete"><i class="fas fa-trash"></i></button>
                </div>
            </td>
        </tr>
    `}).join('');
}

function openCarModal(carId = null) {
    document.getElementById('carModalTitle').textContent = carId ? 'Edit Car' : 'Add New Car';
    document.getElementById('carId').value = carId || '';
    tempCarImages = [];

    if (carId) {
        const car = getCarById(carId);
        if (car) {
            document.getElementById('carBrand').value = car.brand;
            document.getElementById('carModel').value = car.model;
            document.getElementById('carYear').value = car.year;
            document.getElementById('carPrice').value = car.price;
            document.getElementById('carCategory').value = car.category;
            document.getElementById('carStatus').value = car.status;
            document.getElementById('carDescription').value = car.description || '';
            // Load existing images
            if (car.images && car.images.length > 0) {
                tempCarImages = [...car.images];
                renderCarImagePreviews();
            }
        }
    } else {
        document.getElementById('carForm').reset();
        document.getElementById('carImagePreview').innerHTML = '';
    }

    document.getElementById('carModal').classList.add('show');
}

function closeCarModal() {
    document.getElementById('carModal').classList.remove('show');
    tempCarImages = [];
}

function saveCar() {
    const carId = document.getElementById('carId').value;
    const carData = {
        brand: document.getElementById('carBrand').value,
        model: document.getElementById('carModel').value,
        year: parseInt(document.getElementById('carYear').value),
        price: parseInt(document.getElementById('carPrice').value),
        category: document.getElementById('carCategory').value,
        status: document.getElementById('carStatus').value,
        description: document.getElementById('carDescription').value,
        images: tempCarImages
    };

    if (carId) {
        updateCar(carId, carData);
    } else {
        addCar(carData);
    }

    closeCarModal();
    loadCarsTable();
    loadDashboardStats();
}

function editCar(carId) {
    openCarModal(carId);
}

function deleteCarItem(carId) {
    if (confirm('Are you sure you want to delete this car?')) {
        deleteCar(carId);
        loadCarsTable();
        loadDashboardStats();
    }
}

function searchCarsTable() {
    const query = document.getElementById('carSearch').value;
    const cars = query ? searchCars(query) : getAllCars();
    renderCarsTable(cars);
}

function filterCarsTable() {
    const category = document.getElementById('carFilter').value;
    const cars = filterByCategory(category);
    renderCarsTable(cars);
}

function renderCarsTable(cars) {
    const tbody = document.getElementById('carsTable');
    if (cars.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="empty-state">No cars found</td></tr>';
        return;
    }
    
    tbody.innerHTML = cars.map(car => `
        <tr>
            <td><strong>${car.brand} ${car.model}</strong></td>
            <td>${car.year}</td>
            <td>₱${car.price?.toLocaleString() || '0'}</td>
            <td>${car.category || 'N/A'}</td>
            <td><span class="status-badge status-${car.status}">${car.status}</span></td>
            <td>
                <div class="action-btns">
                    <button class="action-btn" onclick="editCar('${car.id}')"><i class="fas fa-edit"></i></button>
                    <button class="action-btn" onclick="deleteCarItem('${car.id}')"><i class="fas fa-trash"></i></button>
                </div>
            </td>
        </tr>
    `).join('');
}

function exportCars() {
    exportCarsToJSON();
}

// Submissions Management
function loadSubmissionsTable() {
    const submissions = getAllSubmissions();
    renderSubmissionsTable(submissions);
}

function renderSubmissionsTable(submissions) {
    const tbody = document.getElementById('submissionsTable');
    
    if (submissions.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="empty-state">No submissions yet</td></tr>';
        return;
    }
    
    tbody.innerHTML = submissions.map(sub => `
        <tr>
            <td><strong>${sub.name}</strong></td>
            <td>${sub.phone}<br><small>${sub.email || ''}</small></td>
            <td>${sub.brand} ${sub.model} (${sub.year})</td>
            <td>${new Date(sub.createdAt).toLocaleDateString()}</td>
            <td><span class="status-badge status-${sub.status}">${sub.status}</span></td>
            <td>
                <div class="action-btns">
                    <button class="action-btn" onclick="viewSubmission('${sub.id}')" title="View"><i class="fas fa-eye"></i></button>
                    <button class="action-btn" onclick="deleteSubmissionItem('${sub.id}')" title="Delete"><i class="fas fa-trash"></i></button>
                </div>
            </td>
        </tr>
    `).join('');
}

function loadRecentSubmissions() {
    const submissions = getAllSubmissions().slice(-5).reverse();
    const tbody = document.getElementById('recentSubmissionsTable');
    
    if (submissions.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;padding:30px;color:#888">No submissions yet</td></tr>';
        return;
    }
    
    tbody.innerHTML = submissions.map(sub => `
        <tr>
            <td>${sub.name}</td>
            <td>${sub.brand} ${sub.model}</td>
            <td>${new Date(sub.createdAt).toLocaleDateString()}</td>
            <td><span class="status-badge status-${sub.status}">${sub.status}</span></td>
        </tr>
    `).join('');
}

let currentSubmissionId = null;

function viewSubmission(submissionId) {
    currentSubmissionId = submissionId;
    const sub = getSubmissionById(submissionId);
    if (!sub) return;
    
    document.getElementById('submissionDetails').innerHTML = `
        <div class="form-grid">
            <div class="form-group">
                <label>Seller Name</label>
                <input type="text" class="form-control" value="${sub.name}" readonly>
            </div>
            <div class="form-group">
                <label>Phone</label>
                <input type="text" class="form-control" value="${sub.phone}" readonly>
            </div>
            <div class="form-group">
                <label>Email</label>
                <input type="text" class="form-control" value="${sub.email || 'N/A'}" readonly>
            </div>
            <div class="form-group">
                <label>Location</label>
                <input type="text" class="form-control" value="${sub.location || 'N/A'}" readonly>
            </div>
            <div class="form-group">
                <label>Vehicle Brand</label>
                <input type="text" class="form-control" value="${sub.brand}" readonly>
            </div>
            <div class="form-group">
                <label>Vehicle Model</label>
                <input type="text" class="form-control" value="${sub.model}" readonly>
            </div>
            <div class="form-group">
                <label>Year</label>
                <input type="text" class="form-control" value="${sub.year}" readonly>
            </div>
            <div class="form-group">
                <label>Expected Price</label>
                <input type="text" class="form-control" value="${sub.expectedPrice || 'Not specified'}" readonly>
            </div>
        </div>
        <div class="form-group" style="margin-top: 20px;">
            <label>Status</label>
            <select class="form-control" id="submissionStatusUpdate">
                <option value="new" ${sub.status === 'new' ? 'selected' : ''}>New</option>
                <option value="contacted" ${sub.status === 'contacted' ? 'selected' : ''}>Contacted</option>
                <option value="resolved" ${sub.status === 'resolved' ? 'selected' : ''}>Resolved</option>
                <option value="closed" ${sub.status === 'closed' ? 'selected' : ''}>Closed</option>
            </select>
        </div>
        <div class="form-group">
            <label>Notes</label>
            <textarea class="form-control" id="submissionNotes" rows="3">${sub.notes || ''}</textarea>
        </div>
        <div style="background:rgba(59,130,246,0.1);padding:15px;border-radius:8px;margin-top:15px;font-size:13px;">
            <i class="fas fa-envelope" style="color:#3b82f6"></i> 
            Email notification ${sub.emailSent ? 'was sent to info.gtacarsph@gmail.com' : 'failed to send'}
            <br><small>Submitted: ${new Date(sub.createdAt).toLocaleString()}</small>
        </div>
    `;
    
    document.getElementById('submissionModal').classList.add('show');
}

function closeSubmissionModal() {
    document.getElementById('submissionModal').classList.remove('show');
    currentSubmissionId = null;
}

function updateSubmissionStatusFromModal() {
    if (!currentSubmissionId) return;
    
    const status = document.getElementById('submissionStatusUpdate').value;
    const notes = document.getElementById('submissionNotes').value;
    
    updateSubmissionStatus(currentSubmissionId, status, notes);
    closeSubmissionModal();
    loadSubmissionsTable();
    loadRecentSubmissions();
    loadDashboardStats();
}

function deleteSubmissionItem(submissionId) {
    if (confirm('Are you sure you want to delete this submission?')) {
        deleteSubmission(submissionId);
        loadSubmissionsTable();
        loadDashboardStats();
    }
}

function searchSubmissionsTable() {
    const query = document.getElementById('submissionSearch').value;
    const submissions = query ? searchSubmissions(query) : getAllSubmissions();
    renderSubmissionsTable(submissions);
}

function filterSubmissionsTable() {
    const status = document.getElementById('submissionFilter').value;
    const submissions = filterSubmissionsByStatus(status);
    renderSubmissionsTable(submissions);
}

// Theme Management
function initThemePresets() {
    const gradients = getGradientPresets();
    const accents = getAccentPresets();
    
    document.getElementById('gradientPresets').innerHTML = gradients.map(g => `
        <div class="color-preset" style="background: ${g.value}" 
             title="${g.name}" onclick="selectGradient('${g.value}')" data-gradient="${g.value}"></div>
    `).join('');
    
    document.getElementById('accentPresets').innerHTML = accents.map(a => `
        <div class="color-preset" style="background: ${a.value}" 
             title="${a.name}" onclick="selectAccent('${a.value}')" data-accent="${a.value}"></div>
    `).join('');
    
    // Load current theme
    const theme = getTheme();
    document.getElementById('customCSS').value = theme.customCSS || '';
}

let selectedGradient = null;
let selectedAccent = null;

function selectGradient(gradient) {
    selectedGradient = gradient;
    document.querySelectorAll('#gradientPresets .color-preset').forEach(el => {
        el.classList.toggle('active', el.dataset.gradient === gradient);
    });
}

function selectAccent(accent) {
    selectedAccent = accent;
    document.querySelectorAll('#accentPresets .color-preset').forEach(el => {
        el.classList.toggle('active', el.dataset.accent === accent);
    });
}

function saveThemeSettings() {
    const updates = {
        customCSS: document.getElementById('customCSS').value
    };
    
    if (selectedGradient) {
        updates.backgroundGradient = selectedGradient;
    }
    if (selectedAccent) {
        updates.accentColor = selectedAccent;
    }
    
    updateTheme(updates);
    alert('Theme settings saved!');
}

function resetThemeSettings() {
    if (confirm('Reset to default theme?')) {
        resetTheme();
        initThemePresets();
        alert('Theme reset to default!');
    }
}

// Profile Settings
function loadProfileInfo() {
    const user = getCurrentUser();
    if (user) {
        document.getElementById('profileName').value = user.fullName || '';
        document.getElementById('profileEmail').value = user.email || '';
    }
}

function updateProfile() {
    const result = updateProfile({
        fullName: document.getElementById('profileName').value,
        email: document.getElementById('profileEmail').value
    });
    
    if (result.success) {
        alert('Profile updated successfully!');
        loadUserInfo();
    } else {
        alert('Error updating profile: ' + result.message);
    }
}

function changePassword() {
    const current = document.getElementById('currentPassword').value;
    const newPass = document.getElementById('newPassword').value;
    const confirm = document.getElementById('confirmNewPassword').value;
    
    if (newPass !== confirm) {
        alert('New passwords do not match!');
        return;
    }
    
    if (newPass.length < 6) {
        alert('Password must be at least 6 characters');
        return;
    }
    
    const result = changePassword(current, newPass);
    if (result.success) {
        alert('Password changed successfully!');
        document.getElementById('currentPassword').value = '';
        document.getElementById('newPassword').value = '';
        document.getElementById('confirmNewPassword').value = '';
    } else {
        alert('Error: ' + result.message);
    }
}

// Car Image Handling
async function handleCarImages(event) {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const maxImages = 5;
    const remainingSlots = maxImages - tempCarImages.length;

    if (remainingSlots <= 0) {
        alert('Maximum 5 images allowed');
        return;
    }

    const filesToProcess = Math.min(files.length, remainingSlots);

    for (let i = 0; i < filesToProcess; i++) {
        try {
            const base64 = await fileToBase64(files[i]);
            tempCarImages.push({
                id: Date.now().toString() + '_' + i,
                data: base64,
                uploadedAt: new Date().toISOString()
            });
        } catch (err) {
            console.error('Error reading file:', err);
        }
    }

    renderCarImagePreviews();
}

function renderCarImagePreviews() {
    const container = document.getElementById('carImagePreview');
    if (!container) return;

    container.innerHTML = tempCarImages.map((img, index) => `
        <div class="image-preview-item">
            <img src="${img.data}" alt="Car image ${index + 1}">
            <button type="button" class="remove-btn" onclick="removeCarTempImage('${img.id}')">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `).join('');
}

function removeCarTempImage(imageId) {
    tempCarImages = tempCarImages.filter(img => img.id !== imageId);
    renderCarImagePreviews();
}

// Gallery Management
function loadGalleryTable() {
    const items = getAllGalleryItems();
    const grid = document.getElementById('galleryGrid');

    if (!grid) return;

    if (items.length === 0) {
        grid.innerHTML = '<div class="empty-state" style="grid-column: 1/-1;"><i class="fas fa-images"></i><p>No gallery items yet. Add your first photo!</p></div>';
        return;
    }

    grid.innerHTML = items.map(item => `
        <div class="gallery-item">
            <img src="${item.image}" class="gallery-item-image" alt="${item.title}">
            <div class="gallery-item-content">
                <span class="gallery-item-category">${item.category}</span>
                <div class="gallery-item-title">${item.title}</div>
                ${item.clientName ? `<div style="font-size: 12px; color: #888; margin-bottom: 5px;"><i class="fas fa-user"></i> ${item.clientName}</div>` : ''}
                <div class="gallery-item-desc">${item.description || ''}</div>
            </div>
            <div class="gallery-item-actions">
                <button class="action-btn" onclick="editGalleryItem('${item.id}')" title="Edit"><i class="fas fa-edit"></i></button>
                <button class="action-btn" onclick="deleteGalleryItem('${item.id}')" title="Delete"><i class="fas fa-trash"></i></button>
            </div>
        </div>
    `).join('');

    // Update badge
    document.getElementById('galleryBadge').textContent = items.length;
}

function openGalleryModal(itemId = null) {
    document.getElementById('galleryModalTitle').textContent = itemId ? 'Edit Gallery Photo' : 'Add Gallery Photo';
    document.getElementById('galleryItemId').value = itemId || '';
    tempGalleryImage = null;

    if (itemId) {
        const item = getAllGalleryItems().find(i => i.id === itemId);
        if (item) {
            document.getElementById('galleryTitle').value = item.title;
            document.getElementById('galleryCategory').value = item.category;
            document.getElementById('galleryDescription').value = item.description || '';
            document.getElementById('galleryClientName').value = item.clientName || '';
            tempGalleryImage = item.image;
            document.getElementById('galleryImagePreview').innerHTML = `<img src="${item.image}" style="max-width: 200px; max-height: 200px; border-radius: 8px;">`;
        }
    } else {
        document.getElementById('galleryForm').reset();
        document.getElementById('galleryImagePreview').innerHTML = '';
    }

    document.getElementById('galleryModal').classList.add('show');
}

function closeGalleryModal() {
    document.getElementById('galleryModal').classList.remove('show');
    tempGalleryImage = null;
}

async function handleGalleryImage(event) {
    const file = event.target.files[0];
    if (!file) return;

    try {
        tempGalleryImage = await fileToBase64(file);
        document.getElementById('galleryImagePreview').innerHTML = `<img src="${tempGalleryImage}" style="max-width: 200px; max-height: 200px; border-radius: 8px;">`;
    } catch (err) {
        console.error('Error reading file:', err);
    }
}

function saveGalleryItem() {
    const itemId = document.getElementById('galleryItemId').value;
    const title = document.getElementById('galleryTitle').value;
    const category = document.getElementById('galleryCategory').value;
    const description = document.getElementById('galleryDescription').value;
    const clientName = document.getElementById('galleryClientName').value;

    if (!tempGalleryImage) {
        alert('Please upload a photo');
        return;
    }

    const itemData = {
        title,
        category,
        description,
        clientName,
        image: tempGalleryImage
    };

    if (itemId) {
        updateGalleryItem(itemId, itemData);
    } else {
        addGalleryItem(itemData);
    }

    closeGalleryModal();
    loadGalleryTable();
}

function editGalleryItem(itemId) {
    openGalleryModal(itemId);
}

function deleteGalleryItem(itemId) {
    if (confirm('Are you sure you want to delete this gallery item?')) {
        deleteGalleryItem(itemId);
        loadGalleryTable();
    }
}

function searchGalleryTable() {
    const query = document.getElementById('gallerySearch').value;
    const items = query ? searchGallery(query) : getAllGalleryItems();
    renderGalleryGrid(items);
}

function filterGalleryTable() {
    const category = document.getElementById('galleryFilter').value;
    const items = getGalleryByCategory(category);
    renderGalleryGrid(items);
}

function renderGalleryGrid(items) {
    const grid = document.getElementById('galleryGrid');
    if (!grid) return;

    if (items.length === 0) {
        grid.innerHTML = '<div class="empty-state" style="grid-column: 1/-1;"><i class="fas fa-images"></i><p>No gallery items found</p></div>';
        return;
    }

    grid.innerHTML = items.map(item => `
        <div class="gallery-item">
            <img src="${item.image}" class="gallery-item-image" alt="${item.title}">
            <div class="gallery-item-content">
                <span class="gallery-item-category">${item.category}</span>
                <div class="gallery-item-title">${item.title}</div>
                ${item.clientName ? `<div style="font-size: 12px; color: #888; margin-bottom: 5px;"><i class="fas fa-user"></i> ${item.clientName}</div>` : ''}
                <div class="gallery-item-desc">${item.description || ''}</div>
            </div>
            <div class="gallery-item-actions">
                <button class="action-btn" onclick="editGalleryItem('${item.id}')" title="Edit"><i class="fas fa-edit"></i></button>
                <button class="action-btn" onclick="deleteGalleryItem('${item.id}')" title="Delete"><i class="fas fa-trash"></i></button>
            </div>
        </div>
    `).join('');
}

// File to Base64 helper (in gallery.js but duplicated here for safety)
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// Initialize on load
window.addEventListener('DOMContentLoaded', initDashboard);