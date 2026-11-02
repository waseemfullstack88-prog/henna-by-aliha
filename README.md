# Henna by Aliha — Official Website & Admin CMS

> **Beautiful Henna • Beautiful Memories**  
> Professional Mehndi Artist based in **Muzaffargarh, Pakistan**

A modern, feminine, elegant and fully responsive website designed specifically for **Henna by Aliha**. Integrated with the authentic brand identity logo, soft burgundy velvet & regal gold accents, an interactive gallery with lightbox, direct Instagram booking integration, and a separate protected admin dashboard.

---

## 🌟 Key Features

### Public Website
- **Hero & Identity:** Incorporates the uploaded circular Henna by Aliha emblem with gentle micro-animations, quick booking CTA, and location badges.
- **About Aliha:** Dedicated artist story, signature style overview, experience summary, and photo.
- **Mehndi Services:**
  - 🌿 Bridal Mehndi
  - 🤎 Arabic Mehndi
  - 🌸 Party Mehndi
  - ✨ Simple Mehndi
  - 🪷 Custom Designs
  - 👰 Wedding/Event Bookings
  - **Zero Price Mentions:** Strict compliance with policy — no prices or packages with currency anywhere. Each service includes a direct "DM for Details & Booking" button linking straight to Instagram.
- **Mehndi Gallery:**
  - Filterable by: *All, Bridal Designs, Arabic Designs, Party Designs, Simple Designs, Custom Designs*
  - Interactive Lightbox with high-resolution preview and title/caption.
- **Client Reviews:** Testimonials card layout with 5-star badges and client quotes.
- **Appointment / Booking:**
  - Form collecting: Name, Preferred Date, Event Type, Design Type, Location, and Notes.
  - Submits inquiry to the local admin database.
  - Displays instant confirmation with a one-click button to **Open Instagram & Send DM** pre-filled with the inquiry details.
- **Contact:** Clean card highlighting Muzaffargarh, Pakistan and primary Instagram contact channel (No WhatsApp).

### Protected Admin Panel
- **Discreet Access:** Accessible via the subtle "Admin Login" link in the footer.
- **Default Credentials:**
  - **Username:** `admin`
  - **Password:** `password123` *(or `aliha2026`)*
- **Control Tabs:**
  1. **Overview & Stats:** Real-time counters of inquiries, new bookings, gallery works, and services.
  2. **Website Content:** Live editor for Brand Name, Tagline, Bio, Artistry style, Mission, and Artist Photo.
  3. **Services Management:** Add, edit, or remove services with custom badges and imagery.
  4. **Gallery Management:** Upload new photographs, change categories, or edit titles.
  5. **Reviews Management:** Add or delete client reviews.
  6. **Bookings Manager:** Track and update inquiry statuses (*New, Contacted, Confirmed, Completed, Cancelled*).
  7. **Instagram Settings:** Change the destination profile URL from a single field, syncing everywhere automatically.

---

## 🚀 How to Run Locally

You can preview the website immediately using Python, Node, or by opening `index.html` in any browser:

```powershell
# Using Python built-in server:
python -m http.server 8080

# Then open in your browser:
http://localhost:8080
```

---

## ☁️ How to Deploy to Netlify (No GitHub Needed!)

The website is **100% self-contained and static** with `_redirects` and `netlify.toml` pre-configured.

### Option 1: Drag-and-Drop (Easiest — 30 Seconds)
1. Go to [https://app.netlify.com/drop](https://app.netlify.com/drop) in your browser (log in or sign up for free).
2. Drag and drop the folder:  
   `C:\Users\Muhammad Waseem\.gemini\antigravity-ide\scratch\henna-by-aliha`  
   directly into the drop box on the Netlify screen.
3. Netlify will instantly deploy your website and provide a free live URL (e.g., `https://henna-by-aliha.netlify.app`) with free SSL/HTTPS!

### Option 2: Using Netlify CLI
If you have `netlify-cli` installed:
```powershell
cd "C:\Users\Muhammad Waseem\.gemini\antigravity-ide\scratch\henna-by-aliha"
npx netlify-cli deploy --prod --dir=.
```

---

© 2026 **Henna by Aliha**. All rights reserved.
