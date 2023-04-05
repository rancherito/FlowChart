
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
            currentX: 0,
            currentY: 0,
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
        }
    },
    mounted() {
    },
    methods: {
        onDown(e) {
            let x = e.offsetX - this.posX - (this.width / 2);
            let y = e.offsetY - this.posY - (this.height / 2);
            this.isMove = true
        },
        onUp() {
            this.isMove = false
        }
    },
    template: `
    <g :transform="styleTranslate">
        <rect @mousedown="onDown" @mouseup="onUp" @mouse class="box-chart-box" x="0" y="0" :width="width" :height="height" fill="white" rx="5" ry="5" style="stroke: black; fill: white"/>
        <text class="box-chart-text box-chart-noevent" :x="width / 2" :y="height / 2" text-anchor="middle" alignment-baseline="central">{{'BOX ' + id}} {{isMove}}</text>
        <rect :y="(height - 10) / 2" :x="(width - 5)" width="10" height="10" fill="gray" rx="2" ry="2"/>
    </g>
  `
}

const lineChart = {
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
                height: 50
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
                const parentHeight = parent.height;
                const parentWidth = parent.width;
                const endX = this.posX - (this.width / 2);
                const endY = this.posY;
                const startX = parent.x + (parentWidth / 2);
                const startY = parent.y;

                const startPath = `M${startX} ${startY} L ${startX + gap} ${startY}`;
                const endPath = `L ${endX - gap} ${endY} L ${endX} ${endY}`;

                const childXIsMenor = (this.posX  < parent.x) + 0;
                const childYIsMenor = (this.posY < parent.y) + 0;

                const state = parseInt(`${childXIsMenor}${childYIsMenor}`, 2);

                let ret = {
                    translate: `translate(${endX - 12}, ${endY - 5}) rotate(45, 5, 3.5)`
                };
                console.log(state)
                switch (state) {
                    case this.childXMenorCHildYMenor:

                        if (startX > endX - (gap * 2)) {
                            ret.d = `L ${startX + gap} ${startY + (parentHeight / 2) + gap} L ${endX - gap} ${startY + (parentHeight / 2) + gap}`
                            ret.stroke = 'yellow'
                        }
                        else {
                            ret.d = `L ${startX + gap} ${endY}`
                            ret.stroke = 'purple'
                        }

                        break;
                    case this.childXMenorCHildYMayor:

                        if (startX > endX - (gap * 2)) {
                            ret.d = `L ${startX + gap} ${startY - (parentHeight / 2) - gap} L ${endX - gap} ${startY - (parentHeight / 2) - gap}`
                            ret.stroke = 'orange'
                        } else {
                            ret.d = `L ${startX + gap} ${endY}`
                            ret.stroke = 'red'
                        }

                        break;
                    case this.childXMayorCHildYMenor:

                        ret.d = `L ${startX + gap} ${startY + (parentHeight / 2) + gap} L ${endX - gap} ${startY + (parentHeight / 2) + gap}` //paste
                        ret.stroke = 'blue'

                        break;
                    default:

                        ret.d = `L ${startX + gap} ${startY - (parentHeight / 2) - gap} L ${endX - gap} ${startY - (parentHeight / 2) - gap}`
                        ret.stroke = 'green'

                        break;
                }
                //ret.stroke = 'gray'
                ret.d = `${startPath} ${ret.d} ${endPath}`
                return ret;

            });
            return ele;
        }
    },
    template: `
    <g>
        <template v-for="line in lines">
            <path class="box-chart-line" :d="line.d" :stroke="line.stroke"/>
            <path :transform="line.translate" d="M3 0 L8 0 A2 2 0 0 1 10 2 L10 7 A2 3 0 0 1 7.5 7.5 L2.5 2.5 A3 2 0 0 1 3 0" fill="GRAY" />            
        </template>
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
            <line-chart v-for="rect in boxs" :globalPosition="globalPosition" v-model="rect" :parents="boxs.filter(x => Array.isArray(rect.parents) && rect.parents.includes(x.id))" />
            <box-chart v-for="rect in boxs" :globalPosition="globalPosition" v-model="rect" :parents="boxs.filter(x => Array.isArray(rect.parents) && rect.parents.includes(x.id))" />
            <path d="M10 10 L70 10 A30 30 0 0 1 100 40 L100 120 A20 20 0 0 0 120 140 L140 140" stroke="black" fill="none" />
            <path transform="translate(10,10) rotate(90, 5, 3.5)" d="M3 0 L8 0 A2 2 0 0 1 10 2 L10 7 A2 3 0 0 1 7.5 7.5 L2.5 2.5 A3 2 0 0 1 3 0" fill="red" />
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
                { x: 300, y: 300, height: 70, width: 70, id: 1 },
                /* { x: 300, y: 500, height: 100, width: 50, id: 2 },*/

                { x: 400, y: 100, height: 150, width: 200, id: 3, parents: [1, 2] },
            ]
        }
    }
})
app.component('svg-chart', svgChart);
app.component('box-chart', boxChart);
app.component('line-chart', lineChart);

app.mount('#app');