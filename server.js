const express = require('express');
const cors = require('cors');
const { RtcTokenBuilder, RtcRole } = require('agora-access-token');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('MasGuntoro Token Server OK');
});

app.get('/rtc', (req, res) => {
  try {
    const channelName = req.query.channelName;
    if (!channelName) return res.status(400).json({ error: 'channelName required' });
    
    const uid = req.query.uid ? parseInt(req.query.uid) : 0;
    const appId = process.env.APP_ID;
    const appCertificate = process.env.APP_CERT;

    if (!appId || !appCertificate) {
      return res.status(500).json({ error: 'APP_ID / APP_CERT belum di set di Vercel Settings -> Environment Variables' });
    }

    const role = RtcRole.PUBLISHER;
    const expire = Math.floor(Date.now() / 1000) + 3600;
    const token = RtcTokenBuilder.buildTokenWithUid(appId, appCertificate, channelName, uid, role, expire);
    
    res.json({ rtcToken: token, uid: uid });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = app;
