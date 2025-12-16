const track = document.querySelector(".scroll-track");
const panels = document.querySelectorAll(".panel");
const nextBtn = document.getElementById("next");
const prevBtn = document.getElementById("prev");

let index = 0;
let isAnimating = false;
const ANIM_TIME = 700;

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

/* BUTTON CLICKS */
nextBtn.addEventListener("click", goNext);
prevBtn.addEventListener("click", goPrev);

/* MOUSE WHEEL = ONE PAGE */
window.addEventListener("wheel", e => {
  if (isAnimating) return;
  isAnimating = true;

  if (e.deltaY > 0) goNext();
  else goPrev();

  setTimeout(() => (isAnimating = false), ANIM_TIME);
});

/* KEYBOARD ARROWS = SAME BEHAVIOR */
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

/* RESIZE FIX */
window.addEventListener("resize", updateScroll);
