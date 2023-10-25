import G6, {Graph} from "@antv/g6";
import React from "react";

export const renderGraph = (
  containerId: string,
  width: number | undefined,
  height: number | undefined,
  data: any,
  layout: string | null,
  staticGraph=false,
  nodeSize: number | undefined,
  linkDistance: number | undefined,
  lineWidth: number | undefined,
  g?: Graph | undefined,
  setG?: React.Dispatch<React.SetStateAction<Graph | undefined>>,
) => {
  //设置布局
  let graphLayout = {};
  switch (layout){
    case 'force':
      graphLayout = {
        type: 'force',
        preventOverlap: true,
        nodeSize: 20,
        nodeStrength: -100
      };break;
    case 'radial':
      graphLayout = {
        type: 'radial',
        preventOverlap: true,
        nodeSize: nodeSize || 50,
        linkDistance: linkDistance || 50,
      }
  }

  //设置和图的交互
  let modes = {}
  if(!staticGraph){
    modes = {
      default: ['drag-node'],
    }
  }

  if(g){
    g.clear()
    g.data(data)
    g.render()
  } else {
    const graph = new G6.Graph({
      container: containerId,
      width: width || document.getElementById(containerId)?.offsetWidth,
      height: height || document.getElementById(containerId)?.offsetHeight,

      defaultEdge: {
        style: {
          lineWidth: lineWidth || 3, // 设置连线的粗细
        },
      },

      fitCenter: true,
      layout: graphLayout,
      modes: modes
    });

    graph.data(data)
    graph.render()
    if(setG){
      setG(graph)
    }
  }
}


export const renderGraphV2 = (
  containerId: string,
  width: number | undefined,
  height: number | undefined,
  data: any,
  layout: string | null,
  staticGraph=false,
  nodeSize: number | undefined,
  linkDistance: number | undefined,
  lineWidth: number | undefined,
  g?: Graph | undefined,
  setG?: React.Dispatch<React.SetStateAction<Graph | undefined>>,
) => {
  const divToRemove = document.getElementById(containerId);
  if (divToRemove) {
    while (divToRemove.firstChild) {
      divToRemove.removeChild(divToRemove.firstChild);
    }
  }

  //设置布局
  let graphLayout = {};
  switch (layout){
    case 'force':
      graphLayout = {
        type: 'force',
        preventOverlap: true,
        nodeSize: 20,
        nodeStrength: -100
      };break;
    case 'radial':
      graphLayout = {
        type: 'radial',
        preventOverlap: true,
        nodeSize: nodeSize || 50,
        linkDistance: linkDistance || 50,
      }
  }

  //设置和图的交互
  let modes = {}
  if(!staticGraph){
    modes = {
      default: ['drag-node'],
    }
  }

  if(g){
    g.clear()
    g.data(data)
    g.render()
  } else {
    const graph = new G6.Graph({
      container: containerId,
      width: width || document.getElementById(containerId)?.offsetWidth,
      height: height || document.getElementById(containerId)?.offsetHeight,

      defaultEdge: {
        style: {
          lineWidth: lineWidth || 3, // 设置连线的粗细
        },
      },

      fitCenter: true,
      layout: graphLayout,
      modes: modes
    });

    graph.data(data)
    graph.render()
    if(setG){
      setG(graph)
    }
  }
}

export const clearGraph = (g: Graph | undefined, setG: React.Dispatch<React.SetStateAction<Graph | undefined>>)=>{
  if(g){
    g.destroy();
    setG(undefined);
  }
}

export const toPlainData = (g: Graph.GraphData) => {
  const newG: Graph.GraphData = {
    nodes: g.nodes.map(node => ({id: node.id, label: node.label, style: node.style, labelCfg: node.labelCfg})),
    edges: g.edges.map(edge => ({source: edge.source, target: edge.target, style: edge.style}))
  };
  return newG;
}


