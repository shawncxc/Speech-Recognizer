// Imports the Google Cloud client library
const Speech = require('@google-cloud/speech');
const fs = require('fs');
const gcloud_auth = require("./gcloud_auth.json");

// Your Google Cloud Platform project ID
const projectId = gcloud_auth.project_id;

// Instantiates a client
const speechClient = Speech({
  projectId: projectId
});

// The name of the audio file to transcribe
const fileName = __dirname + '/resource/me.wav';

// Reads a local audio file and converts it to base64
const file = fs.readFileSync(fileName);
const audioBytes = file.toString('base64');

// The audio file's encoding, sample rate in hertz, and BCP-47 language code
const audio = {
  content: audioBytes
};
const config = {
  encoding: 'LINEAR16',
  sampleRateHertz: 44100,
  languageCode: 'en-US'
};
const request = {
  audio: audio,
  config: config
};

// Detects speech in the audio file
speechClient.recognize(request)
  .then((results) => {
    const transcription = results[0].results[0].alternatives[0].transcript;
    console.log(`Transcription: ${transcription}`);
  })
  .catch((err) => {
    console.error('ERROR:', err);
  });