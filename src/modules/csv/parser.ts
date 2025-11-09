import type { Item } from '../../types/tournament';
import { generateId } from '../../utils/id';
import { validateImageUrl } from '../../utils/image';

export function parseCSV(text: string): Item[] {
  const lines = text.split(/\r?\n/).filter(Boolean);
  const header = lines[0].split(/[,;]/);
  const nameIdx = header.findIndex((h) => h.trim().toLowerCase() === 'name');
  if (nameIdx === -1) {
    throw new Error('В CSV должен быть столбец name');
  }

  const descIdx = header.findIndex(
    (h) => h.trim().toLowerCase() === 'description',
  );
  const imgIdx = header.findIndex((h) => h.trim().toLowerCase() === 'image');
  const items: Item[] = [];
  for (let i = 1; i < lines.length; i++) {
    const row = lines[i].split(/[,;]/);
    const name = row[nameIdx]?.trim();
    if (!name) continue;

    const image = imgIdx >= 0 ? row[imgIdx]?.trim() : undefined;
    items.push({
      id: generateId(),
      name,
      description: descIdx >= 0 ? row[descIdx]?.trim() : undefined,
      image: image && validateImageUrl(image) ? image : undefined,
    });
  }
  return items;
}
