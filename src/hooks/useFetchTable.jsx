import axios from "axios";
import { useState, useEffect } from "react";
import { toast } from "material-react-toastify";
import { useSearchParams } from "react-router-dom";
import { getHeader } from "../utils";

const BASE_API_URL = import.meta.env.VITE_APP_BASE_API_URL;

const useFetchTable = (
  apiURL,
  selectedStatus = ""
) => {
  const [rows, setRows] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [rowsInCurrentPage, setRowsInCurrentPage] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isTableLoading, setIsTableLoading] = useState(false);
  const [fetchParams, setFetchParams] = useState({
    pageNo: 0,
    pageSize: parseInt(import.meta.env.VITE_PAGE_SIZE, 10) || 10,
    sortBy: "",
    sortOrder: "",
    search: "",
  });

  const [searchParams] = useSearchParams();

  const handleChangePage = (_, value) => {
    setFetchParams((prev) => ({ ...prev, pageNo: value - 1 }));
  };

  const handleChangePageSize = (event) => {
    setFetchParams((prev) => ({
      ...prev,
      pageNo: 0,
      pageSize: parseInt(event.target.value, 10),
    }));
  };

  const handleSortTable = (attr, order = "asc") => {
    setFetchParams((prev) => ({
      ...prev,
      pageNo: 0,
      sortBy: attr,
      sortOrder: order,
    }));
  };

  const handleSearchTable = (key) => {
    setFetchParams((prev) => ({
      ...prev,
      pageNo: 0,
      search: key,
    }));
  };

  const handleFilterTable = (params) => {
    setFetchParams((prev) => ({
      ...prev,
      ...params,
      pageNo: 0,
    }));
  };

  const handleResetTable = () => {
    setFetchParams((prev) => ({
      ...prev,
      pageNo: 0,
      sortBy: "",
      sortOrder: "",
      search: "",
    }));
  };

  const handleRefreshTable = () => {
    fetchData();
  };

  const fetchData = async () => {
    setIsTableLoading(true);
    setProgress(0);
  
    try {
      // Clean query params
const params = {
  pageNo: fetchParams.pageNo,
  pageSize: fetchParams.pageSize,
};

if (selectedStatus) {
  params.status = selectedStatus;
}
  
      if (fetchParams.sortBy) params.sortBy = fetchParams.sortBy;
      if (fetchParams.sortOrder) params.sortOrder = fetchParams.sortOrder;
      if (fetchParams.search) params.search = fetchParams.search;
  
      const cleanBase = BASE_API_URL.replace(/\/$/, "");
      const cleanApi = apiURL.replace(/^\/+/, "");

        const shouldAppendListAll =
          !cleanApi.includes("list/all") &&
          !cleanApi.includes("my-applications") &&
          !cleanApi.includes("my-forwarded");

        const url = shouldAppendListAll
          ? `${cleanBase}/${cleanApi}list/all`
          : `${cleanBase}/${cleanApi}`;
  
      const response = await axios.get(url, {
        headers: getHeader(),
        params,
        onDownloadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentage = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setProgress(percentage);
          }
        },
      });
  
      const payload = response.data.payLoad;

      // Handle both paginated responses and plain array responses
      if (Array.isArray(payload)) {
        setRows(payload);
        setRowsInCurrentPage(payload.length);
        setTotalRows(payload.length);
        setPageCount(1);

        if (payload.length === 0) {
        toast.info("No Data Found !!!");
        }
        } else {
  setRows(payload.content || []);
  setRowsInCurrentPage(payload.content?.length || 0);
  setTotalRows(payload.totalRecords || 0);
  setPageCount(payload.totalPages || 0);

  if (!payload || payload.totalRecords === 0) {
    toast.info("No Data Found !!!");
    }
    }
    } catch (error) {
      toast.error(error?.response?.data?.detail || "Something Went Wrong !!");
      setRows([]);
      setRowsInCurrentPage(0);
      setTotalRows(0);
      setPageCount(0);
    } finally {
      setIsTableLoading(false);
    }
  };

  // Fetch table on initial load and whenever fetchParams change
useEffect(() => {
  if (!searchParams.get("filter")) {
    fetchData();
  }
}, [
  fetchParams,
  searchParams,
  apiURL,
  selectedStatus,
]);
useEffect(() => {
    fetchData();
}, [selectedStatus]);

  return {
    rows,
    totalRows,
    rowsInCurrentPage,
    pageCount,
    progress,
    isTableLoading,
    fetchParams,
    handleChangePage,
    handleChangePageSize,
    handleSortTable,
    handleSearchTable,
    handleFilterTable,
    handleResetTable,
    handleRefreshTable,
  };
};

export default useFetchTable;
