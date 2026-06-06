import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useIcon, useIconResolver } from '../../lib/icons';

gsap.registerPlugin(useGSAP);

export default function BadgeSheet({ badges = [], onClose }) {
  const overlayRef = useRef(null);
  const sheetRef = useRef(null);
  const collectStarImg = useIcon('ui/collect_star.png');
  const resolveIcon = useIconResolver();
  const unlockedCount = badges.filter(badge => badge.unlocked).length;

  useGSAP(() => {
    gsap.set(overlayRef.current, { opacity: 0 });
    gsap.set(sheetRef.current, { y: '100%' });
  });

  useGSAP(() => {
    const tl = gsap.timeline();
    tl.to(overlayRef.current, { opacity: 1, duration: 0.25 });
    tl.to(sheetRef.current, { y: 0, duration: 0.42, ease: 'back.out(1.6)' }, '-=0.1');
    tl.from('.badge-card', { opacity: 0, y: 12, stagger: 0.035, duration: 0.22, ease: 'power2.out' }, '-=0.18');
  }, []);

  const handleClose = () => {
    const tl = gsap.timeline({ onComplete: onClose });
    tl.to(sheetRef.current, { y: '100%', duration: 0.28, ease: 'power2.in' });
    tl.to(overlayRef.current, { opacity: 0, duration: 0.18 }, '-=0.12');
  };

  return (
    <div data-ui-click-sfx style={{ position: 'fixed', inset: 0, zIndex: 100 }}>
      <div
        ref={overlayRef}
        onClick={handleClose}
        style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)' }}
      />

      <div
        ref={sheetRef}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: '52dvh',
          minHeight: 420,
          maxHeight: 'calc(100dvh - env(safe-area-inset-top) - 18px)',
          background: 'linear-gradient(180deg, #FFFBEB 0%, #FFFFFF 30%)',
          borderRadius: '24px 24px 0 0',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: '0 -12px 34px rgba(91,79,233,0.18)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 12, paddingBottom: 4 }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: '#E5E7EB' }} />
        </div>

        <div style={{ padding: '10px 20px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 900, color: '#1E1B4B', marginBottom: 2, display: 'flex', alignItems: 'center', gap: 6 }}>
              <img src={collectStarImg} alt="徽章" width={24} height={24} style={{ objectFit: 'contain' }} />
              徽章收藏
            </h2>
            <p style={{ fontSize: 12, color: '#9CA3AF', fontWeight: 700 }}>
              已解锁 {unlockedCount}/{badges.length}
            </p>
          </div>
          <button
            onClick={handleClose}
            style={{
              width: 32,
              height: 32,
              borderRadius: 10,
              background: '#F3F4F6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 16,
              color: '#6B7280',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            ✕
          </button>
        </div>

        <div className="scroll-y" style={{ overflowY: 'auto', padding: '0 10px 24px', flex: 1 }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
              gap: 6,
            }}
          >
            {badges.map((badge) => {
              const badgeImg = resolveIcon(badge.iconPath);
              const progressPct = badge.target > 0 ? Math.min(100, (badge.current / badge.target) * 100) : 0;

              return (
                <div
                  key={badge.id}
                  className="badge-card"
                  style={{
                    minHeight: 176,
                    borderRadius: 16,
                    padding: '10px 4px',
                    background: badge.unlocked
                      ? 'linear-gradient(180deg, #FFFFFF 0%, #FFF7ED 100%)'
                      : 'rgba(255,255,255,0.76)',
                    boxShadow: badge.unlocked
                      ? '0 8px 18px rgba(245,158,11,0.18)'
                      : '0 2px 10px rgba(91,79,233,0.07)',
                    border: `1.5px solid ${badge.unlocked ? '#FDE68A' : '#F1EFFD'}`,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    overflow: 'hidden',
                  }}
                >
                  <div className={`badge-medal ${badge.unlocked ? 'badge-medal--unlocked' : 'badge-medal--locked'}`}>
                    <img src={badgeImg} alt={badge.name} />
                  </div>

                  <div style={{ width: '100%', marginTop: 6 }}>
                    <div style={{ fontSize: 12, fontWeight: 900, color: '#1E1B4B', lineHeight: 1.2, whiteSpace: 'nowrap' }}>
                      {badge.name}
                    </div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: '#9CA3AF', lineHeight: 1.25, marginTop: 3, minHeight: 13 }}>
                      {badge.requirement}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 7 }}>
                      <div style={{ height: 5, flex: 1, borderRadius: 999, background: '#F3F4F6', overflow: 'hidden' }}>
                        <div
                          style={{
                            height: '100%',
                            width: `${progressPct}%`,
                            borderRadius: 999,
                            background: badge.unlocked
                              ? 'linear-gradient(90deg, #F59E0B, #FDE047)'
                              : 'linear-gradient(90deg, var(--tp-from), var(--tp))',
                            minWidth: progressPct > 0 ? 5 : 0,
                          }}
                        />
                      </div>
                      <span style={{ flexShrink: 0, fontSize: 9, fontWeight: 900, color: badge.unlocked ? '#D97706' : '#9CA3AF' }}>
                        {badge.progressText}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
