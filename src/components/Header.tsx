import type React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import styles from './Header.module.css';
const { Header: AntHeader } = Layout;

const Header: React.FC = () => {
  const location = useLocation();
  return (
    <AntHeader className={styles.header}>
      <Menu
        mode="horizontal"
        selectedKeys={[location.pathname]}
        className={styles.menu}
      >
        <Menu.Item key="/">
          <Link to="/">Турниры</Link>
        </Menu.Item>
        <Menu.Item key="/setup">
          <Link to="/setup">Создать</Link>
        </Menu.Item>
      </Menu>
    </AntHeader>
  );
};

export default Header;
