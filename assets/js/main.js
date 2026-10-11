/**
 * AURA HEALTH CLINIC - MODERN FRONTEND INTERACTIVE ENGINE
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initNavbar();
  initAnimatedCounters();
  initQuickBookingBar();
  initServicesFilter();
  initCareNavigator();
  initDoctorsDirectoryFilter();
  initDoctorProfiles();
  initFacilityCarousel();
  initPatientJourney();
  initHealthProfiler();
  initTestimonialsCarousel();
  initBlogModal();
  initFaqAccordion();
  initConciergeInquiryForm();
  initBookingModal();
  initInsuranceModal();
  initPatientPortalModal();
  initLegalModals();
  initScrollSpy();
  initBackToTop();
  initToast();
});

/* ==========================================================================
   1. NAVBAR & MOBILE DRAWER
   ========================================================================== */
function initNavbar() {
  const header = document.querySelector('.site-header');
  const toggleBtn = document.querySelector('.nav-toggle');
  const mobileDrawer = document.querySelector('.mobile-nav-drawer');
  const backdrop = document.querySelector('.mobile-nav-backdrop');
  const mobileLinks = document.querySelectorAll('.mobile-menu-links a');

  // Sticky compact scroll effect
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    if (currentScroll > 40) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
    lastScroll = currentScroll;
  }, { passive: true });

  // Mobile menu toggle
  function toggleMobileMenu(forceClose = false) {
    const isOpen = forceClose ? false : !mobileDrawer?.classList.contains('open');
    if (isOpen) {
      toggleBtn?.classList.add('open');
      mobileDrawer?.classList.add('open');
      backdrop?.classList.add('open');
      document.body.style.overflow = 'hidden';
      toggleBtn?.setAttribute('aria-expanded', 'true');
    } else {
      toggleBtn?.classList.remove('open');
      mobileDrawer?.classList.remove('open');
      backdrop?.classList.remove('open');
      document.body.style.overflow = '';
      toggleBtn?.setAttribute('aria-expanded', 'false');
    }
  }

  toggleBtn?.addEventListener('click', () => toggleMobileMenu());
  backdrop?.addEventListener('click', () => toggleMobileMenu(true));
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => toggleMobileMenu(true));
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileDrawer?.classList.contains('open')) {
      toggleMobileMenu(true);
    }
  });
}

/* ==========================================================================
   2. ANIMATED COUNTERS (TRUST SECTION)
   ========================================================================== */
function initAnimatedCounters() {
  const counterElements = document.querySelectorAll('.stat-number');
  if (!counterElements.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-target') || '0', 10);
        const prefix = el.getAttribute('data-prefix') || '';
        const suffix = el.getAttribute('data-suffix') || '';
        const duration = 1800; // ms
        const startTime = performance.now();

        function updateCounter(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          // Ease out cubic
          const easeProgress = 1 - Math.pow(1 - progress, 3);
          const currentCount = Math.floor(easeProgress * target);

          el.textContent = `${prefix}${currentCount.toLocaleString()}${suffix}`;

          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          } else {
            el.textContent = `${prefix}${target.toLocaleString()}${suffix}`;
          }
        }

        requestAnimationFrame(updateCounter);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.3 });

  counterElements.forEach(el => observer.observe(el));
}

/* ==========================================================================
   3. QUICK APPOINTMENT BAR
   ========================================================================== */
function initQuickBookingBar() {
  const quickForm = document.getElementById('quickBookingForm');
  if (!quickForm) return;

  // Set default min date to today
  const dateInput = document.getElementById('quickDate');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
    dateInput.value = today;
  }

  quickForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const department = document.getElementById('quickDepartment')?.value || '';
    const doctor = document.getElementById('quickDoctor')?.value || '';
    const date = document.getElementById('quickDate')?.value || '';
    const time = document.getElementById('quickTime')?.value || '';

    // Open booking modal with prefilled data
    openBookingModal({
      department,
      doctor,
      date,
      timeSlot: time
    });
  });
}

/* ==========================================================================
   4. SERVICES FILTER & DETAILS MODAL
   ========================================================================== */
const serviceData = {
  general: {
    title: 'General & Preventative Medicine',
    tag: 'Primary Care',
    desc: 'Comprehensive diagnostic care, annual health examinations, preventative screenings, and proactive wellness plans designed for life-long vitality.',
    features: ['Annual Comprehensive Checkups', 'Hypertension & Lipid Management', 'Vaccinations & Immunizations', 'Chronic Disease Optimization'],
    leadDoctor: 'Dr. Eleanor Vance, MD'
  },
  cardiology: {
    title: 'Cardiology & Vascular Health',
    tag: 'Specialized Care',
    desc: 'State-of-the-art cardiovascular health assessments including advanced electrocardiography, echocardiograms, lipid risk profiling, and vascular mapping.',
    features: ['Advanced Echocardiograms', 'Continuous ECG Holter Monitoring', 'Cardiac Stress Testing', 'Heart Failure Prevention & Care'],
    leadDoctor: 'Dr. Michael Chen, MD'
  },
  dermatology: {
    title: 'Dermatology & Skin Science',
    tag: 'Aesthetics & Health',
    desc: 'Evidence-based clinical dermatology and non-invasive medical aesthetics, addressing acute conditions, acne, eczema, and skin cancer surveillance.',
    features: ['Digital Dermatoscopic Mole Mapping', 'Acne & Rosacea Therapies', 'Eczema & Psoriasis Management', 'Biocompatible Skin Restoration'],
    leadDoctor: 'Dr. Elena Vance, MD'
  },
  pediatrics: {
    title: 'Pediatrics & Adolescent Care',
    tag: 'Family Health',
    desc: 'Compassionate care tailored for infants, children, and young teens in a gentle, warm, and stress-free clinical setting.',
    features: ['Developmental Milestones Tracking', 'Childhood Immunization Schedules', 'Adolescent Sports Screenings', 'Pediatric Allergy Assessments'],
    leadDoctor: 'Dr. Julian Rivera, MD'
  },
  orthopedics: {
    title: 'Orthopedics & Joint Mobility',
    tag: 'Surgical & Rehab',
    desc: 'Cutting-edge musculoskeletal care focusing on joint longevity, non-surgical sports injury rehabilitation, and minimally invasive treatments.',
    features: ['Joint Preservation & PRP Therapy', 'Sports Injury Assessment', 'Spinal Health & Posture Correction', 'Mobility Optimization Protocols'],
    leadDoctor: 'Dr. Julian Rivera, MD'
  },
  dental: {
    title: 'Preventative & Cosmetic Dental',
    tag: 'Oral Health',
    desc: 'High-precision dental diagnostics, painless ultrasonic hygiene, conservative restorations, and gentle cosmetic smiles in private suites.',
    features: ['3D Digital Cone Beam Imaging', 'Painless Ultrasonic Scaling', 'Bio-Ceramic Restorations', 'Cosmetic Aligners & Enamel Care'],
    leadDoctor: 'Dr. Eleanor Vance, MD'
  }
};

function initServicesFilter() {
  const filterBtns = document.querySelectorAll('.filter-tab-btn');
  const serviceCards = document.querySelectorAll('.service-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter') || 'all';

      serviceCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });

  // Service Card click opens service modal
  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('click', (e) => {
      // If clicked on quick book link inside
      if (e.target.closest('.service-quick-book')) {
        e.stopPropagation();
        const serviceKey = card.getAttribute('data-service');
        openBookingModal({ department: serviceKey });
        return;
      }

      const serviceKey = card.getAttribute('data-service');
      const details = serviceData[serviceKey];
      if (details) {
        openServiceModal(details);
      }
    });
  });
}

function openServiceModal(service) {
  const modal = document.getElementById('serviceDetailModal');
  if (!modal) return;

  document.getElementById('serviceModalTitle').textContent = service.title;
  document.getElementById('serviceModalTag').textContent = service.tag;
  document.getElementById('serviceModalDesc').textContent = service.desc;
  document.getElementById('serviceModalDoctor').textContent = `Clinical Lead: ${service.leadDoctor}`;

  const listEl = document.getElementById('serviceModalFeatures');
  if (listEl) {
    listEl.innerHTML = service.features.map(f => `
      <li class="about-feature-item">
        <span class="about-feature-check">✓</span>
        <span class="about-feature-text">${f}</span>
      </li>
    `).join('');
  }

  const bookBtn = document.getElementById('serviceModalBookBtn');
  if (bookBtn) {
    bookBtn.onclick = () => {
      closeAllModals();
      openBookingModal({ department: service.title });
    };
  }

  openModal(modal);
}

