import { useAuthStore } from '../../store/authStore';
import { useProfile } from '../../hooks/useProfile';
import { useActivePet } from '../../hooks/useActivePet';
import { supabase } from '../../lib/supabase';
import { Coins, Gem, Zap, Heart, Utensils, LogOut, Loader2, Sparkles, PlusCircle } from 'lucide-react';
import { useState } from 'react';

// Get storage URL for pet images
const STORAGE_URL = `${import.meta.env.VITE_SUPABASE_URL || 'https://wvdevflcstbkbrzvcvst.supabase.co'}/storage/v1/object/public/pets/`;

export function HomePage() {
  const { user, signOut } = useAuthStore();
  const { data: profile, isLoading: profileLoading } = useProfile();
  const { data: pet, isLoading: petLoading, refetch: refetchPet } = useActivePet();
  const [claiming, setClaiming] = useState(false);

  const claimStarterPet = async () => {
    if (!user) return;
    setClaiming(true);
    try {
      const { data: species } = await supabase
        .from('pet_species')
        .select('id')
        .eq('name', 'Fire Cat')
        .single();
        
      if (species) {
        await supabase.from('user_pets').insert({
          user_id: user.id,
          pet_species_id: species.id,
          equipped: true
        });
        await refetchPet();
      }
    } finally {
      setClaiming(false);
    }
  };

  if (profileLoading || petLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent backdrop-blur-md">
        <Loader2 className="w-12 h-12 text-white animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen text-slate-800 font-sans selection:bg-yellow-300/50 overflow-hidden relative pb-24">
      {/* Background decorations simulating clouds & sun */}
      <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-white/40 blur-2xl pointer-events-none" />
      <div className="absolute top-20 right-20 w-48 h-16 rounded-full bg-white/50 blur-xl pointer-events-none" />
      <div className="absolute top-[-5%] right-[-5%] w-64 h-64 rounded-full bg-yellow-200/50 blur-[80px] pointer-events-none" />

      {/* Top Navigation / Stats Bar */}
      <header className="p-4 md:p-6 w-full max-w-6xl mx-auto flex flex-wrap gap-4 items-center justify-between relative z-10">
        
        {/* Profile Card - Light Cyan */}
        <div className="flex items-center gap-3 bg-cyan-50/80 backdrop-blur-md px-4 py-2 rounded-2xl border border-cyan-100 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-500 p-1 shadow-inner">
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center font-bold text-xl text-cyan-600">
              {profile?.username?.charAt(0).toUpperCase() || 'U'}
            </div>
          </div>
          <div className="pr-2">
            <h2 className="font-bold text-slate-700 text-sm leading-tight">{profile?.username || 'Trainer'}</h2>
            <p className="text-xs text-cyan-600 font-bold bg-cyan-100 px-2 py-0.5 rounded-full inline-block mt-0.5">
              Lv. {pet?.level || 1}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Coins - Yellow */}
          <div className="flex items-center gap-2 bg-yellow-50/90 backdrop-blur-md px-4 py-2 rounded-full border border-yellow-200 shadow-sm">
            <div className="bg-yellow-400 p-1 rounded-full shadow-inner">
              <Coins className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-yellow-700">{profile?.coins || 0}</span>
          </div>
          
          {/* Gems - Purple */}
          <div className="flex items-center gap-2 bg-purple-50/90 backdrop-blur-md px-4 py-2 rounded-full border border-purple-200 shadow-sm">
            <div className="bg-purple-400 p-1 rounded-full shadow-inner">
              <Gem className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-purple-700">{profile?.gems || 0}</span>
          </div>
          
          <button 
            onClick={signOut}
            className="p-2.5 bg-red-50 hover:bg-red-100 text-red-500 rounded-full transition-colors border border-red-100 shadow-sm"
            title="Sign Out"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-6xl mx-auto px-4 py-4 flex flex-col items-center relative z-10">
        
        {!pet ? (
          <div className="flex flex-col items-center justify-center mt-20 p-10 bg-white/60 backdrop-blur-xl rounded-3xl border border-white/50 shadow-xl text-center max-w-md">
            <Sparkles className="w-16 h-16 text-yellow-400 mb-6 drop-shadow-md" />
            <h2 className="text-3xl font-black text-slate-800 mb-4">Welcome to LexiPets!</h2>
            <p className="text-slate-600 mb-8 font-medium">
              You don't have any pets yet. Claim your first starter pet to begin your adventure and start learning!
            </p>
            <button 
              onClick={claimStarterPet}
              disabled={claiming}
              className="group relative px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl font-bold text-white text-lg shadow-[0_10px_20px_rgba(251,146,60,0.3)] hover:shadow-[0_15px_25px_rgba(251,146,60,0.4)] transition-all hover:-translate-y-1 active:translate-y-0 disabled:opacity-50"
            >
              {claiming ? (
                <Loader2 className="w-6 h-6 animate-spin mx-auto" />
              ) : (
                <span className="flex items-center gap-2">
                  <PlusCircle className="w-6 h-6" />
                  Claim Starter Pet
                </span>
              )}
            </button>
          </div>
        ) : (
          <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            {/* Left Panel - Quests / Info */}
            <div className="lg:col-span-3 space-y-4 w-full max-w-sm mx-auto lg:mx-0 bg-white/70 backdrop-blur-md p-5 rounded-3xl border border-white/60 shadow-lg animate-in fade-in slide-in-from-left-8 duration-700 hover:-translate-y-1 transition-transform">
              <h3 className="font-black text-slate-700 mb-4 text-lg">Daily Needs</h3>
              <StatBar icon={<Heart className="w-5 h-5 text-white" />} iconBg="bg-pink-400" label="Happiness" value={pet.happiness} color="bg-pink-400" />
              <StatBar icon={<Utensils className="w-5 h-5 text-white" />} iconBg="bg-orange-400" label="Hunger" value={pet.hunger} color="bg-orange-400" />
              <StatBar icon={<Zap className="w-5 h-5 text-white" />} iconBg="bg-blue-400" label="Energy" value={pet.energy} color="bg-blue-400" />
            </div>

            {/* Center Pet Display */}
            <div className="lg:col-span-6 flex flex-col items-center justify-end min-h-[400px] relative">
              
              {/* Pet Platform - simulated */}
              <div className="absolute bottom-10 w-64 h-16 bg-slate-800/10 rounded-[100%] blur-md pointer-events-none" />
              <div className="absolute bottom-12 w-48 h-8 bg-green-500/20 rounded-[100%] pointer-events-none border-b-4 border-green-600/20 animate-pulse" />
              <div className="absolute bottom-20 w-80 h-80 bg-yellow-300/20 rounded-full blur-[60px] pointer-events-none animate-[pulse_4s_ease-in-out_infinite]" />

              <div className="relative group cursor-pointer mb-8 z-10">
                <img 
                  src={pet.stage_info?.image_url ? `${STORAGE_URL}${pet.stage_info.image_url}` : 'https://placehold.co/400x400/transparent/white?text=Pet'} 
                  alt={pet.species?.name} 
                  className="w-64 h-64 md:w-80 md:h-80 object-contain relative z-10 animate-[bounce_3s_infinite] drop-shadow-2xl hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* EXP Bar overlay */}
              <div className="w-full max-w-sm bg-white/90 backdrop-blur-md px-6 py-4 rounded-2xl border border-white shadow-lg relative z-20">
                <div className="flex items-center justify-between mb-2">
                  <h1 className="text-xl font-black text-slate-800">
                    {pet.stage_info?.stage_name || pet.species?.name}
                  </h1>
                  <span className="text-sm font-bold text-slate-500">Lv.{pet.level}</span>
                </div>
                
                <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden border border-slate-200 shadow-inner">
                  <div 
                    className="h-full bg-gradient-to-r from-green-400 to-emerald-400 rounded-full transition-all duration-1000 relative"
                    style={{ width: `${Math.min((pet.exp / (pet.level * 100)) * 100, 100)}%` }}
                  >
                    {/* Glossy reflection on progress bar */}
                    <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/30 rounded-t-full" />
                  </div>
                </div>
                <div className="text-center text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">
                  {pet.exp} / {pet.level * 100} EXP
                </div>
              </div>

              {/* Action Buttons (Word Search & Feed) */}
              <div className="flex flex-wrap justify-center gap-4 mt-6 w-full relative z-20">
                <ActionButton 
                  title="Word Search" 
                  subtitle="Play to earn!" 
                  color="from-yellow-400 to-orange-400" 
                  icon={<Zap className="w-6 h-6 text-white drop-shadow-md" />} 
                />
                <ActionButton 
                  title="Feed Pet" 
                  subtitle="-10 Coins" 
                  color="from-purple-400 to-fuchsia-400" 
                  icon={<Utensils className="w-6 h-6 text-white drop-shadow-md" />} 
                />
              </div>

            </div>

            {/* Right Panel - Leaderboard/Friends */}
            <div className="lg:col-span-3 w-full max-w-sm mx-auto lg:mx-0 bg-white/70 backdrop-blur-md p-5 rounded-3xl border border-white/60 shadow-lg hidden lg:block animate-in fade-in slide-in-from-right-8 duration-700 hover:-translate-y-1 transition-transform">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-black text-slate-700 text-lg">Friends</h3>
                <span className="bg-blue-100 text-blue-600 text-xs font-bold px-2 py-1 rounded-lg">Online</span>
              </div>
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex items-center justify-between p-2 hover:bg-white/50 rounded-xl transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center font-bold text-slate-500">
                        {String.fromCharCode(64 + i)}
                      </div>
                      <div>
                        <p className="font-bold text-sm text-slate-700">Player {i}</p>
                        <p className="text-xs text-slate-400">Lv. {i * 5}</p>
                      </div>
                    </div>
                    <div className="text-xs font-bold text-yellow-600 bg-yellow-100 px-2 py-1 rounded-md">
                      Top {i}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}
      </main>
    </div>
  );
}

