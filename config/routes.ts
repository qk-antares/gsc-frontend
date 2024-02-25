export default [
  { path: '/dataset', name: '数据集', component: './Dataset/Dataset' },
  { path: '/retrieval', name: '相似图检索', component: './Retrieval/Retrieval'},
  { path: '/', redirect: '/dataset' },
  { path: '*', layout: false, component: './404' },
];