/* ==========================================================================
   5. FEATURED DOCTORS & PROFILE MODALS
   ========================================================================== */
const doctorsData = {
  eleanor: {
    name: 'Dr. Eleanor Vance, MD',
    specialty: 'Chief Physician & Internal Medicine',
    experience: '14+ Years Experience',
    education: 'Harvard Medical School (MD), Brigham & Women’s Hospital Residency',
    certifications: 'American Board of Internal Medicine, Fellow of American College of Physicians',
    bio: 'Dr. Eleanor Vance brings over a decade of clinical excellence in complex diagnostic medicine and preventative health optimization. Her practice focuses on personalized longevity regimens and holistic care.',
    availability: 'Monday – Thursday, 9:00 AM – 4:00 PM',
    photo: 'assets/images/hero_doctor.jpg',
    rating: '4.98 / 5.0 (340+ verified patient reviews)'
  },
  michael: {
    name: 'Dr. Michael Chen, MD, FACC',
    specialty: 'Senior Cardiologist & Cardiovascular Specialist',
    experience: '16+ Years Experience',
    education: 'Johns Hopkins School of Medicine, Stanford University Cardiology Fellowship',
    certifications: 'American Board of Internal Medicine (Cardiovascular Disease), FACC',
    bio: 'Dr. Michael Chen is a nationally recognized specialist in preventive cardiology and non-invasive vascular health. He pairs deep hemodynamic diagnostics with personalized lifestyle cardiometabolic interventions.',
    availability: 'Tuesday – Saturday, 8:30 AM – 3:30 PM',
    photo: 'assets/images/doctor_marcus.jpg',
    rating: '4.95 / 5.0 (290+ verified patient reviews)'
  },
  elena: {
    name: 'Dr. Elena Vance, MD',
    specialty: 'Chief of Clinical & Aesthetic Dermatology',
    experience: '12+ Years Experience',
    education: 'Columbia University Vagelos College of Physicians and Surgeons',
    certifications: 'American Board of Dermatology, American Academy of Dermatology',
    bio: 'Dr. Elena Vance specializes in medical dermatology, delicate skin restoration, and preventative skin cancer surveillance utilizing high-resolution digital dermoscopy.',
    availability: 'Monday, Wednesday, Friday, 10:00 AM – 6:00 PM',
    photo: 'assets/images/doctor_sarah.jpg',
    rating: '4.99 / 5.0 (410+ verified patient reviews)'
  },
  julian: {
    name: 'Dr. Julian Rivera, MD, FAAP',
    specialty: 'Pediatric Care & Musculoskeletal Medicine',
    experience: '11+ Years Experience',
    education: 'University of Washington School of Medicine, Seattle Children’s Hospital',
    certifications: 'American Board of Pediatrics, Sports & Musculoskeletal Certification',
    bio: 'Dr. Julian Rivera combines warm, compassionate bedside care for growing children with specialized expertise in pediatric musculoskeletal health, injury prevention, and family wellness.',
    availability: 'Monday – Friday, 9:00 AM – 5:00 PM',
    photo: 'assets/images/doctor_julian.jpg',
    rating: '4.97 / 5.0 (380+ verified patient reviews)'
  }
};

function initDoctorProfiles() {
  document.querySelectorAll('.btn-view-doctor').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const doctorKey = btn.getAttribute('data-doctor');
      const doc = doctorsData[doctorKey];
      if (doc) {
        openDoctorModal(doc);
      }
    });
  });

  document.querySelectorAll('.btn-book-doctor').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const doctorName = btn.getAttribute('data-doctor-name');
      openBookingModal({ doctor: doctorName });
    });
  });
}

function openDoctorModal(doc) {
  const modal = document.getElementById('doctorDetailModal');
  if (!modal) return;

  document.getElementById('docModalPhoto').src = doc.photo;
  document.getElementById('docModalName').textContent = doc.name;
  document.getElementById('docModalSpecialty').textContent = doc.specialty;
  document.getElementById('docModalExp').textContent = doc.experience;
  document.getElementById('docModalBio').textContent = doc.bio;
  document.getElementById('docModalEdu').textContent = doc.education;
  document.getElementById('docModalCert').textContent = doc.certifications;
  document.getElementById('docModalHours').textContent = doc.availability;
  document.getElementById('docModalRating').textContent = doc.rating;

  const bookBtn = document.getElementById('docModalBookBtn');
  if (bookBtn) {
    bookBtn.onclick = () => {
      closeAllModals();
      openBookingModal({ doctor: doc.name });
    };
  }

  openModal(modal);
}

/* ==========================================================================
   6. FACILITIES HORIZONTAL CAROUSEL
   ========================================================================== */
function initFacilityCarousel() {
  const container = document.getElementById('facilitiesScroll');
  const prevBtn = document.getElementById('facilityPrevBtn');
  const nextBtn = document.getElementById('facilityNextBtn');

  if (!container) return;

  const scrollAmount = 400;

  prevBtn?.addEventListener('click', () => {
    container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
  });

  nextBtn?.addEventListener('click', () => {
    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  });
}

/* ==========================================================================
   7. PATIENT JOURNEY INTERACTIVE STEPPER
   ========================================================================== */
const journeySteps = [
  {
    step: 1,
    title: 'Step 01 — Seamless Appointment Booking',
    desc: 'Reserve your appointment via our intuitive digital booking portal or private concierge hotline. Choose your preferred physician, time window, and clinical consultation preferences in seconds.',
    statNumber: 'Under 2 Min',
    statDesc: 'Average time to schedule without hold times or confusing phone trees.',
    tags: ['Instant Confirmation', 'SMS / Calendar Sync', 'Flexible Rescheduling']
  },
  {
    step: 2,
    title: 'Step 02 — Private Consultation & Listening',
    desc: 'Meet your dedicated physician in an unhurried, serene consultation suite. Our doctors devote 45 to 60 minutes for initial examinations, prioritizing in-depth dialogue, personal history, and lifestyle factors.',
    statNumber: '45+ Minutes',
    statDesc: 'Dedicated face-to-face physician time per initial appointment.',
    tags: ['Zero Rushed Visits', 'Acoustic Privacy', 'Holistic Review']
  },
  {
    step: 3,
    title: 'Step 03 — High-Precision Diagnostics',
    desc: 'Access advanced diagnostic imaging, rapid in-house pathology, and multi-marker biomarker screening immediately on site. Results are integrated directly into your private patient portal.',
    statNumber: 'Same-Day',
    statDesc: 'Laboratory results turnaround for over 90% of routine diagnostic panels.',
    tags: ['Low-Radiation 3T MRI', 'Automated Lab Tech', 'Secure Mobile Portal']
  },
  {
    step: 4,
    title: 'Step 04 — Tailored Treatment Blueprint',
    desc: 'Receive an evidence-based, customized health roadmap combining targeted therapeutics, preventive interventions, nutritional strategies, and transparent milestone tracking.',
    statNumber: '100% Custom',
    statDesc: 'Care plans co-created around your personal goals and clinical needs.',
    tags: ['Evidence-Based Care', 'Multidisciplinary Team', 'Transparent Plans']
  },
  {
    step: 5,
    title: 'Step 05 — Continuous Recovery & Concierge Follow-Up',
    desc: 'Your care does not end when you exit our doors. Enjoy seamless digital check-ins, automated prescription delivery from our clinical apothecary, and 24/7 clinical messaging support.',
    statNumber: '24/7 Access',
    statDesc: 'Direct messaging channel with our dedicated clinical care team.',
    tags: ['Prescription Delivery', 'Digital Symptom Tracker', 'Quarterly Checkpoints']
  }
];

function initPatientJourney() {
  const stepBtns = document.querySelectorAll('.journey-step-btn');
  const progressFill = document.querySelector('.journey-progress-fill');
  const titleEl = document.getElementById('journeyTitle');
  const descEl = document.getElementById('journeyDesc');
  const statEl = document.getElementById('journeyStat');
  const statDescEl = document.getElementById('journeyStatDesc');
  const tagsContainer = document.getElementById('journeyTags');

  if (!stepBtns.length) return;

  function renderStep(index) {
    const data = journeySteps[index];
    if (!data) return;

    stepBtns.forEach((btn, i) => {
      btn.classList.toggle('active', i === index);
      btn.classList.toggle('completed', i < index);
    });

    if (progressFill) {
      const percentage = (index / (journeySteps.length - 1)) * 100;
      progressFill.style.width = `${Math.max(percentage, 5)}%`;
    }

    if (titleEl) titleEl.textContent = data.title;
    if (descEl) descEl.textContent = data.desc;
    if (statEl) statEl.textContent = data.statNumber;
    if (statDescEl) statDescEl.textContent = data.statDesc;

    if (tagsContainer) {
      tagsContainer.innerHTML = data.tags.map(t => `<span class="journey-feature-tag">${t}</span>`).join('');
    }
  }

  stepBtns.forEach((btn, idx) => {
    btn.addEventListener('click', () => {
      renderStep(idx);
    });
  });

  renderStep(0);
}

