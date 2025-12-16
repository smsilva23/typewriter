import React, { useState, useEffect, useRef, useCallback } from 'react'
import Typewriter from './components/Typewriter'
import OrganicTyping from './components/OrganicTyping'
import ReadingDisplay from './components/ReadingDisplay'
import { analyzeTypingPattern } from './utils/archetypeAnalyzer'
import './App.css'

const DEFAULT_MESSAGE = "What story does your typing tell? Unlike handwriting, typing is sterile, uniform and common. But with typing data, we can learn a lot about you! Click next to get your Typing Tarot reading."

// Phases: 'reveal' | 'typing' | 'reading'
function App() {
  const [phase, setPhase] = useState('reveal') // 'reveal', 'typing', 'reading'
  const [targetMessage] = useState(DEFAULT_MESSAGE)
  const [revealedChars, setRevealedChars] = useState(new Set())
  const [typedCharsHistory, setTypedCharsHistory] = useState([]) // Track order for backspace
  const [keystrokes, setKeystrokes] = useState([])
  const [typos, setTypos] = useState([])
  const [isActive, setIsActive] = useState(false)
  const [lastPressedKey, setLastPressedKey] = useState(null)
  const [organicMetrics, setOrganicMetrics] = useState(null)
  const [readingData, setReadingData] = useState(null)
  const [isMessageComplete, setIsMessageComplete] = useState(false)
  const typedSequenceRef = useRef('')
  const startTimeRef = useRef(null)
  const lastKeystrokeTimeRef = useRef(null)

  const handleKeyPress = useCallback((event) => {
    // Only handle keypress in reveal phase
    if (phase !== 'reveal') {
      return
    }

    // Ignore special keys
    if (event.key.length > 1 && event.key !== 'Backspace') {
      return
    }

    const typedChar = event.key.toLowerCase()
    
    // Check for "skip" command BEFORE any other processing
    typedSequenceRef.current = (typedSequenceRef.current + typedChar).slice(-4)
    const lastFour = typedSequenceRef.current.toLowerCase()
    
    if (lastFour === 'skip') {
      // Skip detected - prevent default, stop propagation, and transition
      event.preventDefault()
      event.stopPropagation()
      setPhase('typing')
      setIsMessageComplete(false)
      typedSequenceRef.current = ''
      lastKeystrokeTimeRef.current = Date.now()
      return
    }

    if (!isActive) {
      setIsActive(true)
      startTimeRef.current = Date.now()
      lastKeystrokeTimeRef.current = Date.now()
    }

    const currentTime = Date.now()
    const timeSinceLastKeystroke = lastKeystrokeTimeRef.current 
      ? currentTime - lastKeystrokeTimeRef.current 
      : 0

    if (event.key === 'Backspace') {
      // Reset skip sequence on backspace
      typedSequenceRef.current = typedSequenceRef.current.slice(0, -1)
      
      // Handle backspace - remove last typed character from revealed set
      setTypedCharsHistory(prev => {
        if (prev.length === 0) return prev
        const newHistory = [...prev]
        const lastChar = newHistory.pop()
        // Remove the last character from revealed set
        setRevealedChars(current => {
          const newSet = new Set(current)
          newSet.delete(lastChar)
          return newSet
        })
        return newHistory
      })
      setKeystrokes(prev => [...prev, {
        key: 'Backspace',
        timestamp: currentTime,
        timeSinceLast: timeSinceLastKeystroke,
        isTypo: false
      }])
      
      // Track backspace for keyboard animation
      setLastPressedKey('backspace')
      setTimeout(() => setLastPressedKey(null), 200)
    } else {
      const typedChar = event.key.toLowerCase()
      // Check if this character exists in the target message
      const charExistsInMessage = targetMessage.toLowerCase().includes(typedChar)
      
      // Add to revealed characters (this will reveal ALL instances of this letter)
      setRevealedChars(prev => {
        const newSet = new Set(prev)
        if (charExistsInMessage) {
          newSet.add(typedChar)
        }
        return newSet
      })
      
      // Track in history for backspace
      if (charExistsInMessage) {
        setTypedCharsHistory(prev => [...prev, typedChar])
      }

      // Track as typo if character doesn't exist in message
      if (!charExistsInMessage) {
        setTypos(prev => [...prev, {
          typed: typedChar,
          timestamp: currentTime
        }])
      }

      setKeystrokes(prev => [...prev, {
        key: event.key,
        timestamp: currentTime,
        timeSinceLast: timeSinceLastKeystroke,
        isTypo: !charExistsInMessage
      }])
      
      // Track last pressed key for keyboard animation
      setLastPressedKey(event.key.toLowerCase())
      setTimeout(() => setLastPressedKey(null), 200)
    }

    lastKeystrokeTimeRef.current = currentTime
  }, [targetMessage, isActive, phase])

  useEffect(() => {
    if (phase === 'reveal') {
      window.addEventListener('keydown', handleKeyPress)
      return () => {
        window.removeEventListener('keydown', handleKeyPress)
      }
    }
  }, [handleKeyPress, phase])

  // Check if message is fully revealed (all unique letters are revealed)
  useEffect(() => {
    if (phase === 'reveal') {
      const uniqueLetters = new Set(
        targetMessage.toLowerCase().split('').filter(char => 
          /[a-z]/.test(char)
        )
      )
      const allRevealed = Array.from(uniqueLetters).every(char => revealedChars.has(char))
      
      if (allRevealed && uniqueLetters.size > 0) {
        // Message is fully revealed, show the Next button
        setIsMessageComplete(true)
      } else {
        setIsMessageComplete(false)
      }
    }
  }, [revealedChars, targetMessage, phase])

  const handleOrganicTypingComplete = (data) => {
    const analysis = analyzeTypingPattern(
      data.metrics,
      data.keystrokes,
      data.typos
    )
    setReadingData(analysis)
    setPhase('reading')
  }

  const handleMetricsUpdate = (metrics) => {
    setOrganicMetrics(metrics)
  }

  const handleNext = () => {
    setPhase('typing')
    setIsMessageComplete(false)
  }

  const handleReset = () => {
    setPhase('reveal')
    setRevealedChars(new Set())
    setTypedCharsHistory([])
    setKeystrokes([])
    setTypos([])
    setIsActive(false)
    setOrganicMetrics(null)
    setReadingData(null)
    setIsMessageComplete(false)
    typedSequenceRef.current = ''
    startTimeRef.current = null
    lastKeystrokeTimeRef.current = null
  }

  // Calculate how many letters are revealed
  const revealedCount = targetMessage.split('').filter(char => {
    const lowerChar = char.toLowerCase()
    return revealedChars.has(lowerChar) || char === ' ' || /[.,!?;:']/.test(char)
  }).length

  const inputRef = useRef(null)

  // Auto-focus input on mobile for keyboard events
  useEffect(() => {
    if (phase === 'reveal' && inputRef.current) {
      // Small delay to ensure the element is rendered
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }, [phase])

  // Handle input changes for mobile
  const handleInput = useCallback((e) => {
    if (phase !== 'reveal') {
      return
    }
    
    const value = e.target.value
    if (value.length > 0) {
      // Process each character in the value (in case multiple were added)
      const currentLength = value.length
      const previousLength = parseInt(inputRef.current?.dataset.previousLength || '0', 10)
      
      if (currentLength > previousLength) {
        // New characters were added
        const newChars = value.slice(previousLength)
        
        // Process each new character
        for (let i = 0; i < newChars.length; i++) {
          const char = newChars[i]
          
          // Skip spaces and non-single characters
          if (char === ' ' || char.length !== 1) {
            continue
          }
          
          // Create a synthetic keydown event for the character
          const syntheticEvent = {
            key: char,
            preventDefault: () => {},
            stopPropagation: () => {}
          }
          
          handleKeyPress(syntheticEvent)
          
          // If phase changed (skip detected), break out
          if (phase !== 'reveal') {
            break
          }
        }
      }
      
      // Store current length for next comparison
      if (inputRef.current && phase === 'reveal') {
        inputRef.current.dataset.previousLength = currentLength.toString()
      }
      
      // Clear the input to track next character (only if still in reveal phase)
      if (phase === 'reveal') {
        e.target.value = ''
        if (inputRef.current) {
          inputRef.current.dataset.previousLength = '0'
        }
      }
    }
  }, [phase, handleKeyPress, setPhase, setIsMessageComplete])

  return (
    <div className="app">
      {phase === 'reveal' && (
        <>
          <div className="app-header">
            <h1>Typewriter Tarot Reading</h1>
            <p className="subtitle">Type to reveal the hidden message...</p>
          </div>
          
          {/* Hidden input for mobile keyboard support */}
          <input
            ref={inputRef}
            type="text"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            className="hidden-input"
            onKeyDown={handleKeyPress}
            onInput={handleInput}
            placeholder=""
          />
          
          <div className="content-container">
            <Typewriter 
              targetMessage={targetMessage}
              revealedChars={revealedChars}
              typos={typos}
              lastPressedKey={lastPressedKey}
              isMessageComplete={isMessageComplete}
              onNext={handleNext}
              inputRef={inputRef}
            />
          </div>
        </>
      )}

      {phase === 'typing' && (
        <OrganicTyping 
          onComplete={handleOrganicTypingComplete}
          onMetricsUpdate={handleMetricsUpdate}
        />
      )}

      {phase === 'reading' && (
        <ReadingDisplay 
          readingData={readingData}
          onReset={handleReset}
        />
      )}
    </div>
  )
}

export default App

