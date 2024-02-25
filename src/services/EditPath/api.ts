import {request} from "@@/exports";

export async function getPaths(body: EditPath.EditPathQueryRequest, options?: { [key: string]: any }) {
  return request<Common.R>('/paths', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}