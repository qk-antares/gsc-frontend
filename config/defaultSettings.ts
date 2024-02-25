import { ProLayoutProps } from '@ant-design/pro-components';

const Settings: ProLayoutProps & {
  pwa?: boolean;
  logo?: string;
} = {
  navTheme: 'light',
  // 拂晓蓝
  colorPrimary: '#1890ff',
  layout: "top",
  contentWidth: 'Fluid',
  fixedHeader: true,
  fixSiderbar: true,
  colorWeak: false,
  title: '大规模图近似计算与检索原型软件',
  pwa: true,
  logo: 'icons/favicon.svg',
  iconfontUrl: '',
  splitMenus: false
};

export default Settings;
