const express = require('express');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Store user links temporarily (in production, use a database)
let userLinks = {};

// Initial frame
app.post('/frame', async (req, res) => {
    const frame = {
        version: 'vNext',
        image: 'https://i.imgur.com/RRvSVe4.png', // purple-frame.png
        buttons: [
            { label: 'Mint NFT', action: 'post', target: '/mint' },
            { label: 'Add Your Link', action: 'post', target: '/add-link' },
        ],
        post_url: '/frame',
    };
    res.json(frame);
});

// Mint action
app.post('/mint', async (req, res) => {
    const userId = req.body.untrustedData?.fid || 'unknown';
    const userLink = userLinks[userId] || 'https://default-mint-url.com';

    const frame = {
        version: 'vNext',
        image: 'https://i.imgur.com/x8I9JD7.png', // connect-wallet.png
        buttons: [
            { label: 'Connect Wallet', action: 'link', target: userLink },
            { label: 'Back', action: 'post', target: '/frame' },
        ],
    };
    res.json(frame);
});

// Add Your Link action
app.post('/add-link', async (req, res) => {
    const frame = {
        version: 'vNext',
        image: 'https://i.imgur.com/zabL7UK.png', // add-link.png
        buttons: [
            { label: 'Submit Link', action: 'post', target: '/submit-link' },
            { label: 'Back', action: 'post', target: '/frame' },
        ],
        input: { text: 'Enter your Magic Eden or mint link' },
    };
    res.json(frame);
});

// Submit link and create new frame
app.post('/submit-link', async (req, res) => {
    const userId = req.body.untrustedData?.fid || 'unknown';
    const submittedLink = req.body.untrustedData?.inputText || 'https://default-mint-url.com';
    userLinks[userId] = submittedLink;

    const frame = {
        version: 'vNext',
        image: 'https://i.imgur.com/Hdhh6Qu.png', // new-frame.png
        buttons: [
            { label: 'Cast Frame', action: 'post', target: '/cast' },
            { label: 'Tweet Link', action: 'link', target: `https://x.com/intent/tweet?text=Check%20out%20my%20NFT!%20${encodeURIComponent(submittedLink)}` },
        ],
    };
    res.json(frame);
});

// Cast frame
app.post('/cast', async (req, res) => {
    const frame = {
        version: 'vNext',
        image: 'https://i.imgur.com/FOtVnSJ.png', // success.png
        buttons: [
            { label: 'Back to Start', action: 'post', target: '/frame' },
        ],
    };
    res.json(frame);
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});