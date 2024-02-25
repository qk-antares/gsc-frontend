//图渲染工具类
import G6, {Graph} from "@antv/g6";

//获取节点id被标记的图数据
export const getMarkedGraphData = (prefix: string, graphData: Graph.GraphData) => {
  const markedGraph: Graph.GraphData = {nodes: [], edges: []}
  markedGraph.nodes = graphData.nodes.map((node: Graph.Node) =>
      ({id: `${prefix}-${node.id}`, label: node.label}))
  markedGraph.edges = graphData.edges.map((edge: Graph.Edge) =>
      ({source: `${prefix}-${edge.source}`, target: `${prefix}-${edge.target}`}))
  return markedGraph;
}

//清除containerId中的图
export const clearGraph = (renderMap: Map<string, any>, containerId: string) => {
  const graphToDestroy = renderMap.get(containerId)
  if (graphToDestroy) {
    graphToDestroy.destroy();
  }
}

//获取标签的图数据
export const getLegendData = (labels: string[]) => {
  const legendData: Graph.GraphData = {
    nodes: [],
    edges: []
  }
  legendData.nodes = labels.map((label: string) => {
    return {
      id: label,
      label: label
    }
  })
  return legendData;
}

export const renderGraph = (
  renderMap: Map<string, any>,
  containerId: string,
  graphData: Graph.GraphData,
  withColor: boolean = false,
  colorMap?: Map<string, any>,
  layout: string = 'radial',
  fitView: boolean = false,
  width: number | undefined = undefined,
  height: number | undefined = undefined,
  staticGraph: boolean = true,
  lineWidth?: number | undefined,
) => {
  clearGraph(renderMap, containerId);

  if(withColor && colorMap) {
    //给节点一些样式
    graphData.nodes.forEach((node) => {
      const colorSet = colorMap.get(node.label)
      node.style = {
        fill: colorSet.mainFill,
        stroke: colorSet.mainStroke,
      }
    })
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
        nodeSize: 50,
        linkDistance: 30,
        unitRadius: 40,
        workerEnabled: true,
        workerScriptURL: 'http://localhost:8000/scripts/layout.min.js'
      };break;
    case 'grid':
      graphLayout = {
        type: 'grid',
        begin: [ 0, 0 ],
        preventOverlap: true,
        preventOverlapPadding: 20,
        nodeSize: 30,
        condense: false,
        rows: 10,
        cols: 20,
        sortBy: 'degree',
      };break;
  }

  //设置和图的交互
  let modes = {}
  if(!staticGraph){
    modes = {
      default: ['drag-node'],
    }
  }

  const graph = new G6.Graph({
    container: containerId,
    width: width || document.getElementById(containerId)?.offsetWidth,
    height: height || document.getElementById(containerId)?.offsetHeight,

    defaultEdge: {
      style: {
        lineWidth: lineWidth || 3, // 设置连线的粗细
      },
    },

    fitView,
    fitCenter: layout !== 'grid',
    layout: graphLayout,
    modes: modes
  });

  graph.data(graphData)
  graph.render()

  return graph
}



export const toPlainData = (g: Graph.GraphData) => {
  const newG: Graph.GraphData = {
    nodes: g.nodes.map(node => ({id: node.id, label: node.label, style: node.style, labelCfg: node.labelCfg})),
    edges: g.edges.map(edge => ({source: edge.source, target: edge.target, style: edge.style}))
  };
  return newG;
}

//颜色相关
function hslToHex(h: number, s: number, l: number): string {
  h /= 360;
  s /= 100;
  l /= 100;

  let r: number, g: number, b: number;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number): number => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q: number = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p: number = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  const toHex = (x: number): string => {
    const hex: string = Math.round(x * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

//生成若干个尽可能容易分辨的颜色
export const generateDistinctColors = (numColors: number) => {
  const colors: string[] = [];
  const hueStep: number = 360 / numColors;

  for (let i = 0; i < numColors; i++) {
    const hue: number = i * hueStep;
    const saturation: number = 70 + Math.random() * 20; // 控制饱和度在70-90之间
    const lightness: number = 50 + Math.random() * 10; // 控制亮度在50-60之间

    const color: string = hslToHex(hue, saturation, lightness);
    colors.push(color);
  }

  return colors;
}

//根据labels生成colorMap
export const getColorMapByLabels = (labels: string[]) => {
  //生成等数量的颜色
  const colors = generateDistinctColors(labels.length)
  //生成G6的颜色
  const colorList = G6.Util.getColorSetsBySubjectColors(colors, '#fff', 'default', '#777');
  //建立节点类型和颜色之间的关系
  const colorMap = new Map<string, any>();
  let colorIndex = 0;
  for (const label of labels) {
    colorMap.set(label, colorList[colorIndex])
    colorIndex++;
  }
  return colorMap;
}