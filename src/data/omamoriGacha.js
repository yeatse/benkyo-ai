export const OMAMORI_GACHA_COST = 200;

export const OMAMORI_RARITIES = {
  N: {
    label: 'N',
    rate: 72,
    color: '#64748B',
    bg: 'linear-gradient(135deg, #F8FAFC, #E2E8F0)',
    glow: 'rgba(148, 163, 184, 0.34)',
  },
  R: {
    label: 'R',
    rate: 15,
    color: '#0D9488',
    bg: 'linear-gradient(135deg, #CCFBF1, #99F6E4)',
    glow: 'rgba(20, 184, 166, 0.34)',
  },
  SR: {
    label: 'SR',
    rate: 10,
    color: '#7C3AED',
    bg: 'linear-gradient(135deg, #EDE9FE, #C4B5FD)',
    glow: 'rgba(124, 58, 237, 0.40)',
  },
  SSR: {
    label: 'SSR',
    rate: 3,
    color: '#D97706',
    bg: 'linear-gradient(135deg, #FEF3C7, #FDBA74)',
    glow: 'rgba(245, 158, 11, 0.48)',
  },
};

export const OMAMORI_ITEMS = [
  { id: 'n-bakusui', rarity: 'N', name: '爆睡祈願', iconPath: 'sd/n-爆睡祈願.png' },
  { id: 'n-fufu', rarity: 'N', name: '夫婦円満', iconPath: 'sd/n-夫婦円満.png' },
  { id: 'n-kanai', rarity: 'N', name: '家内安全', iconPath: 'sd/n-家内安全.png' },
  { id: 'n-kenko', rarity: 'N', name: '健康祈願', iconPath: 'sd/n-健康祈願.png' },
  { id: 'n-ryoko', rarity: 'N', name: '旅行安全', iconPath: 'sd/n-旅行安全.png' },
  { id: 'n-gakugyo', rarity: 'N', name: '学業成就', iconPath: 'sd/n-学業成就.png' },
  { id: 'n-ippo', rarity: 'N', name: '一歩一歩', iconPath: 'sd/n-一歩一歩.png' },
  { id: 'n-geiji', rarity: 'N', name: '芸事上達', iconPath: 'sd/n-芸事上達.png' },
  { id: 'n-teruteru', rarity: 'N', name: 'てるてる坊主', iconPath: 'sd/n-てるてる坊主.png' },

  { id: 'r-byoki', rarity: 'R', name: '病気平癒', iconPath: 'sd/r-病気平癒.png' },
  { id: 'r-shusse', rarity: 'R', name: '出世成功', iconPath: 'sd/r-出世成功.png' },
  { id: 'r-gokaku', rarity: 'R', name: '合格祈願', iconPath: 'sd/r-合格祈願.png' },
  { id: 'r-shushoku', rarity: 'R', name: '就職成就', iconPath: 'sd/r-就職成就.png' },
  { id: 'r-renai', rarity: 'R', name: '恋愛成就', iconPath: 'sd/r-恋愛成就.png' },
  { id: 'r-ningen', rarity: 'R', name: '人間関係', iconPath: 'sd/r-人間関係.png' },
  { id: 'r-shobai', rarity: 'R', name: '商売繁盛', iconPath: 'sd/r-商売繁盛.png' },
  { id: 'r-goi', rarity: 'R', name: '語彙力向上', iconPath: 'sd/r-語彙力向上.png' },
  { id: 'r-enmusubi', rarity: 'R', name: '縁結び', iconPath: 'sd/r-縁結び.png' },

  { id: 'sr-yakuyoke', rarity: 'SR', name: '厄除け', iconPath: 'sd/sr-厄除け.png' },
  { id: 'sr-kinun', rarity: 'SR', name: '金運上昇', iconPath: 'sd/sr-金運上昇.png' },
  { id: 'sr-katsumori', rarity: 'SR', name: '勝守', iconPath: 'sd/sr-勝守.png' },
  { id: 'sr-shogan', rarity: 'SR', name: '诸願成就', iconPath: 'sd/sr-诸願成就.png' },
  { id: 'sr-inari', rarity: 'SR', name: 'お稲荷さん', iconPath: 'sd/sr-お稲荷さん.png' },
  { id: 'sr-tengu', rarity: 'SR', name: 'てんぐ', iconPath: 'sd/sr-てんぐ.png' },

  { id: 'ssr-rensho', rarity: 'SSR', name: '连勝守', iconPath: 'sd/ssr-连勝守.png' },
  { id: 'ssr-kizuna', rarity: 'SSR', name: '勉強ちゃんの絆', iconPath: 'sd/ssr-勉強ちゃんの絆.png' },
  { id: 'ssr-fujisan', rarity: 'SSR', name: 'ふじさん', iconPath: 'sd/ssr-ふじさん.png' },
];

export const OMAMORI_RARITY_ORDER = ['SSR', 'SR', 'R', 'N'];

export function getOmamoriRarity(rarity) {
  return OMAMORI_RARITIES[rarity] ?? OMAMORI_RARITIES.N;
}

export function drawOmamori() {
  const roll = Math.random() * 100;
  let rarity = 'SSR';

  if (roll < OMAMORI_RARITIES.N.rate) {
    rarity = 'N';
  } else if (roll < OMAMORI_RARITIES.N.rate + OMAMORI_RARITIES.R.rate) {
    rarity = 'R';
  } else if (roll < OMAMORI_RARITIES.N.rate + OMAMORI_RARITIES.R.rate + OMAMORI_RARITIES.SR.rate) {
    rarity = 'SR';
  }

  const pool = OMAMORI_ITEMS.filter(item => item.rarity === rarity);
  const item = pool[Math.floor(Math.random() * pool.length)];
  return { ...item, rarityMeta: getOmamoriRarity(item.rarity) };
}
