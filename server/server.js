const os = require('os');
const path = require('path');
const fs = require('fs');
const Koa = require('koa');
const cors = require('kcors');
const router = require('koa-router')();
const koaBody = require('koa-body')();
const convert = require('./main.js');
const app = new Koa();
const soundFile = path.resolve(__dirname, '../resource/sound.wav');

app.use(cors());

router.post('/listen', koaBody,
  (ctx) => {
    var soundBase64 = ctx.request.body.sound;
    var soundBuffer = new Buffer(soundBase64, 'base64'); // decode
    fs.writeFileSync(soundFile, soundBuffer);
    convert(soundFile)
  	.then((results) => {
	    const transcription = results[0].results[0].alternatives[0].transcript;
	    console.log(`Transcription: ${transcription}`);
	  })
	  .catch((err) => {
	    console.error('ERROR:', err);
	  });

    // => POST body
  	ctx.body = JSON.stringify(ctx.request.body);
  }
);

app.use(router.routes());

app.listen(3000);