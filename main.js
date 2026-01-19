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
  MktoForms2.loadForm(
    `https://go.engage.here.com`,
    munchkinId,
    formId,
    function (form) {
      // Success Handler
      form.onSuccess(function (values, followUpUrl) {
        hideMarketoModal();
        return false;
      });
    }
  );
}

// 4. Helper to Clear Form Fields
function clearMarketoForm() {
  if (typeof MktoForms2 === "undefined") return;

  MktoForms2.whenReady(function (form) {
    // 1. Native Marketo reset (sometimes insufficient for pre-fill)
    form.reset(); 
    
    // 2. Aggressive Clear: Manually empty all inputs
    const formElem = form.getFormElem()[0];
    const inputs = formElem.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
      // Don't clear hidden fields (needed for tracking) or submit buttons
      if (input.type !== 'hidden' && input.type !== 'submit') {
        input.value = '';
        input.checked = false; // For checkboxes
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
    
    // Case A: First time loading
    if (formEl && formEl.children.length === 0) {
      loadMarketoForm(MARKETO_FORM_ID, MUNCHKIN_ID);
    } 
    // Case B: Form already loaded, just clear it
    else {
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
        // Optional: Clear on close too, just to be safe
        clearMarketoForm();
      }
    });

  // Mobile Menu Logic
  const navToggle = document.getElementById("navbarToggle");
  const navMenu = document.getElementById("navbarMenu");

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", function () {
      navMenu.classList.toggle("active");
      navToggle.classList.toggle("open");
    });
  }
});
