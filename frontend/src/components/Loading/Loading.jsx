import React from "react";
import "./Loading.css";

const Loading = ({ text, subText }) => {
  return (
    <div className="loading-screen">
      <div className="tripmesh-loader">
        <div className="orbit"></div>

        <div className="loader-logo">✈</div>
      </div>

      <h2>{text}</h2>

      <p>{subText}</p>

      <div className="loading-bar">
        <span></span>
      </div>
    </div>
  );
};

export default Loading;
