import aiService from './aiService.js';

// Bot responses and data
const botResponses = {
    greetings: [
        "Hey there! Ready to have some fun? 😊",
        "Hi! I'm excited to play with you! 🎮",
        "Hello! Let's have an awesome time together! ✨",
        "Welcome! Ready for some games and laughs? 🎲"
    ],
    jokes: [
        "Why don't pirates play cards? Because they're standing on the deck! 😄",
        "What do you call a bear with no teeth? A gummy bear! 🐻",
        "Why don't eggs tell jokes? They'd crack up! 🥚",
        "What do you call a fake noodle? An impasta! 🍝",
        "Why did the scarecrow win an award? Because he was outstanding in his field! 🌾"
    ],
    gameInstructions: {
        numberGuess: "I'm thinking of a number between 1 and 100. Try to guess it! 🎯",
        wordGuess: "I'll think of a word and give you hints. Try to guess it! 📝",
        rps: "Let's play Rock, Paper, Scissors! Type 'rock', 'paper', or 'scissors' to play! ✌️",
        riddle: "I'll give you a riddle. Can you solve it? 🤔",
        trivia: "Let's test your knowledge with some trivia! Ready? 🎓"
    },
    encouragement: [
        "Nice try! Keep going! 💪",
        "You're doing great! 🌟",
        "Almost there! 🎯",
        "That's the spirit! 🔥"
    ]
};

// Game states
let currentGame = null;
let gameState = {};

