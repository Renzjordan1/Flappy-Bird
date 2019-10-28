class NeuralNetwork {
  constructor(a, b, c, d) {
    if (a instanceof tf.Sequential) {
      this.model = a;
      this.input_nodes = b;
      this.hidden_nodes = c;
      this.output_nodes = d;
    } else {
      this.input_nodes = a;
      this.hidden_nodes = b;
      this.output_nodes = c;
      this.model = this.createModel();
    }
  }

  createModel() {
    const model = tf.sequential();
    const hidden = tf.layers.dense({
      units: this.hidden_nodes,
      inputShape: [this.input_nodes],
      activation: "sigmoid"
    });

    model.add(hidden);

    const output = tf.layers.dense({
      units: this.output_nodes,
      activation: "softmax"
    });

    model.add(output);
    return model;
  }

  predict(arr) {
    return tf.tidy(() => {
      const xs = tf.tensor2d([arr]);
      const ys = this.model.predict(xs);
      const outputs = ys.dataSync();
      // console.log(outputs);
      return outputs;
    });
  }

  copy() {
    return tf.tidy(() => {
      const modelCopy = this.createModel();
      const weights = this.model.getWeights();
      const weightCopies = [];
      for (let i = 0; i < weights.length; i++) {
        weightCopies[i] = weights[i].clone();
      }
      modelCopy.setWeights(weightCopies);
      return new NeuralNetwork(
        modelCopy,
        this.input_nodes,
        this.hidden_nodes,
        this.output_nodes
      );
    });
  }

  crossover(parent) {
    return tf.tidy(() => {
      const modelCopy = this.createModel();
      const weights = this.model.getWeights();
      const weights2 = parent.model.getWeights();
      // console.log(weights);
      // console.log(weights2);

      const weightCopies = [];
      for (let i = 0; i < weights.length; i++) {
        let r = Math.random();
        if (r < 0.5) {
          weightCopies[i] = weights[i].clone();
        } else {
          weightCopies[i] = weights2[i].clone();
        }
      }
      modelCopy.setWeights(weightCopies);
      // console.log(modelCopy.getWeights());
      return new NeuralNetwork(
        modelCopy,
        this.input_nodes,
        this.hidden_nodes,
        this.output_nodes
      );
    });
  }

  dispose() {
    this.model.dispose();
  }

  mutate(rate) {
    tf.tidy(() => {
      const weights = this.model.getWeights();
      const mutatedWeights = [];
      for (let i = 0; i < weights.length; i++) {
        let tensor = weights[i];
        let shape = weights[i].shape;
        let values = tensor.dataSync().slice();
        for (let j = 0; j < values.length; j++) {
          let r = Math.random();
          if (r < rate) {
            let w = values[j];
            values[j] = w + (Math.random() * (-w, w) + -w);
          }
        }
        let newTensor = tf.tensor(values, shape);
        mutatedWeights[i] = newTensor;
      }
      this.model.setWeights(mutatedWeights);
    });
  }
}
