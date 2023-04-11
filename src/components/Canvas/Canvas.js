import './Canvas.css';
import React from "react";


const size = 10;

class Canvas extends React.Component {
  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
    this.state = {
      context: null,
      isDrawing: false,
    };
  }

  componentDidMount() {
    const canvas = this.canvasRef.current;
    const context = canvas.getContext("2d");
    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.lineWidth = 3 * size;
    context.lineCap = "round";
    context.lineJoin = "round";
    this.setState({ context: context });
  }

  startDrawing = (e) => {
    const { offsetX, offsetY } = e.nativeEvent;
    const { context } = this.state;
    context.beginPath();
    context.moveTo(offsetX, offsetY);
    this.setState({ isDrawing: true });
  };

  draw = (e) => {
    if (!this.state.isDrawing) {
      return;
    }
    const { offsetX, offsetY } = e.nativeEvent;
    const { context } = this.state;
    context.lineTo(offsetX, offsetY);
    context.stroke();
    this.convertToMatrix()
  };

  stopDrawing = () => {
    this.setState({ isDrawing: false });
  };

  clearCanvas = () => {
    const { context } = this.state;
    context.clearRect(0, 0, this.canvasRef.current.width, this.canvasRef.current.height);
    context.fillStyle = "white";
    context.fillRect(0, 0, this.canvasRef.current.width, this.canvasRef.current.height);
    this.convertToMatrix()
  };

  convertToMatrix = () => {
    const canvas = this.canvasRef.current;
    const context = canvas.getContext("2d");
    const imgData = context.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;
    const matrix = [];

    for (let i = 0; i < canvas.width; i += size) {
      const row = []
      for (let j = 0; j < canvas.height; j += size) {
        let brightness = 0;
        for (let k = 0; k < size; k++) {
          for (let l = 0; l < size; l++) {
            const index = (j + k + (i + l) * canvas.width) * 4;
            brightness += data[index];
          }
        }
        brightness /= size * size;
        row.push([1 - (brightness / 255)]);
      }
      matrix.push(row)
    }

    this.props.sendMatrix(matrix);
  };


  render() {
    return (
      <div className='canvasParent'>
        <h4>Draw in the canvas below</h4>
        <div>
          <canvas
            ref={this.canvasRef}
            width={size * 28}
            height={size * 28}
            onMouseDown={this.startDrawing}
            onMouseMove={this.draw}
            onMouseUp={this.stopDrawing}
            onMouseLeave={this.stopDrawing}
            className='canvas'
          />
        </div>
        <div>
          <button onClick={this.clearCanvas} className='clearCanvas'>Clear Canvas</button>
        </div>
      </div>
    );
  }
}

export default Canvas;
