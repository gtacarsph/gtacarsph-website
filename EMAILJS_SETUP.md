# EmailJS Setup Guide for Sell Your Car Form

## Overview
The sell-car form now sends real emails to `info.gtacarsph@gmail.com` using EmailJS.

## Setup Steps

### 1. Sign Up at EmailJS
1. Go to https://www.emailjs.com/
2. Click "Get Started" and create a free account
3. Free plan: 200 emails/month

### 2. Create Email Service
1. In EmailJS dashboard, go to "Email Services"
2. Click "Add New Service"
3. Select "Gmail" 
4. Connect your Gmail account (info.gtacarsph@gmail.com)
5. Name it: `gtacarsph_gmail`
6. Copy the **Service ID** (e.g., `service_abc123`)

### 3. Create Email Template
1. Go to "Email Templates"
2. Click "Create New Template"
3. Use this template:

```
Subject: New Car Sale Inquiry - {{brand}} {{model}} ({{year}})

New Car Sale Submission

SELLER INFORMATION:
Name: {{name}}
Phone: {{phone}}
Email: {{email}}
Location: {{location}}

VEHICLE DETAILS:
Brand: {{brand}}
Model: {{model}}
Year: {{year}}
Expected Price: ₱{{expectedPrice}}
Condition: {{condition}}

ADDITIONAL NOTES:
{{notes}}

---
Submitted: {{submit_date}}
Reference ID: Check admin dashboard
GTACarsPH Auto-Reply System
```

4. Save and copy the **Template ID** (e.g., `template_xyz789`)

### 4. Get Public Key
1. Go to "Account" → "API Keys"
2. Copy your **Public Key** (e.g., `AbC123XyZ`)

### 5. Update Website Code

Edit `sell-car.html` and replace the placeholder values:

```javascript
// EmailJS Configuration - UPDATE THESE VALUES
const EMAILJS_SERVICE_ID = 'service_abc123';     // Your Service ID
const EMAILJS_TEMPLATE_ID = 'template_xyz789';   // Your Template ID
const EMAILJS_PUBLIC_KEY = 'AbC123XyZ';          // Your Public Key
const RECIPIENT_EMAIL = 'info.gtacarsph@gmail.com';
```

### 6. Test
1. Go to https://gtacarsph.github.io/gtacarsph-website/sell-car.html
2. Fill up the form
3. Submit
4. Check info.gtacarsph@gmail.com inbox

## Features

✅ **Real Email Delivery** - Tunay na email matatanggap mo
✅ **Fallback to LocalStorage** - Kahit walang EmailJS, nase-save pa rin sa admin dashboard
✅ **Reference ID** - Tracking number para sa bawat submission
✅ **Error Handling** - Kapag may problema sa email, may alert pa rin
✅ **Photo Attachments** - Ready for future photo upload feature

## Email Template Variables

These variables are passed to the email template:

| Variable | Description |
|----------|-------------|
| `{{name}}` | Seller name |
| `{{phone}}` | Contact number |
| `{{email}}` | Email address |
| `{{location}}` | Location/City |
| `{{brand}}` | Car brand |
| `{{model}}` | Car model |
| `{{year}}` | Year model |
| `{{expectedPrice}}` | Asking price |
| `{{condition}}` | Car condition |
| `{{notes}}` | Additional notes |
| `{{submit_date}}` | Date/time submitted |

## Troubleshooting

### "Email setup required!" message
- Means EmailJS config is still using placeholder values
- Complete steps 1-5 above

### Email not received
- Check Gmail spam folder
- Verify EmailJS service is connected properly
- Check browser console for errors

### Limit reached
- Free plan: 200 emails/month
- Upgrade to paid plan if needed ($5/month for 2,000 emails)

## Admin Dashboard

All submissions are ALSO saved to localStorage and visible at:
https://gtacarsph.github.io/gtacarsph-website/admin-login.html

Login: admin / admin123

---

Questions? Contact your developer! 🚗