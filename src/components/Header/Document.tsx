import {message} from "antd";
import {IconFont} from "@/utils/iconUtil";

export const Document = () => {
  return (
    <div
      onClick={() => {
        message.info('待完善')
      }}
    >
      <IconFont style={{fontSize: 18}} type='icon-wendang'/>
    </div>
  );
};
