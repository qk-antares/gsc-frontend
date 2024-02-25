import {FileAddOutlined} from '@ant-design/icons';
import {Alert, Button, Col, message, Row, UploadProps} from 'antd';
import React, {useEffect, useState} from 'react';
import Dragger from "antd/es/upload/Dragger";
import {RcFile} from "antd/es/upload";
import {renderGraph} from "@/utils/graphRender";

type UploaderProps = {
  graphData: Graph.GraphData | undefined;
  setGraphData: React.Dispatch<React.SetStateAction<Graph.GraphData | undefined>>;
}

const Uploader: React.FC<UploaderProps> = ({graphData, setGraphData}) => {
  const [renderMap, setRenderMap] = useState<Map<string, any>>(new Map<string, any>);

  useEffect(() => {
    return ()=>{
      for (const rendered of renderMap.values()) {
        rendered.destroy();
      }
    }
  }, [renderMap]);

  const uploadProps: UploadProps = {
    accept: '.json',
    multiple: false,
    maxCount: 1,
    name: 'file',
    beforeUpload: (file: RcFile) => {
      try {
        const fileReader = new FileReader();
        fileReader.onload = (e) => {
          const result = e.target?.result;
          if(typeof result === 'string'){
            const json = JSON.parse(result);
            console.log('文件内容:', json);
            setGraphData(json);
          }
        };
        fileReader.readAsText(file);
      } catch (error) {
        message.error('文件读取失败');
      }
      return false;
    },
    onRemove: ()=>{
      setGraphData(undefined);
    }
  }

  useEffect(() => {
    if(graphData){
      const graph = renderGraph(renderMap, 'graph', JSON.parse(JSON.stringify(graphData)));
      const newMap = new Map<string, any>(renderMap);
      newMap.set('graph', graph);
      setRenderMap(newMap);
    }
  }, [graphData]);


  return (
    <Row>
      <Col span={15}>
        <Alert
          style={{marginBottom: 10}}
          message="数据集规范：数据集由若干个图构成，位于同一文件夹下，每个图是一个 JSON 文件，nodes 表示点的集合，edges 表示边的集合"
          type="info" showIcon closable
          action={<Button style={{marginLeft: 8}} size="small" type="primary" onClick={()=>{}}>下载示例数据</Button>}
        />

        <Dragger style={{height: 314}} {...uploadProps}>
          <p className="ant-upload-drag-icon">
            <FileAddOutlined />
          </p>
          <p className="ant-upload-hint">
            点击或将数据文件拖拽到这里上传，支持JSON格式
          </p>
        </Dragger>
      </Col>
      <Col span={9}>
        <div style={{height: '100%', marginLeft: 24, display: 'flex', flexDirection: 'row'}}>
          <div id='graph' style={{backgroundColor: 'rgba(0, 0, 0, 0.02)', borderRadius:8, border: '1px solid #d9d9d9',  top: 0, left: 0, width: '100%', height: '100%'}}></div>
        </div>
      </Col>
    </Row>
  );
};

export default Uploader;
