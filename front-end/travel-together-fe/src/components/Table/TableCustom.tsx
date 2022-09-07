import React from "react";
import "./Table.scss";
import { callApi } from "./../../api/axios";
import { Response } from "../../constants/Response";
import { USER } from "../../constants/paths";
import axios from "axios";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import usePagination from "./usePagination";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

type TProps = {
  dataHeader: [];
  dataSource: [];
  onDelete?: (event: React.MouseEvent<HTMLElement>, id: any) => void;
  onBan?: (event: React.MouseEvent<HTMLElement>, id: any) => void;
  onSkip?: (event: React.MouseEvent<HTMLElement>, id: any) => void;
  // onClick?: (event: React.MouseEvent<HTMLElement>) => void;
};

export default function TableCustom(props: TProps) {
  const { dataHeader, dataSource, onBan, onDelete, onSkip } = props;

  let [page, setPage] = React.useState(1);
  const PER_PAGE = 8;

  const count = Math.ceil(dataSource.length / PER_PAGE);
  const _DATA = usePagination(dataSource, PER_PAGE);

  const handleChange = (e: any, p: any) => {
    setPage(p);
    _DATA.jump(p);
  };

  const handleDelete = (event: React.MouseEvent<HTMLElement>, id: any) => {
    return onDelete ? onDelete(event, id) : null;
  };

  const handleBan = (event: React.MouseEvent<HTMLElement>, id: any) => {
    return onBan ? onBan(event, id) : null;
  };

  const handleSkip = (event: React.MouseEvent<HTMLElement>, id: any) => {
    return onSkip ? onSkip(event, id) : null;
  };
  return (
    <div className="container-table">
      {/* <table>
        <thead>
          <tr>
            {dataHeader &&
              dataHeader.map((el: any, index) => {
                return <th key={index}>{el}</th>;
              })}
          </tr>
        </thead>
        <tbody>
          {_DATA.currentData().map((el: any, index: any) => {
            return (
              <tr key={index}>
                <td>{index}</td>
                <td>{el.username}</td>
                <td>{el.email}</td>
                <td>{el.gender ? "Male" : "Female"}</td>
                <td>
                  {(el.address_entities && el.address_entities.province) != null
                    ? el.address_entities.province
                    : ""}
                </td>
                <td>{el.isLocalGuide ? "LocalGuide" : "Normal User"}</td>
                <td>
                  {onDelete && (
                    <Button onClick={(event) => handleDelete(event, el.id)}>
                      <DeleteIcon />
                    </Button>
                  )}
                </td>
                <td>
                  {onBan && (
                    <button
                      onClick={(event) => handleBan(event, el.id)}
                    ></button>
                  )}
                </td>
                <td>
                  {onSkip && (
                    <button
                      onClick={(event) => handleSkip(event, el.id)}
                    ></button>
                  )}
                </td>
              </tr>
            );
          })}
          <tr>
            <td></td>
          </tr>
        </tbody>
      </table> */}
      <TableContainer component={Paper} sx={{ marginBottom: 5 }}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              {dataHeader &&
                dataHeader.map((el: any, index) => {
                  return (
                    <TableCell
                      align="left"
                      key={index}
                      variant="head"
                      sx={{ fontSize: 18 }}
                    >
                      {el}
                    </TableCell>
                  );
                })}
            </TableRow>
          </TableHead>
          <TableBody>
            {_DATA.currentData().map((row: any, index: any) => (
              <TableRow
                key={row.username}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {index}
                </TableCell>
                <TableCell align="left">{row.username}</TableCell>
                <TableCell align="left">{row.email}</TableCell>
                <TableCell align="left">
                  {row.gender ? "Male" : "Female"}
                </TableCell>
                <TableCell align="left">
                  {(row.address_entities && row.address_entities.province) !=
                  null
                    ? row.address_entities.province
                    : ""}
                </TableCell>
                <TableCell align="left">
                  {row.isLocalGuide ? "LocalGuide" : "Normal User"}
                </TableCell>
                {onDelete && (
                  <TableCell align="left">
                    <Button onClick={(event) => handleDelete(event, row.id)}>
                      <DeleteIcon />
                    </Button>
                  </TableCell>
                )}
                {onBan && (
                  <TableCell align="left">
                    <Button
                      onClick={(event) => handleBan(event, row.id)}
                    ></Button>
                  </TableCell>
                )}
                {onSkip && (
                  <TableCell align="left">
                    <Button
                      onClick={(event) => handleSkip(event, row.id)}
                    ></Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Stack spacing={2}>
        <Pagination
          count={count}
          size="large"
          page={page}
          variant="outlined"
          shape="rounded"
          onChange={handleChange}
        />
      </Stack>
    </div>
  );
}
