import './NumbersGrid.css';
import React from 'react';

const NumbersGrid = ({ onNumberSelect }) => {

    return (
        <div className='numbersGridParent'>
            <h4>Select a number to be generated</h4>
            <div className='numbersGrid' >
                {
                    [1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((n) => {
                        return (
                            <div className='numbersGridButtonContainer'>
                                <button onClick={() => onNumberSelect(n)} className='numbersGridButton'>{n}</button>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    );
};

export default NumbersGrid;