/* ==========================================================================
   8. TESTIMONIALS CAROUSEL
   ========================================================================== */
const testimonialsList = [
  {
    quote: "“The atmosphere at Aura Clinic completely redefined what healthcare feels like. Dr. Vance spent a full hour listening to my symptoms without rushing. For the first time in years, I felt genuinely heard and understood.”",
    author: "Charlotte Montgomery",
    department: "Executive Preventive Health & Cardiology",
    initials: "CM"
  },
  {
    quote: "“From the tranquil lobby to the state-of-the-art diagnostic suite, everything feels calm, modern, and deeply professional. The same-day lab results gave our family immense peace of mind.”",
    author: "David H. Sterling",
    department: "Internal Medicine & Diagnostic Imaging",
    initials: "DS"
  },
  {
    quote: "“Dr. Elena Vance provided the most gentle, evidence-based skin treatment I've ever experienced. Their integrated apothecary even delivered my prescribed formulations right to my home.”",
    author: "Sophia L. Chen",
    department: "Clinical Dermatology & Skin Wellness",
    initials: "SC"
  },
  {
    quote: "“Taking kids to doctor appointments used to be stressful. Dr. Julian Rivera was so warm, reassuring, and playful that my 7-year-old actually asked when we can visit again!”",
    author: "Jonathan & Rebecca Patel",
    department: "Pediatric Wellness & Sports Medicine",
    initials: "JP"
  }
];

function initTestimonialsCarousel() {
  const quoteEl = document.getElementById('testQuote');
  const authorEl = document.getElementById('testAuthor');
  const deptEl = document.getElementById('testDept');
  const avatarEl = document.getElementById('testAvatar');
  const dots = document.querySelectorAll('.testimonial-dot');
  const prevBtn = document.getElementById('testPrevBtn');
  const nextBtn = document.getElementById('testNextBtn');

  if (!quoteEl) return;

  let currentIndex = 0;
  let autoplayTimer = null;

  function showTestimonial(idx) {
    currentIndex = (idx + testimonialsList.length) % testimonialsList.length;
    const t = testimonialsList[currentIndex];

    // Smooth transition
    quoteEl.style.opacity = '0';
    setTimeout(() => {
      quoteEl.textContent = t.quote;
      if (authorEl) authorEl.textContent = t.author;
      if (deptEl) deptEl.textContent = t.department;
      if (avatarEl) avatarEl.textContent = t.initials;
      quoteEl.style.opacity = '1';
    }, 150);

    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentIndex);
    });
  }

  function startAutoplay() {
    stopAutoplay();
    autoplayTimer = setInterval(() => {
      showTestimonial(currentIndex + 1);
    }, 6500);
  }

  function stopAutoplay() {
    if (autoplayTimer) clearInterval(autoplayTimer);
  }

  prevBtn?.addEventListener('click', () => {
    stopAutoplay();
    showTestimonial(currentIndex - 1);
    startAutoplay();
  });

  nextBtn?.addEventListener('click', () => {
    stopAutoplay();
    showTestimonial(currentIndex + 1);
    startAutoplay();
  });

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      stopAutoplay();
      showTestimonial(i);
      startAutoplay();
    });
  });

  const cardWrap = document.querySelector('.testimonial-card');
  cardWrap?.addEventListener('mouseenter', stopAutoplay);
  cardWrap?.addEventListener('mouseleave', startAutoplay);

  showTestimonial(0);
  startAutoplay();
}

/* ==========================================================================
   9. BLOG / HEALTH TIPS ARTICLE READER MODAL
   ========================================================================== */
const articlesData = {
  signs: {
    category: 'Preventative Health',
    date: 'October 1, 2026',
    title: '5 Subtle Health Warning Signs You Should Never Ignore',
    readTime: '4 min read',
    content: `
      <p>Modern busy schedules often lead us to dismiss mild or recurring physical symptoms as fatigue or minor stress. However, proactive diagnostic medicine emphasizes that early detection significantly transforms health trajectories.</p>
      <br>
      <h4>1. Unexplained Daytime Fatigue Despite Adequate Sleep</h4>
      <p>Persistent lethargy can signal subtle thyroid imbalances, sleep apnea, or occult micronutrient deficiencies such as ferritin and vitamin D3 depletion.</p>
      <br>
      <h4>2. Subtle Shortness of Breath on Moderate Exertion</h4>
      <p>Breathing discomfort during routine activities like climbing stairs should never simply be blamed on lack of conditioning. It warrants a prompt cardiovascular evaluation.</p>
      <br>
      <h4>3. Persistent Digestive Changes or Bloating</h4>
      <p>Changes in gastrointestinal rhythm lasting longer than three weeks warrant microbiome profiling and screening for food intolerances or inflammatory bowel factors.</p>
      <br>
      <h4>4. New Asymmetrical Skin Lesions or Pigment Shifts</h4>
      <p>Any evolving mole or irregular pigment border requires digital dermoscopy surveillance to rule out early atypical melanocytic growth.</p>
      <br>
      <h4>5. Sudden Changes in Headaches or Vision Flashes</h4>
      <p>New onset tension-style headaches or peripheral vision flickers should be professionally reviewed by an internist or neurologist.</p>
    `
  },
  checkups: {
    category: 'Clinical Wellness',
    date: 'September 24, 2026',
    title: 'How Comprehensive Annual Checkups Alter Long-Term Longevity',
    readTime: '5 min read',
    content: `
      <p>Traditional healthcare is largely reactive—treating disease only after symptoms develop. Preventative medicine shifts the paradigm toward proactive baseline tracking and early risk intercept.</p>
      <br>
      <h4>The Power of Advanced Biomarker Screening</h4>
      <p>Standard basic blood tests often miss early cardiovascular markers such as Apolipoprotein B (ApoB), high-sensitivity CRP (hs-CRP), and fasting insulin resistance. By charting these metrics annually, our clinicians can personalize cardiovascular prevention a decade before clinical events manifest.</p>
      <br>
      <h4>Vascular Age vs. Chronological Age</h4>
      <p>With non-invasive vascular elasticity scoring and continuous ECG monitoring, you gain clear visibility into your arterial biology and metabolic resilience.</p>
    `
  },
  habits: {
    category: 'Lifestyle Medicine',
    date: 'September 18, 2026',
    title: 'Four Micro-Habits for Sustained Cardiovascular Vitality',
    readTime: '3 min read',
    content: `
      <p>True wellness is cultivated through consistent micro-habits rather than extreme temporary diets. Here are four physician-backed practices you can integrate right away:</p>
      <br>
      <ul>
        <li><strong>Post-Meal 10-Minute Walks:</strong> Light ambulatory movement immediately following meals significantly blunts postprandial glucose spikes.</li>
        <li><strong>Consistent Morning Sun Exposure:</strong> 15 minutes of early sunlight resets your circadian cortisol curve, improving nocturnal sleep depth and blood pressure regulation.</li>
        <li><strong>Hydration with Natural Electrolytes:</strong> Adequate intracellular hydration maintains optimal endothelial vascular lining flexibility.</li>
        <li><strong>Deliberate Down-Regulation:</strong> 5 minutes of box breathing triggers vagus nerve parasympathetic activation, buffering chronic adrenergic stress.</li>
      </ul>
    `
  },
  preventative: {
    category: 'Family Healthcare',
    date: 'September 10, 2026',
    title: 'Understanding Multi-Generational Preventative Care',
    readTime: '4 min read',
    content: `
      <p>From pediatrics to active aging, family health is inherently interconnected. Building an integrated care relationship with a dedicated family clinic ensures coordinated history tracking and seamless communication across life stages.</p>
      <br>
      <h4>Coordinated Health History Mapping</h4>
      <p>When our physicians review family health records holistically, hereditary predispositions are flagged early, ensuring pediatric and adult family members receive timely screenings tailored to genetic context.</p>
    `
  }
};

function initBlogModal() {
  document.querySelectorAll('.btn-read-article').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const articleKey = btn.getAttribute('data-article');
      const article = articlesData[articleKey];
      if (article) {
        openArticleModal(article);
      }
    });
  });
}

