import { Tournament, Item, Match } from '../../types/tournament';

function isPowerOfTwo(n: number) {
  return (n & (n - 1)) === 0 && n !== 0;
}

function nextPowerOfTwo(n: number) {
  return Math.pow(2, Math.ceil(Math.log2(n)));
}



export function buildTournament(items: Item[], title: string): Tournament {
  const matches: Match[] = [];
  let round = 1;
  let currentItems = [...items];

  // Генерация всех раундов
  while (currentItems.length > 1) {
    const nextItems: Item[] = [];
    for (let i = 0; i < currentItems.length; i += 2) {
      if (i + 1 < currentItems.length) {
        matches.push({
          id: `m${round}-${i / 2}`,
          round,
          left: currentItems[i],
          right: currentItems[i + 1],
        });
        nextItems.push(null as any); // плейсхолдер для победителя
      } else {
        matches.push({
          id: `m${round}-${Math.ceil(i / 2)}`,
          round,
          left: currentItems[i],
        });
        nextItems.push(null as any); // плейсхолдер для победителя
      }
    }
    currentItems = nextItems;
    round++;
  }

  // Плейсхолдеры для следующих раундов (без участников)
  let prevRound = matches.filter(m => m.round === round - 1);
  while (prevRound.length > 1) {
    const nextRound: Match[] = [];
    for (let i = 0; i < prevRound.length; i += 2) {
      nextRound.push({
        id: `m${round}-${i / 2}`,
        round,
      });
    }
    if (prevRound.length % 2 === 1) {
      nextRound.push({
        id: `m${round}-${Math.ceil(prevRound.length / 2)}`,
        round,
      });
    }
    matches.push(...nextRound);
    prevRound = nextRound;
    round++;
  }

  return {
    id: Math.random().toString(36).slice(2, 10),
    title,
    createdAt: new Date().toISOString(),
    items,
    matches,
    status: 'draft',
  };
}
