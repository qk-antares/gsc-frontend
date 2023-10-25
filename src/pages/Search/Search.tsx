import React, {useEffect, useState} from "react";
import {Card, Col, Menu, Row} from "antd";
import styles from "@/pages/Dataset/styles.less";
import ListDataset from "@/pages/Dataset/ListDataset/ListDataset";
import NewDataset from "@/pages/Dataset/NewDataset/NewDataset";
import {useLocation, useNavigate} from "@@/exports";
import {CalendarOutlined, MailOutlined} from "@ant-design/icons";
import {Common} from "@/services/common/typings";

const items: Common.MenuItem[] = [
  {label: '相似图检索', key: 'search', icon: <MailOutlined />},
  {label: '历史记录', key: 'log', icon: <CalendarOutlined />},
];

const Search: React.FC = ()=>{
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

export default Search;
