import React, { FC, useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import "./AdsManage.scss";

import type { ColumnsType } from "antd/es/table";
import TableNew from "../../components/Table/TableNew";
import { Switch } from "@mui/material";

import { callApi } from "../../api/axios";
import { ADS, TRAVEL_REQUEST, USER } from "../../constants/paths";
import { Response } from "../../constants/Response";
import { formatDate } from "../Blogs/BlogManage";
import Loading from "../../components/Loading/Loading";
import Popup from "../../components/Popup/Popup";
import UserInfo from "../../components/User/UserInfo";
import { dateSortDesc } from "../../Method";

const AdsManage = () => {
  const [users, setUsers] = useState<any[]>([]);
  console.log("users :", users);
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
              toggleActive(record.ban, record.adId);
            }}
          />
        </div>
      ),
    },
  ];

  const toggleActive = async (ban: boolean, adId: string) => {
    if (!ban) {
      const res = await handleBanAd(adId);
      if (res && res.success && res.data) {
        const adIndex = users.findIndex((item: any) => item.adId === adId);
        if (adIndex !== null) {
          const newUsers = users;
          newUsers[adIndex].ban = !ban;
          setUsers([...newUsers]);
        }
      }
    }
  };

  const handleBanAd = async (adsId: any) => {
    let token = localStorage.getItem("token");
    const res: Response<any> = await callApi(token, "POST", ADS.BAN_AD_BY_ID, {
      adsId,
    });
    return res;
  };

  const fetchAllAds = async () => {
    let token = localStorage.getItem("token");
    setLoading(true);
    const res: Response<any> = await callApi(token, "GET", ADS.GET_ALL);
    if (res && res.success && res.data) {
      let list: any[] = [];
      let usersHasAds = res.data.filter((item: any) => item.ads?.length > 0);
      usersHasAds.forEach((user: any) => {
        user.ads.forEach((ad: any) => {
          if (ad) {
            const {
              createUser,
              content,
              images,
              location,
              createdDate,
              ban,
              id,
            } = ad;
            list.push({
              ...user,
              key: id,
              createUser,
              content,
              images,
              location,
              createdDate,
              ban,
              adId: id,
            });
          }
        });
      });

      setUsers(list);
      setLoading(false);
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllAds();
  }, []);

  return (
    <MainLayout>
      <div className="card">
        <h2 className="card__title">Advertisements</h2>
        {loading ? <Loading /> : null}
        <TableNew columns={columns} data={users}></TableNew>
        {isOpen && (
          <Popup handleClose={togglePopup} content={<UserInfo user={user} />} />
        )}
      </div>
    </MainLayout>
  );
};

export default AdsManage;
