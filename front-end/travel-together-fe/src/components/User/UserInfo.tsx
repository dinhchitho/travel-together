import { useEffect, useRef } from "react";
import { formatDate } from "../../pages/Blogs/BlogManage";

interface UserDetailContentProps {
  user: {
    username: string;
    avatar: string;
    country: string;
    fullName: string;
    dob: Date;
    email: string;
    phone: string;
    gender: boolean;
    height: string;
    weight: string;
    married: boolean;
    followedUsers: [];
    followingUsers: [];
    blogs: [];
  };
}

const UserInfo = (props: UserDetailContentProps) => {
  // console.log("props :", props);
  const tabHeader = useRef<any>();
  const tabIndicator = useRef<any>();
  const tabBody = useRef<any>();

  const {
    username,
    avatar,
    country,
    fullName,
    dob,
    email,
    phone,
    gender,
    height,
    weight,
    married,
    followedUsers,
    followingUsers,
    blogs,
  } = props.user;

  useEffect(() => {
    let tabsPane = tabHeader.current.getElementsByTagName("div");
    for (let i = 0; i < tabsPane.length; i++) {
      tabsPane[i].addEventListener("click", function () {
        // tabHeader.current
        //   .getElementsByClassName("active")[0]
        //   .classList.remove("active");
        // tabsPane[i].classList.add("active");
        tabBody.current
          .getElementsByClassName("active")[0]
          .classList.remove("active");
        tabBody.current.getElementsByTagName("div")[i].classList.add("active");
        let left = 100 * i;
        tabIndicator.current.style.marginLeft = `${left}px`;
      });
    }
  }, []);

  return (
    <div className="user-detail">
      <div className="user-detail__left-content ">
        <div>
          <img className="user-detail_img" src={avatar} alt="" />
          <div className="user-detail__left-content follow ">
            <div className="font-bold w-[150px] text-center">
              <h4>Following</h4>
              <div className="text-center">
                {followingUsers ? followingUsers.length : 0}
              </div>
            </div>
            <div className="font-bold w-[150px] text-center">
              <h4>Follower</h4>
              <div className="text-center">
                {followedUsers ? followedUsers.length : 0}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="user-detail__right-content">
        <div className="user-detail__right-content name">
          <h2 className="font-bold text-2xl">{fullName || null}</h2>
          <span>
            <i className="bx bxs-map text-red-600"></i>
            <span className="font-medium">{country}</span>
          </span>
        </div>
        <div className="user-detail__right-content info">
          <div className="tabs">
            <div ref={tabHeader} className="tab-header">
              <div className="flex cursor-pointer">
                <i className="bx bxs-user"></i>
                <span className="tab-header_title">About</span>
              </div>
              <div className="flex cursor-pointer">
                <i className="bx bxl-blogger"></i>
                <span className="tab-header_title">Blog</span>
              </div>
            </div>
            <div ref={tabIndicator} className="tab-indicator"></div>
            <div ref={tabBody} className="tab-body">
              <div className="user-info active">
                <main className="user-detail__right-content_info-left flex">
                  <main className="w-[150px]">
                    <h4>Username: </h4>
                    <h4>Date of birth: </h4>
                    <h4>Email: </h4>
                    <h4>Phone: </h4>
                    <h4>Gender: </h4>
                    <h4>Height: </h4>
                    <h4>Weight: </h4>
                    <h4>Status: </h4>
                  </main>
                  <main>
                    <p>{username}</p>
                    <p>{formatDate(dob)}</p>
                    <p className="text-main-color">{email}</p>
                    <p>{phone}</p>
                    <p>{gender ? "Male" : "Female"}</p>
                    <p>{height ? `${height}cm` : ""}</p>
                    <p>{weight ? `${weight}kg` : ""}</p>
                    <p>{married ? "Married" : "Single"}</p>
                  </main>
                </main>
              </div>
              <div
                className={`blogs__wrapper ${
                  !blogs || blogs.length == 0 ? "" : "grid"
                }  grid-cols-4 p-[10px] w-[700px] gap-1 `}
              >
                {blogs && blogs.length > 0 ? (
                  blogs.map((blog: any, index: number) => (
                    <img
                      key={index}
                      src={blog.images[0]}
                      alt=""
                      className="object-cover h-[160px]"
                    />
                  ))
                ) : (
                  <p>This user has not posted any posts yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
