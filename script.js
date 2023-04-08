
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
                text: 'Lorem'
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
            text: this.modelValue?.text ?? 'Lorem',
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
        console.log(this.modelValue?.text);
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
        <text class="flowchart-text flowchart-noevent" :x="width / 2" :y="height / 2" text-anchor="middle" alignment-baseline="central">{{text}}-{{modelValue?.parents}}</text>
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
            left: 0,
            top: 1,
            rigth: 2,
            bottom: 3,
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
            },
            toTop: 'Top',
            toBottom: 'Bottom',
            toLeft: 'Left',
            toRigth: 'Rigth',
        }
    },
    mounted() {

    },
    methods: {
        angle(x1, y1, x2, y2) {
            const dx = x2 - x1;
            const dy = y2 - y1;
            const anguloRad = Math.atan2(dy, dx);
            let angle = anguloRad * (180 / Math.PI);

            angle = angle < 0 ? angle + 360 : angle;
            return Math.round(angle);
        },
        AnglePosition(Ax, Ay, Bx, By) {
            let angle = this.angle(Ax, Ay, Bx, By)
            if (angle >= 315 || angle < 45) return 2;
            if (angle >= 45 && angle < 135) return 3;
            if (angle >= 135 && angle < 225) return 0;
            return 1;
        },
        AngleDirection(Ax, Ay, Bx, By) {
            let angle = this.angle(Ax, Ay, Bx, By)
            if (angle == 360 || angle == 0) return 'Rigth';
            if (angle == 90) return 'Bottom';
            if (angle == 180) return 'Left';
            return 'Top';
        },
        horary(Ax, Ay, Bx, By) {
            let angle = this.angle(Ax, Ay, Bx, By)
            let isRotate = true;

            let cuandrant = 3;
            if (angle >= 0 && angle < 90) cuandrant = 0;
            if (angle >= 90 && angle < 180) cuandrant = 1;
            if (angle >= 180 && angle < 270) cuandrant = 2;

            if (angle == 360 || angle == 0 || angle == 90 || angle == 180 || angle == 270) isRotate = false;

            if (angle >= 0 && angle < 180) return { isRotate, isHorary: true, angle, cuandrant };
            return { isRotate, isHorary: false, angle, cuandrant };
        },
        distance2Points(x1, y1, x2, y2) {
            return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
        },
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
                let finalPoints = [];
                let isStartA = true;
                let isEndA = true;
                const parentHeight = parent.height;
                const parentWidth = parent.width;
                const childHeight = this.height;
                const childWidth = this.width;

                const endX = this.posX;
                const endY = this.posY;
                const startX = parent.x;
                const startY = parent.y;

                const lineStartA = [[startX + (parentWidth / 2), startY], [startX + (parentWidth / 2) + gap, startY]];
                const lineEndA = [[endX - (childWidth / 2) - gap, endY], [endX - (childWidth / 2), endY]];

                const lineStartB = [[startX, startY + (parentHeight / 2)], [startX, startY + (parentHeight / 2) + gap]];
                const lineEndB = [[endX, endY - (childHeight / 2) - gap], [endX, endY - (childHeight / 2)]];

                const angle = this.AnglePosition(parent.x, parent.y, this.posX, this.posY);
                let lineDirection = {
                    translate: `translate(${endX - (childWidth / 2) - 12}, ${endY - 5}) rotate(45, 5, 3.5)`
                };
                if (angle == this.bottom || angle == this.left) {
                    lineDirection.translate = `translate(${endX - 5}, ${endY - (childHeight / 2) - 10}) rotate(135, 5, 3.5)`
                }

                switch (angle) {
                    case this.left:
                        lineDirection.stroke = this.colors.indigo
                        isEndA = false;

                        if (endY - (childHeight / 2) < startY - (parentHeight / 2)) {
                            points.push([startX + (parentWidth / 2) + gap, endY - (childHeight / 2) - gap]);
                        }
                        else {
                            isStartA = false;
                            points.push([startX - (parentWidth / 2) - gap, startY + (parentHeight / 2) + gap]);

                            if (endY - (childHeight / 2) - gap * 2 < startY + (parentHeight / 2)) {
                                points.push([startX - (parentWidth / 2) - gap, endY - (childHeight / 2) - gap]);
                            }
                            else {
                                points.push([endX, startY + (parentHeight / 2) + gap]);
                            }
                        }

                        break;
                    case this.top:
                        lineDirection.stroke = this.colors.teal
                        if (endX - (childWidth / 2) - 2 * gap > startX + (parentWidth / 2)) {
                            points.push([startX + (parentWidth / 2) + gap, endY]);
                        }
                        else {
                            points.push([startX + (parentWidth / 2) + gap, startY - (parentHeight / 2) - gap]);
                            points.push([endX - (childWidth / 2) - gap, startY - (parentHeight / 2) - gap]);
                        }
                        break;
                    case this.rigth:
                        lineDirection.stroke = this.colors.lime
                        points.push([startX + (parentWidth / 2) + gap, endY]);
                        break;
                    case this.bottom:
                        points.push([endX, startY + (parentHeight / 2) + gap]);
                        lineDirection.stroke = this.colors.deepOrange
                        isEndA = false;
                        isStartA = false;
                        break;
                }

                if (isStartA) finalPoints = [...lineStartA, ...points];
                else finalPoints = [...lineStartB, ...points];

                if (isEndA) finalPoints = [...finalPoints, ...lineEndA];
                else finalPoints = [...finalPoints, ...lineEndB];

                //console.log(finalPoints)
                lineDirection.start = finalPoints[0];
                const gapCorner = 16;
                let pointsWidthoutCorner = [finalPoints[0]]
                if (finalPoints.length > 2) {
                    for (let index = 1; index < finalPoints.length - 1; index++) {
                        const pA = finalPoints[index - 1]
                        const pB = finalPoints[index]
                        const pC = finalPoints[index + 1]

                        const distance1 = this.distance2Points(pA[0], pA[1], pB[0], pB[1])
                        const distance2 = this.distance2Points(pB[0], pB[1], pC[0], pC[1])


                        const minDistance = Math.min(distance1 / 2, distance2 / 2)
                        const customGap = minDistance < gapCorner ? minDistance : gapCorner


                        const angle1 = this.AngleDirection(pA[0], pA[1], pB[0], pB[1]);
                        const angle2 = this.AngleDirection(pB[0], pB[1], pC[0], pC[1]);

                        const horary = this.horary(pA[0], pA[1], pC[0], pC[1])

                        if (horary.isRotate) {
                            if (angle1 == this.toTop) pointsWidthoutCorner.push([pB[0], pB[1] + customGap])
                            if (angle1 == this.toBottom) pointsWidthoutCorner.push([pB[0], pB[1] - customGap])
                            if (angle1 == this.toLeft) pointsWidthoutCorner.push([pB[0] + customGap, pB[1]])
                            if (angle1 == this.toRigth) pointsWidthoutCorner.push([pB[0] - customGap, pB[1]])

                            let cornet = { r: customGap, isHorary: true }

                            if (angle2 == this.toTop) {
                                cornet.x = pB[0]
                                cornet.y = pB[1] - customGap
                            }
                            if (angle2 == this.toBottom) {
                                cornet.x = pB[0]
                                cornet.y = pB[1] + customGap
                            }
                            if (angle2 == this.toLeft) {
                                cornet.x = pB[0] - customGap
                                cornet.y = pB[1]
                            }
                            if (angle2 == this.toRigth) {
                                cornet.x = pB[0] + customGap
                                cornet.y = pB[1]
                            }

                            if (
                                angle1 == this.toRigth && angle2 == this.toTop ||
                                angle1 == this.toTop && angle2 == this.toLeft ||
                                angle1 == this.toLeft && angle2 == this.toBottom ||
                                angle1 == this.toBottom && angle2 == this.toRigth
                            ) {
                                cornet.isHorary = false
                            }

                            pointsWidthoutCorner.push(cornet)



                        } else {
                            pointsWidthoutCorner.push(pB)
                        }


                    }
                }
                pointsWidthoutCorner.push(finalPoints[finalPoints.length - 1])

                lineDirection.d2 = pointsWidthoutCorner.map((point, index) => {
                    if (Array.isArray(point)) return `${index === 0 ? 'M' : 'L'} ${point[0]} ${point[1]}`
                    return `A ${point.r} ${point.r} 0 0 ${point.isHorary ? 1 : 0} ${point.x} ${point.y}`
                }).join(' ');


                lineDirection.d = finalPoints.map((point, index) => {
                    return `${index === 0 ? 'M' : 'L'} ${point[0]} ${point[1]}`
                }).join(' ');
                return lineDirection;

            });
            return ele;
        }
    },
    template: `
    <g>
        <template v-for="line in lines">
            <path class="flowchart-line" :d="line.d2" stroke="purple"/>
            <path :transform="line.translate" d="M3 0 L8 0 A2 2 0 0 1 10 2 L10 7 A2 3 0 0 1 7.5 7.5 L2.5 2.5 A3 2 0 0 1 3 0" fill="GRAY" />
            <rect :y="line.start[1]-6" :x="line.start[0]-6" width="12" height="12" fill="gray" rx="2" ry="2"/>
        </template>
    </g>
  `
}

