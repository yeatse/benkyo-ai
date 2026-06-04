import LevelMap from '../components/Map/LevelMap';
import useGameStore, { computeLevel, XP_PER_LEVEL } from '../store/gameStore';
import HeartDisplay from '../components/UI/HeartDisplay';
import AutoGenWidget from '../components/UI/AutoGenWidget';
import { useIcon } from '../lib/icons';

export default function HomePage() {
  const totalXp = useGameStore(s => s.totalXp);
  const logoImg32 = useIcon('logo_32.png');
  const level = computeLevel(totalXp);
  const levelProgress = (totalXp % XP_PER_LEVEL) / XP_PER_LEVEL * 100;

  return (
    <div data-ui-click-sfx className="flex flex-col h-full bg-[#F5F3FF]">
      <header className="flex items-center justify-between px-5 py-3 bg-white border-b border-[#E5E0FF] shrink-0">
        <div className="flex items-center gap-2">
          <img src={logoImg32} alt="日学" width={32} height={32} style={{ imageRendering: '-webkit-optimize-contrast', objectFit: 'contain' }} />
          <div>
            <h1 className="text-base font-extrabold jp text-[#1E1B4B] leading-tight">日学</h1>
            <p className="text-[10px] text-[#9CA3AF] font-medium leading-tight">日本語学習</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <HeartDisplay size="sm" />
          <div className="min-w-[104px] bg-[var(--tp-lite)] rounded-full px-3 py-2">
            <span className="block text-xs font-bold text-[var(--tp)] leading-none mb-1.5">Lv.{level}</span>
            <div
              className="h-1.5 rounded-full bg-white/80 overflow-hidden"
              role="progressbar"
              aria-label={`等级 ${level} 升级进度`}
              aria-valuemin="0"
              aria-valuemax="100"
              aria-valuenow={Math.round(levelProgress)}
            >
              <div
                className="h-full rounded-full bg-[var(--tp)] transition-[width] duration-300"
                style={{ width: `${levelProgress}%` }}
              />
            </div>
          </div>
        </div>
      </header>

      <LevelMap />
      <AutoGenWidget />
    </div>
  );
}
