//数据集管理页面
import React, {useEffect, useState} from "react";
import {useLocation, useNavigate} from "@@/exports";
import {Card, Col, Menu, Row} from "antd";
import ListDataset from "@/pages/Dataset/ListDataset/ListDataset";
import {DatabaseOutlined, EditOutlined} from "@ant-design/icons";
import styles from './styles.less'
import GraphEditor from "@/pages/Dataset/GraphEditor/GraphEditor";

const navBodyStyle: React.CSSProperties = {
  padding: 0,
  display: 'flex',
  flexDirection: 'column',
  height: 'calc(100vh - 96px)',
  overflow: 'auto'
};

const contentBodyStyle: React.CSSProperties = {
  padding: 0,
};

const items: Common.MenuItem[] = [
  {label: '我的数据集', key: 'list', icon: <DatabaseOutlined/>},
  {label: '图编辑器', key: 'editor', icon: <EditOutlined/>},
];

const Dataset: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const urlSearchParams = new URLSearchParams(location.search);
  const [active, setActive] = useState<string>(() => {
    return urlSearchParams.get('tab') || 'list'
  });

  //监听路径参数变化
  useEffect(() => {
    setActive(urlSearchParams.get('tab') || 'list');
  }, [location.search]);

  //切换tab时将query参数添加到路径上
  const changeTab = (newTab: string) => {
    //将搜索参数拼接到query上
    const params = new URLSearchParams({
      tab: newTab,
    });
    navigate({
      search: `?${params.toString()}`,
    });
  }

  return <Row className={styles.row}>
    <Col span={4}>
      <Card bordered={false} className={styles.menuCard} bodyStyle={navBodyStyle}>
        <Menu
          className={styles.menu}
          onClick={(menuInfo) => {
            changeTab(menuInfo.key)
          }}
          selectedKeys={[active]}
          items={items}
        />
      </Card>
    </Col>

    <Col span={20} style={{paddingLeft: 12}}>
      <Card bordered={false} className={styles.contentCard} bodyStyle={contentBodyStyle}>
        {
          active === 'list' && <ListDataset/> ||
          active === 'editor' && <GraphEditor/>
        }
      </Card>
    </Col>
  </Row>
}
export default Dataset
