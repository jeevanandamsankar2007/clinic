# Aura Health & Longevity Clinic 🌿

> A state-of-the-art luxury healthcare web platform built with modern HTML5, pure CSS3 design tokens, and modular vanilla JavaScript.

[![Netlify Status](https://api.netlify.com/api/v1/badges/deploy-status)](https://app.netlify.com)

---

## 🌟 Key Features

- **🌓 Dual-Theme System**: Real-time Dark and Light luxury aesthetic with persistent local storage and automatic OS scheme detection.
- **🧭 Intelligent Care Navigator**: Interactive symptom triage engine that pairs patients with clinical specialties and recommended physicians.
- **👨‍⚕️ Doctors Directory**: Instant live search and specialty filter pills for clinic practitioners.
- **📊 Longevity & Health Profiler**: Interactive biometric slider calculator with animated gauge meter and clinical health band recommendations.
- **❓ FAQ Knowledge Base**: Category-based real-time filtering with accessible animated accordions.
- **📅 Real Calendar (.ICS) Generation**: One-click RFC 5545 `.ics` calendar invitation download with reminders and location.
- **🖨️ Printable Digital Consultation Pass**: Formatted printable pass slip with unique reference code.
- **🚨 Emergency & Quick-Action Speed Dial**: Floating quick widget for emergency triage lines and express appointments.
- **🛡️ Clinical & Insurance Modals**: Interactive insurance co-pay estimator, patient portal demo, and legal privacy disclosures.

---

## 🚀 Quick Start (Local Development)

### Option A: Using NPM
```bash
npm run dev
# or
npm start
```

### Option B: Using Python
```bash
python -m http.server 8080
```
Then navigate to `http://localhost:8080` in your web browser.

---

## 🌐 Deploying to Netlify

### Method 1: Git-Connected Continuous Deployment (Recommended)
1. Go to [Netlify](https://app.netlify.com/) and log in (e.g. with GitHub).
2. Click **"Add new site"** → **"Import an existing project"**.
3. Select **GitHub** and authorize access to `jeevanandamsankar2007/clinic`.
4. Netlify will automatically detect `netlify.toml`:
   - **Base directory**: *(leave empty)*
   - **Build command**: *(leave empty)*
   - **Publish directory**: `.`
5. Click **"Deploy site"**. Your site will be live on a secure HTTPS URL in seconds!

### Method 2: Netlify Drop (Manual Drag-and-Drop)
1. Go to [app.netlify.com/drop](https://app.netlify.com/drop).
2. Drag and drop the project folder directly into the browser window.

---

## 📁 Repository Structure

```text
├── index.html              # Main application markup & semantic components
├── package.json            # Development scripts & metadata
├── netlify.toml            # Netlify hosting & security headers config
├── .gitignore              # Ignored files
├── assets/
│   ├── css/
│   │   └── styles.css      # Design token system, responsive styles, dark mode
│   ├── js/
│   │   └── main.js         # Reactive UI controllers, triage, calculators, modals
│   └── images/             # High-resolution clinic photography and assets
```

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
