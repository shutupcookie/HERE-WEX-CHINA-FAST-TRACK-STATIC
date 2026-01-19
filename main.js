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

// 3. THE RESET FUNCTION (Clears Data AND Unlocks Button)
function resetMarketoForm(form) {
  if (!form) return;

  const formElem = form.getFormElem()[0];
  
  // A. Clear all text inputs
  const inputs = formElem.querySelectorAll('input, select, textarea');
  inputs.forEach(input => {
    if(input.type !== 'hidden' && input.type !== 'submit') {
      input.value = '';
      if(input.type === 'checkbox' || input.type === 'radio') {
        input.checked = false;
      }
    }
  });

  // B. FIX: Unlock the Submit Button (This fixes the "Frozen" issue)
  const submitBtn = formElem.querySelector('.mktoButton');
  if(submitBtn) {
    submitBtn.disabled = false;  // Enable clicking again
    submitBtn.innerHTML = '提交'; // Reset text to "Submit"
  }
  
  // C. Tell Marketo the form is ready to submit again
  form.submittable(true); 
}

// 4. Load Marketo Form Logic
function loadMarketoForm(formId, munchkinId) {
  MktoForms2.loadForm(
    `https://go.engage.here.com`,
    munchkinId,
    formId,
    function (form) {
      // FIX: What happens when the user submits successfully?
      form.onSuccess(function (values, followUpUrl) {
        // 1. Hide the modal immediately
        hideMarketoModal();
        
        // 2. Wipe the data AND Unlock the button for next time
        resetMarketoForm(form);

        // 3. Return false to stop the page from reloading
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
    
    // If form hasn't loaded yet, load it.
    if (formEl && formEl.children.length === 0) {
      loadMarketoForm(MARKETO_FORM_ID, MUNCHKIN_ID);
    } 
    // If it is already loaded, just make sure it's clean and unlocked.
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

  // Close Modal Logic
  document
    .getElementById("marketo-modal")
    .addEventListener("click", function (e) {
      if (
        e.target.classList.contains("modal-overlay") ||
        e.target.id === "marketoCloseBtn"
      ) {
        hideMarketoModal();
        // Also reset if they close it without submitting
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
