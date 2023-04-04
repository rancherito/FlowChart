
const { createApp } = Vue
/*
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
cajaA.appendChild(rectangulo3);*/

const boxChart = {
  props: {
    posX: {
      type: Number,
      required: true,
      default: 0
    },
    posY: {
      type: Number,
      required: true,
      default: 0
    },
    width: {
      type: Number,
      default: 100
    },
    height: {
      type: Number,
      default: 50
    },
    color: {
      type: String,
      required: true,
      default: 'blue'
    }
  },
  computed: {
    styleTranslate() {
      let x = this.posX - (this.width / 2);
      let y = this.posY - (this.height / 2);
      return `translate(${x}, ${y})`;
    }
  },
  template: `
    <g :transform="styleTranslate">
      <rect class="box-chart-box" x="0" y="0" :width="width" :height="height" fill="white" rx="5" ry="5" style="stroke: black; fill: white"/>
      <rect :y="(height - 10) / 2" :x="(0 - 5)" width="10" height="10" fill="gray" rx="2" ry="2"/>
      <rect :y="(height - 10) / 2" :x="(width - 5)" width="10" height="10" fill="gray" rx="2" ry="2"/>
      <text class="box-chart-text" :x="width / 2" :y="height / 2" text-anchor="middle" alignment-baseline="central">LOREM</text>
    </g>
  `
}

const svgChart = {
  props: {
    boxs: []
  },
  data() {
    return {
      message: 'Hello Vue! child',
      cajaA: null,
      cajaB: null,
      arrastrando: false,
      posicionInicialX: 0,
      posicionInicialY: 0,
      desplazamientoX: 0,
      desplazamientoY: 0,
      transform: 'translate(0px, 0px)'
    }
  },
  mounted() {

    this.cajaA = this.$refs.cajaA;
    this.cajaB = this.$refs.cajaB;
  },
  methods: {
    mouseDownEvent(event) {
      this.arrastrando = true;
      this.posicionInicialX = event.clientX - this.desplazamientoX;
      this.posicionInicialY = event.clientY - this.desplazamientoY;
    },
    mouseMoveEvent(event) {
      if (!this.arrastrando) return;

      this.desplazamientoX = event.clientX - this.posicionInicialX;
      this.desplazamientoY = event.clientY - this.posicionInicialY;

      const maxX = this.cajaB.clientWidth - this.cajaA.clientWidth;
      const maxY = this.cajaB.clientHeight - this.cajaA.clientHeight;

      this.desplazamientoX = Math.min(Math.max(this.desplazamientoX, maxX), 0);
      this.desplazamientoY = Math.min(Math.max(this.desplazamientoY, maxY), 0);

      this.transform = `translate(${this.desplazamientoX}px, ${this.desplazamientoY}px)`;
    },
    dragOff() {
      this.arrastrando = false;
    }
  },
  template: `
 <div>
    {{ desplazamientoX }}, {{ desplazamientoY }}
    <div id="cajaB" @mousedown="mouseDownEvent" ref="cajaB">
      <svg @mouseup="dragOff" :style="{transform: transform}" @mouseleave="dragOff" id="cajaA" width="1000" height="1000" @mousemove="mouseMoveEvent" ref="cajaA">
        <box-chart v-for="rect in boxs" :posX="rect.x" :posY="rect.y" />
        <path d="M10 10 H90 A10 10 0 0 1 100 20 V90" stroke="black" fill="none" />
        <path d="M120 50 H200 V200" stroke="black" fill="none" />  
      </svg>
    </div>
 </div>
  `
}


var app = createApp({
  data() {
    return {
      message: 'Hello Vue!',
      boxs: [
        { x: 80, y: 700},
        { x: 250, y: 250},
        { x: 400, y: 250},
        { x: 100, y: 150},

      ]
    }
  }
})
app.component('svg-chart', svgChart);
app.component('box-chart', boxChart);
app.mount('#app');