# AI-Powered Gaming Chatbot

An interactive gaming chatbot that combines classic games with AI-powered conversations for a more engaging and dynamic experience.

## Features

- 🎮 Interactive Games:
  - Number Guessing
  - Rock Paper Scissors
  - Riddles
  - Trivia

- 🤖 AI-Powered Features:
  - Natural conversations
  - Dynamic game commentary
  - Contextual hints
  - Adaptive responses
  - Personality and humor

- 💫 Modern UI:
  - Clean, responsive design
  - Smooth animations
  - Real-time interactions
  - Mobile-friendly interface

## Setup

1. Clone the repository
2. Get an OpenAI API key from [OpenAI's platform](https://platform.openai.com)
3. Update `config.js` with your API key:
   ```javascript
   OPENAI_API_KEY: 'your-api-key-here'
   ```
4. Serve the files using a local server (due to ES6 modules):
   ```bash
   # Using Python
   python -m http.server 8000

   # Using Node.js
   npx http-server
   ```
5. Open `http://localhost:8000` in your browser

## Usage

- Type "play" to see available games
- Click the quick action buttons for instant access
- Chat naturally with the AI
- Ask for jokes or fun facts
- Get hints during games

## Technical Details

- Built with vanilla JavaScript
- Uses OpenAI's GPT-3.5 API for conversations
- Tailwind CSS for styling
- ES6 Modules for code organization
- Async/await for API handling

## Security Note

Never expose your API key in the frontend. In a production environment, you should:
1. Move the API key to a backend server
2. Implement proper authentication
3. Use environment variables
4. Add rate limiting

## License

MIT License - Feel free to use and modify!