//编辑路径类型设计
declare namespace EditPath {
  // 编辑路径的计算结果
  type Paths = {
    editPath: EditPath;
    preGed: number;
    timeUse: number;
  }

  type EditPath = {
    nodes: (string | null)[][];
    edges: (string[] | null)[][];
  }

  type EditPathQueryRequest = {
    graphPair: Graph.GraphPair;
    algorithm: string;
    k?: number;
  }
}
