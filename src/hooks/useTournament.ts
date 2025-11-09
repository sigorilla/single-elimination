import { useState, useEffect } from 'react';
import type { Tournament } from '../types/tournament';
import { TournamentRepository } from '../modules/tournament/TournamentRepository';

export function useTournament(id?: string) {
  const [tournament, setTournament] = useState<Tournament | undefined>(
    undefined,
  );

  useEffect(() => {
    if (!id) return;
    setTournament(TournamentRepository.getById(id));
  }, [id]);

  const update = (t: Tournament) => {
    TournamentRepository.save(t);
    setTournament({ ...t });
  };

  return [tournament, update] as const;
}
