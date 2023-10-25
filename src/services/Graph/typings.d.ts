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
}
