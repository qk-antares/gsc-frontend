import React, {useState} from "react";
import {Alert, Button, Divider, message, Modal} from "antd";
import Dragger from "antd/es/upload/Dragger";
import {FileAddOutlined} from "@ant-design/icons";
import {getUploadProps} from "@/utils/uploadProps";
import styles from './styles.less'
import {addGraphsToDataset} from "@/services/Graph/api";

type UploadModalProps = {
  did: number;
  modalOpen: boolean;
  onCancel: ()=>void;
  afterUpload: ()=>void;
}

const UploadModal: React.FC<UploadModalProps> = ({did, modalOpen, onCancel, afterUpload})=>{
  const [gids, setGids] = useState<number[]>([]);

  const onAdd = ()=>{
    addGraphsToDataset({did, gids}).then(res => {
      if(res.code === 200){
        message.success('上传成功！');
        onCancel();
        afterUpload();
      }
    })
  }

  return <Modal
    okText='添加'
    okButtonProps={{disabled: gids.length === 0}}
    onOk={onAdd}
    open={modalOpen}
    title='上传数据'
    centered={true} onCancel={onCancel}
  >
    <Divider style={{margin: '12px 0'}}></Divider>

    <div className={styles.contentDiv}>
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
    </div>
  </Modal>
}

export default UploadModal;
