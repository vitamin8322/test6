import React, { useCallback, useEffect, useState } from "react";
import { Modal, Pagination, Table, Tag } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import type { FilterValue, SorterResult } from "antd/es/table/interface";
import { AppDispatch, RootState } from "../../redux/store";
import { useSelector, useDispatch } from "react-redux";
import { Product } from "../../models/product";
import {
  deleteProductFetch,
  getProductFetch,
} from "../../redux/slice/productSlice";
import moment from "moment";
import { RiDeleteBin6Line } from "react-icons/ri";
import FilterTable from "../FilterTable/FilterTable";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
type Props = {};

const TablePayroll = (props: Props) => {
  const columns: ColumnsType<Product> = [
    {
      title: "Status",
      dataIndex: "status",
      width: "15%",
      render: (status: string) => {
        let color = "";
        if (status === "RECEIVED") {
          color = "blue";
        } else if (status === "PENDING") {
          color = "black";
        } else if (status === "PROCESSING") {
          color = "yellow";
        } else {
          color = "green";
        }
        return (
          <Tag color={color} key={status}>
            {status}
          </Tag>
        );
      },
    },
    {
      title: "Client",
      dataIndex: "client",
      width: "15%",
    },
    {
      title: "From",
      dataIndex: "createdAt",
      render: (date: string) => moment(date).format("DD MMM YYYY"),
    },
    {
      title: "Currency",
      dataIndex: "currency",
    },
    {
      title: "Total",
      dataIndex: "total",
    },
    {
      title: "Invoice",
      dataIndex: "invoice",
    },
    {
      dataIndex: "id",
      render: (id: number) => (
        <Link className="poiter" to={`/product/${id}`}>
          View Detail
        </Link>
      ),
    },
    {
      dataIndex: "id",
      render: (id: number) => (
        <button className="text-red-500 text-xl" onClick={() => showModal(id)}>
          <RiDeleteBin6Line />
        </button>
      ),
    },
  ];
  const dispatch = useDispatch<AppDispatch>();

  const [current, setCurrent] = useState(1);
  const [modalId, setModalId] = useState<any>();
  const { data, status, dataFilter } = useSelector(
    (state: RootState) => state.product
  );

  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = useCallback((id: number) => {
    setModalId(id);
    setIsModalOpen(true);
  },[]);

  const handleOk = useCallback(async () => {
    await dispatch(deleteProductFetch(modalId));
    dispatch(getProductFetch());
    toast.error("Xóa thành công");
    setIsModalOpen(false);
  }, [modalId]);

  const handleCancel = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  useEffect(() => {
    dispatch(getProductFetch());
  }, []);

  const getData = ({
    current,
    pageSize,
  }: {
    current: number;
    pageSize: number;
  }) => {
    return dataFilter.slice((current - 1) * pageSize, current * pageSize);
  };

  const pageSize = 10;
  return (
    <div>
      <Table
        pagination={false}
        columns={columns}
        dataSource={getData({ current, pageSize })}
      />
      <Pagination
        onChange={setCurrent}
        total={dataFilter.length}
        current={current}
        pageSize={pageSize}
      />
      <Modal
        title={`ID: ${modalId}`}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okButtonProps={{ "data-id": modalId }}
        cancelButtonProps={{ "data-id": modalId }}
      >
        <p>Bạn có muốn xóa sản phẩm</p>
      </Modal>
    </div>
  );
};

export default TablePayroll;
