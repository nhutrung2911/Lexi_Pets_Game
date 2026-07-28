import { useState, useEffect, useCallback, useRef } from 'react';
import { generateWordSearch } from '../../utils/wordSearch';
import { useAuthStore } from '../../store/authStore';
import { useProfile } from '../../hooks/useProfile';
import { useActivePet } from '../../hooks/useActivePet';
import { supabase } from '../../lib/supabase';
import { Trophy, Coins, Zap, ArrowRight, Flame, Lightbulb } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { audio } from '../../utils/audio';
import { seededShuffle, getLevelForStage, selectWordsForStage } from '../../utils/random';
import { EXPANDED_WORDS_TO_LEARN } from '../../utils/wordList';

interface WordSearchGameProps {
  initialStage: number;
  mode: 'campaign' | 'challenge';
  onBack: () => void;
  onWin: () => void;
}

export function WordSearchGame({ initialStage, mode, onBack, onWin }: WordSearchGameProps) {
  const { user } = useAuthStore();
  const { refetch: refetchProfile } = useProfile();
  const { data: pet, refetch: refetchPet } = useActivePet();

  const [grid, setGrid] = useState<string[][]>([]);
  const [words, setWords] = useState<string[]>([]);
  const [wordMeanings, setWordMeanings] = useState<Record<string, string>>({});
  const [foundWords, setFoundWords] = useState<string[]>([]);
  
  const [isDragging, setIsDragging] = useState(false);
  const [startCell, setStartCell] = useState<{r: number, c: number} | null>(null);
  const [currentSelection, setCurrentSelection] = useState<{r: number, c: number}[]>([]);
  const [foundCells, setFoundCells] = useState<{r: number, c: number}[]>([]);
  
  const [showVictory, setShowVictory] = useState(false);
  const [reward, setReward] = useState({ exp: 0, coins: 0, bonusExp: 0 });

  // Enhancements State
  const [combo, setCombo] = useState(1);
  const [maxCombo, setMaxCombo] = useState(1);
  const [comboTimeLeft, setComboTimeLeft] = useState(0);
  const comboTimerRef = useRef<number | null>(null);

  const [shake, setShake] = useState(false);
  const [floatingTexts, setFloatingTexts] = useState<{id: number, text: string, x: number, y: number}[]>([]);
  const floatIdRef = useRef(0);

  // Stage & Hint State
  const [stage, setStage] = useState(1);
  const [hintsRemaining, setHintsRemaining] = useState(1);
  const [hintedCell, setHintedCell] = useState<{r: number, c: number} | null>(null);
  const [gridSize, setGridSize] = useState(6);

  // Combo timer effect
  useEffect(() => {
    if (comboTimeLeft > 0) {
      comboTimerRef.current = window.setTimeout(() => setComboTimeLeft(prev => prev - 100), 100);
    } else if (comboTimeLeft <= 0 && combo > 1) {
      setCombo(1);
    }
    return () => {
      if (comboTimerRef.current) clearTimeout(comboTimerRef.current);
    };
  }, [comboTimeLeft, combo]);

  useEffect(() => {
    startNewGame(initialStage);
  }, [initialStage, mode]);

  const startNewGame = async (newStage: number = 1) => {
    setStage(newStage);
    
    // In challenge mode, no hints. In campaign, you get 1.
    setHintsRemaining(mode === 'challenge' ? 0 : 1);
    setHintedCell(null);
    
    // Dynamic difficulty
    let size = 14;
    let numWords = 12;
    // Fetch from Supabase
    const { level } = getLevelForStage(newStage);
    const { data, error } = await supabase
      .from('vocabulary')
      .select('word, meaning_vi')
      .eq('level', level);

    let fetchedWords = [];
    if (data && !error && data.length > 0) {
      fetchedWords = data;
    } else {
      // Fallback if db fails or is empty
      fetchedWords = EXPANDED_WORDS_TO_LEARN.map(w => ({ word: w, meaning_vi: "Lỗi kết nối hoặc chưa có từ vựng" }));
    }

    let selectedWords;

    if (mode === 'campaign') {
      size = 12;
      selectedWords = selectWordsForStage(newStage, fetchedWords, w => w.word);
    } else {
      size = 12;
      numWords = 9;
      const validWords = fetchedWords.filter(w => w.word.length <= size);
      const poolToUse = validWords.length >= numWords ? validWords : fetchedWords;
      const shuffled = seededShuffle(poolToUse, Date.now()); // True random for challenge
      selectedWords = shuffled.slice(0, numWords);
    }

    const wordStrings = selectedWords.map(item => item.word);
    const meaningsMap = selectedWords.reduce((acc, curr) => ({ ...acc, [curr.word]: curr.meaning_vi }), {});

    const puzzle = generateWordSearch(wordStrings, size);
    setGridSize(size);
    setGrid(puzzle.grid);
    setWords(puzzle.words);
    setWordMeanings(meaningsMap);
    setFoundWords([]);
    setFoundCells([]);
    setShowVictory(false);
    setCombo(1);
    setMaxCombo(1);
    setComboTimeLeft(0);
  };

  const useHint = () => {
    if (hintsRemaining <= 0) return;
    
    const unfoundWords = words.filter(w => !foundWords.includes(w));
    if (unfoundWords.length === 0) return;
    
    const wordToFind = unfoundWords[0];
    const dr = [-1, -1, -1, 0, 0, 1, 1, 1];
    const dc = [-1, 0, 1, -1, 1, -1, 0, 1];
    
    let found = false;
    for (let r = 0; r < gridSize && !found; r++) {
      for (let c = 0; c < gridSize && !found; c++) {
        if (grid[r][c] === wordToFind[0]) {
          for (let d = 0; d < 8; d++) {
            let match = true;
            for (let k = 1; k < wordToFind.length; k++) {
              const nr = r + dr[d] * k;
              const nc = c + dc[d] * k;
              if (nr < 0 || nr >= gridSize || nc < 0 || nc >= gridSize || grid[nr][nc] !== wordToFind[k]) {
                match = false;
                break;
              }
            }
            if (match) {
              setHintedCell({r, c});
              setHintsRemaining(prev => prev - 1);
              audio.success(); // Play a nice sound for hint
              found = true;
              break;
            }
          }
        }
      }
    }
  };

  const handlePointerDown = (r: number, c: number) => {
    if (hintedCell && hintedCell.r === r && hintedCell.c === c) {
      setHintedCell(null);
    }

    setIsDragging(true);
    setStartCell({ r, c });
    setCurrentSelection([{ r, c }]);
    audio.pop();
  };

  const handlePointerEnter = (r: number, c: number) => {
    if (!isDragging || !startCell) return;

    // Must be a straight line (horizontal, vertical, or diagonal)
    const dr = r - startCell.r;
    const dc = c - startCell.c;
    
    // Check if it's a straight line
    if (dr === 0 || dc === 0 || Math.abs(dr) === Math.abs(dc)) {
      const steps = Math.max(Math.abs(dr), Math.abs(dc));
      const stepR = dr === 0 ? 0 : dr / steps;
      const stepC = dc === 0 ? 0 : dc / steps;

      const newSelection = [];
      for (let i = 0; i <= steps; i++) {
        newSelection.push({
          r: startCell.r + i * stepR,
          c: startCell.c + i * stepC
        });
      }
      
      // Play pop sound if selection changed
      if (currentSelection.length !== newSelection.length) {
        audio.pop();
      }
      
      setCurrentSelection(newSelection);
    }
  };

  const handlePointerUp = useCallback(async () => {
    if (!isDragging) return;
    setIsDragging(false);
    
    // Extract the word
    const selectedWord = currentSelection.map(cell => grid[cell.r][cell.c]).join('');
    const reversedWord = selectedWord.split('').reverse().join('');

    if (words.includes(selectedWord) && !foundWords.includes(selectedWord)) {
      handleWordFound(selectedWord, currentSelection);
    } else if (words.includes(reversedWord) && !foundWords.includes(reversedWord)) {
      handleWordFound(reversedWord, currentSelection);
    } else if (currentSelection.length > 1) {
      // Error
      audio.error();
      setShake(true);
      setTimeout(() => setShake(false), 400);
    }
    
    setCurrentSelection([]);
  }, [isDragging, currentSelection, grid, words, foundWords]);

  const handleWordFound = (word: string, cells: {r: number, c: number}[]) => {
    audio.success();
    
    const newFoundWords = [...foundWords, word];
    setFoundWords(newFoundWords);
    setFoundCells([...foundCells, ...cells]);

    // Combo Logic
    const newCombo = combo + 1;
    setCombo(newCombo);
    if (newCombo > maxCombo) setMaxCombo(newCombo);
    setComboTimeLeft(5000); // 5 seconds for combo

    // Floating text
    const midCell = cells[Math.floor(cells.length / 2)];
    const newFloat = { id: floatIdRef.current++, text: `+10 EXP (x${newCombo})`, x: midCell.c, y: midCell.r };
    setFloatingTexts(prev => [...prev, newFloat]);
    setTimeout(() => {
      setFloatingTexts(prev => prev.filter(f => f.id !== newFloat.id));
    }, 1500);

    if (newFoundWords.length === words.length) {
      handleVictory(newCombo > maxCombo ? newCombo : maxCombo);
    }
  };

  const handleVictory = async (finalMaxCombo: number) => {
    audio.victory();
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#facc15', '#38bdf8', '#fb7185', '#a3e635']
    });

    const baseExp = 50;
    const coinReward = 20;
    const bonusExp = Math.floor(baseExp * (finalMaxCombo * 0.2)); // 20% extra exp per combo level
    const totalExp = baseExp + bonusExp;

    setReward({ exp: baseExp, coins: coinReward, bonusExp });
    setShowVictory(true);

    if (user && pet) {
      // Handle EXP and Level Up
      let newExp = pet.exp + totalExp;
      let newLevel = pet.level;
      if (newExp >= newLevel * 100) {
        newExp = newExp - (newLevel * 100);
        newLevel += 1;
      }

      // Grant EXP to Pet
      await supabase.from('user_pets').update({
        exp: newExp,
        level: newLevel
      }).eq('id', pet.id);
      
      // Grant Coins to User
      const { data: profile } = await supabase.from('profiles').select('coins').eq('id', user.id).single();
      if (profile) {
        await supabase.from('profiles').update({
          coins: profile.coins + coinReward
        }).eq('id', user.id);
      }

      refetchPet();
      refetchProfile();
    }
  };

  const isCellSelected = (r: number, c: number) => {
    return currentSelection.some(cell => cell.r === r && cell.c === c);
  };

  const isCellFound = (r: number, c: number) => {
    return foundCells.some(cell => cell.r === r && cell.c === c);
  };

  return (
    <div 
      className="min-h-[100dvh] flex flex-col items-center py-4 md:py-6 pb-24 text-slate-800 font-sans touch-none"
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      <header className="mb-4 w-full max-w-md">
        <div className="bg-amber-950/80 backdrop-blur-sm p-4 rounded-3xl border-2 border-amber-700/50 shadow-[0_10px_20px_-10px_rgba(0,0,0,0.5)] text-center relative overflow-hidden">
          {/* Decorative screws */}
          <div className="absolute top-3 left-3 w-3 h-3 bg-slate-800 rounded-full shadow-inner" />
          <div className="absolute top-3 right-3 w-3 h-3 bg-slate-800 rounded-full shadow-inner" />
          <div className="absolute bottom-3 left-3 w-3 h-3 bg-slate-800 rounded-full shadow-inner" />
          <div className="absolute bottom-3 right-3 w-3 h-3 bg-slate-800 rounded-full shadow-inner" />

          <button 
            onClick={onBack}
            className="absolute top-1/2 -translate-y-1/2 left-4 w-10 h-10 bg-amber-800 hover:bg-amber-700 text-amber-200 rounded-full flex items-center justify-center transition-colors border border-amber-600/50"
          >
            <ArrowRight className="w-5 h-5 rotate-180" />
          </button>

          <h1 className="text-3xl font-black text-amber-400 drop-shadow-md mb-2 tracking-wide uppercase">
            {mode === 'campaign' ? `Stage ${stage}` : 'Challenge'}
          </h1>
          
          <div className="w-full bg-amber-900/50 rounded-full h-3 mt-4 border border-amber-800/50 overflow-hidden shadow-inner relative">
            <div 
              className="bg-gradient-to-r from-green-500 to-emerald-400 h-full transition-all duration-500 relative"
              style={{ width: `${(foundWords.length / words.length) * 100}%` }}
            >
              <div className="absolute inset-0 bg-white/20 w-full animate-pulse" />
            </div>
          </div>
          <p className="text-amber-200/70 font-bold text-sm mt-2">
            {foundWords.length} / {words.length} Words Found
          </p>
        </div>
      </header>

      {/* Combo Indicator */}
      {combo > 1 && (
        <div className="absolute top-20 right-4 md:right-10 flex flex-col items-end z-20 animate-float-up">
          <div className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-full font-black text-xl shadow-lg shadow-orange-500/50">
            <Flame className="w-6 h-6 animate-pulse" />
            COMBO x{combo}
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2 mt-2 overflow-hidden border border-slate-700">
            <div 
              className="bg-orange-400 h-full transition-all duration-100"
              style={{ width: `${(comboTimeLeft / 5000) * 100}%` }}
            />
          </div>
        </div>
      )}

      <div className={`flex flex-col ${mode === 'challenge' ? 'lg:flex-row lg:items-start lg:justify-center' : 'items-center'} gap-6 lg:gap-12 w-full max-w-7xl px-2 md:px-8`}>
        
        {/* Grid */}
        <div className={`bg-[#5c2a12] p-3 md:p-4 rounded-3xl border-4 border-[#3e1909] shadow-[inset_0_0_30px_rgba(0,0,0,0.7),_0_20px_25px_-5px_rgba(0,0,0,0.5)] relative ${shake ? 'animate-shake' : ''} ${mode === 'challenge' ? 'lg:mx-0 mx-auto' : 'mx-auto mb-4'}`}>
          
          {/* Floating Texts */}
          {floatingTexts.map(ft => (
            <div 
              key={ft.id} 
              className="absolute z-30 font-black text-yellow-400 text-2xl animate-float-up pointer-events-none drop-shadow-md"
              style={{ 
                left: `calc(${ft.x * 10}% + 20px)`, 
                top: `calc(${ft.y * 10}% + 20px)` 
              }}
            >
              {ft.text}
            </div>
          ))}

          <div 
            className="grid gap-1 md:gap-1.5 lg:gap-2" 
            style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}
          >
            {grid.map((row, r) => (
              row.map((letter, c) => {
                const selected = isCellSelected(r, c);
                const found = isCellFound(r, c);
                const isHinted = hintedCell && hintedCell.r === r && hintedCell.c === c;
                
                let bgClass = "bg-amber-100 text-amber-900 border-2 border-amber-200 shadow-[0_4px_0_#d97706] hover:bg-white hover:-translate-y-0.5 hover:shadow-[0_6px_0_#d97706]";
                if (found) bgClass = "bg-[#22c55e] text-white border-2 border-[#16a34a] shadow-[0_0_0_#15803d] translate-y-1 opacity-90";
                else if (selected) bgClass = "bg-yellow-400 text-amber-900 border-2 border-yellow-200 shadow-[0_4px_0_#ca8a04] brightness-110 scale-105 z-10";
                else if (isHinted) bgClass = "bg-purple-500 text-white border-2 border-purple-400 shadow-[0_4px_0_#7e22ce] animate-pulse ring-4 ring-purple-400/50 scale-105 z-10";

                return (
                  <div
                    key={`${r}-${c}`}
                    onPointerDown={(e) => { e.preventDefault(); handlePointerDown(r, c); }}
                    onPointerEnter={() => handlePointerEnter(r, c)}
                    className={`w-7 h-7 sm:w-9 sm:h-9 md:w-11 md:h-11 lg:w-12 lg:h-12 flex items-center justify-center text-lg md:text-xl lg:text-2xl font-black rounded-lg transition-all duration-150 cursor-pointer select-none ${bgClass}`}
                  >
                    {letter}
                  </div>
                );
              })
            ))}
          </div>
        </div>

        {/* Word List */}
        <div className={`bg-amber-950/60 p-4 rounded-2xl border border-amber-900/50 shadow-inner w-full ${mode === 'challenge' ? 'lg:max-w-md max-w-full' : 'max-w-md mx-auto'}`}>
          <div className="flex flex-wrap justify-center gap-2 md:gap-3">
            {words.map(word => {
              const isFound = foundWords.includes(word);
              return (
                <div 
                  key={word}
                  className={`px-4 py-2 rounded-xl flex flex-col items-center justify-center transition-all duration-300 shadow-sm ${
                    isFound 
                      ? 'bg-green-900/40 border border-green-500/30 text-green-400 opacity-60 scale-95' 
                      : 'bg-[#fef3c7] border-2 border-amber-200 text-amber-900 shadow-[0_2px_0_#d97706]'
                  }`}
                >
                  <span className={`font-black ${isFound ? 'line-through' : ''}`}>{word}</span>
                  <span className="text-xs font-bold opacity-70 uppercase tracking-wider mt-0.5">{wordMeanings[word] || ""}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Hint Button */}
      {mode === 'campaign' && (
        <button 
          onClick={useHint}
          disabled={hintsRemaining <= 0 || showVictory}
          className={`mt-4 px-6 py-3 rounded-2xl font-black text-xl shadow-[0_4px_0_rgba(0,0,0,0.3)] transition-all flex items-center gap-2 ${
            hintsRemaining > 0 
              ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:brightness-110 hover:-translate-y-1 active:translate-y-1 active:shadow-[0_0_0_rgba(0,0,0,0)]' 
              : 'bg-slate-700/50 text-slate-500 border-2 border-slate-600 shadow-none'
          }`}
        >
          <Lightbulb className={`w-6 h-6 ${hintsRemaining > 0 ? 'text-yellow-300 animate-pulse' : 'text-slate-500'}`} />
          Use Hint ({hintsRemaining})
        </button>
      )}

      {/* Victory Modal */}
      {showVictory && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" />
          <div className="relative bg-slate-900 border border-slate-700 rounded-3xl p-8 shadow-2xl text-center max-w-sm w-full animate-in zoom-in duration-300">
            <div className="mx-auto w-20 h-20 bg-yellow-500/20 rounded-full flex items-center justify-center mb-6">
              <Trophy className="w-10 h-10 text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]" />
            </div>
            <h2 className="text-3xl font-black mb-2">Stage Clear!</h2>
            <p className="text-slate-400 font-medium mb-8">You found all the words.</p>
            
            <div className="flex justify-center gap-4 mb-8">
              <div className="bg-slate-800/50 p-4 rounded-2xl flex-1 border border-slate-700/50">
                <p className="text-slate-300 font-medium">EXP Gained</p>
                <div className="flex flex-col items-center">
                  <p className="text-2xl font-black text-blue-400">+{reward.exp}</p>
                  {reward.bonusExp > 0 && (
                    <p className="text-sm font-bold text-orange-400 flex items-center gap-1">
                      <Flame className="w-4 h-4" /> +{reward.bonusExp} Combo Bonus
                    </p>
                  )}
                </div>
              </div>
              <div className="bg-slate-800/50 p-4 rounded-2xl flex-1 border border-slate-700/50">
                <Coins className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                <p className="font-black text-xl text-yellow-400">+{reward.coins}</p>
                <p className="text-xs font-bold text-slate-500 uppercase mt-1">Coins</p>
              </div>
            </div>

            <button
              onClick={() => {
                setShowVictory(false);
                onWin();
              }}
              className="w-full py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:-translate-y-1 transition-all flex items-center justify-center gap-2 mb-3"
            >
              {mode === 'campaign' ? 'Next Stage' : 'Play Again'}
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={onBack}
              className="w-full py-4 rounded-xl font-bold text-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition-all"
            >
              Back to Menu
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
