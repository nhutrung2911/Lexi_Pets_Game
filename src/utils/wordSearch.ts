export interface WordSearchGrid {
  grid: string[][];
  words: string[];
}

export function generateWordSearch(wordsToFind: string[], size: number = 10): WordSearchGrid {
  const grid: string[][] = Array(size).fill(null).map(() => Array(size).fill(''));
  const uppercaseWords = wordsToFind.map(w => w.toUpperCase().replace(/[^A-Z]/g, ''));
  const placedWords: string[] = [];
  
  const directions = [
    [0, 1],   // Right
    [1, 0],   // Down
    [1, 1],   // Diagonal down-right
  ];

  for (const word of uppercaseWords) {
    let placed = false;
    let attempts = 0;
    while (!placed && attempts < 200) {
      attempts++;
      const dir = directions[Math.floor(Math.random() * directions.length)];
      const startRow = Math.floor(Math.random() * size);
      const startCol = Math.floor(Math.random() * size);

      let canPlace = true;
      for (let i = 0; i < word.length; i++) {
        const r = startRow + i * dir[0];
        const c = startCol + i * dir[1];
        if (r < 0 || r >= size || c < 0 || c >= size || (grid[r][c] !== '' && grid[r][c] !== word[i])) {
          canPlace = false;
          break;
        }
      }

      if (canPlace) {
        for (let i = 0; i < word.length; i++) {
          const r = startRow + i * dir[0];
          const c = startCol + i * dir[1];
          grid[r][c] = word[i];
        }
        placed = true;
        placedWords.push(word);
      }
    }
    
    if (!placed) {
        console.warn(`Could not place word: ${word}`);
    }
  }

  // Fill remaining spaces with random letters
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (grid[r][c] === '') {
        grid[r][c] = alphabet[Math.floor(Math.random() * alphabet.length)];
      }
    }
  }

  return { grid, words: placedWords };
}
