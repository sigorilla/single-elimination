import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { shuffle } from 'lodash/fp';
import { Row, Col, Card, Button, Input, Typography, Space, Table, Upload, message, Collapse, Modal } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

import { Tournament, Item } from '../types/tournament';
import { TournamentRepository } from '../modules/tournament/TournamentRepository';
import { buildTournament } from '../modules/tournament/BracketBuilder';
import BracketGrid from '../components/BracketGrid';
import { parseCSV } from '../modules/csv/parser'
import { generateId } from '../utils/id'

import styles from './SetupPage.module.css';

const { Title, Text } = Typography;

const TournamentSetupPage: React.FC = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [shuffled, setShuffled] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [error, setError] = useState('');
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [tournament, setTournament] = useState<Tournament | null>(null);

  useEffect(() => {
    setItems([]);
  }, []);

  const handleAdd = () => {
    if (!name.trim()) {
      setError('Название обязательно');
      return;
    }
    setItems([
      ...items,
      { id: generateId(), name: name.trim(), description: description.trim() || undefined, image: image.trim() || undefined }
    ]);
    setName('');
    setDescription('');
    setImage('');
    setError('');
  };

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = e => {
      const text = e.target?.result as string;
      const newItems = parseCSV(text);
      setItems([...items, ...newItems]);
      setError('');
    };
    reader.readAsText(file);
  };

  const generateTournament = () => {
    if (!title.trim() || items.length < 2) return;
    const tournament = buildTournament(
      shuffled ? shuffle(items) : items,
      title.trim()
    );
    setTournament(tournament);
  };

  const saveTournament = () => {
    if (!tournament) return;
    TournamentRepository.save(tournament);
    navigate(`/play/${tournament.id}`);
  };

  return (
    <div className={styles.container}>
      <Title level={2} className={styles.title}>Настройка турнира и импорт участников</Title>
      <Card className={styles.card}>
        <Space direction="vertical" className={styles.fullWidth} size={16}>
          <Text>Заголовок турнира</Text>
          <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Название турнира" className={styles.marginBottom8} />

          <Space direction="horizontal">
            <Button disabled={items.length < 2 || !title.trim()} onClick={() => {
              generateTournament();
              setIsPreviewVisible(true);
            }}>
              Предпросмотр турнира
            </Button>
            <Button type="primary" disabled={!tournament} onClick={saveTournament}>
              Создать турнир
            </Button>
          </Space>

          <Row gutter={16}>
            <Col span={12}>
              <Upload.Dragger
                accept=".csv"
                showUploadList={false}
                beforeUpload={file => {
                  handleFile(file);
                  message.success('Файл загружен');
                  return false;
                }}
              >
                <Button>Загрузить CSV</Button>
              </Upload.Dragger>
            </Col>
            <Col span={12}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Input value={name} onChange={e => setName(e.target.value)} placeholder="Название участника" className={styles.marginTop8} />
                <Input value={description} onChange={e => setDescription(e.target.value)} placeholder="Описание" className={styles.marginTop8} />
                <Input value={image} onChange={e => setImage(e.target.value)} placeholder="URL картинки" className={styles.marginTop8} />
                <Button type="primary" onClick={handleAdd} className={styles.marginTop8}>Добавить участника</Button>
                {error && <Text type="danger">{error}</Text>}
              </Space>
            </Col>
          </Row>

          <Space.Compact direction="horizontal" block>
            <Button onClick={() => setItems(shuffle(items))}>Перемешать участников</Button>
            <Button icon={<DeleteOutlined />} onClick={() => setItems([])}>Очистить список</Button>
          </Space.Compact>

          <Collapse className={styles.fullWidth}>
            <Collapse.Panel header={`Список участников (${items.length})`} key="participants">
              <Table
                dataSource={items}
                rowKey="id"
                pagination={false}
                columns={[
                  { title: '#', key: 'name', render: (_: any, __: Item, index: number) => index + 1 },
                  { title: 'Название', dataIndex: 'name', key: 'name' },
                  { title: 'Описание', dataIndex: 'description', key: 'description' },
                  {
                    title: 'Картинка',
                    dataIndex: 'image',
                    key: 'image',
                    render: (img: string) => img ? <img src={img} alt="img" width={40} /> : '-'
                  },
                  {
                    title: '',
                    key: 'actions',
                    render: (_: any, record: Item) => (
                      <Button danger size="small" icon={<DeleteOutlined />} onClick={() => setItems(items.filter(i => i.id !== record.id))} />
                    )
                  }
                ]}
              />
              {items.length < 2 && <Text type="warning">Минимум 2 участника</Text>}
            </Collapse.Panel>
          </Collapse>
        </Space>
      </Card>

      <Modal
        open={isPreviewVisible}
        onCancel={() => setIsPreviewVisible(false)}
        footer={null}
        width={1000}
        title={`Предпросмотр турнира "${tournament?.title || '—'}"`}
      >
        {tournament && <BracketGrid tournament={tournament} />}
      </Modal>
    </div>
  );
};

export default TournamentSetupPage;
