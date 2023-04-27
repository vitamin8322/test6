import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { fetchApi } from "../../hooks/api";
import { ILoginValidation, Auth } from "../../models/auth";
import { Product } from "../../models/product";

interface ItemState {
  data: Product[];
  dataItem: Product;
  dataFilter: Product[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: ItemState = {
  data: [],
  dataItem: {
    id: 0,
    status: "",
    currency: "",
    fundingMethod: "",
    total: "",
    order: "",
    client: "",
    invoice: "",
    createdBy: 0,
    createdAt: "",
    updatedAt: new Date(),
  },
  dataFilter: [],
  status: "idle",
  error: null,
};

interface FilterParams {
  status?: string;
  client?: string;
  from?: string;
  to?: string;
  invoice?: string;
}

export const getProductFetch = createAsyncThunk("all/product", async () => {
  const data = await fetchApi("/api/product", "get");
  return data.data;
});

export const getItemProductFetch = createAsyncThunk(
  "item/product",
  async (id: string | undefined) => {
    const data = await fetchApi(`/api/product/${id}`, "get");
    return data.data;
  }
);

export const deleteProductFetch = createAsyncThunk(
  "delete/product",
  async (id: number) => {
    const data = await fetchApi(`/api/product/${id}`, "delete");
    return data.data;
  }
);
export const updateProductFetch = createAsyncThunk(
  "delete/product",
  async ({
    id,
    status,
    order,
    total,
    currency,
    fundingMethod,
  }: {
    id: any;
    status: string;
    order: string;
    total: any;
    currency: string;
    fundingMethod: string;
  }) => {
    const body = {
      id: id,
      order: order,
      status: status,
      total: total,
      currency: currency,
      fundingMethod: fundingMethod
    };
    const data = await fetchApi(`/api/product`, "put", body);
    return data.data;
  }
);

const productSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    filterProduct: (state, action: PayloadAction<FilterParams>) => {
      const { status, client, from, to, invoice } = action.payload;
      console.log(status);

      let filteredData = state.data.slice();
      if (status !== undefined && status !== "all" && status !== "") {
        filteredData = filteredData.filter((item) =>
          item?.status?.toLowerCase()?.includes(status?.toLowerCase())
        );
      }
      if (client !== undefined && client !== "all" && client !== "") {
        filteredData = filteredData.filter((item) =>
          item?.client?.toLowerCase()?.includes(client?.toLowerCase())
        );
      }
      if (invoice !== undefined && invoice.trim() !== "") {
        filteredData = filteredData.filter((item) =>
          item?.invoice?.toLowerCase()?.includes(invoice?.toLowerCase())
        );
      }
      if (from !== undefined && to !== undefined && from !== "" && to !== "") {
        filteredData = filteredData?.filter((item) => {
          const itemDate = new Date(item.createdAt);
          return itemDate >= new Date(from) && itemDate <= new Date(to);
        });
      }
      state.dataFilter = filteredData;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProductFetch.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getProductFetch.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
        state.dataFilter = action.payload;
      })
      .addCase(getProductFetch.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Có lỗi";
      })
      .addCase(getItemProductFetch.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getItemProductFetch.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.dataItem = action.payload;
      })
      .addCase(getItemProductFetch.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Có lỗi";
      })
      .addCase(deleteProductFetch.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteProductFetch.fulfilled, (state, action) => {
        state.status = "succeeded";
      })
      .addCase(deleteProductFetch.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Có lỗi";
      });
  },
});
export const { filterProduct } = productSlice.actions;

export default productSlice.reducer;
