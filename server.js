const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios'); // Import axios
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: [
        'https://frontend-0bp1.onrender.com',
        'https://t.me'
    ]
}));
app.use(bodyParser.json()); // Parse JSON body from incoming requests

// Telegram Bot setup
const botToken = process.env.TELEGRAM_BOT_TOKEN;
if (!botToken) {
    console.error("Error: TELEGRAM_BOT_TOKEN is not set in .env");
    process.exit(1);
}

const bot = new TelegramBot(botToken, { polling: false }); // Disable polling for webhook setup

// Set webhook
const webhookUrl = `${process.env.HOST_URL}/telegram-webhook`; // Use Render's HOST_URL from environment variables
bot.setWebHook(webhookUrl).then(() => {
    console.log(`Webhook set to ${webhookUrl}`);
}).catch(err => {
    console.error("Failed to set webhook:", err);
});

// Static headers for iframe compatibility
app.use((req, res, next) => {
    res.setHeader('X-Frame-Options', 'ALLOWALL');
    res.setHeader('Content-Security-Policy', 'frame-ancestors *');
    next();
});

// Root endpoint for basic check
app.get('/', (req, res) => {
    console.log("Root endpoint hit");
    res.send('Backend is running!');
});

// API endpoint to return a message
app.get('/api/message', (req, res) => {
    console.log('Received request at /api/message');
    res.json({ message: 'Hello from the Backend!' });
});

// API endpoint to make a request to your server
app.get('/api/fetch-data', (req, res) => {
    console.log('Making a request to the server...');
    
    // Make a request to your deployed server using axios
    axios.get('https://your-server-url.com/api/endpoint')
        .then(response => {
            console.log('Server response:', response.data);
            res.json(response.data); // Send server data to the client
        })
        .catch(error => {
            console.error('Error fetching data from server:', error);
            res.status(500).json({ message: 'Error fetching data from the server' });
        });
});

// Telegram Bot Handlers
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const options = {
        reply_markup: {
            inline_keyboard: [
                [{ text: "Start Game", callback_data: "start_game" }]
            ]
        }
    };
    bot.sendMessage(chatId, 'Welcome to the Game! Click the button below to start:', options);
});

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id;

    if (query.data === 'start_game') {
        bot.sendMessage(chatId, 'Game Started! Let\'s play!');
        bot.sendMessage(chatId, 'hi ayush :', {
            reply_markup: {
                inline_keyboard: [
                    [{
                        text: "Play Game",
                        web_app: { url: "https://frontend-0bp1.onrender.com" } // Frontend URL
                    }]
                ]
            }
        });
    }
});

// Webhook endpoint
app.post('/telegram-webhook', (req, res) => {
    try {
        bot.processUpdate(req.body);
        res.sendStatus(200); // Acknowledge Telegram
    } catch (error) {
        console.error("Error processing webhook:", error);
        res.sendStatus(500);
    }
});

// Start server on the correct port
app.listen(process.env.PORT || 3000, () => {
    console.log(`Backend is running at http://localhost:${process.env.PORT || 3000}`);
});
