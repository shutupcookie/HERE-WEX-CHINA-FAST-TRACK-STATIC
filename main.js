// Modal open/close logic for Marketo form
document.addEventListener("DOMContentLoaded", function() {
  var modal = document.getElementById("contact-modal");
  var openBtn = document.getElementById("contact-btn");
  var closeBtn = document.getElementById("close-modal");

  function openModal(e) {
    e.preventDefault();
    modal.style.display = "flex";
  }
  function closeModal() {
    modal.style.display = "none";
  }

  if (openBtn) openBtn.addEventListener("click", openModal);
  if (closeBtn) closeBtn.addEventListener("click", closeModal);

  // Optional: close modal when clicking outside modal content
  modal.addEventListener("click", function(e) {
    if (e.target === modal) closeModal();
  });
});
