// Typo detection using spellcheck and pattern analysis
// Reuse the word dictionary from wordValidator
import { isValidWord } from './wordValidator'

// Detect keyboard spam patterns
export function detectSpamPattern(keystrokes) {
  if (keystrokes.length < 3) return false

  let spamScore = 0
  const recentKeys = keystrokes.slice(-20).filter(k => k.key !== 'Backspace')
  
  // Check for repeated characters (e.g., "aaaa" or "qqqq")
  let consecutiveRepeats = 0
  let maxConsecutive = 0
  for (let i = 1; i < recentKeys.length; i++) {
    if (recentKeys[i].key.toLowerCase() === recentKeys[i - 1].key.toLowerCase()) {
      consecutiveRepeats++
      maxConsecutive = Math.max(maxConsecutive, consecutiveRepeats)
    } else {
      consecutiveRepeats = 0
    }
  }
  
  // If same character repeated 4+ times, likely spam
  if (maxConsecutive >= 3) {
    spamScore += 50
  }
  
  // Check for very fast typing of same character (spam clicking)
  let fastRepeats = 0
  for (let i = 1; i < recentKeys.length; i++) {
    if (recentKeys[i].key.toLowerCase() === recentKeys[i - 1].key.toLowerCase() &&
        recentKeys[i].timeSinceLast < 50) { // Less than 50ms between same key
      fastRepeats++
    }
  }
  
  if (fastRepeats >= 3) {
    spamScore += 30
  }
  
  // Check for alternating pattern (e.g., "asdfasdf")
  if (recentKeys.length >= 8) {
    const pattern = recentKeys.slice(-8).map(k => k.key.toLowerCase()).join('')
    const firstHalf = pattern.slice(0, 4)
    const secondHalf = pattern.slice(4, 8)
    if (firstHalf === secondHalf) {
      spamScore += 20
    }
  }
  
  // Check for keyboard walk patterns (e.g., "qwerty", "asdfgh")
  const keyboardWalks = ['qwerty', 'asdfgh', 'zxcvbn', 'qwertyuiop', 'asdfghjkl']
  const recentText = recentKeys.slice(-10).map(k => k.key.toLowerCase()).join('')
  for (const walk of keyboardWalks) {
    if (recentText.includes(walk)) {
      spamScore += 25
    }
  }
  
  return spamScore >= 30 // Threshold for spam detection
}

// Detect typos in text using word validation
export function detectTypos(text) {
  if (!text || text.trim().length === 0) {
    return {
      totalWords: 0,
      misspelledWords: [],
      typoCount: 0,
      typoRate: 0
    }
  }

  const words = text.trim().split(/\s+/).filter(word => {
    // Remove punctuation for checking
    const cleaned = word.replace(/[.,!?;:'"()\[\]{}]/g, '')
    return cleaned.length > 0
  })

  const misspelledWords = words.filter(word => {
    const cleaned = word.replace(/[.,!?;:'"()\[\]{}]/g, '').toLowerCase()
    // Skip single characters and numbers
    if (cleaned.length <= 1 || /^\d+$/.test(cleaned)) {
      return false
    }
    return !isValidWord(cleaned)
  })

  const typoRate = words.length > 0 
    ? (misspelledWords.length / words.length) * 100 
    : 0

  return {
    totalWords: words.length,
    misspelledWords: misspelledWords,
    typoCount: misspelledWords.length,
    typoRate: Math.round(typoRate * 10) / 10
  }
}

// Analyze typing patterns for corrections (backspace followed by different text)
export function detectCorrections(keystrokes, textHistory) {
  let corrections = 0
  let correctionChars = 0
  
  // Track backspace events and what was typed after
  for (let i = 0; i < keystrokes.length - 1; i++) {
    if (keystrokes[i].key === 'Backspace') {
      // Look ahead to see if something different was typed
      let j = i + 1
      while (j < keystrokes.length && keystrokes[j].key === 'Backspace') {
        j++
      }
      if (j < keystrokes.length && keystrokes[j].key !== 'Backspace') {
        corrections++
        correctionChars++
      }
    }
  }
  
  return {
    corrections,
    correctionChars
  }
}

// Main function to analyze typing quality
export function analyzeTypingQuality(text, keystrokes) {
  const typos = detectTypos(text)
  const spam = detectSpamPattern(keystrokes)
  const corrections = detectCorrections(keystrokes, text)
  
  // Calculate accuracy based on typos and corrections
  // Lower typo rate and fewer corrections = higher accuracy
  const baseAccuracy = 100 - typos.typoRate
  const correctionPenalty = Math.min(corrections.corrections * 2, 20) // Max 20% penalty
  const accuracy = Math.max(0, baseAccuracy - correctionPenalty)
  
  return {
    typos: typos,
    spam: spam,
    corrections: corrections,
    accuracy: Math.round(accuracy * 10) / 10,
    isSpam: spam
  }
}

