import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import useVocabStore from '../store/vocabStore';
import { useIcon } from '../lib/icons';

gsap.registerPlugin(useGSAP);

const PRACTICE_ENTRIES = [
  {
    id: 'listening',
    label: '听力练习',
    desc: '日语听辨训练',
    icon: 'sd/sd_lc_listening.png',
  },
  {
    id: 'course-review',
    label: '课程巩固',
    desc: '复习已学关卡',
    icon: 'sd/sd_learn.png',
  },
  {
    id: 'word-review',
    label: '单词复习',
    desc: '强化词汇记忆',
    icon: 'sd/sd_lc_word.png',
  },
  {
    id: 'mistakes',
    label: '错题重练',
    desc: '回看薄弱题目',
    icon: 'sd/sd_lc_incorrect.png',
  },
];

export default function VocabPage() {
  const words = useVocabStore(s => s.words);
  const navigate = useNavigate();
  const bookImg = useIcon('ui/book.png');
  const headerRef = useRef(null);
  const contentRef = useRef(null);

  useGSAP(() => {
    const cards = contentRef.current?.querySelectorAll('[data-practice-card]');
    gsap.set([headerRef.current, contentRef.current], { opacity: 0, y: 18 });
    gsap.set(cards, { opacity: 0, y: 18, scale: 0.98 });
  });

  useGSAP(() => {
    const cards = contentRef.current?.querySelectorAll('[data-practice-card]');
    const sdImages = contentRef.current?.querySelectorAll('[data-practice-sd]');

    gsap.to(headerRef.current, { opacity: 1, y: 0, duration: 0.36, ease: 'back.out(2)' });
    gsap.to(contentRef.current, { opacity: 1, y: 0, duration: 0.34, ease: 'back.out(1.7)', delay: 0.08 });
    gsap.to(cards, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.42,
      ease: 'back.out(1.8)',
      stagger: 0.06,
      delay: 0.12,
    });
    gsap.to(sdImages, {
      y: -5,
      rotate: 1.5,
      repeat: -1,
      yoyo: true,
      duration: 2.6,
      ease: 'sine.inOut',
      stagger: 0.35,
      delay: 0.7,
    });

  }, []);

  return (
    <div
      data-ui-click-sfx
      className="h-full overflow-y-auto scroll-y"
      style={{ background: '#F5F3FF', position: 'relative' }}
    >
      <div style={{ padding: '18px 16px 28px', position: 'relative', zIndex: 1 }}>
        <h1
          ref={headerRef}
          style={{ fontSize: 18, fontWeight: 900, color: '#4B5563', margin: '0 0 10px' }}
        >
          练习中心
        </h1>

        <div ref={contentRef}>
          <div style={{ display: 'grid', gap: 18 }}>
            {PRACTICE_ENTRIES.map(entry => (
              <PracticeEntry key={entry.id} entry={entry} />
            ))}
          </div>

          <PracticeSection title="我的笔记" style={{ marginTop: 24 }}>
            <PracticeEntry
              entry={{
                id: 'vocab-book',
                label: '单词本',
                icon: 'ui/book.png',
                bg: 'var(--tp-lite)',
                badge: words.length > 0 ? String(words.length) : '',
              }}
              iconSrc={bookImg}
              onClick={() => navigate('/vocab/book')}
            />
          </PracticeSection>
        </div>
      </div>
    </div>
  );
}

function PracticeSection({ title, style, children }) {
  return (
    <section style={style}>
      <h2 style={{ fontSize: 18, fontWeight: 900, color: '#4B5563', margin: '0 0 10px' }}>
        {title}
      </h2>
      <div style={{ display: 'grid', gap: 12 }}>
        {children}
      </div>
    </section>
  );
}

function PracticeEntry({ entry, iconSrc, onClick }) {
  const resolvedIcon = useIcon(entry.icon);
  const src = iconSrc || resolvedIcon;

  if (entry.desc) {
    return (
      <div
        data-practice-card
        style={{
          height: 126,
          paddingTop: 18,
          position: 'relative',
        }}
      >
        <button
          type="button"
          className="btn-press"
          style={{
            width: '100%',
            minHeight: 108,
            background: 'white',
            border: '2px solid #E5E7EB',
            borderRadius: 12,
            padding: '18px 132px 18px 22px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'flex-start',
            gap: 6,
            boxShadow: '0 3px 0 #E5E7EB',
            cursor: 'default',
            position: 'relative',
            overflow: 'visible',
            textAlign: 'left',
          }}
        >
          <span style={{ fontSize: 17, fontWeight: 900, color: '#4B5563', whiteSpace: 'nowrap' }}>
            {entry.label}
          </span>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#9CA3AF', lineHeight: 1.35 }}>
            {entry.desc}
          </span>
          <img
            data-practice-sd
            src={src}
            alt=""
            width={126}
            height={126}
            style={{
              position: 'absolute',
              right: 4,
              bottom: -4,
              width: 126,
              height: 126,
              objectFit: 'contain',
              pointerEvents: 'none',
            }}
          />
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      className="btn-press"
      onClick={onClick}
      style={{
        width: '100%',
        minHeight: 74,
        background: 'white',
        border: '2px solid #E5E7EB',
        borderRadius: 12,
        padding: '12px 14px 12px 22px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
        boxShadow: '0 2px 0 #E5E7EB',
        cursor: onClick ? 'pointer' : 'default',
        position: 'relative',
        overflow: 'hidden',
        textAlign: 'left',
      }}
    >
      <span style={{ fontSize: 16, fontWeight: 900, color: '#4B5563', whiteSpace: 'nowrap' }}>
        {entry.label}
      </span>
      <span
        style={{
          width: 56,
          height: 56,
          borderRadius: 16,
          background: entry.bg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <img src={src} alt="" width={42} height={42} style={{ objectFit: 'contain' }} />
      </span>
      {entry.badge && (
        <span
          style={{
            position: 'absolute',
            top: -2,
            right: -2,
            minWidth: 20,
            height: 20,
            borderRadius: 999,
            background: '#EF4444',
            color: 'white',
            fontSize: 11,
            fontWeight: 900,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 5px',
            border: '2px solid white',
          }}
        >
          {entry.badge}
        </span>
      )}
    </button>
  );
}
