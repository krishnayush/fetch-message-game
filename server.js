const express = require('express');
const cors = require('cors');
const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config(); // Load environment variables

const app = express();
const port = process.env.PORT || 3000;

// Telegram Bot setup
const botToken = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(botToken);

// Set the webhook URL for your bot
const webhookUrl = `${process.env.BACKEND_URL}/telegram-webhook`; 
bot.setWebHook(webhookUrl);

// Set up CORS
app.use(cors({
    origin: 'https://frontend-0bp1.onrender.com' // Replace with your frontend URL
}));

// Root endpoint for basic check
app.get('/', (req, res) => {
    res.send('Backend is running!');
});

// API endpoint to return a message
app.get('/api/message', (req, res) => {
    res.json({ message: 'Hello from the Backend!' });
});

// Handle '/start' command in the Telegram bot
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

// Handle button press event
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id;

    if (query.data === 'start_game') {
        bot.sendMessage(chatId, 'Game Started! Let\'s play!');
        bot.sendMessage(chatId, 'Click below to play the game inside Telegram:', {
            reply_markup: {
                inline_keyboard: [
                    [{
                        text: "Play Game",
                        web_app: { url: "https://fetch-message-game.onrender.com" } // Replace with your game URL
                    }]
                ]
            }
        });
    }
});

// Handle webhook updates from Telegram
app.post('/telegram-webhook', (req, res) => {
    bot.processUpdate(req.body);
    res.sendStatus(200); // Acknowledge Telegram
});

// Start the Express server
app.listen(port, () => {
    console.log(`Backend is running at http://localhost:${port}`);
});
