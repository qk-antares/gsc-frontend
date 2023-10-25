declare namespace Ged {
  // 编辑路径的计算结果
  type Ged = {
    paths: EditPath;
    cost: number;
    timeUse: number;
  }

  type EditPath = {
    nodes: (string | null)[][];
    edges: (string[] | null)[][];
  }

  type GedComputeRequest = {
    graph1: Graph.GraphData;
    graph2: Graph.GraphData;
  }
}

