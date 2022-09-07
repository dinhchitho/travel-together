import moment from "moment";
import React from "react";

import "./notificationItem.scss";

import defaultAvatar from "../../assets/images/default-avatar.png";

import { useHistory } from "react-router-dom";
import { PATH } from "../../constants/paths";

interface IProps {
  item: {
    content: string;
    createUser: string;
    createdDate: Date;
    fullName: string;
    id: string;
    lastModifiedUser: string;
    permalink: string;
    read: boolean;
    thumbnail: string;
    type: string;
    updateDttm: Date;
  };
}

interface NotificationContentProps {
  content: string;
  createUser: string;
  fullName: string;
  permalink: string;
  type: string;
}

const NotificationItem = (props: IProps) => {
  let history = useHistory();
  const {
    thumbnail,
    content,
    createdDate,
    type,
    createUser,
    permalink,
    fullName,
  } = props.item;

  const handleClickNotification = (permalink: string) => {
    history.push({
      pathname: type === "USER" ? PATH.REPORT_USER : PATH.REPORT_BLOG,
      state: { permalink, type },
    });
  };

  return (
    <div
      className="notification-item__wrapper"
      onClick={() => {
        handleClickNotification(permalink);
      }}
    >
      <div className="notification-item">
        <div className="w-[23%]">
          <img
            className="w-[56px] h-[56px] rounded-full mr-[15px] object-cover"
            src={thumbnail ? thumbnail : defaultAvatar}
            alt=""
          />
          <i
            className={`bx bxs-${
              type === "USER" ? "user" : "edit"
            } text-lg text-white bg-blue-500 rounded-full p-1 translate-y-[70%]`}
          ></i>
        </div>
        <div className="w-[77%]">
          <p>
            <span className="font-bold">{fullName} </span>
            reported
            {type === "USER"
              ? " user "
              : type === "BLOG"
              ? " blog "
              : type === "ADS"
              ? " advertisement "
              : type === "QA"
              ? " QA "
              : ""}
            with content
            <span className="font-bold"> {content}</span>
          </p>
          <p className="text-blue-600">
            {moment.utc(createdDate).local().startOf("seconds").fromNow()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;