function StatBar({ icon, iconBg, label, value, color }: { icon: React.ReactNode, iconBg: string, label: string, value: number, color: string }) {
  return (
    <div className="flex flex-col gap-1.5 mb-4 last:mb-0">
      <div className="flex items-center justify-between text-xs font-bold text-slate-600 px-1">
        <div className="flex items-center gap-2">
          <div className={`p-1 rounded-md ${iconBg} shadow-sm`}>{icon}</div>
          <span className="uppercase tracking-wider">{label}</span>
        </div>
        <span>{value}/100</span>
      </div>
      <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden shadow-inner">
        <div className={`h-full ${color} transition-all duration-1000 relative`} style={{ width: `${value}%` }}>
          <div className="absolute top-0 left-0 right-0 h-1 bg-white/30" />
        </div>
      </div>
    </div>
  );
}

function ActionButton({ title, subtitle, color, icon }: { title: string, subtitle: string, color: string, icon: React.ReactNode }) {
  return (
    <button className={`relative overflow-hidden group px-6 py-3 rounded-2xl bg-gradient-to-b ${color} text-white shadow-[0_8px_15px_rgba(0,0,0,0.1)] hover:shadow-[0_12px_20px_rgba(0,0,0,0.15)] transition-all hover:-translate-y-1 border-b-4 border-black/10 active:border-b-0 active:translate-y-1 flex items-center gap-3 min-w-[160px]`}>
      <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
      
      {/* Shimmer Effect */}
      <div className="absolute inset-0 w-1/2 animate-[shimmer_2.5s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />

      <div className="relative z-10">{icon}</div>
      <div className="text-left relative z-10">
        <h3 className="font-black text-sm md:text-base leading-tight drop-shadow-md">{title}</h3>
        <p className="text-[10px] md:text-xs font-semibold opacity-90 drop-shadow-sm">{subtitle}</p>
      </div>
    </button>
  );
}
