// AI Chatbot using Free AI API
class AIChatbot {
    constructor() {
        // Using free DeepInfra API (no key needed!)
        this.API_URL = 'https://api.deepinfra.com/v1/openai/chat/completions';
        this.MODEL = 'meta-llama/Llama-2-7b-chat-hf';
        this.isOpen = false;
        this.conversationHistory = [];
        this.selectedText = '';
        
        this.init();
    }

    init() {
        // Create chatbot HTML
        this.createChatbotUI();
        
        // Add event listeners
        this.setupEventListeners();
        
        // Listen for text selection
        this.setupTextSelectionListener();
    }

    createChatbotUI() {
        const chatbotHTML = `
            <!-- Chatbot Toggle Button -->
            <button class="chatbot-toggle" id="chatbotToggle">
                <img src="../assets/images/chatbot-icon.svg" alt="Chat Assistant">
            </button>

            <!-- Chatbot Container -->
            <div class="chatbot-container" id="chatbotContainer">
                <!-- Header -->
                <div class="chatbot-header">
                    <div class="chatbot-header-left">
                        <div class="chatbot-avatar">
                            <img src="../assets/images/chatbot-icon.svg" alt="Chat Assistant">
                        </div>
                        <div class="chatbot-title">
                            <h3>Reading Assistant</h3>
                            <p>Ask me anything about your text</p>
                        </div>
                    </div>
                    <button class="chatbot-close" id="chatbotClose">×</button>
                </div>

                <!-- Messages Area -->
                <div class="chatbot-messages" id="chatbotMessages">
                    <div class="welcome-message">
                        <div class="welcome-icon">📚</div>
                        <h4>Hi! I'm your Reading Assistant</h4>
                        <p>Select any text from the book and I'll help you understand it!</p>
                        <p><strong>Try these:</strong></p>
                        <p>• "Explain this paragraph"</p>
                        <p>• "Simplify this for me"</p>
                        <p>• "What does this mean?"</p>
                    </div>
                </div>

                <!-- Typing Indicator -->
                <div class="chat-message bot" style="display: none;" id="typingIndicator">
                    <div class="message-avatar bot">
                        <img src="../assets/images/chatbot-icon.svg" alt="Bot">
                    </div>
                    <div class="typing-indicator active">
                        <div class="typing-dot"></div>
                        <div class="typing-dot"></div>
                        <div class="typing-dot"></div>
                    </div>
                </div>

                <!-- Quick Actions -->
                <div class="chatbot-quick-actions">
                    <button class="quick-action-btn" data-action="explain">Explain this</button>
                    <button class="quick-action-btn" data-action="simplify">Simplify</button>
                    <button class="quick-action-btn" data-action="summary">Summarize</button>
                </div>

                <!-- Input Area -->
                <div class="chatbot-input-area">
                    <input 
                        type="text" 
                        class="chatbot-input" 
                        id="chatbotInput" 
                        placeholder="Ask me anything..."
                        autocomplete="off"
                    />
                    <button class="chatbot-send-btn" id="chatbotSend">
                        ➤
                    </button>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', chatbotHTML);
    }

    setupEventListeners() {
        const toggle = document.getElementById('chatbotToggle');
        const close = document.getElementById('chatbotClose');
        const send = document.getElementById('chatbotSend');
        const input = document.getElementById('chatbotInput');
        const quickActions = document.querySelectorAll('.quick-action-btn');

        toggle.addEventListener('click', () => this.toggleChat());
        close.addEventListener('click', () => this.toggleChat());
        send.addEventListener('click', () => this.sendMessage());
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });

        quickActions.forEach(btn => {
            btn.addEventListener('click', () => this.handleQuickAction(btn.dataset.action));
        });
    }

    setupTextSelectionListener() {
        let selectedText = '';

        document.addEventListener('mouseup', () => {
            const selection = window.getSelection().toString().trim();
            if (selection.length > 10) { // Only if more than 10 characters selected
                selectedText = selection;
                this.showSelectionNotification(selection);
            }
        });

        // Store selected text
        this.getSelectedText = () => selectedText;
    }

    showSelectionNotification(text) {
        // Auto-open chatbot and suggest help
        if (!this.isOpen) {
            const preview = text.substring(0, 50) + (text.length > 50 ? '...' : '');
            
            // Flash the button to get attention
            const toggle = document.getElementById('chatbotToggle');
            toggle.style.animation = 'none';
            setTimeout(() => {
                toggle.style.animation = 'pulse-glow 2s infinite';
            }, 10);
        }
    }

    toggleChat() {
        this.isOpen = !this.isOpen;
        const container = document.getElementById('chatbotContainer');
        const toggle = document.getElementById('chatbotToggle');
        
        container.classList.toggle('active');
        toggle.classList.toggle('active');
        
        if (this.isOpen) {
            document.getElementById('chatbotInput').focus();
        }
    }

    async sendMessage() {
        const input = document.getElementById('chatbotInput');
        const message = input.value.trim();
        
        if (!message) return;

        // Add user message
        this.addMessage(message, 'user');
        input.value = '';

        // Show typing indicator
        this.showTyping(true);

        // Get AI response
        try {
            const response = await this.getAIResponse(message);
            this.showTyping(false);
            this.addMessage(response, 'bot');
        } catch (error) {
            this.showTyping(false);
            this.addMessage('Sorry, I encountered an error. Using fallback response: ' + this.getFallbackResponse(message), 'bot');
        }
    }

    async handleQuickAction(action) {
        const selectedText = this.getSelectedText();
        
        if (!selectedText) {
            this.addMessage('💡 Please select text from the PDF first! Highlight text, copy it (Ctrl+C), then paste it here.', 'bot');
            return;
        }

        // Store selected text
        this.selectedText = selectedText;

        let prompt = '';
        switch(action) {
            case 'explain':
                prompt = `Explain this text: ${selectedText}`;
                break;
            case 'simplify':
                prompt = `Simplify this text: ${selectedText}`;
                break;
            case 'summary':
                prompt = `Summarize this text: ${selectedText}`;
                break;
        }

        document.getElementById('chatbotInput').value = prompt;
        this.sendMessage();
    }

    async getAIResponse(message) {
        // Extract selected text if it's in the message
        const textMatch = message.match(/(?:Explain|Simplify|Summarize) this text: (.+)/i);
        if (textMatch) {
            this.selectedText = textMatch[1];
        }

        try {
            // Use free DeepInfra API with Llama model
            const prompt = this.selectedText 
                ? `Based on this text: "${this.selectedText}"\n\nUser question: ${message}`
                : message;

            const response = await fetch(this.API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: this.MODEL,
                    messages: [
                        {
                            role: "system",
                            content: "You are a helpful reading assistant. Help users understand text from books by explaining concepts clearly and concisely. Keep responses under 200 words."
                        },
                        {
                            role: "user",
                            content: prompt
                        }
                    ],
                    temperature: 0.7,
                    max_tokens: 250
                })
            });

            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            const data = await response.json();
            const aiResponse = data.choices?.[0]?.message?.content;
            
            if (aiResponse && aiResponse.trim()) {
                return aiResponse.trim();
            }
            
            return this.getFallbackResponse(message);
            
        } catch (error) {
            console.error('AI API error:', error);
            return this.getFallbackResponse(message);
        }
    }

    getFallbackResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        // If we have selected text, provide smart analysis
        if (this.selectedText) {
            const text = this.selectedText;
            const words = text.split(/\s+/);
            const sentences = text.split(/[.!?]+/).filter(s => s.trim());
            
            if (lowerMessage.includes('explain')) {
                const keywords = this.extractKeywords(text);
                return `📖 Let me break this down:\n\n` +
                       `Main topic: ${keywords.slice(0, 3).join(', ')}\n\n` +
                       `The text has ${sentences.length} key points. ` +
                       `It discusses ${this.extractMainIdea(text)}.\n\n` +
                       `Key concepts: ${keywords.join(', ')}`;
            }
            
            if (lowerMessage.includes('simplify')) {
                const simplified = this.simplifyText(text);
                return `✨ Here's a simpler version:\n\n${simplified}\n\n` +
                       `In other words: ${this.extractMainIdea(text)}`;
            }
            
