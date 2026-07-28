import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { ArrowLeft, ChevronLeft, ChevronRight, RotateCw, Volume2, Loader2 } from 'lucide-react';
import { seededShuffle, getLevelForStage, selectWordsForStage } from '../../utils/random';
import { autoEnrichWord } from '../../utils/dictionaryApi';

interface FlashcardsReviewProps {
  stage: number;
  onBack: () => void;
}

export function FlashcardsReview({ stage, onBack }: FlashcardsReviewProps) {
  const [words, setWords] = useState<{
    id: string;
    word: string; 
    meaning: string; 
    pos: string; 
    phonetics: string;
    audioUrl: string | null;
  }[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isEnriching, setIsEnriching] = useState(false);

  useEffect(() => {
    loadStageWords();
  }, [stage]);

  const loadStageWords = async () => {
    setLoading(true);
    
    // Exact same logic as WordSearchGame to guarantee same words
    let size = Math.min(14, 5 + Math.ceil(stage / 5));
    let numWords = Math.min(12, 2 + Math.ceil(stage / 4));
    
    const { level } = getLevelForStage(stage);

    const { data, error } = await supabase
      .from('vocabulary')
      .select('id, word, meaning_vi, part_of_speech, phonetics, audio_url')
      .eq('level', level);

    let fetchedWords = [];
    if (data && !error && data.length > 0) {
      fetchedWords = data;
    }

    const selected = selectWordsForStage(stage, fetchedWords, w => w.word);
    
    setWords(selected.map(w => ({ 
      id: w.id,
      word: w.word, 
      meaning: w.meaning_vi,
      pos: w.part_of_speech || '(n)',
      phonetics: w.phonetics || '/.../',
      audioUrl: w.audio_url || null
    })));
    setLoading(false);
  };

  // Auto enrich when viewing a new word
  useEffect(() => {
    if (words.length > 0) {
      const currentWord = words[currentIndex];
      if (currentWord.phonetics === '/.../' || !currentWord.audioUrl) {
        handleEnrich(currentWord);
      } else {
        // Auto play audio when navigating to new card
        playAudio(currentWord);
      }
    }
  }, [currentIndex, words.length]);

  const handleEnrich = async (wordData: typeof words[0]) => {
    setIsEnriching(true);
    const updates = await autoEnrichWord(wordData.id, wordData.word);
    if (updates) {
      // Update local state so UI reflects immediately
      setWords(prev => prev.map(w => {
        if (w.id === wordData.id) {
          const newW = { ...w };
          if (updates.phonetics) newW.phonetics = updates.phonetics;
          if (updates.audio_url) newW.audioUrl = updates.audio_url;
          if (updates.part_of_speech) newW.pos = updates.part_of_speech;
          return newW;
        }
        return w;
      }));
      
      // Auto play if we just found an audio url
      if (updates.audio_url) {
        const audio = new Audio(updates.audio_url);
        audio.play().catch(e => console.log('Audio autoplay blocked:', e));
      } else {
        fallbackTTS(wordData.word);
      }
    } else {
      // If API failed, play TTS fallback
      fallbackTTS(wordData.word);
    }
    setIsEnriching(false);
  };

  const playAudio = (wordData: typeof words[0]) => {
    if (wordData.audioUrl) {
      const audio = new Audio(wordData.audioUrl);
      audio.play().catch(e => {
        console.log('Audio play failed, falling back to TTS', e);
        fallbackTTS(wordData.word);
      });
    } else {
      fallbackTTS(wordData.word);
    }
  };

  const fallbackTTS = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex(prev => (prev + 1) % words.length);
    }, 150);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex(prev => (prev - 1 + words.length) % words.length);
    }, 150);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin text-amber-500">
          <RotateCw size={48} />
        </div>
      </div>
    );
  }

  if (words.length === 0) return null;

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center py-8 px-4 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-600/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-amber-600/20 rounded-full blur-[100px]" />
      </div>

      <header className="w-full max-w-lg flex justify-between items-center mb-12">
        <button 
          onClick={onBack}
          className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-md transition-all"
        >
          <ArrowLeft size={24} />
        </button>
        <div className="text-center">
          <h1 className="text-2xl font-black text-white tracking-wider">STAGE {stage}</h1>
          <p className="text-amber-400 font-bold text-sm uppercase tracking-widest">Vocabulary Review</p>
        </div>
        <div className="w-12" /> {/* Spacer */}
      </header>

      <div className="w-full max-w-sm aspect-[3/4] relative perspective-1000">
        <div 
          onClick={() => setIsFlipped(!isFlipped)}
          className={`w-full h-full transition-all duration-500 preserve-3d cursor-pointer ${isFlipped ? 'rotate-y-180' : ''}`}
        >
          {/* Front (English Word) */}
          <div className="absolute inset-0 w-full h-full backface-hidden bg-gradient-to-br from-amber-100 to-orange-100 rounded-3xl border-4 border-amber-300 shadow-2xl flex flex-col items-center justify-center p-8">
            <button 
              onClick={(e) => { e.stopPropagation(); playAudio(words[currentIndex]); }}
              className="absolute top-6 right-6 w-12 h-12 bg-white/50 hover:bg-white rounded-full flex items-center justify-center text-amber-700 shadow transition-colors z-20"
            >
              {isEnriching ? <Loader2 className="w-6 h-6 animate-spin" /> : <Volume2 className="w-6 h-6" />}
            </button>
            <span className="text-sm font-bold text-amber-600/60 uppercase tracking-widest absolute top-6">Tap to flip</span>
            <h2 className="text-5xl md:text-6xl font-black text-amber-900 text-center break-words w-full">
              {words[currentIndex].word}
            </h2>
            <div className="text-xl font-bold text-amber-600/80 mt-4 tracking-widest">
              {words[currentIndex].phonetics}
            </div>
            <div className="absolute bottom-6 flex gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span className="w-2 h-2 rounded-full bg-amber-300/30" />
            </div>
          </div>

          {/* Back (Vietnamese Meaning) */}
          <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 bg-gradient-to-br from-purple-600 to-indigo-800 rounded-3xl border-4 border-purple-400 shadow-2xl flex flex-col items-center justify-center p-8">
            <span className="text-sm font-bold text-purple-300/60 uppercase tracking-widest absolute top-6">Meaning</span>
            <div className="text-xl font-bold text-purple-300/80 mb-2">
              {words[currentIndex].pos}
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white text-center break-words w-full drop-shadow-md">
              {words[currentIndex].meaning}
            </h2>
            <div className="absolute bottom-6 flex gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-400/30" />
              <span className="w-2 h-2 rounded-full bg-purple-400" />
            </div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-sm flex justify-between items-center mt-12">
        <button 
          onClick={handlePrev}
          className="p-4 bg-white/10 hover:bg-white/20 active:scale-95 rounded-2xl text-white backdrop-blur-md transition-all shadow-lg border border-white/10"
        >
          <ChevronLeft size={32} />
        </button>
        
        <div className="text-white/60 font-bold tracking-widest bg-black/30 px-6 py-2 rounded-full backdrop-blur-sm">
          {currentIndex + 1} / {words.length}
        </div>

        <button 
          onClick={handleNext}
          className="p-4 bg-white/10 hover:bg-white/20 active:scale-95 rounded-2xl text-white backdrop-blur-md transition-all shadow-lg border border-white/10"
        >
          <ChevronRight size={32} />
        </button>
      </div>

    </div>
  );
}
