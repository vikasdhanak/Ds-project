# 🤖 AI Reading Assistant - User Guide

## What is it?

An **AI-powered chatbot** that helps you understand difficult text, paragraphs, or phrases while reading e-books!

---

## 🎯 Features

✅ **Text Explanation** - Explains complex paragraphs in simple terms  
✅ **Text Simplification** - Breaks down difficult language  
✅ **Summarization** - Provides quick summaries of long passages  
✅ **Interactive Chat** - Ask follow-up questions  
✅ **Smart Selection** - Automatically detects selected text  

---

## 📖 How to Use

### Method 1: Select Text + Quick Actions

1. **Read your e-book** on the main page
2. **Select/highlight** any text you don't understand (using your mouse)
3. **Click the chatbot button** 🤖 (bottom-right corner)
4. Click one of the **Quick Action buttons**:
   - **Explain this** - Get a detailed explanation
   - **Simplify** - Get simpler version
   - **Summarize** - Get brief summary

### Method 2: Type Your Question

1. Click the **chatbot button** 🤖
2. Type your question in the input box:
   - "What does this mean?"
   - "Explain this paragraph"
   - "Simplify this for me"
3. Press **Enter** or click **Send** ➤

---

## 💡 Example Usage

**Scenario:** You're reading a complex paragraph about quantum physics

1. **Highlight the paragraph** with your mouse
2. **Click** the 🤖 chatbot button
3. **Click** "Simplify" button
4. **AI explains** it in simple terms!

---

## 🔧 Current Mode: Rule-Based AI

The chatbot currently works with **smart rule-based responses**. It provides helpful explanations without needing an API key!

### Want to upgrade to Real AI?

You can connect to **Hugging Face API** for more advanced AI responses:

1. Get a **FREE API key** from: https://huggingface.co/settings/tokens
2. Open `js/chatbot.js`
3. Replace this line:
   ```javascript
   this.API_KEY = 'hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
   ```
4. With your actual key:
   ```javascript
   this.API_KEY = 'hf_YOUR_ACTUAL_KEY_HERE';
   ```
5. Save and refresh!

---

## 🎨 Features

- **Floating Button** - Always accessible in bottom-right corner
- **Smooth Animations** - Modern UI with beautiful transitions
- **Typing Indicator** - Shows when AI is "thinking"
- **Message History** - Keeps conversation context
- **Mobile Responsive** - Works on all devices

---

## 🔍 Sample Questions You Can Ask

- "Explain this paragraph"
- "What does this mean?"
- "Simplify this for me"
- "Give me a summary"
- "What is the main idea?"
- "Can you clarify this?"

---

## 🚀 Tips for Best Results

1. **Select specific text** before asking questions
2. **Be clear** in your questions
3. **Ask follow-up questions** for deeper understanding
4. Use **Quick Actions** for instant help

---

## 📝 Technical Details

- **Frontend Framework**: Vanilla JavaScript
- **AI Model Option**: Hugging Face (BlenderBot)
- **Fallback**: Smart rule-based responses
- **API**: Optional Hugging Face API integration
- **No Backend Required**: Runs entirely in browser

---

## 🐛 Troubleshooting

**Chatbot not appearing?**
- Hard refresh: `Ctrl + Shift + R`
- Check browser console for errors

**Not getting good responses?**
- Add Hugging Face API key for better AI
- Select text before asking questions
- Be more specific in questions

---

## 🌟 Future Enhancements

- ✨ Multi-language support
- ✨ Voice input/output
- ✨ PDF text extraction
- ✨ Save important conversations
- ✨ Custom AI model training

---

Enjoy your AI Reading Assistant! 📚🤖
