import './MatrixGrid.css';

import React, { Component } from "react";

class MatrixGrid extends Component {
  render() {
    return (
      <div className='matrixParent'>
        <h4>Input to the model</h4>
        <div className="matrix-grid-container">
          {this.props.matrix.map((row, rowIndex) =>
            row.map((value, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className="matrix-grid-item"
                style={{ backgroundColor: `rgba(9, 211, 172, ${value})` }}
              ></div>
            ))
          )}
        </div>
      </div>
    );
  }
}

export default MatrixGrid;
