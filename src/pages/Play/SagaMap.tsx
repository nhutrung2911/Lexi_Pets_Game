import { useEffect, useRef, useState } from 'react';
import { generateCampaignNodes, WORLDS } from '../../data/campaignConfig';
import { ArrowLeft, Star, Crown, Gift, Store, Tent, Play, Lock } from 'lucide-react';

interface SagaMapProps {
  currentStage: number;
  onSelectStage: (stage: number) => void;
  onSelectReview: (stage: number) => void;
  onBack: () => void;
}

export function SagaMap({ currentStage, onSelectStage, onSelectReview, onBack }: SagaMapProps) {
  const nodes = generateCampaignNodes(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const currentNodeRef = useRef<HTMLDivElement>(null);
  const [selectedNode, setSelectedNode] = useState<number | null>(null);

  // Scroll to current node on load
  useEffect(() => {
    // Wait for render
    const timer = setTimeout(() => {
      if (currentNodeRef.current) {
        currentNodeRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const getNodeIcon = (type: string, isLocked: boolean) => {
    if (isLocked) return <Lock className="w-6 h-6 opacity-60" />;
    switch(type) {
      case 'boss': return <Crown className="w-8 h-8 text-yellow-300" />;
      case 'chest': return <Gift className="w-7 h-7 text-pink-300" />;
      case 'elite': return <Star className="w-7 h-7 text-amber-300" />;
      case 'merchant': return <Store className="w-7 h-7 text-emerald-300" />;
      case 'camp': return <Tent className="w-7 h-7 text-red-300" />;
      default: return <Play className="w-6 h-6 text-white ml-1" />;
    }
  };

  const getNodeStyle = (type: string, isLocked: boolean, isCurrent: boolean) => {
    if (isLocked) return 'bg-slate-800 border-slate-600 shadow-none';
    
    let base = '';
    switch(type) {
      case 'boss': base = 'bg-red-500 border-red-300'; break;
      case 'chest': base = 'bg-pink-500 border-pink-300'; break;
      case 'elite': base = 'bg-amber-500 border-amber-300'; break;
      default: base = 'bg-blue-500 border-blue-300'; break;
    }

    if (isCurrent) {
      base += ' ring-4 ring-yellow-400 animate-pulse shadow-[0_0_40px_rgba(250,204,21,1)]';
    } else {
      base += ' shadow-xl shadow-black/80';
    }

    return base;
  };

  // The map is built from bottom to top, so we reverse the nodes
  const reversedNodes = [...nodes].reverse();

  // Find the active world to set background
  const activeWorldId = nodes.find(n => n.id === currentStage)?.worldId || 'world1';
  const worldName = WORLDS[activeWorldId]?.name || 'Saga Map';

  return (
    <>
      {/* Background Layer */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-colors duration-1000 -z-10" />

      {/* Header */}
      <div className="fixed top-0 left-0 w-full p-4 pt-6 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent z-50">
        <button 
          onClick={onBack}
          className="w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white rounded-full flex items-center justify-center transition-all shadow-lg active:scale-95"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="text-white font-black text-2xl drop-shadow-md tracking-wide">
          {worldName}
        </div>
        <div className="w-12" /> {/* Spacer to balance the button */}
      </div>

      {/* Scrolling Map */}
      <div 
        ref={containerRef}
        className="pt-24 pb-40 px-4 flex flex-col min-h-screen"
      >
        <div className="flex flex-col items-center relative w-full max-w-md mx-auto h-auto">
          {reversedNodes.map((node, index) => {
            const isLocked = node.id > currentStage;
            const isCurrent = node.id === currentStage;
            const isCompleted = node.id < currentStage;
            
            // Calculate ZigZag offset in percentages
            const swing = Math.sin(node.id * 0.8) * 30; // -30 to 30%
            const prevSwing = Math.sin((node.id - 1) * 0.8) * 30;
            
            return (
              <div 
                key={node.id} 
                className="relative w-full flex justify-center items-center shrink-0"
                style={{ height: '160px' }}
                ref={isCurrent ? currentNodeRef : null}
              >
                {/* Connector Path (Downwards to previous node, except for stage 1) */}
                {node.id > 1 && (
                  <svg 
                    className="absolute w-full pointer-events-none left-0" 
                    style={{ zIndex: 0, height: '160px', top: '80px' }}
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                  >
                    <path 
                      d={`M ${50 + swing} 0 Q 50 60 ${50 + prevSwing} 100`} 
                      fill="none" 
                      stroke={isCompleted ? "#4ade80" : "rgba(255,255,255,0.4)"} 
                      strokeWidth="4" 
                      strokeLinecap="round"
                      strokeDasharray={isLocked ? "4,4" : "none"}
                      vectorEffect="non-scaling-stroke"
                    />
                  </svg>
                )}

                <button
                  disabled={isLocked && node.type !== 'chest'} // Disable locked
                  onClick={() => {
                    if (isCompleted) {
                      setSelectedNode(node.id);
                    } else {
                      onSelectStage(node.id);
                    }
                  }}
                  className={`absolute rounded-full border-4 flex items-center justify-center transition-transform hover:scale-110 active:scale-95 ${getNodeStyle(node.type, isLocked, isCurrent)}`}
                  style={{ 
                    width: '96px', 
                    height: '96px',
                    left: `${50 + swing}%`, 
                    transform: 'translateX(-50%)', 
                    zIndex: 10 
                  }}
                >
                  {/* Badge for stage number */}
                  <div className="absolute -bottom-3 bg-slate-900 text-white text-xs font-black px-2 py-0.5 rounded-full border-2 border-slate-700">
                    {node.id}
                  </div>
                  
                  {/* 3 Stars if completed */}
                  {isCompleted && (node.type === 'normal' || node.type === 'elite') && (
                    <div className="absolute -top-4 flex gap-0.5">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 -translate-y-1" />
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    </div>
                  )}

                  {getNodeIcon(node.type, isLocked)}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Review/Replay Modal */}
      {selectedNode !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-slate-900 border-4 border-slate-700 rounded-3xl p-6 max-w-sm w-full flex flex-col items-center shadow-2xl relative">
            <button 
              onClick={() => setSelectedNode(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              ✕
            </button>
            <h2 className="text-3xl font-black text-white mb-2">Stage {selectedNode}</h2>
            <p className="text-slate-400 font-bold mb-8 text-center">What would you like to do?</p>
            
            <button 
              onClick={() => onSelectReview(selectedNode)}
              className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-black py-4 rounded-xl mb-4 hover:scale-105 active:scale-95 transition-transform shadow-[0_4px_0_#4338ca] hover:shadow-[0_6px_0_#4338ca] hover:-translate-y-0.5"
            >
              📚 REVIEW FLASHCARDS
            </button>
            
            <button 
              onClick={() => onSelectStage(selectedNode)}
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-black py-4 rounded-xl hover:scale-105 active:scale-95 transition-transform shadow-[0_4px_0_#0369a1] hover:shadow-[0_6px_0_#0369a1] hover:-translate-y-0.5"
            >
              ⚔️ PLAY AGAIN
            </button>
          </div>
        </div>
      )}
    </>
  );
}
