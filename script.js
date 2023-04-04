const cajaA = document.getElementById('cajaA');
const cajaB = document.getElementById('cajaB');

let arrastrando = false;
let posicionInicialX = 0;
let posicionInicialY = 0;
let desplazamientoX = 0;
let desplazamientoY = 0;

cajaB.addEventListener('mousedown', (evento) => {
  arrastrando = true;
  posicionInicialX = evento.clientX - desplazamientoX;
  posicionInicialY = evento.clientY - desplazamientoY;
});

cajaB.addEventListener('mousemove', (evento) => {
  if (!arrastrando) return;

  desplazamientoX = evento.clientX - posicionInicialX;
  desplazamientoY = evento.clientY - posicionInicialY;

  const maxX = cajaB.clientWidth - cajaA.clientWidth;
  const maxY = cajaB.clientHeight - cajaA.clientHeight;

  desplazamientoX = Math.min(Math.max(desplazamientoX, maxX), 0);
  desplazamientoY = Math.min(Math.max(desplazamientoY, maxY), 0);

  cajaA.style.transform = `translate(${desplazamientoX}px, ${desplazamientoY}px)`;
});

cajaB.addEventListener('mouseup', () => {
  arrastrando = false;
});

cajaB.addEventListener('mouseleave', () => {
  arrastrando = false;
});
