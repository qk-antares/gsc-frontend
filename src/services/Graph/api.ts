import {request} from "@@/exports";

export async function listGraphVoByPage(pageParams: Graph.GraphQueryRequest, options?: { [key: string]: any }) {
  return request<Common.R>('/graph/page/vo', {
    method: 'POST',
    data: pageParams,
    ...(options || {}),
  });
}

export async function addGraphsToDataset(body: Graph.GraphAddRequest, options?: { [key: string]: any }) {
  return request<Common.R>('/graph', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

export async function addEditorGraphToDataset(body: Graph.EditorGraphAddRequest, options?: { [key: string]: any }) {
  return request<Common.R>('/graph/editor_add', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

export async function deleteGraphFromDataset(body: Graph.GraphDeleteRequest, options?: { [key: string]: any }) {
  return request<Common.R>('/graph', {
    method: 'DELETE',
    data: body,
    ...(options || {}),
  });
}

export async function updateGraphName(body: Graph.GraphUpdateRequest, options?: { [key: string]: any }) {
  return request<Common.R>('/graph', {
    method: 'PUT',
    data: body,
    ...(options || {}),
  });
}
