import './Section.css';
import React from 'react';

const Section = (props) => {

    return (
        <div className='section-container'>
            <div className='section'>
                <h2>{props.name}</h2>
                <div className='section-content'>
                    {props.children}
                </div>
            </div>
        </div>
    );
};

export default Section;
