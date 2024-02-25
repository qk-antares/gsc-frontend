import {Card, List, Skeleton} from "antd";
import React from "react";
import {DotChartOutlined} from "@ant-design/icons";

type GraphsLoadingSkeletonProps = {
  column: number;
  row: number;
}

const GraphsLoadingSkeleton: React.FC<GraphsLoadingSkeletonProps> = ({column, row})=> {
  return <List
    grid={{ gutter: 16, column}}
    dataSource={Array.from({length: column * row}, (_, index)=> index)}
    renderItem={() => (
      <List.Item>
        <Card bodyStyle={{padding: 0}}>
          <Skeleton.Node style={{borderRadius: 8, width: '100%', height: 220}} active>
            <DotChartOutlined style={{ fontSize: 80, color: '#bfbfbf' }} />
          </Skeleton.Node>
        </Card>
      </List.Item>
    )}
  />
}

export default GraphsLoadingSkeleton;
