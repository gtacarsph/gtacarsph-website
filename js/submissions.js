/**
 * GTACarsPH Submissions Management System
 * Handle Sell Your Car form submissions
 */

const SUBMISSIONS_KEY = 'gtacarsph_submissions';
const EMAIL_LOG_KEY = 'gtacarsph_email_log';

// Initialize submissions storage
function initSubmissions() {
    if (!localStorage.getItem(SUBMISSIONS_KEY)) {
        localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify([]));
    }
    if (!localStorage.getItem(EMAIL_LOG_KEY)) {
        localStorage.setItem(EMAIL_LOG_KEY, JSON.stringify([]));
    }
}

// Add new submission from sell-car form
function addSubmission(formData) {
    const submissions = JSON.parse(localStorage.getItem(SUBMISSIONS_KEY) || '[]');
    
    const submission = {
        id: Date.now().toString(),
        ...formData,
        status: 'new', // new, contacted, resolved, closed
        emailSent: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    submissions.push(submission);
    localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(submissions));
    
    // Trigger email notification
    sendSubmissionEmail(submission);
    
    return submission;
}

// Get all submissions
function getAllSubmissions() {
    return JSON.parse(localStorage.getItem(SUBMISSIONS_KEY) || '[]');
}

// Get submission by ID
function getSubmissionById(id) {
    return getAllSubmissions().find(s => s.id === id);
}

// Update submission status
function updateSubmissionStatus(id, status, notes = '') {
    const submissions = getAllSubmissions();
    const index = submissions.findIndex(s => s.id === id);
    
    if (index !== -1) {
        submissions[index].status = status;
        submissions[index].notes = notes;
        submissions[index].updatedAt = new Date().toISOString();
        localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(submissions));
        return submissions[index];
    }
    return null;
}

// Delete submission
function deleteSubmission(id) {
    const submissions = getAllSubmissions();
    const filtered = submissions.filter(s => s.id !== id);
    localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(filtered));
    return filtered.length < submissions.length;
}

// Get submission stats
function getSubmissionStats() {
    const submissions = getAllSubmissions();
    return {
        total: submissions.length,
        new: submissions.filter(s => s.status === 'new').length,
        contacted: submissions.filter(s => s.status === 'contacted').length,
        resolved: submissions.filter(s => s.status === 'resolved').length,
        closed: submissions.filter(s => s.status === 'closed').length
    };
}

// Simulate email sending to info.gtacarsph@gmail.com
function sendSubmissionEmail(submission) {
    const emailData = {
        to: 'info.gtacarsph@gmail.com',
        from: 'noreply@gtacarsph.com',
        subject: `New Car Sale Inquiry - ${submission.brand} ${submission.model} (${submission.year})`,
        body: `
NEW CAR SALE SUBMISSION

Seller Information:
------------------
Name: ${submission.name}
Phone: ${submission.phone}
Location: ${submission.location}
Email: ${submission.email || 'Not provided'}

Vehicle Details:
----------------
Brand: ${submission.brand}
Model: ${submission.model}
Year: ${submission.year}
Expected Price: ${submission.expectedPrice || 'Not specified'}
Condition: ${submission.condition || 'Not specified'}

Additional Notes:
-----------------
${submission.notes || 'No additional notes'}

Submission ID: ${submission.id}
Date: ${new Date(submission.createdAt).toLocaleString('en-PH')}

---
GTACarsPH Admin System
        `.trim(),
        sentAt: new Date().toISOString(),
        submissionId: submission.id
    };
    
    // Log email
    const emailLog = JSON.parse(localStorage.getItem(EMAIL_LOG_KEY) || '[]');
    emailLog.push(emailData);
    localStorage.setItem(EMAIL_LOG_KEY, JSON.stringify(emailLog));
    
    // Mark submission as email sent
    const submissions = getAllSubmissions();
    const index = submissions.findIndex(s => s.id === submission.id);
    if (index !== -1) {
        submissions[index].emailSent = true;
        localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(submissions));
    }
    
    console.log('Email notification sent to info.gtacarsph@gmail.com');
    console.log('Subject:', emailData.subject);
    
    return emailData;
}

// Get email log
function getEmailLog() {
    return JSON.parse(localStorage.getItem(EMAIL_LOG_KEY) || '[]');
}

// Resend email for submission
function resendSubmissionEmail(submissionId) {
    const submission = getSubmissionById(submissionId);
    if (submission) {
        return sendSubmissionEmail(submission);
    }
    return null;
}

// Filter submissions by status
function filterSubmissionsByStatus(status) {
    if (status === 'all') return getAllSubmissions();
    return getAllSubmissions().filter(s => s.status === status);
}

// Search submissions
function searchSubmissions(query) {
    const submissions = getAllSubmissions();
    const lowerQuery = query.toLowerCase();
    return submissions.filter(s => 
        s.name?.toLowerCase().includes(lowerQuery) ||
        s.phone?.toLowerCase().includes(lowerQuery) ||
        s.brand?.toLowerCase().includes(lowerQuery) ||
        s.model?.toLowerCase().includes(lowerQuery)
    );
}

// Initialize on load
initSubmissions();