const games = {
    numberGuess: {
        name: "Number Guessing",
        init: () => {
            gameState.target = Math.floor(Math.random() * 100) + 1;
            gameState.attempts = 0;
            aiService.setGameContext('numberGuess', { target: gameState.target, attempts: 0 });
            return botResponses.gameInstructions.numberGuess;
        },
        play: async (input) => {
            gameState.attempts++;
            const guess = parseInt(input);
            if (isNaN(guess)) return "Please enter a valid number! 🔢";
            
            aiService.setGameContext('numberGuess', { target: gameState.target, attempts: gameState.attempts, lastGuess: guess });
            
            if (guess === gameState.target) {
                const baseResponse = `Congratulations! You got it in ${gameState.attempts} attempts! 🎉`;
                const aiComment = await aiService.generateGameComment('numberGuess', `Player won in ${gameState.attempts} attempts`);
                currentGame = null;
                aiService.clearGameContext();
                return `${baseResponse}\n\n${aiComment}`;
            }

            const baseHint = guess < gameState.target ? "Higher! " : "Lower! ";
            const aiHint = await aiService.generateHint('numberGuess');
            return `${baseHint}${aiHint}`;
        }
    },
    rps: {
        name: "Rock Paper Scissors",
        init: () => {
            aiService.setGameContext('rps', { rounds: 0, playerScore: 0, botScore: 0 });
            return botResponses.gameInstructions.rps;
        },
        play: async (input) => {
            const choices = ['rock', 'paper', 'scissors'];
            const botChoice = choices[Math.floor(Math.random() * 3)];
            const playerChoice = input.toLowerCase();

            if (!choices.includes(playerChoice)) {
                return "Please choose 'rock', 'paper', or 'scissors'! 🎮";
            }

            const gameState = {
                playerChoice,
                botChoice,
                result: playerChoice === botChoice ? 'tie' : 
                        (wins[playerChoice] === botChoice ? 'win' : 'lose')
            };

            aiService.setGameContext('rps', gameState);
            const baseResponse = `I chose ${botChoice}. ${
                gameState.result === 'tie' ? "It's a tie! 🤝" :
                gameState.result === 'win' ? "You win! 🎉" :
                "I win! Better luck next time! 😊"
            }`;

            const aiComment = await aiService.generateGameComment('rps', `Player chose ${playerChoice}, Bot chose ${botChoice}, Result: ${gameState.result}`);
            return `${baseResponse}\n\n${aiComment}`;
        }
    },
    riddle: {
        name: "Riddles",
        init: async () => {
            const riddles = [
                { question: "What has keys, but no locks; space, but no room; and you can enter, but not go in?", answer: "keyboard" },
                { question: "What has cities, but no houses; forests, but no trees; and rivers, but no water?", answer: "map" },
                { question: "What gets wetter and wetter the more it dries?", answer: "towel" }
            ];
            gameState.riddle = riddles[Math.floor(Math.random() * riddles.length)];
            aiService.setGameContext('riddle', { question: gameState.riddle.question, attempts: 0 });
            
            const aiIntro = await aiService.generateGameComment('riddle', 'Starting new riddle');
            return `${botResponses.gameInstructions.riddle}\n\n${aiIntro}\n\n${gameState.riddle.question} 🤔`;
        },
        play: async (input) => {
            gameState.attempts = (gameState.attempts || 0) + 1;
            aiService.setGameContext('riddle', { 
                question: gameState.riddle.question, 
                attempts: gameState.attempts,
                lastGuess: input
            });

            if (input.toLowerCase() === gameState.riddle.answer) {
                const baseResponse = "Correct! You're really good at this! 🎉";
                const aiComment = await aiService.generateGameComment('riddle', `Player solved the riddle in ${gameState.attempts} attempts`);
                currentGame = null;
                aiService.clearGameContext();
                return `${baseResponse}\n\n${aiComment}`;
            }

            const aiHint = await aiService.generateHint('riddle');
            return `Not quite! ${aiHint} 🤔`;
        }
    },
    trivia: {
        name: "Trivia",
        init: async () => {
            const questions = [
                { question: "What planet is known as the Red Planet?", answer: "mars" },
                { question: "What is the largest mammal in the world?", answer: "blue whale" },
                { question: "How many continents are there?", answer: "7" }
            ];
            gameState.trivia = questions[Math.floor(Math.random() * questions.length)];
            aiService.setGameContext('trivia', { question: gameState.trivia.question, attempts: 0 });
            
            const aiIntro = await aiService.generateGameComment('trivia', 'Starting new trivia question');
            return `${botResponses.gameInstructions.trivia}\n\n${aiIntro}\n\n${gameState.trivia.question} 📚`;
        },
        play: async (input) => {
            gameState.attempts = (gameState.attempts || 0) + 1;
            aiService.setGameContext('trivia', {
                question: gameState.trivia.question,
                attempts: gameState.attempts,
                lastGuess: input
            });

            if (input.toLowerCase() === gameState.trivia.answer) {
                const baseResponse = "That's correct! You're so smart! 🎉";
                const aiComment = await aiService.generateGameComment('trivia', `Player answered correctly in ${gameState.attempts} attempts`);
                currentGame = null;
                aiService.clearGameContext();
                return `${baseResponse}\n\n${aiComment}`;
            }

            const aiHint = await aiService.generateHint('trivia');
            return `Not quite right! ${aiHint} 🤔`;
        }
    }
};

// Chat functionality
const chatContainer = document.getElementById('chatContainer');
const chatForm = document.getElementById('chatForm');
const userInput = document.getElementById('userInput');

