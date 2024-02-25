//图数据检索页面
import React, {useEffect, useState} from "react";
import {Card, Col, Menu, Row} from "antd";
import styles from "@/pages/Dataset/styles.less";
import {useLocation, useNavigate} from "@@/exports";
import {ClockCircleOutlined, SearchOutlined} from "@ant-design/icons";
import Submitter from "@/pages/Retrieval/Submitter/Submitter";
import Log from "@/pages/Retrieval/Log/Log";

const items: Common.MenuItem[] = [
  {label: '相似图检索', key: 'submitter', icon: <SearchOutlined />},
  {label: '历史记录', key: 'log', icon: <ClockCircleOutlined />},
];

const Retrieval: React.FC = ()=>{
  const navigate = useNavigate();
  const location = useLocation();
  const urlSearchParams = new URLSearchParams(location.search);
  const [active,setActive] = useState<string>(()=>{
    return urlSearchParams.get('tab') || 'submitter'
  });

  //监听路径参数变化
  useEffect(() => {
    setActive(urlSearchParams.get('tab') || 'submitter');
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
          {active === 'submitter' && <Submitter/>}
          {active === 'log' && <Log/>}
        </div>
      </Card>
    </Col>
  </Row>
}

export default Retrieval;
