//图编辑器组件
import {
  CanvasContextMenu,
  CanvasNodePortTooltip,
  CanvasScaleToolbar,
  CanvasToolbar,
  FlowchartCanvas,
  FlowchartExtension,
  FlowchartFormPanel,
  FlowchartNodePanel,
  KeyBindings,
  XFlow,
} from '@antv/xflow';
import '@antv/xflow/dist/index.css';
import React, {useEffect, useState} from 'react';
import './index.less';
import {useToolbarConfig} from './config/toolbar-config';
import {Divider, Form, Input, message, Modal, Select} from "antd";
import {useMenuConfig} from "@/pages/Dataset/GraphEditor/config/menu-config";
import {useCmdConfig} from "@/pages/Dataset/GraphEditor/config/cmd-config";
import {useKeybindingConfig} from "@/pages/Dataset/GraphEditor/config/keybinding-config";
import {DndNode} from "@/pages/Dataset/GraphEditor/Node/DndNode";
import {listAllDataset} from "@/services/Dataset/api";
import {addEditorGraphToDataset} from "@/services/Graph/api";

const GraphEditor: React.FC = () => {
  const toolbarConfig = useToolbarConfig();
  const menuConfig = useMenuConfig();
  const commandConfig = useCmdConfig();
  const keybindingConfig = useKeybindingConfig();
  const [visible, setVisible] = useState(false);
  const [graphData, setGraphData] = useState<Graph.GraphData>()
  const [form] = Form.useForm();
  const [datasets, setDatasets] = useState<Dataset.Dataset[]>();

  useEffect(() => {
    if(visible && !datasets){
      listAllDataset().then(res => {
        setDatasets(res.data);
      })
    }
  }, [visible, datasets]);


  const handleOk = () => {
    if(graphData){
      form.validateFields().then(() => {
        addEditorGraphToDataset({
          name: form.getFieldValue('name'),
          graphData,
          did: Number(form.getFieldValue('dataset'))
        }).then(res => {
          if(res.code === 200){
            message.success('创建成功！');
            setVisible(false);
          }
        })
      }).catch(err => {
        console.log(err)
      })
    } else {
      message.error("数据为空！");
    }
  };

  return (
    <div className="container">
      {/*@ts-ignore*/}
      <XFlow meta={{
        flowId: 'edit',
        setVisible,
        setGraphData
      }} commandConfig={commandConfig} className="xflow-workspace">
        <FlowchartExtension/>

        {/*节点面板*/}
        <FlowchartNodePanel
          showOfficial={false}
          showHeader={false}
          defaultActiveKey={['node']}
          registerNode={{
            title: '基本节点',
            key: 'node',
            nodes: [
              {
                component: DndNode,
                popover: () => <div>基本节点</div>,
                name: 'custom-node-indicator',
                width: 36,
                height: 36,
                label: '',
              },
            ],
          }}
          position={{ width: 162, top: 40, bottom: 0, left: 0 }}
        />

        {/*顶部工具栏，只有一个保存按钮*/}
        <CanvasToolbar
          className="xflow-workspace-toolbar-top"
          layout="horizontal"
          config={toolbarConfig}
          position={{ top: 0, left: 0, right: 0, bottom: 0 }}
        />

        {/*@ts-ignore*/}
        <FlowchartCanvas
          config={{connecting: {multi: false, router: 'normal'}}}
          position={{ top: 40, left: 0, right: 0, bottom: 0 }}
        >
          {/*顶部的缩放工具栏*/}
          <CanvasScaleToolbar
            layout="horizontal"
            position={{ top: -40, right: 0 }}
            style={{
              width: 150,
              left: 'auto',
              height: 39,
            }}
          />

          {/*对元素鼠标右键的面板*/}
          <CanvasContextMenu config={menuConfig} />

          <CanvasNodePortTooltip />
        </FlowchartCanvas>

        {/*右边的配置面板*/}
        <FlowchartFormPanel show={true} position={{ width: 200, top: 40, bottom: 0, right: 0 }} />

        {/*绑定快捷键*/}
        <KeyBindings config={keybindingConfig} />
      </XFlow>

      <Modal
        open={visible} centered={true}
        onCancel={()=>setVisible(false)}
        onOk={handleOk}
        title='保存到数据集'
      >
        <Divider style={{margin: '12px 0'}}/>
        <div style={{padding: '0 24px'}}>
          <Form form={form} labelCol={{span: 4}} wrapperCol={{ span: 20 }}>
            <Form.Item label="名称" name="name" rules={[{ required: true, message: '请输入图的名称' }]}>
              <Input/>
            </Form.Item>
            <Form.Item label="数据集" name="dataset" rules={[{ required: true, message: '请选择要保存到的数据集' }]}>
              <Select
                style={{ width: 240 }}
                options={datasets ? datasets.map(dataset =>
                  ({ value: dataset.did, label: dataset.name })) : []}
              />
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </div>
  );
};

export default GraphEditor;
