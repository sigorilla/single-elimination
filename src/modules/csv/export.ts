import { Item } from '../../types/tournament';

export function exportCSV(items: Item[]): string {
  const header = ['name', 'description', 'image'];
  const rows = items.map(i => [i.name, i.description || '', i.image || ''].join(','));
  return [header.join(','), ...rows].join('\n');
}
