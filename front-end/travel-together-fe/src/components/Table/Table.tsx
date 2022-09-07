import React, { Component } from "react"
import "./Table.scss"
import { callApi } from "./../../api/axios"
import { Response } from "../../constants/Response"
import { USER } from "../../constants/paths"
import axios from "axios"
import Button from "@mui/material/Button"
import DeleteIcon from "@mui/icons-material/Delete"
import Pagination from "@mui/material/Pagination"
import Stack from "@mui/material/Stack"

type TProps = {
  dataHeader: []
  dataSource: []
  onDelete?: (event: React.MouseEvent<HTMLElement>, id: any) => void
  onBan?: (event: React.MouseEvent<HTMLElement>, id: any) => void
  onSkip?: (event: React.MouseEvent<HTMLElement>, id: any) => void
  // onClick?: (event: React.MouseEvent<HTMLElement>) => void;
}

type TState = {
  count: number
  list: []
  page: number
}

const PER_PAGE = 10
export default class Table extends React.Component<TProps, TState> {
  constructor(props: TProps) {
    super(props)
    this.state = {
      count: 0,
      list: [],
      page: 1
    }
  }

  componentDidMount() {}

  componentDidUpdate() {}

  handleDelete = (event: React.MouseEvent<HTMLElement>, id: any) => {
    return this.props.onDelete ? this.props.onDelete(event, id) : null
  }

  handleBan = (event: React.MouseEvent<HTMLElement>, id: any) => {
    return this.props.onBan ? this.props.onBan(event, id) : null
  }

  handleSkip = (event: React.MouseEvent<HTMLElement>, id: any) => {
    return this.props.onSkip ? this.props.onSkip(event, id) : null
  }

  render() {
    return (
      <div className="container-table">
        <table>
          <thead>
            <tr>
              {this.props.dataHeader &&
                this.props.dataHeader.map((el: any, index) => {
                  return <th key={index}>{el}</th>
                })}
            </tr>
          </thead>
          <tbody>
            {this.props.dataSource.map((el: any, index) => {
              return (
                <tr key={index}>
                  <td>{index}</td>
                  <td>{el.username}</td>
                  <td>{el.email}</td>
                  <td>{el.gender ? "Male" : "Female"}</td>
                  <td>
                    {(el.address_entities && el.address_entities.province) !=
                    null
                      ? el.address_entities.province
                      : ""}
                  </td>
                  <td>{el.isLocalGuide ? "LocalGuide" : "Normal User"}</td>
                  <td>
                    {this.props.onDelete && (
                      <Button
                        onClick={event => this.handleDelete(event, el.id)}
                      >
                        <DeleteIcon />
                      </Button>
                    )}
                  </td>
                  <td>
                    {this.props.onBan && (
                      <button
                        onClick={event => this.handleBan(event, el.id)}
                      ></button>
                    )}
                  </td>
                  <td>
                    {this.props.onSkip && (
                      <button
                        onClick={event => this.handleSkip(event, el.id)}
                      ></button>
                    )}
                  </td>
                </tr>
              )
            })}
            <tr>
              <td></td>
            </tr>
          </tbody>
        </table>
        <Stack spacing={2}>
          <Pagination count={10} variant="outlined" shape="rounded" />
        </Stack>
      </div>
    )
  }
}
