# Deploy GTACarsPH Website to .com Domain

## Overview
Move website from GitHub Pages to your own hosting with custom domain.

## Prerequisites
- Domain name (e.g., gtacarsph.com)
- Web hosting (Hostinger, Namecheap, Cloudways, etc.)
- FTP access or File Manager

---

## Step 1: Prepare Files for Deployment

### Download from GitHub
1. Go to https://github.com/gtacarsph/gtacarsph-website
2. Click "Code" → "Download ZIP"
3. Extract ZIP file

### OR Clone via Git
```bash
git clone https://github.com/gtacarsph/gtacarsph-website.git
```

---

## Step 2: Update Configuration for Production

### Update Base URLs
Edit these files and replace GitHub URLs with your domain:

**index.html:**
```html
<!-- Change this -->
<link rel="canonical" href="https://gtacarsph.github.io/">
<meta property="og:url" content="https://gtacarsph.github.io">

<!-- To this -->
<link rel="canonical" href="https://gtacarsph.com/">
<meta property="og:url" content="https://gtacarsph.com">
```

**All HTML files** - Update canonical and og:url tags

### Update Admin Dashboard Links
**admin-login.html, admin-register.html, admin-dashboard.html:**
```javascript
// Change redirects from GitHub to your domain
window.location.href = 'https://gtacarsph.com/admin-dashboard.html';
```

### Update EmailJS Config (IMPORTANT!)
**sell-car.html:**
```javascript
const RECIPIENT_EMAIL = 'info.gtacarsph@gmail.com'; // Keep this
// Make sure EMAILJS_SERVICE_ID, TEMPLATE_ID, PUBLIC_KEY are set
```

---

## Step 3: Upload to Hosting

### Option A: FTP Upload
```bash
# Using FileZilla or similar
Host: your-hosting-ftp-server
Username: your-ftp-username
Password: your-ftp-password
Port: 21 (or as provided)

# Upload all files to: public_html/ or www/
```

### Option B: cPanel File Manager
1. Login to cPanel
2. Go to "File Manager"
3. Navigate to `public_html/`
4. Click "Upload" → Select all website files
5. Extract ZIP if uploaded as archive

### Option C: Hostinger (hPanel)
1. Login to Hostinger
2. Go to "Websites" → Manage
3. Click "File Manager" 
4. Go to `public_html/`
5. Upload all files via drag-drop or upload button

---

## Step 4: Domain Configuration

### If Domain is from Hostinger
1. Your domain should automatically point to hosting
2. No extra configuration needed

### If Domain is from Other Registrar
Update nameservers to your hosting provider:

**Hostinger Nameservers:**
```
ns1.dns-parking.com
ns2.dns-parking.com
```

**OR use A Records:**
```
Type: A
Name: @
Value: YOUR_HOSTING_IP_ADDRESS
TTL: 14400
```

### Add SSL Certificate (HTTPS)
**cPanel:**
1. Go to "SSL/TLS"
2. Click "Manage SSL Sites"
3. Install Let's Encrypt (Free)

**Hostinger:**
1. Go to "Websites" → Manage
2. Click "SSL" 
3. Enable Free SSL Certificate

---

## Step 5: Test Everything

### Checklist
- [ ] Homepage loads at https://gtacarsph.com
- [ ] All pages accessible (cars-for-sale.html, sell-car.html, gallery.html)
- [ ] Admin login works: https://gtacarsph.com/admin-login.html
- [ ] Form submissions work (test sell-car form)
- [ ] Images load correctly
- [ ] Mobile responsive
- [ ] SSL certificate active (padlock icon)

### Common Issues

**Issue: 404 errors on pages**
Solution: Check .htaccess file for URL rewriting
```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

**Issue: CSS/JS not loading**
Solution: Check file paths are relative (./style.css not /style.css)

**Issue: Admin dashboard not accessible**
Solution: Check js/ folder uploaded correctly

**Issue: Form not sending email**
Solution: Verify EmailJS config has correct Service/Template/Public Key

---

## Step 6: Post-Deployment Tasks

### Update Facebook Page
Change website link from GitHub to your domain

### Update Google Business Profile
Update website URL to new domain

### Update Social Media Bios
- Facebook: gtacarsph.com
- Instagram: Link in bio
- TikTok: Link in bio

### Set Up Google Analytics (Optional)
Add tracking code to index.html:
```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_TRACKING_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_TRACKING_ID');
</script>
```

---

## Step 7: Backup & Maintenance

### Set Up GitHub Auto-Deploy (Optional)
Use GitHub Actions to auto-deploy on push:

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Hosting

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Deploy via FTP
      uses: SamKirkland/FTP-Deploy-Action@4.3.0
      with:
        server: ${{ secrets.FTP_SERVER }}
        username: ${{ secrets.FTP_USERNAME }}
        password: ${{ secrets.FTP_PASSWORD }}
```

### Regular Backups
1. Weekly: Download files from hosting
2. Monthly: Export database (if added later)

---

## EmailJS for Production

After deployment, verify EmailJS:
1. Go to EmailJS Dashboard
2. Add your domain to "Authorized Domains"
3. Test form submission on live site
4. Verify email arrives at info.gtacarsph@gmail.com

---

## Summary

### Files to Upload:
- All HTML files
- CSS files (styles.css)
- JS files (js/ folder)
- Images (logo.jpg, etc.)
- All assets

### Configuration Changes:
- Update canonical URLs
- Update og:url meta tags
- Verify EmailJS config
- Add SSL certificate

### Testing:
- All pages load
- Forms work
- Admin accessible
- Mobile friendly
- SSL active

---

## Support
Need help? Contact your developer! 🚗

**Remember:**
- Keep GitHub repo as backup
- Always test on staging first
- Monitor for 404 errors after launch