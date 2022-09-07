import React, { ReactNode } from "react";
import { BrowserRouter, Route } from "react-router-dom";
import Header from "../components/Header/Header";
import SideNav from "../components/SideNav/SideNav";
import "./MainLayout.scss";
interface Props {
  children: ReactNode;
}

import "../assets/boxicons-2.0.7/css/boxicons.min.css";

export default function MainLayout(props: Props) {
  const { children } = props;
  return (
    <div className="container-dashboard">
      <SideNav />
      <main className="right-menu">
        <Header />
        <div className="main-layout">{children}</div>
      </main>
    </div>
  );
}
