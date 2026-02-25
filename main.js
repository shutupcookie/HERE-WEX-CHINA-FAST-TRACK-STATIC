/** @format */

// Main Event Listener for UI functionality
document.addEventListener("DOMContentLoaded", function () {
  
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
