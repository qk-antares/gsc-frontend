//图编辑器中的基础节点
import './index.less';

export const DndNode = (props: any) => {
  return (
    <div className="react-node">
      <span>{props.data.label}</span>
    </div>
  );
};
