//数据集表格
import React, {useEffect, useState} from "react";
import {useLocation} from "@@/exports";
import DatasetTable from "@/pages/Dataset/ListDataset/DatasetTable/DatasetTable";
import DatasetDetail from "@/pages/Dataset/ListDataset/DatasetDetail/DatasetDetail";

const ListDataset: React.FC = ()=> {
  const location = useLocation();
  const urlSearchParams = new URLSearchParams(location.search);
  const [targetDid, setTargetDid] = useState<number>(()=>{
    return Number(urlSearchParams.get('did'));
  })

  //监听路径参数变化
  useEffect(() => {
    setTargetDid(Number(urlSearchParams.get('did')));
  }, [location.search]);

  return (
    <div style={{margin: 4}}>
      {
        targetDid ?
          <DatasetDetail targetDid={targetDid}/> :
          <DatasetTable/>
      }
    </div>
  );


}
export default ListDataset;
