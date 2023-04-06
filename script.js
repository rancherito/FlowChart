
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
                    this.modelValue.x = val.x - this.currentX + (this.width / 2);
                    this.modelValue.y = val.y - this.currentY + (this.height / 2);
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
            let x = e.offsetX - this.posX + (this.width / 2);
            let y = e.offsetY - this.posY + (this.height / 2);
            this.currentX = x;
            this.currentY = y;
            this.isMove = true
        },
        onUp() {
            this.isMove = false
        }
    },
    template: `
    <g :transform="styleTranslate">
        <rect @mousedown="onDown" @mouseup="onUp" @mouse class="flowchart-box" x="0" y="0" :width="width" :height="height" fill="white" rx="5" ry="5" style="stroke: black; fill: white"/>
        <text class="flowchart-text flowchart-noevent" :x="width / 2" :y="height / 2" text-anchor="middle" alignment-baseline="central">{{'BOX ' + id}}</text>
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
            colors: {
                purple: '#673AB7',
                indigo: '#3F51B5',
                blue: '#2196F3',
                teal: '#009688',
                green: '#4CAF50',
                lime: '#CDDC39',
                amber: '#FFC107',
                deepOrange: '#FF5722'
            }
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
                let points = [];
                const parentHeight = parent.height;
                const parentWidth = parent.width;
                const endX = this.posX - (this.width / 2);
                const endY = this.posY;
                const startX = parent.x + (parentWidth / 2);
                const startY = parent.y;

                points.push([startX, startY]);
                points.push([startX + gap, startY]);

                const startPath = `M ${startX} ${startY} L ${startX + gap} ${startY}`;
                const endPath = `L ${endX - gap} ${endY} L ${endX} ${endY}`;

                const childXIsMenor = (this.posX < parent.x) + 0;
                const childYIsMenor = (this.posY < parent.y) + 0;

                const state = parseInt(`${childXIsMenor}${childYIsMenor}`, 2);

                let ret = {
                    translate: `translate(${endX - 12}, ${endY - 5}) rotate(45, 5, 3.5)`
                };

                switch (state) {
                    case this.childXMenorCHildYMenor:

                        if (startX > endX - (gap * 2)) {
                            points.push([startX + gap, startY + (parentHeight / 2) + gap]);
                            points.push([endX - gap, startY + (parentHeight / 2) + gap]);
                            ret.stroke = this.colors.purple
                        }
                        else {
                            points.push([startX + gap, endY]);
                            ret.stroke = this.colors.indigo
                        }

                        break;
                    case this.childXMenorCHildYMayor:

                        if (startX > endX - (gap * 2)) {
                            points.push([startX + gap, startY - (parentHeight / 2) - gap]);
                            points.push([endX - gap, startY - (parentHeight / 2) - gap]);
                            ret.stroke = this.colors.blue
                        } else {
                            points.push([startX + gap, endY]);
                            ret.stroke = this.colors.teal
                        }

                        break;
                    case this.childXMayorCHildYMenor:
                        if (startY + ((parentHeight + this.height) / 2) + 2 * gap > endY) {
                            points.push([startX + gap, endY + (this.height / 2) + gap]);
                            points.push([endX - gap, endY + (this.height / 2) + gap]);
                            ret.stroke = this.colors.green
                        } else {
                            points.push([startX + gap, startY + (parentHeight / 2) + gap]);
                            points.push([endX - gap, startY + (parentHeight / 2) + gap]);
                            ret.stroke = this.colors.lime
                        }
                        break;
                    default:

                        if (startY - ((parentHeight + this.height) / 2) - 2 * gap > endY) {
                            points.push([startX + gap, startY - (parentHeight / 2) - gap]);
                            points.push([endX - gap, startY - (parentHeight / 2) - gap]);

                            ret.stroke = this.colors.amber
                        }
                        else {
                            points.push([startX + gap, endY - (this.height / 2) - gap]);
                            points.push([endX - gap, endY - (this.height / 2) - gap]);
                            ret.stroke = this.colors.deepOrange
                        }

                        break;
                }
                //ret.stroke = 'gray'

                points.push([endX - gap, endY]);
                points.push([endX, endY]);

                ret.d = points.map((point, index) => {
                    return `${index === 0 ? 'M' : 'L'} ${point[0]} ${point[1]}`
                }).join(' ');
                return ret;

            });
            return ele;
        }
    },
    template: `
    <g>
        <template v-for="line in lines">
            <path class="flowchart-line" :d="line.d" :stroke="line.stroke"/>
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
            },
            viewHeight: 500,
            viewWidth: 600,
        }
    },
    mounted() {

        this.cajaA = this.$refs.cajaA;
        this.cajaB = this.$refs.cajaB;

        const resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                const { width, height } = entry.contentRect;
                this.viewHeight = height;
                this.viewWidth = width;
            }
        });

        resizeObserver.observe(this.$el);
    },
    computed: {
        maxPosition() {

            const maxX = this.boxs.reduce((acc, box) => {
                return acc > box.x + box.width ? acc : box.x + box.width;
            }, 0);
            const maxY = this.boxs.reduce((acc, box) => {
                return acc > box.y + box.height ? acc : box.y + box.height;
            }, 0);

            return { x: maxX, y: maxY }
        }
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
 <div class="flowchart">
    <div id="cajaB" @mousedown="mouseDownEvent" ref="cajaB" :style="{height: viewHeight + 'px', width: viewWidth + 'px'}">
        <svg @mouseup="dragOff" :style="{transform: transform}" @mouseleave="dragOff" id="cajaA" :width="maxPosition.x" :height="maxPosition.y" @mousemove="mouseMoveEvent" ref="cajaA">
            <line-chart v-for="rect in boxs" :globalPosition="globalPosition" v-model="rect" :parents="boxs.filter(x => Array.isArray(rect.parents) && rect.parents.includes(x.id))" />
            <flowchart v-for="rect in boxs" :globalPosition="globalPosition" v-model="rect" :parents="boxs.filter(x => Array.isArray(rect.parents) && rect.parents.includes(x.id))" />
           
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
                { x: 300, y: 300, height: 70, width: 170, id: 1 },
                { x: 600, y: 400, height: 150, width: 200, id: 3, parents: [1] },
            ]
        }
    },
    mounted() {
        //read boxs from localstorage and set it to boxs if exists
        const boxs = localStorage.getItem('boxs');
        if (boxs) {
            this.boxs = JSON.parse(boxs);
        }
    },
    //watch boxs and save it to localstorage
    watch: {
        boxs: {
            handler: function (val) {
                localStorage.setItem('boxs', JSON.stringify(val));
            },
            deep: true
        }
    }

})
app.component('svg-chart', svgChart);
app.component('flowchart', boxChart);
app.component('line-chart', lineChart);

app.mount('#app');