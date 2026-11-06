/* =============================================================================
   HIAAC-Rec Presentation Landing - Main JavaScript (main.js)
   ============================================================================= */

document.addEventListener("DOMContentLoaded", () => {
  initThemeToggle();
  initNavScroll();
  initCopyButtons();
  initArchitectureCarousel();
  initDownloadModal();
});

// ---- Theme Switcher (Light / Dark) ------------------------------------------
function initThemeToggle() {
  const toggleBtn = document.getElementById("theme-toggle-btn");
  const htmlEl = document.documentElement;

  // Retrieve saved preference or default to light
  const savedTheme = localStorage.getItem("hiaac-theme") || "light";
  htmlEl.setAttribute("data-theme", savedTheme);

  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      const current = htmlEl.getAttribute("data-theme") || "light";
      const next = current === "light" ? "dark" : "light";
      htmlEl.setAttribute("data-theme", next);
      localStorage.setItem("hiaac-theme", next);
    });
  }
}

// ---- Smooth Scroll & Active Nav Highlighting --------------------------------
function initNavScroll() {
  const navLinks = document.querySelectorAll(".nav-link[href^='#']");
  const sections = document.querySelectorAll("section[id]");

  window.addEventListener("scroll", () => {
    let currentId = "";
    const scrollPos = window.scrollY + 120;

    sections.forEach((sec) => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = sec.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === `#${currentId}`);
    });
  });
}

// ---- Copy to Clipboard Snippets ---------------------------------------------
function initCopyButtons() {
  const copyBtns = document.querySelectorAll(".btn-copy-code");
  copyBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetId = btn.dataset.copyTarget;
      const codeEl = document.getElementById(targetId);
      if (!codeEl) return;

      const text = codeEl.innerText.trim();
      navigator.clipboard.writeText(text).then(() => {
        const originalText = btn.textContent;
        const copiedLabel = window.hiaacI18n ? window.hiaacI18n.t("repro.copied") : "✓ Copied!";
        btn.textContent = copiedLabel;
        btn.style.color = "var(--sage-hi)";
        setTimeout(() => {
          btn.textContent = originalText;
          btn.style.color = "";
        }, 1500);
      });
    });
  });
}

// ---- Architecture Carousel & Pipeline Stepper ------------------------------
function initArchitectureCarousel() {
  const track = document.getElementById("arch-carousel-track");
  const prevBtn = document.getElementById("arch-prev-btn");
  const nextBtn = document.getElementById("arch-next-btn");
  const stepBtns = document.querySelectorAll(".arch-step-btn");
  const dots = document.querySelectorAll(".arch-dot");
  const slides = document.querySelectorAll(".arch-slide");

  if (!track || !slides.length) return;

  let currentSlide = 0;
  const totalSlides = slides.length;

  function goToSlide(index) {
    if (index < 0) index = totalSlides - 1;
    if (index >= totalSlides) index = 0;
    currentSlide = index;

    // Shift track
    track.style.transform = `translateX(-${currentSlide * 100}%)`;

    // Update active slide class
    slides.forEach((s, i) => s.classList.toggle("active", i === currentSlide));

    // Update stepper header button (the bold state passes between them)
    stepBtns.forEach((btn, i) => {
      const isActive = i === currentSlide;
      btn.classList.toggle("active", isActive);
      btn.setAttribute("aria-selected", isActive ? "true" : "false");
    });

    // Update pagination dots
    dots.forEach((dot, i) => dot.classList.toggle("active", i === currentSlide));
  }

  if (prevBtn) prevBtn.addEventListener("click", () => goToSlide(currentSlide - 1));
  if (nextBtn) nextBtn.addEventListener("click", () => goToSlide(currentSlide + 1));

  stepBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetSlide = parseInt(btn.dataset.slide, 10);
      if (!isNaN(targetSlide)) goToSlide(targetSlide);
    });
  });

  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      const targetSlide = parseInt(dot.dataset.slide, 10);
      if (!isNaN(targetSlide)) goToSlide(targetSlide);
    });
  });

  // Swipe gesture support
  let touchStartX = 0;
  let touchEndX = 0;
  track.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  track.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].screenX;
    if (touchStartX - touchEndX > 50) goToSlide(currentSlide + 1);
    else if (touchEndX - touchStartX > 50) goToSlide(currentSlide - 1);
  }, { passive: true });
}

// ---- Research Dataset Package Download Modal --------------------------------
function initDownloadModal() {
  const modal = document.getElementById("download-modal");
  const closeBtn = document.getElementById("modal-close-btn");
  const cancelBtn = document.getElementById("modal-cancel-btn") || document.getElementById("modal-close-cancel-btn");
  const confirmBtn = document.getElementById("modal-confirm-btn");
  const stageDownloadBtn = document.getElementById("btn-download-dataset");
  const finishBtn = document.getElementById("btn-finish-demo");

  const closeModal = () => {
    if (modal) modal.classList.remove("open");
  };

  const openModal = () => {
    if (window.hiaacDemo && typeof window.hiaacDemo.updateDownloadPackage === "function") {
      window.hiaacDemo.updateDownloadPackage();
    }
    if (modal) modal.classList.add("open");
  };

  if (stageDownloadBtn) stageDownloadBtn.addEventListener("click", openModal);
  if (finishBtn) finishBtn.addEventListener("click", openModal);
  if (closeBtn) closeBtn.addEventListener("click", closeModal);
  if (cancelBtn) cancelBtn.addEventListener("click", closeModal);

  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });
  }

  if (confirmBtn) {
    confirmBtn.addEventListener("click", () => {
      const originalText = confirmBtn.innerHTML;
      const isEn = !window.hiaacI18n || window.hiaacI18n.currentLang === "en";
      confirmBtn.innerHTML = `<span>⏳ ${isEn ? "Preparing Archive..." : "Preparando Arquivo..."}</span>`;
      confirmBtn.disabled = true;

      setTimeout(() => {
        // Download the actual research dataset package (.zip)
        const style = (window.hiaacDemo && window.hiaacDemo.maskStyle) || "blur";
        const zipFile = style === "pixelate" 
          ? "assets/eval02_dataset_pixelate.zip" 
          : style === "solid" 
            ? "assets/eval02_dataset_solid.zip" 
            : "assets/eval02_dataset_blur.zip";
        const downloadName = `eval_all_02_dataset_${style}.zip`;

        const a = document.createElement("a");
        a.href = zipFile;
        a.download = downloadName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        confirmBtn.innerHTML = `<span>✓ ${isEn ? "Download Complete!" : "Download Concluído!"}</span>`;
        setTimeout(() => {
          confirmBtn.innerHTML = originalText;
          confirmBtn.disabled = false;
          closeModal();
        }, 1200);
      }, 700);
    });
  }
}
