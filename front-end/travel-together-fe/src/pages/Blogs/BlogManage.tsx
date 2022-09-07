import { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import "./BlogManage.scss";

import type { ColumnsType } from "antd/es/table";
import TableNew from "../../components/Table/TableNew";

import { callApi } from "../../api/axios";

import { BLOG } from "../../constants/paths";

import { Response } from "../../constants/Response";
import Popup from "../../components/Popup/Popup";
import UserInfo from "../../components/User/UserInfo";
import Loading from "../../components/Loading/Loading";
import { Switch } from "@mui/material";
import { dateSortDesc } from "../../Method";

interface IProps {
  //   title: string;
  //   subTitle: string;
}

export const formatDate = (datetime: any) => {
  return new Intl.DateTimeFormat("en-US").format(new Date(datetime));
};

const BlogManage = (props: IProps) => {
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

  const toggleActive = async (ban: boolean, blogId: string) => {
    if (!ban) {
      const res = await handleBanBlog(blogId);
      if (res && res.success && res.data) {
        const blogIndex = users.findIndex(
          (item: any) => item.blogId === blogId
        );
        if (blogIndex !== null) {
          const newUsers = users;
          newUsers[blogIndex].ban = !ban;
          setUsers([...newUsers]);
        }
      }
    }
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
      render: (text) => <p>{text}</p>,
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
              toggleActive(record.ban, record.blogId);
            }}
          />
        </div>
      ),
    },
  ];

  const handleBanBlog = async (blogId: any) => {
    let token = localStorage.getItem("token");
    const res: Response<any> = await callApi(
      token,
      "POST",
      BLOG.BAN_BLOG_BY_ID,
      {
        blogId,
      }
    );
    return res;
  };

  const fetchAllBlog = async () => {
    let token = localStorage.getItem("token");
    setLoading(true);

    const res: Response<any> = await callApi(token, "GET", BLOG.GET_ALL);
    if (res && res.success && res.data) {
      let list: any[] = [];
      let usersHasBlog = res.data.filter((item: any) => item.blogs?.length > 0);
      usersHasBlog.forEach((user: any) => {
        user.blogs.forEach((blog: any, index: number) => {
          if (blog) {
            const {
              createUser,
              content,
              images,
              location,
              createdDate,
              ban,
              id,
            } = blog;
            list.push({
              ...user,
              key: id,
              createUser,
              content,
              images,
              location,
              createdDate,
              ban,
              blogId: id,
            });
          }
        });
      });
      setUsers(dateSortDesc(list, "createdDate"));
      setLoading(false);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAllBlog();
  }, []);

  return (
    <MainLayout>
      <div className="card">
        <h2 className="card__title">Blogs</h2>
        {loading ? <Loading /> : null}
        <TableNew columns={columns} data={users}></TableNew>
        {isOpen && (
          <Popup handleClose={togglePopup} content={<UserInfo user={user} />} />
        )}
      </div>
    </MainLayout>
  );
};

export default BlogManage;
