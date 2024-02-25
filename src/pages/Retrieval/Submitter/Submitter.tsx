//检索任务提交组件
import {Button, Form, message, Select, Tabs} from "antd";
import React, {useEffect, useState} from "react";
import Uploader from "@/pages/Retrieval/Submitter/Uploader/Uploader";
import {listAllDataset} from "@/services/Dataset/api";
import {retrievalGraphInDataset} from "@/services/Retrieval/api";
import {history} from '@umijs/max';

const Submitter: React.FC = ()=>{
  const [graphData, setGraphData] = useState<Graph.GraphData>();
  const [datasets, setDatasets] = useState<Dataset.Dataset[]>([]);
  const [targetDataset, setTargetDataset] = useState<number>(-1)
  const [targetAlgorithm, setTargetAlgorithm] = useState<string>('GedGNN');

  useEffect(() => {
    listAllDataset().then(res => {
      setDatasets(res.data);
      if(res.data.length > 0){
        setTargetDataset(res.data[0].did);
      }
    })
  }, []);

  const onRetrieve = ()=>{
    if(graphData){
      console.log(graphData)
      retrievalGraphInDataset({
        graphData,
        did: targetDataset,
        algorithm: targetAlgorithm
      }).then(res => {
        if(res.code === 200){
          message.success('检索任务已提交！')
          history.push('/retrieval?tab=log');
        }
      })
    }
  }

  return <div style={{padding: 32, height: 'calc(100vh - 80px)', overflow: 'auto'}}>
    <Form labelCol={{ span: 2 }} wrapperCol={{ span: 22 }}>
      <Form.Item label='上传数据'>
        <Tabs
          tabPosition="left"
          items={[
            {
              label: 'GraphJSON',
              key: 'GraphJSON',
              children: <Uploader graphData={graphData} setGraphData={setGraphData}/>,
            },
          ]}
        />
      </Form.Item>

      <Form.Item label='选择算法'>
        <Select
          value={targetAlgorithm}
          onChange={(algorithm)=>setTargetAlgorithm(algorithm)}
          style={{ width: 240, paddingLeft: 24 }}
          options={[
            { value: 'GedGNN', label: 'GedGNN' },
            { value: 'SimGNN', label: 'SimGNN' },
            { value: 'TaGSim', label: 'TaGSim' },
          ]}
        />
      </Form.Item>

      <Form.Item label='选择数据集'>
        <Select
          value={targetDataset}
          onChange={(did)=>setTargetDataset(did)}
          style={{ width: 240, paddingLeft: 24 }}
          options={datasets ? datasets.map(dataset =>
            ({ value: dataset.did, label: dataset.name })) : []}
        />
      </Form.Item>
    </Form>



    <div style={{ marginTop: 24, display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
      <Button disabled={!graphData && targetDataset !== -1} shape="round" type="primary" onClick={onRetrieve}>
        执行检索
      </Button>
    </div>
  </div>
}
export default Submitter;
