//数据集表格
import React, {useEffect, useState} from "react";
import {ProColumns} from "@ant-design/pro-table";
import {Button, Col, message, Popconfirm, Row, Select, Space, Tag, Tooltip} from "antd";
import {IconFont} from "@/utils/iconUtil";
import {ProTable} from "@ant-design/pro-components";
import {getDatasetTags, listDatasetVoByPage, updateDatasetName} from "@/services/Dataset/api";
import {useLocation, useNavigate} from "@@/exports";
import {CheckOutlined, PlusOutlined, TagsOutlined} from "@ant-design/icons";
import Search from "antd/es/input/Search";
import CreateDatasetModal from "@/pages/Dataset/ListDataset/DatasetTable/CreateDatasetModal/CreateDatasetModal";
import UpdateModal from "@/pages/Dataset/ListDataset/DatasetTable/UpdateModal/UpdateModal";

const DatasetTable: React.FC = ()=> {
  const navigate = useNavigate();
  const location = useLocation();
  const urlSearchParams = new URLSearchParams(location.search);

  //所有标签
  const [tags, setTags] = useState<string[]>([]);
  //显示新建modal
  const [createOpen, setCreateOpen] = useState<boolean>(false);

  //当前的页号
  const [current, setCurrent] = useState(()=> {
    return Number(urlSearchParams.get('current')) || 1;
  });
  //选中的标签
  const [selectedTags, setSelectedTags] = useState<string[]>(()=>{
    return urlSearchParams.getAll('tags') || [];
  });
  //搜索关键词
  const [keyword, setKeyword] = useState<string>(()=>{
    return urlSearchParams.get('keyword') || ''
  })

  //表格加载
  const [loading, setLoading] = useState<boolean>(true);
  //总记录数
  const [total, setTotal] = useState(0);
  //当前要更新的dataset
  const [activeDateset, setActiveDateset] = useState<Dataset.Dataset | undefined>(undefined);
  //要分页展示的数据
  const [datasets, setDatasets] = useState<Dataset.Dataset[]>([]);

  const reloadData = ()=>{
    setLoading(true);
    //初始化获取标签信息
    getDatasetTags().then(res => {
      if(res.code === 200){
        setTags(res.data)
      }
    })
    listDatasetVoByPage({
      current,
      keyword: keyword,
      tags: selectedTags
    }).then(res => {
      if(res.code === 200){
        setDatasets(res.data.records);
        setTotal(res.data.total)
        setLoading(false);
      }
    })
  }

  //监听路径参数变化
  useEffect(() => {
    if(!Number(urlSearchParams.get('did'))){
      reloadData()
    }
  }, [location.search]);

  const onInspect = (did: number) => {
    const params = new URLSearchParams({
      did: did.toString(),
    });
    navigate({
      search: `?${params.toString()}`,
    });
  }

  const columns: ProColumns<Dataset.Dataset>[] = [
    {
      title: '数据集名称',
      width: '15%',
      align: 'center',
      render: (_, entity) => {
        return <Tag color="#108ee9">{entity.name}</Tag>;
      },
    },
    {
      align: 'center',
      width: '10%',
      title: '子图数量',
      render: (_, entity) => {
        return entity.count || 0
      },
    },
    {
      align: 'center',
      width: '10%',
      title: '节点类型数',
      render: (_, entity) => {
        return entity.labels.length
      },
    },
    {
      title: '标签',
      align: 'center',
      ellipsis: true,
      width: '25%',
      render: (_, entity) => (
        <Space>
          {entity.tags.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </Space>
      ),
    },
    {
      align: 'center',
      width: '10%',
      title: '最大边数',
      render: (_, entity) => {
        return entity.maxEdgeNum || 0
      },
    },
    {
      align: 'center',
      width: '10%',
      title: '最大节点数',
      render: (_, entity) => {
        return entity.maxNodeNum || 0
      },
    },
    {
      align: 'center',
      title: '操作',
      render: (dom, entity) =>
        <>
          <Tooltip placement="top" title="查看图数据" color="blue">
            <Button onClick={()=>onInspect(entity.did)} type="text" icon={<IconFont type="icon-shujufenxi" />}/>
          </Tooltip>
          <Button onClick={() => setActiveDateset(entity)} type="text" icon={<IconFont type="icon-shezhixitongshezhigongnengshezhishuxing-xian" />}/>
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

  const updateDataset = (did: number, newName: string, newTags: string[]) => {
    updateDatasetName({
      did,
      name: newName,
      tags: newTags
    }).then(res => {
      if(res.code === 200){
        setDatasets(datasets.map(dataset => {
          if(dataset.did !== did) {
            return dataset;
          } else {
            return {...dataset, name: newName, tags: newTags};
          }
        }))

        message.success('修改成功！');
        setActiveDateset(undefined);
      }
    })
  }

  //有关搜索参数
  const updateQueryParam = (current: number, keyword: string, selectedTags: string[]) => {
    const params = new URLSearchParams({
      current: current.toString(),
      keyword: keyword,
    });
    selectedTags.forEach(tag => params.append('tags', tag));
    //将搜索参数拼接到query上
    navigate({
      search: `?${params.toString()}`
    })
  }
  const changePage = (page: number) => {
    setCurrent(page);
    updateQueryParam(page, keyword, selectedTags);
  }
  const onSearch = (value: string) => {
    setKeyword(value);
    setCurrent(1);
    updateQueryParam(1, value, selectedTags);
  }
  const handleTagClose = (removeTag: string) => {
    const update = selectedTags.filter(tag => tag !== removeTag);
    setSelectedTags(update);
    setCurrent(1);
    updateQueryParam(1, keyword, update);
  }
  const addTagToParam = (addTag: string) => {
    const update = [...selectedTags, addTag];
    setSelectedTags(update);
    setCurrent(1);
    updateQueryParam(1, keyword, update);
  }

  return <div style={{height: 'calc(100vh - 88px)', overflow: 'auto'}}>
    <div style={{margin: '20px 10px 20px 20px'}}>
      <Row style={{paddingBottom: '16px'}}>
        <Col span={10} style={{paddingLeft: 4}}>
          <Row justify="space-around" align="middle">
            <Col flex='66px'>
              <div style={{fontSize: 14}}>
                <TagsOutlined/>
                <span style={{marginLeft: 8}}>标签：</span>
              </div>
            </Col>
            <Col flex='auto'>
              <Select
                mode="multiple"
                showSearch={false}
                value={selectedTags}
                style={{width: '90%'}}
                dropdownStyle={{padding: 12}}
                tagRender={(tag)=>{
                  return (
                    <Tag closable={true} onClose={()=>{handleTagClose(tag.value)}} style={{ marginRight: 3 }}>
                      {tag.value}
                    </Tag>
                  )
                }}
                dropdownRender={()=>
                  <div>
                    {tags.map(option => selectedTags?.includes(option) ?
                      <Tag onClick={()=>handleTagClose(option)} style={{cursor: 'pointer'}} color='#f50' key={option}>{option}<CheckOutlined/></Tag> :
                      <Tag onClick={()=>addTagToParam(option)} style={{cursor: 'pointer'}} key={option}>{option}</Tag>
                    )}
                  </div>
                }
              />
            </Col>
          </Row>
        </Col>

        <Col span={6}>
          <Search placeholder="输入搜索关键词" allowClear onSearch={onSearch}/>
        </Col>

        <Col flex='auto'>
          <div style={{float: 'right', marginRight: 4}}>
            <Button onClick={()=>setCreateOpen(true)} icon={<PlusOutlined/>} type='primary'>新建</Button>
          </div>
        </Col>
      </Row>

      <Row>
        <ProTable<Dataset.Dataset, Common.PageParams>
          loading={loading}
          columns={columns}
          dataSource={datasets}
          pagination={{
            total,
            current,
            pageSize: 10,
            onChange: changePage
          }}
          options={false}
          search={false}
          rowKey="did"
        />
      </Row>

    </div>

    <CreateDatasetModal open={createOpen} setOpen={setCreateOpen} afterCreate={reloadData}/>

    <UpdateModal activeDataset={activeDateset} onOK={updateDataset} onCancel={()=>setActiveDateset(undefined)}/>
  </div>


}
export default DatasetTable;
