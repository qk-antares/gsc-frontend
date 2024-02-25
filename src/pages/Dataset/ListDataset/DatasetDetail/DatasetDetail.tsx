import React, {useEffect, useState} from "react";
import {Button, Card, Col, List, message, Popconfirm, Row} from "antd";
import {useLocation, useNavigate} from "@@/exports";
import {deleteGraphFromDataset, listGraphVoByPage, updateGraphName} from "@/services/Graph/api";
import {IconFont} from "@/utils/iconUtil";
import UploadModal from "@/pages/Dataset/ListDataset/DatasetDetail/UploadModal/UploadModal";
import {DeleteOutlined, DownloadOutlined, SettingOutlined} from "@ant-design/icons";
import moment from "moment";
import {history} from "@@/core/history";
import GraphsLoadingSkeleton from "@/components/Graphs/GraphsLoadingSkeleton";
import {downloadGraphData} from "@/utils/downloadUtil";
import {getDatasetById} from "@/services/Dataset/api";
import {getColorMapByLabels, getLegendData, renderGraph} from "@/utils/graphRender";
import UpdateModal from "@/pages/Dataset/ListDataset/DatasetDetail/UpdateModal/UpdateModal";
import DatasetInfoCard from "@/pages/Dataset/DatasetInfoCard/DatasetInfoCard";

type DatasetDetailProps = {
  targetDid: number;
}

