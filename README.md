# Typewriter Visualization

An interactive React application that visualizes keystroke metrics, typing rhythm, and common typos through a creative typewriter interface.

## Features

- **Interactive Typewriter**: Type letters to reveal a prewritten message on a virtual piece of paper
- **Real-time Metrics**: Track WPM, accuracy, typing rhythm, and typo detection
- **Visual Feedback**: See typos highlighted in red with visual indicators
- **Rhythm Analysis**: Visualize typing consistency through rhythm bars

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build

```bash
npm run build
```

## How It Works

1. Start typing - the app listens to your keystrokes
2. As you type matching letters, they appear on the virtual paper
3. Typos are tracked and displayed in red
4. Metrics update in real-time showing:
   - Words per minute (WPM)
   - Accuracy percentage
   - Typing rhythm and consistency
   - Total keystrokes and typos

## Future Enhancements

- Electron integration for desktop app
- Data export functionality
- More advanced typo analysis
- Multiple message templates
- Historical data tracking

## Tech Stack

- React 18
- Vite
- CSS3 (for animations and styling)

