let _audioContext;

function getAudioContext() {
  try {
    _audioContext = new AudioContext();
  } catch (e) {
    console.log("** Error: Unable to create audio context");
    return null;
  }
  return _audioContext;
}

async function createRecorderNode(audioContext) {
  let processorNode;
  try {
    processorNode = new AudioWorkletNode(audioContext, "recorder");
  } catch (e) {
    try {
      console.log("adding...");
      await audioContext.audioWorklet.addModule("recorder.js");
      processorNode = new AudioWorkletNode(audioContext, "recorder");
    } catch (e) {
      console.log(`** Error: Unable to create worklet node: ${e}`);
      return null;
    }
  }
  await audioContext.resume();
  return processorNode;
}

async function startRecording(stream) {
  const audioContext = getAudioContext();
  const recorderNode = await createRecorderNode(audioContext);
  if (!recorderNode) {
    console.log("** Error: unable to create processor");
    return;
  }
  let value = 0;
  recorderNode.port.onmessage = (e) => {
    value = Math.abs(Math.round(e.data * 1000));
  };
  setInterval(() => {
    document.getElementById("level").innerHTML = value;
  }, 100);

  const source = audioContext.createMediaStreamSource(stream);
  source.connect(recorderNode);
}

const ready = function () {
  navigator.permissions.query({ name: "microphone" }).then(function (result) {
    if (result.state == "granted") {
    } else if (result.state == "prompt") {
    } else if (result.state == "denied") {
    }
    result.onchange = function () {};
  });

  navigator.mediaDevices
    .getUserMedia({ audio: true, video: false })
    .then(startRecording);
};

window.addEventListener("load", ready);
