export default [
  { path: '/home', name: '首页', component: './Home/Home' },
  { path: '/compute', name: '相似度计算', component: './Compute/Compute'},
  { path: '/search', name: '相似图检索', component: './Search/Search'},
  { path: '/dataset', name: '数据集', component: './Dataset/Dataset' },
  { path: '/', redirect: '/dataset' },
  { path: '*', layout: false, component: './404' },
];
