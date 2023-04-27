import React, { RefObject, useRef, useState } from "react";
import {
  DatePicker,
  Space,
  Select,
  Input,
  Modal,
  Button,
  DatePickerProps,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { filterProduct } from "../../redux/slice/productSlice";
import moment from "moment";
import type { Dayjs } from "dayjs";

import dayjs from 'dayjs';
type Props = {};
const FilterTable = (props: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const datePickerToRef = useRef<any>(null);
  const { data, status } = useSelector((state: RootState) => state.product);
  const [filter, setFilter] = useState({
    status: "",
    client: "",
    from: "",
    to: "",
    invoice: "",
  });

  const onChangeStatus = (value: string) => {
    console.log(`selected ${value}`);
    setFilter({ ...filter, status: value });
  };

  const onChangeClient = (value: string) => {
    console.log(`selected ${value}`);
    setFilter({ ...filter, client: value });
  };

  const onChangeFrom: DatePickerProps["onChange"] = (date, dateString) => {
    console.log(date, dateString);
    setFilter({ ...filter, from: dateString });
  };
  const onChangeTo: DatePickerProps["onChange"] = (date, dateString) => {
    setFilter({ ...filter, to: dateString });
  };

  const disabledDateFrom = (current: Dayjs) => {
    return current && current > moment(filter?.to).endOf("day");
  };

  const disabledDateTo = (current: Dayjs) => {
    return current && current < moment(filter?.from).endOf("day");
  };

  return (
    <div className="flex justify-between items-center mx-5">
      <div>
        <Select
          showSearch
          placeholder="Status"
          optionFilterProp="children"
          onChange={onChangeStatus}
          className="m-3 w-32"
          value={filter.status || undefined}
          filterOption={(input, option) =>
            (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
          }
          options={[
            {
              value: "all",
              label: "All",
            },
            {
              value: "pending",
              label: "Pending",
            },
            {
              value: "fulfilled",
              label: "Fulfilled",
            },
            {
              value: "processing",
              label: "Processing",
            },
            {
              value: "received",
              label: "Received",
            },
          ]}
        />
        <Select
          showSearch
          placeholder="Client"
          optionFilterProp="children"
          onChange={onChangeClient}
          value={filter.client || undefined}
          className="m-3 w-32"
          filterOption={(input, option) =>
            (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
          }
          options={[
            {
              value: "all",
              label: "All",
            },
            {
              value: "chrome",
              label: "Chrome",
            },
            {
              value: "cococ",
              label: "Cococ",
            },
            {
              value: "coccoc",
              label: "Coccoc",
            },
          ]}
        />
        <Space direction="vertical">
          <DatePicker
            onChange={onChangeFrom}
            value={filter.from ? dayjs(filter.from) : null}
            className="m-3"
            placeholder="From"
            disabledDate={disabledDateFrom}
          />
        </Space>
        <Space direction="vertical">
          <DatePicker
            disabledDate={disabledDateTo}
            value={filter.to ? dayjs(filter.to) : null}
            onChange={onChangeTo}
            className="m-3"
            ref={datePickerToRef}
            placeholder="To"
          />
        </Space>
        <Input
          onChange={(e) => setFilter({ ...filter, invoice: e.target.value })}
          placeholder="Ivoice#"
          value={filter.invoice || undefined}
          className="w-40"
        />
      </div>
      <div>
        <Space className="site-button-ghost-wrapper" wrap>
          <Button
            onClick={() => dispatch(filterProduct(filter))}
            type="primary"
            ghost
          >
            Apply
          </Button>
          <Button
            onClick={() =>{
              setFilter({
                status: "",
                client: "",
                from: '',
                to: '',
                invoice: "",
              })
              }
            }
            type="primary"
            danger
            ghost
          >
            Clear
          </Button>
        </Space>
      </div>
    </div>
  );
};

export default FilterTable;
