import { useState, useEffect } from 'react';
import { WordSearchGame } from './WordSearchGame';
import { SagaMap } from './SagaMap';
import { FlashcardsReview } from './FlashcardsReview';
import { Map, Swords, Lock } from 'lucide-react';

type PlayView = 'hub' | 'sagamap' | 'game' | 'flashcards';
type GameMode = 'campaign' | 'challenge';

export function PlayPage() {
  const [view, setView] = useState<PlayView>('hub');
  const [mode, setMode] = useState<GameMode>('campaign');
  const [currentStage, setCurrentStage] = useState(1);
  const [selectedStage, setSelectedStage] = useState(1);

  // Load progress
  useEffect(() => {
    const saved = localStorage.getItem('lexipets_stage');
    if (saved) {
      setCurrentStage(parseInt(saved, 10));
    }
  }, []);

  const handleStageWin = () => {
    // If we beat the latest stage, advance
    if (mode === 'campaign' && selectedStage === currentStage) {
      const nextStage = currentStage + 1;
      setCurrentStage(nextStage);
      localStorage.setItem('lexipets_stage', nextStage.toString());
      setSelectedStage(nextStage); // Auto proceed to next stage in UI logic if we wanted, but game loops itself
    }
  };

  if (view === 'sagamap') {
    return (
      <SagaMap 
        currentStage={currentStage} 
        onSelectStage={(stage) => {
          setSelectedStage(stage);
          setMode('campaign');
          setView('game');
        }}
        onSelectReview={(stage) => {
          setSelectedStage(stage);
          setView('flashcards');
        }}
        onBack={() => setView('hub')}
      />
    );
  }

  if (view === 'game') {
    return (
      <WordSearchGame 
        initialStage={selectedStage}
        mode={mode}
        onBack={() => {
          if (mode === 'campaign') setView('sagamap');
          else setView('hub');
        }}
        onWin={handleStageWin}
      />
    );
  }

  if (view === 'flashcards') {
    return (
      <FlashcardsReview 
        stage={selectedStage}
        onBack={() => setView('sagamap')}
      />
    );
  }

  // Hub View
  return (
    <div className="min-h-screen pb-32 pt-8 px-4 flex flex-col items-center bg-black/40 backdrop-blur-sm">
      <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-600 mb-8 drop-shadow-sm uppercase tracking-wider mt-4">
        Play Modes
      </h1>

      <div className="flex flex-col gap-6 w-full max-w-md">
        
        {/* Campaign Card */}
        <button 
          onClick={() => setView('sagamap')}
          className="relative overflow-hidden w-full h-48 rounded-3xl bg-gradient-to-br from-green-500 to-emerald-700 shadow-[0_10px_30px_rgba(16,185,129,0.3)] transition-transform hover:scale-105 active:scale-95 group text-left p-6 flex flex-col justify-end"
        >
          <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md p-3 rounded-full group-hover:rotate-12 transition-transform">
            <Map className="w-8 h-8 text-white" />
          </div>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
          
          <h2 className="text-3xl font-black text-white drop-shadow-md relative z-10">
            Saga Campaign
          </h2>
          <p className="text-green-100 font-semibold relative z-10">
            Current: Stage {currentStage}
          </p>
        </button>

        {/* Challenge Card */}
        <button 
          onClick={() => {
            setMode('challenge');
            setView('game');
          }}
          className="relative overflow-hidden w-full h-48 rounded-3xl bg-gradient-to-br from-purple-600 to-indigo-800 shadow-[0_10px_30px_rgba(99,102,241,0.3)] transition-transform hover:scale-105 active:scale-95 group text-left p-6 flex flex-col justify-end"
        >
          <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md p-3 rounded-full group-hover:-rotate-12 transition-transform">
            <Swords className="w-8 h-8 text-white" />
          </div>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
          
          <h2 className="text-3xl font-black text-white drop-shadow-md relative z-10">
            Challenge Hub
          </h2>
          <p className="text-indigo-200 font-semibold relative z-10">
            Hardcore words • No hints
          </p>
        </button>

        {/* Locked Boss Rush Card */}
        <div className="relative overflow-hidden w-full h-24 rounded-3xl bg-slate-800 border-2 border-slate-700 opacity-60 p-6 flex items-center gap-4">
          <div className="bg-slate-700 p-3 rounded-full">
            <Lock className="w-6 h-6 text-slate-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-300">Boss Rush</h2>
            <p className="text-slate-500 text-sm font-semibold">Unlocks at Stage 50</p>
          </div>
        </div>

      </div>
    </div>
  );
}