            if (lowerMessage.includes('summary') || lowerMessage.includes('summarize')) {
                const mainIdea = this.extractMainIdea(text);
                const keyPoints = sentences.slice(0, 2).join('. ');
                return `📝 Summary:\n\n${keyPoints}\n\n` +
                       `Main idea: ${mainIdea}`;
            }
        }
        
        // No selected text
        if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
            return "👋 Hello! I'm your reading assistant. Select text from the PDF, copy it, and paste it here. Then ask me to explain, simplify, or summarize it!";
        }
        
        if (lowerMessage.includes('help')) {
            return `🤖 I can help you understand your reading!\n\n` +
                   `How to use:\n` +
                   `1. Select text from PDF (it highlights)\n` +
                   `2. Copy it (Ctrl+C)\n` +
                   `3. Paste here (Ctrl+V)\n` +
                   `4. Ask me to explain, simplify, or summarize!\n\n` +
                   `I'll analyze the text and help you understand it.`;
        }

        // Default
        return `💬 Paste the text you want me to analyze, then ask:\n\n` +
               `• "Explain this" - I'll break it down\n` +
               `• "Simplify this" - I'll make it easier\n` +
               `• "Summarize this" - I'll give main points`;
    }

    extractKeywords(text) {
        const commonWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'should', 'could', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those', 'it', 'its', 'their', 'them', 'they']);
        const words = text.toLowerCase().match(/\b\w{5,}\b/g) || [];
        return [...new Set(words)].filter(w => !commonWords.has(w)).slice(0, 5);
    }

    extractMainIdea(text) {
        const keywords = this.extractKeywords(text);
        if (keywords.length > 0) {
            return keywords.slice(0, 3).join(', ');
        }
        const words = text.split(/\s+/).slice(0, 10).join(' ');
        return words + '...';
    }

    simplifyText(text) {
        let simplified = text
            .replace(/\b(subsequently|furthermore|nevertheless|consequently)\b/gi, 'also')
            .replace(/\b(utilize|utilization)\b/gi, 'use')
            .replace(/\b(implement|implementation)\b/gi, 'do')
            .replace(/\b(facilitate)\b/gi, 'help')
            .replace(/\b(demonstrate)\b/gi, 'show')
            .replace(/\b(numerous)\b/gi, 'many')
            .replace(/\b(significant|substantial)\b/gi, 'important')
            .replace(/\b(endeavor)\b/gi, 'try')
            .replace(/\b(possess)\b/gi, 'have');
        
        const sentences = simplified.split(/[.!?]+/).filter(s => s.trim());
        return sentences.slice(0, 3).join('. ') + (sentences.length > 3 ? '...' : '.');
    }

    addMessage(text, sender) {
        const messagesContainer = document.getElementById('chatbotMessages');
        
        // Remove welcome message if exists
        const welcome = messagesContainer.querySelector('.welcome-message');
        if (welcome) welcome.remove();

        const avatarContent = sender === 'bot' 
            ? '<img src="../assets/images/chatbot-icon.svg" alt="Bot">' 
            : '👤';

        const messageHTML = `
            <div class="chat-message ${sender}">
                <div class="message-avatar ${sender}">${avatarContent}</div>
                <div class="message-bubble ${sender}">${this.escapeHtml(text)}</div>
            </div>
        `;

        messagesContainer.insertAdjacentHTML('beforeend', messageHTML);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    showTyping(show) {
        const indicator = document.getElementById('typingIndicator');
        indicator.style.display = show ? 'flex' : 'none';
        
        if (show) {
            const messagesContainer = document.getElementById('chatbotMessages');
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize chatbot when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new AIChatbot();
});
