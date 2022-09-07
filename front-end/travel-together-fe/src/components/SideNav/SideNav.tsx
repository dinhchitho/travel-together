import React, { useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import home from "../../assets/images/home.svg";
import blog from "../../assets/images/blog.svg";
import user from "../../assets/images/user.svg";
import travelRequest from "../../assets/images/travel-request.svg";
import ads from "../../assets/images/ads.svg";
import qa from "../../assets/images/qa.svg";
import report from "../../assets/images/report.svg";
import { connect, ConnectedProps, useDispatch } from "react-redux";
import { PATH } from "../../constants/paths";
import "./SideNav.scss";
import { addNotification, logout, toggleSideNav } from "../../App/App.actions";
import { useHistory } from "react-router-dom";

import logo from "../../assets/images/logo.png";
import { Dispatch } from "redux";

const mapStateToProps = (state: any) => ({
  closeSideNav: state.app.closeSideNav,
});

const mapDispatchToProps = {
  logout,
  toggleSideNav,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

interface Props extends ConnectedProps<typeof connector> {
  location?: any;
}

const sidenav_items = [
  {
    display_name: "Overview",
    route: PATH.HOME,
    image: home,
    icon: "bx bx-category-alt",
  },
  {
    display_name: "Manage Blog",
    route: PATH.BLOG,
    image: blog,
    icon: "bx bxs-edit",
  },
  {
    display_name: "Manage User",
    route: PATH.USER,
    image: user,
    icon: "bx bxs-user-detail",
  },
  {
    display_name: "Manage Travel Request",
    route: PATH.TRAVEL_REQUEST,
    image: travelRequest,
    icon: "bx bxs-edit-location",
  },
  {
    display_name: "Manage Ads",
    route: PATH.ADS,
    image: ads,
    icon: "bx bx-book-add",
  },
  {
    display_name: "Manage QA",
    route: PATH.QA,
    image: qa,
    icon: "bx bx-question-mark",
  },
  {
    display_name: "Manage Abuse Report User",
    route: PATH.REPORT_USER,
    image: report,
    icon: "bx bxs-user-x",
  },
  {
    display_name: "Manage Abuse Report Blog",
    route: PATH.REPORT_BLOG,
    image: report,
    icon: "bx bxs-calendar-exclamation",
  },
  // {
  //   display_name: "Product",
  //   route: PATH.PRODUCT,
  //   image: "",
  //   icon: "bx bx-package",
  // },
];

function SideNav(props: Props) {
  const { closeSideNav, logout, toggleSideNav } = props;

  const history = useHistory();
  const location = useLocation();

  const activeItem = sidenav_items.findIndex(
    (item) => item.route === location.pathname
  );

  const handleLogout = () => {
    logout();
    history.push(PATH.LOGIN);
  };

  return (
    <div className={`container-sidebar ${closeSideNav ? "close" : ""}`}>
      <div className="flex px-1 py-5 items-center">
        <img src={logo} alt="" className="object-cover w-[90px]" />
        <span className="font-bold text-3xl">Travel Together</span>
      </div>
      <div className="sidenav__items">
        <div>
          {sidenav_items &&
            sidenav_items.map((item: any, index: number) => (
              <NavLink
                exact={item.route === PATH.HOME}
                to={item.route}
                className="wrap-nav"
                key={index}
              >
                <div className="sidenav__item">
                  <div
                    className={`sidenav__item-inner ${
                      index === activeItem ? "active" : ""
                    }`}
                  >
                    <i className={item.icon}></i>
                    {/* <img src={item.image} alt="" /> */}
                    <div className="nav-label">{item.display_name}</div>
                  </div>
                </div>
              </NavLink>
            ))}
        </div>
        <div>
          <div className="sidenav__item" onClick={handleLogout}>
            <div className="sidenav__item-inner">
              <i className="bx bx-log-out"></i>
              <div className="nav-label">Log out</div>
            </div>
          </div>
        </div>
      </div>
      {/* <div>
        <p>
          Copyright ©{new Date().getFullYear()} All rights reserved | This
          template is made with by
          <a
            href="https://xdevclass.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-1 text-white"
          >
            XdevClass
          </a>
        </p>
      </div> */}
      {/* <div className="container-logout">
        <button className="btn-logout" onClick={handleLogout}>
          Logout
        </button>
      </div> */}
    </div>
  );
}

export default connector(SideNav);