const svgChart = {
    props: {
        modelValue: {
            type: Array,
            default: () => []
        }
    },
    emits: ['update:modelValue'],
    data() {
        return {
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
    beforeMount() {
        this.modelValue.sort((a, b) => {
            return (a.width * a.height) < (b.width * b.height) ? 1 : -1;
        })
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
        //execute after 2 seconds
        setTimeout(() => {
            this.smartOrganizer();
        }, 200);
    },
    methods: {
        smartOrganizer() {
            // Clonar modelValue y agregar sublevel
            const boxes = this.modelValue.map(box => ({ ...box, sublevel: 0 }));

            // Calcular subniveles
            boxes.forEach(parentBox => {
                boxes
                    .filter(childBox => childBox?.parents?.includes(parentBox.id))
                    .forEach(childBox => {
                        childBox.sublevel = parentBox.sublevel + 1;
                    });
            });

            // Obtener subnivel máximo
            const maxSublevel = Math.max(...boxes.map(box => box.sublevel));

            // Actualizar coordenadas x e y
            for (let i = 0; i <= maxSublevel; i++) {
                let x = 100;
                boxes
                    .filter(box => box.sublevel === i)
                    .forEach(box => {
                        box.y = i * 200 + 100;
                        if (i === 0) {
                            box.x = x;
                            x += box.width + 40;
                        } else {
                            const parent = boxes.find(parentBox => parentBox.id === box.parents[0]);
                            box.x = parent.x + parent.width / 2 - box.width / 2;
                        }
                    });
            }

            // Emitir evento de actualización
            this.$emit("update:modelValue", boxes);
        },
        maxY() {
            const maxHeight = this.modelValue.reduce((acc, box) => {
                return acc > box.y + box.height ? acc : box.y + box.height;
            }, 0);
            return maxHeight > this.viewHeight ? maxHeight : this.viewHeight;
        },
        maxX() {
            const maxWidth = this.modelValue.reduce((acc, box) => {
                return acc > box.x + box.width ? acc : box.x + box.width;
            }, 0);
            return maxWidth > this.viewWidth ? maxWidth : this.viewWidth;
        },
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
        <svg @mouseup="dragOff" :style="{transform: transform}" @mouseleave="dragOff" id="cajaA" :width="maxX()" :height="maxY()" @mousemove="mouseMoveEvent" ref="cajaA">
            <line-chart v-for="rect in modelValue" :key="rect.id" :globalPosition="globalPosition" v-model="rect" :parents="modelValue.filter(x => Array.isArray(rect.parents) && rect.parents.includes(x.id))" />
            <box-chart v-for="rect in modelValue" :key="rect.id" :globalPosition="globalPosition" v-model="rect" :parents="modelValue.filter(x => Array.isArray(rect.parents) && rect.parents.includes(x.id))" />
           
        </svg>
    </div>
 </div>
  `
}

var app = createApp({
    data() {
        return {
            boxs: []
        }
    },
    beforeMount() {


        const boxs = localStorage.getItem('boxs');
        if (boxs) {
            //this.boxs = JSON.parse(boxs);
        }
    },
    mounted() {
        fetch('json2.json').then(res => res.json()).then(data => {
            this.boxs = data;
        })
    },
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
app.component('box-chart', boxChart);
app.component('line-chart', lineChart);

app.mount('#app');


function clasificarAngulo(Ax, Ay, Bx, By) {
    const dx = Bx - Ax;
    const dy = By - Ay;
    const anguloRad = Math.atan2(dy, dx);
    let angle = anguloRad * (180 / Math.PI);

    angle = angle < 0 ? angle + 360 : angle;

    if (angle > -45 && angle <= 45) return 0;
    if (angle > 45 && angle <= 135) return 1;
    if (angle > 135 && angle <= 225) return 2;
    return 3;

}
