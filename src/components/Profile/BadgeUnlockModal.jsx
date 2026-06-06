import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import gsap from 'gsap';
import { useIcon, useIconResolver } from '../../lib/icons';
import { playSoundEffect, SOUND_EFFECT_TYPES } from '../../lib/sound-effects';

export default function BadgeUnlockModal({ badge, onDismiss }) {
  const overlayRef = useRef(null);
  const cardRef = useRef(null);
  const badgeRef = useRef(null);
  const shineRef = useRef(null);
  const particleRef = useRef(null);
  const btnRef = useRef(null);
  const resolveIcon = useIconResolver();
  const collectStarImg = useIcon('ui/collect_star.png');
  const badgeImg = resolveIcon(badge?.iconPath);

  useEffect(() => {
    if (!badge) return undefined;

    playSoundEffect(SOUND_EFFECT_TYPES.LEVEL_COMPLETE);

    const overlay = overlayRef.current;
    const card = cardRef.current;
    const badgeEl = badgeRef.current;
    const shine = shineRef.current;
    const particles = particleRef.current;
    const btn = btnRef.current;

    gsap.set(overlay, { opacity: 0 });
    gsap.set(card, { y: 54, opacity: 0, scale: 0.88 });
    gsap.set(badgeEl, { scale: 0, rotate: -18 });
    gsap.set(shine, { scale: 0.5, opacity: 0, rotate: 0 });
    gsap.set(btn, { opacity: 0, y: 12 });

    const particleCount = 20;
    for (let i = 0; i < particleCount; i += 1) {
      const el = document.createElement('img');
      el.src = collectStarImg;
      el.alt = '';
      el.style.cssText = `
        position: absolute;
        left: calc(50% - 8px);
        top: 138px;
        width: ${10 + Math.random() * 8}px;
        height: ${10 + Math.random() * 8}px;
        object-fit: contain;
        pointer-events: none;
      `;
      particles.appendChild(el);

      const angle = (i / particleCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.45;
      const dist = 74 + Math.random() * 84;
      gsap.fromTo(
        el,
        { x: 0, y: 0, scale: 0, opacity: 1, rotate: 0 },
        {
          x: Math.cos(angle) * dist,
          y: Math.sin(angle) * dist - 20,
          scale: 1,
          opacity: 0,
          rotate: (Math.random() - 0.5) * 180,
          duration: 1.05 + Math.random() * 0.45,
          delay: 0.26 + i * 0.02,
          ease: 'power2.out',
          onComplete: () => el.remove(),
        }
      );
    }

    const tl = gsap.timeline();
    tl.to(overlay, { opacity: 1, duration: 0.22 });
    tl.to(card, { y: 0, opacity: 1, scale: 1, duration: 0.44, ease: 'back.out(2)' }, '-=0.08');
    tl.to(shine, { opacity: 1, scale: 1, duration: 0.34, ease: 'power2.out' }, '-=0.18');
    tl.to(badgeEl, { scale: 1, rotate: 0, duration: 0.42, ease: 'back.out(2.8)' }, '-=0.22');
    tl.to(badgeEl, { scale: 1.08, duration: 0.15, yoyo: true, repeat: 1, ease: 'sine.inOut' }, '-=0.04');
    tl.to(btn, { opacity: 1, y: 0, duration: 0.28, ease: 'back.out(1.8)' }, '-=0.16');
    gsap.to(shine, { rotate: 360, duration: 10, repeat: -1, ease: 'none' });

    return () => {
      tl.kill();
      gsap.killTweensOf(shine);
      particles.replaceChildren();
    };
  }, [badge, badgeImg, collectStarImg]);

  if (!badge) return null;

  const progressPct = badge.target > 0 ? Math.min(100, (badge.current / badge.target) * 100) : 100;

  const handleDismiss = () => {
    const tl = gsap.timeline({ onComplete: onDismiss });
    tl.to(cardRef.current, { y: 36, opacity: 0, scale: 0.94, duration: 0.26, ease: 'power2.in' });
    tl.to(overlayRef.current, { opacity: 0, duration: 0.18 }, '-=0.1');
  };

  const modal = (
    <div
      ref={overlayRef}
      data-ui-click-sfx
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 180,
        background: 'rgba(15, 23, 42, 0.64)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}
    >
      <div ref={particleRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'visible' }} />

      <div
        ref={cardRef}
        style={{
          width: 318,
          borderRadius: 30,
          background: 'white',
          boxShadow: '0 24px 64px rgba(15,23,42,0.32)',
          overflow: 'hidden',
          position: 'relative',
          zIndex: 2,
        }}
      >
        <div
          style={{
            padding: '24px 24px 18px',
            textAlign: 'center',
            background: 'linear-gradient(180deg, #EFF6FF 0%, #FFFBEB 100%)',
            borderBottom: '1px solid #F3F4F6',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              height: 24,
              borderRadius: 999,
              padding: '0 12px',
              background: 'rgba(255,255,255,0.78)',
              color: 'var(--tp)',
              fontSize: 11,
              fontWeight: 900,
              marginBottom: 14,
              border: '1px solid var(--tp-bdr)',
            }}
          >
            徽章解锁
          </div>

          <div style={{ width: 196, height: 196, position: 'relative', margin: '0 auto 10px' }}>
            <div
              ref={shineRef}
              style={{
                position: 'absolute',
                inset: 6,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(253,224,71,0.58) 0%, rgba(96,165,250,0.18) 44%, rgba(255,255,255,0) 72%)',
                filter: 'blur(5px)',
              }}
            />
            <div
              ref={badgeRef}
              className="badge-unlock-medal"
              style={{
                position: 'absolute',
                inset: 14,
              }}
            >
              <img src={badgeImg} alt={badge.name} />
            </div>
          </div>

          <h2 style={{ fontSize: 22, fontWeight: 900, color: '#1E1B4B', lineHeight: 1.15 }}>
            {badge.name}
          </h2>
          <p style={{ marginTop: 6, color: '#64748B', fontSize: 13, fontWeight: 800 }}>
            {badge.requirement}
          </p>
        </div>

        <div style={{ padding: '18px 24px 24px', textAlign: 'center' }}>
          <div className="badge-unlock-progress">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 10 }}>
              <div style={{ minWidth: 0, textAlign: 'left' }}>
                <div style={{ color: '#B45309', fontSize: 11, fontWeight: 900, lineHeight: 1.2 }}>
                  目标达成
                </div>
                <div style={{ color: '#1E1B4B', fontSize: 13, fontWeight: 900, lineHeight: 1.25, marginTop: 3 }}>
                  {badge.requirement}
                </div>
              </div>
              <div
                style={{
                  flexShrink: 0,
                  borderRadius: 999,
                  background: 'var(--tp-lite)',
                  border: '1px solid var(--tp-bdr)',
                  color: 'var(--tp)',
                  fontSize: 11,
                  fontWeight: 900,
                  lineHeight: 1.2,
                  padding: '3px 8px',
                }}
              >
                {badge.progressText}
              </div>
            </div>
            <div style={{ height: 9, borderRadius: 999, background: 'rgba(251,191,36,0.22)', overflow: 'hidden' }}>
              <div
                style={{
                  width: `${progressPct}%`,
                  height: '100%',
                  borderRadius: 999,
                  background: 'linear-gradient(90deg, #F59E0B, #FDE047, #FFFFFF)',
                  boxShadow: '0 0 10px rgba(245,158,11,0.46)',
                }}
              />
            </div>
          </div>

          <button
            ref={btnRef}
            type="button"
            onClick={handleDismiss}
            className="btn-press"
            style={{
              width: '100%',
              height: 48,
              borderRadius: 16,
              border: 'none',
              background: 'linear-gradient(135deg, var(--tp-from), var(--tp))',
              boxShadow: '0 4px 0 var(--tp-deep)',
              color: 'white',
              fontSize: 15,
              fontWeight: 900,
              cursor: 'pointer',
            }}
          >
            收下徽章
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
