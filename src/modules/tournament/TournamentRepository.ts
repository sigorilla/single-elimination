import type { Tournament } from '../../types/tournament';
import { getStorage, setStorage } from '../storage/storage';

const STORAGE_KEY = 'se:tournaments';

export const TournamentRepository = {
  getAll(): Tournament[] {
    return getStorage<Tournament[]>(STORAGE_KEY, []);
  },

  getById(id: string): Tournament | undefined {
    return TournamentRepository.getAll().find((t) => t.id === id);
  },

  saveAll(tournaments: Tournament[]): void {
    setStorage(STORAGE_KEY, tournaments);
  },

  save(tournament: Tournament): void {
    const tournaments = TournamentRepository.getAll();
    const idx = tournaments.findIndex((t) => t.id === tournament.id);
    if (idx >= 0) {
      tournaments[idx] = tournament;
    } else {
      tournaments.push(tournament);
    }
    TournamentRepository.saveAll(tournaments);
  },

  updateStatus(id: string, status: Tournament['status']): void {
    const tournaments = TournamentRepository.getAll();
    const idx = tournaments.findIndex((t) => t.id === id);
    if (idx >= 0) {
      tournaments[idx].status = status;
      TournamentRepository.saveAll(tournaments);
    }
  },

  remove(id: string): void {
    const tournaments = TournamentRepository.getAll().filter(
      (t) => t.id !== id,
    );
    TournamentRepository.saveAll(tournaments);
  },

  clearAll(): void {
    setStorage(STORAGE_KEY, []);
  },
};
