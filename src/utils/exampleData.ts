//下载示例数据
export const downloadCaseData = (filename: string)=>{
  // 发起请求获取example-graph.txt文件内容
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

//获取图的配置
export const getGraphCfg = (id: string) => {
  return {
    container: id,
    width: 125,
    height: 120,
    fitCenter: true,

    defaultNode: {
      type: 'circle',
    },

    defaultEdge: {
      style: {
        stroke: 'black',
        endArrow: {
          path: 'M 0,0 L 10,5 L 10,-5 Z',
          fill: 'black',
        },
      },
      labelCfg: {
        style: {
          fill: 'black',
          fontSize: 14,
          fontWeight: 600,
          background: {
            fill: '#ffffff',
            padding: [4, 2, 4, 2],
            radius: 2,
          },
        },
      },
    },
  }
}

//36个图模体的数据
export const motifData = [
  //1
  {
    nodes: [
      {
        id: '1',
        x: 0,
        y: 0,
        style: {
          fill: 'red'
        }
      },
      {
        id: '2',
        x: 100,
        y: 0,
        style: {
          fill: 'blue'
        }
      },
      {
        id: '3',
        x: 50,
        y: 70,
        style: {
          fill: 'green'
        }
      },
    ],
    edges: [
      {
        source: '2',
        target: '1',
        label: '2',
      },
      {
        source: '3',
        target: '1',
        label: '1,3',
      },
    ],
  },
  //2
  {
    nodes: [
      {
        id: '1',
        x: 0,
        y: 0,
        style: {
          fill: 'red'
        }
      },
      {
        id: '2',
        x: 100,
        y: 0,
        style: {
          fill: 'blue'
        }
      },
      {
        id: '3',
        x: 50,
        y: 70,
        style: {
          fill: 'green'
        }
      },
    ],
    edges: [
      {
        source: '2',
        target: '1',
        label: '2',
      },
      {
        source: '1',
        target: '3',
        label: '3',
        type: 'quadratic',
      },
      {
        source: '3',
        target: '1',
        label: '1',
        type: 'quadratic',
      },
    ],
  },
  //3
  {
    nodes: [
      {
        id: '1',
        x: 0,
        y: 0,
        style: {
          fill: 'red'
        }
      },
      {
        id: '2',
        x: 100,
        y: 0,
        style: {
          fill: 'blue'
        }
      },
      {
        id: '3',
        x: 50,
        y: 70,
        style: {
          fill: 'green'
        }
      },
    ],
    edges: [
      {
        source: '2',
        target: '1',
        label: '2',
      },
      {
        source: '3',
        target: '1',
        label: '1',
      },
      {
        source: '3',
        target: '2',
        label: '3',
      },
    ],
  },
  //4
  {
    nodes: [
      {
        id: '1',
        x: 0,
        y: 0,
        style: {
          fill: 'red'
        }
      },
      {
        id: '2',
        x: 100,
        y: 0,
        style: {
          fill: 'blue'
        }
      },
      {
        id: '3',
        x: 50,
        y: 70,
        style: {
          fill: 'green'
        }
      },
    ],
    edges: [
      {
        source: '2',
        target: '1',
        label: '2',
      },
      {
        source: '3',
        target: '1',
        label: '1',
      },
      {
        source: '2',
        target: '3',
        label: '3',
      },
    ],
  },

  //5
  {
    nodes: [
      {
        id: '1',
        x: 0,
        y: 0,
        style: {
          fill: 'red'
        }
      },
      {
        id: '2',
        x: 100,
        y: 0,
        style: {
          fill: 'blue'
        }
      },
      {
        id: '3',
        x: 50,
        y: 70,
        style: {
          fill: 'green'
        }
      },
    ],
    edges: [
      {
        source: '2',
        target: '1',
        label: '2',
        type: 'quadratic',
      },
      {
        source: '1',
        target: '2',
        label: '3',
        type: 'quadratic',
      },
      {
        source: '3',
        target: '1',
        label: '1',
      },
    ],
  },
  //6
  {
    nodes: [
      {
        id: '1',
        x: 0,
        y: 0,
        style: {
          fill: 'red'
        }
      },
      {
        id: '2',
        x: 100,
        y: 0,
        style: {
          fill: 'blue'
        }
      },
      {
        id: '3',
        x: 50,
        y: 70,
        style: {
          fill: 'green'
        }
      },
    ],
    edges: [
      {
        source: '2',
        target: '1',
        label: '2,3',
      },
      {
        source: '3',
        target: '1',
        label: '1',
      },
    ],
  },
  //7
  {
    nodes: [
      {
        id: '1',
        x: 0,
        y: 0,
        style: {
          fill: 'red'
        }
      },
      {
        id: '2',
        x: 100,
        y: 0,
        style: {
          fill: 'blue'
        }
      },
      {
        id: '3',
        x: 50,
        y: 70,
        style: {
          fill: 'green'
        }
      },
    ],
    edges: [
      {
        source: '1',
        target: '2',
        label: '2',
      },
      {
        source: '3',
        target: '1',
        label: '1,3',
      },
    ],
  },
  //8
  {
    nodes: [
      {
        id: '1',
        x: 0,
        y: 0,
        style: {
          fill: 'red'
        }
      },
      {
        id: '2',
        x: 100,
        y: 0,
        style: {
          fill: 'blue'
        }
      },
      {
        id: '3',
        x: 50,
        y: 70,
        style: {
          fill: 'green'
        }
      },
    ],
    edges: [
      {
        source: '1',
        target: '2',
        label: '2',
      },
      {
        source: '1',
        target: '3',
        label: '3',
        type: 'quadratic',
      },
      {
        source: '3',
        target: '1',
        label: '1',
        type: 'quadratic',
      },
    ],
  },
  //9
  {
    nodes: [
      {
        id: '1',
        x: 0,
        y: 0,
        style: {
          fill: 'red'
        }
      },
      {
        id: '2',
        x: 100,
        y: 0,
        style: {
          fill: 'blue'
        }
      },
      {
        id: '3',
        x: 50,
        y: 70,
        style: {
          fill: 'green'
        }
      },
    ],
    edges: [
      {
        source: '1',
        target: '2',
        label: '2',
      },
      {
        source: '3',
        target: '1',
        label: '1',
      },
      {
        source: '3',
        target: '2',
        label: '3',
      },
    ],
  },
  //10
  {
    nodes: [
      {
        id: '1',
        x: 0,
        y: 0,
        style: {
          fill: 'red'
        }
      },
      {
        id: '2',
        x: 100,
        y: 0,
        style: {
          fill: 'blue'
        }
      },
      {
        id: '3',
        x: 50,
        y: 70,
        style: {
          fill: 'green'
        }
      },
    ],
    edges: [
      {
        source: '1',
        target: '2',
        label: '2',
      },
      {
        source: '2',
        target: '3',
        label: '3',
      },
      {
        source: '3',
        target: '1',
        label: '1',
      },
    ],
  },
  //11
  {
    nodes: [
      {
        id: '1',
        x: 0,
        y: 0,
        style: {
          fill: 'red'
        }
      },
      {
        id: '2',
        x: 100,
        y: 0,
        style: {
          fill: 'blue'
        }
      },
      {
        id: '3',
        x: 50,
        y: 70,
        style: {
          fill: 'green'
        }
      },
    ],
    edges: [
      {
        source: '1',
        target: '2',
        label: '2,3',
      },
      {
        source: '3',
        target: '1',
        label: '1',
      },
    ],
  },
  //12
  {
    nodes: [
      {
        id: '1',
        x: 0,
        y: 0,
        style: {
          fill: 'red'
        }
      },
      {
        id: '2',
        x: 100,
        y: 0,
        style: {
          fill: 'blue'
        }
      },
      {
        id: '3',
        x: 50,
        y: 70,
        style: {
          fill: 'green'
        }
      },
    ],
    edges: [
      {
        source: '1',
        target: '2',
        label: '2',
        type: 'quadratic',
      },
      {
        source: '2',
        target: '1',
        label: '3',
        type: 'quadratic',
      },
      {
        source: '3',
        target: '1',
        label: '1',
      },
    ],
  },
  //13
  {
    nodes: [
      {
        id: '1',
        x: 0,
        y: 0,
        style: {
          fill: 'red'
        }
      },
      {
        id: '2',
        x: 100,
        y: 0,
        style: {
          fill: 'blue'
        }
      },
      {
        id: '3',
        x: 50,
        y: 70,
        style: {
          fill: 'green'
        }
      },
    ],
    edges: [
      {
        source: '2',
        target: '3',
        label: '2',
      },
      {
        source: '3',
        target: '1',
        label: '1,3',
      },
    ],
  },
  //14
  {
    nodes: [
      {
        id: '1',
        x: 0,
        y: 0,
        style: {
          fill: 'red'
        }
      },
      {
        id: '2',
        x: 100,
        y: 0,
        style: {
          fill: 'blue'
        }
      },
      {
        id: '3',
        x: 50,
        y: 70,
        style: {
          fill: 'green'
        }
      },
    ],
    edges: [
      {
        source: '2',
        target: '3',
        label: '2',
      },
      {
        source: '1',
        target: '3',
        label: '3',
        type: 'quadratic',
      },
      {
        source: '3',
        target: '1',
        label: '1',
        type: 'quadratic',
      },
    ],
  },
  //15
  {
    nodes: [
      {
        id: '1',
        x: 0,
        y: 0,
        style: {
          fill: 'red'
        }
      },
      {
        id: '2',
        x: 100,
        y: 0,
        style: {
          fill: 'blue'
        }
      },
      {
        id: '3',
        x: 50,
        y: 70,
        style: {
          fill: 'green'
        }
      },
    ],
    edges: [
      {
        source: '2',
        target: '3',
        label: '2',
        type: 'quadratic',
      },
      {
        source: '3',
        target: '2',
        label: '3',
        type: 'quadratic',
      },
      {
        source: '3',
        target: '1',
        label: '1',
      },
    ],
  },
  //16
  {
    nodes: [
      {
        id: '1',
        x: 0,
        y: 0,
        style: {
          fill: 'red'
        }
      },
      {
        id: '2',
        x: 100,
        y: 0,
        style: {
          fill: 'blue'
        }
      },
      {
        id: '3',
        x: 50,
        y: 70,
        style: {
          fill: 'green'
        }
      },
    ],
    edges: [
      {
        source: '2',
        target: '3',
        label: '2,3',
      },
      {
        source: '3',
        target: '1',
        label: '1',
      },
    ],
  },
  //17
  {
    nodes: [
      {
        id: '1',
        x: 0,
        y: 0,
        style: {
          fill: 'red'
        }
      },
      {
        id: '2',
        x: 100,
        y: 0,
        style: {
          fill: 'blue'
        }
      },
      {
        id: '3',
        x: 50,
        y: 70,
        style: {
          fill: 'green'
        }
      },
    ],
    edges: [
      {
        source: '1',
        target: '2',
        label: '3',
      },
      {
        source: '2',
        target: '3',
        label: '2',
      },
      {
        source: '3',
        target: '1',
        label: '1',
      },
    ],
  },
  //18
  {
    nodes: [
      {
        id: '1',
        x: 0,
        y: 0,
        style: {
          fill: 'red'
        }
      },
      {
        id: '2',
        x: 100,
        y: 0,
        style: {
          fill: 'blue'
        }
      },
      {
        id: '3',
        x: 50,
        y: 70,
        style: {
          fill: 'green'
        }
      },
    ],
    edges: [
      {
        source: '2',
        target: '1',
        label: '3',
      },
      {
        source: '2',
        target: '3',
        label: '2',
      },
      {
        source: '3',
        target: '1',
        label: '1',
      },
    ],
  },
  //19
  {
    nodes: [
      {
        id: '1',
        x: 0,
        y: 0,
        style: {
          fill: 'red'
        }
      },
      {
        id: '2',
        x: 100,
        y: 0,
        style: {
          fill: 'blue'
        }
      },
      {
        id: '3',
        x: 50,
        y: 70,
        style: {
          fill: 'green'
        }
      },
    ],
    edges: [
      {
        source: '3',
        target: '2',
        label: '2',
      },
      {
        source: '3',
        target: '1',
        label: '1,3',
      },
    ],
  },
  //20
  {
    nodes: [
      {
        id: '1',
        x: 0,
        y: 0,
        style: {
          fill: 'red'
        }
      },
      {
        id: '2',
        x: 100,
        y: 0,
        style: {
          fill: 'blue'
        }
      },
      {
        id: '3',
        x: 50,
        y: 70,
        style: {
          fill: 'green'
        }
      },
    ],
    edges: [
      {
        source: '3',
        target: '2',
        label: '2',
      },
      {
        source: '1',
        target: '3',
        label: '3',
        type: 'quadratic',
      },
      {
        source: '3',
        target: '1',
        label: '1',
        type: 'quadratic',
      },
    ],
  },
  //21
  {
    nodes: [
      {
        id: '1',
        x: 0,
        y: 0,
        style: {
          fill: 'red'
        }
      },
      {
        id: '2',
        x: 100,
        y: 0,
        style: {
          fill: 'blue'
        }
      },
      {
        id: '3',
        x: 50,
        y: 70,
        style: {
          fill: 'green'
        }
      },
    ],
    edges: [
      {
        source: '3',
        target: '1',
        label: '1',
      },
      {
        source: '3',
        target: '2',
        label: '2,3',
      },
    ],
  },

  //22
  {
    nodes: [
      {
        id: '1',
        x: 0,
        y: 0,
        style: {
          fill: 'red'
        }
      },
      {
        id: '2',
        x: 100,
        y: 0,
        style: {
          fill: 'blue'
        }
      },
      {
        id: '3',
        x: 50,
        y: 70,
        style: {
          fill: 'green'
        }
      },
    ],
    edges: [
      {
        source: '2',
        target: '3',
        label: '3',
        type: 'quadratic',
      },
      {
        source: '3',
        target: '2',
        label: '2',
        type: 'quadratic',
      },
      {
        source: '3',
        target: '1',
        label: '1',
      },
    ],
  },
  //23
  {
    nodes: [
      {
        id: '1',
        x: 0,
        y: 0,
        style: {
          fill: 'red'
        }
      },
      {
        id: '2',
        x: 100,
        y: 0,
        style: {
          fill: 'blue'
        }
      },
      {
        id: '3',
        x: 50,
        y: 70,
        style: {
          fill: 'green'
        }
      },
    ],
    edges: [
      {
        source: '1',
        target: '2',
        label: '3',
      },
      {
        source: '3',
        target: '2',
        label: '2',
      },
      {
        source: '3',
        target: '1',
        label: '1',
      },
    ],
  },

  //24
  {
    nodes: [
      {
        id: '1',
        x: 0,
        y: 0,
        style: {
          fill: 'red'
        }
      },
      {
        id: '2',
        x: 100,
        y: 0,
        style: {
          fill: 'blue'
        }
      },
      {
        id: '3',
        x: 50,
        y: 70,
        style: {
          fill: 'green'
        }
      },
    ],
    edges: [
      {
        source: '2',
        target: '1',
        label: '3',
      },
      {
        source: '1',
        target: '3',
        label: '1',
      },
      {
        source: '3',
        target: '2',
        label: '2',
      },
    ],
  },

  //25
  {
    nodes: [
      {
        id: '1',
        x: 0,
        y: 0,
        style: {
          fill: 'red'
        }
      },
      {
        id: '3',
        x: 50,
        y: 70,
        style: {
          fill: 'green'
        }
      },
    ],
    edges: [
      {
        source: '3',
        target: '1',
        label: '1,3',
        type: 'quadratic',
      },
      {
        source: '1',
        target: '3',
        label: '2',
        type: 'quadratic',
      },
    ],
  },
  //26
  {
    nodes: [
      {
        id: '1',
        x: 0,
        y: 0,
        style: {
          fill: 'red'
        }
      },
      {
        id: '3',
        x: 50,
        y: 70,
        style: {
          fill: 'green'
        }
      },
    ],
    edges: [
      {
        source: '1',
        target: '3',
        label: '2,3',
        type: 'quadratic',
      },
      {
        source: '3',
        target: '1',
        label: '1',
        type: 'quadratic',
      },
    ],
  },
  //27
  {
    nodes: [
      {
        id: '1',
        x: 0,
        y: 0,
        style: {
          fill: 'red'
        }
      },
      {
        id: '2',
        x: 100,
        y: 0,
        style: {
          fill: 'blue'
        }
      },
      {
        id: '3',
        x: 50,
        y: 70,
        style: {
          fill: 'green'
        }
      },
    ],
    edges: [
      {
        source: '1',
        target: '3',
        label: '2',
        type: 'quadratic',
      },
      {
        source: '3',
        target: '1',
        label: '1',
        type: 'quadratic',
      },
      {
        source: '3',
        target: '2',
        label: '3',
      },
    ],
  },
  //28
  {
    nodes: [
      {
        id: '1',
        x: 0,
        y: 0,
        style: {
          fill: 'red'
        }
      },
      {
        id: '2',
        x: 100,
        y: 0,
        style: {
          fill: 'blue'
        }
      },
      {
        id: '3',
        x: 50,
        y: 70,
        style: {
          fill: 'green'
        }
      },
    ],
    edges: [
      {
        source: '2',
        target: '3',
        label: '3',
      },
      {
        source: '1',
        target: '3',
        label: '2',
        type: 'quadratic',
      },
      {
        source: '3',
        target: '1',
        label: '1',
        type: 'quadratic',
      },
    ],
  },
  //29
  {
    nodes: [
      {
        id: '1',
        x: 0,
        y: 0,
        style: {
          fill: 'red'
        }
      },
      {
        id: '2',
        x: 100,
        y: 0,
        style: {
          fill: 'blue'
        }
      },
      {
        id: '3',
        x: 50,
        y: 70,
        style: {
          fill: 'green'
        }
      },
    ],
    edges: [
      {
        source: '1',
        target: '3',
        label: '2',
        type: 'quadratic',
      },
      {
        source: '3',
        target: '1',
        label: '1',
        type: 'quadratic',
      },
      {
        source: '1',
        target: '2',
        label: '3',
      },
    ],
  },
  //30
  {
    nodes: [
      {
        id: '1',
        x: 0,
        y: 0,
        style: {
          fill: 'red'
        }
      },
      {
        id: '2',
        x: 100,
        y: 0,
        style: {
          fill: 'blue'
        }
      },
      {
        id: '3',
        x: 50,
        y: 70,
        style: {
          fill: 'green'
        }
      },
    ],
    edges: [
      {
        source: '2',
        target: '1',
        label: '3',
      },
      {
        source: '1',
        target: '3',
        label: '2',
        type: 'quadratic',
      },
      {
        source: '3',
        target: '1',
        label: '1',
        type: 'quadratic',
      },
    ],
  },
  //31
  {
    nodes: [
      {
        id: '1',
        x: 0,
        y: 0,
        style: {
          fill: 'red'
        }
      },
      {
        id: '3',
        x: 50,
        y: 70,
        style: {
          fill: 'green'
        }
      },
    ],
    edges: [
      {
        source: '3',
        target: '1',
        label: '1,2,3',
      },
    ],
  },
  //32
  {
    nodes: [
      {
        id: '1',
        x: 0,
        y: 0,
        style: {
          fill: 'red'
        }
      },
      {
        id: '3',
        x: 50,
        y: 70,
        style: {
          fill: 'green'
        }
      },
    ],
    edges: [
      {
        source: '1',
        target: '3',
        label: '3',
        type: 'quadratic',
      },
      {
        source: '3',
        target: '1',
        label: '1,2',
        type: 'quadratic',
      },
    ],
  },
  //33
  {
    nodes: [
      {
        id: '1',
        x: 0,
        y: 0,
        style: {
          fill: 'red'
        }
      },
      {
        id: '2',
        x: 100,
        y: 0,
        style: {
          fill: 'blue'
        }
      },
      {
        id: '3',
        x: 50,
        y: 70,
        style: {
          fill: 'green'
        }
      },
    ],
    edges: [
      {
        source: '3',
        target: '1',
        label: '1,2',
      },
      {
        source: '3',
        target: '2',
        label: '3',
      },
    ],
  },
  //34
  {
    nodes: [
      {
        id: '1',
        x: 0,
        y: 0,
        style: {
          fill: 'red'
        }
      },
      {
        id: '2',
        x: 100,
        y: 0,
        style: {
          fill: 'blue'
        }
      },
      {
        id: '3',
        x: 50,
        y: 70,
        style: {
          fill: 'green'
        }
      },
    ],
    edges: [
      {
        source: '3',
        target: '1',
        label: '1,2',
      },
      {
        source: '2',
        target: '3',
        label: '3',
      },
    ],
  },
  //35
  {
    nodes: [
      {
        id: '1',
        x: 0,
        y: 0,
        style: {
          fill: 'red'
        }
      },
      {
        id: '2',
        x: 100,
        y: 0,
        style: {
          fill: 'blue'
        }
      },
      {
        id: '3',
        x: 50,
        y: 70,
        style: {
          fill: 'green'
        }
      },
    ],
    edges: [
      {
        source: '1',
        target: '2',
        label: '3',
      },
      {
        source: '3',
        target: '1',
        label: '1,2',
      },
    ],
  },
  //36
  {
    nodes: [
      {
        id: '1',
        x: 0,
        y: 0,
        style: {
          fill: 'red'
        }
      },
      {
        id: '2',
        x: 100,
        y: 0,
        style: {
          fill: 'blue'
        }
      },
      {
        id: '3',
        x: 50,
        y: 70,
        style: {
          fill: 'green'
        }
      },
    ],
    edges: [
      {
        source: '2',
        target: '1',
        label: '3',
      },
      {
        source: '3',
        target: '1',
        label: '1,2',
      },
    ],
  },
];
