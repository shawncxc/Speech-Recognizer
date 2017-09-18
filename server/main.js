// Imports the Google Cloud client library
const Speech = require('@google-cloud/speech');
const fs = require('fs');
const gcloud_auth = require("../config/gcloud_auth.json");

// Your Google Cloud Platform project ID
const projectId = gcloud_auth.project_id;

// Instantiates a client
const speechClient = Speech({
  projectId: projectId
});

var convert = function(fileName) {
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

  // Detects speech in the audio file (Promise)
  return speechClient.recognize(request);
};

module.exports = convert;