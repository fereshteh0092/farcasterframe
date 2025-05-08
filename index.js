const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

// Enable CORS for Farcaster clients
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST'],
}));

app.use(express.json());

let userLinks = {};
const BASE_URL = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'https://farcasterframe-beta.vercel.app'; // Use your Vercel URL

// Add GET route for testing in browser
app.get('/frame', async (req, res) => {
    const frame = {
        "fc:frame": "vNext",
        "fc:frame:image": "https://i.imgur.com/RRvSVe4.png",
        "fc:frame:button:1": "Mint NFT",
        "fc:frame:button:1:action": "post",
        "fc:frame:button:1:target": `${BASE_URL}/mint`,
        "fc:frame:button:2": "Add Your Link",
        "fc:frame:button:2:action": "post",
        "fc:frame:button:2:target": `${BASE_URL}/add-link`,
        "fc:frame:post_url": `${BASE_URL}/frame`,
    };
    res.json(frame);
});

app.post('/frame', async (req, res) => {
    const frame = {
        "fc:frame": "vNext",
        "fc:frame:image": "https://i.imgur.com/RRvSVe4.png",
        "fc:frame:button:1": "Mint NFT",
        "fc:frame:button:1:action": "post",
        "fc:frame:button:1:target": `${BASE_URL}/mint`,
        "fc:frame:button:2": "Add Your Link",
        "fc:frame:button:2:action": "post",
        "fc:frame:button:2:target": `${BASE_URL}/add-link`,
        "fc:frame:post_url": `${BASE_URL}/frame`,
    };
    res.json(frame);
});

app.post('/mint', async (req, res) => {
    const userId = req.body.untrustedData?.fid || 'unknown';
    const userLink = userLinks[userId] || 'https://default-mint-url.com';

    const frame = {
        "fc:frame": "vNext",
        "fc:frame:image": "https://i.imgur.com/x8I9JD7.png",
        "fc:frame:button:1": "Connect Wallet",
        "fc:frame:button:1:action": "link",
        "fc:frame:button:1:target": userLink,
        "fc:frame:button:2": "Back",
        "fc:frame:button:2:action": "post",
        "fc:frame:button:2:target": `${BASE_URL}/frame`,
    };
    res.json(frame);
});

app.post('/add-link', async (req, res) => {
    const frame = {
        "fc:frame": "vNext",
        "fc:frame:image": "https://i.imgur.com/zabL7UK.png",
        "fc:frame:input:text": "Enter your Magic Eden or mint link",
        "fc:frame:button:1": "Submit Link",
        "fc:frame:button:1:action": "post",
        "fc:frame:button:1:target": `${BASE_URL}/submit-link`,
        "fc:frame:button:2": "Back",
        "fc:frame:button:2:action": "post",
        "fc:frame:button:2:target": `${BASE_URL}/frame`,
    };
    res.json(frame);
});

app.post('/submit-link', async (req, res) => {
    const userId = req.body.untrustedData?.fid || 'unknown';
    const submittedLink = req.body.untrustedData?.inputText || 'https://default-mint-url.com';
    userLinks[userId] = submittedLink;

    const frame = {
        "fc:frame": "vNext",
        "fc:frame:image": "https://i.imgur.com/Hdhh6Qu.png",
        "fc:frame:button:1": "Cast Frame",
        "fc:frame:button:1:action": "post",
        "fc:frame:button:1:target": `${BASE_URL}/cast`,
        "fc:frame:button:2": "Tweet Link",
        "fc:frame:button:2:action": "link",
        "fc:frame:button:2:target": `https://x.com/intent/tweet?text=Check%20out%20my%20NFT!%20${encodeURIComponent(submittedLink)}`,
    };
    res.json(frame);
});

app.post('/cast', async (req, res) => {
    const frame = {
        "fc:frame": "vNext",
        "fc:frame:image": "https://i.imgur.com/FOtVnSJ.png",
        "fc:frame:button:1": "Back to Start",
        "fc:frame:button:1:action": "post",
        "fc:frame:button:1:target": `${BASE_URL}/frame`,
    };
    res.json(frame);
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});