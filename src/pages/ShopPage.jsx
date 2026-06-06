import { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import useUserStore from '../store/userStore';
import { SHOP_ITEMS } from '../data/shopItems';
import { useIcon, useIconResolver } from '../lib/icons';
import OmamoriGacha from '../components/Shop/OmamoriGacha';

gsap.registerPlugin(useGSAP);

// Flash feedback: item id → 'bought' | 'broke'
function useFlash() {
  const [flash, setFlash] = useState({});
  const trigger = (id, type) => {
    setFlash(f => ({ ...f, [id]: type }));
    setTimeout(() => setFlash(f => ({ ...f, [id]: null })), 1200);
  };
  return [flash, trigger];
}

export default function ShopPage() {
  const coins = useUserStore(s => s.coins);
  const purchaseItem = useUserStore(s => s.purchaseItem);
  const inventory = useUserStore(s => s.inventory);
  const [activeView, setActiveView] = useState('items');
  const bagImg = useIcon('ui/bag.png');
  const cartImg = useIcon('ui/shopping_cart.png');
  const coinImg = useIcon('item/coin.png');
  const sdShoppingImg = useIcon('sd/sd_shopping.png');
  const omamoriImg = useIcon('sd/sr-てんぐ.png');
  const resolveIcon = useIconResolver();
  const [flash, triggerFlash] = useFlash();

  const headerRef = useRef(null);
  const contentRef = useRef(null);
  const stripeRef  = useRef(null);
  const isGachaView = activeView === 'gacha';

  // FOUC prevention
  useGSAP(() => {
    gsap.set([headerRef.current, contentRef.current], { opacity: 0, y: 16 });
  });

  // Stripe scroll (infinite)
  useGSAP(() => {
    gsap.to(stripeRef.current, {
      backgroundPositionX: '+=60px',
      repeat: -1,
      duration: 3.5,
      ease: 'none',
    });
  }, []);

  // Entrance animation
  useGSAP(() => {
    const tl = gsap.timeline();
    tl.to(headerRef.current, { opacity: 1, y: 0, duration: 0.38, ease: 'back.out(1.8)' }, 0.05);
    tl.to(contentRef.current, { opacity: 1, y: 0, duration: 0.35, ease: 'back.out(1.7)' }, 0.15);
  }, []);

  useGSAP(() => {
    if (!contentRef.current) return;
    gsap.fromTo(
      contentRef.current,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.28, ease: 'back.out(1.7)' }
    );
  }, [activeView]);

  const handleBuy = (item) => {
    if (coins < item.price) {
      triggerFlash(item.id, 'broke');
      return;
    }
    const ok = purchaseItem(item.id, item.price);
    if (ok) triggerFlash(item.id, 'bought');
  };

  return (
    <div
      data-ui-click-sfx
      className="h-full"
      style={{
        background: isGachaView
          ? 'linear-gradient(180deg, #FFF7ED 0%, #F5F3FF 54%, #ECFDF5 100%)'
          : '#F5F3FF',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div className="shop-page-scroll scroll-y">
        {/* Header */}
        <div
          ref={headerRef}
          style={{
            background: isGachaView
              ? 'linear-gradient(145deg, #EF4444 0%, #F59E0B 42%, var(--tp) 100%)'
              : 'linear-gradient(155deg, var(--tp) 0%, var(--tp-from) 100%)',
            padding: '32px 20px 48px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* 滚动斜纹覆盖层 */}
          <div
            ref={stripeRef}
            style={{
              position: 'absolute', inset: 0,
              backgroundImage: `repeating-linear-gradient(
                58deg,
                transparent,
                transparent 20px,
                rgba(255,255,255,0.12) 20px,
                rgba(255,255,255,0.12) 50px
              )`,
              backgroundSize: '60px 100%',
              pointerEvents: 'none',
            }}
          />
          <img
            src={isGachaView ? omamoriImg : sdShoppingImg}
            alt=""
            aria-hidden="true"
            width={isGachaView ? 142 : 172}
            height={isGachaView ? 172 : 172}
            style={{
              position: 'absolute',
              right: isGachaView ? 14 : -12,
              bottom: isGachaView ? -20 : -22,
              objectFit: 'contain',
              pointerEvents: 'none',
              zIndex: 1,
              transform: isGachaView ? 'rotate(8deg)' : 'none',
              filter: isGachaView ? 'drop-shadow(0 14px 18px rgba(127,29,29,0.22))' : 'none',
            }}
          />
          <h1 style={{ fontSize: 24, fontWeight: 900, color: 'white', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8, position: 'relative', zIndex: 2 }}>
            <img src={isGachaView ? omamoriImg : cartImg} alt="商店" width={32} height={32} style={{ objectFit: 'contain' }} />
            {isGachaView ? '御守 Gacha' : '道具商店'}
          </h1>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginBottom: 16, position: 'relative', zIndex: 2 }}>
            {isGachaView ? '抽取可爱的御守，给学习路上添一点好运' : '消费金币，获得强力道具'}
          </p>
          {/* Coin balance chip */}
          <div
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'rgba(255,255,255,0.18)',
              backdropFilter: 'blur(6px)',
              borderRadius: 20, padding: '6px 14px',
              border: '1.5px solid rgba(255,255,255,0.28)',
              position: 'relative',
              zIndex: 2,
            }}
          >
            <img src={coinImg} alt="金币" width={22} height={22} style={{ objectFit: 'contain' }} />
            <span style={{ fontWeight: 800, color: 'white', fontSize: 16 }}>{coins}</span>
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>金币余额</span>
          </div>
        </div>

        <div ref={contentRef} style={{ margin: '-20px 16px 0', position: 'relative' }}>
          {isGachaView ? (
            <OmamoriGacha />
          ) : (
            <>
              {SHOP_ITEMS.map((item) => {
                const itemImg = resolveIcon(item.iconPath);
                const owned = inventory?.[item.id] ?? 0;
                const canAfford = coins >= item.price;
                const f = flash[item.id];
                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl mb-4 flex items-center gap-4"
                    style={{
                      padding: '16px',
                      boxShadow: '0 4px 20px rgba(91,79,233,0.10)',
                      border: f === 'bought'
                        ? '2px solid #22C55E'
                        : f === 'broke'
                        ? '2px solid #EF4444'
                        : '2px solid transparent',
                      transition: 'border-color 0.2s',
                    }}
                  >
                    {/* Icon */}
                    <div
                      style={{
                        width: 56, height: 56, borderRadius: 16,
                        background: item.iconBg,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 28, flexShrink: 0,
                      }}
                    >
                      <img src={itemImg} alt={item.name} width={36} height={36} style={{ objectFit: 'contain' }} />
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                        <span style={{ fontSize: 15, fontWeight: 800, color: '#1E1B4B' }}>{item.name}</span>
                        {item.subtitle && (
                          <span
                            style={{
                              fontSize: 10, fontWeight: 700, color: item.color,
                              background: item.iconBg,
                              borderRadius: 8, padding: '1px 7px',
                            }}
                          >
                            {item.subtitle}
                          </span>
                        )}
                      </div>
                      <p style={{ fontSize: 12, color: '#6B7280', marginBottom: 6, lineHeight: 1.4 }}>{item.desc}</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <img src={coinImg} alt="金币" width={22} height={22} style={{ objectFit: 'contain' }} />
                        <span style={{ fontSize: 15, fontWeight: 800, color: '#D97706' }}>{item.price}</span>
                        {owned > 0 && (
                          <span
                            style={{
                              marginLeft: 4, fontSize: 11, fontWeight: 700,
                              color: 'var(--tp)', background: 'var(--tp-lite)',
                              borderRadius: 10, padding: '1px 8px',
                            }}
                          >
                            已拥有 {owned}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Buy button */}
                    <button
                      onClick={() => handleBuy(item)}
                      style={{
                        flexShrink: 0,
                        padding: '8px 16px',
                        borderRadius: 14,
                        fontWeight: 800,
                        fontSize: 14,
                        border: 'none',
                        cursor: canAfford ? 'pointer' : 'not-allowed',
                        transition: 'all 0.18s',
                        ...(f === 'bought'
                          ? { background: '#22C55E', color: 'white' }
                          : f === 'broke'
                          ? { background: '#FEE2E2', color: '#EF4444' }
                          : canAfford
                          ? { background: 'linear-gradient(135deg, var(--tp-from), var(--tp))', color: 'white', boxShadow: '0 3px 10px rgba(91,79,233,0.32)' }
                          : { background: '#F3F4F6', color: '#9CA3AF' }),
                      }}
                    >
                      {f === 'bought' ? '✓ 已购买' : f === 'broke' ? '金币不足' : '购买'}
                    </button>
                  </div>
                );
              })}

              {/* Bottom hint */}
              <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--tp-bdr)', fontWeight: 600, marginTop: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                <img src={bagImg} alt="背包" width={16} height={16} style={{ objectFit: 'contain' }} /> 购买后在「我的 → 背包」中使用
              </p>
            </>
          )}
        </div>
      </div>

      <div className="shop-view-switcher" role="tablist" aria-label="商店切换">
        <button
          type="button"
          role="tab"
          aria-selected={!isGachaView}
          onClick={() => setActiveView('items')}
          className={`btn-press ${!isGachaView ? 'is-active' : ''}`}
        >
          <img src={cartImg} alt="" />
          <span>道具商店</span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={isGachaView}
          onClick={() => setActiveView('gacha')}
          className={`btn-press ${isGachaView ? 'is-active' : ''}`}
        >
          <img src={omamoriImg} alt="" />
          <span>御守・護身符</span>
        </button>
      </div>
    </div>
  );
}
