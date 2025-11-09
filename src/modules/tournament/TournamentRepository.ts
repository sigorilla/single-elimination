import { Tournament } from '../../types/tournament';
import { getStorage, setStorage } from '../storage/storage';

const STORAGE_KEY = 'se:tournaments';

export class TournamentRepository {
  static getAll(): Tournament[] {
    return getStorage<Tournament[]>(STORAGE_KEY, []);
  }

  static getById(id: string): Tournament | undefined {
    return this.getAll().find(t => t.id === id);
  }

  static saveAll(tournaments: Tournament[]): void {
    setStorage(STORAGE_KEY, tournaments);
  }

  static save(tournament: Tournament): void {
    const tournaments = this.getAll();
    const idx = tournaments.findIndex(t => t.id === tournament.id);
    if (idx >= 0) {
      tournaments[idx] = tournament;
    } else {
      tournaments.push(tournament);
    }
    this.saveAll(tournaments);
  }

  static updateStatus(id: string, status: Tournament['status']): void {
    const tournaments = this.getAll();
    const idx = tournaments.findIndex(t => t.id === id);
    if (idx >= 0) {
      tournaments[idx].status = status;
      this.saveAll(tournaments);
    }
  }

  static remove(id: string): void {
    const tournaments = this.getAll().filter(t => t.id !== id);
    this.saveAll(tournaments);
  }

  static clearAll(): void {
    setStorage(STORAGE_KEY, []);
  }
}
