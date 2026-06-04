// Shared item definitions — used by ShopPage and BackpackSheet.
// iconPath is resolved by src/lib/icons.js according to the active icon skin.

export const SHOP_ITEMS = [
  {
    id: 'xp2x_15',
    name: '双倍经验卡',
    subtitle: '15 分钟',
    desc: '提供双倍经验 15 分钟',
    icon: '⚡',
    iconPath: 'item/exp2.png',
    iconBg: '#FEF9C3',
    color: '#CA8A04',
    badgeBg: 'linear-gradient(135deg, #FEF08A, #FDE047)',
    price: 120,
    multiplier: 2,
  },
  {
    id: 'xp3x_15',
    name: '三倍经验卡',
    subtitle: '15 分钟',
    desc: '提供三倍经验 15 分钟',
    icon: '🚀',
    iconPath: 'item/exp3.png',
    iconBg: '#EDE9FE',
    color: '#7C3AED',
    badgeBg: 'linear-gradient(135deg, #C4B5FD, #A78BFA)',
    price: 160,
    multiplier: 3,
  },
  {
    id: 'cake',
    name: '蛋糕',
    subtitle: '',
    desc: '恢复 3 颗心',
    icon: '🎂',
    iconPath: 'item/cake.png',
    iconBg: '#FCE7F3',
    color: '#DB2777',
    badgeBg: 'linear-gradient(135deg, #FBCFE8, #F9A8D4)',
    price: 80,
  },
];
