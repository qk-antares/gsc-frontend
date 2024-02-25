//下载示例数据
export const downloadCaseData = (filename: string)=>{
  fetch(`data/${filename}`).then((response) => {
    response.blob().then((data) => {
      // 创建Blob对象并触发下载
      const blob = new Blob([data], {type: 'text/plain'});
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    });
  })
}

//下载数据集中的某个数据
export const downloadGraphData = (graphData: Graph.GraphData, name: string) => {
  const json = JSON.stringify(graphData);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  // 设置下载文件名
  a.download = `${name}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
