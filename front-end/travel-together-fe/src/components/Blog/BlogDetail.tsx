import React, { useEffect, useRef, useState } from "react";

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
import { formatDate } from "../../pages/Blogs/BlogManage";

import "./blogdetail.scss";

import defaultAvatar from "../../assets/images/default-avatar.png";

interface IProps {
  id: string;
  type: string;
}

const BlogDetail = (props: IProps) => {
  const { id, type } = props;
  const [blog, setBlog] = useState<any>({});

  const imagesRef = useRef<any>();

  const getBlogById = async () => {
    let token = localStorage.getItem("token");
    const { path, params } = getPathParams(type);
    const res: Response<any> = await callApi(token, "GET", path, params);
    console.log("res.data :", res.data);
    if (res && res.success && res.data) {
      setBlog(res.data);
      // const { images, avt, createUser, createdDate, likedUsers, content } =
      //   blog;
    } else {
      return null;
    }
  };

  const getPathParams = (type: string) => {
    switch (type) {
      case "BLOG":
        return { path: BLOG.GET_BLOG_BY_ID, params: { blogId: id } };
      case "ADS":
        return { path: ADS.GET_ADS_BY_ID, params: { qaId: id } };
      case "QA":
        return { path: QA.GET_QA_BY_ID, params: { qaId: id } };
      default:
        return { path: "", params: {} };
    }
  };

  const handlePrevNextImage = () => {
    let index = 0;
    let images = imagesRef.current.getElementsByTagName("img");
    let prev = imagesRef.current.getElementsByTagName("i")[0];
    let next = imagesRef.current.getElementsByTagName("i")[1];
    prev.addEventListener("click", function () {
      if (index > 0) {
        index--;
        imagesRef.current
          .getElementsByClassName("active")[0]
          .classList.remove("active");
        images[index].classList.add("active");
      }
    });
    next.addEventListener("click", function () {
      if (index < images.length - 1) {
        index++;
        imagesRef.current
          .getElementsByClassName("active")[0]
          .classList.remove("active");
        images[index].classList.add("active");
      }
    });
  };

  useEffect(() => {
    getBlogById();
    handlePrevNextImage();
  }, []);

  return (
    <div className="blog__wrapper h-[500px] flex">
      <div className="left-content w-[55%]  ">
        <div className="images__wrapper" ref={imagesRef}>
          <i className="bx bx-chevron-left bg-white rounded-full text-xl absolute top-[50%] z-10 ml-2"></i>
          {blog.images &&
            blog.images.map((image: any, index: number) => (
              <img
                key={index}
                className={`object-cover h-[500px] w-[53%] ${
                  index === 0 ? "active" : ""
                }`}
                src={image || ""}
                alt=""
              />
            ))}

          <i className="bx bx-chevron-right bg-white rounded-full text-xl absolute top-[50%] left-[51%] z-10 ml-2"></i>
        </div>
      </div>
      <div className="right-content w-[45%] ">
        <div className="user-info__wrapper p-4 gap-2  ">
          <div className="flex gap-2 items-center mb-2">
            <img
              src={blog.avt || defaultAvatar}
              alt=""
              className="w-[32px] h-[32px] object-cover rounded-full"
            />
            <span className="font-bold">{blog.createUser || ""}</span>
          </div>
          <p className="text-sm">{blog.content || ""}</p>
        </div>
        <div className="comment__wrapper"></div>
        <div className="blog-info__wrapper pl-4">
          <div className="flex gap-2 mb-1">
            <i className="bx bx-heart text-2xl"></i>
            <i className="bx bx-message-rounded text-2xl"></i>
          </div>
          <div>
            <p className="text-sm font-bold mb-1">
              {blog.likedUsers ? blog.likedUsers.length : 0} like
            </p>
            <p className="text-sm ">{formatDate(blog.createdDate || null)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
