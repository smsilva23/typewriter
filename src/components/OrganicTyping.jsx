import React, { useState, useEffect, useRef, useCallback } from 'react'
import { analyzeTypingQuality } from '../utils/typoDetector'
import './OrganicTyping.css'

const SCRIPTED_SENTENCE = "The quick brown fox jumps over the lazy dog."

function OrganicTyping({ onComplete, onMetricsUpdate }) {
  const [phase, setPhase] = useState('scripted') // 'scripted' or 'free'
  const [scriptedText, setScriptedText] = useState('')
  const [freeText, setFreeText] = useState('')
  const [keystrokes, setKeystrokes] = useState([])
  const [scriptedKeystrokes, setScriptedKeystrokes] = useState([])
  const [freeKeystrokes, setFreeKeystrokes] = useState([])
  const [typos, setTypos] = useState([])
  const [isActive, setIsActive] = useState(false)
  const [isScriptedComplete, setIsScriptedComplete] = useState(false)
  const [wordCount, setWordCount] = useState(0)
  const [typingQuality, setTypingQuality] = useState(null)
  const startTimeRef = useRef(null)
  const scriptedStartTimeRef = useRef(null)
  const freeStartTimeRef = useRef(null)
  const lastKeystrokeTimeRef = useRef(null)
  const textareaRef = useRef(null)

  // Calculate scripted accuracy (character-by-character)
  const calculateScriptedAccuracy = useCallback(() => {
    if (scriptedText.length === 0) return 100
    
    let correctChars = 0
    const target = SCRIPTED_SENTENCE
    const minLength = Math.min(scriptedText.length, target.length)
    
    for (let i = 0; i < minLength; i++) {
      if (scriptedText[i] === target[i]) {
        correctChars++
      }
    }
    
    // Penalize if they typed too much or too little
    const lengthDiff = Math.abs(scriptedText.length - target.length)
    const accuracy = (correctChars / Math.max(scriptedText.length, target.length)) * 100
    
    return Math.max(0, accuracy - (lengthDiff * 2))
  }, [scriptedText])

  // Analyze metrics combining both phases
  const analyzeMetrics = useCallback(() => {
    const allKeystrokes = [...scriptedKeystrokes, ...freeKeystrokes]
    if (allKeystrokes.length === 0) return null

    const validKeystrokes = allKeystrokes.filter(k => k.key !== 'Backspace')
    const rhythmIntervals = allKeystrokes
      .filter(k => k.timeSinceLast > 0)
      .map(k => k.timeSinceLast)
    
    const averageRhythm = rhythmIntervals.length > 0
      ? rhythmIntervals.reduce((a, b) => a + b, 0) / rhythmIntervals.length
      : 0

    const rhythmVariance = rhythmIntervals.length > 0
      ? Math.sqrt(
          rhythmIntervals.reduce((sum, val) => sum + Math.pow(val - averageRhythm, 2), 0) / rhythmIntervals.length
        )
      : 0

    // Calculate WPM from total time
    const totalTime = scriptedStartTimeRef.current && freeStartTimeRef.current
      ? ((freeStartTimeRef.current - scriptedStartTimeRef.current) + (Date.now() - freeStartTimeRef.current)) / 1000 / 60
      : scriptedStartTimeRef.current
      ? (Date.now() - scriptedStartTimeRef.current) / 1000 / 60
      : 0
    
    const wpm = totalTime > 0 ? (validKeystrokes.length / 5) / totalTime : 0

    // Scripted accuracy (character-by-character)
    const scriptedAccuracy = calculateScriptedAccuracy()
    
    // Free write quality (word validity, spam detection)
    const freeQuality = freeText.length > 0 
      ? analyzeTypingQuality(freeText, freeKeystrokes)
      : { accuracy: 100, isSpam: false, typos: { typoRate: 0, typoCount: 0 }, corrections: { corrections: 0 } }
    
    setTypingQuality(freeQuality)

    // Combine accuracies (weighted: 60% scripted, 40% free)
    const combinedAccuracy = phase === 'scripted'
      ? scriptedAccuracy
      : (scriptedAccuracy * 0.6) + (freeQuality.accuracy * 0.4)

    // Count scripted typos (characters that don't match)
    const scriptedTypos = scriptedText.split('').filter((char, i) => {
      return i < SCRIPTED_SENTENCE.length && char !== SCRIPTED_SENTENCE[i]
    }).length

    return {
      wpm: Math.round(wpm),
      accuracy: Math.round(combinedAccuracy * 10) / 10,
      scriptedAccuracy: Math.round(scriptedAccuracy * 10) / 10,
      freeAccuracy: Math.round(freeQuality.accuracy * 10) / 10,
      averageRhythm: Math.round(averageRhythm),
      rhythmVariance: Math.round(rhythmVariance),
      totalKeystrokes: allKeystrokes.length,
      totalTypos: scriptedTypos + freeQuality.typos.typoCount,
      wordCount: wordCount,
      isSpam: freeQuality.isSpam,
      typoRate: phase === 'scripted' 
        ? (scriptedTypos / Math.max(scriptedText.length, 1)) * 100
        : ((scriptedTypos + freeQuality.typos.typoCount) / Math.max(scriptedText.length + freeText.split(/\s+/).length, 1)) * 100,
      corrections: freeQuality.corrections.corrections
    }
  }, [scriptedKeystrokes, freeKeystrokes, scriptedText, freeText, wordCount, phase, calculateScriptedAccuracy])

  useEffect(() => {
    const metrics = analyzeMetrics()
    if (metrics && onMetricsUpdate) {
      onMetricsUpdate(metrics)
    }
  }, [scriptedKeystrokes, freeKeystrokes, scriptedText, freeText, wordCount, phase, analyzeMetrics, onMetricsUpdate])

  // Check if scripted sentence is complete
  useEffect(() => {
    if (phase === 'scripted') {
      const isComplete = scriptedText.trim() === SCRIPTED_SENTENCE.trim()
      setIsScriptedComplete(isComplete)
    }
  }, [scriptedText, phase])

  const handleKeyDown = useCallback((event) => {
    if (!isActive) {
      setIsActive(true)
      scriptedStartTimeRef.current = Date.now()
      lastKeystrokeTimeRef.current = Date.now()
    }

    const currentTime = Date.now()
    const timeSinceLastKeystroke = lastKeystrokeTimeRef.current 
      ? currentTime - lastKeystrokeTimeRef.current 
      : 0

    const keystrokeData = {
      key: event.key,
      timestamp: currentTime,
      timeSinceLast: timeSinceLastKeystroke,
      isTypo: false
    }

    if (phase === 'scripted') {
      if (event.key === 'Backspace') {
        setScriptedKeystrokes(prev => [...prev, keystrokeData])
      } else if (event.key.length === 1) {
        setScriptedKeystrokes(prev => [...prev, keystrokeData])
      }
    } else {
      if (event.key === 'Backspace') {
        setFreeKeystrokes(prev => [...prev, keystrokeData])
      } else if (event.key.length === 1) {
        setFreeKeystrokes(prev => [...prev, keystrokeData])
      }
    }

    lastKeystrokeTimeRef.current = currentTime
  }, [isActive, phase])

  const handleChange = (e) => {
    const newText = e.target.value
    
    if (phase === 'scripted') {
      setScriptedText(newText)
    } else {
      setFreeText(newText)
      setWordCount(newText.trim().split(/\s+/).filter(word => word.length > 0).length)
    }
  }

  const handleSubmit = () => {
    if (phase === 'scripted') {
      // If scripted phase, manually transition to free write
      if (scriptedText.trim() === SCRIPTED_SENTENCE.trim()) {
        setPhase('free')
        freeStartTimeRef.current = Date.now()
        setFreeText('')
        if (textareaRef.current) {
          textareaRef.current.value = ''
          textareaRef.current.focus()
        }
      }
    } else {
      // Free write phase - submit for reading
      if (scriptedText.trim() === SCRIPTED_SENTENCE.trim()) {
        const finalMetrics = analyzeMetrics()
        onComplete({
          scriptedText,
          freeText,
          text: scriptedText + (freeText ? ' ' + freeText : ''),
          metrics: finalMetrics,
          keystrokes: [...scriptedKeystrokes, ...freeKeystrokes],
          typos: typingQuality ? typingQuality.typos.misspelledWords : []
        })
      }
    }
  }

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [])

  const currentText = phase === 'scripted' ? scriptedText : freeText
  const currentValue = phase === 'scripted' ? scriptedText : freeText

  // Render scripted sentence with accuracy feedback
  const renderScriptedSentence = () => {
    if (phase !== 'scripted') return null
    
    return (
      <div className="scripted-sentence-container">
        <p className="scripted-instruction">Type this sentence:</p>
        <div className="scripted-target">
          {SCRIPTED_SENTENCE.split('').map((char, i) => {
            const isTyped = i < scriptedText.length
            const isCorrect = isTyped && scriptedText[i] === char
            const isIncorrect = isTyped && scriptedText[i] !== char
            const isCurrent = i === scriptedText.length
            const isSpace = char === ' '
            
            return (
              <span
                key={i}
                className={`scripted-char ${isSpace ? 'space' : ''} ${isCurrent ? 'current' : ''} ${isCorrect ? 'correct' : ''} ${isIncorrect ? 'incorrect' : ''}`}
              >
                {isSpace ? '\u00A0' : (isTyped ? scriptedText[i] : char)}
              </span>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className={`organic-typing-container ${phase === 'scripted' ? 'scripted-phase' : ''}`}>
      <div style={{ height: '120px', width: '100%', flexShrink: 0 }} className="top-spacer"></div>
      <div className="typing-prompt">
        {phase === 'scripted' ? (
          <h2 className="scripted-title">Type this sentence exactly as shown:</h2>
        ) : (
          <>
            <h2>Now, type freely...</h2>
            <p className="prompt-subtitle">Share your thoughts, a memory, a dream, or anything on your mind.</p>
            <p className="prompt-hint">We're listening to the rhythm of your words.</p>
          </>
        )}
      </div>
      
      <div className="typing-area">
        {renderScriptedSentence()}
        <textarea
          ref={textareaRef}
          value={currentValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={phase === 'scripted' ? "Type the sentence above..." : "Start typing here..."}
          className="organic-textarea"
          rows={phase === 'scripted' ? 3 : 10}
          disabled={phase === 'scripted' && scriptedText.trim() === SCRIPTED_SENTENCE.trim()}
        />
        <div className="typing-footer">
          {phase === 'free' && <div className="word-count">{wordCount} words</div>}
          {phase === 'scripted' && (
            <div className="scripted-progress">
              {scriptedText.length} / {SCRIPTED_SENTENCE.length} characters
            </div>
          )}
          {phase === 'scripted' && isScriptedComplete && (
            <button 
              onClick={handleSubmit} 
              className="submit-button"
            >
              Continue to Free Write →
            </button>
          )}
          {phase === 'free' && (
            <button 
              onClick={handleSubmit} 
              className="submit-button"
              disabled={freeText.trim().length === 0}
            >
              Reveal My Reading
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default OrganicTyping