// Add message to chat
function addMessage(content, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `flex items-start mb-4 message-animation ${isUser ? 'justify-end' : ''}`;

    const iconDiv = document.createElement('div');
    iconDiv.className = 'flex-shrink-0';
    
    const avatar = document.createElement('div');
    avatar.className = `w-8 h-8 rounded-full ${isUser ? 'bg-blue-500' : 'bg-purple-600'} flex items-center justify-center`;
    
    const icon = document.createElement('i');
    icon.className = isUser ? 'fas fa-user' : 'fas fa-robot';
    
    avatar.appendChild(icon);
    iconDiv.appendChild(avatar);

    const textDiv = document.createElement('div');
    textDiv.className = `${isUser ? 'mr-3' : 'ml-3'} bg-gray-700 rounded-lg p-3 max-w-[80%]`;
    textDiv.innerHTML = content;

    if (isUser) {
        messageDiv.appendChild(textDiv);
        messageDiv.appendChild(iconDiv);
    } else {
        messageDiv.appendChild(iconDiv);
        messageDiv.appendChild(textDiv);
    }

    chatContainer.appendChild(messageDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Show typing indicator
function showTypingIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'typing-indicator message-animation ml-11 mb-4';
    indicator.innerHTML = '<span></span><span></span><span></span>';
    chatContainer.appendChild(indicator);
    chatContainer.scrollTop = chatContainer.scrollHeight;
    return indicator;
}

// Process user input
async function processUserInput(input) {
    const lowercaseInput = input.toLowerCase();

    // If we're in a game, process game input
    if (currentGame) {
        return await games[currentGame].play(input);
    }

    // Check for game commands
    if (lowercaseInput.includes('play')) {
        if (lowercaseInput.includes('number')) {
            currentGame = 'numberGuess';
            return games.numberGuess.init();
        } else if (lowercaseInput.includes('rock') || lowercaseInput.includes('rps')) {
            currentGame = 'rps';
            return games.rps.init();
        } else if (lowercaseInput.includes('riddle')) {
            currentGame = 'riddle';
            return await games.riddle.init();
        } else if (lowercaseInput.includes('trivia')) {
            currentGame = 'trivia';
            return await games.trivia.init();
        } else {
            return "I know these games:\n" +
                   "1. Number Guessing 🎯\n" +
                   "2. Rock Paper Scissors ✌️\n" +
                   "3. Riddles 🤔\n" +
                   "4. Trivia 📚\n\n" +
                   "Which one would you like to play?";
        }
    }

    // Check for joke request
    if (lowercaseInput.includes('joke')) {
        return botResponses.jokes[Math.floor(Math.random() * botResponses.jokes.length)];
    }

    // Check for greetings
    if (lowercaseInput.includes('hi') || lowercaseInput.includes('hello') || lowercaseInput.includes('hey')) {
        return botResponses.greetings[Math.floor(Math.random() * botResponses.greetings.length)];
    }

    // For all other inputs, use AI to generate a response
    return await aiService.generateChatResponse(input);
}

// Handle quick action buttons
function sendQuickAction(category) {
    const categoryMap = {
        'games': "Let's play a game! 🎮",
        'joke': "Tell me a joke! 😄",
        'riddle': "Give me a riddle! 🤔",
        'trivia': "Let's play trivia! 📚"
    };

    const userMessage = categoryMap[category];
    addMessage(userMessage, true);
    
    const indicator = showTypingIndicator();
    
    setTimeout(() => {
        indicator.remove();
        let response = '';
        
        if (category === 'games') {
            response = "I know these games:\n" +
                      "1. Number Guessing 🎯\n" +
                      "2. Rock Paper Scissors ✌️\n" +
                      "3. Riddles 🤔\n" +
                      "4. Trivia 📚\n\n" +
                      "Which one would you like to play?";
        } else if (category === 'joke') {
            response = botResponses.jokes[Math.floor(Math.random() * botResponses.jokes.length)];
        } else if (category === 'riddle') {
            currentGame = 'riddle';
            response = games.riddle.init();
        } else if (category === 'trivia') {
            currentGame = 'trivia';
            response = games.trivia.init();
        }
        
        addMessage(response);
    }, 1000);
}

// Handle form submission
chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const message = userInput.value.trim();
    
    if (message) {
        addMessage(message, true);
        userInput.value = '';
        
        const indicator = showTypingIndicator();
        
        try {
            const response = await processUserInput(message);
            indicator.remove();
            addMessage(response);
        } catch (error) {
            console.error('Error processing input:', error);
            indicator.remove();
            addMessage("Oops! Something went wrong. Let's try again! 🎮");
        }
    }
});
