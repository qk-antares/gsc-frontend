//记录详情组件
import React, {useEffect, useState} from "react";
import {Button, Card, Col, List, Row} from "antd";
import {useLocation, useNavigate} from "@@/exports";
import {getColorMapByLabels, getLegendData, renderGraph} from "@/utils/graphRender";
import {IconFont} from "@/utils/iconUtil";
import {history} from "@@/core/history";
import {getRetrievalById, getRetrievalDetail} from "@/services/Retrieval/api";
import GraphsLoadingSkeleton from "@/components/Graphs/GraphsLoadingSkeleton";
import DatasetInfoCard from "@/pages/Dataset/DatasetInfoCard/DatasetInfoCard";

type LogDetailProps = {
  targetRid: number;
}

const LogDetail: React.FC<LogDetailProps> = ({targetRid})=> {
  const navigate = useNavigate();
  const location = useLocation();
  const urlSearchParams = new URLSearchParams(location.search);

  //被检索数据集的colorMap
  const [colorMap, setColorMap] = useState<Map<string, any>>();

  //是否加载
  const [loading, setLoading] = useState(true);
  //本次检索的信息
  const [retrieval, setRetrieval] = useState<Retrieval.Retrieval>();
  const [current, setCurrent] = useState(()=> {
    return Number(urlSearchParams.get('current')) || 1;
  });
  const [total, setTotal] = useState(0);
  const [records, setRecords] = useState<Retrieval.Record[]>([])
  const [reRender, setReRender] = useState<boolean>(true);

  const [renderMap, setRenderMap] = useState<Map<string, any>>(new Map<string, any>());
  const [retrievalMap, setRetrievalMap] = useState<Map<string, any>>(new Map<string, any>());

  useEffect(() => {
    return ()=>{
      for (const rendered of renderMap.values()) {
        rendered.destroy();
      }
    }
  }, [renderMap]);

  useEffect(() => {
    return ()=>{
      for (const rendered of retrievalMap.values()) {
        rendered.destroy();
      }
    }
  }, [retrievalMap]);

  //获取这个检索的信息
  useEffect(() => {
    getRetrievalById(targetRid).then(res => {
      setRetrieval(res.data);

      const {labels} = res.data.dataset;
      const getColorMap = getColorMapByLabels(labels);
      setColorMap(getColorMap);

      const legend = renderGraph(retrievalMap, 'legend', getLegendData(labels), true, getColorMap, 'grid');
      const target = renderGraph(retrievalMap, 'target', res.data.graphData, false, undefined, 'radial', true);

      const newMap = new Map<string, any>();
      newMap.set('legend', legend);
      newMap.set('target', target);
      setRetrievalMap(newMap);
    })
  }, [targetRid]);

  useEffect(() => {
    //加载中
    setLoading(true);
    getRetrievalDetail({current, pageSize: 20, id: targetRid}).then(res => {
      setRecords(res.data.records);
      setTotal(res.data.total);
      //完成加载
      setLoading(false);
      setReRender(true);
    })
  }, [current, targetRid]);

  //当页面首次渲染，渲染所有的图
  useEffect(()=>{
    if(reRender && records.length > 0){
      const newMap = new Map<string, any>();
      for(let i = 0; i < records.length; i++){
        const graph = renderGraph(renderMap, `g${i}`, JSON.parse(JSON.stringify(records[i].graph.graphData)), true, colorMap);
        newMap.set(`g${i}`, graph);
      }
      setRenderMap(newMap);
      setReRender(false)
    }
  }, [reRender, records]);

  //返回表格页
  const backToTable = ()=>{
    history.push(`/retrieval?tab=log`);
  }

  const goPathsResult = (gid: number) => {
    navigate({
      search: `?${
        new URLSearchParams({
          tab:'log',
          rid: targetRid.toString(),
          gid: gid.toString(),
          current: current.toString()}
        ).toString()
      }`
    })
  }

  return <div style={{height: 'calc(100vh - 88px)', overflow: 'auto'}}>
    <div style={{margin: 20}}>
      <Row style={{marginBottom: 16}}>
        <Col span={6}>
          <Button onClick={backToTable} icon={<IconFont type="icon-fanhui"/>}>返回</Button>
        </Col>
      </Row>

      <Row>
        <Col span={14}>
          <DatasetInfoCard dataset={retrieval?.dataset}/>
        </Col>
        <Col span={10}>
          <Card style={{height: 'calc(100% - 24px)', margin: '12px 0 12px 12px'}} bodyStyle={{padding: "16px 16px 12px 16px"}}>
            <Row>
              <Col span={12}>
                <h3 style={{fontSize: 15, fontWeight: 700, padding: 0, marginBottom: 4}}>被检索图</h3>

                <Row style={{padding: '6px 0 8px 0'}}>
                  <Col span={12} style={{display: 'flex'}}>
                    <div style={{fontSize: 13, color: 'rgba(0,0,0,.4)', marginRight: 16}}>
                      节点数
                    </div>
                    <div style={{fontSize: 13, color: 'rgba(0,0,0,.9)'}}>
                      {retrieval?.graphData?.nodes.length}
                    </div>
                  </Col>

                  <Col span={12}  style={{display: 'flex'}}>
                    <div style={{fontSize: 13, color: 'rgba(0,0,0,.4)', marginRight: 16}}>
                      边数
                    </div>
                    <div style={{fontSize: 13, color: 'rgba(0,0,0,.9)'}}>
                      {retrieval?.graphData?.edges.length}
                    </div>
                  </Col>
                </Row>

                <div style={{padding: '8px 0', display: 'flex'}}>
                  <div style={{fontSize: 13, color: 'rgba(0,0,0,.4)', marginRight: 16}}>
                    使用算法
                  </div>
                  <div style={{fontSize: 13, color: 'rgba(0,0,0,.9)'}}>
                    {retrieval?.algorithm}
                  </div>
                </div>

                <div style={{padding: '8px 0 6px 0', display: 'flex'}}>
                  <div style={{fontSize: 13, color: 'rgba(0,0,0,.4)', marginRight: 16}}>
                    检索耗时
                  </div>
                  <div style={{fontSize: 13, color: 'rgba(0,0,0,.9)'}}>
                    {`${retrieval?.timeCost} ms`}
                  </div>
                </div>
              </Col>

              <Col span={12}>
                <div id='target' style={{width: '100%', height: '100%'}}></div>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      {
        loading ? <GraphsLoadingSkeleton column={4} row={3}/> :
          <List
            grid={{ gutter: 16, column: 4 }}
            dataSource={records}
            pagination={{
              current: Number(urlSearchParams.get('current')) || 1,
              onChange: (current) => {
                window.scrollTo({
                  top: 0,
                  behavior: 'smooth'
                })
                setCurrent(current);
                navigate({
                  search: `?${new URLSearchParams({tab:'log', rid: targetRid.toString(), current: current.toString()}).toString()}`
                })
              },
              showSizeChanger: false,
              showQuickJumper: true,
              pageSize: 20,
              total
            }}

            renderItem={(record, index) => (
              <List.Item>
                <Card style={{boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'}} bodyStyle={{padding: 0, backgroundColor: "rgb(245,245,245)", borderRadius: '8px'}}>
                  <div style={{width: '100%', paddingTop: '100%'}}>
                    <div id={`g${index}`} style={{position: 'absolute', top: 0, left: 0, width: '100%', height: 'calc(100% - 83px)'}}>
                    </div>

                    <Row style={{margin: '0 12px 12px'}}>
                      <Col span={12}>
                        <div>{record.graph.name}</div>
                      </Col>
                      <Col span={12}>
                        <Row>
                          <Col style={{color: 'rgba(0,0,0,.4)', marginRight: 16}}>
                            预测GED
                          </Col>
                          <Col style={{fontWeight: 500}}>
                            {record.preGed.toFixed(2)}
                          </Col>
                        </Row>
                      </Col>
                    </Row>

                    <div style={{borderRadius: '0 0 8px 8px', padding: '8px', background: 'white'}}>
                      <Button style={{position: 'relative', right: 0}} type='primary' onClick={()=>goPathsResult(record.graph.gid)}>查看编辑路径</Button>
                    </div>
                  </div>
                </Card>
              </List.Item>
            )}
          />
      }
    </div>
  </div>
}

export default LogDetail;

