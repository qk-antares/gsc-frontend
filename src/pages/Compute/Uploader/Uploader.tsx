import {FileAddOutlined} from '@ant-design/icons';
import {Alert, Button, message} from 'antd';
import React from 'react';
import Dragger from "antd/es/upload/Dragger";
import {downloadCaseData} from "@/utils/exampleData";
import {RcFile} from "antd/es/upload";
import {gedCompute} from "@/services/ged/api";
import {Graph} from "@/services/common/typings";

type UploaderProps = {
  setGed:  React.Dispatch<React.SetStateAction<Ged.Ged | undefined>>;
  setGraph1: React.Dispatch<React.SetStateAction<Graph.GraphData | undefined>>;
  setGraph2: React.Dispatch<React.SetStateAction<Graph.GraphData | undefined>>;
  graph1: Graph.GraphData | undefined;
  graph2: Graph.GraphData | undefined;
}

const Uploader: React.FC<UploaderProps> = ({setGed, setGraph1, setGraph2, graph1, graph2}) => {
  const [messageApi, contextHolder] = message.useMessage();

  const getUploadProps = (prefix: string,
                          setGraph: React.Dispatch<React.SetStateAction<Graph.GraphData | undefined>>) => {
    return {
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

              //对graph1和graph2的节点id进行前缀标注，防止发生编辑路径歧义
              try {
                const markedGraph: Graph.GraphData = {nodes: [], edges: []}
                markedGraph.nodes = json.nodes.map((node: Graph.Node) =>
                  ({id: `${prefix}-${node.id}`, label: node.label}))
                markedGraph.edges = json.edges.map((edge: Graph.Edge) =>
                  ({source: `${prefix}-${edge.source}`, target: `${prefix}-${edge.target}`}))
                setGraph(markedGraph);

                setGed(undefined);
              } catch (e){
                message.error('文件读取失败，请确保文件的格式符合要求')
              }
            }
          };
          fileReader.readAsText(file);
        } catch (error) {
          message.error('文件读取失败');
        }
        return false;
      },
      onRemove: ()=>{
        setGraph(undefined);
      }
    }
  }

  //todo: 执行图模体的分析，后续这里请求后端或在前端写逻辑
  const analysis = async () => {
    messageApi.open({
      type: 'loading',
      content: '执行计算中',
      duration: -1,
    });
    if(graph1 && graph2){
      gedCompute({graph1, graph2}).then(res => {
        console.log(res.data);
        setGed(res.data);
        messageApi.destroy();
      })
    }
  }

  return (
    <>
      {contextHolder}
      <Alert
        description={<>
          <div>
            JSON 文件规范：点边数据必须放在同一个 JSON 文件中上传，nodes 表示点的集合，edges 表示边的集合
          </div>
          <Button
            onClick={()=>{
              downloadCaseData('GA.json');
              downloadCaseData('GB.json');
            }}
            style={{marginTop:4, float: 'right'}} size="small" type="primary" >
            下载示例数据
          </Button>
        </>}
        type="info"
        showIcon
        closable
      />

      <h4 style={{ marginTop: 10 }}>上传原始图</h4>
      <Dragger style={{height: 314}} {...getUploadProps('1', setGraph1)}>
        <p className="ant-upload-drag-icon">
          <FileAddOutlined />
        </p>
        <p className="ant-upload-hint">
          点击或将数据文件拖拽到这里上传，支持JSON格式
        </p>
      </Dragger>

      <h4 style={{ marginTop: 40 }}>上传目标图</h4>
      <Dragger style={{height: 314}} {...getUploadProps('2', setGraph2)}>
        <p className="ant-upload-drag-icon">
          <FileAddOutlined />
        </p>
        <p className="ant-upload-hint">
          点击或将数据文件拖拽到这里上传，支持JSON格式
        </p>
      </Dragger>

      <div style={{ padding: '30px 0px 10px', display: 'flex', justifyContent: 'center' }}>
        <Button onClick={analysis} type="primary" shape="round" disabled={!graph1 || !graph2}>
          执行分析
        </Button>
      </div>
    </>
  );
};

export default Uploader;
