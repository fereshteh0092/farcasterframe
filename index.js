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

// Base URL for absolute paths
const BASE_URL = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'https://farcasterframe-beta.vercel.app';

// Store user links temporarily
let userLinks = {};

// Helper function to generate HTML with Open Graph meta tags for Farcaster Frames
const generateFrameHTML = (image, buttons, postUrl, input = null) => {
    let buttonMetaTags = '';
    buttons.forEach((button, index) => {
        const buttonIndex = index + 1;
        buttonMetaTags += `
            <meta property="fc:frame:button:${buttonIndex}" content="${button.label}" />
            <meta property="fc:frame:button:${buttonIndex}:action" content="${button.action}" />
            ${button.target ? `<meta property="fc:frame:button:${buttonIndex}:target" content="${button.target}" />` : ''}
        `;
    });

    const inputMetaTag = input ? `<meta property="fc:frame:input:text" content="${input}" />` : '';

    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta property="og:title" content="Farcaster Frame" />
            <meta property="og:image" content="${image}" />
            <meta property="fc:frame" content="vNext" />
            <meta property="fc:frame:image" content="${image}" />
            ${inputMetaTag}
            ${buttonMetaTags}
            ${postUrl ? `<meta property="fc:frame:post_url" content="${postUrl}" />` : ''}
        </head>
        <body>
            <h1>Farcaster Frame</h1>
            <img src="${image}" alt="Frame Image" />
        </body>
        </html>
    `;
};

// Initial frame (GET for browser testing, POST for Farcaster)
app.get('/frame', async (req, res) => {
    const html = generateFrameHTML(
        'https://i.imgur.com/RRvSVe4.png',
        [
            { label: 'Mint NFT', action: 'post', target: `${BASE_URL}/mint` },
            { label: 'Add Your Link', action: 'post', target: `${BASE_URL}/add-link` },
        ],
        `${BASE_URL}/frame`
    );
    res.set('Content-Type', 'text/html');
    res.send(html);
});

app.post('/frame', async (req, res) => {
    const html = generateFrameHTML(
        'https://i.imgur.com/RRvSVe4.png',
        [
            { label: 'Mint NFT', action: 'post', target: `${BASE_URL}/mint` },
            { label: 'Add Your Link', action: 'post', target: `${BASE_URL}/add-link` },
        ],
        `${BASE_URL}/frame`
    );
    res.set('Content-Type', 'text/html');
    res.send(html);
});

// Mint action
app.post('/mint', async (req, res) => {
    const userId = req.body.untrustedData?.fid || 'unknown';
    const userLink = userLinks[userId] || 'https://default-mint-url.com';

    const html = generateFrameHTML(
        'https://i.imgur.com/x8I9JD7.png',
        [
            { label: 'Connect Wallet', action: 'link', target: userLink },
            { label: 'Back', action: 'post', target: `${BASE_URL}/frame` },
        ]
    );
    res.set('Content-Type', 'text/html');
    res.send(html);
});

// Add Your Link action
app.post('/add-link', async (req, res) => {
    const html = generateFrameHTML(
        'https://i.imgur.com/zabL7UK.png',
        [
            { label: 'Submit Link', action: 'post', target: `${BASE_URL}/submit-link` },
            { label: 'Back', action: 'post', target: `${BASE_URL}/frame` },
        ],
        null,
        'Enter your Magic Eden or mint link'
    );
    res.set('Content-Type', 'text/html');
    res.send(html);
});

// Submit link and create new frame
app.post('/submit-link', async (req, res) => {
    const userId = req.body.untrustedData?.fid || 'unknown';
    const submittedLink = req.body.untrustedData?.inputText || 'https://default-mint-url.com';
    userLinks[userId] = submittedLink;

    const html = generateFrameHTML(
        'https://i.imgur.com/Hdhh6Qu.png',
        [
            { label: 'Cast Frame', action: 'post', target: `${BASE_URL}/cast` },
            { label: 'Tweet Link', action: 'link', target: `https://x.com/intent/tweet?text=Check%20out%20my%20NFT!%20${encodeURIComponent(submittedLink)}` },
        ]
    );
    res.set('Content-Type', 'text/html');
    res.send(html);
});

// Cast frame
app.post('/cast', async (req, res) => {
    const html = generateFrameHTML(
        'https://i.imgur.com/FOtVnSJ.png',
        [
            { label: 'Back to Start', action: 'post', target: `${BASE_URL}/frame` },
        ]
    );
    res.set('Content-Type', 'text/html');
    res.send(html);
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});