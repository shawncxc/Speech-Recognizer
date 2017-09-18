import React from 'react';
import ReactDOM from 'react-dom';
import request from 'superagent';
import Recorder from '../lib/recorder';

class RecorderBox extends React.Component {

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
    this.createDownloadLink = this.createDownloadLink.bind(this);
    this.sendWav = this.sendWav.bind(this);
  }

  startRecording() {
    this.recorder && this.recorder.record();
    console.log('Recording...');
  }

  stopRecording() {
    this.recorder && this.recorder.stop();
    console.log('Stopped recording.');
    
    // create WAV download link using audio data blob
    this.createDownloadLink();
    this.recorder.clear();
  }

  createDownloadLink() {
    const self = this;
    this.recorder && this.recorder.exportWAV(function(blob) {
      var blobToBase64 = function(blob, cb) {
        var reader = new FileReader();
        reader.onload = function() {
          var dataUrl = reader.result;
          var base64 = dataUrl.split(',')[1];
          cb(base64);
        };
        reader.readAsDataURL(blob);
      };

      blobToBase64(blob, function(base64) { // encode
        self.sendWav(base64);
      });
    });
  }

  sendWav(base64) {
    request
    .post('http://localhost:3000/listen')
    .send({ sound: base64 })
    .then((result) => {
      // process the result here
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
        <ul id="recordingslist"></ul>  
      </div>
    );
  }
}

ReactDOM.render(
  <RecorderBox />,
  document.getElementById("app")
);