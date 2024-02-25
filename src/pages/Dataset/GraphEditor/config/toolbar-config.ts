//图编辑器工具栏配置
import {SaveOutlined} from '@ant-design/icons';
import {
  createToolbarConfig,
  IconStore,
  IModelService,
  IToolbarItemOptions,
  MODELS,
  NsGraphCmd,
  XFlowGraphCommands,
} from '@antv/xflow';
import {IGraphDataToPlain} from "@/utils/dataConverter";

const SAVE_GRAPH_DATA = XFlowGraphCommands.SAVE_GRAPH_DATA.id;

//自定义工具栏
// eslint-disable-next-line @typescript-eslint/no-namespace
namespace NSToolbarConfig {
  export const getDependencies = async (modelService: IModelService) => {
    return [
      await MODELS.SELECTED_NODES.getModel(modelService),
      await MODELS.GRAPH_ENABLE_MULTI_SELECT.getModel(modelService),
    ];
  };

  export const getToolbarItems = async () => {
    const toolbarGroup: IToolbarItemOptions[] = [];

    /** 保存数据 */
    toolbarGroup.push({
      tooltip: '保存',
      iconName: 'SaveOutlined',
      id: SAVE_GRAPH_DATA,
      onClick: async ({ commandService }) => {
        await commandService.executeCommand<NsGraphCmd.SaveGraphData.IArgs>(SAVE_GRAPH_DATA, {
          saveGraphDataService: async (meta, graphData) => {
            const jsonConvert = IGraphDataToPlain(graphData)
            if(jsonConvert){
              meta.setVisible(true)
              meta.setGraphData(jsonConvert)
            }
          },
        });
      },
    });

    return [
      {
        name: 'toolbar',
        items: toolbarGroup,
      },
    ];
  };
}

export const useToolbarConfig = createToolbarConfig((toolbarConfig) => {
  //注册Icon
  IconStore.set('SaveOutlined', SaveOutlined);

  /** 生产 toolbar item */
  toolbarConfig.setToolbarModelService(async (toolbarModel, modelService, toDispose) => {
    const updateToolbarModel = async () => {
      const toolbarItems = await NSToolbarConfig.getToolbarItems();

      toolbarModel.setValue((toolbar) => {
        toolbar.mainGroups = toolbarItems;
      });
    };
    const models = await NSToolbarConfig.getDependencies(modelService);
    const subscriptions = models.map((model) => {
      return model.watch(async () => {
        await updateToolbarModel();
      });
    });
    toDispose.pushAll(subscriptions);
  });
});
