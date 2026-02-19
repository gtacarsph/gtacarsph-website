# GTACarsPH Website - Phase 1

A modern, mobile-responsive homepage for GTACarsPH automotive dealership with a Donut Media inspired design.

![GTACarsPH Preview](preview.png)

## Overview

**GTACarsPH** is a car dealership based in San Juan, Metro Manila, specializing in buying, selling, and trading quality affordable cars with a 10/10 customer rating.

## Features

- ✅ **Donut Media Inspired Design** - Bold, energetic, youthful automotive aesthetic
- ✅ **Vlog-First Layout** - Prominent YouTube video integration
- ✅ **Latest Vlogs Grid** - 6 video thumbnail cards with hover effects
- ✅ **Responsive Navigation** - Mobile-first hamburger menu
- ✅ **Services Section** - Buy, Sell, Trade, Financing highlights
- ✅ **Contact Form** - With validation and notifications
- ✅ **SEO Ready** - Meta tags, Open Graph, Schema.org structured data
- ✅ **Mobile Responsive** - Optimized for all screen sizes
- ✅ **Performance** - Vanilla JS, no external dependencies (CDN only)

## Tech Stack

- **HTML5** - Semantic markup
- **CSS3** - Custom CSS with CSS variables
- **Vanilla JavaScript** - No frameworks
- **Google Fonts** - Bebas Neue (display) + Inter (body)
- **YouTube Embed** - Video integration

## File Structure

```
phase1/
├── index.html          # Main homepage
├── styles.css          # All styles (Donut Media inspired)
├── script.js           # Interactive functionality
└── README.md          # This file
```

## Setup Instructions

### Local Development

1. **Clone or download** the files to your local machine
2. **Navigate** to the `phase1` directory
3. **Open** `index.html` in your browser:

```bash
# Option 1: Direct open
open index.html

# Option 2: Using Python HTTP server (recommended)
python3 -m http.server 8000
# Then visit http://localhost:8000

# Option 3: Using Node.js npx
npx serve .
```

### Deployment

#### Netlify
1. Drag and drop the `phase1` folder to [Netlify Drop](https://app.netlify.com/drop)
2. Or connect your GitHub repository

#### Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel` in the project directory

#### GitHub Pages
1. Push files to a GitHub repository
2. Go to Settings > Pages
3. Select source as main branch

#### Traditional Hosting
1. Upload all files via FTP to your web server
2. Ensure `index.html` is at the root

## Research Summary

### Business Information Found

| Detail | Information |
|--------|-------------|
| **Business Name** | GTACarsPH (GTAcarsph - Buy / Sell / Trade) |
| **Address** | 138 G. Reyes, Brgy. Balong Bato, San Juan 1500, Metro Manila, Philippines |
| **Phone** | +63 998 510 0590 / +63 905 368 4532 |
| **Rating** | 10/10 Metro Manila |
| **Services** | Buy, Sell, Trade Cars, Financing, Cash Basis |
| **Tagline** | "We Sell QUALITY AFFORDABLE CARS" |
| **YouTube** | [RaFFa GTACARS](https://www.youtube.com/@RaffaGTACARS) |
| **Facebook** | [GTACARSPH](https://www.facebook.com/GTACARSPH/) |
| **Hours** | Monday - Saturday: 9:00 AM - 6:00 PM |

### Sources
- Facebook: www.facebook.com/GTACARSPH
- YouTube: @RaffaGTACARS
- Google Search Results

## Design Notes

### Color Palette (Donut Media Inspired)
- **Primary**: #FF6B00 (Orange) - Energy, excitement
- **Accent**: #FFD700 (Gold) - Premium feel
- **Accent 2**: #FF3B3B (Red) - Urgency, action
- **Dark**: #0A0A0A - Background
- **Dark 2**: #141414 - Cards
- **Success**: #00C853 - Positive actions

### Typography
- **Display**: Bebas Neue - Bold headlines
- **Body**: Inter - Clean readability

### Key Sections
1. **Hero** - Full-screen impact with stats
2. **Featured Vlog** - Latest YouTube video
3. **Vlogs Grid** - 6 video cards
4. **Services** - 4 service cards
5. **About** - Company info with visual stats
6. **Contact** - Info cards + form
7. **Footer** - Links, social, hours

## SEO Implementation

### Meta Tags
- Title and description optimized
- Open Graph for social sharing
- Twitter Cards

### Structured Data
- Schema.org AutoDealer markup
- Address, hours, phone structured
- Rating information

### Performance
- No render-blocking resources
- CSS variables for theming
- Intersection Observer for animations
- Lazy loading ready

## Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+
- Mobile browsers (iOS Safari, Chrome Android)

## Future Enhancements (Phase 2+)

- [ ] Real YouTube API integration for dynamic videos
- [ ] Car inventory listing with filters
- [ ] Image gallery with lightbox
- [ ] Testimonials carousel
- [ ] Live chat integration
- [ ] Blog/News section
- [ ] Multi-page navigation
- [ ] Backend for form submissions

## Credits

- **Fonts**: Google Fonts (Bebas Neue, Inter)
- **Icons**: Custom SVG
- **Design Inspiration**: Donut Media
- **Built for**: GTACarsPH

## License

This website template is created for GTACarsPH. All rights reserved.

---

**Built with ❤️ for car enthusiasts in Metro Manila**

For questions or updates, contact GTACarsPH at +63 998 510 0590