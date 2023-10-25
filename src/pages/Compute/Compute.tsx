import {Card, Col, Row} from "antd";
import React, {useState} from "react";
import Uploader from "@/pages/Compute/Uploader/Uploader";
import Result from "@/pages/Compute/Result/Result";
import {Graph} from "@/services/common/typings";

const Compute: React.FC = ()=>{
  const [ged, setGed] = useState<Ged.Ged>();
  const [graph1, setGraph1] = useState<Graph.GraphData>()
  const [graph2, setGraph2] = useState<Graph.GraphData>()

  return (<Row>
    <Col span={8} style={{paddingRight: 4}}>
      <Card title="文件上传" bodyStyle={{display: 'flex', flexDirection: 'column', height: 'calc(100vh - 125px)', overflow: 'auto'}} style={{height: 'calc(100vh - 73px)', borderRadius: 4}}>
        <Uploader setGed={setGed} graph1={graph1} graph2={graph2} setGraph1={setGraph1} setGraph2={setGraph2}/>
      </Card>
    </Col>

    <Col span={16} style={{paddingLeft: 4}}>
      <Card title='图编辑距离计算' bodyStyle={{display: 'flex', flexDirection: 'column', height: 'calc(100vh - 125px)', overflow: 'auto'}} style={{height: 'calc(100vh - 73px)', borderRadius: 4}}>
        <Result ged={ged} graph1={graph1} graph2={graph2}/>
      </Card>
    </Col>
  </Row>);
}

export default Compute;
