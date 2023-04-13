import './App.css';

import * as tf from '@tensorflow/tfjs';
import React from 'react';
import Canvas from './components/Canvas/Canvas';
import MatrixGrid from './components/MatrixGrid/MatrixGrid';
import BarGraph from './components/BarGraph/BarGraph';
import Prediction from './components/Prediction/Prediction';


class App extends React.Component {
  constructor() {
    super();
    const prediction = 0;
    const arr = new Array(28).fill(0).map(() => new Array(28).fill([0]));
    const resultArray = new Array(10).fill(0)
    resultArray[prediction] = 1;
    this.state = {
      loading: false,
      model: undefined,
      arr,
      prediction,
      resultArray,
    };
  }

  componentDidMount() {
    if (!this.state.loading) {
      this.setState({ loading: true });
      tf.loadLayersModel('./classifier/model.json').then(model => {
        this.setState({ model })
      });
    }
  }

  onMatrixChange = (matrix) => {
    let { prediction, resultArray } = this.state
    if (this.state.model) {
      const tensor = tf.tensor([matrix]);
      const result = this.state.model.predict(tensor)
      const min = result.min();
      const positiveResult = result.sub(min);
      const sum = positiveResult.sum();
      const normalizedResult = positiveResult.div(sum);
      const array = normalizedResult.dataSync();
      resultArray = Array.from(array);
      prediction = tf.argMax(normalizedResult, 1).dataSync()[0];
    }

    this.setState({ arr: matrix, prediction, resultArray })
  }

  render() {
    return (
      <div className='app'>
        <div className='title'>
          <h1>MINST Classifier</h1>
          <h4>Created by Arpit Mathur</h4>
        </div>
        <div className='content'>
          <Canvas sendMatrix={this.onMatrixChange} />
          <MatrixGrid matrix={this.state.arr} />
          <BarGraph data={this.state.resultArray} />
          <Prediction prediction={this.state.prediction} />
        </div>
      </div >
    );
  }
}

export default App;
