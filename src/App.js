import React, {Component} from 'react';
import './App.css';

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            pixelSize: 1.5,
            height: 500,
            width: 150,
            mouseX: -9999,
            mouseY: -9999,
            mouseEvent: 0,
            effectMod: 2,
            strength: 40,
            strengthCur: 0,
            mouseOver: false,
            gap: 14,
            r: 255,
            g: 255,
            b: 255,
            a: .8
        };

        this.drawing = false;
        this.ctx = null;

        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
        this.startts = this.getTS();
    }


    componentDidMount() {
        const canvas = this.refs.canvas;
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");

        canvas.addEventListener('mousemove', (e) => {
            this.setState({
                mouseX: e.clientX,
                mouseY: e.clientY
            });
        });

        canvas.addEventListener('mouseover', () => {
            this.setState({mouseOver: true, mouseEvent: this.getTS()});
        });

        canvas.addEventListener('mouseleave', () => {
            this.setState({mouseOver: false, mouseEvent: this.getTS()});
        });

        this.rAF = requestAnimationFrame(() => this.updateAnimationState());
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
    }

    updateWindowDimensions() {
        const rect = this.canvas.getBoundingClientRect();
        const {innerWidth, innerHeight} = window;
        const {width, height} = rect;

        this.setState({width: Math.min(width, innerWidth), height: Math.min(height, innerHeight)});
    }

    componentWillUnmount() {
        cancelAnimationFrame(this.rAF);
        window.removeEventListener('resize', this.updateWindowDimensions);
    }

    updateAnimationState() {
        this.ts = this.getTS();
        this.clearFrame();

        this.drawDots();

        this.nextFrame();
    }

    nextFrame() {
        this.rAF = requestAnimationFrame(() => this.updateAnimationState());
    }

    clearFrame() {
        const {width, height} = this.state;
        const {ctx} = this;

        ctx.clearRect(0, 0, width, height);
    }

    getTS() {
        const date = new Date();

        return date.getTime();
    }

    convertRange(value, r1, r2) {
        return (value - r1[0]) * (r2[1] - r2[0]) / (r1[1] - r1[0]) + r2[0];
    }

    move(x, y, dx, x1, y1, x2, y2) {
        const a = {x: x2 - x1, y: y2 - y1};
        let mag = Math.sqrt(a.x * a.x + a.y * a.y);

        if (mag === 0) {
            a.x = a.y = 0;
        } else {
            a.x = a.x / mag * dx;
            a.y = a.y / mag * dx;
        }

        return {x: x + a.x, y: y + a.y};
    }

    distance(x1, y1, x2, y2) {
        const x = x1 - x2;
        const y = y1 - y2;

        return Math.sqrt(x * x + y * y);
    };

    scale(value, r1, r2) {
        return (value - r1[0]) * (r2[1] - r2[0]) / (r1[1] - r1[0]) + r2[0];
    }

    drawDots() {
        const {width, height, mouseX, mouseY, mouseOver } = this.state;
        const {ctx} = this;
        const ts = this.getTS() / 1000;

        const smallest = Math.min(width, height);
        const strength = Math.min(smallest / 15, 40);
        const gap = Math.min(smallest / 50, 15);
        const pixelSize = 1;

        let curX = mouseX;
        let curY = mouseY;
        if (!mouseOver) {
            const border = 7.5;
            const borderWidth = width / border;
            const borderHeight = height / border;
            curX = this.scale(Math.sin(ts), [-1, 1], [borderWidth, width - borderWidth]);
            curY = this.scale(Math.cos(ts), [-1, 1], [borderHeight, height - borderHeight]);
        }

        for (let x = 0; x < width; x += gap) {
            for (let y = 0; y < height; y += gap) {
                const dist = this.distance(x, y, curX, curY);

                const mod = Math.max(0, strength);
                const pos = this.move(x, y, mod, curX, curY, x, y);

                const pixelMod = this.scale(dist, [0, width], [0, gap]);

                const from = [242, 51, 168];
                const to = [7, 197, 209];

                const r = this.scale(dist, [0, width * .75], [from[0], to[0]]);
                const g = this.scale(dist, [0, width * .75], [from[1], to[1]]);
                const b = this.scale(dist, [0, width * .75], [from[2], to[2]]);
                const a = .8;

                ctx.beginPath();
                ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
                ctx.fillRect(pos.x, pos.y, pixelSize + pixelMod, pixelSize + pixelMod);
            }
        }
    }

    render() {
        const {width, height } = this.state;

        return (
            <div className={'grid'}>
                <div className={'dots'}>
                    <canvas ref="canvas" width={width} height={height}/>
                </div>
            </div>
        );
    }
}

export default App;
