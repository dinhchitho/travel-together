import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { callApi } from "../../api/axios";
import { setNotifications } from "../../App/App.actions";
import Card from "../../components/Card/Card";
import Loading from "../../components/Loading/Loading";
import { ADMIN, USER } from "../../constants/paths";
import { Response } from "../../constants/Response";
import MainLayout from "../../layouts/MainLayout";
import "./Home.scss";

const Home = () => {
  const [statistical, setStatistical] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const dispatch: Dispatch<any> = useDispatch();

  const getCurrentUser = async () => {
    let token = localStorage.getItem("token");
    if (token) {
      const res: Response<any> = await callApi(token, "GET", USER.CURRENT_USER);
      if (res.success && res.data != null) {
        if (res.data.notifications && res.data.notifications.length > 0) {
          dispatch(setNotifications(res.data.notifications));
        }
      }
    }
  };

  const fetchStatistical = async () => {
    let token = localStorage.getItem("token");
    setLoading(true);
    const res: Response<any> = await callApi(token, "GET", ADMIN.GET_TOTAL);
    if (res && res.data && res.success) {
      const {
        totalAds,
        totalBLog,
        totalQa,
        totalReport,
        totalTravel,
        totalUser,
      } = res.data;
      const statuscards = [
        {
          content: "Total Blog",
          total: totalBLog,
          icon: "bx bxs-edit",
        },
        {
          content: "Total User",
          total: totalUser,
          icon: "bx bxs-user",
        },
        {
          content: "Total Travel Request",
          total: totalTravel,
          icon: "bx bxs-edit-location",
        },
        {
          content: "Total Ads Local Tour",
          total: totalAds,
          icon: "bx bx-book-add",
        },
        {
          content: "Total Q and A",
          total: totalQa,
          icon: "bx bx-question-mark",
        },
        {
          content: "Total Abuse Report",
          total: totalReport,
          icon: "bx bxs-user-x",
        },
      ];
      setStatistical(statuscards);
      setLoading(false);
    }
  };

  useEffect(() => {
    getCurrentUser();
    fetchStatistical();
  }, []);

  return (
    <MainLayout>
      <div className="container-main-dashboard">
        <h2 className="card__title">Dashboard</h2>
        {loading ? <Loading /> : null}
        <div className="wrapper-card">
          {statistical &&
            statistical.map((item, index) => (
              <Card
                key={index}
                title={item.content}
                total={item.total}
                icon={item.icon}
              ></Card>
            ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default Home;
