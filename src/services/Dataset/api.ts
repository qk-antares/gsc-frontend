import {request} from "@@/exports";

/** 获取数据集的全部标签 GET */
export async function getDatasetTags(options?: { [key: string]: any }) {
  return request<Common.R>('/dataset/tags', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 新建数据集 POST */
export async function createDataset(dataset: Dataset.DatasetAddRequest, options?: { [key: string]: any }) {
  return request<Common.R>('/dataset', {
    method: 'POST',
    data: dataset,
    ...(options || {}),
  });
}

export async function updateDatasetName(body: Dataset.DatasetUpdateRequest, options?: { [key: string]: any }) {
  return request<Common.R>(`/dataset`, {
    method: 'PUT',
    data: body,
    ...(options || {}),
  });
}

/** 分页获取数据集信息 POST */
export async function listDatasetVoByPage(pageParams: Dataset.DatasetQuery, options?: { [key: string]: any }) {
  return request<Common.R>('/dataset/page/vo', {
    method: 'POST',
    data: pageParams,
    ...(options || {}),
  });
}

/** 获取某个数据集的信息 GET */
export async function getDatasetById(did: number, options?: { [key: string]: any }) {
  return request<Common.R>(`/dataset/${did}`, {
    method: 'GET',
    ...(options || {}),
  });
}


/** 获取所有数据集的信息 GET */
export async function listAllDataset(options?: { [key: string]: any }) {
  return request<Common.R>(`/dataset/list`, {
    method: 'GET',
    ...(options || {}),
  });
}
