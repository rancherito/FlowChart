
const { createApp } = Vue

const boxChart = {
    props: {
        parents: {
            type: Array,
            default: []
        },
        modelValue: {
            type: Object,
            default: {
                id: Math.random(),
                x: 0,
                y: 0,
                width: 100,
                height: 50,
                color: 'blue'
            }
        },
        globalPosition: {
            type: Object,
            default: {
                x: 0,
                y: 0
            }
        },
    },

    emits: ['update:modelValue'],
    data() {
        return {
            width: this.modelValue?.width ?? 100,
            height: this.modelValue?.height ?? 50,
            id: this.modelValue?.id ?? Math.random(),
            childXMenorCHildYMenor: 0,
            childXMenorCHildYMayor: 1,
            childXMayorCHildYMenor: 2,
            childXMayorCHildYMayor: 3,
            isMove: false,
        }
    },
    watch: {
        globalPosition: {
            handler(val) {
                if (this.isMove) {
                    this.modelValue.x = val.x;
                    this.modelValue.y = val.y;
                    this.$emit('update:modelValue', JSON.parse(JSON.stringify(this.modelValue)));
                }
            },
            deep: true
        }
    },
    computed: {
        posX() {
            return this.modelValue?.x ?? 0;
        },
        posY() {
            return this.modelValue?.y ?? 0;
        },
        styleTranslate() {
            let x = this.posX - (this.width / 2);
            let y = this.posY - (this.height / 2);
            return `translate(${x}, ${y})`;
        },
        lines() {
            const gap = 16;
            const ele = this.parents.map(parent => {
                const parentHeight = parent.height + (parent.height);
                const parentWidth = parent.width + (parent.width / 2);
                const startX = 0;
                const startY = this.height / 2;
                const endX = parent.x - this.posX + parentWidth;
                const endY = parent.y - this.posY + parentHeight;

                const startPath = `M${startX} ${startY} L ${startX - gap} ${startY}`;
                const endPath = `L ${endX + gap} ${endY} L ${endX} ${endY}`;

                const childXIsMenor = (this.posX + (this.width / 2) < parent.x + (parentWidth / 2)) + 0;
                const childYIsMenor = (this.posY + (this.height / 2) < parent.y + (parentHeight / 2)) + 0;

                const state = parseInt(`${childXIsMenor}${childYIsMenor}`, 2);

                let ret = {
                    translate: `translate(${startX - 5}, ${startY - 5}) rotate(45, 5, 3.5)`
                };

                console.log(state);
                switch (state) {
                    case this.childXMenorCHildYMayor:

                        ret.d = `${startPath} L ${startX - gap} ${this.height + gap} L ${endX + gap} ${this.height + gap} ${endPath}`
                        ret.stroke = 'red'

                        break;
                    case this.childXMenorCHildYMenor:

                        ret.d = `${startPath} L ${startX - gap} ${0 - gap} L ${endX + gap} ${0 - gap} ${endPath}`
                        ret.stroke = 'PURPLE'

                        break;
                    case this.childXMayorCHildYMenor:

                        ret.d = `${startPath} L ${startX - gap} ${0 - gap} L ${endX + gap} ${0 - gap} ${endPath}`
                        ret.stroke = 'blue'

                        break;
                    default:

                        ret.d = `${startPath} L ${startX - gap} ${this.height + gap} L ${endX + gap} ${this.height + gap} ${endPath}`
                        ret.stroke = 'green'

                        break;
                }
                return ret;

            });
            return ele;
        }
    },
    mounted() {
    },
    methods: {
        onDown() {
            console.log('onDown');
            this.isMove = true
        },
        onUp() {
            console.log('onUp');
            this.isMove = false
        }
    },
    template: `
    <g :transform="styleTranslate">
        <rect @mousedown="onDown" @mouseup="onUp" @mouse class="box-chart-box" x="0" y="0" :width="width" :height="height" fill="white" rx="5" ry="5" style="stroke: black; fill: white"/>
        <text class="box-chart-text box-chart-noevent" :x="width / 2" :y="height / 2" text-anchor="middle" alignment-baseline="central">{{'BOX ' + id}} {{isMove}}</text>
        <template v-for="line in lines">
            <path class="box-chart-line" :d="line.d" :stroke="line.stroke"/>
            <path :transform="line.translate" d="M3 0 L8 0 A2 2 0 0 1 10 2 L10 7 A2 3 0 0 1 7.5 7.5 L2.5 2.5 A3 2 0 0 1 3 0" fill="GRAY" />            
        </template>
        <rect :y="(height - 10) / 2" :x="(width - 5)" width="10" height="10" fill="gray" rx="2" ry="2"/>
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
            transform: 'translate(0px, 0px)',
            globalPosition: {
                x: 0,
                y: 0
            }
        }
    },
    mounted() {

        this.cajaA = this.$refs.cajaA;
        this.cajaB = this.$refs.cajaB;
    },
    methods: {
        mouseDownEvent(event) {
            if (event.target.id != 'cajaA') return
            this.arrastrando = true;
            this.posicionInicialX = event.clientX - this.desplazamientoX;
            this.posicionInicialY = event.clientY - this.desplazamientoY;
        },
        mouseMoveEvent(event) {
            this.globalPosition.x = event.offsetX;
            this.globalPosition.y = event.offsetY;
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
        <svg @mouseup="dragOff" :style="{transform: transform}" @mouseleave="dragOff" id="cajaA" width="2000" height="2000" @mousemove="mouseMoveEvent" ref="cajaA">
            <box-chart v-for="rect in boxs" :globalPosition="globalPosition" v-model="rect" :parents="boxs.filter(x => Array.isArray(rect.parents) && rect.parents.includes(x.id))" />
            <path d="M10 10 L70 10 A30 30 0 0 1 100 40 L100 120 A20 20 0 0 0 120 140 L140 140" stroke="black" fill="none" />
            <path transform="translate(10,10) rotate(90, 5, 3.5)" d="M3 0 L8 0 A2 2 0 0 1 10 2 L10 7 A2 3 0 0 1 7.5 7.5 L2.5 2.5 A3 2 0 0 1 3 0" fill="red" />
            

        </svg>
    </div>
    <ul><li v-for="rect in boxs">{{rect.x}}, {{rect.y}}</li></ul>
 </div>
  `
}


var app = createApp({
    data() {
        return {
            message: 'Hello Vue!',
            boxs: [
                { x: 300, y: 300, height: 50, width: 100, id: 1 },
                { x: 800, y: 400, height: 200, width: 200, id: 3, parents: [1] },
            ]
        }
    }
})
app.component('svg-chart', svgChart);
app.component('box-chart', boxChart);
app.mount('#app');