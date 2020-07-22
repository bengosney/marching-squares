import React, { Component } from "react";
import { makeNoise2D, makeNoise3D } from "open-simplex-noise";
import "./App.css";

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            pixelSize: 60,
            height: 500,
            width: 150,
            mouseX: -9999,
            mouseY: -9999,
            mouseEvent: 0,
            effectMod: 2,
            strength: 40,
            strengthCur: 0,
            mouseOver: false,
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
                data[x][y] = noise(x * mod, y * mod, time);
                //data[x][y] = Math.random();
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
        const rect = this.canvas.getBoundingClientRect();
        const { innerWidth, innerHeight } = window;
        const { width, height } = rect;
        const realWidth = Math.min(width, innerWidth);
        const realHeight = Math.min(height, innerHeight);

        this.setState({ width: realWidth, height: realHeight });
        this.nextFrame();
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
        const { width, height } = this.state;
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
        const { width, height, pixelSize } = this.state;
        const { ctx } = this;
        const ts = this.getTS() / 1000;

        const data = this.getValues(width, height,  Date.now() / 5000);

        //*
        for (let x = 0; x < data.length; x++) {
            for (let y = 0; y < data[x].length; y++) {
                const v = this.convertRange(data[x][y], [-1, 1], [0, 1]);

                const r = v * 255;
                const g = v * 255;
                const b = v * 255;
                const a = 0.5;

                const mod = 0; //pixelSize * 0.1;
                const s = pixelSize;
                const hs = 0; //s / 1;

                ctx.beginPath();
                ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
                ctx.fillRect(x * pixelSize + mod - hs, y * pixelSize + mod - hs, s, s);
            }
        }
        //*/

        const halfPixel = pixelSize / 2;
        /*
        for (let x = 0; x < data.length - 1; x++) {
            for (let y = 0; y < data[x].length - 1; y++) {
                const v1 = Math.ceil(data[x][y]);
                const v2 = Math.ceil(data[x + 1][y]);
                const v3 = Math.ceil(data[x + 1][y + 1]);
                const v4 = Math.ceil(data[x][y + 1]);
                const vString = `${v1}${v2}${v3}${v4}`;

                const line = (fx, fy, tx, ty) => {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(255, 255, 255, 1)`;
                    ctx.moveTo(x * pixelSize + fx, y * pixelSize + fy);
                    ctx.lineTo(x * pixelSize + tx, y * pixelSize + ty);
                    ctx.stroke();

                    ctx.beginPath();
                    ctx.fillStyle = `rgba(255, 255, 255, 1)`;
                    ctx.fillRect(x * pixelSize + fx - 2, y * pixelSize + fy - 2, 4, 4);
                    ctx.fillRect(x * pixelSize + tx - 2, y * pixelSize + ty - 2, 4, 4);
                };

                switch (vString) {
                    case "1110":
                    case "0001":
                        line(0, halfPixel, halfPixel, pixelSize);
                        break;
                    case "1101":
                    case "0010":
                        line(halfPixel, pixelSize, pixelSize, halfPixel);
                        break;
                    case "1011":
                    case "0100":
                        line(halfPixel, 0, pixelSize, halfPixel);
                        break;
                    case "0111":
                    case "1000":
                        line(0, halfPixel, halfPixel, 0);
                        break;
                    case "1100":
                    case "0011":
                        line(0, halfPixel, pixelSize, halfPixel);
                        break;
                    case "1001":
                    case "0110":
                        line(halfPixel, 0, halfPixel, pixelSize);
                        break;
                    case "1010":
                        line(0, halfPixel, halfPixel, 0);
                        line(halfPixel, pixelSize, pixelSize, halfPixel);
                        break;
                    case "0101":
                        line(0, halfPixel, halfPixel, pixelSize);
                        line(halfPixel, 0, pixelSize, halfPixel);
                        break;
                    case "1111":
                    case "0000":
                        break;
                    default:
                        console.log("missed", vString);
                        break;
                }
            }
        }
        //*/

        //*
        for (let x = 0; x < data.length - 1; x++) {
            for (let y = 0; y < data[x].length - 1; y++) {
                const v1 = data[x    ][y    ];
                const v2 = data[x + 1][y    ];
                const v3 = data[x + 1][y + 1];
                const v4 = data[x    ][y + 1];

                const line = (fx, fy, tx, ty, colour = false) => {
                    ctx.beginPath();
                    if (colour) {
                        ctx.strokeStyle = colour;
                    } else {
                        ctx.strokeStyle = `rgba(255, 255, 255, 1)`;
                    }
                    ctx.moveTo(x * pixelSize + fx, y * pixelSize + fy);
                    ctx.lineTo(x * pixelSize + tx, y * pixelSize + ty);
                    ctx.stroke();
                };

                //const s = `${Math.round(v1)}${Math.round(v2)}${Math.round(v3)}${Math.round(v4)}`;
                const s = `${Math.ceil(data[x][y])}${Math.ceil(data[x + 1][y])}${Math.ceil(data[x + 1][y + 1])}${Math.ceil(data[x][y + 1])}`;
                const pixelMod = pixelSize;

                switch (s) {
                    case "1110":
                        line(0, halfPixel + pixelMod * v1, halfPixel - pixelMod * v3, pixelSize);
                        break;
                    case "0001":
                        line(0, halfPixel - pixelMod * v4, halfPixel + pixelMod * v4, pixelSize);
                        break;
                    case "1101":
                        line(halfPixel + pixelMod * v4, pixelSize, pixelSize, halfPixel + pixelMod * v2);
                        break;
                    case "0010":
                        line(halfPixel - pixelMod * v3, pixelSize, pixelSize, halfPixel - pixelMod * v3); 
                        break;
                    case "1011":
                        line(halfPixel + pixelMod * v1, 0, pixelSize, halfPixel - pixelMod * v3);
                        break;
                    case "0100":
                        line(halfPixel - pixelMod * v2, 0, pixelSize, halfPixel + pixelMod * v2);
                        break;
                    case "0111":
                        line(0, halfPixel - pixelMod * v4, halfPixel - pixelMod * v2, 0);
                        break;
                    case "1000":
                        line(0, halfPixel + pixelMod * v1, halfPixel + pixelMod * v1, 0);
                        break;
                    case "1100":
                        line(0, halfPixel + pixelMod * v1, pixelSize, halfPixel + pixelMod * v2);
                        break;
                    case "0011":
                        line(0, halfPixel - pixelMod * v4, pixelSize, halfPixel - pixelMod * v3);
                        break;
                    case "1001":
                        line(halfPixel + pixelMod * v1, 0, halfPixel + pixelMod * v4, pixelSize);
                        break;
                    case "0110":
                        line(halfPixel - pixelMod * v2, 0, halfPixel - pixelMod * v3, pixelSize);
                        break;
                    case "1010":
                        line(0, halfPixel + pixelMod * v1, halfPixel + pixelMod * v1, 0);
                        line(halfPixel - pixelMod * v3, pixelSize, pixelSize, halfPixel - pixelMod * v3);
                        break;
                    case "0101":
                        line(0, halfPixel - pixelMod * v4, halfPixel + pixelMod * v4, pixelSize);
                        line(halfPixel - pixelMod * v2, 0, pixelSize, halfPixel + pixelMod * v2);
                        break;
                }
            }
        }
        //*/
    }

    render() {
        const { width, height } = this.state;

        return (
            <div className={"grid"}>
                <div className={"dots"}>
                    <canvas ref="canvas" width={width} height={height} />
                </div>
            </div>
        );
    }
}

export default App;
