const TelegramApi = require('node-telegram-bot-api');
const {gameOptions, againOptions} = require('./options')

const token = '5569018346:AAFKmUvxXk9uhJxZNEHurQpEIMAi3S6Xr70';

const bot = new TelegramApi(token, {polling: true});

const chats = {};

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, 'Сейчас я загадаю цифру от 0 до 9. Ты должен ее отгадать');
    const randomNumber = Math.floor(Math.random() * 10);
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'Отгадывай', gameOptions)
}

const start = () => {
    bot.setMyCommands([
        {command: '/start', description: 'Начальное приветсвие'},
        {command: '/info', description: 'Информация о пользователе'},
        {command: '/game', description: 'Игра угадай цифру'},
    ])

    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;
        if(text === '/start') {
            await bot.sendSticker(chatId,
                'https://tlgrm.ru/_/stickers/ff6/4b6/ff64b611-aa7c-3603-b73c-7cd86d4b71dc/192/16.webp')
            return bot.sendMessage(chatId,
                `Привет ${msg.from.first_name}, Добро пожаловать в наш Чат Гамбург и окрестности 🏙️! 
                Здесь мы общаемся, знакомимся ищем друзей и собираем встречи для людей из Гамбурга и близлежащих 
                населенных пунктов🌞🎉🥳🌄Все встречи проводятся на индивидуальном энтузиазме и инициативе 
                участников чата. Ты теперь тоже участник нашего сообщества🦸и мы будем рады твоим идеям💡. 
                Будет здорово если ты расскажешь немного о себе🤗. Это даст возможность легко начать знакомство. 
                Откуда ты? Какие у тебя увлечения?.`
            );
        }
        if(text === '/info') {
            return  bot.sendMessage(chatId, `${msg.from.first_name}`);
        }
        if(text === '/game') {
            return startGame(chatId);
        }
        return bot.sendMessage(chatId, 'Я тебя не понимаю')
    })
    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if(data === '/again') {
            return  startGame(chatId);
        }
        if(data === chats[chatId]) {
            return await bot.sendMessage(chatId, `Поздравляю, ты отгадал цифру ${chats[chatId]}`, againOptions);
        } else {
            return await bot.sendMessage(chatId, `Неправильно, бот загадал цифру ${chats[chatId]}`, againOptions);
        }
    })
}
start()