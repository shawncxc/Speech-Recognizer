import React from 'react';
import request from 'superagent';
import Recorder from 'lib/recorder';

export default class Listener extends React.Component {
  constructor() {
    super();
    var AudioContext = window.AudioContext || window.webkitAudioContext;
    this.audio_context = new AudioContext();
    this.recorder = null;
    window.URL = window.URL || window.webkitURL;
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
    console.log('Audio context set up.');
    console.log('navigator.getUserMedia ' + (navigator.getUserMedia ? 'available.' : 'not present!'));

    const self = this;
    navigator.getUserMedia(
      { audio: true },
      function(stream) {
        var input = self.audio_context.createMediaStreamSource(stream);
        console.log('Media stream created.');
        self.recorder = new Recorder(input, { numChannels: 1 });
        console.log('Recorder initialised.');
      },
      function(e) {
        console.log('No live audio input: ' + e);
      }
    );

    this.startRecording = this.startRecording.bind(this);
    this.stopRecording = this.stopRecording.bind(this);
    this.exportWAV = this.exportWAV.bind(this);
    this.sendWav = this.sendWav.bind(this);
  }

  startRecording() {
    this.recorder && this.recorder.record();
    console.log('Recording...');
  }

  stopRecording() {
    this.recorder && this.recorder.stop();
    console.log('Stopped recording.');
    this.exportWAV();
    this.recorder.clear();
  }

  exportWAV() {
    const self = this;
    this.recorder && this.recorder.exportWAV(function(blob) {
      var reader = new FileReader();
      reader.onload = function() {
        var dataUrl = reader.result;
        var base64 = dataUrl.split(',')[1];
        self.sendWav(base64);
      };
      reader.readAsDataURL(blob);
    });
  }

  sendWav(base64) {
    request
    .post('http://localhost:3000/listen')
    .send({ sound: base64 })
    .then((result) => {
      console.log(result);
    })
    .catch((err) => {
      throw err;
    });
  }

  render() {
    return (
      <div>
        <button onClick={ this.startRecording }>record</button>
        <button onClick={ this.stopRecording }>stop</button> 
      </div>
    );
  }
}
