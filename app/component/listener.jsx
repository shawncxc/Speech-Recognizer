import React from 'react';
import request from 'superagent';
import Recorder from 'lib/recorder';
import { connect } from 'react-redux';
import store from 'store/store';

// UI component
import 'style/listener.css';
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';

export default class Listener extends React.Component {
  constructor(props) {
    super(props);
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

    this.state = {
      speech: ''
    };

    this.startRecording = this.startRecording.bind(this);
    this.stopRecording = this.stopRecording.bind(this);
    this.exportWAV = this.exportWAV.bind(this);
    this.sendWav = this.sendWav.bind(this);
    this.receiveSpeech = this.receiveSpeech.bind(this);
    this.displaySpeech = this.displaySpeech.bind(this);
  }

  componentDidMount() {
    const self = this;
    store.subscribe(() => {
      self.displaySpeech(store.getState().listenerReducer.speech);
    });
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
    const self = this;
    store.dispatch({
      type: 'LISTEN',
      sound: base64
    });
    
    request
    .post('http://localhost:3000/listen')
    .send({ sound: base64 })
    .then(self.receiveSpeech)
    .catch((err) => {
      throw err;
    });
  }

  receiveSpeech(result) {
    store.dispatch({
      type: 'WRITE',
      speech: result.text
    });
  }

  displaySpeech(speech) {
    this.setState({ speech: speech });
  }

  render() {
    return (
      <Paper zDepth={2} className="listener-container">
        <RaisedButton style={{margin: 10}} label="TALK" onMouseDown={ this.startRecording } onMouseUp={ this.stopRecording } />
        <p style={{margin: 10}}>{ this.state.speech }</p>
      </Paper>
    );
  }
}
