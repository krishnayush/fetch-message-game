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
        // You can trigger your backend game logic here or any other functionality
        bot.sendMessage(chatId, 'Game Started! Let\'s play!');
        // Example: Send a message about the game status
        // Here you can connect to your backend and fetch game status
        // Example: Send a URL to open the game within the bot (or a custom message)
        bot.sendMessage(chatId, 'This is where the game would open or the interaction starts.');
    }
});

// Start the Express server
app.listen(port, () => {
    console.log(`Backend is running at http://localhost:${port}`);
});
