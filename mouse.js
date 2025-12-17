const cursor = document.getElementById("cursor");

/* Disable cursor on touch devices */
const isTouchDevice =
  "ontouchstart" in window ||
  navigator.maxTouchPoints > 0;

if (cursor && !isTouchDevice) {
  let mouseX = 0;
  let mouseY = 0;
  let cursorX = 0;
  let cursorY = 0;

  document.addEventListener("mousemove", e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animateCursor() {
    cursorX += (mouseX - cursorX) * 0.12;
    cursorY += (mouseY - cursorY) * 0.12;

    cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
    requestAnimationFrame(animateCursor);
  }

  animateCursor();
} else if (cursor) {
  cursor.style.display = "none";
}
