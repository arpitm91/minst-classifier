import './Prediction.css';
import React from 'react';

const Prediction = ({ prediction }) => {

    return (
        <div className='predictionParent'>
            <h4>Prediction</h4>
            <div className='prediction' >{prediction}</div>
        </div>
    );
};

export default Prediction;
