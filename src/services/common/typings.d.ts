import React from "react";

declare namespace Common {
  type R = {
    code?: number;
    msg?: string;
    data?: any;
  }
  type MenuItem = {
    label: React.ReactNode;
    key: React.Key;
    icon?: React.ReactNode;
  }
}
