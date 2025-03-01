import config from './config.js';

class AIService {
    constructor() {
        this.conversationHistory = [];
        this.currentGameContext = null;
    }

    async generateResponse(userMessage, gameContext = null) {
        try {
            const messages = this.buildConversationMessages(userMessage, gameContext);
            
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${config.OPENAI_API_KEY}`
                },
                body: JSON.stringify({
                    model: config.MODEL,
                    messages: messages,
                    max_tokens: config.MAX_TOKENS,
                    temperature: config.TEMPERATURE
                })
            });

            const data = await response.json();
            const aiResponse = data.choices[0].message.content;
            
            // Update conversation history
            this.conversationHistory.push(
                { role: 'user', content: userMessage },
                { role: 'assistant', content: aiResponse }
            );

            // Keep history limited to last 10 exchanges
            if (this.conversationHistory.length > 20) {
                this.conversationHistory = this.conversationHistory.slice(-20);
            }

            return aiResponse;
        } catch (error) {
            console.error('Error generating AI response:', error);
            return "Oops! I had a brief glitch. Let's continue playing! 🎮";
        }
    }

    buildConversationMessages(userMessage, gameContext) {
        const messages = [
            { role: 'system', content: config.PERSONALITY.role },
            ...this.conversationHistory
        ];

        // Add current game context if available
        if (gameContext) {
            messages.push({
                role: 'system',
                content: `Current game context: ${gameContext.game}, State: ${JSON.stringify(gameContext.state)}`
            });
        }

        messages.push({ role: 'user', content: userMessage });
        return messages;
    }

    setGameContext(game, state) {
        this.currentGameContext = { game, state };
    }

    clearGameContext() {
        this.currentGameContext = null;
    }

    // Generate game-specific commentary
    async generateGameComment(game, event) {
        const gamePrompt = `As a gaming buddy, provide a short, fun, encouraging comment about this ${game} event: ${event}`;
        return this.generateResponse(gamePrompt);
    }

    // Generate hints for games
    async generateHint(game, difficulty = 'medium') {
        const hintPrompt = `Generate a helpful but not too revealing ${difficulty} hint for the current ${game} game.`;
        return this.generateResponse(hintPrompt, this.currentGameContext);
    }

    // Generate casual conversation
    async generateChatResponse(message) {
        return this.generateResponse(message);
    }
}

export default new AIService(); 