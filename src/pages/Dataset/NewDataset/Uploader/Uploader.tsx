import {Alert, Button, message, UploadProps} from "antd";
import Dragger from "antd/es/upload/Dragger";
import {FileAddOutlined} from "@ant-design/icons";
import React from "react";

const Uploader: React.FC = ()=> {
  const props: UploadProps = {
    accept: '.json',
    multiple: false,
    name: 'file',
    beforeUpload: (file) => {
      try {
        const fileReader = new FileReader();
        fileReader.onload = (e) => {
          const result = e.target?.result;
          if(typeof result === 'string'){

          }
        };
        fileReader.readAsText(file);
      } catch (error) {
        message.error('文件读取失败');
      }
      return false;
    },
    onRemove: ()=>{
    },
  };

  return <>
    <Alert
      message="JSON 文件规范：点边数据必须放在同一个 JSON 文件中上传，nodes 表示点的集合，edges 表示边的集合"
      type="info"
      showIcon
      closable
      action={
        <Button
          size="small" type="primary"
          onClick={()=>{}}
        >
          下载示例数据
        </Button>
      }
    />
    <h4 style={{ marginTop: 10 }}>上传数据</h4>

    <Dragger {...props}>
      <p className="ant-upload-drag-icon">
        <FileAddOutlined />
      </p>
      <p className="ant-upload-hint">
        点击或将数据文件拖拽到这里上传，支持JSON格式
      </p>
    </Dragger>

    <div style={{ padding: '30px 0px 10px', display: 'flex', justifyContent: 'center' }}>
      <Button onClick={()=>{}} type="primary" shape="round" disabled>
        进入下一步
      </Button>
    </div>
  </>
}
export default Uploader;
