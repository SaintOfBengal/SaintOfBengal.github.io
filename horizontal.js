const track = document.querySelector(".scroll-track");
const panels = document.querySelectorAll(".panel");
const nextBtn = document.getElementById("next");
const prevBtn = document.getElementById("prev");

let index = 0;
let isAnimating = false;
const ANIM_TIME = 700;

/* CORE */
function updateScroll() {
  track.style.transform = `translateX(-${index * window.innerWidth}px)`;
}

function goNext() {
  if (index < panels.length - 1) {
    index++;
    updateScroll();
  }
}

function goPrev() {
  if (index > 0) {
    index--;
    updateScroll();
  }
}

/* BUTTONS */
if (nextBtn) nextBtn.addEventListener("click", goNext);
if (prevBtn) prevBtn.addEventListener("click", goPrev);

/* MOUSE WHEEL (DESKTOP) */
window.addEventListener("wheel", e => {
  if (isAnimating) return;
  isAnimating = true;

  if (e.deltaY > 0) goNext();
  else goPrev();

  setTimeout(() => (isAnimating = false), ANIM_TIME);
});

/* KEYBOARD */
window.addEventListener("keydown", e => {
  if (isAnimating) return;

  if (e.key === "ArrowRight") {
    isAnimating = true;
    goNext();
  }

  if (e.key === "ArrowLeft") {
    isAnimating = true;
    goPrev();
  }

  if (isAnimating) {
    setTimeout(() => (isAnimating = false), ANIM_TIME);
  }
});

/* 📱 TOUCH SWIPE (MOBILE FIX) */
let touchStartX = 0;
let touchEndX = 0;

window.addEventListener("touchstart", e => {
  touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

window.addEventListener("touchend", e => {
  if (isAnimating) return;

  touchEndX = e.changedTouches[0].screenX;
  const diff = touchStartX - touchEndX;

  if (Math.abs(diff) < 50) return;

  isAnimating = true;

  if (diff > 0) goNext();   // swipe left
  else goPrev();            // swipe right

  setTimeout(() => (isAnimating = false), ANIM_TIME);
});

/* RESIZE */
window.addEventListener("resize", updateScroll);
