import React from "react";
import "./loading.scss";

export default function Loading() {
  return (
    <div className="loading__wrapper">
      <div className="w-10 h-10 border-4 border-blue-600  rounded-full border-t-transparent animate-spin"></div>
    </div>
  );
}
