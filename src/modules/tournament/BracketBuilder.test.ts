import { buildTournament } from './BracketBuilder';
import type { Item, Match, Tournament } from '../../types/tournament';

function filterMatches(t: Tournament, n: number): Match[] {
  return t.matches.filter((m) => m.round === n);
}

describe('buildTournament', () => {
  it('корректно строит сетку для 2 участников', () => {
    const items: Item[] = [
      { id: '1', name: 'A' },
      { id: '2', name: 'B' },
    ];
    const tournament = buildTournament(items, 'Тестовый турнир');
    // Сразу финал: 1 пара
    const round1 = filterMatches(tournament, 1);
    expect(round1.length).toBe(1);
    expect(round1.every((m) => m.left && m.right)).toBe(true);
    // Проверяем уникальность id
    const allIds = tournament.matches.map((m) => m.id);
    expect(new Set(allIds).size).toBe(allIds.length);
  });

  it('корректно строит сетку для 3 участников', () => {
    const items: Item[] = [
      { id: '1', name: 'A' },
      { id: '2', name: 'B' },
      { id: '3', name: 'C' },
    ];
    const tournament = buildTournament(items, 'Тестовый турнир');
    // Первый раунд: 2 пары
    const round1 = filterMatches(tournament, 1);
    expect(round1.length).toBe(2);
    expect(round1.some((m) => m.left && m.right)).toBe(true);
    // Final
    const round2 = filterMatches(tournament, 2);
    expect(round2.length).toBe(1);
    // Проверяем уникальность id
    const allIds = tournament.matches.map((m) => m.id);
    expect(new Set(allIds).size).toBe(allIds.length);
  });

  it('корректно строит сетку для 6 участников', () => {
    const items: Item[] = [
      { id: '1', name: 'A' },
      { id: '2', name: 'B' },
      { id: '3', name: 'C' },
      { id: '4', name: 'D' },
      { id: '5', name: 'E' },
      { id: '6', name: 'F' },
    ];
    const tournament = buildTournament(items, 'Тестовый турнир');
    // Первый раунд: 3 пары
    const round1 = filterMatches(tournament, 1);
    expect(round1.length).toBe(3);
    expect(round1.every((m) => m.left && m.right)).toBe(true);
    // Второй раунд: 2 пары
    const round2 = filterMatches(tournament, 2);
    expect(round2.length).toBe(2);
    // Финал: 1 пара
    const round3 = filterMatches(tournament, 3);
    expect(round3.length).toBe(1);
    // Проверяем уникальность id
    const allIds = tournament.matches.map((m) => m.id);
    expect(new Set(allIds).size).toBe(allIds.length);
  });
});
