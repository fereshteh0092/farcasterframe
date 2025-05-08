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
    allowedHeaders: ['Content-Type'],
}));

app.use(express.json());

// Base URL for absolute paths
const BASE_URL = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'https://farcasterframe-beta.vercel.app';

// Simple frame route (GET for browser testing, POST for Farcaster)
app.get('/frame', async (req, res) => {
    const html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta property="og:title" content="Simple Farcaster Frame" />
            <meta property="og:image" content="https://i.imgur.com/RRvSVe4.png" />
            <meta name="fc:frame" content="vNext" />
            <meta name="fc:frame:image" content="https://i.imgur.com/RRvSVe4.png" />
            <meta name="fc:frame:button:1" content="Say Hello" />
            <meta name="fc:frame:button:1:action" content="post" />
            <meta name="fc:frame:button:1:target" content="${BASE_URL}/hello" />
            <meta name="fc:frame:post_url" content="${BASE_URL}/frame" />
        </head>
        <body>
            <h1>Simple Farcaster Frame</h1>
            <img src="https://i.imgur.com/RRvSVe4.png" alt="Frame Image" />
        </body>
        </html>
    `;
    res.set({
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-cache',
    });
    res.send(html);
});

app.post('/frame', async (req, res) => {
    const html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta property="og:title" content="Simple Farcaster Frame" />
            <meta property="og:image" content="https://i.imgur.com/RRvSVe4.png" />
            <meta name="fc:frame" content="vNext" />
            <meta name="fc:frame:image" content="https://i.imgur.com/RRvSVe4.png" />
            <meta name="fc:frame:button:1" content="Say Hello" />
            <meta name="fc:frame:button:1:action" content="post" />
            <meta name="fc:frame:button:1:target" content="${BASE_URL}/hello" />
            <meta name="fc:frame:post_url" content="${BASE_URL}/frame" />
        </head>
        <body>
            <h1>Simple Farcaster Frame</h1>
            <img src="https://i.imgur.com/RRvSVe4.png" alt="Frame Image" />
        </body>
        </html>
    `;
    res.set({
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-cache',
    });
    res.send(html);
});

// Hello route (response after clicking the button)
app.post('/hello', async (req, res) => {
    const html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta property="og:title" content="Hello from Farcaster Frame" />
            <meta property="og:image" content="https://i.imgur.com/x8I9JD7.png" />
            <meta name="fc:frame" content="vNext" />
            <meta name="fc:frame:image" content="https://i.imgur.com/x8I9JD7.png" />
            <meta name="fc:frame:button:1" content="Back" />
            <meta name="fc:frame:button:1:action" content="post" />
            <meta name="fc:frame:button:1:target" content="${BASE_URL}/frame" />
        </head>
        <body>
            <h1>Hello from Farcaster Frame</h1>
            <img src="https://i.imgur.com/x8I9JD7.png" alt="Hello Image" />
        </body>
        </html>
    `;
    res.set({
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-cache',
    });
    res.send(html);
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});