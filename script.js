
/* =========================================================
   DR. MAFT — INTERNATIONAL MEDICAL ADVISOR
   Website interactions and booking request helpers
   ========================================================= */

"use strict";

document.addEventListener("DOMContentLoaded", () => {
  // -------------------------------------------------------
  // 1. AUTOMATIC FOOTER YEAR
  // -------------------------------------------------------

  const yearElement = document.getElementById("current-year");

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // -------------------------------------------------------
  // 2. MOBILE NAVIGATION
  // Works if the corresponding elements exist in index.html.
  // -------------------------------------------------------

  const menuButton = document.querySelector(
    ".menu-toggle, .nav-toggle, #menu-toggle"
  );

  const navigation = document.querySelector(
    ".nav-links, .main-nav, #nav-links"
  );

  if (menuButton && navigation) {
    menuButton.setAttribute("aria-expanded", "false");

    menuButton.addEventListener("click", () => {
      const isOpen = navigation.classList.toggle("active");

      menuButton.setAttribute("aria-expanded", String(isOpen));
      menuButton.setAttribute(
        "aria-label",
        isOpen ? "Close navigation menu" : "Open navigation menu"
      );
    });

    navigation.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navigation.classList.remove("active");
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.setAttribute("aria-label", "Open navigation menu");
      });
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        navigation.classList.remove("active");
        menuButton.setAttribute("aria-expanded", "false");
      }
    });
  }

  // -------------------------------------------------------
  // 3. SMOOTH SCROLLING FOR INTERNAL LINKS
  // -------------------------------------------------------

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") return;

      const target = document.querySelector(targetId);

      if (target) {
        event.preventDefault();

        target.scrollIntoView({
          behavior: window.matchMedia(
            "(prefers-reduced-motion: reduce)"
          ).matches
            ? "auto"
            : "smooth",
          block: "start"
        });
      }
    });
  });

  // -------------------------------------------------------
  // 4. BOOKING BUTTONS
  // -------------------------------------------------------
  // These buttons can open an email request.
  // This does NOT confirm availability or collect payment.
  // Real booking/payment requires a connected booking system
  // and an approved, configured payment gateway.
  // -------------------------------------------------------

  const bookingOptions = {
    initial: {
      subject: "Initial Consultation Booking Request",
      price: 15
    },
    report: {
      subject: "Medical Report or Treatment-Plan Review Request",
      price: 20
    },
    professional: {
      subject: "Professional Help and Healthcare Navigation Request",
      price: 25
    },
    urgent: {
      subject: "Urgent Booking Request",
      price: 100
    },
    afterHours: {
      subject: "After-Hours Booking Request",
      price: 1000
    }
  };

  const bookingEmail = "appointments@drmaft.site";

  function openBookingRequest(type) {
    const option = bookingOptions[type];

    if (!option) return;

    const body = [
      "Dear Dr. MAFT,",
      "",
      "I would like to request the following service:",
      option.subject,
      `Listed fee: USD $${option.price}`,
      "",
      "Preferred appointment date:",
      "Preferred appointment time:",
      "Time zone / country:",
      "",
      "Please confirm availability, the applicable fee, and the",
      "secure payment procedure before my appointment is confirmed.",
      "",
      "I will not include sensitive medical records in this email.",
      "",
      "Thank you."
    ].join("\n");

    const mailto =
      `mailto:${bookingEmail}` +
      `?subject=${encodeURIComponent(option.subject)}` +
      `&body=${encodeURIComponent(body)}`;

    window.location.href = mailto;
  }

  // Supports buttons using data-booking attributes.
  document.querySelectorAll("[data-booking]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();

      const type = button.getAttribute("data-booking");
      openBookingRequest(type);
    });
  });

  // Supports buttons using common IDs, if present.
  const buttonIds = {
    "initial-booking": "initial",
    "report-booking": "report",
    "professional-booking": "professional",
    "urgent-booking": "urgent",
    "after-hours-booking": "afterHours"
  };

  Object.entries(buttonIds).forEach(([id, type]) => {
    const button = document.getElementById(id);

    if (button && !button.hasAttribute("data-booking")) {
      button.addEventListener("click", (event) => {
        event.preventDefault();
        openBookingRequest(type);
      });
    }
  });

  // -------------------------------------------------------
  // 5. CONTACT FORM VALIDATION
  // -------------------------------------------------------
  // Optional: activates only if a form with id="contact-form"
  // exists in index.html.
  // -------------------------------------------------------

  const contactForm = document.getElementById("contact-form");

  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      if (!contactForm.checkValidity()) {
        event.preventDefault();
        contactForm.reportValidity();
        return;
      }

      // No backend is configured by this script.
      // Prevent a false impression that the message was sent.
      event.preventDefault();

      const status = document.getElementById("form-status");

      if (status) {
        status.textContent =
          "This form is not connected yet. Please use the official contact email.";
        status.setAttribute("role", "status");
      } else {
        window.alert(
          "This form is not connected yet. Please email imacc@drmaft.site."
        );
      }
    });
  }

  // -------------------------------------------------------
  // 6. CURRENT YEAR AND EXTERNAL LINKS
  // -------------------------------------------------------

  document.querySelectorAll('a[target="_blank"]').forEach((link) => {
    link.setAttribute("rel", "noopener noreferrer");
  });

  // -------------------------------------------------------
  // 7. OPTIONAL REVEAL ANIMATIONS
  // Uses existing CSS reveal classes only.
  // -------------------------------------------------------

  const revealElements = document.querySelectorAll(".reveal");

  if (
    revealElements.length &&
    "IntersectionObserver" in window &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    const observer = new IntersectionObserver(
      (entries, currentObserver) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            currentObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    revealElements.forEach((element) => observer.observe(element));
  } else {
    revealElements.forEach((element) => {
      element.classList.add("visible");
    });
  }

  console.info("Dr. MAFT website scripts initialized.");
});
