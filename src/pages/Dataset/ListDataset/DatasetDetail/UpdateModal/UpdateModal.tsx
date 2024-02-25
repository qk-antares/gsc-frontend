import {Divider, Form, Input, Modal} from "antd";
import React, {useState} from "react";

type UpdateModalProps = {
  activeGraph: Graph.Graph | undefined;
  onOK: (id: number, newName: string)=>void;
  onCancel: ()=>void;
}

const UpdateModal: React.FC<UpdateModalProps> = ({activeGraph, onOK, onCancel})=> {
  const [newName, setNewName] = useState<string>('');

  return <Modal
    open={activeGraph !== undefined} centered={true}
    onCancel={()=>{
      setNewName("");
      onCancel();
    }}
    onOk={()=>{
      if(activeGraph){
        setNewName("");
        onOK(activeGraph?.gid, newName);
      }
    }}
    title='设置名称'
  >
    <Divider style={{margin: '12px 0'}}/>
    <div style={{padding: '0 24px'}}>
      <Form>
        <Form.Item label="名称" required={true}>
          <Input value={newName} onChange={(e)=>{setNewName(e.target.value)}}/>
        </Form.Item>
      </Form>
    </div>
   </Modal>
}

export default UpdateModal;
