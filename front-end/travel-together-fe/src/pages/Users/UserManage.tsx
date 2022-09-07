import React, { useEffect, useRef, useState } from "react";
import TableNew from "../../components/Table/TableNew";

import { callApi } from "../../api/axios";
import { USER } from "../../constants/paths";
import { Response } from "../../constants/Response";

import MainLayout from "../../layouts/MainLayout";
import "./UserManage.scss";

import type { ColumnsType } from "antd/es/table";
import Popup from "../../components/Popup/Popup";
import Loading from "../../components/Loading/Loading";
import { formatDate } from "../Blogs/BlogManage";
import UserInfo from "../../components/User/UserInfo";
import Swal from "sweetalert2";

interface IProps {}

const UserManage = (props: IProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [users, setUsers] = useState<any>([]);

  const [loading, setLoading] = useState(false);

  const [user, setUser] = useState<any>();

  const openPopupUser = (record: string) => {
    setUser(record);
    setIsOpen(!isOpen);
  };

  const togglePopupUser = () => {
    setIsOpen(!isOpen);
  };

  const showAlertConfirm = (userId: string) => {
    Swal.fire({
      title: "Are you sure you want to delete this user?",
      showCancelButton: true,
      confirmButtonText: "Yes",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await handleDelete(userId);
        if (res && res.success) {
          let usersRemoved = users.filter((item: any) => item.id !== userId);
          setUsers([...usersRemoved]);
          Swal.fire("Delete success!", "", "success");
        } else {
          Swal.fire("Can't delete this user!", "", "info");
        }
      }
    });
  };

  const columns: ColumnsType<any> = [
    {
      title: "User",
      dataIndex: "username",
      key: "username",
      render: (_, record) => (
        <a
          onClick={() => {
            openPopupUser(record);
          }}
        >
          {record.fullName}
        </a>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
      render: (record) => <>{record ? "Male" : "Famle"}</>,
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
    },
    {
      title: "User type",
      dataIndex: "localGuide",
      key: "localGuide",
      render: (record) => <>{record ? "Local guide" : "Normal user"}</>,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <i
          className="bx bxs-trash"
          onClick={() => {
            showAlertConfirm(record.id);
          }}
        ></i>
      ),
    },
  ];

  const handleDelete = async (id: any) => {
    let token = localStorage.getItem("token");
    const res: Response<any> = await callApi(
      token,
      "DELETE",
      USER.DELETE_BY_ID,
      {
        userId: id,
      }
    );
    return res;
  };

  const getAllUser = async () => {
    let token = localStorage.getItem("token");
    setLoading(true);
    const res: Response<any> = await callApi(token, "GET", USER.GET_ALL);
    if (res && res.success && res.data != null) {
      const newUsers = res.data.map((user: any) => {
        return { ...user, key: user.id };
      });
      setUsers(newUsers);
      setLoading(false);
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllUser();
  }, []);

  return (
    <MainLayout>
      <div className="card">
        <h2 className="card__title">Users</h2>
        <TableNew data={users} columns={columns}></TableNew>
        {loading ? <Loading /> : null}
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

export default UserManage;
