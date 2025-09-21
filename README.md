# SenHarvest Website

A modern, responsive React website for Xidma & Harvest - an agricultural import/export company specializing in products from Africa, Asia, and Canada.

## Features

- 🌐 **Bilingual Support** - French and English language toggle
- 📱 **Responsive Design** - Mobile-first approach with Tailwind CSS
- 🛒 **Product Catalog** - 12+ agricultural products with pricing
- 📞 **Contact Integration** - WhatsApp, email, and contact form
- 🎨 **Modern UI** - Clean, professional design with smooth animations
- ♿ **Accessible** - WCAG compliant with proper ARIA labels
- 🔍 **SEO Optimized** - Meta tags, structured data, and semantic HTML

## Project Structure

```
src/
├── components/
│   ├── layout/          # Header, Footer, WhatsApp Float
│   ├── pages/           # Home, Products, Services, Mission, Contact
│   └── ui/              # Reusable UI components
├── config/
│   ├── company.js       # Company information and settings
│   ├── products.js      # Product catalog and translations
│   └── translations.js  # French/English translations
├── hooks/
│   └── useLang.js       # Language management hook
├── utils/
│   ├── form.js          # Form validation and submission
│   ├── seo.js           # SEO utilities
│   └── whatsapp.js      # WhatsApp link generation
└── App.js               # Main application component
```

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp env.example .env
   # Edit .env with your actual values
   ```

3. **Start Development Server**
   ```bash
   npm start
   ```

4. **Build for Production**
   ```bash
   npm run build
   ```

## Customization

### Company Information
Edit `src/config/company.js` to update:
- Company name and tagline
- Contact information
- Logo and branding
- Addresses and phone numbers

### Products
Modify `src/config/products.js` to:
- Add/remove products
- Update pricing and MOQ
- Change product images
- Add new product categories

### Translations
Update `src/config/translations.js` to:
- Add new languages
- Modify existing translations
- Add new text content

### Styling
Customize `tailwind.config.js` to:
- Change color scheme
- Modify typography
- Add custom components

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `REACT_APP_PHONE_SN` | Senegal phone number | `+221775550123` |
| `REACT_APP_PHONE_CA` | Canada phone number | `+15145550123` |
| `REACT_APP_EMAIL` | Contact email | `contact@xidmaharvest.com` |
| `REACT_APP_WHATSAPP` | WhatsApp number | `+221775550123` |
| `REACT_APP_FORMSPREE_ID` | Formspree form ID | `xqkrpozn` |

## Deployment

### Netlify
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `build`
4. Add environment variables in Netlify dashboard

### Vercel
1. Import your GitHub repository
2. Framework preset: Create React App
3. Add environment variables in Vercel dashboard

### Traditional Hosting
1. Run `npm run build`
2. Upload `build` folder contents to your web server
3. Configure server to serve `index.html` for all routes

## Form Integration

The contact form is configured to work with Formspree. To set up:

1. Create a Formspree account
2. Create a new form
3. Update `REACT_APP_FORMSPREE_ID` in your `.env` file
4. Update the form endpoint in `src/utils/form.js`

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is proprietary software for Xidma & Harvest.

## Support

For technical support or questions, contact the development team.
