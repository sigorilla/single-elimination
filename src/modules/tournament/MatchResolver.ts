import type { Tournament } from '../../types/tournament';
import { TournamentRepository } from './TournamentRepository';

export function setWinner(
  tournamentId: string,
  matchId: string,
  winnerId: string,
): Tournament | undefined {
  const tournament = TournamentRepository.getById(tournamentId);
  if (!tournament) return;
  const match = tournament.matches.find((m) => m.id === matchId);
  if (!match) return;
  match.winner = winnerId;

  // Победитель попадает только в ближайший следующий матч
  const nextRoundMatches = tournament.matches.filter(
    (m) => m.round === match.round + 1,
  );
  if (nextRoundMatches.length > 0) {
    const idx = Math.floor(
      tournament.matches.filter((m) => m.round === match.round).indexOf(match) /
        2,
    );
    const nextMatch = nextRoundMatches[idx];
    if (nextMatch) {
      if (!nextMatch.left)
        nextMatch.left = tournament.items.find((i) => i.id === winnerId);
      else if (!nextMatch.right)
        nextMatch.right = tournament.items.find((i) => i.id === winnerId);
    }
  }

  tournament.status = 'running';

  // Если все матчи завершены, установить winnerId турнира
  const finalMatch = tournament.matches.filter(
    (m) => m.round === Math.max(...tournament.matches.map((mm) => mm.round)),
  )[0];
  if (finalMatch?.winner) {
    tournament.winnerId = finalMatch.winner;
    tournament.status = 'finished';
  }

  TournamentRepository.save(tournament);
  return tournament;
}
