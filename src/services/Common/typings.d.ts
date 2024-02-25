//公共类型设计
declare namespace Common {
  type R = {
    code?: number;
    msg?: string;
    data?: any;
  }

  type PageParams = {
    current: number;
    pageSize: number;
  }

  type MenuItem = {
    label: React.ReactNode;
    key: React.Key;
    icon?: React.ReactNode;
  }
}
