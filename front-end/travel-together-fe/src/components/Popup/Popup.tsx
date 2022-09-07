import React, { ReactNode } from "react";

import "./popup.scss";

type Props = {
  handleClose?: (event: React.MouseEvent<HTMLElement>) => void;
  content: ReactNode;
};

const Popup: React.FunctionComponent<Props> = (props: Props) => {
  return (
    <div className="popup-box">
      <div className="box">
        <div className="box-header">
          <i className="bx bx-x text-4xl" onClick={props.handleClose}></i>
        </div>
        {props.content}
      </div>
    </div>
  );
};

export default Popup;