function openArticleModal(article) {
  const modal = document.getElementById('articleDetailModal');
  if (!modal) return;

  document.getElementById('articleModalCategory').textContent = article.category;
  document.getElementById('articleModalDate').textContent = `${article.date} • ${article.readTime}`;
  document.getElementById('articleModalTitle').textContent = article.title;
  document.getElementById('articleModalBody').innerHTML = article.content;

  openModal(modal);
}

/* ==========================================================================
   10. INTERACTIVE APPOINTMENT BOOKING MODAL
   ========================================================================== */
function initBookingModal() {
  const modal = document.getElementById('appointmentBookingModal');
  if (!modal) return;

  const step1 = document.getElementById('bookingStep1');
  const step2 = document.getElementById('bookingStep2');
  const step3 = document.getElementById('bookingStep3');
  const step4 = document.getElementById('bookingStep4');

  const pill1 = document.getElementById('pillStep1');
  const pill2 = document.getElementById('pillStep2');
  const pill3 = document.getElementById('pillStep3');

  // Next and Back buttons
  const toStep2Btn = document.getElementById('btnToStep2');
  const backTo1Btn = document.getElementById('btnBackTo1');
  const toStep3Btn = document.getElementById('btnToStep3');
  const backTo2Btn = document.getElementById('btnBackTo2');
  const confirmBtn = document.getElementById('btnConfirmBooking');

  // Slot buttons
  let selectedSlotTime = '10:00 AM';
  document.querySelectorAll('.slot-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.slot-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedSlotTime = btn.getAttribute('data-slot') || btn.textContent.trim();
    });
  });

  // Step transitions
  toStep2Btn?.addEventListener('click', () => {
    step1.style.display = 'none';
    step2.style.display = 'block';
    pill1.classList.remove('active');
    pill1.classList.add('completed');
    pill2.classList.add('active');
  });

  backTo1Btn?.addEventListener('click', () => {
    step2.style.display = 'none';
    step1.style.display = 'block';
    pill2.classList.remove('active');
    pill1.classList.remove('completed');
    pill1.classList.add('active');
  });

  toStep3Btn?.addEventListener('click', () => {
    step2.style.display = 'none';
    step3.style.display = 'block';
    pill2.classList.remove('active');
    pill2.classList.add('completed');
    pill3.classList.add('active');
  });

  backTo2Btn?.addEventListener('click', () => {
    step3.style.display = 'none';
    step2.style.display = 'block';
    pill3.classList.remove('active');
    pill2.classList.remove('completed');
    pill2.classList.add('active');
  });

  // Final Confirmation
  confirmBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    const nameInput = document.getElementById('patientName');
    const phoneInput = document.getElementById('patientPhone');
    const emailInput = document.getElementById('patientEmail');

    if (!nameInput?.value.trim()) {
      showToast('Please enter your full name.', 'error');
      nameInput?.focus();
      return;
    }
    if (!phoneInput?.value.trim()) {
      showToast('Please enter a valid phone number.', 'error');
      phoneInput?.focus();
      return;
    }

    // Generate random confirmation code
    const randomCode = 'AUR-' + Math.floor(1000 + Math.random() * 9000);
    const docSelect = document.getElementById('modalSelectDoctor')?.value || 'Dr. Eleanor Vance, MD';
    const dateVal = document.getElementById('modalBookingDate')?.value || new Date().toISOString().split('T')[0];

    document.getElementById('confirmPassCode').textContent = randomCode;
    document.getElementById('confirmPassDoctor').textContent = docSelect;
    document.getElementById('confirmPassDateTime').textContent = `${dateVal} at ${selectedSlotTime}`;
    document.getElementById('confirmPassPatient').textContent = nameInput.value;

    step3.style.display = 'none';
    step4.style.display = 'block';
    document.querySelector('.booking-steps-indicator').style.display = 'none';

    showToast(`Appointment confirmed! Booking ID: ${randomCode}`, 'success');
  });

  // Global CTA Book Buttons
  document.querySelectorAll('.btn-trigger-booking').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openBookingModal();
    });
  });

  // Calendar sync and download pass handlers
  document.getElementById('btnDownloadPass')?.addEventListener('click', () => {
    downloadAppointmentPass();
  });

  document.getElementById('btnAddToCalendar')?.addEventListener('click', () => {
    downloadAppointmentIcs();
  });
}

function openBookingModal(prefill = {}) {
  const modal = document.getElementById('appointmentBookingModal');
  if (!modal) return;

  // Reset steps
  document.getElementById('bookingStep1').style.display = 'block';
  document.getElementById('bookingStep2').style.display = 'none';
  document.getElementById('bookingStep3').style.display = 'none';
  document.getElementById('bookingStep4').style.display = 'none';
  const stepsIndicator = document.querySelector('.booking-steps-indicator');
  if (stepsIndicator) stepsIndicator.style.display = 'flex';

  const pill1 = document.getElementById('pillStep1');
  const pill2 = document.getElementById('pillStep2');
  const pill3 = document.getElementById('pillStep3');

  if (pill1) pill1.className = 'booking-step-pill active';
  if (pill2) pill2.className = 'booking-step-pill';
  if (pill3) pill3.className = 'booking-step-pill';

  // Apply prefill if available
  if (prefill.department) {
    const deptSelect = document.getElementById('modalSelectDept');
    if (deptSelect) {
      for (let i = 0; i < deptSelect.options.length; i++) {
        if (deptSelect.options[i].text.toLowerCase().includes(prefill.department.toLowerCase()) ||
            deptSelect.options[i].value.toLowerCase().includes(prefill.department.toLowerCase())) {
          deptSelect.selectedIndex = i;
          break;
        }
      }
    }
  }
  if (prefill.doctor) {
    const docSelect = document.getElementById('modalSelectDoctor');
    if (docSelect) {
      for (let i = 0; i < docSelect.options.length; i++) {
        if (docSelect.options[i].text.toLowerCase().includes(prefill.doctor.toLowerCase())) {
          docSelect.selectedIndex = i;
          break;
        }
      }
    }
  }
  if (prefill.date) {
    const dateInput = document.getElementById('modalBookingDate');
    if (dateInput) dateInput.value = prefill.date;
  }
  if (prefill.reason) {
    const notesInput = document.getElementById('patientNotes');
    if (notesInput) notesInput.value = prefill.reason;
  }

  openModal(modal);
}

/* ==========================================================================
   GLOBAL MODAL HELPERS & FOCUS TRAP
   ========================================================================== */
function openModal(modalEl) {
  closeAllModals();
  modalEl.classList.add('active');
  document.body.style.overflow = 'hidden';

  // Attach close listener
  const closeBtns = modalEl.querySelectorAll('.modal-close-trigger');
  closeBtns.forEach(b => {
    b.onclick = () => closeAllModals();
  });

  modalEl.onclick = (e) => {
    if (e.target === modalEl) {
      closeAllModals();
    }
  };
}

function closeAllModals() {
  document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.classList.remove('active');
  });
  document.body.style.overflow = '';
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeAllModals();
  }
});

/* ==========================================================================
   11. SCROLL SPY & ACTIVE NAV
   ========================================================================== */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-menu .nav-link');

  window.addEventListener('scroll', () => {
    let currentId = '';
    const scrollPos = window.pageYOffset + 220;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (currentId && link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  }, { passive: true });
}

/* ==========================================================================
   12. BACK TO TOP BUTTON
   ========================================================================== */
function initBackToTop() {
  const btn = document.querySelector('.back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 500) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ==========================================================================
   13. TOAST NOTIFICATION SYSTEM
   ========================================================================== */
let toastContainer = null;

function initToast() {
  toastContainer = document.querySelector('.toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }
}

function showToast(message, type = 'success') {
  if (!toastContainer) initToast();

  const toast = document.createElement('div');
  toast.className = 'toast';
  
  const iconMarkup = type === 'success' 
    ? `<span class="toast-icon success"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg></span>`
    : `<span class="toast-icon" style="background:#fee2e2;color:#b91c1c;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg></span>`;

  toast.innerHTML = `
    ${iconMarkup}
    <span class="toast-message">${message}</span>
  `;

  toastContainer.appendChild(toast);

  // Animate in
  setTimeout(() => toast.classList.add('show'), 10);

  // Auto remove after 3.8s
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, 3800);
}

// Global hook
window.showToast = showToast;
window.openBookingModal = openBookingModal;

/* ==========================================================================
   14. THEME TOGGLE (DARK & LIGHT MODE)
   ========================================================================== */
function initThemeToggle() {
  const desktopBtn = document.getElementById('themeToggle');
  const mobileBtn = document.getElementById('mobileThemeToggle');

  // Check saved theme or system preference
  const savedTheme = localStorage.getItem('aura-clinic-theme');
  const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }

  function toggleTheme() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    if (isDark) {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('aura-clinic-theme', 'light');
      showToast('Switched to Serene Light Mode', 'success');
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('aura-clinic-theme', 'dark');
      showToast('Switched to Luxury Dark Mode', 'success');
    }
  }

  desktopBtn?.addEventListener('click', toggleTheme);
  mobileBtn?.addEventListener('click', toggleTheme);
}

