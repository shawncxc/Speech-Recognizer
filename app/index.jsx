import React from 'react';
import ReactDOM from 'react-dom';

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
    this.recorder && this.recorder.exportWAV(function(blob) {
      var url = URL.createObjectURL(blob);
      var li = document.createElement('li');
      var au = document.createElement('audio');
      var hf = document.createElement('a');
      
      au.controls = true;
      au.src = url;
      hf.href = url;
      hf.download = new Date().toISOString() + '.wav';
      hf.innerHTML = hf.download;
      li.appendChild(au);
      li.appendChild(hf);
      recordingslist.appendChild(li);
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