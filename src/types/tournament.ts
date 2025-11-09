export type Item = {
  id: string;
  name: string;
  description?: string;
  image?: string;
};

export type Match = {
  id: string;
  round: number;
  left?: Item;
  right?: Item;
  winner?: Item['id'];
};

export type Tournament = {
  id: string;
  title: string;
  createdAt: string;
  items: Item[];
  matches: Match[];
  status: 'draft' | 'running' | 'finished';
  winnerId?: string;
  schemaVersion?: number;
};
