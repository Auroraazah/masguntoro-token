const express = require('express');
const { RtcTokenBuilder, RtcRole } = require('agora-access-token');
const app = express();
const cors = require('cors');
app.use(cors());

app.get('/', (req, res) => {
  res.send('MasGuntoro Token Server OK');
});

app.get('/rtc', (req, res) => {
  const channelName = req.query.channelName;
  const uid = req.query.uid || 0;
  if (!channelName) {
    return res.status(400).json({ error: 'channelName required' });
  }
  const appId = process.env.APP_ID;
  const appCertificate = process.env.APP_CERT;
  const role = RtcRole.PUBLISHER;
  const expirationTimeInSeconds = 3600;
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;
  const token = RtcTokenBuilder.buildTokenWithUid(appId, appCertificate, channelName, uid, role, privilegeExpiredTs);
  res.json({ rtcToken: token });
});

module.exports = app;
