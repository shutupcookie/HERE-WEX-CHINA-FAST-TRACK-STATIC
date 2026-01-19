/** @format */

// 1. Create Modal (Injects HTML)
function createMarketoModal() {
  if (document.getElementById('marketo-modal')) return;
  const modal = document.createElement('div');
  modal.id = 'marketo-modal';
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

// 2. Show/Hide Helpers
function showMarketoModal() {
  const modal = document.getElementById('marketo-modal');
  if(modal) modal.style.display = 'flex';
}
function hideMarketoModal() {
  const modal = document.getElementById('marketo-modal');
  if(modal) modal.style.display = 'none';
}

// 3. Load Marketo Form
function loadMarketoForm(formId, munchkinId) {
  MktoForms2.loadForm(`//go.engage.here.com`, munchkinId, formId, function(form){
    form.onSuccess(function(values, followUpUrl){
      hideMarketoModal();
      return false; 
    });
  });
}

// 4. Main Logic
document.addEventListener('DOMContentLoaded', function() {
  createMarketoModal();
  const MARKETO_FORM_ID = 3339; 
  const MUNCHKIN_ID = '142-UEL-347'; 

  // Open Form Logic
  function openForm(e) {
    e.preventDefault(); 
    showMarketoModal();
    const formEl = document.getElementById('mktoForm_3339');
    if (formEl && formEl.children.length === 0) {
      loadMarketoForm(MARKETO_FORM_ID, MUNCHKIN_ID);
    }
  }

  // Attach to Contact Buttons
  const navBtn = document.getElementById('contactCtaBtn');
  if (navBtn) navBtn.addEventListener('click', openForm);
  
  const otherBtns = document.querySelectorAll('#contact-btn, #footer-contact-btn, .contact-global-btn, .hero-cta, .btn-cta, .btn-text');
  otherBtns.forEach(function(btn) {
    btn.addEventListener('click', openForm);
  });

  // Close Modal Logic
  document.getElementById('marketo-modal').addEventListener('click', function(e){
    if (e.target.classList.contains('modal-overlay') || e.target.id === 'marketoCloseBtn') {
      hideMarketoModal();
    }
  });

  // --- NEW: MOBILE MENU TOGGLE ---
  const navToggle = document.getElementById('navbarToggle');
  const navMenu = document.getElementById('navbarMenu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function() {
      navMenu.classList.toggle('active'); // Shows/Hides menu
      navToggle.classList.toggle('open');   // Animates the burger icon
    });
  }
});
