import React, { Component } from "react";
import "./App.css";

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            pixelSize: 30,
            height: 500,
            width: 150,
            mouseX: -9999,
            mouseY: -9999,
            mouseEvent: 0,
            effectMod: 2,
            strength: 40,
            strengthCur: 0,
            mouseOver: false,
            data: [[]],
        };

        this.drawing = false;
        this.ctx = null;

        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
        this.startts = this.getTS();
    }

    getValues(width, height) {
        const { pixelSize } = this.state;

        const rows = Math.ceil(height / pixelSize) + 1;
        const cols = Math.ceil(width / pixelSize) + 1;

        const data = new Array(cols);
        for (let x = 0; x < cols; x++) {
            data[x] = new Array(rows);
            for (let y = 0; y < rows; y++) {
                data[x][y] = Math.random();
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

        const data = this.getValues(realWidth, realHeight);

        this.setState({ width: realWidth, height: realHeight, data: data });
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

        //this.nextFrame();
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
        const { width, height, data, pixelSize } = this.state;
        const { ctx } = this;
        const ts = this.getTS() / 1000;

        /*
        for (let x = 0; x < data.length; x++) {
            for (let y = 0; y < data[x].length; y++) {

                const v = Math.round(data[x][y]) ? 0 : 1;

                const r = v * 255;
                const g = v * 255;
                const b = v * 255;
                const a = 0.8;

                const mod = pixelSize * .5;

                ctx.beginPath();
                ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
                ctx.fillRect((x * pixelSize) + mod, (y * pixelSize) + mod, pixelSize - mod, pixelSize - mod );
            }
        }
        //*/

        for (let x = 0; x < data.length - 1; x++) {
            for (let y = 0; y < data[x].length - 1; y++) {
                const v1 = Math.round(data[x][y]);
                const v2 = Math.round(data[x + 1][y]);
                const v3 = Math.round(data[x + 1][y + 1]);
                const v4 = Math.round(data[x][y + 1]);
                const vString = `${v1}${v2}${v3}${v4}`;

                const line = (fx, fy, tx, ty) => {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(255, 255, 255, 1)`;
                    ctx.moveTo(x * pixelSize + fx, y * pixelSize + fy);
                    ctx.lineTo(x * pixelSize + tx, y * pixelSize + ty);
                    ctx.stroke();
                };

                switch (vString) {
                    case "1110":
                    case "0001":
                        line(0, pixelSize / 2, pixelSize / 2, pixelSize);
                        break;
                    case "1101":
                    case "0010":
                        line(pixelSize / 2, pixelSize, pixelSize, pixelSize / 2);
                        break;
                    case "1011":
                    case "0100":
                        line(pixelSize / 2, 0, pixelSize, pixelSize / 2);
                        break;
                    case "0111":
                    case "1000":
                        line(0, pixelSize / 2, pixelSize / 2, 0);
                        break;
                    case "1100":
                    case "0011":
                        line(0, pixelSize / 2, pixelSize, pixelSize / 2);
                        break;
                    case "1001":
                    case "0110":
                        line(pixelSize / 2, 0, pixelSize / 2, pixelSize);
                        break;
                    case "1010":
                        line(0, pixelSize / 2, pixelSize / 2, 0);
                        line(pixelSize / 2, pixelSize, pixelSize, pixelSize / 2);
                        break;
                    case "0101":
                        line(0, pixelSize / 2, pixelSize / 2, pixelSize);
                        line(pixelSize / 2, 0, pixelSize, pixelSize / 2);
                        break;
                    case "1111":
                    case "0000":
                        break;
                    default:
                        console.log("missed", vString);
                        break;
                }

                if (y > 1) {
                    //break;
                }
            }
            if (x > 0) {
                //break;
            }
        }
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
