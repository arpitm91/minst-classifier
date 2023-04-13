import './App.css';

import * as tf from '@tensorflow/tfjs';
import React from 'react';
import Canvas from './components/Canvas/Canvas';
import MatrixGrid from './components/MatrixGrid/MatrixGrid';
import BarGraph from './components/BarGraph/BarGraph';
import Prediction from './components/Prediction/Prediction';
import Section from './components/Section/Section';


class App extends React.Component {
  constructor() {
    super();
    const classifierPrediction = "X";
    const cganDiscriminatorPrediction = "X";
    const classifierInput = new Array(28).fill(0).map(() => new Array(28).fill([0]));
    const cganDiscriminatorInput = new Array(28).fill(0).map(() => new Array(28).fill([0]));
    const classifierClassification = new Array(10).fill(0)
    const cganDiscriminatorClassification = new Array(10).fill(0)
    const cganGeneratorOutput = new Array(28).fill(0).map(() => new Array(28).fill([0]));
    classifierClassification[classifierPrediction] = 1;
    this.state = {
      loading: false,

      classifierModel: undefined,
      classifierInput,
      classifierPrediction,
      classifierClassification,

      cganGeneratorModel: undefined,
      cganGeneratorOutput,

      cganDiscriminatorModel: undefined,
      cganDiscriminatorInput,
      cganDiscriminatorPrediction,
      cganDiscriminatorClassification,
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
      tf.loadLayersModel('./cgan/discriminator/model.json').then(cganDiscriminatorModel => {
        this.setState({ cganDiscriminatorModel })
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

  onCganDiscriminatorMatrixChange = async (matrix) => {
    let { cganDiscriminatorPrediction, cganDiscriminatorClassification } = this.state
    if (this.state.classifierModel) {
      const tensor = tf.tile(tf.tensor([matrix]), [10, 1, 1, 1]);
      console.log(tensor)
      const result = this.state.cganDiscriminatorModel.predict([tensor, tf.range(0, 10)])
      const normalizedResult = tf.ones([10, 1]).sub(result)
      const reshapedResult = tf.reshape(normalizedResult, [1, 10]);
      const array = reshapedResult.dataSync();
      cganDiscriminatorClassification = Array.from(array);
      cganDiscriminatorPrediction = tf.argMax(reshapedResult, 1).dataSync()[0];
    }

    this.setState({ cganDiscriminatorInput: matrix, cganDiscriminatorPrediction, cganDiscriminatorClassification })
  }

  onGenerateNumber = async (number) => {
    let { cganGeneratorOutput } = this.state
    if (this.state.cganGeneratorModel) {
      const result = this.state.cganGeneratorModel.predict([tf.randomNormal([1, 100]), tf.tensor([number])])
      const reshapedResult = tf.reshape(result, [28, 28, 1]);

      cganGeneratorOutput = await reshapedResult.array();
    }

    this.setState({ cganGeneratorOutput })
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
          <MatrixGrid matrix={this.state.classifierInput} title="Input to the model" />
          <BarGraph data={this.state.classifierClassification} />
          <Prediction prediction={this.state.classifierPrediction} />
        </Section>
        <hr style={{ width: "100%" }} color='#09d3ac'></hr>
        <Section name="Conditional GAN Generation">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((n) => {
            return (<button onClick={() => this.onGenerateNumber(n)}>{n}</button>)
          })}
          <MatrixGrid matrix={this.state.cganGeneratorOutput} title="Output" />
        </Section>
        <hr style={{ width: "100%" }} color='#09d3ac'></hr>
        <Section name="Conditional GAN Classification">
          <Canvas sendMatrix={this.onCganDiscriminatorMatrixChange} />
          <MatrixGrid matrix={this.state.cganDiscriminatorInput} title="Input to the model" />
          <BarGraph data={this.state.cganDiscriminatorClassification} />
          <Prediction prediction={this.state.cganDiscriminatorPrediction} />
        </Section>
      </div >
    );
  }
}

export default App;
