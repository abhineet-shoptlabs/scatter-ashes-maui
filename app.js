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
      alert("Mobile menu opened! In a fully integrated environment, this displays a navigation drawer. Continuing using modern web interface.");
    });
  }

  // Internationalization System
  let currentTranslations = {};
  const langSelect = document.getElementById('lang-select');

  async function loadTranslations(lang) {
    try {
      const response = await fetch(`locales/${lang}.json`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      currentTranslations = await response.json();
      applyTranslations();
      localStorage.setItem('selectedLanguage', lang);
    } catch (error) {
      console.error("Could not load translations:", error);
    }
  }

  function applyTranslations() {
    // Translate static elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (currentTranslations[key]) {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          el.placeholder = currentTranslations[key];
        } else {
          // If the element has internal HTML elements (like SVGs or spans), preserve them
          const innerSVG = el.querySelector('svg');
          if (innerSVG) {
            // Find text container span if exists, or just append after text
            const textSpan = el.querySelector('span[data-i18n]');
            if (textSpan) {
              textSpan.textContent = currentTranslations[key];
            } else {
              el.innerHTML = currentTranslations[key] + innerSVG.outerHTML;
            }
          } else {
            el.textContent = currentTranslations[key];
          }
        }
      }
    });

    // Update dynamically rendered sections (Summary Card / Dynamic text strings)
    updateSummary();
    updateFormPlaceholder();
  }

  function updateFormPlaceholder() {
    const messageInput = document.getElementById('form-message');
    if (messageInput && currentTranslations['form_msg_placeholder']) {
      messageInput.placeholder = currentTranslations['form_msg_placeholder'];
    }
  }

  if (langSelect) {
    langSelect.addEventListener('change', (e) => {
      loadTranslations(e.target.value);
    });

    // Load initial language from localStorage or default to English
    const savedLang = localStorage.getItem('selectedLanguage') || 'en';
    langSelect.value = savedLang;
    loadTranslations(savedLang);
  }

  // Cost Configuration
  const PRICING = {
    ceremony: {
      raft: { nameKey: 'planner_opt_raft_name', price: 2500 },
      snorkel: { nameKey: 'planner_opt_snorkel_name', price: 3360 },
      helicopter: { nameKey: 'planner_opt_helicopter_name', price: 1500 },
      plane: { nameKey: 'planner_opt_plane_name', price: 1055 },
      unattended: { nameKey: 'planner_opt_unattended_name', price: 1500 },
      special: { nameKey: 'planner_opt_special_name', price: 0 }
    },
    addons: {
      kahu: { nameKey: 'planner_opt_kahu_name', price: 450 },
      puolo: { nameKey: 'planner_opt_puolo_name', price: 400 },
      urn: { nameKey: 'planner_opt_urn_name', price: 165 },
      petals: { nameKey: 'planner_opt_petals_name', price: 30 },
      leis: { nameKey: 'planner_opt_leis_name', price: 40 },
      ukulele: { nameKey: 'planner_opt_ukulele_name', price: 500 },
      song: { nameKey: 'planner_opt_song_name', price: 295 },
      dove: { nameKey: 'planner_opt_dove_name', price: 250 },
      beach: { nameKey: 'planner_opt_beach_name', price: 450 },
      photo: { nameKey: 'planner_opt_photo_name', price: 500 },
      wreath: { nameKey: 'planner_opt_sea_wreath_name', price: 300 },
      bamboo: { nameKey: 'planner_opt_bamboo_float_name', price: 325 },
      easel: { nameKey: 'planner_opt_easel_wreath_name', price: 400 }
    }
  };

  // State Management
  let selectedCeremony = 'raft'; // Default
  const selectedAddons = new Set();
  let carryOnFee = 0;

  // Elements
  const ceremonyOptions = {
    raft: document.getElementById('opt-raft'),
    snorkel: document.getElementById('opt-snorkel'),
    helicopter: document.getElementById('opt-helicopter'),
    plane: document.getElementById('opt-plane'),
    unattended: document.getElementById('opt-unattended'),
    special: document.getElementById('opt-special')
  };

  const addonOptions = {
    kahu: document.getElementById('opt-kahu'),
    puolo: document.getElementById('opt-puolo'),
    urn: document.getElementById('opt-urn'),
    petals: document.getElementById('opt-petals'),
    leis: document.getElementById('opt-leis'),
    ukulele: document.getElementById('opt-ukulele'),
    song: document.getElementById('opt-song'),
    dove: document.getElementById('opt-dove'),
    beach: document.getElementById('opt-beach'),
    photo: document.getElementById('opt-photo'),
    wreath: document.getElementById('opt-sea-wreath'),
    bamboo: document.getElementById('opt-bamboo-float'),
    easel: document.getElementById('opt-easel-wreath')
  };

  const summaryCeremony = document.getElementById('summary-ceremony');
  const summaryAddonsList = document.getElementById('summary-addons');
  const summaryTotal = document.getElementById('summary-total-val');
  const plannerInquiryBtn = document.getElementById('planner-inquiry-btn');
  const messageInput = document.getElementById('form-message');

  // Cremains Elements
  const cremainsRadios = document.getElementsByName('res-cremains-type');
  const handoffContainer = document.getElementById('res-handoff-container');
  const handoffInput = document.getElementById('res-handoff-details');
  const ceremonyDateInput = document.getElementById('res-ceremony-date');

  // Check Cremains Handoff Date difference (Add $100 if < 3 days)
  function checkCremainsFee() {
    carryOnFee = 0;
    const isCarryOn = Array.from(cremainsRadios).find(r => r.checked && r.value === 'carryon');
    
    if (isCarryOn && ceremonyDateInput && ceremonyDateInput.value) {
      const ceremonyDate = new Date(ceremonyDateInput.value);
      // Look for a date string in the handoff details input or default to arrival date
      const arrivalDateInput = document.getElementById('res-arrival-date');
      const compareDateVal = arrivalDateInput ? arrivalDateInput.value : '';
      
      if (compareDateVal) {
        const compareDate = new Date(compareDateVal);
        const timeDiff = ceremonyDate.getTime() - compareDate.getTime();
        const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
        if (diffDays < 3 && diffDays >= 0) {
          carryOnFee = 100;
        }
      }
    }
    updateSummary();
  }

  // Monitor Radio Switches
  cremainsRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      if (radio.value === 'carryon') {
        handoffContainer.style.display = 'block';
      } else {
        handoffContainer.style.display = 'none';
        if (handoffInput) handoffInput.value = '';
      }
      checkCremainsFee();
    });
  });

  if (ceremonyDateInput) {
    ceremonyDateInput.addEventListener('change', checkCremainsFee);
  }
  const arrivalDateInput = document.getElementById('res-arrival-date');
  if (arrivalDateInput) {
    arrivalDateInput.addEventListener('change', checkCremainsFee);
  }

  // Update Summary UI
  function updateSummary() {
    let totalPrice = 0;
    
    // Ceremony Choice
    const ceremonyDetails = PRICING.ceremony[selectedCeremony];
    totalPrice += ceremonyDetails.price;
    const localizedCeremonyName = currentTranslations[ceremonyDetails.nameKey] || selectedCeremony;

    if (summaryCeremony) {
      if (ceremonyDetails.price === 0) {
        const pricingVariesText = currentTranslations['service_special_meta'] || '(Pricing Varies)';
        summaryCeremony.textContent = `${localizedCeremonyName} ${pricingVariesText}`;
      } else {
        summaryCeremony.textContent = `${localizedCeremonyName} ($${ceremonyDetails.price})`;
      }
    }

    // Addons Choices
    if (summaryAddonsList) {
      summaryAddonsList.innerHTML = '';
      if (selectedAddons.size === 0 && carryOnFee === 0) {
        const li = document.createElement('li');
        li.className = 'summary-item';
        const label = currentTranslations['summary_addons_selected'] || 'Add-ons Selected';
        const value = currentTranslations['summary_addons_none'] || 'None';
        li.innerHTML = `<span class="summary-item-label">${label}</span><span class="summary-item-val">${value}</span>`;
        summaryAddonsList.appendChild(li);
      } else {
        selectedAddons.forEach(addonKey => {
          const addonDetails = PRICING.addons[addonKey];
          totalPrice += addonDetails.price;
          const localizedAddonName = currentTranslations[addonDetails.nameKey] || addonKey;
          
          const li = document.createElement('li');
          li.className = 'summary-item';
          li.innerHTML = `
            <span class="summary-item-label">${localizedAddonName}</span>
            <span class="summary-item-val">+$${addonDetails.price}</span>
          `;
          summaryAddonsList.appendChild(li);
        });

        // Add Carry-on fee to summary list if applicable
        if (carryOnFee > 0) {
          const li = document.createElement('li');
          li.className = 'summary-item';
          li.style.color = 'var(--color-accent)';
          li.innerHTML = `
            <span class="summary-item-label">Carry-on Rush Fee (< 3 days)</span>
            <span class="summary-item-val">+$${carryOnFee}</span>
          `;
          summaryAddonsList.appendChild(li);
          totalPrice += carryOnFee;
        }
      }
    }

    // Update Total Display
    if (summaryTotal) {
      if (selectedCeremony === 'special') {
        const customText = currentTranslations['planner_opt_varies'] || 'Custom Pricing';
        summaryTotal.textContent = totalPrice > 0 ? `$${totalPrice} + ${customText}` : customText;
      } else {
        summaryTotal.textContent = `$${totalPrice}`;
      }
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

  // Bespoke section toggle logic
  const toggleBespokeBtn = document.getElementById('toggle-bespoke-btn');
  const bespokeGrid = document.getElementById('bespoke-grid');
  
  if (toggleBespokeBtn && bespokeGrid) {
    toggleBespokeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const isExpanded = bespokeGrid.classList.contains('expanded');
      if (isExpanded) {
        bespokeGrid.classList.remove('expanded');
        toggleBespokeBtn.textContent = currentTranslations['services_toggle_show_all'] || 'Show All Options';
        const bespokeHeader = document.querySelector('#services h3:nth-of-type(2)');
        if (bespokeHeader) {
          bespokeHeader.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      } else {
        bespokeGrid.classList.add('expanded');
        toggleBespokeBtn.textContent = currentTranslations['services_toggle_show_less'] || 'Show Less Options';
      }
    });
  }

  // Populate form with planner settings on CTA click
  if (plannerInquiryBtn && messageInput) {
    plannerInquiryBtn.addEventListener('click', (e) => {
      e.preventDefault();

      // Retrieve form details
      const contactName = document.getElementById('res-contact-name').value;
      const deceasedName = document.getElementById('res-deceased-name').value;
      const relation = document.getElementById('res-relation').value;
      const cellPhone = document.getElementById('res-phone-cell').value;
      const homePhone = document.getElementById('res-phone-home').value;
      const email = document.getElementById('res-email-addr').value;
      const date = document.getElementById('res-ceremony-date').value;
      const time = document.getElementById('res-ceremony-time').value;
      const harbor = document.getElementById('res-venue-harbor').value;
      const passengers = document.getElementById('res-passengers-count').value;
      const arrival = document.getElementById('res-arrival-date').value;
      const departure = document.getElementById('res-departure-date').value;
      const cremainsType = Array.from(cremainsRadios).find(r => r.checked).value;
      const handoff = document.getElementById('res-handoff-details').value;
      const special = document.getElementById('res-special-reqs').value;

      // Validate required details
      if (!contactName || !cellPhone || !email || !date || !time || !harbor || !passengers) {
        alert("Please fill in all required (*) reservation details before proceeding.");
        return;
      }

      const ceremonyDetails = PRICING.ceremony[selectedCeremony];
      const localizedCeremonyName = currentTranslations[ceremonyDetails.nameKey] || selectedCeremony;
      let addonsString = '';
      selectedAddons.forEach(key => {
        const localizedAddonName = currentTranslations[PRICING.addons[key].nameKey] || key;
        addonsString += `\n- ${localizedAddonName}`;
      });
      if (carryOnFee > 0) {
        addonsString += `\n- Carry-on Rush Fee (+$100)`;
      }

      // Build full reservation profile details string
      const resDetails = `
=== RESERVATION DETAILS ===
Contact Name: ${contactName}
Deceased Name: ${deceasedName || 'N/A'}
Relationship: ${relation || 'N/A'}
Cell Phone: ${cellPhone}
Home Phone: ${homePhone || 'N/A'}
Email: ${email}
Ceremony Date: ${date}
Ceremony Time: ${time}
Harbor/Venue: ${harbor}
Passengers: ${passengers}
Arrival Date: ${arrival || 'N/A'}
Departure Date: ${departure || 'N/A'}
Cremains Transport: ${cremainsType} ${handoff ? `(${handoff})` : ''}
Special Requests: ${special || 'None'}
`;

      messageInput.value = `Aloha,\n\nI am submitting a reservation booking request:\n${resDetails}\n\nSelected Ceremony: ${localizedCeremonyName}\nSelected Addons: ${addonsString || 'None'}\n\nEstimated quote: ${summaryTotal.textContent}.`;
      
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
      const parentCard = btn.closest('.service-card');
      let serviceName = '';
      if (parentCard) {
        const titleEl = parentCard.querySelector('.service-title');
        if (titleEl) serviceName = titleEl.textContent;
      }
      if (!serviceName) {
        serviceName = btn.getAttribute('data-service');
      }
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
