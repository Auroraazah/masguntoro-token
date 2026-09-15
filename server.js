const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const { RtcTokenBuilder, RtcRole } = require('agora-token');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

const APP_ID = process.env.APP_ID;
const APP_CERT = process.env.APP_CERTIFICATE || process.env.APP_CERT;

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/api/rtc-token', (req, res) => {
  const channel = req.body.channelName || req.body.channel;
  if (!channel) return res.status(400).json({error: 'channelName required'});
  const uid = req.body.uid || 0;
  const role = RtcRole.PUBLISHER;
  const expire = 3600;
  const now = Math.floor(Date.now()/1000);
  const token = RtcTokenBuilder.buildTokenWithUid(APP_ID, APP_CERT, channel, uid, role, now + expire);
  res.json({ token });
});

app.get('/api/rtc-token', (req, res) => {
  const channel = req.query.channelName || req.query.channel;
  if (!channel) return res.status(400).json({error: 'channelName required'});
  const uid = req.query.uid || 0;
  const role = RtcRole.PUBLISHER;
  const expire = 3600;
  const now = Math.floor(Date.now()/1000);
  const token = RtcTokenBuilder.buildTokenWithUid(APP_ID, APP_CERT, channel, uid, role, now + expire);
  res.json({ token });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log('OK'));
module.exports = app;
