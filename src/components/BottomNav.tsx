import { NavLink } from 'react-router-dom';
import { Home, Layers, Gamepad2 } from 'lucide-react';

export function BottomNav() {
  return (
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-sm">
      <div className="bg-slate-800/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl flex items-center justify-around p-2">
        <NavItem to="/" icon={<Home className="w-6 h-6" />} label="Home" />
        <NavItem to="/collection" icon={<Layers className="w-6 h-6" />} label="Collection" />
        <NavItem to="/play" icon={<Gamepad2 className="w-6 h-6" />} label="Play" />
      </div>
    </nav>
  );
}

function NavItem({ to, icon, label }: { to: string, icon: React.ReactNode, label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-300 ${
          isActive 
            ? 'bg-yellow-500/20 text-yellow-400 shadow-[inset_0_0_20px_rgba(250,204,21,0.1)]' 
            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
        }`
      }
    >
      {icon}
      <span className="text-[10px] font-bold mt-1">{label}</span>
    </NavLink>
  );
}
