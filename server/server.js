const os = require('os');
const path = require('path');
const fs = require('fs');
const Koa = require('koa');
const cors = require('kcors');
const router = require('koa-router')();
const koaBody = require('koa-body')();
const listen = require('./listen');
const app = new Koa();
const soundFile = path.resolve(__dirname, '../resource/sound.wav');

app.use(cors());

router.post('/listen', koaBody, async (ctx, next) => {
	var transcription = '';
  var soundBase64 = ctx.request.body.sound;
  var soundBuffer = new Buffer(soundBase64, 'base64'); // decode
  fs.writeFileSync(soundFile, soundBuffer);
  await listen(soundFile)
	.then((results) => {
    transcription = results[0].results[0].alternatives[0].transcript;
    console.log(`Transcription: ${transcription}`);
  })
  .catch((err) => {
    console.error('ERROR:', err);
  });

  ctx.body = transcription;
});

app.use(router.routes());

app.listen(3000);