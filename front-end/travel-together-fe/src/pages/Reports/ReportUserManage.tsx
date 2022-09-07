import React, { FC, useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import "./ReportManage.scss";

import type { ColumnsType } from "antd/es/table";
import TableNew from "../../components/Table/TableNew";
import { Switch } from "@mui/material";

import { DownOutlined, SmileOutlined } from "@ant-design/icons";
import { Dropdown, Menu, Space } from "antd";

import { callApi } from "../../api/axios";
import { REPORT, TRAVEL_REQUEST, USER } from "../../constants/paths";
import { Response } from "../../constants/Response";

import BlogDetail from "../../components/Blog/BlogDetail";
import Popup from "../../components/Popup/Popup";
import Loading from "../../components/Loading/Loading";
import Swal from "sweetalert2";
import { handleSkip } from "../ReportBlog/ReportBlogManage";
import UserInfo from "../../components/User/UserInfo";
import { useLocation } from "react-router-dom";
import { dateSortDesc } from "../../Method";

const ReportManage = () => {
  const [reportUsers, setReportUsers] = useState<any[]>([]);
  console.log("reportUsers :", reportUsers);

  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>();

  const location: any = useLocation();

  const openPopupUser = async (userId: string) => {
    setLoading(true);
    const userData = await getUserById(userId);
    if (userData) {
      setUser(userData);
      setIsOpen(!isOpen);
    } else {
      Swal.fire("User not found!", "", "error");
    }
    setLoading(false);
  };

  const togglePopupUser = () => {
    setIsOpen(!isOpen);
  };

  const columns: ColumnsType<any> = [
    {
      title: "User reporter",
      dataIndex: "fullName",
      key: "fullName",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "User reported",
      dataIndex: "reportId",
      key: "reportId",
      render: (_, record) => (
        <a
          className="text-center w-full"
          onClick={() => {
            openPopupUser(record.reportId);
          }}
        >
          View
        </a>
      ),
    },
    {
      title: "Reason",
      dataIndex: "type",
      key: "type",
      render: (record) => <p>{record}</p>,
    },
    {
      title: "Describe",
      dataIndex: "description",
      key: "description",
      render: (record) => <p>{record}</p>,
    },
    {
      title: "Action",
      dataIndex: "datetime",
      key: "datetime",
      render: (value, record, index) => (
        <div className="tab__wrapper">
          <span
            className={`tab ${record.ban ? "bg-gray-500" : "bg-red-500"}`}
            onClick={() => {
              showAlertConfirmBan(record.reportId);
            }}
          >
            {record.ban ? "Banned" : "Ban"}
          </span>
          <span
            className="tab active"
            onClick={() => {
              showAlertConfirmSkip(
                record.typeReport,
                record.reportId,
                record.id
              );
            }}
          >
            Skip
          </span>
        </div>
      ),
    },
  ];

  const handleBanBlog = async (userId: any) => {
    let token = localStorage.getItem("token");
    const res: Response<any> = await callApi(
      token,
      "POST",
      USER.BAN_USER_BY_ID,
      {
        userId,
      }
    );
    return res;
  };

  const showAlertConfirmBan = (blogId: string) => {
    Swal.fire({
      title: "Are you sure you want to ban this user?",
      showCancelButton: true,
      confirmButtonText: "Yes",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await handleBanBlog(blogId);
        if (res && res.success) {
          Swal.fire("Ban success!", "", "success");
        } else {
          Swal.fire("Can't ban this blog!", "", "info");
        }
      }
    });
  };

  const showAlertConfirmSkip = (
    EType: string,
    reportId: string,
    id: string
  ) => {
    Swal.fire({
      title: "Are you sure you want to skip this report?",
      showCancelButton: true,
      confirmButtonText: "Yes",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await handleSkip(EType, reportId, id);
        if (res && res.success) {
          let reportRemoved = reportUsers.filter((item: any) => item.id !== id);
          setReportUsers([...reportRemoved]);
          Swal.fire("Skip success!", "", "success");
        } else {
          Swal.fire("Can't skip this report!", "", "info");
        }
      }
    });
  };

  const fetchReportUser = async () => {
    let token = localStorage.getItem("token");
    setLoading(true);

    const res: Response<any> = await callApi(token, "GET", REPORT.GET_ALL);
    if (res && res.success && res.data) {
      let userReports = res.data
        .filter((item: any) => item.typeReport === "USER")
        .map((report: any) => {
          return { ...report, key: report.id };
        });
      setReportUsers(dateSortDesc(userReports, "createdDate"));
      setLoading(false);
    } else {
      setLoading(false);
    }
  };

  const getUserById = async (userId: string) => {
    let token = localStorage.getItem("token");
    const res: Response<any> = await callApi(
      token,
      "GET",
      USER.GET_USER_BY_ID,
      { userId: userId }
    );
    if (res && res.success && res.data) {
      return res.data;
    } else {
      return null;
    }
  };

  useEffect(() => {
    if (location?.state) {
      openPopupUser(location?.state?.permalink);
    }
  }, [location?.state?.permalink]);

  useEffect(() => {
    console.log("render");

    fetchReportUser();
  }, []);

  return (
    <MainLayout>
      <div className="card">
        <h2 className="card__title">Manage Abuse Report User</h2>
        {loading ? <Loading /> : null}
        <TableNew columns={columns} data={reportUsers}></TableNew>
        {isOpen && (
          <Popup
            handleClose={togglePopupUser}
            content={<UserInfo user={user} />}
          />
        )}
      </div>
    </MainLayout>
  );
};

export default ReportManage;
