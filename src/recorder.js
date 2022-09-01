class Recorder extends AudioWorkletProcessor {
  constructor() {
    super();
  }

  process(inputList, outputList, parameters) {
    // Using the inputs (or not, as needed),
    // write the output into each of the outputs
    // …
    const samples = inputList[0][0];
    //console.log("got", samples.length, "samples");
    const level = samples.reduce((acc, o) => acc + o, 0) / samples.length;
    this.port.postMessage(level);
    return true;
  }
}

registerProcessor("recorder", Recorder);
