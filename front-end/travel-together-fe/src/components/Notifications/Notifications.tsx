import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { callApi } from "../../api/axios";
import { readNotification } from "../../App/App.actions";
import { NOTIFICATION } from "../../constants/paths";
import { Response } from "../../constants/Response";
import { dateSortDesc } from "../../Method";
import NotificationItem from "./NotificationItem";

import "./notifications.scss";

interface IProps {}

const Notifications = (props: IProps) => {
  const notifications: any = useSelector(
    (state: any) => state.app.notifications
  );

  const dispatch: Dispatch<any> = useDispatch();

  const handleRead = async (notifyId: string) => {
    // console.log("notifyId :", notifyId);
    // let token = localStorage.getItem("token");
    // const res: Response<any> = await callApi(token, "POST", NOTIFICATION.READ, {
    //   notifyId,
    // });
    dispatch(readNotification(notifyId));
    // if (res && res.data && res.success) {
    // }
  };

  return (
    <React.Fragment>
      <div className="fixed z-10 bg-white w-full py-2">
        <p className="font-bold px-[25px] text-xl">Notification</p>
      </div>
      <div className="container-notification-child pt-[50px]">
        {notifications &&
          dateSortDesc([...notifications], "createdDate").map(
            (item: any, index: any) => {
              return (
                <div
                  onClick={() => {
                    handleRead(item.id);
                  }}
                  key={index}
                  className={`notification__wrapper ${
                    item.read ? "bg-white" : "bg-grey"
                  }`}
                >
                  <NotificationItem item={item} />
                </div>
              );
            }
          )}
      </div>
    </React.Fragment>
  );
};

export default Notifications;
