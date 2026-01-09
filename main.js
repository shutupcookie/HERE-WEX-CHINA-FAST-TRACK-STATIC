/** @format */

// Assumes Marketo form script is loaded in index.html/digital-cockpit.html
// Usage: automatically attaches to buttons with specific IDs or classes

// 1. Modal HTML (Generates the popup and the empty form container)
function createMarketoModal() {
  if (document.getElementById("marketo-modal")) return;
  const modal = document.createElement("div");
  modal.id = "marketo-modal";

  // IMPORTANT: We inject the <form> tag here so Marketo has a place to land
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
  // Uses the correct Base URL: //go.engage.here.com
  MktoForms2.loadForm(
    `//go.engage.here.com`,
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

// 4. Main Event Listener (Runs when the page finishes loading)
document.addEventListener("DOMContentLoaded", function () {
  // Step A: Create the modal HTML immediately
  createMarketoModal();

  // Step B: Define the constants from your email
  const MARKETO_FORM_ID = 3339;
  const MUNCHKIN_ID = "142-UEL-347";

  // Step C: Define the function that opens the form
  function openForm(e) {
    e.preventDefault(); // Stop the button from jumping to #
    showMarketoModal();

    // Only ask Marketo to build the form if it hasn't been built yet
    // (We check if the form tag is empty or already has Marketo stuff in it)
    const formEl = document.getElementById("mktoForm_3339");
    if (formEl && formEl.children.length === 0) {
      loadMarketoForm(MARKETO_FORM_ID, MUNCHKIN_ID);
    }
  }

  // Step D: Attach this function to ALL "Contact Us" buttons

  // 1. The Navbar Button
  const navBtn = document.getElementById("contactCtaBtn");
  if (navBtn) navBtn.addEventListener("click", openForm);

  // 2. The Hero and Footer buttons (finding them by ID or Class)
  // This selects any button with these IDs or classes
  const otherBtns = document.querySelectorAll(
    "#contact-btn, #footer-contact-btn, .contact-global-btn, .hero-cta, .btn-cta"
  );
  otherBtns.forEach(function (btn) {
    btn.addEventListener("click", openForm);
  });

  // Step E: Close Modal Logic (Clicking X or the dark background)
  document
    .getElementById("marketo-modal")
    .addEventListener("click", function (e) {
      if (
        e.target.classList.contains("modal-overlay") ||
        e.target.id === "marketoCloseBtn"
      ) {
        hideMarketoModal();
      }
    });
});
