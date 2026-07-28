// Seeded Random Number Generator using Mulberry32
// https://github.com/bryc/code/blob/master/jshash/PRNGs.md

export function mulberry32(a: number) {
  return function() {
    var t = a += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }
}

// Helper to shuffle an array using a seeded PRNG
export function seededShuffle<T>(array: T[], seed: number): T[] {
  const result = [...array];
  const random = mulberry32(seed);
  
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  
  return result;
}

export function getLevelForStage(stage: number): { level: string, startStage: number } {
  if (stage <= 10) return { level: 'A1', startStage: 1 };
  if (stage <= 20) return { level: 'A2', startStage: 11 };
  if (stage <= 30) return { level: 'B1', startStage: 21 };
  if (stage <= 40) return { level: 'B2', startStage: 31 };
  if (stage <= 45) return { level: 'C1', startStage: 41 };
  return { level: 'C2', startStage: 46 };
}

export function selectWordsForStage<T>(
  stage: number, 
  fetchedWords: T[], 
  wordExtractor: (item: T) => string
): T[] {
  const { startStage } = getLevelForStage(stage);
  
  let size = 12; // Fixed 12x12 grid
  
  // 5-7 words for early stages, 8-10 for stage 30+
  // We'll use 6 as average for early, and 9 for stage 30+
  let numWords = stage >= 30 ? 9 : 6;
  
  const validWords = fetchedWords
    .filter(w => wordExtractor(w).length <= size)
    .sort((a, b) => wordExtractor(a).localeCompare(wordExtractor(b)));
    
  const poolToUse = validWords.length >= numWords ? validWords : [...fetchedWords].sort((a, b) => wordExtractor(a).length - wordExtractor(b).length);
  
  // Fixed seed for the entire level so the pool sequence is stable
  const shuffled = seededShuffle(poolToUse, 12345);
  
  // Calculate start index by summing numWords of previous stages in the same level
  let startIndex = 0;
  for (let i = startStage; i < stage; i++) {
    startIndex += (i >= 30 ? 9 : 6);
  }
  
  const selected: T[] = [];
  for (let i = 0; i < numWords; i++) {
    selected.push(shuffled[(startIndex + i) % shuffled.length]);
  }
  
  return selected;
}
