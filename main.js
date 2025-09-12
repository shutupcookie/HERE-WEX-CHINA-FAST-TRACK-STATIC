// Assumes Marketo form script is loaded in index.html
// Usage: Add a button with id="contactCtaBtn" to open the modal

// 1. Modal HTML (add to your index.html body, or generate dynamically)
function createMarketoModal() {
  if (document.getElementById('marketo-modal')) return;
  const modal = document.createElement('div');
  modal.id = 'marketo-modal';
  modal.innerHTML = `
    <div class="modal-overlay"></div>
    <div class="modal-content">
      <button class="modal-close" id="marketoCloseBtn">&times;</button>
      <div id="marketoFormContainer"></div>
    </div>
  `;
  document.body.appendChild(modal);
}

// 2. Show/Hide Modal
function showMarketoModal() {
  document.getElementById('marketo-modal').style.display = 'flex';
}
function hideMarketoModal() {
  document.getElementById('marketo-modal').style.display = 'none';
}

// 3. Load Marketo Form
function loadMarketoForm(formId, munchkinId) {
  MktoForms2.loadForm(`//app-sj01.marketo.com`, munchkinId, formId, function(form){
    form.onSuccess(function(values, followUpUrl){
      // Optional: Show thank you, close modal, etc.
      hideMarketoModal();
      return false; // Prevent redirect
    });
  });
}

// 4. Event Listeners
document.addEventListener('DOMContentLoaded', function() {
  createMarketoModal();

  // Example: Open modal from navbar button
  document.getElementById('contactCtaBtn').addEventListener('click', function(e){
    e.preventDefault();
    showMarketoModal();

    // Only load form if not already present
    if (!document.getElementById('marketoFormContainer').hasChildNodes()) {
      // Replace with your Marketo Form ID and Munchkin ID!
      const MARKETO_FORM_ID = 1234; 
      const MUNCHKIN_ID = 'ABC-XYZ-123'; 
      loadMarketoForm(MARKETO_FORM_ID, MUNCHKIN_ID);
    }
  });

  // Close modal
  document.getElementById('marketo-modal').addEventListener('click', function(e){
    if (e.target.classList.contains('modal-overlay') || e.target.id === 'marketoCloseBtn') {
      hideMarketoModal();
    }
  });
});
