import './MultipleMatrixCanvas.css';

import React, { Component } from "react";

class MultipleMatrixGrid extends Component {
  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
    this.state = {
      oldmatrix: undefined
    }
  }

  componentDidMount() {
    this.drawCanvas();
  }

  componentDidUpdate() {
    this.drawCanvas();
  }

  drawCanvas = () => {
    if (JSON.stringify(this.state.oldmatrix) === JSON.stringify(this.props.matrix)) {
      return;
    }
    const { length, matrix } = this.props;
    const canvas = this.canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    const width = matrix[0][0].length;
    const height = matrix[0].length;

    const imgData = ctx.createImageData(width, height);
    for (let i = 0; i < length; i++) {
      for (let j = 0; j < length; j++) {
        const data = matrix[i * length + j];
        for (let y = 0; y < height; y++) {
          for (let x = 0; x < width; x++) {
            const value = data[y][x];
            const offset = (y * width + x) * 4;
            imgData.data[offset + 0] = 48 * (1 - value) + 9 * value;
            imgData.data[offset + 1] = 56 * (1 - value) + 211 * value;
            imgData.data[offset + 2] = 70 * (1 - value) + 172 * value;
            imgData.data[offset + 3] = 255;
          }
        }

        const stretchedWidth = canvas.width / length;
        const stretchedHeight = canvas.height / length;
        const img = this.imageFromImageData(imgData)

        img.onload = function () {
          ctx.drawImage(
            img,
            0,
            0,
            width,
            height,
            i * stretchedWidth,
            j * stretchedHeight,
            stretchedWidth,
            stretchedHeight
          );
        }
      }
    }
    this.setState({ oldmatrix: this.props.matrix })
  }

  imageFromImageData = (imageData) => {
    const canvas = document.createElement('canvas');
    canvas.width = imageData.width;
    canvas.height = imageData.height;
    const ctx = canvas.getContext('2d');
    ctx.putImageData(imageData, 0, 0);
    const img = new Image();
    img.src = canvas.toDataURL();
    return img;
  }


  render() {
    return (
      <div className='matrixParent'>
        <h4>{this.props.title ?? ""}</h4>
        <div>
          <canvas
            ref={this.canvasRef}
            width={280}
            height={280}
            className='matrixCanvas'
          />
        </div>
      </div>
    );
  }
}

export default MultipleMatrixGrid;
