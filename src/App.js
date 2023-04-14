import './App.css';

import * as tf from '@tensorflow/tfjs';
import React from 'react';
import Canvas from './components/Canvas/Canvas';
import MultipleMatrixCanvas from './components/MultipleMatrixCanvas/MultipleMatrixCanvas';
import BarGraph from './components/BarGraph/BarGraph';
import Prediction from './components/Prediction/Prediction';
import Section from './components/Section/Section';
import NumbersGrid from './components/NumbersGrid/NumbersGrid';

const OUTPUTS = 3;


class App extends React.Component {
  constructor() {
    super();
    const classifierPrediction = "X";
    const classifierInput = new Array(28).fill(0).map(() => new Array(28).fill([0]));
    const classifierClassification = new Array(10).fill(0)
    const cganGeneratorOutputs = new Array(OUTPUTS * OUTPUTS).fill(0).map(() => new Array(28).fill(0).map(() => new Array(28).fill([0])));
    classifierClassification[classifierPrediction] = 1;
    this.state = {
      loading: false,

      classifierModel: undefined,
      classifierInput,
      classifierPrediction,
      classifierClassification,

      cganGeneratorModel: undefined,
      cganGeneratorOutputs,
    };
  }

  componentDidMount() {
    if (!this.state.loading) {
      this.setState({ loading: true });
      tf.loadLayersModel('./classifier/model.json').then(classifierModel => {
        this.setState({ classifierModel })
      });
      tf.loadLayersModel('./cgan/generator/model.json').then(cganGeneratorModel => {
        this.setState({ cganGeneratorModel })
      });
    }
  }

  onClassifierMatrixChange = (matrix) => {
    let { classifierPrediction, classifierClassification } = this.state
    if (this.state.classifierModel) {
      const tensor = tf.tensor([matrix]);
      const result = this.state.classifierModel.predict(tensor)
      const min = result.min();
      const positiveResult = result.sub(min);
      const sum = positiveResult.sum();
      const normalizedResult = positiveResult.div(sum);
      const array = normalizedResult.dataSync();
      classifierClassification = Array.from(array);
      classifierPrediction = tf.argMax(normalizedResult, 1).dataSync()[0];
    }

    this.setState({ classifierInput: matrix, classifierPrediction, classifierClassification })
  }

  onGenerateNumber = async (number) => {
    let { cganGeneratorOutputs } = this.state
    const numberOfOutputs = OUTPUTS * OUTPUTS;
    if (this.state.cganGeneratorModel) {
      const result = this.state.cganGeneratorModel.predict([tf.randomStandardNormal([numberOfOutputs, 100]), tf.tensor(new Array(numberOfOutputs).fill(number))])
      const reshapedResult = tf.reshape(result, [numberOfOutputs, 28, 28]);

      cganGeneratorOutputs = await reshapedResult.array();
    }

    this.setState({ cganGeneratorOutputs })
  }


  render() {
    return (
      <div className='app'>
        <div className='title'>
          <h1>MINST</h1>
          <h4>Created by Arpit Mathur</h4>
        </div>
        <Section name="Classification">
          <Canvas sendMatrix={this.onClassifierMatrixChange} />
          <MultipleMatrixCanvas matrix={[this.state.classifierInput]} length={1} title="Input to the model" />
          <BarGraph data={this.state.classifierClassification} />
          <Prediction prediction={this.state.classifierPrediction} />
        </Section>
        <hr style={{ width: "100%" }} color='#09d3ac'></hr>
        <Section name="Conditional GAN Generation">
          <NumbersGrid onNumberSelect={this.onGenerateNumber} />
          <MultipleMatrixCanvas matrix={this.state.cganGeneratorOutputs} length={OUTPUTS} title="Outputs" />
        </Section>
      </div >
    );
  }
}

export default App;
