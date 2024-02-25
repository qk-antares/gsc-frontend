//数据格式转换，将图编辑器中的数据转成我们需要的数据
import {NsGraph} from "@antv/xflow";
import {message} from "antd";

export const IGraphDataToPlain = (graphData: NsGraph.IGraphData) => {
  console.log(graphData);
  if(graphData.nodes.length === 0){
    message.error('图中至少有一个节点！');
    return;
  }
  //转成需要的数据格式
  let jsonConvert: Graph.GraphData = {
    nodes: graphData.nodes.map((node) => {
      return { id: node.id, label: node.label || ''};
    }),
    edges: graphData.edges.map((edge) => {
      return { source: edge.source, target: edge.target };
    }),
  };

  return jsonConvert;
}


//数据格式转换，用于可视化图
export const dataConverter = (graph: string[][], labels: string[]) => {
  const nodes = labels.map((label, index) =>
    ({id: index.toString(), label: label.toString()}));
  const edges = graph.map(([source, target]) =>
    ({source: source.toString(), target: target.toString()}));
  return {nodes, edges}
}

//图对数据转换
export const simgnnDataConverter = (graphPair: any) => {
  // 创建一个映射表，将字符串映射为数字
  const labelToNumberMap: Map<string, string> = new Map();
  let nextNumber = 1;

  // 遍历图数据的labels_1、labels_2等
  const mappedLabels_1: string[] = [], mappedLabels_2: string[] = [];
  let newLabel;
  for (const label of graphPair.labels_1){
    if (!labelToNumberMap.has(label)) {
      labelToNumberMap.set(label, nextNumber.toString());
      nextNumber++;
    }
    newLabel = labelToNumberMap.get(label)
    if(newLabel){
      mappedLabels_1.push(newLabel.toString())
    }
  }

  for (const label of graphPair.labels_2){
    if (!labelToNumberMap.has(label)) {
      labelToNumberMap.set(label, nextNumber.toString());
      nextNumber++;
    }
    newLabel = labelToNumberMap.get(label)
    if(newLabel){
      mappedLabels_2.push(newLabel.toString())
    }
  }

  return {
    labels_1: mappedLabels_1,
    graph_1: graphPair.graph_1,
    labels_2: mappedLabels_2,
    graph_2: graphPair.graph_2
  }
}
