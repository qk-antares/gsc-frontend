//数据集信息卡片组件
import React from "react";
import {Card, Col, Row, Space, Tag} from "antd";

type DatasetInfoCardProps = {
  dataset?: Dataset.Dataset
}

const DatasetInfoCard: React.FC<DatasetInfoCardProps> = ({dataset})=> {
  return <Card style={{margin: '12px 0'}} bodyStyle={{padding: "16px 16px 12px 16px"}}>
    <h3 style={{fontSize: 15, fontWeight: 700, padding: 0, marginBottom: 4}}>数据集信息</h3>

    <Row style={{padding: '6px 0 8px 0'}}>
      <Col span={6}>
        <div style={{display: 'flex'}}>
          <div style={{fontSize: 13, color: 'rgba(0,0,0,.4)', marginRight: 16}}>
            数据集名称
          </div>
          <div style={{fontSize: 13, color: 'rgba(0,0,0,.9)'}} >
            {dataset?.name}
          </div>
        </div>
      </Col>
      <Col span={6}>
        <div style={{display: 'flex'}}>
          <div style={{fontSize: 13, color: 'rgba(0,0,0,.4)', marginRight: 16}}>
            图数量
          </div>
          <div style={{fontSize: 13, color: 'rgba(0,0,0,.9)'}}>
            {dataset?.count}
          </div>
        </div>
      </Col>
      <Col span={6}>
        <div style={{display: 'flex'}}>
          <div style={{fontSize: 13, color: 'rgba(0,0,0,.4)', marginRight: 16}}>
            最大边数
          </div>
          <div style={{fontSize: 13, color: 'rgba(0,0,0,.9)'}} >
            {dataset?.maxEdgeNum}
          </div>
        </div>
      </Col>
      <Col span={6}>
        <div style={{display: 'flex'}}>
          <div style={{fontSize: 13, color: 'rgba(0,0,0,.4)', marginRight: 16}}>
            最大节点数
          </div>
          <div style={{fontSize: 13, color: 'rgba(0,0,0,.9)'}}>
            {dataset?.maxNodeNum}
          </div>
        </div>
      </Col>
    </Row>

    <div style={{display: 'flex', padding: '8px 0 6px 0'}}>
      <div style={{fontSize: 13, color: 'rgba(0,0,0,.4)', marginRight: 16}}>
        标签
      </div>
      <div style={{fontSize: 13, color: 'rgba(0,0,0,.9)'}}>
        <Space>
          {dataset?.tags.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </Space>
      </div>
    </div>

    <Row>
      <Col style={{marginTop: 10, fontSize: 13, color: 'rgba(0,0,0,.4)', marginRight: 16}}>
        节点类型
      </Col>
      <Col style={{fontSize: 13, color: 'rgba(0,0,0,.9)'}} flex='auto'>
        <div id='legend' style={{width: '99%', height: 40}}></div>
      </Col>
    </Row>
  </Card>

}

export default DatasetInfoCard