/* ==========================================================================
   15. CARE NAVIGATOR (SYMPTOM & SPECIALTY MATCHER)
   ========================================================================== */
const navigatorCareData = {
  fatigue: {
    department: 'General & Preventative Medicine',
    title: 'Fatigue & Cellular Longevity Evaluation',
    summary: 'A whole-body diagnostic assessment designed to uncover occult micronutrient depletion, thyroid imbalances, and subtle metabolic dysregulation.',
    doctorName: 'Dr. Eleanor Vance, MD',
    doctorTitle: 'Chief Internist (14+ yrs exp)',
    doctorPhoto: 'assets/images/hero_doctor.jpg',
    protocols: [
      'Complete Thyroid Panel & Free T3/T4',
      'Serum Ferritin, B12 & Vitamin D3 Profile',
      'High-Sensitivity CRP & Fasting Insulin'
    ],
    duration: '45-60 min comprehensive consultation',
    prep: 'Fasting recommended if booking morning bloodwork',
    departmentKey: 'General Medicine'
  },
  cardio: {
    department: 'Cardiology & Vascular Health',
    title: 'Comprehensive Cardiovascular Vitality Scan',
    summary: 'Advanced hemodynamic profiling to assess arterial elasticity, cardiac rhythm irregularities, and early atherosclerotic risk markers.',
    doctorName: 'Dr. Michael Chen, MD, FACC',
    doctorTitle: 'Senior Cardiologist (16+ yrs exp)',
    doctorPhoto: 'assets/images/doctor_marcus.jpg',
    protocols: [
      'Digital 12-Lead Rest & Stress ECG',
      'High-Resolution Transthoracic Echocardiogram',
      'Apolipoprotein B (ApoB) & Lipid Subfraction Profile'
    ],
    duration: '60 min specialized cardiovascular consult',
    prep: 'Wear comfortable athletic attire for ECG assessment',
    departmentKey: 'Cardiology'
  },
  skin: {
    department: 'Dermatology & Skin Science',
    title: 'Precision Dermatoscopy & Barrier Health',
    summary: 'High-magnification digital epiluminescence surveillance for suspicious pigment shifts, coupled with biocompatible restorative skin protocols.',
    doctorName: 'Dr. Elena Vance, MD',
    doctorTitle: 'Chief Dermatologist (12+ yrs exp)',
    doctorPhoto: 'assets/images/doctor_sarah.jpg',
    protocols: [
      'Full-Body Digital Mole Mapping (Fotofinder Dermoscopy)',
      'Epidermal Transepidermal Water Loss Profiling',
      'Targeted Non-Steroidal Barrier Optimization'
    ],
    duration: '45 min dermatological evaluation',
    prep: 'Avoid heavy cosmetics or topical retinoids on exam day',
    departmentKey: 'Dermatology'
  },
  joints: {
    department: 'Orthopedics & Joint Mobility',
    title: 'Musculoskeletal & Biomechanical Longevity',
    summary: 'Non-surgical joint preservation protocols targeting ligament strain, cartilage wear, posture imbalances, and sports injury rehabilitation.',
    doctorName: 'Dr. Julian Rivera, MD, FAAP',
    doctorTitle: 'Sports & Musculoskeletal Specialist (11+ yrs exp)',
    doctorPhoto: 'assets/images/doctor_julian.jpg',
    protocols: [
      'Dynamic Musculoskeletal Ultrasound Mapping',
      'Joint Mobility & Functional Movement Screening',
      'PRP & Regenerative Therapy Candidacy Assessment'
    ],
    duration: '45 min physical & biomechanical review',
    prep: 'Bring shorts or athletic clothing for range-of-motion tests',
    departmentKey: 'Orthopedics'
  },
  pediatric: {
    department: 'Pediatrics & Adolescent Care',
    title: 'Gentle Pediatric Wellness & Growth Milestones',
    summary: 'Unhurried, anxiety-free clinical examinations for infants, children, and teenagers in our dedicated sound-insulated family suites.',
    doctorName: 'Dr. Julian Rivera, MD, FAAP',
    doctorTitle: 'Pediatric Specialist & Fellow (11+ yrs exp)',
    doctorPhoto: 'assets/images/doctor_julian.jpg',
    protocols: [
      'Comprehensive Developmental & Growth Tracking',
      'Gentle Pediatric Allergy & Airway Review',
      'Customized Immunization & Longevity Roadmap'
    ],
    duration: '45 min gentle child consultation',
    prep: 'Bring past vaccination records and feeding/sleep logs',
    departmentKey: 'Pediatrics'
  },
  dental: {
    department: 'Preventative & Cosmetic Dental',
    title: 'Aesthetic Enamel & Oral Microbiome Protocol',
    summary: 'High-precision digital oral imaging combined with zero-pain ultrasonic scaling, biological restorations, and gentle cosmetic aligner evaluations.',
    doctorName: 'Dr. Eleanor Vance, MD (Lead Clinical Board)',
    doctorTitle: 'Dental Suite Faculty Lead',
    doctorPhoto: 'assets/images/hero_doctor.jpg',
    protocols: [
      '3D Digital Cone Beam Dental Tomography',
      'Painless Ultrasonic Subgingival Micro-Cleanse',
      'Salivary pH & Oral Microbiome Resilience Panel'
    ],
    duration: '50 min private suite treatment',
    prep: 'Routine oral hygiene prior to visit; zero anxiety protocol',
    departmentKey: 'Dental Care'
  },
  longevity: {
    department: 'General & Preventative Medicine',
    title: 'Executive Longevity & Multi-Omics Profiling',
    summary: 'Our flagship proactive assessment examining genetic risk predispositions, vascular age, metabolic flexibility, and cellular senescence markers.',
    doctorName: 'Dr. Eleanor Vance, MD',
    doctorTitle: 'Chief Internist & Longevity Director',
    doctorPhoto: 'assets/images/hero_doctor.jpg',
    protocols: [
      'Complete Multi-Omic Blood & Hormone Panel (60+ biomarkers)',
      'Non-Invasive Arterial Stiffness & Vascular Age Scoring',
      'Continuous Glucose Monitor (CGM) 14-Day Calibration'
    ],
    duration: '75 min executive physician deep-dive',
    prep: '12-hour overnight fasting required for morning labs',
    departmentKey: 'General Medicine'
  }
};

let currentCareMatch = navigatorCareData.fatigue;

function initCareNavigator() {
  const chips = document.querySelectorAll('.symptom-chip');
  const resultCard = document.getElementById('navigatorResultCard');
  if (!chips.length || !resultCard) return;

  function updateCareDisplay(key) {
    const data = navigatorCareData[key];
    if (!data) return;
    currentCareMatch = data;

    chips.forEach(c => c.classList.toggle('active', c.getAttribute('data-symptom') === key));

    // Smooth update transition
    resultCard.style.opacity = '0.4';
    resultCard.style.transform = 'translateY(6px)';

    setTimeout(() => {
      document.getElementById('navResultDepartment').textContent = data.department;
      document.getElementById('navResultTitle').textContent = data.title;
      document.getElementById('navResultSummary').textContent = data.summary;
      document.getElementById('navDocName').textContent = data.doctorName;
      document.getElementById('navDocTitle').textContent = data.doctorTitle;
      document.getElementById('navDocThumb').src = data.doctorPhoto;

      const protocolList = document.getElementById('navProtocols');
      if (protocolList) {
        protocolList.innerHTML = data.protocols.map(p => `<li>${p}</li>`).join('');
      }

      document.getElementById('navDuration').textContent = data.duration;
      document.getElementById('navPrep').textContent = data.prep;

      resultCard.style.opacity = '1';
      resultCard.style.transform = 'translateY(0)';
    }, 150);
  }

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      const symptomKey = chip.getAttribute('data-symptom');
      updateCareDisplay(symptomKey);
    });
  });

  // 1-Click Book Matched Care button
  document.getElementById('btnBookMatchedCare')?.addEventListener('click', () => {
    openBookingModal({
      department: currentCareMatch.departmentKey || currentCareMatch.department,
      doctor: currentCareMatch.doctorName,
      reason: `Care Navigator Match: ${currentCareMatch.title}`
    });
  });
}

