// Common English words dictionary for validation
// This is a subset of the most common English words
const COMMON_WORDS = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'been', 'by', 'for', 'from',
  'has', 'he', 'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the', 'to',
  'was', 'will', 'with', 'the', 'this', 'but', 'they', 'have', 'had', 'what',
  'said', 'each', 'which', 'their', 'time', 'if', 'up', 'out', 'many', 'then',
  'them', 'these', 'so', 'some', 'her', 'would', 'make', 'like', 'into', 'him',
  'has', 'two', 'more', 'write', 'go', 'see', 'number', 'no', 'way', 'could',
  'people', 'my', 'than', 'first', 'water', 'been', 'call', 'who', 'oil', 'sit',
  'now', 'find', 'down', 'day', 'did', 'get', 'come', 'made', 'may', 'part',
  'over', 'new', 'sound', 'take', 'only', 'little', 'work', 'know', 'place', 'year',
  'live', 'me', 'back', 'give', 'most', 'very', 'after', 'thing', 'our', 'just',
  'name', 'good', 'sentence', 'man', 'think', 'say', 'great', 'where', 'help', 'through',
  'much', 'before', 'line', 'right', 'too', 'mean', 'old', 'any', 'same', 'tell',
  'boy', 'follow', 'came', 'want', 'show', 'also', 'around', 'form', 'three', 'small',
  'set', 'put', 'end', 'does', 'another', 'well', 'large', 'must', 'big', 'even',
  'such', 'because', 'turn', 'here', 'why', 'ask', 'went', 'men', 'read', 'need',
  'land', 'different', 'home', 'us', 'move', 'try', 'kind', 'hand', 'picture', 'again',
  'change', 'off', 'play', 'spell', 'air', 'away', 'animal', 'house', 'point', 'page',
  'letter', 'mother', 'answer', 'found', 'study', 'still', 'learn', 'should', 'America',
  'world', 'high', 'every', 'near', 'add', 'food', 'between', 'own', 'below', 'country',
  'plant', 'last', 'school', 'father', 'keep', 'tree', 'never', 'start', 'city', 'earth',
  'eye', 'light', 'thought', 'head', 'under', 'story', 'saw', 'left', 'don\'t', 'few',
  'while', 'along', 'might', 'close', 'something', 'seem', 'next', 'hard', 'open', 'example',
  'begin', 'life', 'always', 'those', 'both', 'paper', 'together', 'got', 'group', 'often',
  'run', 'important', 'until', 'children', 'side', 'feet', 'car', 'mile', 'night', 'walk',
  'white', 'sea', 'began', 'grow', 'took', 'river', 'four', 'carry', 'state', 'once',
  'book', 'hear', 'stop', 'without', 'second', 'later', 'miss', 'idea', 'enough', 'eat',
  'face', 'watch', 'far', 'Indian', 'really', 'almost', 'let', 'above', 'girl', 'sometimes',
  'mountain', 'cut', 'young', 'talk', 'soon', 'list', 'song', 'leave', 'family', 'it\'s'
])

