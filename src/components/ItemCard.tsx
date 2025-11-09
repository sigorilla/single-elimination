import type { Item } from '../types/tournament';
import { Card } from 'antd';
import styles from './ItemCard.module.css';

type ItemCardProps = {
  item: Item;
  selected?: boolean;
  disabled?: boolean;
  onClick?: () => void;
};

const ItemCard: React.FC<ItemCardProps> = ({
  item,
  selected,
  disabled,
  onClick,
}) => (
  <Card
    hoverable={!disabled}
    className={selected ? styles.selected : undefined}
    onClick={disabled ? undefined : onClick}
    style={{ cursor: disabled ? 'default' : 'pointer', width: '100%' }}
    cover={
      item.image ? (
        <div
          className={styles.img}
          style={{ backgroundImage: `url(${item.image})` }}
        />
      ) : null
    }
  >
    <div className={styles.name}>{item.name}</div>
    {item.description && <div className={styles.desc}>{item.description}</div>}
  </Card>
);

export default ItemCard;
