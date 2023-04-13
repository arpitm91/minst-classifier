import './BarGraph.css';
import React from 'react';

const BarGraph = ({ data }) => {
  const bars = data.map((value, index) => (
    <div
      key={index}
      className='graphEntry'
    >
      <div className='graphLabel'>{`${index} [${value.toFixed(2)}]`}</div>
      <div className='graphBarEmpty'>
        <div
          style={{
            width: `${value * 100}%`,
          }}
          className='graphBarFilled'
        />
      </div>
    </div>
  ));

  return <div className='barGraphParent'>
    <h4>Output from the model</h4>
    <div className='graphContainer'>
      {bars}
    </div>
  </div>;
};

export default BarGraph;
