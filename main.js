// Simple modal + Marketo loader shared by all pages
document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("contact-modal");
  const closeBtn = document.getElementById("close-modal");

  // Any of these IDs or a [data-open-contact] will open the modal
  const triggerSelectors = ["#contact-btn", "#contactHeroBtn", "#contactCtaBtn", "[data-open-contact]"];
  const triggers = document.querySelectorAll(triggerSelectors.join(","));

  function setModalOpen(isOpen) {
    if (!modal) return;
    modal.setAttribute("aria-hidden", String(!isOpen));
    if (isOpen) {
      loadMarketoOnce();
      // prevent body scroll
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }

  function onKeyDown(e) {
    if (e.key === "Escape") setModalOpen(false);
  }

  function openModal(e) {
    if (e) e.preventDefault();
    setModalOpen(true);
    document.addEventListener("keydown", onKeyDown);
  }

  function closeModal(e) {
    if (e) e.preventDefault();
    setModalOpen(false);
    document.removeEventListener("keydown", onKeyDown);
  }

  // Wire triggers
  triggers.forEach(el => el && el.addEventListener("click", openModal));
  if (closeBtn) closeBtn.addEventListener("click", closeModal);

  // Click outside to close
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal || e.target.hasAttribute("data-close-modal")) closeModal(e);
    });
  }

  // ---- Marketo embed (edit your IDs below) ----
  let marketoLoaded = false;
  function loadMarketoOnce() {
    if (marketoLoaded) return;
    marketoLoaded = true;

    // TODO: replace these with your real values
    const MUNCHKIN_ID = "000-ABC-000"; // e.g., "123-ABC-456"
    const FORM_ID = 0000;              // e.g., 1234
    const BASE_URL = "//app-sj01.marketo.com"; // or your Marketo instance

    const container = document.getElementById("mktoFormContainer");
    if (!container) return;

    // Load Marketo forms2.js
    const script = document.createElement("script");
    script.src = `${BASE_URL}/js/forms2/js/forms2.min.js`;
    script.async = true;
    script.onload = () => {
      if (!window.MktoForms2) return;
      window.MktoForms2.loadForm(
        `${BASE_URL}`,
        MUNCHKIN_ID,
        FORM_ID,
        function(form) {
          // Optional: add hidden field or listeners
          // form.addHiddenFields({ source: "china-fast-track" });
        }
      );
    };
    container.innerHTML = ""; // clear loading text
    container.appendChild(script);
  }
});
