//数据集更新模态款
import {Divider, Form, Input, InputRef, Modal, Space, Tag, Tooltip} from "antd";
import React, {useEffect, useRef, useState} from "react";
import {PlusOutlined} from "@ant-design/icons";

type RenameModalProps = {
  activeDataset: Dataset.Dataset | undefined;
  onOK: (did: number, newName: string, newTags: string[])=>void;
  onCancel: ()=>void;
}

const UpdateModal: React.FC<RenameModalProps> = ({activeDataset, onOK, onCancel})=> {
  const [newName, setNewName] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<InputRef>(null);
  const editInputRef = useRef<InputRef>(null);
  const [editInputIndex, setEditInputIndex] = useState(-1);
  const [editInputValue, setEditInputValue] = useState('');

  useEffect(()=>{
    if(activeDataset){
      setNewName(activeDataset.name);
      setTags(activeDataset.tags);
    }
  }, [activeDataset])

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

  return <Modal
    open={activeDataset !== undefined} centered={true} width={600}
    onCancel={()=>{
      setNewName("");
      onCancel();
    }}
    onOk={()=>{
      if(activeDataset){
        setNewName("");
        onOK(activeDataset.did, newName, tags);
      }
    }}
    title='更新信息'
  >
    <Divider style={{margin: '12px 0 0 0'}}/>
    <div style={{padding: 24, maxHeight: 440, overflow: 'auto'}}>
      <Form labelCol={{ span: 3 }} wrapperCol={{span: 21}}>
        <Form.Item label="名称" required={true}>
          <Input value={newName} onChange={(e)=>{setNewName(e.target.value)}}/>
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
      </Form>
    </div>
  </Modal>
}

export default UpdateModal;
