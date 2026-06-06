import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import useUserStore from '../../store/userStore';
import {
  OMAMORI_GACHA_COST,
  OMAMORI_ITEMS,
  OMAMORI_RARITY_ORDER,
  drawOmamori,
  getOmamoriLore,
  getOmamoriRarity,
} from '../../data/omamoriGacha';
import { useIcon, useIconResolver } from '../../lib/icons';
import { playSoundEffect, SOUND_EFFECT_TYPES } from '../../lib/sound-effects';

gsap.registerPlugin(useGSAP);

const REEL_ITEM_COUNT = 12;
const REEL_TARGET_INDEX = 9;

function buildResultReel(result) {
  return Array.from({ length: REEL_ITEM_COUNT }, (_, index) => {
    const item = index === REEL_TARGET_INDEX ? result : drawOmamori();
    return {
      ...item,
      reelKey: `${index}-${item.id}-${Math.random().toString(36).slice(2, 8)}`,
    };
  });
}

export default function OmamoriGacha() {
  const coins = useUserStore(s => s.coins);
  const spendCoins = useUserStore(s => s.spendCoins);
  const recordOmamoriDraw = useUserStore(s => s.recordOmamoriDraw);
  const markOmamoriDetailViewed = useUserStore(s => s.markOmamoriDetailViewed);
  const omamoriCollection = useUserStore(s => s.omamoriCollection ?? {});
  const omamoriViewedDetails = useUserStore(s => s.omamoriViewedDetails ?? {});
  const coinImg = useIcon('item/coin.png');
  const gachaIntroImg = useIcon('sd/gacha-intro.png');
  const resolveIcon = useIconResolver();
  const [phase, setPhase] = useState('idle');
  const [result, setResult] = useState(null);
  const [notice, setNotice] = useState(null);
  const [selectedOmamori, setSelectedOmamori] = useState(null);

  const rootRef = useRef(null);
  const stageRef = useRef(null);
  const noticeRef = useRef(null);
  const lineupRef = useRef(null);

  const canAfford = coins >= OMAMORI_GACHA_COST;
  const [reelItems, setReelItems] = useState([]);
  const [drawKey, setDrawKey] = useState(0);

  const collectionItems = useMemo(() => {
    const rank = new Map(OMAMORI_RARITY_ORDER.map((rarity, index) => [rarity, index]));
    return [...OMAMORI_ITEMS]
      .map(item => {
        const count = omamoriCollection[item.id] ?? 0;
        const owned = count > 0;
        return {
          ...item,
          count,
          owned,
          isNew: owned && !omamoriViewedDetails[item.id],
          lore: getOmamoriLore(item.id),
        };
      })
      .sort((a, b) => {
        if (a.owned !== b.owned) return a.owned ? -1 : 1;
        return rank.get(a.rarity) - rank.get(b.rarity);
      });
  }, [omamoriCollection, omamoriViewedDetails]);

  const collectionStats = useMemo(() => {
    const owned = collectionItems.filter(item => item.owned).length;
    const total = collectionItems.reduce((sum, item) => sum + item.count, 0);
    return { owned, total };
  }, [collectionItems]);

  useGSAP(() => {
    const cards = lineupRef.current?.querySelectorAll('[data-omamori-collection]');
    gsap.set([stageRef.current, lineupRef.current], { opacity: 0, y: 18 });
    gsap.set(cards, { opacity: 0, y: 12, scale: 0.97 });
  });

  useGSAP(() => {
    const cards = lineupRef.current?.querySelectorAll('[data-omamori-collection]');
    const tl = gsap.timeline();
    tl.to(stageRef.current, { opacity: 1, y: 0, duration: 0.42, ease: 'back.out(1.7)' }, 0);
    tl.to(lineupRef.current, { opacity: 1, y: 0, duration: 0.34, ease: 'back.out(1.6)' }, 0.12);
    tl.to(cards, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.34,
      ease: 'back.out(1.7)',
      stagger: 0.025,
    }, 0.18);
  }, []);

  useGSAP(() => {
    const lanterns = rootRef.current?.querySelectorAll('[data-omamori-lantern]');

    gsap.to(lanterns, {
      opacity: 0.38,
      scale: 1.12,
      repeat: -1,
      yoyo: true,
      duration: 1.35,
      ease: 'sine.inOut',
      stagger: 0.16,
    });
  }, []);

  const showInsufficientCoins = () => {
    setNotice('金币不足');
    gsap.fromTo(
      noticeRef.current ?? stageRef.current,
      { x: -6 },
      { x: 6, repeat: 5, yoyo: true, duration: 0.055, ease: 'sine.inOut', onComplete: () => gsap.set(noticeRef.current ?? stageRef.current, { x: 0 }) }
    );
  };

  const handleDraw = () => {
    if (!spendCoins(OMAMORI_GACHA_COST)) {
      showInsufficientCoins();
      return;
    }

    const nextResult = drawOmamori();
    const nextCount = recordOmamoriDraw(nextResult.id);
    const resultWithState = { ...nextResult, isNew: nextCount === 1 };
    setNotice(null);
    setResult(resultWithState);
    setReelItems(buildResultReel(resultWithState));
    setDrawKey(key => key + 1);
    setPhase('revealed');
  };

  const closeResult = () => {
    setResult(null);
    setReelItems([]);
    setPhase('idle');
  };

  const openOmamoriDetail = (item) => {
    if (!item.owned) return;
    markOmamoriDetailViewed(item.id);
    setSelectedOmamori(item);
  };

  const closeOmamoriDetail = () => {
    setSelectedOmamori(null);
  };

  return (
    <div ref={rootRef} className="omamori-gacha" data-ui-click-sfx>
      <section ref={stageRef} className={`omamori-stage omamori-stage--${phase}`}>
        <div
          className="omamori-stage__aura"
          aria-hidden="true"
        >
          <div
            className="omamori-stage__intro"
            style={{ backgroundImage: `url(${gachaIntroImg})` }}
          />
          <div className="omamori-stage__glow" />
          <div className="omamori-stage__beams">
            {Array.from({ length: 4 }).map((_, index) => (
              <span key={index} />
            ))}
          </div>
          <div className="omamori-stage__sparkles">
            {Array.from({ length: 26 }).map((_, index) => (
              <span key={index} />
            ))}
          </div>
        </div>
        <div className="omamori-lanterns" aria-hidden="true">
          {Array.from({ length: 12 }).map((_, index) => (
            <span key={index} data-omamori-lantern style={{ '--i': index }} />
          ))}
        </div>

        <div className="omamori-stage__topline">
          <span>御守・護身符 Gacha</span>
          <span>
            <img src={coinImg} alt="" width={16} height={16} />
            1回 {OMAMORI_GACHA_COST}
          </span>
        </div>

        <button
          type="button"
          onClick={handleDraw}
          data-sfx={SOUND_EFFECT_TYPES.WORD_SELECTED}
          className="btn-press omamori-draw-button"
        >
          <span>抽取一次</span>
          <span>
            <img src={coinImg} alt="" width={20} height={20} />
            {OMAMORI_GACHA_COST}
          </span>
        </button>

        <div ref={noticeRef} className={`omamori-notice ${notice ? 'omamori-notice--show' : ''}`}>
          {notice ?? ' '}
        </div>
      </section>

      <section ref={lineupRef} className="omamori-lineup">
        <div className="omamori-section-title">
          <span>御守收藏</span>
          <span>{collectionStats.owned}/{OMAMORI_ITEMS.length} 種・累计 {collectionStats.total} 枚</span>
        </div>
        <p className="omamori-section-hint">点击御守，查看它的含义与文化小知识。</p>

        <div className="omamori-lineup-grid">
          {collectionItems.map(item => {
            const rarity = getOmamoriRarity(item.rarity);
            return (
              <button
                type="button"
                key={item.id}
                data-omamori-collection
                data-sfx={item.owned ? SOUND_EFFECT_TYPES.WORD_SELECTED : 'none'}
                disabled={!item.owned}
                onClick={() => openOmamoriDetail(item)}
                className={`omamori-collection-item omamori-collection-item--${item.rarity.toLowerCase()} ${item.owned ? 'omamori-collection-item--owned' : 'omamori-collection-item--locked'} ${item.isNew ? 'omamori-collection-item--new' : ''}`}
                style={{ '--rarity-color': rarity.color, '--rarity-bg': rarity.bg, '--rarity-glow': rarity.glow }}
                aria-label={`${item.name}，${item.rarity}，累计${item.count}枚`}
              >
                <div className="omamori-collection-item__figure">
                  <img src={resolveIcon(item.iconPath)} alt={item.name} />
                  <div className="omamori-collection-item__rarity">{item.rarity}</div>
                </div>
                <span className="omamori-collection-item__meta">
                  {item.isNew && <span className="omamori-collection-item__new">New</span>}
                  <span className="omamori-collection-item__count">累计{item.count}枚</span>
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {phase === 'revealed' && result && (
        <GachaResultModal
          key={drawKey}
          result={result}
          reelItems={reelItems}
          targetIndex={REEL_TARGET_INDEX}
          coinImg={coinImg}
          canDrawAgain={canAfford}
          onClose={closeResult}
          onDrawAgain={handleDraw}
        />
      )}

      {selectedOmamori && (
        <OmamoriDetailModal
          key={selectedOmamori.id}
          item={selectedOmamori}
          onClose={closeOmamoriDetail}
        />
      )}
    </div>
  );
}

function GachaResultModal({ result, reelItems, targetIndex, coinImg, canDrawAgain, onClose, onDrawAgain }) {
  const resultIcon = useIcon(result.iconPath);
  const resolveIcon = useIconResolver();
  const overlayRef = useRef(null);
  const cardRef = useRef(null);
  const reelViewportRef = useRef(null);
  const reelTrackRef = useRef(null);
  const reelTargetRef = useRef(null);
  const particleRef = useRef(null);
  const btnsRef = useRef(null);
  const [settled, setSettled] = useState(false);
  const rarity = getOmamoriRarity(result.rarity);

  useEffect(() => {
    const overlay = overlayRef.current;
    const card = cardRef.current;
    const viewport = reelViewportRef.current;
    const track = reelTrackRef.current;
    const target = reelTargetRef.current;
    const particles = particleRef.current;
    const buttons = btnsRef.current;

    gsap.set(overlay, { opacity: 0 });
    gsap.set(card, { opacity: 0, y: 54, scale: 0.86, rotate: -1 });
    gsap.set(buttons, { opacity: 0, y: 12 });

    const startX = viewport ? Math.min(72, viewport.offsetWidth * 0.24) : 48;
    let endX = 0;
    if (viewport && target) {
      const targetCenter = target.offsetLeft + target.offsetWidth / 2;
      endX = viewport.offsetWidth / 2 - targetCenter;
    }
    gsap.set(track, { x: startX });

    const burstParticles = () => {
      const particleCount = result.rarity === 'SSR' ? 30 : result.rarity === 'SR' ? 24 : 18;
      for (let i = 0; i < particleCount; i += 1) {
        const el = document.createElement('img');
        el.src = resultIcon;
        el.alt = '';
        el.style.cssText = `
          position: absolute;
          left: calc(50% - 10px);
          top: 224px;
          width: ${10 + Math.random() * 12}px;
          height: ${14 + Math.random() * 16}px;
          object-fit: contain;
          pointer-events: none;
          z-index: 1;
        `;
        particles.appendChild(el);

        const angle = (i / particleCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.42;
        const dist = 78 + Math.random() * 90;
        gsap.fromTo(
          el,
          { x: 0, y: 0, scale: 0, opacity: 0.9, rotate: 0 },
          {
            x: Math.cos(angle) * dist,
            y: Math.sin(angle) * dist - 18,
            scale: 1,
            rotate: (Math.random() - 0.5) * 260,
            opacity: 0,
            duration: 1.12 + Math.random() * 0.48,
            delay: i * 0.018,
            ease: 'power2.out',
            onComplete: () => el.remove(),
          }
        );
      }
    };

    const tl = gsap.timeline();
    tl.to(overlay, { opacity: 1, duration: 0.18 });
    tl.to(card, { opacity: 1, y: 0, scale: 1, rotate: 0, duration: 0.44, ease: 'back.out(2)' }, '-=0.03');
    tl.to(track, {
      x: endX,
      duration: 2.15,
      ease: 'power4.out',
      onComplete: () => {
        setSettled(true);
        burstParticles();
        const isRare = result.rarity === 'SSR' || result.rarity === 'SR';
        playSoundEffect(isRare ? SOUND_EFFECT_TYPES.LEVEL_COMPLETE : SOUND_EFFECT_TYPES.ANSWER_CORRECT);
      },
    }, '-=0.06');
    tl.to(buttons, { opacity: 1, y: 0, duration: 0.28, ease: 'back.out(1.8)' }, '-=0.02');

    return () => {
      tl.kill();
      particles.replaceChildren();
    };
  }, [result.id, result.rarity, resultIcon]);

  const dismiss = (after) => {
    const tl = gsap.timeline({ onComplete: after });
    tl.to(cardRef.current, { opacity: 0, y: 36, scale: 0.94, duration: 0.22, ease: 'power2.in' });
    tl.to(overlayRef.current, { opacity: 0, duration: 0.16 }, '-=0.08');
  };

  return createPortal(
    <div
      ref={overlayRef}
      data-ui-click-sfx
      className={`omamori-result-overlay omamori-result-overlay--${result.rarity.toLowerCase()}`}
      style={{ '--rarity-color': rarity.color, '--rarity-bg': rarity.bg, '--rarity-glow': rarity.glow }}
    >
      <div ref={cardRef} className="omamori-result-card">
        <div ref={particleRef} className="omamori-result-particles" />
        <div className="omamori-result-card__shine" />
        <div className={`omamori-result-new-slot ${settled && result.isNew ? 'omamori-result-new-slot--show' : ''}`}>
          <span>New!!</span>
        </div>
        <div className="omamori-result-label">{settled ? '抽選結果' : '御守抽選中'}</div>

        <div className="omamori-result-reel">
          <div className="omamori-result-reel__marker" />
          <div ref={reelViewportRef} className="omamori-result-reel__viewport">
            <div ref={reelTrackRef} className="omamori-result-reel__track">
              {reelItems.map((item, index) => {
                const itemRarity = getOmamoriRarity(item.rarity);
                const itemIcon = resolveIcon(item.iconPath);
                const isTarget = index === targetIndex;
                return (
                  <div
                    key={item.reelKey ?? `${index}-${item.id}`}
                    ref={isTarget ? reelTargetRef : null}
                    className={`omamori-result-reel__item omamori-result-reel__item--${item.rarity.toLowerCase()} ${isTarget ? 'omamori-result-reel__item--target' : ''} ${settled && isTarget ? 'omamori-result-reel__item--settled' : ''}`}
                    style={{ '--rarity-color': itemRarity.color, '--rarity-bg': itemRarity.bg, '--rarity-glow': itemRarity.glow }}
                  >
                    <div className="omamori-result-reel__figure" style={{ '--omamori-mask': `url(${itemIcon})` }}>
                      <img src={itemIcon} alt={item.name} />
                    </div>
                    <span className="omamori-result-reel__rarity">{item.rarity}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <h2>{settled ? result.name : '運命の御守を選んでいます'}</h2>
        <p>{settled ? '御守・護身符' : '金色の光が導いています'}</p>
        <div className="omamori-result-rate">
          {settled ? `${result.rarity} 排出率 ${rarity.rate}%` : '横スクロール抽選中'}
        </div>

        <div ref={btnsRef} className="omamori-result-actions">
          <button type="button" onClick={() => dismiss(onClose)} className="btn-press omamori-result-button omamori-result-button--ghost">
            收下
          </button>
          <button
            type="button"
            onClick={() => dismiss(onDrawAgain)}
            disabled={!canDrawAgain}
            data-sfx={SOUND_EFFECT_TYPES.WORD_SELECTED}
            className="btn-press omamori-result-button omamori-result-button--draw"
          >
            <span>{canDrawAgain ? '再抽一次' : '金币不足'}</span>
            <span>
              <img src={coinImg} alt="" width={18} height={18} />
              {OMAMORI_GACHA_COST}
            </span>
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

function OmamoriDetailModal({ item, onClose }) {
  const resolveIcon = useIconResolver();
  const overlayRef = useRef(null);
  const imageRef = useRef(null);
  const panelRef = useRef(null);
  const rarity = getOmamoriRarity(item.rarity);

  useEffect(() => {
    const overlay = overlayRef.current;
    const image = imageRef.current;
    const panel = panelRef.current;

    gsap.set(overlay, { opacity: 0 });
    gsap.set(image, { opacity: 0, y: 128, scale: 0.34, rotate: -5 });
    gsap.set(panel, { opacity: 0, y: 34 });

    const tl = gsap.timeline();
    tl.to(overlay, { opacity: 1, duration: 0.18, ease: 'power2.out' });
    tl.to(image, { opacity: 1, y: 0, scale: 1, rotate: 0, duration: 0.62, ease: 'back.out(1.55)' }, 0.06);
    tl.to(panel, { opacity: 1, y: 0, duration: 0.36, ease: 'power2.out' }, 0.32);

    return () => tl.kill();
  }, [item.id]);

  const dismiss = () => {
    const tl = gsap.timeline({ onComplete: onClose });
    tl.to(panelRef.current, { opacity: 0, y: 28, duration: 0.2, ease: 'power2.in' });
    tl.to(imageRef.current, { opacity: 0, y: 76, scale: 0.72, rotate: 3, duration: 0.24, ease: 'power2.in' }, '-=0.12');
    tl.to(overlayRef.current, { opacity: 0, duration: 0.16, ease: 'power2.in' }, '-=0.08');
  };

  return createPortal(
    <div
      ref={overlayRef}
      data-ui-click-sfx
      className={`omamori-detail-overlay omamori-detail-overlay--${item.rarity.toLowerCase()}`}
      style={{ '--rarity-color': rarity.color, '--rarity-bg': rarity.bg, '--rarity-glow': rarity.glow }}
      role="dialog"
      aria-modal="true"
      aria-label={`${item.name} の御守詳細`}
    >
      <div className="omamori-detail-overlay__glow" aria-hidden="true" />
      <div className="omamori-detail-hero" aria-hidden="true">
        <div className="omamori-detail-hero__halo" />
        <img ref={imageRef} className="omamori-detail-image" src={resolveIcon(item.iconPath)} alt="" />
      </div>

      <section ref={panelRef} className="omamori-detail-panel">
        <div className="omamori-detail-panel__shine" aria-hidden="true" />
        <div className="omamori-detail-heading">
          <span className="omamori-detail-rarity">{item.rarity}</span>
          <span className="omamori-detail-count">{item.count > 0 ? `累计${item.count}枚` : '未获得'}</span>
        </div>
        <h2>{item.name}</h2>
        <p className="omamori-detail-subtitle">御守・護身符</p>
        <p className="omamori-detail-lore">{item.lore}</p>
        <button type="button" onClick={dismiss} className="btn-press omamori-detail-close">
          关闭
        </button>
      </section>
    </div>,
    document.body
  );
}
