import React, {useEffect, useState} from "react";
import {clearGraph, renderGraph, toPlainData} from "@/utils/graphRender";
import {Card, Col, Row} from "antd";
import {CaretRightOutlined, PauseOutlined, StepBackwardOutlined, StepForwardOutlined} from "@ant-design/icons";
import styles from './styles.less'
import {IconFont} from "@/utils/iconUtil";
import {Graph} from "@antv/g6";

type ResultProps = {
  ged: Ged.Ged | undefined;//计算结果
  graph1: Graph.GraphData | undefined;
  graph2: Graph.GraphData | undefined;
}

const Result: React.FC<ResultProps> = ({ged, graph1, graph2})=> {
  const [g1, setG1] = useState<Graph>();
  const [g2, setG2] = useState<Graph>();
  const [canvasWidth, setCanvasWidth] = useState<number | undefined>()
  const canvasHeight = 300
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(()=>{
    const width = document.getElementById('GA')?.offsetWidth
    setCanvasWidth(width);
  }, [])

  useEffect(() => {
    if(ged && ged.cost > 0){
      setCurrentIndex(0);
    } else {
      setCurrentIndex(-1);
    }
  }, [ged]);

  useEffect(() => {
    if(graph1){
      renderGraph('GA', canvasWidth, canvasHeight, JSON.parse(JSON.stringify(graph1)), 'radial', true, undefined,undefined, undefined, g1, setG1)
    } else {
      clearGraph(g1, setG1)
    }
  }, [graph1]);

  useEffect(() => {
    if(graph2){
      renderGraph('GB', canvasWidth, canvasHeight, JSON.parse(JSON.stringify(graph2)), 'radial', true,undefined, undefined, undefined, g2, setG2)
    }else {
      clearGraph(g2, setG2)
    }
  }, [graph2]);

  useEffect(() => {
    if(ged && graph1 && graph2){
      //对编辑路径进行可视化
      //1. 首先构建一些辅助变量
      //构建graph1 graph2节点map，方便后续操作
      const GAMap = new Map<string, string>()
      graph1.nodes.forEach((node) => {
        GAMap.set(node.id, node.label);
      });

      const GBMap = new Map<string, string>()
      graph2.nodes.forEach((node) => {
        GBMap.set(node.id, node.label);
      });

      //存储由于节点替换产生的节点Id映射
      const nodeMap = new Map<string, string>()

      //curData存储当前应当渲染到画布上的数据，index是当前编辑的步数
      let curData = JSON.parse(JSON.stringify(graph1));

      let index = 0;

      //2. 首先对节点进行编辑
      ged.paths.nodes.forEach(edit => {
        //这次操作是添加节点
        if(!edit[0]){
          const addId = edit[1]
          // @ts-ignore
          const addLabel = GBMap.get(edit[1])
          curData.nodes.push({id: addId, label: addLabel, style: {fill: 'rgb(253, 237, 237)', stroke: '#e72a2a'}})
          // @ts-ignore
          GAMap.set(addId, addLabel)
          renderGraph(`edit${index}`, canvasWidth, canvasHeight, toPlainData(curData), 'radial', true, undefined,undefined, undefined)
          index++;
        }
        //这次操作是删除节点
        else if(!edit[1]){
          const nodeToModify = curData.nodes.find((node: any) => node.id === edit[0]);
          nodeToModify.style = {opacity: 0};
          nodeToModify.labelCfg = { style: { opacity: 0 }}

          renderGraph(`edit${index}`, canvasWidth, canvasHeight, toPlainData(curData), 'radial', true, undefined,undefined, undefined)
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
            nodeToModify.label = labelB;
            nodeToModify.style = {fill: 'rgb(253, 237, 237)', stroke: '#e72a2a'};

            renderGraph(`edit${index}`, canvasWidth, canvasHeight, toPlainData(curData), 'radial', true, undefined,undefined, undefined)
            index++;
          }
        }
      })

      //3. 然后对边进行编辑
      ged.paths.edges.forEach(edit => {
        //添加边
        if(!edit[0]){
          //添加的这条边在图上的真实source和target
          // @ts-ignore
          let source = nodeMap.has(edit[1][0]) ? nodeMap.get(edit[1][0]) : edit[1][0]
          // @ts-ignore
          let target = nodeMap.has(edit[1][1]) ? nodeMap.get(edit[1][1]) : edit[1][1]

          curData.edges.push({source: source, target: target, style: {stroke: '#e72a2a'}})
          renderGraph(`edit${index}`, canvasWidth, canvasHeight, toPlainData(curData), 'radial', true, undefined,undefined, undefined)
          index++;
        }
        //删除边
        else if(!edit[1]){
          curData.edges = curData.edges.filter((edge: any) => {
            // @ts-ignore
            return !(edge.source === edit[0][0] && edge.target === edit[0][1] || edge.source === edit[0][1] && edge.target === edit[0][0])
          })
          renderGraph(`edit${index}`, canvasWidth, canvasHeight, toPlainData(curData), 'radial', true, undefined,undefined, undefined)
          index++;
        }
      })
    }
  }, [graph1, graph2, ged]);

  const handleNextSlide = () => {
    if(ged && ged.cost > 0){
      setCurrentIndex((prevIndex) => (prevIndex + 1) % ged.cost);
    }
  };

  const handlePrevSlide = () => {
    if(ged && ged.cost > 0){
      setCurrentIndex((prevIndex) => (prevIndex - 1 + ged.cost) % ged.cost);
    }
  };

  const handlePlayPause = () => {
    setIsPlaying((prevState) => !prevState);
  };

  //开始或暂停播放
  useEffect(() => {
    let interval: NodeJS.Timeout;
    //每3s切换下一页
    if (isPlaying) {
      interval = setInterval(() => {
        handleNextSlide();
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (<>
    <Row>
      <Col span={8}>
        <div
          style={!graph1 ? {background: 'linear-gradient(180deg,transparent,rgba(0,0,0,.3) 99.32%)'} : undefined}
          className={styles.outerDiv}>
          <div className={styles.inputGraph} id='GA'>
            {
              !graph1 &&
              <div className={styles.empty}>
                <IconFont className={styles.icon} type='icon-graphql'/>
                <div>请先上传数据</div>
              </div>
            }
          </div>
          <div className={styles.bottomTxt}>原始图</div>
        </div>
      </Col>

      <Col span={8}>
        <div className={styles.carouselWrap}>
          <div
            className={styles.carousel}
            style={{transform: `translateX(-${currentIndex * 100}%)`}}>
            {Array.from({ length: ged?.cost || 0 }).map((_, index)=>
              <div key={index} className={styles.singleCard} id={`edit${index}`}></div>)}
          </div>

          <div className={styles.playBox}>
            {
              isPlaying ? <PauseOutlined onClick={handlePlayPause} className={styles.carouselIcon}/>
                : <CaretRightOutlined onClick={handlePlayPause} className={styles.carouselIcon}/>
            }

            <span style={{float: 'right'}}>
              <StepBackwardOutlined className={styles.carouselIcon} onClick={handlePrevSlide}/>
              <span style={{margin: '0 20px', color: 'white'}}>
                {ged ? `${currentIndex+1} / ${ged.cost}` : '0 / 0'}
              </span>
              <StepForwardOutlined className={styles.carouselIcon} onClick={handleNextSlide}/>
            </span>
          </div>
        </div>
      </Col>

      <Col span={8}>
        <div
          style={!graph2 ? {background: 'linear-gradient(180deg,transparent,rgba(0,0,0,.3) 99.32%)'} : undefined}
          className={styles.outerDiv}>
          <div className={styles.inputGraph} id='GB'>
            {
              !graph2 &&
              <div className={styles.empty}>
                <IconFont className={styles.icon} type='icon-graphql'/>
                <div>请先上传数据</div>
              </div>
            }
          </div>
          <div className={styles.bottomTxt}>目标图</div>
        </div>
      </Col>
    </Row>

    <Card bodyStyle={{padding: 20}} style={{marginTop: 16, borderRadius: 0}}>
      <h3 style={{fontSize: 14, fontWeight: 700, padding: 0, marginBottom: 16}}>计算结果信息</h3>

      <Row style={{padding: '6px 0'}}>
        <Col span={12}>
          <Row>
            <Col style={{fontSize: 13, color: 'rgba(0,0,0,.4)'}} flex='80px'>
              编辑距离
            </Col>
            <Col style={{fontSize: 13, color: 'rgba(0,0,0,.9)'}} flex='auto'>
              {ged ? ged.cost || 0 : '-'}
            </Col>
          </Row>
        </Col>
        <Col span={12}>
          <Row>
            <Col style={{fontSize: 13, color: 'rgba(0,0,0,.4)'}} flex='80px'>
              计算耗时
            </Col>
            <Col style={{fontSize: 13, color: 'rgba(0,0,0,.9)'}} flex='auto'>
              {ged ? (ged.timeUse*1000).toFixed(2) : '-'} ms
            </Col>
          </Row>
        </Col>
      </Row>
    </Card>
  </>)
}

export default Result