/* ==========================================================================
   16. DOCTORS DIRECTORY FILTER & SEARCH
   ========================================================================== */
function initDoctorsDirectoryFilter() {
  const filterBtns = document.querySelectorAll('.doc-filter-btn');
  const searchInput = document.getElementById('doctorSearchInput');
  const clearBtn = document.getElementById('doctorSearchClear');
  const doctorCards = document.querySelectorAll('.doctor-card');
  const noMessage = document.getElementById('noDoctorsMessage');
  const resetBtn = document.getElementById('btnResetDocFilter');

  if (!doctorCards.length) return;

  let activeSpecialty = 'all';
  let searchQuery = '';

  function applyFilter() {
    let visibleCount = 0;

    doctorCards.forEach(card => {
      const specialty = card.getAttribute('data-specialty') || '';
      const name = (card.getAttribute('data-name') || '').toLowerCase();

      const matchesSpecialty = activeSpecialty === 'all' || specialty === activeSpecialty;
      const matchesSearch = !searchQuery || name.includes(searchQuery);

      if (matchesSpecialty && matchesSearch) {
        card.style.display = 'block';
        card.style.opacity = '1';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    if (noMessage) {
      noMessage.style.display = visibleCount === 0 ? 'block' : 'none';
    }

    if (clearBtn) {
      clearBtn.style.display = searchQuery ? 'block' : 'none';
    }
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeSpecialty = btn.getAttribute('data-specialty') || 'all';
      applyFilter();
    });
  });

  searchInput?.addEventListener('input', (e) => {
    searchQuery = e.target.value.trim().toLowerCase();
    applyFilter();
  });

  clearBtn?.addEventListener('click', () => {
    if (searchInput) searchInput.value = '';
    searchQuery = '';
    applyFilter();
    searchInput?.focus();
  });

  resetBtn?.addEventListener('click', () => {
    if (searchInput) searchInput.value = '';
    searchQuery = '';
    activeSpecialty = 'all';
    filterBtns.forEach(b => b.classList.toggle('active', b.getAttribute('data-specialty') === 'all'));
    applyFilter();
  });
}

/* ==========================================================================
   17. HEALTH & LONGEVITY PROFILER (BMI & BIOMARKER CALCULATOR)
   ========================================================================== */
function initHealthProfiler() {
  const btnMetric = document.getElementById('btnUnitMetric');
  const btnImperial = document.getElementById('btnUnitImperial');
  const groupMetric = document.getElementById('groupHeightMetric');
  const groupImperial = document.getElementById('groupHeightImperial');
  
  const heightSlider = document.getElementById('calcHeightSlider');
  const heightInput = document.getElementById('calcHeight');
  const heightDisplay = document.getElementById('valHeightDisplay');

  const heightFt = document.getElementById('calcHeightFt');
  const heightIn = document.getElementById('calcHeightIn');

  const weightSlider = document.getElementById('calcWeightSlider');
  const weightInput = document.getElementById('calcWeight');
  const weightDisplay = document.getElementById('valWeightDisplay');
  const lblWeight = document.getElementById('lblWeight');

  const ageInput = document.getElementById('calcAge');
  const activitySelect = document.getElementById('calcActivity');
  const recalculateBtn = document.getElementById('btnRecalculateProfile');

  const bmiScoreEl = document.getElementById('calcBmiScore');
  const categoryPill = document.getElementById('calcCategoryPill');
  const categoryText = document.getElementById('calcCategoryText');
  const indicator = document.getElementById('spectrumIndicator');
  const adviceEl = document.getElementById('calcAdviceText');
  const testsContainer = document.getElementById('calcTestsContainer');

  let currentUnit = 'metric';

  // Toggle unit
  btnMetric?.addEventListener('click', () => {
    currentUnit = 'metric';
    btnMetric.classList.add('active');
    btnImperial.classList.remove('active');
    groupMetric.style.display = 'block';
    groupImperial.style.display = 'none';
    if (lblWeight) lblWeight.textContent = 'Weight (kg)';
    if (weightSlider) {
      weightSlider.min = 35;
      weightSlider.max = 160;
      weightSlider.value = 70;
    }
    if (weightInput) weightInput.value = 70;
    if (weightDisplay) weightDisplay.textContent = '70 kg';
    calculateProfile();
  });

  btnImperial?.addEventListener('click', () => {
    currentUnit = 'imperial';
    btnImperial.classList.add('active');
    btnMetric.classList.remove('active');
    groupMetric.style.display = 'none';
    groupImperial.style.display = 'block';
    if (lblWeight) lblWeight.textContent = 'Weight (lbs)';
    if (weightSlider) {
      weightSlider.min = 80;
      weightSlider.max = 350;
      weightSlider.value = 154;
    }
    if (weightInput) weightInput.value = 154;
    if (weightDisplay) weightDisplay.textContent = '154 lbs';
    calculateProfile();
  });

  // Metric Height Sync
  heightSlider?.addEventListener('input', (e) => {
    if (heightInput) heightInput.value = e.target.value;
    if (heightDisplay) heightDisplay.textContent = `${e.target.value} cm`;
    calculateProfile();
  });

  heightInput?.addEventListener('input', (e) => {
    if (heightSlider) heightSlider.value = e.target.value;
    if (heightDisplay) heightDisplay.textContent = `${e.target.value} cm`;
    calculateProfile();
  });

  // Weight Sync
  weightSlider?.addEventListener('input', (e) => {
    if (weightInput) weightInput.value = e.target.value;
    if (weightDisplay) weightDisplay.textContent = `${e.target.value} ${currentUnit === 'metric' ? 'kg' : 'lbs'}`;
    calculateProfile();
  });

  weightInput?.addEventListener('input', (e) => {
    if (weightSlider) weightSlider.value = e.target.value;
    if (weightDisplay) weightDisplay.textContent = `${e.target.value} ${currentUnit === 'metric' ? 'kg' : 'lbs'}`;
    calculateProfile();
  });

  heightFt?.addEventListener('input', calculateProfile);
  heightIn?.addEventListener('input', calculateProfile);
  ageInput?.addEventListener('input', calculateProfile);
  activitySelect?.addEventListener('change', calculateProfile);
  recalculateBtn?.addEventListener('click', calculateProfile);

  function calculateProfile() {
    let heightM = 1.75;
    let weightKg = 70;

    if (currentUnit === 'metric') {
      const hCm = parseFloat(heightInput?.value || '175');
      heightM = hCm / 100;
      weightKg = parseFloat(weightInput?.value || '70');
    } else {
      const ft = parseFloat(heightFt?.value || '5');
      const inch = parseFloat(heightIn?.value || '9');
      const totalInches = (ft * 12) + inch;
      heightM = totalInches * 0.0254;
      const lbs = parseFloat(weightInput?.value || '154');
      weightKg = lbs * 0.453592;
    }

    if (heightM <= 0 || weightKg <= 0) return;

    const bmi = weightKg / (heightM * heightM);
    const roundedBmi = Math.round(bmi * 10) / 10;

    if (bmiScoreEl) bmiScoreEl.textContent = roundedBmi.toFixed(1);

    // Spectrum indicator position: 15 to 35 range maps to 0% to 100%
    const minBmi = 16;
    const maxBmi = 36;
    const clampedBmi = Math.max(minBmi, Math.min(maxBmi, bmi));
    const percentage = ((clampedBmi - minBmi) / (maxBmi - minBmi)) * 100;
    if (indicator) indicator.style.left = `${percentage}%`;

    // Category and Clinical Guidance
    if (bmi < 18.5) {
      if (categoryPill) categoryPill.className = 'calc-category-pill pill-elevated';
      if (categoryText) categoryText.textContent = 'Underweight (< 18.5)';
      if (adviceEl) adviceEl.textContent = 'Your calculated BMI indicates lean mass or micronutrient depletion. We advise evaluating bone mineral density, serum albumin, and thyroid levels with our internal medicine faculty.';
      if (testsContainer) {
        testsContainer.innerHTML = `
          <span class="calc-test-chip">✓ DEXA Bone Mineral Density Scan</span>
          <span class="calc-test-chip">✓ Comprehensive Thyroid & Micronutrient Panel</span>
          <span class="calc-test-chip">✓ Nutritional Cellular Absorption Review</span>
        `;
      }
    } else if (bmi <= 24.9) {
      if (categoryPill) categoryPill.className = 'calc-category-pill pill-optimal';
      if (categoryText) categoryText.textContent = 'Optimal Range (18.5 – 24.9)';
      if (adviceEl) adviceEl.textContent = 'Your BMI reflects a healthy, balanced metabolic baseline. To maintain long-term cardiovascular resilience and longevity, our clinicians advise annual preventative lipid profiling (ApoB) and resting ECGs.';
      if (testsContainer) {
        testsContainer.innerHTML = `
          <span class="calc-test-chip">✓ Annual ApoB & Lipid Subfraction</span>
          <span class="calc-test-chip">✓ Fasting Glucose & Insulin (HOMA-IR)</span>
          <span class="calc-test-chip">✓ Resting ECG & Blood Pressure</span>
        `;
      }
    } else if (bmi <= 29.9) {
      if (categoryPill) categoryPill.className = 'calc-category-pill pill-elevated';
      if (categoryText) categoryText.textContent = 'Elevated Risk (25.0 – 29.9)';
      if (adviceEl) adviceEl.textContent = 'Your metric suggests mild visceral metabolic stress. Proactive intervention blunts cardiovascular and glycemic risks before clinical symptoms arise. Early vascular profiling is recommended.';
      if (testsContainer) {
        testsContainer.innerHTML = `
          <span class="calc-test-chip">✓ Advanced Hemodynamic & Echocardiogram</span>
          <span class="calc-test-chip">✓ High-Sensitivity CRP Inflammatory Markers</span>
          <span class="calc-test-chip">✓ Continuous Glucose Monitoring (CGM) Assessment</span>
        `;
      }
    } else {
      if (categoryPill) categoryPill.className = 'calc-category-pill pill-attention';
      if (categoryText) categoryText.textContent = 'Higher Attention (30.0+)';
      if (adviceEl) adviceEl.textContent = 'Your score indicates significant metabolic and joint load. A personalized multidisciplinary care blueprint integrating cardiology, endocrinology, and joint preservation is strongly advised.';
      if (testsContainer) {
        testsContainer.innerHTML = `
          <span class="calc-test-chip">✓ Comprehensive Cardiometabolic Panel</span>
          <span class="calc-test-chip">✓ Joint Preservation & Low-Impact Mobility Protocol</span>
          <span class="calc-test-chip">✓ Cellular Longevity & Metabolic Reset Roadmap</span>
        `;
      }
    }
  }

  // Book from calculator
  document.getElementById('btnBookFromCalc')?.addEventListener('click', () => {
    const currentScore = bmiScoreEl?.textContent || '22.9';
    openBookingModal({
      department: 'General & Preventative Medicine',
      doctor: 'Dr. Eleanor Vance, MD',
      reason: `Longevity Health Profiler consultation (Current BMI: ${currentScore})`
    });
  });

  calculateProfile();
}

