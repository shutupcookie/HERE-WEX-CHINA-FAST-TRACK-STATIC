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

  // Video card sections: click-to-play thumbnail, external CTA acts as a
  // real play/pause toggle, and everything stays in sync no matter which
  // control (thumbnail, CTA button, or the native video controls) the
  // user actually clicks. Graceful fallback if the mp4 hasn't been
  // uploaded yet (placeholder state).
  document.querySelectorAll(".video-card-media").forEach(function (media) {
    var video = media.querySelector("video");
    if (!video) return;

    var mediaId = media.id;
    var ctaButtons = mediaId
      ? document.querySelectorAll('[data-video-play="' + mediaId + '"]')
      : [];

    video.addEventListener("error", function () {
      media.classList.add("video-fallback");
    });

    function startPlayback() {
      if (media.classList.contains("video-fallback")) return;
      video.muted = false;
      video.setAttribute("controls", "");
      video.play();
    }

    function togglePlayback() {
      if (media.classList.contains("video-fallback")) return;
      if (video.paused || video.ended) {
        startPlayback();
      } else {
        video.pause();
      }
    }

    // The video's own play/pause events are the single source of truth —
    // this keeps the thumbnail overlay AND the external CTA button in
    // sync regardless of what triggered the state change (clicking the
    // thumbnail, clicking the CTA, or using the native video controls).
    video.addEventListener("play", function () {
      media.classList.add("is-playing");
      ctaButtons.forEach(function (btn) {
        btn.classList.add("is-playing");
        var label = btn.querySelector(".btn-label");
        if (label) label.textContent = "暂停播放";
        btn.setAttribute("aria-label", "暂停播放");
      });
    });
    video.addEventListener("pause", function () {
      media.classList.remove("is-playing");
      ctaButtons.forEach(function (btn) {
        btn.classList.remove("is-playing");
        var label = btn.querySelector(".btn-label");
        if (label) label.textContent = "立即观看";
        btn.setAttribute("aria-label", "立即观看");
      });
    });

    // The center play icon is given its own direct click handler (rather
    // than relying on the click passing through to the wrapper div) so
    // it reliably toggles even while the video already has native
    // `controls` attached — after the first play, clicks in that
    // region can otherwise get absorbed by the browser's own control
    // layer instead of reaching a delegated listener.
    var playIcon = media.querySelector(".video-card-play");
    if (playIcon) {
      playIcon.addEventListener("click", function (e) {
        e.stopPropagation();
        togglePlayback();
      });
    }

    // Fallback: clicking anywhere else in the box also toggles (not
    // just "always play") so behavior is consistent everywhere.
    media.addEventListener("click", togglePlayback);
    media.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        togglePlayback();
      }
    });

    // "Watch now"-style buttons elsewhere on the page can target this
    // media block via data-video-play="<mediaElementId>" — these toggle
    // play/pause rather than only ever starting playback.
    ctaButtons.forEach(function (btn) {
      btn.addEventListener("click", togglePlayback);
    });
  });
});
