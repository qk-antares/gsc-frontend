import {request} from "@@/exports";

export async function retrievalGraphInDataset(body: Retrieval.RetrievalAddRequest, options?: { [key: string]: any }) {
  return request<Common.R>('/retrieval', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

export async function getRetrievalById(rid: number, options?: { [key: string]: any }) {
  return request<Common.R>(`/retrieval/${rid}`, {
    method: 'GET',
    ...(options || {}),
  });
}

export async function listRetrievalVoByPage(body: Common.PageParams, options?: { [key: string]: any }) {
  return request<Common.R>('/retrieval/page/vo', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

export async function getRetrievalDetail(body: Retrieval.RetrievalQueryRequest, options?: { [key: string]: any }) {
  return request<Common.R>('/retrieval/page/vo/detail', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

export async function getGraphPair(body: Retrieval.GraphPairQueryRequest, options?: { [key: string]: any }) {
  return request<Common.R>('/retrieval/pair', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}


