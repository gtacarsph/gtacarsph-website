/**
 * GTACarsPH Admin Authentication System
 * Handles user login, registration, and session management
 * Uses localStorage for demo purposes - upgrade to backend for production
 */

const AUTH_KEY = 'gtacarsph_auth';
const USERS_KEY = 'gtacarsph_users';
const CURRENT_USER_KEY = 'gtacarsph_current_user';

// Initialize default admin if no users exist
function initAuth() {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    if (users.length === 0) {
        // Create default admin account
        const defaultAdmin = {
            username: 'admin',
            password: hashPassword('admin123'),
            fullName: 'Administrator',
            email: 'info.gtacarsph@gmail.com',
            role: 'admin',
            createdAt: new Date().toISOString()
        };
        users.push(defaultAdmin);
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
        console.log('Default admin created: admin/admin123');
    }
}

// Simple hash function (use bcrypt in production)
function hashPassword(password) {
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
        const char = password.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return 'hash_' + Math.abs(hash).toString(16);
}

// Register new user
function registerUser(username, password, userData = {}) {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    
    // Check if username exists
    if (users.find(u => u.username === username)) {
        return { success: false, message: 'Username already exists' };
    }
    
    const newUser = {
        username,
        password: hashPassword(password),
        fullName: userData.fullName || username,
        email: userData.email || '',
        role: 'admin',
        createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    
    return { success: true, message: 'User registered successfully' };
}

// Login user
function loginUser(username, password) {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const user = users.find(u => u.username === username && u.password === hashPassword(password));
    
    if (user) {
        const session = {
            username: user.username,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
            loginTime: new Date().toISOString()
        };
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(session));
        return true;
    }
    return false;
}

// Logout user
function logoutUser() {
    localStorage.removeItem(CURRENT_USER_KEY);
    window.location.href = 'admin-login.html';
}

// Check if user is logged in
function isLoggedIn() {
    const session = localStorage.getItem(CURRENT_USER_KEY);
    if (session) {
        const data = JSON.parse(session);
        // Check if session is not expired (24 hours)
        const loginTime = new Date(data.loginTime);
        const now = new Date();
        const hoursDiff = (now - loginTime) / (1000 * 60 * 60);
        if (hoursDiff < 24) {
            return true;
        }
        localStorage.removeItem(CURRENT_USER_KEY);
    }
    return false;
}

// Get current user
function getCurrentUser() {
    const session = localStorage.getItem(CURRENT_USER_KEY);
    return session ? JSON.parse(session) : null;
}

// Protect admin pages
function requireAuth() {
    if (!isLoggedIn()) {
        window.location.href = 'admin-login.html';
        return false;
    }
    return true;
}

// Update user profile
function updateProfile(updates) {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const currentUser = getCurrentUser();
    
    const userIndex = users.findIndex(u => u.username === currentUser.username);
    if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...updates };
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
        
        // Update session
        const session = { ...currentUser, ...updates };
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(session));
        
        return { success: true };
    }
    return { success: false, message: 'User not found' };
}

// Change password
function changePassword(oldPassword, newPassword) {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const currentUser = getCurrentUser();
    
    const userIndex = users.findIndex(u => 
        u.username === currentUser.username && 
        u.password === hashPassword(oldPassword)
    );
    
    if (userIndex === -1) {
        return { success: false, message: 'Incorrect current password' };
    }
    
    users[userIndex].password = hashPassword(newPassword);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    
    return { success: true };
}

// Initialize auth on load
initAuth();