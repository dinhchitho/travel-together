import React, { FC, useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import "./QAManage.scss";

import type { ColumnsType } from "antd/es/table";
import TableNew from "../../components/Table/TableNew";
import { Switch } from "@mui/material";

import { callApi } from "../../api/axios";
import { ADS, QA, TRAVEL_REQUEST, USER } from "../../constants/paths";
import { Response } from "../../constants/Response";
import { formatDate } from "../Blogs/BlogManage";
import Loading from "../../components/Loading/Loading";
import Popup from "../../components/Popup/Popup";
import UserInfo from "../../components/User/UserInfo";
import { dateSortDesc } from "../../Method";

const QAManage = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [user, setUser] = useState<any>();

  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const togglePopup = () => {
    setIsOpen(!isOpen);
  };

  const openPopup = (record: any) => {
    setUser(record);
    setIsOpen(!isOpen);
  };

  const toggleActive = async (ban: boolean, qaId: string) => {
    if (!ban) {
      const res = await handleBanQa(qaId);
      if (res && res.success && res.data) {
        const qaIndex = users.findIndex((item: any) => item.qaId === qaId);
        if (qaIndex !== null) {
          const newUsers = users;
          newUsers[qaIndex].ban = !ban;
          setUsers([...newUsers]);
        }
      }
    }
  };

  const handleBanQa = async (qaId: any) => {
    let token = localStorage.getItem("token");
    const res: Response<any> = await callApi(token, "POST", QA.BAN_QA_BY_ID, {
      qaId,
    });
    return res;
  };

  const columns: ColumnsType<any> = [
    {
      title: "User",
      dataIndex: "createUser",
      key: "createUser",
      render: (_, record) => (
        <a
          onClick={() => {
            openPopup(record);
          }}
        >
          {record.fullName}
        </a>
      ),
    },
    {
      title: "Content",
      dataIndex: "content",
      key: "content",
      render: (record) => <p>{record}</p>,
    },
    {
      title: "Images",
      dataIndex: "images",
      key: "images",
      render: (images) => <img src={images[0]} alt="" />,
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
    },
    {
      title: "Datetime",
      dataIndex: "createdDate",
      key: "createdDate",
      render: (createdDate) => <>{formatDate(createdDate)}</>,
    },
    {
      title: "Deactive",
      dataIndex: "ban",
      key: "ban",
      render: (value, record, index) => (
        <div>
          <Switch
            // defaultChecked={!record.ban}
            checked={!record.ban}
            onChange={() => {
              toggleActive(record.ban, record.qaId);
            }}
          />
        </div>
      ),
    },
  ];

  const fetchAllQas = async () => {
    let token = localStorage.getItem("token");
    setLoading(true);

    const res: Response<any> = await callApi(token, "GET", QA.GET_ALL);
    if (res && res.success && res.data) {
      let list: any[] = [];
      let usersHasQa = res.data.filter((item: any) => item.qas?.length > 0);
      usersHasQa.forEach((user: any) => {
        user.qas.forEach((qa: any) => {
          if (qa) {
            const {
              createUser,
              content,
              images,
              location,
              createdDate,
              ban,
              id,
            } = qa;
            list.push({
              ...user,
              key: id,
              createUser,
              content,
              images,
              location,
              createdDate,
              ban,
              qaId: id,
            });
          }
        });
      });
      setUsers(dateSortDesc(list, "createdDate"));
      setLoading(false);
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllQas();
  }, []);

  return (
    <MainLayout>
      <div className="card">
        <h2 className="card__title">QAs</h2>
        {loading ? <Loading /> : null}
        <TableNew columns={columns} data={users}></TableNew>
        {isOpen && (
          <Popup handleClose={togglePopup} content={<UserInfo user={user} />} />
        )}
      </div>
    </MainLayout>
  );
};

export default QAManage;
