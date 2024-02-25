//创建数据集模态框
import React, {useRef, useState} from "react";
import {Divider, Form, Input, InputRef, message, Modal, Space, Tabs, Tag, Tooltip} from "antd";
import {createDataset} from "@/services/Dataset/api";
import Uploader from "@/pages/Dataset/ListDataset/DatasetTable/CreateDatasetModal/Uploader/Uploader";
import {PlusOutlined} from "@ant-design/icons";

type CreateDataModalProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  afterCreate: ()=>void;
}

const CreateDatasetModal: React.FC<CreateDataModalProps> = ({open, setOpen, afterCreate})=> {
  //有关标签输入的变量
  const [tags, setTags] = useState<string[]>([]);
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<InputRef>(null);
  const editInputRef = useRef<InputRef>(null);
  const [editInputIndex, setEditInputIndex] = useState(-1);
  const [editInputValue, setEditInputValue] = useState('');

  const [datasetName, setDatasetName] = useState<string>('');
  const [gids, setGids] = useState<number[]>([]);

  const onCreate = ()=> {
    createDataset({
      name: datasetName,
      gids,
      tags
    }).then(res => {
      if(res.code === 200){
        message.success('创建成功！');
        setOpen(false);
        afterCreate();
      }
    })
  }

  const handleClose = (removedTag: string) => {
    const newTags = tags.filter((tag) => tag !== removedTag);
    console.log(newTags);
    setTags(newTags);
  };

  const showInput = () => {
    setInputVisible(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputConfirm = () => {
    if (inputValue && tags.indexOf(inputValue) === -1) {
      setTags([...tags, inputValue]);
    }
    setInputVisible(false);
    setInputValue('');
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditInputValue(e.target.value);
  };

  const handleEditInputConfirm = () => {
    const newTags = [...tags];
    newTags[editInputIndex] = editInputValue;
    setTags(newTags);
    setEditInputIndex(-1);
    setEditInputValue('');
  };

  //一些样式
  const tagInputStyle: React.CSSProperties = {
    width: 64,
    height: 22,
    marginInlineEnd: 8,
    verticalAlign: 'top',
  };

  const tagPlusStyle: React.CSSProperties = {
    height: 22,
    borderStyle: 'dashed',
  };

  return <Modal onOk={onCreate} okText='创建' okButtonProps={{disabled: !datasetName}} title='新建数据集' open={open} width={800} onCancel={()=>setOpen(false)}>
    <Divider style={{margin: '12px 0 0 0'}}/>
    <div style={{padding: 24, maxHeight: 440, overflow: 'auto'}}>
      <Form labelCol={{ span: 3 }} wrapperCol={{span: 21}}>
        <Form.Item label="数据集名称" required={true}>
          <Input
            placeholder="请输入数据集名称" value={datasetName}
            onChange={(e)=>{
              setDatasetName(e.target.value)
            }}
          />
        </Form.Item>
        <Form.Item label="标签">
          <Space size={[0, 8]} wrap>
            <Space size={[0, 8]} wrap>
              {tags.map((tag, index) => {
                if (editInputIndex === index) {
                  return (
                    <Input ref={editInputRef} key={tag} size="small"
                      style={tagInputStyle} value={editInputValue}
                      onChange={handleEditInputChange}
                      onBlur={handleEditInputConfirm}
                      onPressEnter={handleEditInputConfirm}/>
                  );
                }

                const isLongTag = tag.length > 20;
                const tagElem = (
                  <Tag key={tag} closable={true} style={{ userSelect: 'none' }} onClose={() => handleClose(tag)}>
                    <span
                      onDoubleClick={(e) => {
                        if (index !== 0) {
                          setEditInputIndex(index);
                          setEditInputValue(tag);
                          e.preventDefault();
                        }
                      }}
                    >
                      {isLongTag ? `${tag.slice(0, 20)}...` : tag}
                    </span>
                  </Tag>
                );

                return isLongTag ? (
                  <Tooltip title={tag} key={tag}>
                    {tagElem}
                  </Tooltip>
                ) : (
                  tagElem
                );
              })}

              {inputVisible ? (
                <Input
                  ref={inputRef} type="text" size="small"
                  style={tagInputStyle} value={inputValue}
                  onChange={handleInputChange}
                  onBlur={handleInputConfirm}
                  onPressEnter={handleInputConfirm}/>
              ) : (
                <Tag style={tagPlusStyle} onClick={showInput}>
                  <PlusOutlined /> New Tag
                </Tag>
              )}
            </Space>
          </Space>
        </Form.Item>
        <Form.Item style={{marginBottom: 12}} label="数据集文件"></Form.Item>
        <Tabs
          tabPosition="left"
          items={[
            {
              label: 'GraphJSON',
              key: 'GraphJSON',
              children: <Uploader gids={gids} setGids={setGids}/>,
            },
            {
              label: 'GEXF',
              key: 'GEXF',
              children: <Uploader gids={gids} setGids={setGids}/>,
            },
          ]}
        />
      </Form>
    </div>
  </Modal>
}
export default CreateDatasetModal;
