//数据集类型设计
declare namespace Dataset {
  type DatasetQuery = {
    current?: number;
    pageSize?: number;
    sortField?: string;
    sortOrder?: "descend" | "ascend";

    tags?: string[];
    keyword?: string;
  }

  type DatasetAddRequest = {
    name: string;
    tags: string[];
    gids: number[];
  }

  type DatasetUpdateRequest = {
    did: number;
    name: string;
    tags: string[];
  }


  type Dataset = {
    did: number;
    name: string;
    tags: string[];
    count: number;
    maxNodeNum: number;
    maxEdgeNum: number;
    labels: string[];
    createTime: Date;
    updateTime: Date;
  }
}
