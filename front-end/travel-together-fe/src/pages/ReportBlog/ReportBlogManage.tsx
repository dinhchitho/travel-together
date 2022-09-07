import React, { FC, useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout";

import type { ColumnsType } from "antd/es/table";
import TableNew from "../../components/Table/TableNew";

import { callApi } from "../../api/axios";
import {
  ADS,
  BLOG,
  QA,
  REPORT,
  TRAVEL_REQUEST,
  USER,
} from "../../constants/paths";
import { Response } from "../../constants/Response";

import BlogDetail from "../../components/Blog/BlogDetail";
import Popup from "../../components/Popup/Popup";
import Loading from "../../components/Loading/Loading";
import Swal from "sweetalert2";
import Item from "antd/lib/list/Item";
import { useLocation } from "react-router-dom";
import { dateSortDesc } from "../../Method";

export const handleSkip = async (
  EType: string,
  reportId: string,
  id: string
) => {
  let token = localStorage.getItem("token");
  const res: Response<any> = await callApi(token, "GET", REPORT.DELETE_REPORT, {
    EType,
    reportId,
    id,
  });
  return res;
};

const ReportBlogManage = () => {
  const [reports, setReports] = useState<any[]>([]);
  console.log("reports :", reports);
  const [blogId, setBlogId] = useState<string>("");
  const [blogType, setBlogType] = useState<string>("");

  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const location: any = useLocation();

  const togglePopup = () => {
    setIsOpen(!isOpen);
  };

  const openBlogDetailPopup = (blogId: any, blogType: string) => {
    setBlogId(blogId);
    setBlogType(blogType);
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
      title: "Blog",
      // dataIndex: "reportId",
      // key: "reportId",
      render: (_, record) => (
        <a
          onClick={() => {
            openBlogDetailPopup(record.reportId, record.typeReport);
          }}
        >
          view
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
              showAlertConfirmBan(
                record.typeReport,
                record.reportId,
                record.id
              );
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

  const fetchReportBlog = async () => {
    let token = localStorage.getItem("token");
    setLoading(true);

    const res: Response<any> = await callApi(token, "GET", REPORT.GET_ALL);
    if (res && res.success && res.data) {
      let blogReports = res.data
        .filter((item: any) => item.typeReport !== "USER")
        .map((report: any) => {
          return { ...report, key: report.id };
        });
      setReports(dateSortDesc(blogReports, "createdDate"));
      setLoading(false);
    } else {
      setLoading(false);
    }
  };

  const getPathParams = (type: string, postId: string, reportId: string) => {
    switch (type) {
      case "BLOG":
        return {
          path: BLOG.BAN_BLOG_BY_ID,
          params: { idReport: reportId, blogId: postId },
        };
      case "ADS":
        return {
          path: ADS.BAN_AD_BY_ID,
          params: { idReport: reportId, adsId: postId },
        };
      case "QA":
        return {
          path: QA.BAN_QA_BY_ID,
          params: { idReport: reportId, qaId: postId },
        };
      default:
        return { path: "", params: {} };
    }
  };

  const handleBanPost = async (type: string, postId: any, reportId: string) => {
    let token = localStorage.getItem("token");
    const { path, params } = getPathParams(type, postId, reportId);
    const res: Response<any> = await callApi(token, "POST", path, params);
    return res;
  };

  const showAlertConfirmBan = (
    type: string,
    postId: string,
    reportId: string
  ) => {
    Swal.fire({
      title: "Are you sure you want to ban this blog?",
      showCancelButton: true,
      confirmButtonText: "Yes",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await handleBanPost(type, postId, reportId);
        if (res && res.success) {
          const postIndex = reports.findIndex(
            (item: any) => item.id === reportId
          );
          if (postIndex !== null) {
            const newReports = reports;
            newReports[postIndex].ban = true;
            setReports([...newReports]);
          }
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
          let reportRemoved = reports.filter((item: any) => item.id !== id);
          setReports([...reportRemoved]);
          Swal.fire("Skip success!", "", "success");
        } else {
          Swal.fire("Can't skip this report!", "", "info");
        }
      }
    });
  };

  useEffect(() => {
    if (location?.state) {
      openBlogDetailPopup(location?.state?.permalink, location?.state?.type);
    }
    return () => {
      // location.replace("", null);
    };
  }, [location?.state?.permalink]);

  useEffect(() => {
    fetchReportBlog();
  }, []);

  return (
    <MainLayout>
      <div className="card">
        <h2 className="card__title">Manage Abuse Report Blog</h2>
        {loading ? <Loading /> : null}
        <TableNew columns={columns} data={reports}></TableNew>
        {isOpen && (
          <Popup
            handleClose={togglePopup}
            content={<BlogDetail id={blogId} type={blogType} />}
          />
        )}
      </div>
    </MainLayout>
  );
};

export default ReportBlogManage;
