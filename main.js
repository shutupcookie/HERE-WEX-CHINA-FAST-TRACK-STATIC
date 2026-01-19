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

// 3. THE FIX: Aggressive Clear & Unlock Function
function resetMarketoForm(form) {
  if (!form) return;

  const formElem = form.getFormElem()[0];
  
  // A. Reset Values
  form.reset(); 
  
  // B. Manually wipe inputs (Marketo persistence fix)
  const inputs = formElem.querySelectorAll('input, select, textarea');
  inputs.forEach(input => {
    if(input.type !== 'hidden' && input.type !== 'submit') {
      input.value = '';
      if(input.type === 'checkbox' || input.type === 'radio') {
        input.checked = false;
      }
    }
  });

  // C. UNLOCK SUBMIT BUTTON (Fix for "Frozen" button)
  const submitBtn = formElem.querySelector('.mktoButton');
  if(submitBtn) {
    submitBtn.disabled = false; // Enable clicks
    submitBtn.innerHTML = '提交'; // Reset text to "Submit"
    submitBtn.style.width = "100%"; // Ensure styling stays consistent
  }
  
  // D. Tell Marketo the form is ready again
  form.submittable(true); 
}

// 4. Load Marketo Form Logic
function loadMarketoForm(formId, munchkinId) {
  MktoForms2.loadForm(
    `https://go.engage.here.com`,
    munchkinId,
    formId,
    function (form) {
      // Success Handler
      form.onSuccess(function (values, followUpUrl) {
        // 1. Hide the modal
        hideMarketoModal();
        
        // 2. CRITICAL FIX: Reset and Unlock the form for next time!
        resetMarketoForm(form);

        // 3. Prevent page reload
        return false;
      });
    }
  );
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
    
    // If form NOT loaded yet:
    if (formEl && formEl.children.length === 0) {
      loadMarketoForm(MARKETO_FORM_ID, MUNCHKIN_ID);
    } 
    // If form IS loaded: Ensure it is clean
    else if (typeof MktoForms2 !== "undefined") {
      MktoForms2.whenReady(function (form) {
        resetMarketoForm(form);
      });
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

  // Close Modal Logic (Clicking X or Background)
  document
    .getElementById("marketo-modal")
    .addEventListener("click", function (e) {
      if (
        e.target.classList.contains("modal-overlay") ||
        e.target.id === "marketoCloseBtn"
      ) {
        hideMarketoModal();
        // Also reset when closing manually
        if (typeof MktoForms2 !== "undefined") {
          MktoForms2.whenReady(function (form) {
            resetMarketoForm(form);
          });
        }
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
