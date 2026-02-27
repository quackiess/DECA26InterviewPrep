# Purifiber DECA Practice App

A professional web application for practicing DECA role play presentations with AI-powered feedback.

## Features

✨ **Role-Based Practice**
- Choose your role: Andrew (CTO), David (CMO), or Dylan (CFO)
- 6 targeted questions per role based on your specific responsibilities

🎤 **Intelligent Session Flow**
- Text-to-speech reads questions aloud automatically
- 25-second countdown timer per question
- Voice recording captures your answers
- Auto-advance to next question

📊 **AI-Powered Feedback**
- Compare your answers with AI-recommended responses
- Optional: View AI answers between questions during practice
- Final report with playback and suggested improvements

🎨 **Professional Design**
- Tech dashboard aesthetic with dark theme
- Electric cyan accents and smooth animations
- Responsive design for all devices

## Quick Start

1. **Open the app**
   ```bash
   cd deca-practice
   # Simply open index.html in your browser
   open index.html  # macOS
   # or double-click index.html
   ```

2. **Allow microphone access** when prompted (required for recording)

3. **Select your role** (Andrew, David, or Dylan)

4. **Practice!**
   - Listen to each question read aloud
   - Speak your answer within 25 seconds
   - Review your recordings and AI feedback at the end

## How It Works

### Role Selection
Choose which executive role you want to practice:
- **Andrew (CTO)**: Technical questions about product design, R&D, and app features
- **David (CMO)**: Marketing strategy, customer targeting, and competitive positioning
- **Dylan (CFO)**: Financial modeling, unit economics, and revenue projections

### Practice Session
1. Question is read aloud via text-to-speech
2. 25-second timer starts automatically
3. Your answer is recorded
4. Optionally view AI answer before moving to next question
5. Process repeats for all 6 questions

### Final Report
- Review all questions with your recorded answers
- Compare against AI-recommended responses
- Identify areas for improvement

## Technology Stack

- **React 18** - UI framework
- **Web Speech API** - Text-to-speech for questions
- **MediaRecorder API** - Voice recording
- **Vanilla CSS** - Custom animations and design
- **No build tools required** - Just open and use!

## Browser Requirements

- Chrome, Edge, Safari, or Firefox (latest versions)
- Microphone access
- JavaScript enabled

## Tips for Practice

1. **Listen carefully** to the entire question before answering
2. **Structure your answer**: Brief intro → Key points → Conclusion
3. **Use data** from the pitch deck to support your answers
4. **Practice multiple sessions** to improve consistency
5. **Compare with AI answers** to learn optimal phrasing

## Question Database

Each role has 6 carefully crafted questions:

**Andrew (CTO)**: Technical design, validation, prototyping, app technology, refurbishment process, material selection

**David (CMO)**: Target customers, market opportunity, go-to-market strategy, competitive positioning, partnerships, acquisition strategy

**Dylan (CFO)**: Business model, unit economics, funding ask, LTV calculations, revenue projections, profitability drivers

## Customization

Want to add your own questions? Edit `app.js`:

```javascript
const QUESTIONS = {
    andrew: [
        "Your custom question here...",
        // Add more questions
    ],
    // ... other roles
};

const AI_ANSWERS = {
    andrew: [
        "Your ideal answer here...",
        // Add corresponding answers
    ],
    // ... other roles
};
```

---

Built for Purifiber DECA team 🌊
