import { useState } from 'react';
import { useCollection, type CollectionItem } from '../../hooks/useCollection';
import { Loader2, Lock, ArrowUpCircle, CheckCircle2, X } from 'lucide-react';

const STORAGE_URL = `${import.meta.env.VITE_SUPABASE_URL || 'https://wvdevflcstbkbrzvcvst.supabase.co'}/storage/v1/object/public/pets/`;

export function CollectionPage() {
  const { data: collection, isLoading, equipPet, isEquipping, evolvePet, isEvolving } = useCollection();
  const [selectedItem, setSelectedItem] = useState<CollectionItem | null>(null);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-yellow-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen text-slate-800 font-sans pb-24">
      {/* Header */}
      <header className="p-6 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-500">
            Pet Collection
          </h1>
          <div className="bg-slate-800 px-4 py-1.5 rounded-full border border-slate-700 text-sm font-bold text-slate-300">
            {collection?.filter(i => i.userPet).length} / {collection?.length} Unlocked
          </div>
        </div>
      </header>

      {/* Grid */}
      <main className="w-full max-w-5xl mx-auto p-6 mt-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {collection?.map((item) => {
            const isUnlocked = !!item.userPet;
            const currentStageDisplay = isUnlocked 
              ? item.stages.find(s => s.stage === item.userPet?.current_stage) 
              : item.stages[0]; // Show stage 1 silhouetted if locked

            return (
              <div 
                key={item.species.id}
                onClick={() => isUnlocked && setSelectedItem(item)}
                className={`relative group rounded-3xl p-4 transition-all duration-300 ${
                  isUnlocked 
                    ? 'bg-slate-800/80 hover:bg-slate-700 border border-slate-700 cursor-pointer shadow-lg hover:shadow-yellow-500/10 hover:-translate-y-1' 
                    : 'bg-slate-900/50 border border-slate-800/50 grayscale opacity-60 cursor-not-allowed'
                }`}
              >
                {/* Element Badge */}
                <div className="absolute top-4 left-4 z-10">
                  <span className={`px-2 py-1 text-[10px] font-bold rounded-md uppercase tracking-wider ${
                    item.species.element === 'Fire' ? 'bg-red-500/20 text-red-400' :
                    item.species.element === 'Wind' ? 'bg-green-500/20 text-green-400' :
                    'bg-blue-500/20 text-blue-400'
                  }`}>
                    {item.species.element}
                  </span>
                </div>

                {/* Equipped Badge */}
                {item.userPet?.equipped && (
                  <div className="absolute top-4 right-4 z-10 text-yellow-400 bg-slate-900/80 rounded-full p-1 border border-yellow-500/30">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                )}

                {/* Image */}
                <div className="aspect-square flex items-center justify-center p-4 relative">
                  {!isUnlocked && (
                    <div className="absolute inset-0 flex items-center justify-center z-20">
                      <Lock className="w-12 h-12 text-slate-500 drop-shadow-lg" />
                    </div>
                  )}
                  <img 
                    src={`${STORAGE_URL}${currentStageDisplay?.image_url}`} 
                    alt={item.species.name}
                    className={`w-full h-full object-contain drop-shadow-xl transition-transform duration-500 ${isUnlocked ? 'group-hover:scale-110' : ''}`}
                    onError={(e) => { e.currentTarget.src = 'https://placehold.co/400x400/transparent/white?text=Pet' }}
                  />
                </div>

                {/* Info */}
                <div className="text-center mt-2">
                  <h3 className="font-bold text-lg text-slate-200">
                    {isUnlocked ? currentStageDisplay?.stage_name : '???'}
                  </h3>
                  {isUnlocked && (
                    <p className="text-xs font-semibold text-slate-400 mt-1">
                      Level {item.userPet?.level}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Detail Modal */}
      {selectedItem && selectedItem.userPet && (
        <PetDetailModal 
          item={selectedItem} 
          onClose={() => setSelectedItem(null)} 
          onEquip={async () => {
            await equipPet(selectedItem.userPet!.id);
            setSelectedItem(null);
          }}
          isEquipping={isEquipping}
          onEvolve={async (newStage) => {
            await evolvePet({ userPetId: selectedItem.userPet!.id, newStage });
            setSelectedItem(null);
          }}
          isEvolving={isEvolving}
        />
      )}
    </div>
  );
}

function PetDetailModal({ 
  item, onClose, onEquip, isEquipping, onEvolve, isEvolving 
}: { 
  item: CollectionItem, onClose: () => void, onEquip: () => void, isEquipping: boolean,
  onEvolve: (s: number) => void, isEvolving: boolean 
}) {
  const up = item.userPet!;
  const currentStageInfo = item.stages.find(s => s.stage === up.current_stage) || item.stages[0];
  const nextStageInfo = item.stages.find(s => s.stage === up.current_stage + 1);
  const canEvolve = nextStageInfo && up.level >= (nextStageInfo.unlock_level || 999);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-slate-800 rounded-full text-slate-400 hover:text-white z-10">
          <X className="w-5 h-5" />
        </button>

        {/* Top half: Image background */}
        <div className="w-full h-64 bg-gradient-to-b from-indigo-900/50 to-slate-900 flex items-center justify-center p-8 relative">
          <div className="absolute inset-0 bg-slate-900/20" />
          <img 
            src={`${STORAGE_URL}${currentStageInfo.image_url}`} 
            alt={currentStageInfo.stage_name}
            className="w-full h-full object-contain relative z-10 drop-shadow-[0_20px_20px_rgba(0,0,0,0.5)]"
            onError={(e) => { e.currentTarget.src = 'https://placehold.co/400x400/transparent/white?text=Pet' }}
          />
        </div>

        {/* Bottom half: Info */}
        <div className="p-8">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-3xl font-black">{currentStageInfo.stage_name}</h2>
            <span className="px-3 py-1 bg-slate-800 text-slate-300 font-bold rounded-lg border border-slate-700">
              Stage {up.current_stage}
            </span>
          </div>
          
          <p className="text-slate-400 font-medium mb-6">
            {item.species.name} • {item.species.element} • {item.species.rarity}
          </p>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50">
              <p className="text-slate-500 text-xs font-bold uppercase mb-1">Level</p>
              <p className="text-2xl font-bold">{up.level}</p>
            </div>
            <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50">
              <p className="text-slate-500 text-xs font-bold uppercase mb-1">EXP</p>
              <p className="text-2xl font-bold">{up.exp}</p>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={onEquip}
              disabled={up.equipped || isEquipping}
              className={`flex-1 py-4 rounded-xl font-bold text-lg transition-all ${
                up.equipped 
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:-translate-y-1'
              }`}
            >
              {up.equipped ? 'Currently Equipped' : (isEquipping ? 'Equipping...' : 'Equip Pet')}
            </button>

            {nextStageInfo && (
              <button
                onClick={() => canEvolve && onEvolve(nextStageInfo.stage)}
                disabled={!canEvolve || isEvolving}
                className={`px-6 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${
                  canEvolve
                    ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-slate-900 shadow-[0_0_20px_rgba(250,204,21,0.4)] hover:-translate-y-1'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
                }`}
                title={!canEvolve ? `Requires Level ${nextStageInfo.unlock_level} to evolve` : 'Evolve Pet'}
              >
                {isEvolving ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowUpCircle className="w-5 h-5" />}
                Evolve
              </button>
            )}
          </div>
          
          {nextStageInfo && !canEvolve && (
            <p className="text-center text-red-400 text-sm mt-4 font-medium">
              Requires Level {nextStageInfo.unlock_level} to unlock {nextStageInfo.stage_name}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
