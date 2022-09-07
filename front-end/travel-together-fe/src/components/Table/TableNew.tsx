import React, { useEffect, useRef, useState } from "react";
import { Pagination, Space, Table, Tag } from "antd";
import usePagination from "./usePagination";

import "./tablenew.scss";

interface IProps {
  columns: any[];
  data: any[];
}

const TableNew = (props: IProps) => {
  const { columns, data } = props;
  // console.log("data :", data);
  const navigation_ref = useRef(null);

  let [page, setPage] = useState(1);
  const PER_PAGE = 4;

  const count = Math.ceil(data.length / PER_PAGE);
  const _DATA = usePagination(data, PER_PAGE);

  const handleChange = (current: any, pageSize: any) => {
    setPage(pageSize / 10);
    _DATA.jump(current);
  };

  useEffect(() => {
    const first_item: any = document.getElementsByClassName(
      "ant-pagination-item-1"
    )[0];
    first_item.click();
  }, [data]);

  return (
    <>
      <Table
        ref={navigation_ref}
        pagination={false}
        columns={columns}
        dataSource={_DATA.currentData()}
      />
      <Pagination
        defaultCurrent={page}
        total={count * 10}
        onChange={handleChange}
        className="pagination__wrapper"
      />
    </>
  );
};

export default TableNew;
