//检索任务记录组件
import React, {useEffect, useState} from "react";
import {useLocation, useNavigate} from "@@/exports";
import LogDetail from "@/pages/Retrieval/Log/LogDetail/LogDetail";
import LogTable from "@/pages/Retrieval/Log/LogTable/LogTable";
import PathsResult from "@/pages/Retrieval/Log/LogDetail/PathsResult/PathsResult";

const Log: React.FC = ()=> {
    const navigate = useNavigate();
    const location = useLocation();
    const urlSearchParams = new URLSearchParams(location.search);
    const [targetRid, setTargetRid] = useState<number>(()=>{
        return Number(urlSearchParams.get('rid'));
    })
    const [targetGid, setTargetGid] = useState<number>(()=>{
      return Number(urlSearchParams.get('gid'));
    })

    //监听路径参数变化
    useEffect(() => {
        setTargetRid(Number(urlSearchParams.get('rid')));
        setTargetGid(Number(urlSearchParams.get('gid')))
    }, [location.search]);

  return <div style={{margin: 4}}>
    {
      targetRid ?
        targetGid ?
            <PathsResult rid={targetRid} gid={targetGid}/> :
            <LogDetail targetRid={targetRid}/> :
        <LogTable
          onInspect={(targetRid) => {
            //将搜索参数拼接到query上
            const params = new URLSearchParams({
              tab: 'log',
              rid: targetRid.toString(),
            });
            navigate({
              search: `?${params.toString()}`,
            });
          }}
        />
    }
  </div>
}

export default Log;
