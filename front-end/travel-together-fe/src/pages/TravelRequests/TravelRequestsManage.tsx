import { Switch } from "@mui/material";
import React, { FC, useEffect, useState } from "react";
import TableNew from "../../components/Table/TableNew";
import MainLayout from "../../layouts/MainLayout";
import "./TravelRequests.scss";

import { callApi } from "../../api/axios";
import { TRAVEL_REQUEST, USER } from "../../constants/paths";
import { Response } from "../../constants/Response";

import type { ColumnsType } from "antd/es/table";
import { spawn } from "child_process";
import { formatDate } from "../Blogs/BlogManage";
import Popup from "../../components/Popup/Popup";
import UserInfo from "../../components/User/UserInfo";
import Loading from "../../components/Loading/Loading";
import { dateSortDesc } from "../../Method";

function getFormattedDate(date: Date) {
  let year = date.getFullYear();
  let month = (1 + date.getMonth()).toString().padStart(2, "0");
  let day = date.getDate().toString().padStart(2, "0");

  return month + "/" + day + "/" + year;
}

const TravelRequests = () => {
  const [isOpen, setIsOpen] = useState(false);

  const [users, setUsers] = useState<any[]>([]);
  const [user, setUser] = useState<any>();

  const [loading, setLoading] = useState(false);

  const togglePopup = () => {
    setIsOpen(!isOpen);
  };

  const openPopup = (record: any) => {
    setUser(record);
    setIsOpen(!isOpen);
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
      title: "Looking for",
      dataIndex: "genderLooking",
      key: "genderLooking",
    },
    {
      title: "Arrive location",
      dataIndex: "destination",
      key: "destination",
    },
    {
      title: "Time start",
      dataIndex: "departureDate",
      key: "departureDate",
      render: (departureDate) => <>{formatDate(departureDate)}</>,
    },
    {
      title: "Time end",
      dataIndex: "endDate",
      key: "endDate",
      render: (endDate) => <>{formatDate(endDate)}</>,
    },
    {
      title: "Status",
      dataIndex: "active",
      key: "active",
      render: (record) => (
        <>
          {record ? (
            <span className="tab active">Active</span>
          ) : (
            <span className="tab deactive">Deactive</span>
          )}
        </>
      ),
    },
  ];

  const fetchAllTravelRequest = async () => {
    let token = localStorage.getItem("token");
    setLoading(true);
    const res: Response<any> = await callApi(
      token,
      "GET",
      TRAVEL_REQUEST.GET_ALL
    );
    if (res && res.success && res.data) {
      let list: any[] = [];
      res.data.forEach((user: any) => {
        if (user.travelRequest) {
          const {
            createUser,
            genderLooking,
            destination,
            departureDate,
            endDate,
            active,
            createdDate,
          } = user.travelRequest;
          list.push({
            ...user,
            key: user.id,
            createUser,
            genderLooking,
            destination,
            departureDate,
            endDate,
            active,
            travelRequestCreatedDate: createdDate,
          });
        } else {
          list.push({
            ...user,
          });
        }
      });
      setLoading(false);
      setUsers(dateSortDesc(list, "travelRequestCreatedDate"));
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllTravelRequest();
  }, []);

  return (
    <MainLayout>
      <div className="card">
        <h2 className="card__title">TravelRequests</h2>
        <TableNew columns={columns} data={users}></TableNew>
        {loading ? <Loading /> : null}
        {isOpen && (
          <Popup handleClose={togglePopup} content={<UserInfo user={user} />} />
        )}
      </div>
    </MainLayout>
  );
};

export default TravelRequests;
