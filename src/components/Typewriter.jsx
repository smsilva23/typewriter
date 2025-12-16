import React from 'react'
import './Typewriter.css'

const KEYBOARD_LAYOUT = [
  ['!', '"', '#', '$', '%', '&', "'", '(', ')', '*', '+', '='],
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm']
]

function Typewriter({ targetMessage, revealedChars, typos, lastPressedKey, isMessageComplete, onNext, inputRef }) {
  const renderMessage = () => {
    return targetMessage.split('').map((char, index) => {
      const lowerChar = char.toLowerCase()
      const isSpace = char === ' '
      const isPunctuation = /[.,!?;:']/.test(char)
      
      // Reveal if: it's a space, punctuation, or the character is in revealedChars
      const isRevealed = isSpace || isPunctuation || revealedChars.has(lowerChar)
      
      // Check if this character was typed incorrectly (doesn't exist in message)
      const isTypoChar = typos.some(t => t.typed === lowerChar)
      
      let className = 'letter'
      
      if (isRevealed) {
        className += ' revealed'
        if (isTypoChar && !isSpace && !isPunctuation) {
          className += ' typo'
        }
      } else {
        className += ' hidden'
      }
      
      if (isSpace) {
        className += ' space'
      }
      
      if (isPunctuation) {
        className += ' punctuation'
      }

      return (
        <span 
          key={index} 
          className={className}
          data-typed={isTypoChar ? lowerChar : null}
        >
          {isRevealed ? char : (isSpace ? ' ' : '█')}
        </span>
      )
    })
  }

  const isKeyPressed = (key) => {
    return lastPressedKey === key.toLowerCase()
  }

  const keyboardRef = React.useRef(null)
  
  const handleKeyboardClick = (e) => {
    // Only focus input on mobile devices
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth <= 768
    if (isMobile && inputRef?.current) {
      e.preventDefault()
      e.stopPropagation()
      // Simple focus - should trigger keyboard
      inputRef.current.focus()
      // Add visual feedback
      if (keyboardRef.current) {
        keyboardRef.current.classList.add('touching')
        setTimeout(() => {
          if (keyboardRef.current) {
            keyboardRef.current.classList.remove('touching')
          }
        }, 150)
      }
    }
  }
  
  const handleKeyboardTouchStart = (e) => {
    // Handle touch events on mobile
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth <= 768
    if (isMobile && inputRef?.current) {
      e.preventDefault()
      e.stopPropagation()
      // Add visual feedback
      if (keyboardRef.current) {
        keyboardRef.current.classList.add('touching')
      }
    }
  }
  
  const handleKeyboardTouchEnd = (e) => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth <= 768
    if (isMobile && inputRef?.current) {
      e.preventDefault()
      e.stopPropagation()
      inputRef.current.focus()
      // Remove visual feedback
      if (keyboardRef.current) {
        keyboardRef.current.classList.remove('touching')
      }
    }
  }

  return (
    <div className="typewriter-container">
      {/* Button overlay - outside 3D context */}
      {isMessageComplete && (
        <button onClick={onNext} className="paper-next-button-overlay">
          Next →
        </button>
      )}
      {/* Typewriter Machine */}
      <div className="typewriter-machine">
        <div className="typewriter-top">
          <div className="paper-guide">
            <div className="ruler-markings"></div>
            <div className="brand-name-top">SCM SMITH-CORONA</div>
          </div>
        </div>
        
        <div className="typewriter-brand-plate">
          <div className="brand-model">STERLING</div>
        </div>
        
        {/* Paper loaded in typewriter */}
        <div className="typewriter-paper-holder">
          <div className="paper">
            <div className="paper-margin-left"></div>
            <div className="paper-content">
              <div className="paper-text">
                {renderMessage()}
              </div>
            </div>
            <div className="paper-margin-right"></div>
            <div className="paper-lines"></div>
          </div>
        </div>
        
        <div className="typewriter-body">
          <div className="typewriter-carriage"></div>
        </div>
      </div>

      {/* Keyboard */}
      <div 
        ref={keyboardRef}
        className="typewriter-keyboard" 
        onClick={handleKeyboardClick}
        onTouchStart={handleKeyboardTouchStart}
        onTouchEnd={handleKeyboardTouchEnd}
      >
        {/* Number Row */}
        <div className="keyboard-row">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'].map((key) => (
            <div
              key={key}
              className={`typewriter-key ${isKeyPressed(key) ? 'pressed' : ''}`}
            >
              <span className="key-label">{key}</span>
            </div>
          ))}
        </div>
        
        {/* Symbol Row */}
        <div className="keyboard-row">
          {KEYBOARD_LAYOUT[0].map((key) => (
            <div
              key={key}
              className={`typewriter-key ${isKeyPressed(key) ? 'pressed' : ''}`}
            >
              <span className="key-label">{key}</span>
            </div>
          ))}
        </div>
        
        {/* QWERTY Row with arrow, 1/4 1/2, and TAB */}
        <div className="keyboard-row">
          <div className={`typewriter-key special-key arrow-key ${isKeyPressed('arrowleft') ? 'pressed' : ''}`}>
            <span className="key-label">←</span>
          </div>
          {KEYBOARD_LAYOUT[1].map((key) => (
            <div
              key={key}
              className={`typewriter-key ${isKeyPressed(key) ? 'pressed' : ''}`}
            >
              <span className="key-label">{key.toUpperCase()}</span>
            </div>
          ))}
          <div className={`typewriter-key special-key fraction-key ${isKeyPressed('fraction') ? 'pressed' : ''}`}>
            <span className="key-label">1/4 1/2</span>
          </div>
          <div className={`typewriter-key special-key tab-key ${isKeyPressed('tab') ? 'pressed' : ''}`}>
            <span className="key-label">TAB</span>
          </div>
        </div>
        
        {/* ASDF Row with Shift, ..., @, M-R */}
        <div className="keyboard-row">
          <div className={`typewriter-key special-key shift-key ${isKeyPressed('shift') ? 'pressed' : ''}`}>
            <span className="key-label">⇧</span>
          </div>
          {KEYBOARD_LAYOUT[2].map((key) => (
            <div
              key={key}
              className={`typewriter-key ${isKeyPressed(key) ? 'pressed' : ''}`}
            >
              <span className="key-label">{key.toUpperCase()}</span>
            </div>
          ))}
          <div className={`typewriter-key special-key ${isKeyPressed('...') ? 'pressed' : ''}`}>
            <span className="key-label">...</span>
          </div>
          <div className={`typewriter-key ${isKeyPressed('@') ? 'pressed' : ''}`}>
            <span className="key-label">@</span>
          </div>
          <div className={`typewriter-key special-key ${isKeyPressed('m-r') ? 'pressed' : ''}`}>
            <span className="key-label">M-R</span>
          </div>
          <div className={`typewriter-key special-key shift-key ${isKeyPressed('shift') ? 'pressed' : ''}`}>
            <span className="key-label">⇧</span>
          </div>
        </div>
        
        {/* ZXCV Row with punctuation */}
        <div className="keyboard-row">
          <div className="keyboard-spacer"></div>
          {KEYBOARD_LAYOUT[3].map((key) => (
            <div
              key={key}
              className={`typewriter-key ${isKeyPressed(key) ? 'pressed' : ''}`}
            >
              <span className="key-label">{key.toUpperCase()}</span>
            </div>
          ))}
          <div className={`typewriter-key ${isKeyPressed(',') ? 'pressed' : ''}`}>
            <span className="key-label">,</span>
          </div>
          <div className={`typewriter-key ${isKeyPressed('.') ? 'pressed' : ''}`}>
            <span className="key-label">.</span>
          </div>
          <div className={`typewriter-key ${isKeyPressed('?') ? 'pressed' : ''}`}>
            <span className="key-label">?</span>
          </div>
          <div className="keyboard-spacer"></div>
        </div>
        
        {/* Bottom row with shift keys and space */}
        <div className="keyboard-row">
          <div className={`typewriter-key special-key shift-key-large ${isKeyPressed('shift') ? 'pressed' : ''}`}>
            <span className="key-label">⇧</span>
          </div>
          <div className={`typewriter-key spacebar ${isKeyPressed(' ') ? 'pressed' : ''}`}>
            <span className="key-label">SPACE</span>
          </div>
          <div className={`typewriter-key special-key shift-key-large ${isKeyPressed('shift') ? 'pressed' : ''}`}>
            <span className="key-label">⇧</span>
          </div>
        </div>
        
      </div>
    </div>
  )
}

export default Typewriter

