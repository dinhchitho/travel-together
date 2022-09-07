import React, { Component } from "react";
import "./Card.scss";

type TProps = {
  title: string;
  total: number;
  totalPerDay?: number;
  icon: string;
};

type TState = {
  count: number;
};

export default class Card extends React.Component<TProps, TState> {
  state: TState = {
    count: 0,
  };

  render() {
    return (
      <div className="status-card">
        <div className="status-card__icon">
          <i className={this.props.icon}></i>
        </div>
        <div className="status-card__info">
          <h4>{this.props.total}</h4>
          <span>{this.props.title}</span>
        </div>
      </div>
    );
  }
}
