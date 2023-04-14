import './MultipleMatrixGrid.css';

import React, { Component } from "react";

class MultipleMatrixGrid extends Component {
  render() {
    const { length } = this.props;
    const size = Math.floor(10 / length);
    return (
      <div className='matrixParent'>
        <h4>{this.props.title ?? ""}</h4>
        <div className='matrixOutputGrid' style={{
          gridTemplateColumns: `repeat(${length}, 1fr)`,
        }}>
          {this.props.matrix.map((output) => {
            return (
              <div style={{
                display: 'flex',
                width: '100%',
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <div className="small-matrix-grid-container" style={{
                  width: `${size * 28}px`,
                  height: `${size * 28}px`,
                }}>
                  {output.map((row, rowIndex) =>
                    row.map((value, colIndex) => (
                      <div
                        key={`${rowIndex}-${colIndex}`}
                        style={{
                          backgroundColor: `rgba(9, 211, 172, ${value})`,
                          width: `${size}px`,
                          height: `${size}px`,
                        }}
                      ></div>
                    ))
                  )}
                </div>
              </div>
            )
          })}

        </div>
      </div>
    );
  }
}

export default MultipleMatrixGrid;
