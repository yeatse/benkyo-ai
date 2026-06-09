import { ITEM_DEFINITIONS } from '../data/shopItems';

const itemById = new Map(ITEM_DEFINITIONS.map(item => [item.id, item]));

function createItemReward(itemId) {
  const item = itemById.get(itemId);
  if (!item) return null;
  return {
    type: 'item',
    itemId,
    amount: 1,
    label: item.name,
    iconPath: item.iconPath,
  };
}

function pickWeighted(options) {
  const roll = Math.random();
  let cursor = 0;
  for (const option of options) {
    cursor += option.chance;
    if (roll < cursor) return option.itemId ? createItemReward(option.itemId) : null;
  }
  return null;
}

export function drawLessonGiftboxReward(stars) {
  if (stars === 3) {
    return pickWeighted([
      { itemId: 'giftbox2', chance: 0.7 },
      { itemId: 'giftbox1', chance: 0.3 },
    ]);
  }

  if (stars === 2) {
    return pickWeighted([
      { itemId: 'giftbox2', chance: 0.5 },
      { itemId: 'giftbox1', chance: 0.5 },
    ]);
  }

  if (stars === 1) {
    return pickWeighted([
      { itemId: 'giftbox1', chance: 0.7 },
      { itemId: null, chance: 0.3 },
    ]);
  }

  return null;
}

export function createListeningGiftboxReward() {
  return createItemReward('giftbox1');
}

export function drawWordReviewGiftboxReward() {
  return pickWeighted([
    { itemId: 'giftbox1', chance: 0.3 },
    { itemId: null, chance: 0.7 },
  ]);
}