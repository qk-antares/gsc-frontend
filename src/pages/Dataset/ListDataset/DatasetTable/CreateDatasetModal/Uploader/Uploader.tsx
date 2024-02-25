//数据上次传组件
import {Alert, Button} from "antd";
import Dragger from "antd/es/upload/Dragger";
import {FileAddOutlined} from "@ant-design/icons";
import React from "react";
import {getUploadProps} from "@/utils/uploadProps";

type UploaderProps = {
  gids: number[];
  setGids: React.Dispatch<React.SetStateAction<number[]>>;
}

const Uploader: React.FC<UploaderProps> = ({gids, setGids})=> {
  return <>
    <Alert
      message="数据集规范：数据集由若干个图构成，位于同一文件夹下，每个图是一个 JSON 文件，nodes 表示点的集合，edges 表示边的集合"
      type="info" showIcon closable
      action={<Button style={{marginLeft: 8}} size="small" type="primary" onClick={()=>{}}>下载示例数据</Button>}
    />
    <h4 style={{marginTop: 10}}>上传数据</h4>

    <Dragger {...getUploadProps(gids, setGids)}>
      <p className="ant-upload-drag-icon">
        <FileAddOutlined />
      </p>
      <p className="ant-upload-hint">
        点击或将数据文件拖拽到这里上传，支持JSON格式
      </p>
    </Dragger>
  </>
}
export default Uploader;