const DatasetDetail: React.FC<DatasetDetailProps> = ({targetDid})=>{
  const navigate = useNavigate();
  const location = useLocation();
  const urlSearchParams = new URLSearchParams(location.search);

  const [targetDataset, setTargetDataset] = useState<Dataset.Dataset>();
  const [colorMap, setColorMap] = useState<Map<string, any> | undefined>();

  const [current, setCurrent] = useState(()=> {
    return Number(urlSearchParams.get('current')) || 1;
  });

  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [graphs, setGraphs] = useState<Graph.Graph[]>([])
  const [reRender, setReRender] = useState<boolean>(true);

  const [uploadModalOpen, setUploadModalOpen] = useState<boolean>(false);
  const [activeGraph, setActiveGraph] = useState<Graph.Graph | undefined>(undefined);

  const [messageApi, contextHolder] = message.useMessage();

  const [renderMap, setRenderMap] = useState<Map<string, any>>(new Map<string, any>());
  const [legendMap, setLegendMap] = useState<Map<string, any>>(new Map<string, any>());

  useEffect(() => {
    return ()=>{
      for (const rendered of renderMap.values()) {
        rendered.destroy();
      }
    }
  }, [renderMap]);

  useEffect(() => {
    return ()=>{
      for (const rendered of legendMap.values()) {
        rendered.destroy();
      }
    }
  }, [legendMap]);

  const reloadData = ()=> {
    //加载中
    setLoading(true);

    //加载数据集本身信息
    getDatasetById(targetDid).then(res => {
      setTargetDataset(res.data);
      const {labels} = res.data;
      const getColorMap = getColorMapByLabels(labels);
      setColorMap(getColorMap);

      const legend = renderGraph(legendMap, 'legend', getLegendData(labels), true, getColorMap, 'grid');

      const newMap = new Map<string, any>();
      newMap.set('legend', legend);
      setLegendMap(newMap);
    })

    //加载分页数据
    listGraphVoByPage({current, pageSize: 20, did: targetDid}).then(res => {
      setGraphs(res.data.records);
      setTotal(res.data.total);
      //完成加载
      setLoading(false);
      setReRender(true);
    })
  }

  useEffect(() => {
    reloadData()
  }, [current, targetDid]);

  //当页面首次渲染，渲染所有的图
  useEffect(()=>{
    if(reRender && graphs.length > 0){
      const newMap = new Map<string, any>();
      for(let i = 0; i < graphs.length; i++){
        const graph = renderGraph(renderMap, `g${i}`, JSON.parse(JSON.stringify(graphs[i].graphData)), true, colorMap);
        newMap.set(`g${i}`, graph);
      }
      setRenderMap(newMap);
      setReRender(false);
    }
  }, [reRender, graphs]);

  //返回表格页
  const backToTable = ()=>{
    history.push(`/dataset`);
  }

  //将某个图从数据集中删除
  const removeGraph = (gid: number, did: number) => {
    setGraphs(graphs.filter(graph => graph.gid !== gid))
    setReRender(true);
    deleteGraphFromDataset({gids: [gid], did}).then(res => {
      if(res.code === 200){
        message.success('删除成功！');
      }
    })
  }

  //对某个图进行重命名
  const renameGraph = (gid: number, newName: string)=>{
    updateGraphName({gid, name: newName}).then(res => {
      if(res.code === 200){
        setGraphs(graphs.map(graph => {
          if(graph.gid !== gid) {
            return graph;
          } else {
            return {...graph, name: newName};
          }
        }))

        message.success('修改成功！');
        setActiveGraph(undefined);
      }
    })
  }

  //下载某个图的数据
  const downloadGraph = (graph: Graph.Graph)=>{
    messageApi.open({
      type: 'loading',
      content: '正在创建下载链接',
      duration: 0.5
    });
    downloadGraphData(graph.graphData, graph.name);
  }

  return <div style={{height: 'calc(100vh - 88px)', paddingRight: 20, overflow: 'auto'}}>
    <div style={{margin: '20px 0 20px 20px'}}>
      {contextHolder}

      <Row>
        <Col span={6}>
          <Button onClick={backToTable} icon={<IconFont type="icon-fanhui"/>}>返回</Button>
        </Col>
        <Col span={18}>
          <div style={{float: 'right'}}>
            <Button type='primary' onClick={()=>setUploadModalOpen(true)} icon={<IconFont type="icon-shangchuandaochu"/>}>上传</Button>
          </div>
        </Col>
      </Row>

      <DatasetInfoCard dataset={targetDataset}/>

      {
        loading ? <GraphsLoadingSkeleton column={4} row={3}/> :
          <List
            grid={{ gutter: 16, column: 4 }}
            dataSource={graphs}
            pagination={{
              current: Number(urlSearchParams.get('current')) || 1,
              onChange: (current) => {
                window.scrollTo({
                  top: 0,
                  behavior: 'smooth'
                })
                setCurrent(current);
                navigate({
                  search: `?${new URLSearchParams({did: targetDid.toString(), current: current.toString()}).toString()}`
                })
              },
              showSizeChanger: false,
              showQuickJumper: true,
              pageSize: 20,
              total
            }}

            renderItem={(graph, index) => (
              <List.Item>
                <Card
                  style={{boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'}}
                  bodyStyle={{padding: 0, backgroundColor: "rgb(245,245,245)", borderRadius: '8px 8px 0 0'}}
                  actions={[
                    <SettingOutlined onClick={()=>{setActiveGraph(graph)}} key="setting" />,

                    <DownloadOutlined onClick={()=>downloadGraph(graph)} key='download'/>,

                    <Popconfirm
                      placement='topRight' arrow={{ pointAtCenter: true }} key='delete'
                      title="删除图" description="确定要删除该图？此操作不可撤销" okText="是" cancelText="否"
                      onConfirm={()=>removeGraph(graph.gid, graph.did)}
                    >
                      <DeleteOutlined />
                    </Popconfirm>
                  ]}
                >
                  <div style={{width: '100%', paddingTop: '100%'}}>
                    <div id={`g${index}`} style={{position: 'absolute', top: 0, left: 0, width: '100%', height: 'calc(100% - 83px)'}}>
                    </div>
                    <div style={{margin: '0 12px 12px 12px'}}>
                      <span>{graph.name}</span>
                      <span style={{fontSize: 13, float: 'right', color: 'rgba(0, 0, 0, 0.45)'}}>{moment(graph.createTime).format('YYYY-MM-DD HH:mm:ss')}</span>
                    </div>
                  </div>
                </Card>
              </List.Item>
            )}
          />
      }

      <UploadModal afterUpload={reloadData} did={targetDid} modalOpen={uploadModalOpen} onCancel={()=>setUploadModalOpen(false)}/>
      <UpdateModal activeGraph={activeGraph} onOK={renameGraph} onCancel={()=>setActiveGraph(undefined)}/>
    </div>
  </div>
}

export default DatasetDetail;
