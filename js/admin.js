/**
 * Henna by Aliha - Admin Dashboard & CMS Management Engine
 */

const AdminApp = {
  activeTab: 'tab-overview',
  inactivityTimeout: null,
  checkInterval: null,
  INACTIVITY_LIMIT: 120000, // 2 minutes (120,000 ms)
  activityHandler: null,

  init() {
    this.bindEvents();
    this.renderAdminState();
  },

  bindEvents() {
    // Login form submit
    const loginForm = document.getElementById('admin-login-form');
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const user = document.getElementById('admin-user-input').value;
        const pass = document.getElementById('admin-pass-input').value;

        if (DataStore.loginAdmin(user, pass)) {
          this.closeLogin();
          this.openDashboard();
          showToast('Welcome! Admin session active.');
        } else {
          const errorMsg = document.getElementById('admin-login-error');
          if (errorMsg) {
            errorMsg.style.display = 'block';
            errorMsg.textContent = 'Invalid username or password. Please try again.';
          }
        }
      });
    }

    // Login modal close
    const closeLoginBtn = document.getElementById('close-admin-login-btn');
    if (closeLoginBtn) {
      closeLoginBtn.addEventListener('click', () => this.closeLogin());
    }

    // Dashboard close / Return to website
    const closeDashBtn = document.getElementById('admin-exit-dash-btn');
    if (closeDashBtn) {
      closeDashBtn.addEventListener('click', () => {
        this.closeDashboard();
        showToast('Returned to website. Admin session locked.');
      });
    }

    // Logout
    const logoutBtn = document.getElementById('admin-logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        this.closeDashboard();
        showToast('Logged out of admin dashboard.');
      });
    }

    // Sidebar tab buttons
    document.querySelectorAll('.admin-nav-item button').forEach(btn => {
      btn.addEventListener('click', () => {
        const tabId = btn.getAttribute('data-tab');
        this.switchTab(tabId);
      });
    });

    // Content Form Save
    const contentForm = document.getElementById('admin-content-form');
    if (contentForm) {
      contentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.saveWebsiteContent();
      });
    }

    // Instagram Settings Form Save
    const igForm = document.getElementById('admin-instagram-form');
    if (igForm) {
      igForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.saveInstagramSettings();
      });
    }

    // Reset Defaults
    const resetBtn = document.getElementById('admin-reset-demo-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to restore the default sample website data?')) {
          DataStore.resetToDefaults();
          this.renderAllDashboardPanels();
          showToast('Default demonstration data restored successfully.');
        }
      });
    }

    // Image Upload Handlers (Artist photo, Service image, Gallery image)
    this.setupImageUploaders();
  },

  // State & Visibility
  openLogin() {
    const modal = document.getElementById('admin-login-modal');
    if (modal) {
      modal.classList.add('active');
      const userInput = document.getElementById('admin-user-input');
      const passInput = document.getElementById('admin-pass-input');
      const errorMsg = document.getElementById('admin-login-error');
      
      // Always reset inputs so credentials must be re-entered every time
      if (userInput) {
        userInput.value = '';
        setTimeout(() => userInput.focus(), 100);
      }
      if (passInput) passInput.value = '';
      if (errorMsg) errorMsg.style.display = 'none';

      document.body.style.overflow = 'hidden';
    }
  },

  closeLogin() {
    const modal = document.getElementById('admin-login-modal');
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
      // Clear inputs
      const userInput = document.getElementById('admin-user-input');
      const passInput = document.getElementById('admin-pass-input');
      if (userInput) userInput.value = '';
      if (passInput) passInput.value = '';
    }
  },

  openDashboard() {
    if (!DataStore.isAdminLoggedIn()) {
      this.openLogin();
      return;
    }
    const view = document.getElementById('admin-overlay-view');
    if (view) {
      view.classList.add('active');
      document.body.style.overflow = 'hidden';
      this.renderAllDashboardPanels();
      this.startInactivityTracker();
    }
  },

  closeDashboard() {
    this.stopInactivityTracker();
    DataStore.logoutAdmin(); // Always require credential re-entry next time

    const view = document.getElementById('admin-overlay-view');
    if (view) {
      view.classList.remove('active');
      document.body.style.overflow = '';
    }

    if (window.location.hash === '#admin') {
      history.replaceState(null, null, ' ');
    }
  },

  // Inactivity tracking (Auto-closes after 2 minutes of no usage)
  startInactivityTracker() {
    this.stopInactivityTracker();
    DataStore.updateSessionActivity();

    this.activityHandler = () => {
      DataStore.updateSessionActivity();
      this.resetInactivityTimer();
    };

    ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll'].forEach(evt => {
      window.addEventListener(evt, this.activityHandler, { passive: true });
    });

    this.resetInactivityTimer();

    // Periodic check every 5 seconds for tab switching / sleep
    this.checkInterval = setInterval(() => {
      const lastActive = parseInt(sessionStorage.getItem('henna_last_active') || '0', 10);
      if (Date.now() - lastActive >= this.INACTIVITY_LIMIT) {
        this.handleSessionTimeout();
      }
    }, 5000);
  },

  resetInactivityTimer() {
    if (this.inactivityTimeout) {
      clearTimeout(this.inactivityTimeout);
    }
    this.inactivityTimeout = setTimeout(() => {
      this.handleSessionTimeout();
    }, this.INACTIVITY_LIMIT);
  },

  stopInactivityTracker() {
    if (this.inactivityTimeout) {
      clearTimeout(this.inactivityTimeout);
      this.inactivityTimeout = null;
    }
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
    if (this.activityHandler) {
      ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll'].forEach(evt => {
        window.removeEventListener(evt, this.activityHandler);
      });
      this.activityHandler = null;
    }
  },

  handleSessionTimeout() {
    this.closeDashboard();
    showToast('⚠️ Admin panel closed due to 2 minutes of inactivity.');
  },

  switchTab(tabId) {
    this.activeTab = tabId;

    // Update active nav button
    document.querySelectorAll('.admin-nav-item button').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-tab') === tabId);
    });

    // Update active pane
    document.querySelectorAll('.admin-tab').forEach(tab => {
      tab.classList.toggle('active', tab.id === tabId);
    });

    this.renderAllDashboardPanels();
  },

  renderAdminState() {
    // Whenever visiting or clicking #admin, always require entering credentials
    if (window.location.hash === '#admin') {
      this.openLogin();
    }
  },

  renderAllDashboardPanels() {
    this.renderOverviewStats();
    this.populateContentForm();
    this.renderServicesManagement();
    this.renderGalleryManagement();
    this.renderReviewsManagement();
    this.renderBookingsManagement();
    this.populateInstagramForm();
  },

  // 1. Overview Stats
  renderOverviewStats() {
    const bookings = DataStore.getBookings();
    const services = DataStore.getServices();
    const gallery = DataStore.getGallery();
    const reviews = DataStore.getReviews();

    const newBookingsCount = bookings.filter(b => b.status === 'New').length;

    const elTotalBookings = document.getElementById('stat-total-bookings');
    const elNewBookings = document.getElementById('stat-new-bookings');
    const elGalleryCount = document.getElementById('stat-gallery-count');
    const elServicesCount = document.getElementById('stat-services-count');
    const elReviewsCount = document.getElementById('stat-reviews-count');

    if (elTotalBookings) elTotalBookings.textContent = bookings.length;
    if (elNewBookings) elNewBookings.textContent = `${newBookingsCount} New`;
    if (elGalleryCount) elGalleryCount.textContent = gallery.length;
    if (elServicesCount) elServicesCount.textContent = services.length;
    if (elReviewsCount) elReviewsCount.textContent = reviews.length;
  },

  // 2. Website Content Form
  populateContentForm() {
    const info = DataStore.getSiteInfo();
    const form = document.getElementById('admin-content-form');
    if (!form) return;

    form['brandName'].value = info.brandName || '';
    form['tagline'].value = info.tagline || '';
    form['heroSubtitle'].value = info.heroSubtitle || '';
    form['location'].value = info.location || '';
    form['aboutBio'].value = info.aboutBio || '';
    form['aboutStyle'].value = info.aboutStyle || '';
    form['aboutPassion'].value = info.aboutPassion || '';
    form['experienceSummary'].value = info.experienceSummary || '';
    form['artistPhoto'].value = info.artistPhoto || '';

    const preview = document.getElementById('admin-artist-photo-preview');
    if (preview && info.artistPhoto) {
      preview.src = info.artistPhoto;
    }
  },

  saveWebsiteContent() {
    const form = document.getElementById('admin-content-form');
    if (!form) return;

    const updates = {
      brandName: form['brandName'].value.trim(),
      tagline: form['tagline'].value.trim(),
      heroSubtitle: form['heroSubtitle'].value.trim(),
      location: form['location'].value.trim(),
      aboutBio: form['aboutBio'].value.trim(),
      aboutStyle: form['aboutStyle'].value.trim(),
      aboutPassion: form['aboutPassion'].value.trim(),
      experienceSummary: form['experienceSummary'].value.trim(),
      artistPhoto: form['artistPhoto'].value.trim()
    };

    DataStore.updateSiteInfo(updates);
    showToast('Website content updated successfully!');
  },

  // 3. Services Management (Strictly NO prices)
  renderServicesManagement() {
    const list = DataStore.getServices();
    const container = document.getElementById('admin-services-list');
    if (!container) return;

    container.innerHTML = list.map(srv => `
      <div class="admin-item-card">
        <img src="${srv.image || 'assets/images/bridal_mehndi.jpg'}" alt="${srv.title}" class="admin-item-img-preview">
        <div class="admin-item-body">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <h4 class="admin-item-title">${srv.icon || '🌿'} ${srv.title}</h4>
            <span class="badge-status" style="background:var(--gold-subtle); color:var(--primary); font-size:0.75rem;">${srv.badge || 'Service'}</span>
          </div>
          <p class="admin-item-desc">${srv.description}</p>
          <div class="admin-item-actions">
            <button type="button" class="btn btn-outline btn-sm" onclick="AdminApp.editServiceModal('${srv.id}')">Edit</button>
            <button type="button" class="btn btn-outline btn-sm" style="color:#dc2626; border-color:#fca5a5;" onclick="AdminApp.deleteServiceItem('${srv.id}')">Delete</button>
          </div>
        </div>
      </div>
    `).join('');
  },

  openAddServiceModal() {
    this.openCrudModal({
      title: 'Add New Mehndi Service',
      fields: [
        { label: 'Service Title', name: 'title', type: 'text', placeholder: 'e.g. Traditional Mehndi', required: true },
        { label: 'Emoji / Icon', name: 'icon', type: 'text', placeholder: 'e.g. 🌿, 🪷, ✨', value: '✨' },
        { label: 'Badge (Optional)', name: 'badge', type: 'text', placeholder: 'e.g. Exclusive, Popular', value: 'Special' },
        { label: 'Image URL or Upload', name: 'image', type: 'file_or_url', value: 'assets/images/bridal_mehndi.jpg' },
        { label: 'Description', name: 'description', type: 'textarea', placeholder: 'Describe the style and detailing...', required: true }
      ],
      onSave: (data) => {
        DataStore.addService(data);
        this.renderServicesManagement();
        this.renderOverviewStats();
        showToast('New service added successfully!');
      }
    });
  },

  editServiceModal(id) {
    const srv = DataStore.getServices().find(s => s.id === id);
    if (!srv) return;

    this.openCrudModal({
      title: 'Edit Mehndi Service',
      fields: [
        { label: 'Service Title', name: 'title', type: 'text', value: srv.title, required: true },
        { label: 'Emoji / Icon', name: 'icon', type: 'text', value: srv.icon || '🌿' },
        { label: 'Badge (Optional)', name: 'badge', type: 'text', value: srv.badge || '' },
        { label: 'Image URL or Upload', name: 'image', type: 'file_or_url', value: srv.image },
        { label: 'Description', name: 'description', type: 'textarea', value: srv.description, required: true }
      ],
      onSave: (data) => {
        DataStore.updateService(id, data);
        this.renderServicesManagement();
        showToast('Service details updated!');
      }
    });
  },

  deleteServiceItem(id) {
    if (confirm('Are you sure you want to delete this service?')) {
      DataStore.deleteService(id);
      this.renderServicesManagement();
      this.renderOverviewStats();
      showToast('Service removed.');
    }
  },

  // 4. Gallery Management
  renderGalleryManagement() {
    const list = DataStore.getGallery();
    const container = document.getElementById('admin-gallery-list');
    if (!container) return;

    container.innerHTML = list.map(item => `
      <div class="admin-item-card">
        <img src="${item.image}" alt="${item.title}" class="admin-item-img-preview">
        <div class="admin-item-body">
          <div class="admin-item-meta">${item.category}</div>
          <h4 class="admin-item-title">${item.title}</h4>
          <p class="admin-item-desc">${item.caption || 'No caption'}</p>
          <div class="admin-item-actions">
            <button type="button" class="btn btn-outline btn-sm" onclick="AdminApp.editGalleryModal('${item.id}')">Edit</button>
            <button type="button" class="btn btn-outline btn-sm" style="color:#dc2626; border-color:#fca5a5;" onclick="AdminApp.deleteGalleryItem('${item.id}')">Delete</button>
          </div>
        </div>
      </div>
    `).join('');
  },

  openAddGalleryModal() {
    this.openCrudModal({
      title: 'Add Photo to Gallery',
      fields: [
        { label: 'Design Title', name: 'title', type: 'text', placeholder: 'e.g. Royal Bridal Lotus', required: true },
        {
          label: 'Category', name: 'category', type: 'select',
          options: ['Bridal Designs', 'Arabic Designs', 'Party Designs', 'Simple Designs', 'Custom Designs']
        },
        { label: 'Image URL or Upload', name: 'image', type: 'file_or_url', value: 'assets/images/bridal_mehndi.jpg', required: true },
        { label: 'Caption / Detailing (Optional)', name: 'caption', type: 'textarea', placeholder: 'Short description of the henna style...' }
      ],
      onSave: (data) => {
        DataStore.addGalleryItem(data);
        this.renderGalleryManagement();
        this.renderOverviewStats();
        showToast('New photo added to gallery!');
      }
    });
  },

  editGalleryModal(id) {
    const item = DataStore.getGallery().find(g => g.id === id);
    if (!item) return;

    this.openCrudModal({
      title: 'Edit Gallery Photo',
      fields: [
        { label: 'Design Title', name: 'title', type: 'text', value: item.title, required: true },
        {
          label: 'Category', name: 'category', type: 'select', value: item.category,
          options: ['Bridal Designs', 'Arabic Designs', 'Party Designs', 'Simple Designs', 'Custom Designs']
        },
        { label: 'Image URL or Upload', name: 'image', type: 'file_or_url', value: item.image, required: true },
        { label: 'Caption / Detailing (Optional)', name: 'caption', type: 'textarea', value: item.caption || '' }
      ],
      onSave: (data) => {
        DataStore.updateGalleryItem(id, data);
        this.renderGalleryManagement();
        showToast('Gallery item updated!');
      }
    });
  },

  deleteGalleryItem(id) {
    if (confirm('Delete this photo from your gallery?')) {
      DataStore.deleteGalleryItem(id);
      this.renderGalleryManagement();
      this.renderOverviewStats();
      showToast('Photo removed from gallery.');
    }
  },

  // 5. Reviews Management
  renderReviewsManagement() {
    const list = DataStore.getReviews();
    const container = document.getElementById('admin-reviews-list');
    if (!container) return;

    container.innerHTML = list.map(rev => `
      <div class="admin-card" style="margin-bottom: 1.25rem;">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom: 0.75rem;">
          <div>
            <h4 style="font-family:var(--font-serif); font-size:1.25rem; color:var(--primary-deep); font-weight:700;">${rev.name}</h4>
            <span style="font-size:0.8rem; color:var(--text-light);">${rev.date || 'Recent Client'} • ★★★★★</span>
          </div>
          <div style="display:flex; gap:0.5rem;">
            <button type="button" class="btn btn-outline btn-sm" onclick="AdminApp.editReviewModal('${rev.id}')">Edit</button>
            <button type="button" class="btn btn-outline btn-sm" style="color:#dc2626; border-color:#fca5a5;" onclick="AdminApp.deleteReviewItem('${rev.id}')">Delete</button>
          </div>
        </div>
        <p style="font-size:0.95rem; color:var(--text-main); font-style:italic; line-height:1.6;">"${rev.text}"</p>
      </div>
    `).join('');
  },

  openAddReviewModal() {
    this.openCrudModal({
      title: 'Add Client Review',
      fields: [
        { label: 'Customer Name', name: 'name', type: 'text', placeholder: 'e.g. Fatima N.', required: true },
        { label: 'Review Date (e.g. September 2026)', name: 'date', type: 'text', value: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) },
        { label: 'Customer Review Text', name: 'text', type: 'textarea', placeholder: 'Enter review comments...', required: true }
      ],
      onSave: (data) => {
        DataStore.addReview(data);
        this.renderReviewsManagement();
        this.renderOverviewStats();
        showToast('Review added successfully!');
      }
    });
  },

  editReviewModal(id) {
    const rev = DataStore.getReviews().find(r => r.id === id);
    if (!rev) return;

    this.openCrudModal({
      title: 'Edit Client Review',
      fields: [
        { label: 'Customer Name', name: 'name', type: 'text', value: rev.name, required: true },
        { label: 'Review Date', name: 'date', type: 'text', value: rev.date || '' },
        { label: 'Customer Review Text', name: 'text', type: 'textarea', value: rev.text, required: true }
      ],
      onSave: (data) => {
        DataStore.updateReview(id, data);
        this.renderReviewsManagement();
        showToast('Review updated!');
      }
    });
  },

  deleteReviewItem(id) {
    if (confirm('Delete this review?')) {
      DataStore.deleteReview(id);
      this.renderReviewsManagement();
      this.renderOverviewStats();
      showToast('Review deleted.');
    }
  },

  // 6. Bookings Management
  renderBookingsManagement(filterStatus = 'all') {
    const bookings = DataStore.getBookings();
    const tableBody = document.getElementById('admin-bookings-table-body');
    if (!tableBody) return;

    const filtered = filterStatus === 'all' 
      ? bookings 
      : bookings.filter(b => b.status.toLowerCase() === filterStatus.toLowerCase());

    if (filtered.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:2rem; color:var(--text-muted);">No booking requests found in this category.</td></tr>`;
      return;
    }

    tableBody.innerHTML = filtered.map(b => {
      const statusClass = 'status-' + (b.status ? b.status.toLowerCase() : 'new');
      return `
        <tr>
          <td>
            <strong>${b.name}</strong>
            <div style="font-size:0.75rem; color:var(--text-light);">${b.createdAt || ''}</div>
          </td>
          <td>${b.date}</td>
          <td>${b.eventType}</td>
          <td>${b.designType}</td>
          <td>${b.location || 'Muzaffargarh'}</td>
          <td style="max-width:240px; font-size:0.85rem; color:var(--text-muted);">${b.message || '—'}</td>
          <td>
            <select class="form-control" style="padding:0.35rem 0.6rem; font-size:0.8rem; width:auto;" onchange="AdminApp.changeBookingStatus('${b.id}', this.value)">
              <option value="New" ${b.status === 'New' ? 'selected' : ''}>New</option>
              <option value="Contacted" ${b.status === 'Contacted' ? 'selected' : ''}>Contacted</option>
              <option value="Confirmed" ${b.status === 'Confirmed' ? 'selected' : ''}>Confirmed</option>
              <option value="Completed" ${b.status === 'Completed' ? 'selected' : ''}>Completed</option>
              <option value="Cancelled" ${b.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
            </select>
          </td>
        </tr>
      `;
    }).join('');
  },

  changeBookingStatus(id, newStatus) {
    DataStore.updateBookingStatus(id, newStatus);
    this.renderOverviewStats();
    showToast(`Booking marked as ${newStatus}`);
  },

  // 7. Instagram Settings
  populateInstagramForm() {
    const info = DataStore.getSiteInfo();
    const form = document.getElementById('admin-instagram-form');
    if (!form) return;

    form['instagramUrl'].value = info.instagramUrl || '';
    form['instagramHandle'].value = info.instagramHandle || '';
  },

  saveInstagramSettings() {
    const form = document.getElementById('admin-instagram-form');
    if (!form) return;

    const instagramUrl = form['instagramUrl'].value.trim();
    const instagramHandle = form['instagramHandle'].value.trim();

    DataStore.updateSiteInfo({
      instagramUrl,
      instagramHandle
    });

    showToast('Instagram profile settings saved successfully!');
  },

  // Generic Reusable Modal for CRUD actions
  openCrudModal(config) {
    const modal = document.getElementById('admin-crud-modal');
    const headerTitle = document.getElementById('crud-modal-title');
    const bodyContainer = document.getElementById('crud-modal-body');
    const saveBtn = document.getElementById('crud-modal-save-btn');
    const cancelBtn = document.getElementById('crud-modal-cancel-btn');

    if (!modal) return;

    headerTitle.textContent = config.title;

    bodyContainer.innerHTML = config.fields.map(field => {
      if (field.type === 'textarea') {
        return `
          <div class="form-group">
            <label class="form-label">${field.label} ${field.required ? '*' : ''}</label>
            <textarea name="${field.name}" class="form-control" ${field.required ? 'required' : ''} placeholder="${field.placeholder || ''}">${field.value || ''}</textarea>
          </div>
        `;
      } else if (field.type === 'select') {
        return `
          <div class="form-group">
            <label class="form-label">${field.label}</label>
            <select name="${field.name}" class="form-control">
              ${field.options.map(opt => `<option value="${opt}" ${opt === field.value ? 'selected' : ''}>${opt}</option>`).join('')}
            </select>
          </div>
        `;
      } else if (field.type === 'file_or_url') {
        return `
          <div class="form-group">
            <label class="form-label">${field.label} ${field.required ? '*' : ''}</label>
            <div style="display:flex; flex-direction:column; gap:0.5rem;">
              <input type="text" name="${field.name}" id="crud-img-input" class="form-control" value="${field.value || ''}" placeholder="Image file path or URL">
              <div style="display:flex; align-items:center; gap:0.5rem;">
                <label class="btn btn-outline btn-sm" style="font-size:0.8rem; cursor:pointer;">
                  <span>Upload Local Photo</span>
                  <input type="file" accept="image/*" style="display:none;" onchange="AdminApp.handleFileToInput(event, 'crud-img-input', 'crud-img-preview')">
                </label>
                <span style="font-size:0.75rem; color:var(--text-muted);">(Auto-converts to high quality local image)</span>
              </div>
              <img id="crud-img-preview" src="${field.value || 'assets/images/bridal_mehndi.jpg'}" style="height:100px; width:140px; object-fit:cover; border-radius:6px; border:1px solid var(--border-light); margin-top:0.35rem;">
            </div>
          </div>
        `;
      } else {
        return `
          <div class="form-group">
            <label class="form-label">${field.label} ${field.required ? '*' : ''}</label>
            <input type="${field.type || 'text'}" name="${field.name}" class="form-control" value="${field.value || ''}" placeholder="${field.placeholder || ''}" ${field.required ? 'required' : ''}>
          </div>
        `;
      }
    }).join('');

    const cleanup = () => {
      modal.classList.remove('active');
      saveBtn.onclick = null;
      cancelBtn.onclick = null;
    };

    saveBtn.onclick = () => {
      const inputs = bodyContainer.querySelectorAll('input, select, textarea');
      const data = {};
      let valid = true;

      inputs.forEach(input => {
        if (input.required && !input.value.trim()) {
          input.focus();
          valid = false;
        }
        data[input.name] = input.value;
      });

      if (!valid) {
        alert('Please fill out all required fields.');
        return;
      }

      cleanup();
      config.onSave(data);
    };

    cancelBtn.onclick = cleanup;
    modal.classList.add('active');
  },

  handleFileToInput(event, inputId, previewId) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const input = document.getElementById(inputId);
        const preview = document.getElementById(previewId);
        if (input) input.value = e.target.result;
        if (preview) preview.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  },

  setupImageUploaders() {
    const artistFileInput = document.getElementById('admin-artist-file-input');
    if (artistFileInput) {
      artistFileInput.addEventListener('change', (e) => {
        this.handleFileToInput(e, 'admin-artist-photo-input', 'admin-artist-photo-preview');
      });
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  AdminApp.init();
});
