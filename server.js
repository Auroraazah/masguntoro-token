require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { RtcTokenBuilder, RtcRole } = require('agora-token');

const app = express();
app.use(cors());

const APP_ID = process.env.APP_ID || "cf22b9c1495d4cc89b36a9a81f9cfa16";
const APP_CERTIFICATE = process.env.APP_CERTIFICATE;

app.get('/', (req,res)=> res.send('Masguntoro Token Server Jalan'));

app.get('/token', (req, res) => {
  const channel = req.query.channel;
  if (!channel) return res.status(400).json({error: "channel wajib isi. contoh: /token?channel=test"});

  if (!APP_CERTIFICATE) return res.status(500).json({error: "APP_CERTIFICATE belum di set"});

  const uid = req.query.uid || 0;
  const role = RtcRole.PUBLISHER;
  const expire = 3600;
  const now = Math.floor(Date.now() / 1000);
  
  const token = RtcTokenBuilder.buildTokenWithUid(APP_ID, APP_CERTIFICATE, channel, uid, role, now + expire);
  res.json({ token, appId: APP_ID, channel, uid });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('jalan di '+PORT));
