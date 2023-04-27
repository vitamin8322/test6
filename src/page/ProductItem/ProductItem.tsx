import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { AppDispatch, RootState } from "../../redux/store";
import {
  getItemProductFetch,
  updateProductFetch,
} from "../../redux/slice/productSlice";
import { toast } from "react-toastify";

type Props = {};

const ProductItem = (props: Props) => {
  let { idProduct } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const { dataItem, status } = useSelector((state: RootState) => state.product);

  const [showDropdown, setShowDropdown] = useState(false);
  const [newStatus, setNewStatus] = useState<string>();
  const [isHovered, setIsHovered] = useState(false);
  const [inputValue, setInputValue] = useState<number>();

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(getItemProductFetch(idProduct));
    };

    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setNewStatus(e.target.value);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleInputBlur = () => {
    setIsHovered(false);
  };

  const submitForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    dispatch(
      updateProductFetch({
        id: idProduct ?? 0,
        status: newStatus ?? dataItem.status,
        order: dataItem.order,
        total: inputValue,
        currency: dataItem.currency,
        fundingMethod: dataItem.fundingMethod,
      })
    );
    toast.success("Cập nhật thành công!");

  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  console.log(inputValue);

  return (
    <div className="flex items-center justify-center h-screen flex-col">
      <div className="block w-80 p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
        <form
          onSubmit={submitForm}
          className="flex items-center justify-cente flex-col"
        >
          <div>Id: {dataItem.id}</div>
          <div>{dataItem.order}</div>
          <div
            onMouseEnter={() => setShowDropdown(true)}
            onMouseLeave={() => setShowDropdown(false)}
          >
            {showDropdown ? (
              <div>Status:
                <select value={newStatus} onChange={handleChange}>
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Fulfilled">Fulfilled</option>
                </select>
              </div>
            ) : (
              <div>Status: {newStatus ?? dataItem.status}</div>
            )}
          </div>
          <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            {isHovered ? (
              <input
                type="number"
                value={inputValue ?? dataItem.total}
                onChange={(e) => setInputValue(Number(e.target.value))}
                onBlur={handleInputBlur}
              />
            ) : (
              <div>Total: {inputValue ?? dataItem.total}</div>
            )}
          </div>
          <div>Client: {dataItem.client}</div>
          <div>Invoice: {dataItem.invoice}</div>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            type="submit"
          >
            Save
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProductItem;
