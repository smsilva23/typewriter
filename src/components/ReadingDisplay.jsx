import React from 'react'
import './ReadingDisplay.css'

function ReadingDisplay({ readingData, onReset }) {
  if (!readingData) return null

  const { archetype, traits, reading, metrics } = readingData

  return (
    <div className="reading-container">
      <div style={{ height: '120px', width: '100%', flexShrink: 0 }} className="top-spacer"></div>
      <div className="reading-card">
        <div className="archetype-header">
          <div className="archetype-symbol">{archetype.symbol}</div>
          <h1 className="archetype-name">{archetype.name}</h1>
          <p className="archetype-description">{archetype.description}</p>
        </div>

        <div className="traits-section">
          <h3>Your Traits</h3>
          <div className="traits-grid">
            {traits.map((trait, index) => (
              <span key={index} className="trait-badge">
                {trait}
              </span>
            ))}
          </div>
        </div>

        <div className="reading-section">
          <h3>Your Reading</h3>
          <p className="reading-text">{reading}</p>
        </div>

        <div className="metrics-summary">
          <div className="metric-item">
            <span className="metric-label">Speed</span>
            <span className="metric-value">{metrics.wpm} WPM</span>
          </div>
          <div className="metric-item">
            <span className="metric-label">Accuracy</span>
            <span className="metric-value">{metrics.accuracy}%</span>
          </div>
          <div className="metric-item">
            <span className="metric-label">Rhythm</span>
            <span className="metric-value">{metrics.rhythmVariance < 200 ? 'Consistent' : 'Variable'}</span>
          </div>
        </div>

        <button onClick={onReset} className="reset-reading-button">
          Start Over
        </button>
      </div>
    </div>
  )
}

export default ReadingDisplay

