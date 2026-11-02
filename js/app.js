/**
 * Henna by Aliha - Public Website Interactivity & Rendering Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  renderPublicSite();
  setupNavigation();
  setupGalleryFilters();
  setupLightbox();
  setupBookingForm();
  setupToastNotifications();

  // Listen for admin live updates
  window.addEventListener('henna_data_updated', () => {
    renderPublicSite();
  });
});

/**
 * Render all dynamic content from DataStore
 */
function renderPublicSite() {
  const siteInfo = DataStore.getSiteInfo();
  const services = DataStore.getServices();
  const gallery = DataStore.getGallery();
  const reviews = DataStore.getReviews();

  // 1. Text & Brand Sync
  document.querySelectorAll('.js-brand-name').forEach(el => el.textContent = siteInfo.brandName);
  document.querySelectorAll('.js-tagline').forEach(el => el.textContent = siteInfo.tagline);
  document.querySelectorAll('.js-location').forEach(el => el.textContent = siteInfo.location);
  document.querySelectorAll('.js-hero-sub').forEach(el => el.textContent = siteInfo.heroSubtitle);
  document.querySelectorAll('.js-about-bio').forEach(el => el.textContent = siteInfo.aboutBio);
  document.querySelectorAll('.js-about-style').forEach(el => el.textContent = siteInfo.aboutStyle);
  document.querySelectorAll('.js-about-passion').forEach(el => el.textContent = siteInfo.aboutPassion);
  document.querySelectorAll('.js-experience-summary').forEach(el => el.textContent = siteInfo.experienceSummary || 'Experienced in custom bridal & event artistry');

  // Artist image
  const artistImg = document.getElementById('about-artist-img');
  if (artistImg && siteInfo.artistPhoto) {
    artistImg.src = siteInfo.artistPhoto;
  }

  // Instagram links
  document.querySelectorAll('.js-instagram-link').forEach(el => {
    el.href = siteInfo.instagramUrl || 'https://instagram.com/hennabyaliha';
  });
  document.querySelectorAll('.js-instagram-handle').forEach(el => {
    el.textContent = siteInfo.instagramHandle || '@hennabyaliha';
  });

  // 2. Render Services
  renderServicesList(services, siteInfo.instagramUrl);

  // 3. Render Gallery
  renderGalleryList(gallery);

  // 4. Render Reviews
  renderReviewsList(reviews);
}

/**
 * Render Services (No prices anywhere!)
 */
