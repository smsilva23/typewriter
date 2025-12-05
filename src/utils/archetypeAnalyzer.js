// Analyzes typing patterns and returns an archetype/reading

export function analyzeTypingPattern(metrics, keystrokes, typos) {
  if (!metrics || keystrokes.length === 0) {
    return null
  }

  const { wpm, accuracy, averageRhythm, rhythmVariance, isSpam = false, typoRate = 0 } = metrics
  
  // Define thresholds
  const FAST_WPM = 60
  const SLOW_WPM = 30
  const HIGH_ACCURACY = 95
  const LOW_ACCURACY = 80
  const LOW_VARIANCE = 150  // Very consistent rhythm
  const HIGH_VARIANCE = 400  // Very inconsistent rhythm
  const HIGH_TYPO_RATE = 20  // More than 20% typos is considered inaccurate

  // Analyze characteristics
  const isFast = wpm >= FAST_WPM
  const isSlow = wpm < SLOW_WPM
  const isAccurate = accuracy >= HIGH_ACCURACY && typoRate < HIGH_TYPO_RATE
  const isInaccurate = accuracy < LOW_ACCURACY || typoRate >= HIGH_TYPO_RATE
  const isRhythmic = rhythmVariance < LOW_VARIANCE
  const isIrregular = rhythmVariance > HIGH_VARIANCE
  const isModerate = !isFast && !isSlow

  // Determine archetype based on combinations
  let archetype = null
  let traits = []
  let reading = ''

  // Fast + Inaccurate = "The Rushing Wind"
  if (isFast && isInaccurate) {
    archetype = {
      name: 'The Rushing Wind',
      symbol: '🌪️',
      description: 'You move through life with speed and momentum, but sometimes miss the details along the way.'
    }
    traits = ['Impulsive', 'Energetic', 'Action-oriented', 'Risk-taker']
    reading = "You don't stop to smell the roses—you're too busy creating storms. Your fast pace and occasional stumbles reveal someone who values momentum over perfection. You'd rather try and fail than wait and wonder. This energy serves you well in dynamic environments, but remember: even the wind needs to rest."
  }
  // Slow + Rhythmic = "The Musical Soul"
  else if (isSlow && isRhythmic) {
    archetype = {
      name: 'The Musical Soul',
      symbol: '🎵',
      description: 'Your typing flows like a melody, steady and harmonious.'
    }
    traits = ['Thoughtful', 'Artistic', 'Patient', 'Harmonious']
    reading = "Your rhythm reveals a musical soul. You don't rush—you flow. Each keystroke is like a note in a composition, carefully placed and perfectly timed. This suggests someone who appreciates beauty, art, and the spaces between actions. You're likely drawn to music, poetry, or any form where timing and rhythm matter."
  }
  // Spam detection - if spam patterns detected, always "Rushing Wind"
  if (isSpam) {
    archetype = {
      name: 'The Rushing Wind',
      symbol: '🌪️',
      description: 'You move through life with speed and momentum, but sometimes miss the details along the way.'
    }
    traits = ['Impulsive', 'Energetic', 'Action-oriented', 'Risk-taker']
    reading = "You don't stop to smell the roses—you're too busy creating storms. Your fast pace and occasional stumbles reveal someone who values momentum over perfection. You'd rather try and fail than wait and wonder. This energy serves you well in dynamic environments, but remember: even the wind needs to rest."
  }
  // Fast + Accurate = "The Precision Arrow"
  else if (isFast && isAccurate) {
    archetype = {
      name: 'The Precision Arrow',
      symbol: '🎯',
      description: 'Swift and accurate, you hit your targets with remarkable consistency.'
    }
    traits = ['Focused', 'Efficient', 'Competent', 'Goal-oriented']
    reading = "You're a force of precision. Fast and accurate, you move through tasks like a well-aimed arrow. This combination suggests someone who has mastered their craft through practice and maintains high standards. You value both speed and quality—a rare and powerful combination."
  }
  // Slow + Accurate = "The Careful Architect"
  else if (isSlow && isAccurate) {
    archetype = {
      name: 'The Careful Architect',
      symbol: '🏛️',
      description: 'You build your thoughts carefully, ensuring every detail is perfect.'
    }
    traits = ['Meticulous', 'Deliberate', 'Quality-focused', 'Methodical']
    reading = "You are the careful architect of your words. Slow and precise, you build each sentence with intention. This reveals someone who values quality over quantity, who thinks before they act, and who creates lasting structures rather than temporary ones. Your patience is your strength."
  }
  // Moderate + Rhythmic = "The Balanced Flow"
  else if (isModerate && isRhythmic) {
    archetype = {
      name: 'The Balanced Flow',
      symbol: '🌊',
      description: 'You move through life with steady, consistent rhythm.'
    }
    traits = ['Balanced', 'Consistent', 'Reliable', 'Centered']
    reading = "You embody balance. Your moderate pace and consistent rhythm suggest someone who has found their flow. You're not too fast, not too slow—just right. This indicates a person who has learned to pace themselves, who understands the value of steady progress over bursts of energy."
  }
  // Irregular rhythm = "The Creative Storm"
  else if (isIrregular) {
    archetype = {
      name: 'The Creative Storm',
      symbol: '⚡',
      description: 'Your typing pattern is unpredictable, like bursts of creative energy.'
    }
    traits = ['Creative', 'Unpredictable', 'Spontaneous', 'Innovative']
    reading = "Your irregular rhythm reveals a creative storm within. You don't follow predictable patterns—you create your own. This suggests someone who thinks outside the box, who values spontaneity, and who brings fresh perspectives to everything they do. Your unpredictability is your superpower."
  }
  // Default: "The Thoughtful Wanderer"
  else {
    archetype = {
      name: 'The Thoughtful Wanderer',
      symbol: '🧭',
      description: 'You move at your own pace, exploring thoughts and ideas as they come.'
    }
    traits = ['Contemplative', 'Curious', 'Adaptable', 'Open-minded']
    reading = "You are the thoughtful wanderer. Your typing pattern doesn't fit into neat categories, and that's beautiful. You move through ideas at your own pace, exploring and adapting. This suggests someone who is open to new experiences, who doesn't rush to conclusions, and who values the journey as much as the destination."
  }

  return {
    archetype,
    traits,
    reading,
    metrics: {
      wpm,
      accuracy,
      rhythmVariance,
      averageRhythm
    }
  }
}

