import React, { useMemo } from 'react'
import './MetricsDisplay.css'

function MetricsDisplay({ keystrokes, typos, revealedLetters, targetMessageLength, startTime, isActive }) {
  const metrics = useMemo(() => {
    if (keystrokes.length === 0) {
      return {
        wpm: 0,
        accuracy: 100,
        averageRhythm: 0,
        rhythmVariance: 0,
        totalKeystrokes: 0,
        totalTypos: typos.length,
        progress: 0
      }
    }

    const validKeystrokes = keystrokes.filter(k => k.key !== 'Backspace' && !k.isTypo)
    const rhythmIntervals = keystrokes
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

    const elapsedTime = startTime ? (Date.now() - startTime) / 1000 / 60 : 0 // minutes
    const wpm = elapsedTime > 0 ? (validKeystrokes.length / 5) / elapsedTime : 0

    const accuracy = keystrokes.length > 0
      ? ((keystrokes.length - typos.length - keystrokes.filter(k => k.key === 'Backspace').length) / keystrokes.length) * 100
      : 100

    const progress = (revealedLetters / targetMessageLength) * 100

    return {
      wpm: Math.round(wpm),
      accuracy: Math.round(accuracy * 10) / 10,
      averageRhythm: Math.round(averageRhythm),
      rhythmVariance: Math.round(rhythmVariance),
      totalKeystrokes: keystrokes.length,
      totalTypos: typos.length,
      progress: Math.round(progress * 10) / 10
    }
  }, [keystrokes, typos, revealedLetters, targetMessageLength, startTime])

  const rhythmQuality = useMemo(() => {
    if (metrics.rhythmVariance === 0) return 'Perfect'
    if (metrics.rhythmVariance < 100) return 'Very Consistent'
    if (metrics.rhythmVariance < 200) return 'Consistent'
    if (metrics.rhythmVariance < 400) return 'Variable'
    return 'Irregular'
  }, [metrics.rhythmVariance])

  return (
    <div className="metrics-container">
      <h2 className="metrics-title">Keystroke Metrics</h2>
      
      <div className="metrics-grid">
        <MetricCard 
          label="Words Per Minute"
          value={metrics.wpm}
          unit="WPM"
          color="#3498db"
        />
        
        <MetricCard 
          label="Accuracy"
          value={metrics.accuracy}
          unit="%"
          color={metrics.accuracy >= 95 ? "#2ecc71" : metrics.accuracy >= 80 ? "#f39c12" : "#e74c3c"}
        />
        
        <MetricCard 
          label="Progress"
          value={metrics.progress}
          unit="%"
          color="#9b59b6"
        />
        
        <MetricCard 
          label="Total Keystrokes"
          value={metrics.totalKeystrokes}
          unit="keys"
          color="#1abc9c"
        />
        
        <MetricCard 
          label="Typos"
          value={metrics.totalTypos}
          unit="errors"
          color="#e74c3c"
        />
        
        <MetricCard 
          label="Average Rhythm"
          value={metrics.averageRhythm}
          unit="ms"
          color="#34495e"
        />
      </div>

      <div className="rhythm-section">
        <h3>Typing Rhythm</h3>
        <div className="rhythm-quality">
          <span className="quality-label">Consistency:</span>
          <span className={`quality-value quality-${rhythmQuality.toLowerCase().replace(' ', '-')}`}>
            {rhythmQuality}
          </span>
        </div>
        <div className="rhythm-variance">
          Variance: {metrics.rhythmVariance}ms
        </div>
        {metrics.averageRhythm > 0 && (
          <div className="rhythm-visualization">
            <div className="rhythm-bar-container">
              {Array.from({ length: 20 }).map((_, i) => {
                const interval = keystrokes[i]?.timeSinceLast || 0
                const normalizedHeight = Math.min(interval / 500, 1) * 100
                return (
                  <div 
                    key={i} 
                    className="rhythm-bar"
                    style={{ height: `${normalizedHeight}%` }}
                  />
                )
              })}
            </div>
          </div>
        )}
      </div>

      {!isActive && keystrokes.length === 0 && (
        <div className="start-hint">
          Start typing to see your metrics!
        </div>
      )}
    </div>
  )
}

function MetricCard({ label, value, unit, color }) {
  return (
    <div className="metric-card" style={{ borderTopColor: color }}>
      <div className="metric-label">{label}</div>
      <div className="metric-value" style={{ color: color }}>
        {value} <span className="metric-unit">{unit}</span>
      </div>
    </div>
  )
}

export default MetricsDisplay

