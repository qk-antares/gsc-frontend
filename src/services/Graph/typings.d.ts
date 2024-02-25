//图数据类型设计
declare namespace Graph {
  type Node = {
    id: string;
    label: string;
    style?: any;
    labelCfg?: any;
  };

  type Edge = {
    source: string;
    target: string;
    style?: any;
  };

  type GraphData = {
    nodes: Node[];
    edges: Edge[];
  };

  type GraphPair = {
    graph1: Graph.GraphData;
    graph2: Graph.GraphData;
  }

  type Graph = {
    gid: number;
    did: number;
    name: string;
    graphData: GraphData;
    createTime: Date;
    updateTime: Date;
  }

  type GraphQueryRequest = Common.PageParams & {did: number};

  type GraphAddRequest = {
    did: number;
    gids: number[];
  };

  type EditorGraphAddRequest = {
    name: string;
    did: number;
    graphData: GraphData;
  }

  type GraphDeleteRequest = {
    did: number;
    gids: number[];
  }

  type GraphUpdateRequest = {
    gid: number;
    name: string;
  }
}