/* ==========================================================================
   18. FAQ ACCORDION & SEARCH ENGINE
   ========================================================================== */
function initFaqAccordion() {
  const items = document.querySelectorAll('.faq-item');
  const catBtns = document.querySelectorAll('.faq-cat-btn');
  const searchInput = document.getElementById('faqSearchInput');

  if (!items.length) return;

  // Toggle item expansion
  items.forEach(item => {
    const questionBtn = item.querySelector('.faq-question-btn');
    questionBtn?.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      items.forEach(i => {
        i.classList.remove('open');
        i.querySelector('.faq-question-btn')?.setAttribute('aria-expanded', 'false');
      });

      if (!isOpen) {
        item.classList.add('open');
        questionBtn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // Filter by category
  let activeCat = 'all';
  let searchQuery = '';

  function filterFaqs() {
    items.forEach(item => {
      const category = item.getAttribute('data-category') || '';
      const text = item.textContent.toLowerCase();

      const matchesCat = activeCat === 'all' || category === activeCat;
      const matchesSearch = !searchQuery || text.includes(searchQuery);

      if (matchesCat && matchesSearch) {
        item.style.display = 'block';
      } else {
        item.style.display = 'none';
      }
    });
  }

  catBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      catBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeCat = btn.getAttribute('data-category') || 'all';
      filterFaqs();
    });
  });

  searchInput?.addEventListener('input', (e) => {
    searchQuery = e.target.value.trim().toLowerCase();
    filterFaqs();
  });
}

/* ==========================================================================
   19. CONCIERGE DIRECT INQUIRY FORM
   ========================================================================== */
function initConciergeInquiryForm() {
  const form = document.getElementById('conciergeInquiryForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('contactName')?.value.trim();
    const email = document.getElementById('contactEmail')?.value.trim();
    const dept = document.getElementById('contactDept')?.value || 'General Clinical Inquiries';
    const submitBtn = document.getElementById('btnSendConcierge');

    if (!name || !email) {
      showToast('Please fill in your name and email address.', 'error');
      return;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>Transmitting Message...</span>`;
    }

    setTimeout(() => {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<span>Send Message to Concierge</span><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>`;
      }
      form.reset();
      showToast(`Thank you ${name}! Your inquiry for ${dept} has been dispatched to our care team. We will respond within 2 hours.`, 'success');
    }, 1000);
  });
}

/* ==========================================================================
   20. INSURANCE NETWORK MODAL
   ========================================================================== */
function initInsuranceModal() {
  const modal = document.getElementById('insuranceModal');
  const searchInput = document.getElementById('insuranceSearchInput');
  const verifyBtn = document.getElementById('btnVerifyInsurance');
  const items = document.querySelectorAll('.insurance-item');

  document.querySelectorAll('.btn-trigger-insurance').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      closeAllModals();
      if (modal) openModal(modal);
    });
  });

  searchInput?.addEventListener('input', (e) => {
    const q = e.target.value.trim().toLowerCase();
    items.forEach(item => {
      const prov = (item.getAttribute('data-provider') || '').toLowerCase();
      item.style.display = (!q || prov.includes(q)) ? 'flex' : 'none';
    });
  });

  verifyBtn?.addEventListener('click', () => {
    const memberId = document.getElementById('insMemberId')?.value.trim();
    if (!memberId) {
      showToast('Please enter your insurance Member ID to verify benefits.', 'error');
      document.getElementById('insMemberId')?.focus();
      return;
    }

    showToast(`Eligibility verified for Member ${memberId}: Aura Clinic is In-Network with Tier 1 preventative coverage.`, 'success');
  });
}

/* ==========================================================================
   21. DIGITAL PATIENT PORTAL DEMO MODAL
   ========================================================================== */
function initPatientPortalModal() {
  const modal = document.getElementById('portalModal');
  const tabBtns = document.querySelectorAll('.portal-tab-btn');
  const tabVisits = document.getElementById('portalTabVisits');
  const tabLabs = document.getElementById('portalTabLabs');
  const tabMessages = document.getElementById('portalTabMessages');

  document.querySelectorAll('.btn-trigger-portal').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      closeAllModals();
      if (modal) openModal(modal);
    });
  });

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const tab = btn.getAttribute('data-portal-tab');

      if (tabVisits) tabVisits.style.display = tab === 'visits' ? 'block' : 'none';
      if (tabLabs) tabLabs.style.display = tab === 'labs' ? 'block' : 'none';
      if (tabMessages) tabMessages.style.display = tab === 'messages' ? 'block' : 'none';
    });
  });

  // Portal add to calendar button
  document.getElementById('btnPortalAddToCal')?.addEventListener('click', () => {
    downloadAppointmentIcs();
  });

  // Chat message send
  const msgInput = document.getElementById('portalMsgInput');
  const sendBtn = document.getElementById('btnSendPortalMsg');
  const chatBox = document.querySelector('.portal-chat-box');

  function sendMessage() {
    const text = msgInput?.value.trim();
    if (!text || !chatBox) return;

    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble patient-bubble';
    bubble.innerHTML = `
      <div class="chat-sender">Jane Foster (You) • Just now</div>
      <p>${text}</p>
    `;
    chatBox.appendChild(bubble);
    if (msgInput) msgInput.value = '';
    chatBox.scrollTop = chatBox.scrollHeight;

    // Simulate doctor team auto response
    setTimeout(() => {
      const docReply = document.createElement('div');
      docReply.className = 'chat-bubble doc-bubble';
      docReply.innerHTML = `
        <div class="chat-sender">Aura Clinical Concierge • Just now</div>
        <p>Your message has been received by Dr. Vance's clinical team. We will review and append any requested documentation to your chart.</p>
      `;
      chatBox.appendChild(docReply);
      chatBox.scrollTop = chatBox.scrollHeight;
    }, 1200);
  }

  sendBtn?.addEventListener('click', sendMessage);
  msgInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') sendMessage();
  });
}

/* ==========================================================================
   22. LEGAL POLICY MODALS
   ========================================================================== */
