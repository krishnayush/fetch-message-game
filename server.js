const express = require('express');
const cors = require('cors');
const TelegramBot = require('node-telegram-bot-api');
const app = express();
const port = 3000;

// Telegram Bot setup
const botToken = '7368742607:AAGb-ft5DH5ynvnZnvh20DYKFzv9IKKFbFs'; // Replace with your Telegram Bot token from BotFather
const bot = new TelegramBot(botToken, { polling: true });

// Set up CORS
app.use(cors());

// API endpoint to return a message (for your existing backend)
app.get('/api/message', (req, res) => {
    res.json({ message: 'Hello from the Backend!' });
});

// Handle '/start' command in the Telegram bot
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;

    const options = {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: "Start Game", callback_data: "start_game" }  // Start button
                ]
            ]
        }
    };

    // Send a message with a Start button
    bot.sendMessage(chatId, 'Welcome to the Game! Click the button below to start:', options);
});

// Handle button press event
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id;

    // Check if the button clicked is "Start Game"
    if (query.data === 'start_game') {
        // Send a message with a URL button to open the game inside Telegram
        bot.sendMessage(chatId, 'Game Started! Let\'s play!');

        // Add a URL button that opens your game directly inside Telegram
        bot.sendMessage(chatId, 'Click below to play the game inside Telegram:',
            {
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: "Play Game", 
                                web_app: { 
                                    url: "https://fetch-message-game.onrender.com" // Replace with your actual game URL
                                }
                            }
                        ]
                    ]
                }
            });
    }
});

// Start the Express server
app.listen(port, () => {
    console.log(`Backend is running at http://localhost:${port}`);
});
