const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'],
}));

app.use(express.json({ type: '*/*' }));

let userLinks = {};
const BASE_URL = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'https://farcasterframe-beta.vercel.app'; // Replace with your deployed URL

const renderFrame = (metaTags) => `
  <html>
    <head>
      ${metaTags.join('\n')}
    </head>
    <body></body>
  </html>
`;

// GET /frame
app.get('/frame', (req, res) => {
  res.set('Content-Type', 'text/html');
  res.send(renderFrame([
    `<meta property="fc:frame" content="vNext" />`,
    `<meta property="fc:frame:image" content="https://i.imgur.com/RRvSVe4.png" />`,
    `<meta property="fc:frame:button:1" content="Mint NFT" />`,
    `<meta property="fc:frame:button:1:action" content="post" />`,
    `<meta property="fc:frame:button:1:target" content="${BASE_URL}/mint" />`,
    `<meta property="fc:frame:button:2" content="Add Your Link" />`,
    `<meta property="fc:frame:button:2:action" content="post" />`,
    `<meta property="fc:frame:button:2:target" content="${BASE_URL}/add-link" />`,
    `<meta property="fc:frame:post_url" content="${BASE_URL}/frame" />`
  ]));
});

// POST /frame (same view to keep the UI consistent)
app.post('/frame', (req, res) => {
  res.set('Content-Type', 'text/html');
  res.send(renderFrame([
    `<meta property="fc:frame" content="vNext" />`,
    `<meta property="fc:frame:image" content="https://i.imgur.com/RRvSVe4.png" />`,
    `<meta property="fc:frame:button:1" content="Mint NFT" />`,
    `<meta property="fc:frame:button:1:action" content="post" />`,
    `<meta property="fc:frame:button:1:target" content="${BASE_URL}/mint" />`,
    `<meta property="fc:frame:button:2" content="Add Your Link" />`,
    `<meta property="fc:frame:button:2:action" content="post" />`,
    `<meta property="fc:frame:button:2:target" content="${BASE_URL}/add-link" />`,
    `<meta property="fc:frame:post_url" content="${BASE_URL}/frame" />`
  ]));
});

// POST /mint
app.post('/mint', (req, res) => {
  const userId = req.body.untrustedData?.fid || 'unknown';
  const userLink = userLinks[userId] || 'https://default-mint-url.com';

  res.set('Content-Type', 'text/html');
  res.send(renderFrame([
    `<meta property="fc:frame" content="vNext" />`,
    `<meta property="fc:frame:image" content="https://i.imgur.com/x8I9JD7.png" />`,
    `<meta property="fc:frame:button:1" content="Connect Wallet" />`,
    `<meta property="fc:frame:button:1:action" content="link" />`,
    `<meta property="fc:frame:button:1:target" content="${userLink}" />`,
    `<meta property="fc:frame:button:2" content="Back" />`,
    `<meta property="fc:frame:button:2:action" content="post" />`,
    `<meta property="fc:frame:button:2:target" content="${BASE_URL}/frame" />`
  ]));
});

// POST /add-link
app.post('/add-link', (req, res) => {
  res.set('Content-Type', 'text/html');
  res.send(renderFrame([
    `<meta property="fc:frame" content="vNext" />`,
    `<meta property="fc:frame:image" content="https://i.imgur.com/zabL7UK.png" />`,
    `<meta property="fc:frame:input:text" content="Enter your Magic Eden or mint link" />`,
    `<meta property="fc:frame:button:1" content="Submit Link" />`,
    `<meta property="fc:frame:button:1:action" content="post" />`,
    `<meta property="fc:frame:button:1:target" content="${BASE_URL}/submit-link" />`,
    `<meta property="fc:frame:button:2" content="Back" />`,
    `<meta property="fc:frame:button:2:action" content="post" />`,
    `<meta property="fc:frame:button:2:target" content="${BASE_URL}/frame" />`
  ]));
});

// POST /submit-link
app.post('/submit-link', (req, res) => {
  const userId = req.body.untrustedData?.fid || 'unknown';
  const submittedLink = req.body.untrustedData?.inputText || 'https://default-mint-url.com';
  userLinks[userId] = submittedLink;

  res.set('Content-Type', 'text/html');
  res.send(renderFrame([
    `<meta property="fc:frame" content="vNext" />`,
    `<meta property="fc:frame:image" content="https://i.imgur.com/Hdhh6Qu.png" />`,
    `<meta property="fc:frame:button:1" content="Cast Frame" />`,
    `<meta property="fc:frame:button:1:action" content="post" />`,
    `<meta property="fc:frame:button:1:target" content="${BASE_URL}/cast" />`,
    `<meta property="fc:frame:button:2" content="Tweet Link" />`,
    `<meta property="fc:frame:button:2:action" content="link" />`,
    `<meta property="fc:frame:button:2:target" content="https://x.com/intent/tweet?text=Check%20out%20my%20NFT!%20${encodeURIComponent(submittedLink)}" />`
  ]));
});

// POST /cast
app.post('/cast', (req, res) => {
  res.set('Content-Type', 'text/html');
  res.send(renderFrame([
    `<meta property="fc:frame" content="vNext" />`,
    `<meta property="fc:frame:image" content="https://i.imgur.com/FOtVnSJ.png" />`,
    `<meta property="fc:frame:button:1" content="Back to Start" />`,
    `<meta property="fc:frame:button:1:action" content="post" />`,
    `<meta property="fc:frame:button:1:target" content="${BASE_URL}/frame" />`
  ]));
});

app.listen(port, () => {
  console.log(`✅ Server running on port ${port}`);
});