// Extended word list - add more common words
const EXTENDED_WORDS = new Set([
  'about', 'all', 'also', 'and', 'as', 'at', 'be', 'because', 'but', 'by',
  'can', 'come', 'could', 'day', 'do', 'even', 'find', 'first', 'for', 'from',
  'get', 'give', 'go', 'have', 'he', 'her', 'here', 'him', 'his', 'how',
  'I', 'if', 'in', 'into', 'it', 'its', 'just', 'know', 'like', 'look',
  'make', 'man', 'many', 'me', 'more', 'my', 'new', 'no', 'not', 'now',
  'of', 'on', 'one', 'only', 'or', 'other', 'our', 'out', 'over', 'people',
  'say', 'see', 'she', 'so', 'some', 'take', 'than', 'that', 'the', 'their',
  'them', 'then', 'there', 'these', 'they', 'thing', 'think', 'this', 'those',
  'time', 'to', 'two', 'up', 'use', 'very', 'want', 'way', 'we', 'well',
  'what', 'when', 'which', 'who', 'will', 'with', 'would', 'write', 'you', 'your',
  'able', 'after', 'again', 'against', 'age', 'ago', 'air', 'all', 'along', 'already',
  'also', 'although', 'always', 'am', 'among', 'an', 'and', 'another', 'any', 'anyone',
  'anything', 'appear', 'are', 'area', 'around', 'as', 'ask', 'at', 'away', 'back',
  'bad', 'be', 'became', 'because', 'become', 'been', 'before', 'began', 'begin', 'being',
  'believe', 'below', 'best', 'better', 'between', 'big', 'both', 'boy', 'bring', 'brought',
  'build', 'built', 'but', 'by', 'call', 'came', 'can', 'cannot', 'car', 'care',
  'carry', 'case', 'cat', 'catch', 'caught', 'cause', 'certain', 'change', 'child', 'children',
  'city', 'close', 'come', 'common', 'complete', 'consider', 'contain', 'continue', 'could', 'country',
  'course', 'cover', 'cut', 'dark', 'day', 'deal', 'decide', 'deep', 'develop', 'did',
  'different', 'do', 'does', 'dog', 'done', 'door', 'down', 'draw', 'dream', 'drive',
  'drop', 'dry', 'during', 'each', 'early', 'earth', 'east', 'easy', 'eat', 'effect',
  'eight', 'either', 'else', 'end', 'enough', 'even', 'ever', 'every', 'example', 'eye',
  'face', 'fact', 'fall', 'family', 'far', 'farm', 'fast', 'father', 'fear', 'feel',
  'feet', 'felt', 'few', 'field', 'fight', 'figure', 'fill', 'final', 'find', 'fine',
  'fire', 'first', 'fish', 'five', 'floor', 'fly', 'follow', 'food', 'foot', 'for',
  'force', 'form', 'found', 'four', 'free', 'friend', 'from', 'front', 'full', 'fun',
  'game', 'gave', 'general', 'get', 'girl', 'give', 'glad', 'glass', 'go', 'god',
  'gold', 'gone', 'good', 'got', 'government', 'great', 'green', 'ground', 'group', 'grow',
  'grew', 'grow', 'guess', 'gun', 'had', 'hair', 'half', 'hand', 'happen', 'happy',
  'hard', 'has', 'hat', 'have', 'he', 'head', 'hear', 'heard', 'heart', 'heat',
  'heavy', 'held', 'help', 'her', 'here', 'high', 'hill', 'him', 'his', 'hit',
  'hold', 'hole', 'home', 'hope', 'horse', 'hot', 'hour', 'house', 'how', 'however',
  'human', 'hundred', 'hunt', 'I', 'idea', 'if', 'important', 'in', 'inch', 'include',
  'increase', 'indeed', 'inside', 'instead', 'interest', 'into', 'is', 'island', 'it', 'its',
  'job', 'join', 'just', 'keep', 'kept', 'key', 'kill', 'kind', 'king', 'knew',
  'know', 'known', 'land', 'language', 'large', 'last', 'late', 'later', 'laugh', 'law',
  'lay', 'lead', 'learn', 'least', 'leave', 'led', 'left', 'leg', 'length', 'less',
  'let', 'letter', 'level', 'lie', 'life', 'lift', 'light', 'like', 'line', 'list',
  'listen', 'little', 'live', 'lived', 'long', 'look', 'lost', 'lot', 'love', 'low',
  'machine', 'made', 'main', 'make', 'man', 'many', 'map', 'mark', 'matter', 'may',
  'maybe', 'me', 'mean', 'meant', 'measure', 'meat', 'meet', 'men', 'metal', 'method',
  'middle', 'might', 'mile', 'milk', 'million', 'mind', 'mine', 'minute', 'miss', 'money',
  'month', 'moon', 'more', 'morning', 'most', 'mother', 'mountain', 'mouth', 'move', 'much',
  'music', 'must', 'my', 'name', 'nation', 'natural', 'nature', 'near', 'nearly', 'necessary',
  'need', 'never', 'new', 'next', 'night', 'nine', 'no', 'none', 'noon', 'nor',
  'north', 'nose', 'not', 'note', 'nothing', 'notice', 'now', 'number', 'object', 'observe',
  'ocean', 'of', 'off', 'offer', 'office', 'often', 'oh', 'oil', 'old', 'on',
  'once', 'one', 'only', 'open', 'operate', 'opinion', 'or', 'order', 'organize', 'original',
  'other', 'our', 'out', 'outside', 'over', 'own', 'page', 'paint', 'pair', 'paper',
  'paragraph', 'parent', 'park', 'part', 'particular', 'party', 'pass', 'past', 'path', 'pattern',
  'pay', 'people', 'per', 'perhaps', 'period', 'person', 'pick', 'picture', 'piece', 'place',
  'plain', 'plan', 'plane', 'planet', 'plant', 'play', 'please', 'point', 'police', 'position',
  'possible', 'post', 'pound', 'power', 'practice', 'prepare', 'present', 'press', 'pretty', 'print',
  'probably', 'problem', 'process', 'produce', 'product', 'program', 'project', 'property', 'protect', 'prove',
  'provide', 'public', 'pull', 'purpose', 'push', 'put', 'question', 'quick', 'quickly', 'quiet',
  'quite', 'race', 'radio', 'rain', 'raise', 'ran', 'range', 'rather', 'reach', 'read',
  'ready', 'real', 'realize', 'really', 'reason', 'receive', 'record', 'red', 'region', 'relate',
  'remember', 'repeat', 'report', 'represent', 'require', 'rest', 'result', 'return', 'ride', 'right',
  'ring', 'rise', 'river', 'road', 'rock', 'room', 'round', 'rule', 'run', 'safe',
  'said', 'sail', 'same', 'sand', 'sat', 'save', 'saw', 'say', 'scale', 'school',
  'science', 'score', 'sea', 'season', 'seat', 'second', 'section', 'see', 'seed', 'seem',
  'seen', 'sell', 'send', 'sense', 'sent', 'sentence', 'separate', 'serve', 'set', 'settle',
  'seven', 'several', 'shall', 'shape', 'share', 'sharp', 'she', 'sheet', 'shelf', 'shell',
  'ship', 'shirt', 'shoe', 'shoot', 'shop', 'shore', 'short', 'should', 'shoulder', 'shout',
  'show', 'shown', 'shut', 'sick', 'side', 'sight', 'sign', 'signal', 'silent', 'similar',
  'simple', 'since', 'sing', 'single', 'sink', 'sir', 'sister', 'sit', 'six', 'size',
  'skill', 'skin', 'sky', 'slave', 'sleep', 'slide', 'slight', 'slow', 'slowly', 'small',
  'smell', 'smile', 'snow', 'so', 'soap', 'social', 'society', 'soft', 'soil', 'sold',
  'soldier', 'solution', 'solve', 'some', 'someone', 'something', 'sometimes', 'son', 'song', 'soon',
  'sort', 'soul', 'sound', 'south', 'space', 'speak', 'special', 'speech', 'speed', 'spell',
  'spend', 'spoke', 'spot', 'spread', 'spring', 'square', 'stand', 'standard', 'star', 'start',
  'state', 'statement', 'station', 'stay', 'steam', 'steel', 'step', 'stick', 'still', 'stone',
  'stood', 'stop', 'store', 'story', 'straight', 'strange', 'stream', 'street', 'stretch', 'strike',
  'string', 'strong', 'structure', 'student', 'study', 'subject', 'substance', 'success', 'such', 'sudden',
  'sugar', 'suggest', 'suit', 'summer', 'sun', 'supply', 'support', 'suppose', 'sure', 'surface',
  'surprise', 'swim', 'symbol', 'system', 'table', 'tail', 'take', 'talk', 'tall', 'taste',
  'tax', 'tea', 'teach', 'team', 'teeth', 'tell', 'temperature', 'ten', 'term', 'test',
  'than', 'thank', 'that', 'the', 'their', 'them', 'themselves', 'then', 'there', 'therefore',
  'these', 'they', 'thick', 'thin', 'thing', 'think', 'third', 'this', 'those', 'though',
  'thought', 'thousand', 'three', 'through', 'throw', 'thus', 'tie', 'tight', 'time', 'tin',
  'tiny', 'tip', 'tire', 'to', 'tobacco', 'today', 'toe', 'together', 'told', 'tomorrow',
  'tone', 'tongue', 'tonight', 'too', 'took', 'tool', 'tooth', 'top', 'topic', 'total',
  'touch', 'toward', 'town', 'track', 'trade', 'train', 'travel', 'tree', 'triangle', 'tribe',
  'trick', 'tried', 'trip', 'troop', 'trouble', 'truck', 'true', 'truly', 'trust', 'truth',
  'try', 'tube', 'tune', 'turn', 'twelve', 'twenty', 'twice', 'two', 'type', 'under',
  'understand', 'unit', 'until', 'up', 'upon', 'upper', 'urban', 'urge', 'us', 'use',
  'used', 'useful', 'usual', 'usually', 'valley', 'value', 'various', 'vast', 'vegetable', 'verb',
  'very', 'vessel', 'victory', 'view', 'village', 'visit', 'voice', 'volume', 'vote', 'wait',
  'walk', 'wall', 'want', 'war', 'warm', 'warn', 'was', 'wash', 'waste', 'watch',
  'water', 'wave', 'way', 'we', 'weak', 'wealth', 'weapon', 'wear', 'weather', 'week',
  'weight', 'welcome', 'well', 'went', 'were', 'west', 'western', 'wet', 'what', 'whatever',
  'wheat', 'wheel', 'when', 'whenever', 'where', 'wherever', 'whether', 'which', 'while', 'whisper',
  'white', 'who', 'whole', 'whom', 'whose', 'why', 'wide', 'wife', 'wild', 'will',
  'willing', 'win', 'wind', 'window', 'wing', 'winter', 'wire', 'wise', 'wish', 'with',
  'within', 'without', 'woman', 'women', 'wonder', 'wonderful', 'wood', 'wooden', 'wool', 'word',
  'wore', 'work', 'worker', 'world', 'worn', 'worry', 'worse', 'worth', 'would', 'write',
  'writer', 'written', 'wrong', 'wrote', 'yard', 'yeah', 'year', 'yellow', 'yes', 'yesterday',
  'yet', 'you', 'young', 'your', 'yourself', 'youth'
])

// Combine both word sets
const VALID_WORDS = new Set([...COMMON_WORDS, ...EXTENDED_WORDS])

// Clean word for validation (remove punctuation, convert to lowercase)
function cleanWord(word) {
  return word.toLowerCase().replace(/[^a-z]/g, '')
}

// Check if a word is valid (exists in dictionary)
export function isValidWord(word) {
  if (!word || word.trim().length === 0) return false
  const cleaned = cleanWord(word)
  return cleaned.length > 0 && VALID_WORDS.has(cleaned)
}

// Calculate word validity metrics from text
export function calculateWordValidity(text) {
  if (!text || text.trim().length === 0) {
    return {
      totalWords: 0,
      validWords: 0,
      invalidWords: 0,
      validityRate: 0
    }
  }

  const words = text.trim().split(/\s+/).filter(word => word.length > 0)
  const validWords = words.filter(word => isValidWord(word))
  const invalidWords = words.filter(word => !isValidWord(word))
  
  const validityRate = words.length > 0 
    ? (validWords.length / words.length) * 100 
    : 0

  return {
    totalWords: words.length,
    validWords: validWords.length,
    invalidWords: invalidWords.length,
    validityRate: Math.round(validityRate * 10) / 10
  }
}

