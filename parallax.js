const planet = document.querySelector(".planet");

document.addEventListener("mousemove", e => {
  if (!planet) return;

  const x = (e.clientX / window.innerWidth - 0.5) * 12;
  const y = (e.clientY / window.innerHeight - 0.5) * 12;

  planet.style.transform = `translate(${x}px, ${y}px)`;
});
