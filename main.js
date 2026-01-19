/** @format */

// 1. Create Modal (Injects HTML)
function createMarketoModal() {
  if (document.getElementById("marketo-modal")) return;
  const modal = document.createElement("div");
  modal.id = "marketo-modal";

  modal.innerHTML = `
    <div class="modal-overlay"></div>
    <div class="modal-content">
      <button class="modal-close" id="marketoCloseBtn">&times;</button>
      <div id="marketoFormContainer">
        <form id="mktoForm_3339"></form>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}

// 2. Show/Hide Modal Helper Functions
function showMarketoModal() {
  const modal = document.getElementById("marketo-modal");
  if (modal) modal.style.display = "flex";
}

function hideMarketoModal() {
  const modal = document.getElementById("marketo-modal");
  if (modal) modal.style.display = "none";
}

// 3. Load Marketo Form Logic
function loadMarketoForm(formId, munchkinId) {
  // Uses https to ensure it works locally and on server
  MktoForms2.loadForm(
    `https://go.engage.here.com`,
    munchkinId,
    formId,
    function (form) {
      // When the form submits successfully:
      form.onSuccess(function (values, followUpUrl) {
        // Hide the modal
        hideMarketoModal();
        // Return false to prevent the page from reloading or redirecting
        return false;
      });
    }
  );
}

// 4. AGGRESSIVE CLEAR FUNCTION
function clearMarketoForm() {
  if (typeof MktoForms2 === "undefined") return;

  MktoForms2.whenReady(function (form) {
    // Standard reset
    form.reset();
    
    // Aggressive: Manually wipe all input values
    // This overrides Marketo's "Pre-fill" cookie data
    const formElem = form.getFormElem()[0];
    const inputs = formElem.querySelectorAll('input:not([type="hidden"]):not([type="submit"]), select, textarea');
    
    inputs.forEach(function(input) {
      input.value = '';
      if(input.type === 'checkbox' || input.type === 'radio') {
        input.checked = false;
      }
    });
  });
}

// 5. Main Event Listener
document.addEventListener("DOMContentLoaded", function () {
  createMarketoModal();
  const MARKETO_FORM_ID = 3339;
  const MUNCHKIN_ID = "142-UEL-347";

  // Open Form Logic
  function openForm(e) {
    e.preventDefault(); 
    showMarketoModal();

    const formEl = document.getElementById("mktoForm_3339");
    
    // Check if form is already loaded
    if (formEl && formEl.children.length === 0) {
      loadMarketoForm(MARKETO_FORM_ID, MUNCHKIN_ID);
    } else {
      // If it IS loaded, clear it now!
      clearMarketoForm();
    }
  }

  // Attach to Buttons
  const navBtn = document.getElementById("contactCtaBtn");
  if (navBtn) navBtn.addEventListener("click", openForm);

  const otherBtns = document.querySelectorAll(
    "#contact-btn, #footer-contact-btn, .contact-global-btn, .hero-cta, .btn-cta, .btn-text"
  );
  otherBtns.forEach(function (btn) {
    btn.addEventListener("click", openForm);
  });

  // Close Modal Logic
  document
    .getElementById("marketo-modal")
    .addEventListener("click", function (e) {
      if (
        e.target.classList.contains("modal-overlay") ||
        e.target.id === "marketoCloseBtn"
      ) {
        hideMarketoModal();
        // Clear it on close too, just to be safe
        clearMarketoForm();
      }
    });

  // Mobile Menu Toggle
  const navToggle = document.getElementById("navbarToggle");
  const navMenu = document.getElementById("navbarMenu");

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", function () {
      navMenu.classList.toggle("active");
      navToggle.classList.toggle("open");
    });
  }
});
