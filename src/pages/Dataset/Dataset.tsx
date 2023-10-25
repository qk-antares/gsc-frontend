import React, {useEffect, useState} from "react";
import {useLocation, useNavigate} from "@@/exports";
import {Card, Col, Menu, Row} from "antd";
import ListDataset from "@/pages/Dataset/ListDataset/ListDataset";
import NewDataset from "@/pages/Dataset/NewDataset/NewDataset";
import {CalendarOutlined, MailOutlined} from "@ant-design/icons";
import styles from './styles.less'
import {Common} from "@/services/common/typings";

const items: Common.MenuItem[] = [
  {label: '我的数据集', key: 'list', icon: <MailOutlined />},
  {label: '新建数据集', key: 'new', icon: <CalendarOutlined />},
];

const Dataset: React.FC = ()=>{
  const navigate = useNavigate();
  const location = useLocation();
  const urlSearchParams = new URLSearchParams(location.search);
  const [active,setActive] = useState<string>(()=>{
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

  return <Row>
    <Col span={4}>
      <Card bordered={false} className={styles.menuCard} bodyStyle={{padding: 0}}>
        <Menu
          className={styles.menu}
          onClick={(menuInfo)=>{
            changeTab(menuInfo.key)
          }}
          selectedKeys={[active]}
          items={items}
        />
      </Card>
    </Col>

    <Col span={20} style={{paddingLeft: 12}}>
      <Card bordered={false} className={styles.contentCard} bodyStyle={{padding: 0}}>
        <div>
          {active === 'list' && <ListDataset/>}
          {active === 'new' && <NewDataset/>}
        </div>
      </Card>
    </Col>
  </Row>
}
export default Dataset
