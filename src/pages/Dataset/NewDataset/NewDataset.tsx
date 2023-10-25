import React from "react";
import {Form, Input, Tabs} from "antd";
import Uploader from "@/pages/Dataset/NewDataset/Uploader/Uploader";
import styles from './styles.less'

const NewDataset: React.FC = ()=> {
  return <div className={styles.outerDiv}>
    <Form layout='vertical'>
      <Form.Item label="数据集名称">
        <Input placeholder="请输入数据集名称" />
      </Form.Item>
      <Form.Item label="数据集文件">
        <Tabs
          tabPosition="left"
          items={[
            {
              label: 'GraphJSON',
              key: 'GraphJSON',
              children: <Uploader />,
            },
          ]}
        />
      </Form.Item>
    </Form>
  </div>
}
export default NewDataset;
