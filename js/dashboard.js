// GTACarsPH Admin Dashboard Controller

// Initialize dashboard
function initDashboard() {
    if (!requireAuth()) return;
    
    loadUserInfo();
    loadDashboardStats();
    loadCarsTable();
    loadSubmissionsTable();
    loadRecentSubmissions();
    initThemePresets();
    loadProfileInfo();
}

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
    
    document.getElementById('totalCars').textContent = cars.length;
    document.getElementById('availableCars').textContent = available.length;
    document.getElementById('carsBadge').textContent = available.length;
    
    document.getElementById('totalSubmissions').textContent = submissions.length;
    document.getElementById('newSubmissions').textContent = stats.new;
    document.getElementById('submissionsBadge').textContent = stats.new;
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
    
    tbody.innerHTML = cars.map(car => `
        <tr>
            <td>
                <strong>${car.brand} ${car.model}</strong>
                <br><small style="color:#888">${car.description?.substring(0, 50) || ''}...</small>
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
    `).join('');
}

function openCarModal(carId = null) {
    document.getElementById('carModalTitle').textContent = carId ? 'Edit Car' : 'Add New Car';
    document.getElementById('carId').value = carId || '';
    
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
        }
    } else {
        document.getElementById('carForm').reset();
    }
    
    document.getElementById('carModal').classList.add('show');
}

function closeCarModal() {
    document.getElementById('carModal').classList.remove('show');
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
        description: document.getElementById('carDescription').value
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

// Initialize on load
window.addEventListener('DOMContentLoaded', initDashboard);