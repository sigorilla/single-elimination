
import React, { useRef } from 'react';
import { Tournament } from '../types/tournament';
import { SingleEliminationBracket, Match as RTBMatch, SVGViewer } from 'react-tournament-brackets';
import useComponentSize from '@rehooks/component-size';

interface BracketGridProps {
  tournament: Tournament;
}

function toRTBMatches(matches: Tournament['matches']) {
  // Группируем матчи по раундам
  const rounds: Record<number, Tournament['matches']> = {};
  matches.forEach(m => {
    if (!rounds[m.round]) rounds[m.round] = [];
    rounds[m.round].push(m);
  });

  // Связываем nextMatchId для любого количества пар
  const matchIdToNext: Record<string, string | null> = {};
  const roundNumbers = Object.keys(rounds).map(Number).sort((a, b) => a - b);
  for (let i = 0; i < roundNumbers.length - 1; i++) {
    const curr = rounds[roundNumbers[i]];
    const next = rounds[roundNumbers[i + 1]];
    const nextLen = next.length;
    curr.forEach((m, idx) => {
      // Для каждого матча ищем ближайший следующий (idx / curr.length * nextLen)
      // Это равномерное распределение, работает для некратных двойке
      const nextIdx = Math.floor(idx * nextLen / curr.length);
      matchIdToNext[m.id] = next[nextIdx]?.id || null;
    });
  }
  // Финальный раунд — nextMatchId = null
  rounds[roundNumbers[roundNumbers.length - 1]].forEach(m => {
    matchIdToNext[m.id] = null;
  });

  return matches.map((m, matchIndex) => {
    const participants = [];
    if (m.left) {
      participants.push({
        id: m.left.id,
        name: m.left.name,
        isWinner: m.winner === m.left.id,
        resultText: m.winner === m.left.id ? 'WON' : '',
        status: null,
      });
    }
    if (m.right) {
      participants.push({
        id: m.right.id,
        name: m.right.name,
        isWinner: m.winner === m.right.id,
        resultText: m.winner === m.right.id ? 'WON' : '',
        status: null,
      });
    } else {
      // Фиктивный участник для автопрохода (bye)
      participants.push({
        id: 'bye-' + m.id,
        name: '—',
        isWinner: false,
        resultText: '',
        status: 'NO_SHOW',
      });
    }
    return {
      id: m.id,
      name: `Раунд ${m.round}, матч ${matchIndex + 1}`,
      nextMatchId: matchIdToNext[m.id],
      tournamentRoundText: String(m.round),
      startTime: '',
      state: 'DONE',
      participants,
    };
  });
}

const BracketGrid: React.FC<BracketGridProps> = ({ tournament }) => {
  const rtbMatches = toRTBMatches(tournament.matches);
  const containerRef = useRef<HTMLDivElement>(null);
  const size = useComponentSize(containerRef);
  const svgWidth = size.width;
  const svgHeight = 600;
  return (
    <div ref={containerRef}>
      <SingleEliminationBracket
        matches={rtbMatches}
        matchComponent={RTBMatch}
        svgWrapper={({ children, ...props }) => (
          <SVGViewer {...props} width={svgWidth} height={svgHeight}>
            {children}
          </SVGViewer>
        )}
      />
    </div>
  );
};

export default BracketGrid;
