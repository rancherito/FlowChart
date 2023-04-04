const { createApp } = Vue
const app = {
  data() {
    return {
      message: 'Hello Vue!'
    }
  }
};

createApp(app).mount('#app');

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

function crearRectangulo(x, y, width, height, fill) {
  const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  rect.setAttribute("x", x);
  rect.setAttribute("y", y);
  rect.setAttribute("width", width);
  rect.setAttribute("height", height);
  rect.setAttribute("rx", 10);
  rect.setAttribute("ry", 10);
  rect.setAttribute("fill", fill);
  return rect;
}

const rectangulo1 = crearRectangulo(50, 50, 100, 50, "blue");
const rectangulo2 = crearRectangulo(250, 250, 100, 50, "green");
const rectangulo3 = crearRectangulo(500, 250, 100, 50, "gray");


cajaA.appendChild(rectangulo1);
cajaA.appendChild(rectangulo2);
cajaA.appendChild(rectangulo3);