function renderServicesList(services, instagramUrl) {
  const container = document.getElementById('services-grid-container');
  if (!container) return;

  container.innerHTML = services.map(srv => {
    const dmMessage = encodeURIComponent(`Hi Aliha, I am interested in booking your ${srv.title} service. Could you please share more details?`);
    const igLink = instagramUrl ? `${instagramUrl}${instagramUrl.includes('?') ? '&' : '?'}text=${dmMessage}` : 'https://instagram.com';

    return `
      <div class="service-card" data-service-id="${srv.id}">
        <div class="service-card-img-wrap">
          <img src="${srv.image || 'assets/images/bridal_mehndi.jpg'}" alt="${srv.title}" class="service-card-img" loading="lazy">
          ${srv.badge ? `<span class="service-card-badge">${srv.badge}</span>` : ''}
        </div>
        <div class="service-card-body">
          <div class="service-card-header">
            <span class="service-card-icon">${srv.icon || '🌿'}</span>
            <h3 class="service-card-title">${srv.title}</h3>
          </div>
          <p class="service-card-desc">${srv.description}</p>
          <div class="service-card-footer">
            <a href="${igLink}" target="_blank" rel="noopener noreferrer" class="btn btn-instagram btn-sm" style="width: 100%;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              DM for Details & Booking
            </a>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

/**
 * Render Gallery
 */
function renderGalleryList(gallery) {
  const container = document.getElementById('gallery-grid-container');
  if (!container) return;

  if (gallery.length === 0) {
    container.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 3rem;">No gallery images available yet.</p>`;
    return;
  }

  container.innerHTML = gallery.map(item => `
    <div class="gallery-item" data-category="${item.category}" data-img="${item.image}" data-title="${item.title}" data-caption="${item.caption || ''}">
      <img src="${item.image}" alt="${item.title}" loading="lazy">
      <div class="gallery-item-overlay">
        <span class="gallery-item-category">${item.category}</span>
        <h4 class="gallery-item-title">${item.title}</h4>
      </div>
      <div class="gallery-item-view-btn" title="View Fullscreen">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          <line x1="11" y1="8" x2="11" y2="14"></line>
          <line x1="8" y1="11" x2="14" y2="11"></line>
        </svg>
      </div>
    </div>
  `).join('');
}

/**
 * Render Customer Reviews
 */
function renderReviewsList(reviews) {
  const container = document.getElementById('reviews-grid-container');
  if (!container) return;

  if (reviews.length === 0) {
    container.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 2rem;">No reviews yet.</p>`;
    return;
  }

  container.innerHTML = reviews.map(rev => `
    <div class="review-card">
      <span class="review-quote-icon">“</span>
      <div>
        <div class="review-stars">★★★★★</div>
        <p class="review-text">"${rev.text}"</p>
      </div>
      <div class="review-footer">
        <span class="review-author">${rev.name}</span>
        <span class="review-date">${rev.date || 'Verified Client'}</span>
      </div>
    </div>
  `).join('');
}

/**
 * Navigation & Header scroll interaction
 */
function setupNavigation() {
  const header = document.querySelector('.site-header');
  const hamburgerBtn = document.getElementById('hamburger-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  // Sticky header shadow
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Mobile menu toggle
  if (hamburgerBtn && mobileDrawer) {
    hamburgerBtn.addEventListener('click', () => {
      hamburgerBtn.classList.toggle('active');
      mobileDrawer.classList.toggle('open');
      document.body.style.overflow = mobileDrawer.classList.contains('open') ? 'hidden' : '';
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburgerBtn.classList.remove('active');
        mobileDrawer.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // Admin access link in footer - Always ask for credentials every time
  const adminTrigger = document.getElementById('open-admin-login-btn');
  if (adminTrigger) {
    adminTrigger.addEventListener('click', (e) => {
      e.preventDefault();
      AdminApp.openLogin();
    });
  }
}

/**
 * Gallery Category Filtering
 */
function setupGalleryFilters() {
  const filterButtons = document.querySelectorAll('.gallery-filter-btn');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.getAttribute('data-filter');
      const galleryItems = document.querySelectorAll('.gallery-item');

      galleryItems.forEach(item => {
        const itemCat = item.getAttribute('data-category');
        if (filterVal === 'all' || itemCat === filterVal) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

/**
 * Lightbox Modal for Gallery
 */
function setupLightbox() {
  const modal = document.getElementById('lightbox-modal');
  const modalImg = document.getElementById('lightbox-img');
  const modalTitle = document.getElementById('lightbox-title');
  const modalCaption = document.getElementById('lightbox-caption');
  const closeBtn = document.getElementById('lightbox-close');

  if (!modal) return;

  document.addEventListener('click', (e) => {
    const item = e.target.closest('.gallery-item');
    if (item) {
      const imgSrc = item.getAttribute('data-img');
      const title = item.getAttribute('data-title');
      const caption = item.getAttribute('data-caption');

      modalImg.src = imgSrc;
      modalTitle.textContent = title;
      modalCaption.textContent = caption || '';
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  });

  const closeModal = () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
}

/**
 * Booking / Appointment Form
 */
function setupBookingForm() {
  const form = document.getElementById('appointment-form');
  const successModal = document.getElementById('booking-success-modal');
  const closeSuccessBtn = document.getElementById('close-booking-success-btn');
  const directIgBtn = document.getElementById('booking-direct-ig-btn');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('booking-name').value.trim();
    const date = document.getElementById('booking-date').value;
    const eventType = document.getElementById('booking-event').value;
    const designType = document.getElementById('booking-design').value;
    const location = document.getElementById('booking-location').value.trim();
    const message = document.getElementById('booking-message').value.trim();

    if (!name || !date || !eventType) {
      showToast('Please fill out all required fields.');
      return;
    }

    // Save booking into DataStore
    const newBooking = DataStore.addBooking({
      name,
      date,
      eventType,
      designType,
      location: location || 'Muzaffargarh, Pakistan',
      message
    });

    // Populate confirmation modal
    const siteInfo = DataStore.getSiteInfo();
    const formattedInquiry = encodeURIComponent(
      `Hello Aliha! I just submitted an appointment request on your website:\n\n` +
      `• Name: ${name}\n` +
      `• Preferred Date: ${date}\n` +
      `• Event: ${eventType}\n` +
      `• Design: ${designType}\n` +
      `• Location: ${location || siteInfo.location}\n` +
      (message ? `• Note: ${message}\n` : '') +
      `\nLooking forward to discussing the booking details and confirmation with you!`
    );

    const directUrl = `${siteInfo.instagramUrl || 'https://instagram.com'}${siteInfo.instagramUrl.includes('?') ? '&' : '?'}text=${formattedInquiry}`;
    if (directIgBtn) {
      directIgBtn.href = directUrl;
    }

    // Show modal & reset form
    form.reset();
    if (successModal) {
      successModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  });

  if (closeSuccessBtn && successModal) {
    closeSuccessBtn.addEventListener('click', () => {
      successModal.classList.remove('active');
      document.body.style.overflow = '';
    });
  }
}

/**
 * Toast Notifications
 */
function showToast(message, duration = 3200) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--gold-light)" stroke-width="2">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
    <span>${message}</span>
  `;

  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

function setupToastNotifications() {
  window.showToast = showToast;
}
