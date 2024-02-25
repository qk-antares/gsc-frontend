//任务记录表格
import React, {useEffect, useState} from "react";
import {ProColumns} from "@ant-design/pro-table";
import {Button, Popconfirm, Tag, Tooltip} from "antd";
import {IconFont} from "@/utils/iconUtil";
import {ProTable} from "@ant-design/pro-components";
import moment from "moment";
import {useLocation, useNavigate} from "@@/exports";
import {listRetrievalVoByPage} from "@/services/Retrieval/api";

type DatasetTableProps = {
  onInspect: (targetLogId: number) => void;
}

const LogTable: React.FC<DatasetTableProps> = ({onInspect})=> {
  const navigate = useNavigate();
  const location = useLocation();
  const urlSearchParams = new URLSearchParams(location.search);

  const [current, setCurrent] = useState(()=> {
    return Number(urlSearchParams.get('current')) || 1;
  });
  const [total, setTotal] = useState(0);
  const [retrievals, setRetrievals] = useState<Retrieval.Retrieval[]>([]);

  useEffect(() => {
    listRetrievalVoByPage({current, pageSize: 10}).then(res => {
      setRetrievals(res.data.records);
      setTotal(res.data.total);
    })
  }, [current]);

  const columns: ProColumns<Retrieval.Retrieval>[] = [
    {
      title: '检索ID',
      align: 'center',
      render: (_, entity) => {
        return <Tag color="#108ee9">{entity.rid}</Tag>;
      },
    },
    {
      align: 'center',
      title: '检索数据集',
      render: (_, entity) => {
        return entity.dataset.name
      },
    },
    {
      align: 'center',
      title: '算法',
      render: (_, entity) => {
        return entity.algorithm
      },
    },
    {
      align: 'center',
      title: '子图数量',
      render: (_, entity) => {
        return entity.dataset.count || '-'
      },
    },
    {
      title: '状态',
      align: 'center',
      render: (_, entity) => {
        return <Tag color="#108ee9">{entity.status}</Tag>;
      },
    },
    {
      align: 'center',
      title: '创建时间',
      render: (_, entity) => {
        return moment(new Date(entity.createTime).toISOString()).format('YYYY-MM-DD HH:mm')
      },
    },
    {
      align: 'center',
      title: '完成时间',
      render: (_, entity) => {
        if(entity.finishTime){
          return moment(new Date(entity.finishTime).toISOString()).format('YYYY-MM-DD HH:mm')
        } else {
          return '-';
        }
      },
    },
    {
      align: 'center',
      title: '耗时',
      render: (_, entity) => {
        return `${entity.timeCost || 0} ms`
      },
    },
    {
      align: 'center',
      title: '操作',
      render: (_, entity) =>
        <>
          <Tooltip placement="top" title="查看结果" color="blue">
            <Button onClick={()=>onInspect(entity.rid)} type="text" icon={<IconFont type="icon-shujufenxi" />}/>
          </Tooltip>
          <Button onClick={() => {}} type="text" icon={<IconFont type="icon-xiazaidaoru" />}/>
          <Popconfirm
            title="删除数据集"
            description="确定要删除该数据集？此操作不可撤销"
            onConfirm={()=>{}}
            okText="是"
            cancelText="否"
          >
            <Button type="text" icon={<IconFont type="icon-trash" />}/>
          </Popconfirm>
        </>
    },
  ];

  return <div style={{height: 'calc(100vh - 128px)', overflow: 'auto'}}>
    <ProTable<Retrieval.Retrieval, Common.PageParams>
      style={{margin: 20}}
      columns={columns}
      dataSource={retrievals}
      pagination={{
        current: Number(urlSearchParams.get('current')) || 1,
        onChange: (current) => {
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          })
          setCurrent(current);
          navigate({
            search: `?${new URLSearchParams({current: current.toString()}).toString()}`
          })
        },
        showSizeChanger: false,
        showQuickJumper: true,
        pageSize: 10,
        total
      }}
      options={false}
      search={false}
      rowKey="rid"
    />
  </div>


}
export default LogTable;
