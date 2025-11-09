import type React from 'react';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { shuffle } from 'lodash/fp';
import { useTournament } from '../hooks/useTournament';
import { setWinner } from '../modules/tournament/MatchResolver';
import { buildTournament } from '../modules/tournament/BracketBuilder';
import { Button, Typography, Progress, Space, Collapse, Row, Col } from 'antd';
import styles from './PlayPage.module.css';
import ItemCard from '../components/ItemCard';
import BracketGrid from '../components/BracketGrid';
const { Title, Text } = Typography;

const PlayPage: React.FC = () => {
  const { id } = useParams();
  const [tournament, update] = useTournament(id);
  const [selected, setSelected] = useState<string | null>(null);
  if (!tournament) return <div>Турнир не найден</div>;

  // Определяем текущий незавершённый раунд
  const unfinishedRounds = tournament.matches
    .filter((m) => !m.winner)
    .map((m) => m.round);
  const currentRound =
    unfinishedRounds.length > 0
      ? Math.min(...unfinishedRounds)
      : Math.max(...tournament.matches.map((m) => m.round));
  const matches = tournament.matches.filter((m) => m.round === currentRound);
  // Находим первый незавершённый матч текущего раунда
  const currentMatchIndex = matches.findIndex((m) => !m.winner);
  const currentMatch = matches[currentMatchIndex];

  const winner =
    tournament.matches.every((m) => m.winner) &&
    tournament.items.find((i) => i.id === tournament.winnerId);

  return (
    <div className={styles.container}>
      <Title level={4} className={styles.title}>
        {tournament.title}
      </Title>

      {!winner && (
        <Space
          direction="horizontal"
          style={{
            width: '100%',
            marginBottom: 12,
            justifyContent: 'space-between',
          }}
        >
          <Text type="secondary">Раунд: {currentRound}</Text>
          <Text type="secondary">
            Пара: {currentMatchIndex + 1} / {matches.length}
          </Text>
          <Progress
            percent={Math.round((currentMatchIndex / matches.length) * 100)}
            showInfo={false}
            style={{ minWidth: 120 }}
          />
        </Space>
      )}

      {currentMatch && (
        // <div className={styles.participantsRow}>
        <Row gutter={16} style={{ width: '100%' }}>
          {currentMatch.left && (
            <Col span={24} md={12}>
              <ItemCard
                item={currentMatch.left}
                selected={selected === currentMatch.left.id}
                disabled={!!currentMatch.winner}
                onClick={() => {
                  if (currentMatch.winner) return;
                  if (currentMatch.left && selected === currentMatch.left.id) {
                    const updated = setWinner(
                      tournament.id,
                      currentMatch.id,
                      currentMatch.left.id,
                    );
                    if (updated) update(updated);
                    setSelected(null);
                  } else if (currentMatch.left) {
                    setSelected(currentMatch.left.id);
                  }
                }}
              />
            </Col>
          )}
          {currentMatch.right && (
            <Col span={24} md={12}>
              <ItemCard
                item={currentMatch.right}
                selected={selected === currentMatch.right.id}
                disabled={!!currentMatch.winner}
                onClick={() => {
                  if (currentMatch.winner) return;
                  if (
                    currentMatch.right &&
                    selected === currentMatch.right.id
                  ) {
                    const updated = setWinner(
                      tournament.id,
                      currentMatch.id,
                      currentMatch.right.id,
                    );
                    if (updated) update(updated);
                    setSelected(null);
                  } else if (currentMatch.right) {
                    setSelected(currentMatch.right.id);
                  }
                }}
              />
            </Col>
          )}
        </Row>
      )}

      {winner && (
        <div className={styles.winner}>
          <Title level={3} style={{ textAlign: 'center' }}>
            Победитель турнира
          </Title>
          <ItemCard item={winner} disabled />
        </div>
      )}

      <Collapse className={styles.bracket}>
        <Collapse.Panel header="Сетка турнира" key="1">
          <BracketGrid tournament={tournament} />
        </Collapse.Panel>
      </Collapse>

      <Space.Compact direction="horizontal" style={{ marginTop: 16 }}>
        <Button
          type="default"
          onClick={() => {
            const newTournament = buildTournament(
              tournament.items,
              tournament.title,
            );
            update({ ...newTournament, id: tournament.id });
          }}
        >
          Сыграть заново
        </Button>
        <Button
          type="default"
          onClick={() => {
            const newTournament = buildTournament(
              shuffle(tournament.items),
              tournament.title,
            );
            update({ ...newTournament, id: tournament.id });
          }}
        >
          Перемешать и начать заново
        </Button>
      </Space.Compact>
    </div>
  );
};

export default PlayPage;
