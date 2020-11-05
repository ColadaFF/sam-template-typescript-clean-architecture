const { OpenVidu } = require('openvidu-node-client');

const openvidu = new OpenVidu(
  'https://video.qonsai.com/',
  '3648be5b-a4cf-4481-9d0f-373dee9a0f31'
);

openvidu.listRecordings().then(recordingRetrieved => {
  console.log({ recordingRetrieved });
});

openvidu.listRecordings().then(console.log);
