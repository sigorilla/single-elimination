import { useState, useEffect } from 'react';
import type { Tournament } from '../types/tournament';
import { TournamentRepository } from '../modules/tournament/TournamentRepository';

export function useTournaments() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);

  useEffect(() => {
    setTournaments(TournamentRepository.getAll());
  }, []);

  const remove = (t: Tournament) => {
    TournamentRepository.remove(t.id);
    setTournaments(TournamentRepository.getAll());
  };

  return [tournaments, remove] as const;
}
