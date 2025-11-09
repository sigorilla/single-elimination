import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TournamentRepository } from '../modules/tournament/TournamentRepository';
import { Card, Button, Typography, List, Space } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import styles from './HomePage.module.css';
import {useTournaments} from '../hooks/useTournaments';
const { Title, Text } = Typography;

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [tournaments, deleteTournament] = useTournaments();
  return (
    <div className={styles.container}>
      <Title level={2} className={styles.title}>История турниров</Title>
      <List
        dataSource={tournaments}
        rowKey="id"
        renderItem={t => (
          <List.Item>
            <Card
              hoverable
              style={{ width: '100%', cursor: 'pointer' }}
              onClick={() => navigate(`/play/${t.id}`)}
            >
              <Space direction="horizontal" style={{ width: '100%', justifyContent: 'space-between' }}>
                <Space direction="vertical">
                  <Text strong>{t.title}</Text>
                  <Text type={t.status === 'finished' ? 'success' : 'secondary'}>
                    {t.status === 'finished' ? 'Завершён' : t.status === 'running' ? 'В процессе' : 'Черновик'}
                  </Text>
                </Space>
                <Button
                  danger
                  size="small"
                  icon={<DeleteOutlined />}
                  onClick={e => {
                    e.stopPropagation();
                    deleteTournament(t);
                  }}
                />
              </Space>
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
};

export default HomePage;