const legalData = {
  privacy: {
    badge: 'CONFIDENTIALITY & PRIVACY',
    title: 'Clinical Privacy & Data Governance Policy',
    body: `
      <p>Aura Health Clinic is committed to maintaining the highest clinical privacy standards. All medical health records (EHR), diagnostic imaging, genomic sequencing data, and patient-physician communications are encrypted end-to-end adhering strictly to HIPAA and HITECH standards.</p>
      <br>
      <h4>1. Information Collection & Medical Necessity</h4>
      <p>We only collect personal and biometric information necessary to deliver evidence-based clinical diagnostics and treatment roadmaps.</p>
      <br>
      <h4>2. Zero Third-Party Commercial Sharing</h4>
      <p>Your medical history, laboratory biomarkers, and personal contact details are never monetized, traded, or shared with external commercial data brokers under any circumstances.</p>
    `
  },
  terms: {
    badge: 'CLINICAL STANDARDS',
    title: 'Terms of Medical Consultation & Care',
    body: `
      <p>By scheduling an appointment at Aura Clinic, patients engage with a private clinical practice dedicated to thorough, unhurried healthcare.</p>
      <br>
      <h4>1. Scheduling & Dedicated Consultation Time</h4>
      <p>Our physicians devote 45 to 60 minutes for appointments. We request that patients arrive 10 minutes prior to their scheduled consultation.</p>
      <br>
      <h4>2. Telemedicine Protocols</h4>
      <p>Virtual telemedicine sessions are delivered over secure encrypted clinical channels and adhere to the same medical board ethics as in-person care.</p>
    `
  },
  hipaa: {
    badge: 'FEDERAL COMPLIANCE',
    title: 'HIPAA Patient Privacy & Rights Statement',
    body: `
      <p>Aura Clinic operates in full compliance with the Health Insurance Portability and Accountability Act (HIPAA) of 1996 and its Omnibus revisions.</p>
      <br>
      <h4>1. Right to Inspect Electronic Health Records</h4>
      <p>Patients hold the right to inspect, download, and request amendments to their diagnostic laboratory records and physician notes via the secure Patient Portal.</p>
      <br>
      <h4>2. Acoustic & Architectural Privacy</h4>
      <p>Every consultation suite and testing room in the Evergreen Pavilion has been acoustically engineered with STC 55 sound-dampening insulation to ensure total conversation privacy.</p>
    `
  },
  rights: {
    badge: 'PATIENT ADVOCACY',
    title: 'Patient Bill of Rights & Dignity In Care',
    body: `
      <p>Every individual receiving healthcare at Aura Clinic is entitled to respectful, compassionate, and non-discriminatory care.</p>
      <br>
      <h4>1. Unhurried Dialogue & Informed Consent</h4>
      <p>You have the right to receive complete, transparent explanations of all proposed diagnostics, biomarkers, therapeutics, and potential alternatives without feeling rushed.</p>
      <br>
      <h4>2. Direct Access to Clinical Advocates</h4>
      <p>Our Patient Liaison team is on campus daily to assist you with care coordination, second opinions, and billing transparently.</p>
    `
  }
};

function initLegalModals() {
  const modal = document.getElementById('legalModal');
  const badgeEl = document.getElementById('legalModalBadge');
  const titleEl = document.getElementById('legalModalTitle');
  const bodyEl = document.getElementById('legalModalBody');

  document.querySelectorAll('.footer-legal-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const legalKey = link.getAttribute('data-legal');
      const data = legalData[legalKey] || legalData.privacy;

      if (badgeEl) badgeEl.textContent = data.badge;
      if (titleEl) titleEl.textContent = data.title;
      if (bodyEl) bodyEl.innerHTML = data.body;

      if (modal) openModal(modal);
    });
  });
}

/* ==========================================================================
   23. REAL CALENDAR (.ICS) FILE GENERATION & PRINTABLE PASS
   ========================================================================== */
function downloadAppointmentIcs() {
  const code = document.getElementById('confirmPassCode')?.textContent || '#AUR-8429';
  const doctor = document.getElementById('confirmPassDoctor')?.textContent || 'Dr. Eleanor Vance, MD';
  const dateTimeStr = document.getElementById('confirmPassDateTime')?.textContent || '2026-10-15 at 10:00 AM';
  const patient = document.getElementById('confirmPassPatient')?.textContent || 'Valued Patient';

  const [datePart] = dateTimeStr.split(' at ');
  const cleanDate = (datePart || '2026-10-15').replace(/-/g, '');

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Aura Health Clinic//Medical Appointment//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${code.replace('#', '')}@auraclinic.com`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
    `DTSTART;VALUE=DATE:${cleanDate}`,
    `SUMMARY:Medical Consultation with ${doctor} - Aura Clinic`,
    `DESCRIPTION:Appointment Confirmation ID: ${code}\\nPatient: ${patient}\\nPhysician: ${doctor}\\nTime: ${dateTimeStr}\\nLocation: 742 Evergreen Medical Pavilion, Suite 400`,
    'LOCATION:742 Evergreen Medical Pavilion, Suite 400, New York, NY 10021',
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Aura_Clinic_Appointment_${code.replace('#', '')}.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  showToast('Calendar invite (.ics) downloaded. Open it to add directly to Google Calendar, Apple Calendar, or Outlook.', 'success');
}

function downloadAppointmentPass() {
  const code = document.getElementById('confirmPassCode')?.textContent || '#AUR-8429';
  const doctor = document.getElementById('confirmPassDoctor')?.textContent || 'Dr. Eleanor Vance, MD';
  const dateTimeStr = document.getElementById('confirmPassDateTime')?.textContent || '2026-10-15 at 10:00 AM';
  const patient = document.getElementById('confirmPassPatient')?.textContent || 'Jane Foster';

  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    showToast('Please enable popups to print your appointment pass.', 'error');
    return;
  }

  printWindow.document.write(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Aura Clinic — Official Appointment Pass (${code})</title>
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 40px; color: #142421; background: #fff; }
        .pass-container { max-width: 620px; margin: 0 auto; border: 2px solid #0a4640; border-radius: 20px; padding: 36px; box-shadow: 0 12px 36px rgba(0,0,0,0.08); }
        .pass-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #e5ede9; padding-bottom: 20px; margin-bottom: 24px; }
        .brand { font-size: 24px; font-weight: 800; color: #0a4640; letter-spacing: 0.04em; }
        .badge { background: #d1fae5; color: #065f46; padding: 6px 16px; border-radius: 99px; font-weight: 700; font-size: 13px; text-transform: uppercase; }
        .pass-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px dashed #e5ede9; }
        .label { color: #758c87; font-size: 14px; }
        .val { font-weight: 700; font-size: 15px; color: #142421; }
        .notice { margin-top: 24px; background: #fcfbf9; border-radius: 10px; padding: 18px; font-size: 12.5px; color: #4a615b; line-height: 1.6; border: 1px solid #e5ede9; }
        .barcode { text-align: center; margin-top: 24px; letter-spacing: 8px; font-family: monospace; font-size: 20px; color: #0a4640; font-weight: bold; }
        @media print { button { display: none; } }
      </style>
    </head>
    <body>
      <div class="pass-container">
        <div class="pass-header">
          <div>
            <div class="brand">AURA CLINIC</div>
            <div style="font-size: 12px; color: #758c87; margin-top: 3px;">Care. Trust. Wellness.</div>
          </div>
          <span class="badge">CONFIRMED PASS</span>
        </div>
        <div class="pass-row"><span class="label">Pass Code:</span><span class="val" style="color:#0a4640; font-size: 18px;">${code}</span></div>
        <div class="pass-row"><span class="label">Patient Name:</span><span class="val">${patient}</span></div>
        <div class="pass-row"><span class="label">Lead Physician:</span><span class="val">${doctor}</span></div>
        <div class="pass-row"><span class="label">Scheduled Time:</span><span class="val">${dateTimeStr}</span></div>
        <div class="pass-row"><span class="label">Clinical Campus:</span><span class="val">742 Evergreen Medical Pavilion, Suite 400, NY</span></div>
        <div class="pass-row"><span class="label">Concierge Hotline:</span><span class="val">+1 (800) 456-7890</span></div>
        <div class="barcode">||| | |||| | ||| |||| | ||| |||</div>
        <div class="notice">
          <strong>Check-in Instructions:</strong> Please present this digital pass upon arrival at the 4th floor reception lounge. Complimentary valet parking is provided at the main pavilion entrance canopy.
        </div>
      </div>
      <script>window.onload = function() { window.print(); };</script>
    </body>
    </html>
  `);
  printWindow.document.close();
}

