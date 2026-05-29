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
      boat: { name: 'Serene Ocean Scatter (Vessel)', price: 1500 },
      plane: { name: 'Airborne Memorial Scatter (Plane)', price: 900 }
    },
    addons: {
      minister: { name: 'Kahu / Minister Service', price: 450 },
      music: { name: 'Live Musician (Ukulele/Singer)', price: 350 },
      photo: { name: 'Photography & Videography', price: 600 },
      urn: { name: 'Eco-friendly Urn & Products', price: 250 }
    }
  };

  // State Management
  let selectedCeremony = 'boat'; // Default
  const selectedAddons = new Set();

  // Elements
  const optionCeremonyBoat = document.getElementById('opt-boat');
  const optionCeremonyPlane = document.getElementById('opt-plane');
  const addonMinister = document.getElementById('opt-minister');
  const addonMusic = document.getElementById('opt-music');
  const addonPhoto = document.getElementById('opt-photo');
  const addonUrn = document.getElementById('opt-urn');

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

  // Handle Ceremony Clicks
  if (optionCeremonyBoat && optionCeremonyPlane) {
    optionCeremonyBoat.addEventListener('click', () => {
      selectedCeremony = 'boat';
      optionCeremonyBoat.classList.add('selected');
      optionCeremonyPlane.classList.remove('selected');
      updateSummary();
    });

    optionCeremonyPlane.addEventListener('click', () => {
      selectedCeremony = 'plane';
      optionCeremonyPlane.classList.add('selected');
      optionCeremonyBoat.classList.remove('selected');
      updateSummary();
    });
  }

  // Handle Addon Click Helper
  function setupAddonToggle(element, addonKey) {
    if (!element) return;
    element.addEventListener('click', () => {
      if (selectedAddons.has(addonKey)) {
        selectedAddons.delete(addonKey);
        element.classList.remove('selected');
      } else {
        selectedAddons.add(addonKey);
        element.classList.add('selected');
      }
      updateSummary();
    });
  }

  setupAddonToggle(addonMinister, 'minister');
  setupAddonToggle(addonMusic, 'music');
  setupAddonToggle(addonPhoto, 'photo');
  setupAddonToggle(addonUrn, 'urn');

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
