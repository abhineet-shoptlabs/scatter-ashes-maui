document.addEventListener('DOMContentLoaded', () => {
  // Navigation scroll behavior
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Mobile Menu Toggle
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  
  if (navToggle) {
    navToggle.addEventListener('click', () => {
      // Toggle a class or show simple drawer
      alert("Mobile menu opened! In a fully integrated environment, this displays a navigation drawer. Continuing using modern web interface.");
    });
  }

  // Cost Configuration
  const PRICING = {
    ceremony: {
      raft: { name: 'Super Raft (35 pax)', price: 2500 },
      snorkel: { name: 'Scatter & Snorkel (20 pax)', price: 3360 },
      helicopter: { name: 'Helicopter (3 pax)', price: 1500 },
      plane: { name: 'Fixed Wing Plane (3 pax)', price: 1055 },
      unattended: { name: 'Unattended Package', price: 1500 }
    },
    addons: {
      kahu: { name: 'Kahu Clergy (Hawaiian Style)', price: 450 },
      puolo: { name: 'Hawaiian Pu\'olo (Ti-leaf Urn)', price: 400 },
      urn: { name: 'Biodegradable Urn (Starts at)', price: 165 },
      petals: { name: 'Bags of Fresh Flower Petals', price: 30 },
      leis: { name: 'Fresh Ti Leaf / Orchid Leis', price: 40 },
      photo: { name: 'Photography Package (Starts at)', price: 300 },
      ukulele: { name: 'Hawaiian Ukulele Vocalist', price: 500 },
      hula: { name: 'Single Ceremonial Hula Dancer', price: 350 },
      dove: { name: 'White Dove Release', price: 250 },
      song: { name: 'Personalized Tribute Song', price: 295 },
      beach: { name: 'Memorial Beach/Land Service', price: 450 },
      wreath: { name: 'Memorial Wreaths on Easel', price: 400 }
    }
  };

  // State Management
  let selectedCeremony = 'raft'; // Default
  const selectedAddons = new Set();

  // Elements
  const ceremonyOptions = {
    raft: document.getElementById('opt-raft'),
    snorkel: document.getElementById('opt-snorkel'),
    helicopter: document.getElementById('opt-helicopter'),
    plane: document.getElementById('opt-plane'),
    unattended: document.getElementById('opt-unattended')
  };

  const addonOptions = {
    kahu: document.getElementById('opt-kahu'),
    puolo: document.getElementById('opt-puolo'),
    urn: document.getElementById('opt-urn'),
    petals: document.getElementById('opt-petals'),
    leis: document.getElementById('opt-leis'),
    photo: document.getElementById('opt-photo'),
    ukulele: document.getElementById('opt-ukulele'),
    hula: document.getElementById('opt-hula'),
    dove: document.getElementById('opt-dove'),
    song: document.getElementById('opt-song'),
    beach: document.getElementById('opt-beach'),
    wreath: document.getElementById('opt-wreath')
  };

  const summaryCeremony = document.getElementById('summary-ceremony');
  const summaryAddonsList = document.getElementById('summary-addons');
  const summaryTotal = document.getElementById('summary-total-val');
  const plannerInquiryBtn = document.getElementById('planner-inquiry-btn');
  const messageInput = document.getElementById('form-message');

  // Update Summary UI
  function updateSummary() {
    let totalPrice = 0;
    
    // Ceremony Choice
    const ceremonyDetails = PRICING.ceremony[selectedCeremony];
    totalPrice += ceremonyDetails.price;
    if (summaryCeremony) {
      summaryCeremony.textContent = `${ceremonyDetails.name} ($${ceremonyDetails.price})`;
    }

    // Addons Choices
    if (summaryAddonsList) {
      summaryAddonsList.innerHTML = '';
      if (selectedAddons.size === 0) {
        const li = document.createElement('li');
        li.className = 'summary-item';
        li.innerHTML = '<span class="summary-item-label">Add-ons Selected</span><span class="summary-item-val">None</span>';
        summaryAddonsList.appendChild(li);
      } else {
        selectedAddons.forEach(addonKey => {
          const addonDetails = PRICING.addons[addonKey];
          totalPrice += addonDetails.price;
          
          const li = document.createElement('li');
          li.className = 'summary-item';
          li.innerHTML = `
            <span class="summary-item-label">${addonDetails.name}</span>
            <span class="summary-item-val">$${addonDetails.price}</span>
          `;
          summaryAddonsList.appendChild(li);
        });
      }
    }

    // Update Total Display
    if (summaryTotal) {
      summaryTotal.textContent = `$${totalPrice}`;
    }
  }

  // Handle Ceremony Click Events
  Object.keys(ceremonyOptions).forEach(key => {
    const el = ceremonyOptions[key];
    if (!el) return;
    el.addEventListener('click', () => {
      // Clear previous selections from UI
      Object.keys(ceremonyOptions).forEach(k => {
        if (ceremonyOptions[k]) {
          ceremonyOptions[k].classList.remove('selected');
        }
      });
      selectedCeremony = key;
      el.classList.add('selected');
      updateSummary();
    });
  });

  // Handle Addon Click Events
  Object.keys(addonOptions).forEach(key => {
    const el = addonOptions[key];
    if (!el) return;
    el.addEventListener('click', () => {
      if (selectedAddons.has(key)) {
        selectedAddons.delete(key);
        el.classList.remove('selected');
      } else {
        selectedAddons.add(key);
        el.classList.add('selected');
      }
      updateSummary();
    });
  });

  // Initialize Summary
  updateSummary();

  // Populate form with planner settings on CTA click
  if (plannerInquiryBtn && messageInput) {
    plannerInquiryBtn.addEventListener('click', () => {
      const ceremonyDetails = PRICING.ceremony[selectedCeremony];
      let addonsString = '';
      selectedAddons.forEach(key => {
        addonsString += `\n- ${PRICING.addons[key].name}`;
      });
      if (addonsString === '') addonsString = '\n- No additional add-ons selected';

      messageInput.value = `Aloha,\n\nI am planning a ceremony and would like to inquire about the following selections:\n\n- Ceremony Type: ${ceremonyDetails.name}${addonsString}\n\nEstimated package quote: ${summaryTotal.textContent}.\n\nPlease contact me to discuss availability and customizations.`;
      
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // Link Service Card CTAs to contact form
  const serviceInquireButtons = document.querySelectorAll('.service-card-btn');
  serviceInquireButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const serviceName = btn.getAttribute('data-service');
      if (messageInput) {
        messageInput.value = `Aloha Scatter Ashes Maui team,\n\nI am interested in learning more about your service: "${serviceName}".\n\nPlease let me know your availability and rates.`;
      }
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Modal Dialog Control
  const modalOverlay = document.getElementById('success-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');

  function openSuccessModal() {
    if (modalOverlay) {
      modalOverlay.classList.add('open');
    }
  }

  function closeSuccessModal() {
    if (modalOverlay) {
      modalOverlay.classList.remove('open');
    }
  }

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeSuccessModal);
  }

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        closeSuccessModal();
      }
    });
  }

  // Inquiry Form Submission
  const contactForm = document.getElementById('inquiry-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Simple visual check for email / phone / name
      const name = document.getElementById('form-name').value;
      const email = document.getElementById('form-email').value;
      
      if (!name || !email) {
        alert("Please complete the required fields.");
        return;
      }

      // Success sequence
      openSuccessModal();
      contactForm.reset();
    });
  }
});
