declare namespace Retrieval {
  type GraphPairQueryRequest = {
    rid: number;
    gid: number;
  }

  type RetrievalAddRequest = {
    graphData: Graph.GraphData;
    did: number;
    algorithm: string;
  }

  type RetrievalQueryRequest = Common.PageParams & {id: number};

  type Retrieval = {
    rid: number;
    algorithm: string;
    graphData: Graph.GraphData;
    dataset: Dataset.Dataset;
    status: string;
    createTime: Date;
    finishTime: Date;
    timeCost: number;
  }

  type Record = {
    graph: Graph.Graph;
    preGed: number;
  }
}
