import React, { Suspense } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { PATH } from "../constants/paths";
import Loading from "../components/Loading/Loading";

import TravelRequestsManage from "../pages/TravelRequests/TravelRequestsManage";
import UserManage from "../pages/Users/UserManage";
import ReportManage from "../pages/Reports/ReportUserManage";
import ReportBlogManage from "../pages/ReportBlog/ReportBlogManage";
import Login from "../pages/Login/Login";
import BlogManage from "../pages/Blogs/BlogManage";
import QAManage from "../pages/QA/QAManage";
import AdsManage from "../pages/Ads/AdsManage";
import AuthenticatedGuard from "../guards/AuthenticatedGuard";
import UserDetail from "../pages/Users/UserDetail";
import Home from "../pages/Home/Home";

export default function Routes() {
  return (
    <BrowserRouter>
      {/* <Header /> */}
      <Switch>
        <AuthenticatedGuard
          exact
          path={PATH.TRAVEL_REQUEST}
          component={() => (
            <Suspense fallback={<Loading />}>
              <TravelRequestsManage />
            </Suspense>
          )}
        />
        <AuthenticatedGuard
          exact
          path={PATH.USER}
          component={() => (
            <Suspense fallback={<Loading />}>
              <UserManage />
            </Suspense>
          )}
        />
        <AuthenticatedGuard
          exact
          path={"/user/:userId"}
          component={() => (
            <Suspense fallback={<Loading />}>
              <UserDetail />
            </Suspense>
          )}
        />
        <AuthenticatedGuard
          exact
          path={PATH.HOME}
          component={() => (
            <Suspense fallback={<Loading />}>
              <Home />
            </Suspense>
          )}
        />
        <AuthenticatedGuard
          exact
          path={PATH.REPORT_USER}
          component={() => (
            <Suspense fallback={<Loading />}>
              <ReportManage />
            </Suspense>
          )}
        />
        <AuthenticatedGuard
          exact
          path={PATH.REPORT_BLOG}
          component={() => (
            <Suspense fallback={<Loading />}>
              <ReportBlogManage />
            </Suspense>
          )}
        />
        <AuthenticatedGuard
          exact
          path={PATH.ADS}
          component={() => (
            <Suspense fallback={<Loading />}>
              <AdsManage />
            </Suspense>
          )}
        />
        <AuthenticatedGuard
          exact
          path={PATH.QA}
          component={() => (
            <Suspense fallback={<Loading />}>
              <QAManage />
            </Suspense>
          )}
        />
        <AuthenticatedGuard
          exact
          path={PATH.BLOG}
          component={() => (
            <Suspense fallback={<Loading />}>
              <BlogManage />
            </Suspense>
          )}
        />
        <Route
          path={PATH.LOGIN}
          component={() => (
            <Suspense fallback={<Loading />}>
              <Login />
            </Suspense>
          )}
        />
      </Switch>
      {/* <HomeRoutes /> */}
      {/* <ReportRoutes /> */}
      {/* <ReportBlogRoutes /> */}
      {/* <AdsRoutes /> */}
      {/* <QARoutes /> */}
      {/* <BlogRoutes /> */}
      {/* <LoginRoutes /> */}
    </BrowserRouter>
  );
}
