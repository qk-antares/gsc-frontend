import React, {useEffect, useState} from "react";
import {Button, Card, Col, InputNumber, Row, Select, Skeleton} from "antd";
import {getPaths} from "@/services/EditPath/api";
import {getMarkedGraphData, renderGraph, toPlainData} from "@/utils/graphRender";
import {getGraphPair} from "@/services/Retrieval/api";
import {IconFont} from "@/utils/iconUtil";
import {history} from "@@/core/history";
import GraphsLoadingSkeleton from "@/components/Graphs/GraphsLoadingSkeleton";

type PathsResultProps = {
  rid: number;
  gid: number;
}

const PathsResult: React.FC<PathsResultProps> = ({rid, gid})=> {
  //graph1和graph2存储原始数据
  //GA和GB存储转化后的数据
  const [GA, setGA] = useState<Graph.GraphData>();
  const [GB, setGB] = useState<Graph.GraphData>();

  //计算编辑路径使用的算法
  const [targetAlgorithm, setTargetAlgorithm] = useState<string>('GedGNN');
  const [loading, setLoading] = useState<boolean>();
  const [paths, setPaths] = useState<EditPath.Paths>()

  //各种编辑操作类型的数量
  const [edits, setEdits] = useState<number[]>([0,0,0,0]);

  const [k, setK] = useState<number>(100);

  const [renderMap, setRenderMap] = useState<Map<string, any>>(new Map<string, any>());
  const [pairMap, setPairMap] = useState<Map<string, any>>(new Map<string, any>());


  useEffect(() => {
    return ()=>{
      for (const rendered of renderMap.values()) {
        rendered.destroy();
      }
    }
  }, [renderMap]);

  useEffect(() => {
    return ()=>{
      for (const rendered of pairMap.values()) {
        rendered.destroy();
      }
    }
  }, [pairMap]);

  //数据格式转换
  useEffect(() => {
    getGraphPair({gid, rid}).then(res => {
      const {graph1, graph2} = res.data;
      if(graph1.nodes.length <= graph2.nodes.length){
        setGA(getMarkedGraphData('1', graph1));
        setGB(getMarkedGraphData('2', graph2));
      } else {
        setGA(getMarkedGraphData('1', graph2));
        setGB(getMarkedGraphData('2', graph1));
      }
    })

    return ()=> {
      setGA(undefined);
      setGB(undefined);
    }
  }, [rid, gid]);

  //发送请求获取编辑路径数据
  useEffect(() => {
    if(GA && GB){
      setLoading(true);
      getPaths({
        algorithm: targetAlgorithm,
        graphPair: {
          graph1: GA,
          graph2: GB
        },
        k
      }).then(res => {
        setPaths(res.data)
        setLoading(false);
      })
    }

    return ()=>{
      setPaths(undefined);
    }
  }, [GA, GB]);

  useEffect(() => {
    const editPath = paths?.editPath;
    if(editPath && GA && GB){
      console.log('渲染')

      //渲染原始图和目标图
      const renderA = renderGraph(pairMap, 'GA', JSON.parse(JSON.stringify(GA)));
      const renderB = renderGraph(pairMap, 'GB', JSON.parse(JSON.stringify(GB)));
      const newPairMap = new Map<string, any>();
      newPairMap.set("GA", renderA);
      newPairMap.set("GB", renderB);
      setPairMap(newPairMap);

      //统计各种编辑操作的次数
      const editCount = [0,0,0,0];

      //对编辑路径进行可视化
      //1. 首先构建一些辅助变量
      //构建graph1 graph2节点map，方便后续操作
      const GAMap = new Map<string, string>()
      GA.nodes.forEach((node) => {
        GAMap.set(node.id, node.label);
      });

      const GBMap = new Map<string, string>()
      GB.nodes.forEach((node) => {
        GBMap.set(node.id, node.label);
      });

      //存储由于节点替换产生的节点Id映射
      const nodeMap = new Map<string, string>()

      //2. curData存储当前应当渲染到画布上的数据，index是当前编辑的步数
      let curData = toPlainData(GA);
      let index = 0;

      //3. 用于存储渲染后的图，在组件销毁是对图也进行销毁，render用于记录当前步骤渲染的图
      const newPathMap = new Map<string, any>();

      //2. 首先对节点进行编辑
      editPath.nodes.forEach(edit => {
        //这次操作是添加节点
        if(!edit[0]){
          const addId = edit[1]
          // @ts-ignore
          const addLabel = GBMap.get(edit[1])
          // @ts-ignore
          curData.nodes.push({id: addId, label: addLabel, style: {fill: 'rgb(253, 237, 237)', stroke: '#e72a2a'}})
          // @ts-ignore
          GAMap.set(addId, addLabel)
          const render = renderGraph(renderMap, `edit${index}`, toPlainData(curData))
          newPathMap.set(`edit${index}`, render);
          index++;

          editCount[0]++;
        }
        //这次操作是删除节点
        else if(!edit[1]){
          const nodeToModify = curData.nodes.find((node: any) => node.id === edit[0]);
          // @ts-ignore
          nodeToModify.style = {opacity: 0};
          // @ts-ignore
          nodeToModify.labelCfg = { style: { opacity: 0 }}
          const render = renderGraph(renderMap, `edit${index}`, toPlainData(curData))
          newPathMap.set(`edit${index}`, render);
          index++;
        }
        //这次操作是替换节点
        else {
          const labelA = GAMap.get(edit[0])
          const labelB = GBMap.get(edit[1])
          //存储节点替换产生的映射
          nodeMap.set(edit[1], edit[0])

          //label不相等才算做一次edit
          if(labelA !== labelB){
            const nodeToModify = curData.nodes.find((node: any) => node.id === edit[0]);
            // @ts-ignore
            nodeToModify.label = labelB;
            // @ts-ignore
            nodeToModify.style = {fill: 'rgb(253, 237, 237)', stroke: '#e72a2a'};
            const render = renderGraph(renderMap, `edit${index}`, toPlainData(curData))
            newPathMap.set(`edit${index}`, render);
            index++;

            editCount[1]++;
          }
        }
      })

      //3. 然后对边进行编辑
      editPath.edges.forEach(edit => {
        //添加边
        if(!edit[0]){
          //添加的这条边在图上的真实source和target
          // @ts-ignore
          let source = nodeMap.has(edit[1][0]) ? nodeMap.get(edit[1][0]) : edit[1][0]
          // @ts-ignore
          let target = nodeMap.has(edit[1][1]) ? nodeMap.get(edit[1][1]) : edit[1][1]
          // @ts-ignore
          curData.edges.push({source: source, target: target, style: {stroke: '#e72a2a'}})
          const render = renderGraph(renderMap, `edit${index}`, toPlainData(curData))
          newPathMap.set(`edit${index}`, render);
          index++;

          editCount[2]++;
        }
        //删除边
        else if(!edit[1]){
          curData.edges = curData.edges.filter((edge: any) => {
            // @ts-ignore
            return !(edge.source === edit[0][0] && edge.target === edit[0][1] || edge.source === edit[0][1] && edge.target === edit[0][0])
          })
          const render = renderGraph(renderMap, `edit${index}`, toPlainData(curData))
          newPathMap.set(`edit${index}`, render);
          index++;

          editCount[3]++;
        }
      })
      setRenderMap(newPathMap);
      setEdits(editCount);
    }
  }, [GA, GB, paths]);

  const reCompute = ()=> {
    if(GA && GB){
      setLoading(true)
      getPaths({
        algorithm: targetAlgorithm,
        graphPair: {
          graph1: GA,
          graph2: GB
        },
        k
      }).then(res => {
        console.log(res);
        setPaths(res.data)
        setLoading(false);
      })
    }
  }

  const backToDetail = ()=> {
    history.push(`/retrieval?tab=log&rid=${rid}`);
  }

  return <div style={{height: 'calc(100vh - 88px)', paddingRight: 20, overflow: 'auto'}}>
    <div style={{margin: '20px 0 20px 20px'}}>
      <div style={{marginBottom: 16}}>
        <Button onClick={backToDetail} icon={<IconFont type="icon-fanhui"/>}>返回</Button>
      </div>

      <div style={{display: 'flex', marginBottom: 16}}>
        <div style={{display: 'flex', alignItems: 'center', width: 80, justifyContent: 'center'}}>
          选择算法
        </div>
        <Select
          value={targetAlgorithm}
          onChange={(algorithm)=>setTargetAlgorithm(algorithm)}
          style={{ width: 120, borderRadius: '0 8px 8px 0', marginRight: 24}}
          options={[
            { value: 'GedGNN', label: 'GedGNN' },
            { value: 'Accurate', label: '精确算法' },
          ]}
        />

        <div style={{display: 'flex', alignItems: 'center', width: 40, justifyContent: 'center'}}>
          K
        </div>
        <InputNumber
          disabled={targetAlgorithm === 'Accurate'}
          style={{ width: 120, marginRight: 48}}
          min={1} max={1000} value={k}
          onChange={(newValue)=>setK(newValue || 1)}
        />
        <Button type='primary' onClick={reCompute}>重新计算</Button>
      </div>

      {
        loading || !paths ?
          <>
            <Card style={{marginBottom: 16}}>
              <Skeleton active/>
            </Card>
            <GraphsLoadingSkeleton column={4} row={2}/>
          </> :
          <>
            <Card style={{margin: '16px 0'}} bodyStyle={{padding: "16px 16px 12px 16px"}}>
              <h3 style={{fontSize: 16, fontWeight: 700, padding: 0, marginBottom: 6}}>计算结果</h3>

              <Row>
                <Col span={4} style={{display: "flex"}}>
                  <div style={{color: 'rgba(0,0,0,.4)', marginRight: 16}}>
                    编辑距离
                  </div>
                  <div style={{color: 'rgba(0,0,0,.9)'}} >
                    {paths.preGed}
                  </div>
                </Col>

                <Col span={4} style={{display: "flex"}}>
                  <div style={{color: 'rgba(0,0,0,.4)', marginRight: 16}}>
                    节点插入
                  </div>
                  <div style={{color: 'rgba(0,0,0,.9)'}} >
                    {edits[0]}
                  </div>
                </Col>

                <Col span={4} style={{display: "flex"}}>
                  <div style={{color: 'rgba(0,0,0,.4)', marginRight: 16}}>
                    节点重标签
                  </div>
                  <div style={{color: 'rgba(0,0,0,.9)'}} >
                    {edits[1]}
                  </div>
                </Col>

                <Col span={4} style={{display: "flex"}}>
                  <div style={{color: 'rgba(0,0,0,.4)', marginRight: 16}}>
                    边插入
                  </div>
                  <div style={{color: 'rgba(0,0,0,.9)'}} >
                    {edits[2]}
                  </div>
                </Col>

                <Col span={4} style={{display: "flex"}}>
                  <div style={{color: 'rgba(0,0,0,.4)', marginRight: 16}}>
                    边删除
                  </div>
                  <div style={{color: 'rgba(0,0,0,.9)'}} >
                    {edits[3]}
                  </div>
                </Col>

                <Col span={4} style={{display: "flex"}}>
                  <div style={{color: 'rgba(0,0,0,.4)', marginRight: 16}}>
                    计算耗时
                  </div>
                  <div style={{color: 'rgba(0,0,0,.9)'}} >
                    {(paths.timeUse*1000).toFixed(2)} ms
                  </div>
                </Col>
              </Row>

            </Card>

            <div style={{marginBottom: 16, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16}}>
              <Card style={{boxShadow: '0 0 8px rgba(255, 0, 0, 0.5)'}} bodyStyle={{padding: 0, backgroundColor: "rgb(240,240,240)", borderRadius: '8px'}}>
                <div style={{width: '100%', paddingTop: '100%'}}>
                  <div id='GA' style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%'}}>
                  </div>
                </div>
              </Card>

              {
                Array.from({length: paths?.preGed || 0}).map((_, index) =>
                  <Card key={index} style={{boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'}} bodyStyle={{padding: 0, backgroundColor: "rgb(252,252,252)", borderRadius: '8px'}}>
                    <div style={{width: '100%', paddingTop: '100%'}}>
                      <div style={{color: 'rgb(200,200,200)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 60, fontWeight: 500, position: 'absolute', top: 0, left: 0, width: '35%', height: '35%'}}>
                        {index+1}
                      </div>
                      <div id={`edit${index}`} style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%'}}>
                      </div>
                    </div>
                  </Card>
                )
              }

              <Card style={{boxShadow: '0 0 8px rgba(255, 0, 0, 0.5)'}} bodyStyle={{padding: 0, backgroundColor: "rgb(240,240,240)", borderRadius: '8px'}}>
                <div style={{width: '100%', paddingTop: '100%'}}>
                  <div id='GB' style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%'}}>
                  </div>
                </div>
              </Card>
            </div>
          </>
      }
    </div>

  </div>
}

export default PathsResult;
