import {backendUrl} from "@/utils/constants";
import {UploadProps} from "antd";
import React from "react";

export const getUploadProps = (gids: number[], setGids: React.Dispatch<React.SetStateAction<number[]>>)=> {
  const props: UploadProps = {
    accept: '.json',
    multiple: true,
    name: 'file',
    action: `${backendUrl}/graph/upload`,
    onChange(info) {
      if (info.file.status === 'done') {
        console.log(info)
        setGids([info.file.response.data, ...gids])
        console.log("当前gids: ", [info.file.response.data, ...gids])
      }
    },
    onRemove(file) {
      setGids(gids.filter(gid => gid !== file.response.data))
    }
  }
  return props;
}
