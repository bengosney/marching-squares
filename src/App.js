import React, { Component } from "react";
import { makeNoise3D } from "open-simplex-noise";
import "./App.css";

class point {
    constructor(x = null, y = null) {
        this.x = x;
        this.y = y;
    }
}

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            pixelSize: 10,
            height: 500,
            width: 150,
            cutoff: 128,
            color: '#ffffff',
        };

        this.drawing = false;
        this.ctx = null;
        this.data = [[]];

        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
        this.startts = this.getTS();

        this.noise = makeNoise3D(1);
    }

    getValues(width, height, time) {
        const { pixelSize } = this.state;
        const { noise } = this;

        const rows = Math.ceil(height / pixelSize) + 1;
        const cols = Math.ceil(width / pixelSize) + 1;

        const mod = pixelSize / 100;

        const data = new Array(cols);
        for (let x = 0; x < cols; x++) {
            data[x] = new Array(rows);
            for (let y = 0; y < rows; y++) {
                data[x][y] =parseFloat(noise(x * mod, y * mod, time)).toFixed(4);
            }
        }

        return data;
    }

    componentDidMount() {
        const canvas = this.refs.canvas;
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");

        this.rAF = requestAnimationFrame(() => this.updateAnimationState());
        this.updateWindowDimensions();
        window.addEventListener("resize", this.updateWindowDimensions);
    }

    updateWindowDimensions() {
        const { innerWidth, innerHeight } = window;

        this.setState({ width: innerWidth, height: innerHeight });
    }

    componentWillUnmount() {
        cancelAnimationFrame(this.rAF);
        window.removeEventListener("resize", this.updateWindowDimensions);
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
        const { width, height } = this.state;
        const { ctx } = this;

        ctx.clearRect(0, 0, width, height);
    }

    getTS() {
        const date = new Date();

        return date.getTime();
    }

    convertRange(value, r1, r2) {
        return ((value - r1[0]) * (r2[1] - r2[0])) / (r1[1] - r1[0]) + r2[0];
    }

    distance(x1, y1, x2, y2) {
        const x = x1 - x2;
        const y = y1 - y2;

        return Math.sqrt(x * x + y * y);
    }

    scale(value, r1, r2) {
        return ((value - r1[0]) * (r2[1] - r2[0])) / (r1[1] - r1[0]) + r2[0];
    }

    drawDots() {
        const { width, height, pixelSize, cutoff, color } = this.state;
        const { ctx } = this;
        const ts = this.getTS() / 10000;

        const data = this.getValues(width, height, ts);

        const c = this.convertRange(cutoff, [0, 255], [-1, 1]);
        const round = (val) => {            
            return val > c ? 1 : 0;
        }

        for (let x = 0; x < data.length - 1; x++) {
            for (let y = 0; y < data[x].length - 1; y++) {
                const _v1 = data[x    ][y    ];
                const _v2 = data[x + 1][y    ];
                const _v3 = data[x + 1][y + 1];
                const _v4 = data[x    ][y + 1];
                const s = `${round(_v1)}${round(_v2)}${round(_v3)}${round(_v4)}`;

                const line = (p1, p2) => {
                    ctx.beginPath();
                    ctx.strokeStyle = `${color}`;
                    ctx.moveTo(x * pixelSize + p1.x, y * pixelSize + p1.y);
                    ctx.lineTo(x * pixelSize + p2.x, y * pixelSize + p2.y);
                    ctx.stroke();
                };

                const v1 = this.convertRange(data[x    ][y    ], [-1, 1], [0, 1]);
                const v2 = this.convertRange(data[x + 1][y    ], [-1, 1], [0, 1]);
                const v3 = this.convertRange(data[x + 1][y + 1], [-1, 1], [0, 1]);
                const v4 = this.convertRange(data[x    ][y + 1], [-1, 1], [0, 1]);

                let a = new point();
                a.x = pixelSize * ((v1 + v2)  / 2);
                a.y = 0;

                let b = new point();
                b.x = pixelSize;
                b.y = pixelSize * ((v2 + v3) / 2);

                let c = new point();
                c.x = pixelSize * ((v3 + v4) / 2);
                c.y = pixelSize;
          
                let d = new point();
                d.x = 0;
                d.y = pixelSize * ((v4 + v1) / 2);


                
                switch (s) {
                    case "1110":
                    case "0001":
                        line(c, d);
                        break;
                    case "1101":
                    case "0010":
                        line(b, c);
                        break;
                    case "1011":
                    case "0100":
                        line(a, b);
                        break;
                    case "0111":
                        line(d, a);
                        break;
                    case "1000":
                        line(d, a);
                        break;
                    case "1100":
                    case "0011":
                        line(d, b);
                        break;
                    case "1001":
                    case "0110":
                        line(a, c);
                        break;
                    case "1010":
                        if (((v1 + v2) / 2) > 0.5) {
                            line(a, d);
                            line(b, c);
                        } else {
                            line(a, b);
                            line(c, d);
                        }
                        break;
                    case "0101":
                        line(a, b);
                        line(c, d);
                        break;
                    default:
                        // do nothing
                }
            }
        }
    }

    render() {
        const { width, height, cutoff, color } = this.state;

        return (
            <div className={"grid"}>
                <div class="ui">
                    <p>Controls</p>
                    <div>
                        <label htmlFor="height" >Height</label>
                        <input type="range" min="0" max="255" value={cutoff} onChange={(e) => this.setState({cutoff: e.target.value})} className="slider" id="height" name="height" />
                    </div>
                    <div>
                        <label htmlFor="height" >Color</label>
                        <input type="color" value={ color } onChange={(e) => this.setState({color: e.target.value})} id="color" name="color" />
                    </div>
                </div>
                <div className={"dots"}>
                    <canvas ref="canvas"  width={width} height={height} />
                </div>
            </div>
        );
    }
}

export default App;
