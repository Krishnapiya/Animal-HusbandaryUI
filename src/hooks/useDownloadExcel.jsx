import axios from "axios";
import { getHeader } from "../utils";
import { useEffect, useState } from "react";
import { formatBytes } from "../utils";
import { toast } from "material-react-toastify";
const BASE_API_URL = import.meta.env.VITE_APP_BASE_API_URL;

const useDownloadExcel = (apiURL, fetchParams, selectedColumns, fileName) => {
  const [tableDownload, setTableDownload] = useState(false);
  const normalizePath = (path = "") => path.replace(/^\/+/, "").replace(/\/+$/, "");
  const toListAllPath = (path = "") => {
    const p = normalizePath(path);
    return p.endsWith("list/all") ? p : `${p}/list/all`;
  };
  const toDownloadPath = (path = "") => {
    const p = normalizePath(path);
    if (p.endsWith("list/all")) {
      return p.replace(/list\/all$/, "download-excel");
    }
    return `${p}/download-excel`;
  };

  const downloadBlob = (data, name, extension = "csv") => {
    const fileUrl = window.URL.createObjectURL(new Blob([data]));
    const link = document.createElement("a");
    link.href = fileUrl;
    link.setAttribute("download", `${name}.${extension}`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(fileUrl);
  };

  const escapeCsv = (value) => {
    if (value === null || value === undefined) return "";
    const str = String(value).replace(/"/g, '""');
    return /[",\n]/.test(str) ? `"${str}"` : str;
  };

  const toCsv = (rows = [], columns = []) => {
    const headers = columns.map((c) => escapeCsv(c.header || c.attr || ""));
    const body = rows.map((row) =>
      columns
        .map((c) => {
          if (typeof c.render === "function") return "";
          return escapeCsv(row?.[c.attr]);
        })
        .join(","),
    );
    return [headers.join(","), ...body].join("\n");
  };

  const downloadExcel = () => {
    setTableDownload(true);
  };
  useEffect(() => {
    if (tableDownload) {
      setTableDownload(false);
      const requestPayload = {
        ...fetchParams,
        xls_config: selectedColumns,
        xls: true,
      };

      // Create a promise toast
      const promiseToastId = toast.loading("Downloading file...", {
        theme: "colored",
        type: "warning",
      });

      (async () => {
        try {
          const config = {
            method: "POST",
            baseURL: BASE_API_URL,
            url: toDownloadPath(apiURL),
            data: requestPayload,
            responseType: "blob",
            headers: getHeader(),
            onDownloadProgress: (progressEvent) => {
              const totalBytesLoaded = progressEvent.loaded;
              toast.update(promiseToastId, {
                render: (
                  <div>
                    Downloaded :{" "}
                    <strong>
                      <i>{formatBytes(totalBytesLoaded)}</i>
                    </strong>
                  </div>
                ),
                type: "info",
                isLoading: true,
                autoClose: false,
              });
            },
          };

          try {
            const response = await axios(config);
            const contentType = response?.headers?.["content-type"] || "";
            const extension = contentType.includes(
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            )
              ? "xlsx"
              : "csv";
            downloadBlob(response.data, fileName, extension);
          } catch {
            // Fallback for tables without server-side download endpoint:
            // fetch filtered/sorted rows and generate CSV in browser.
            const listResp = await axios({
              method: "GET",
              baseURL: BASE_API_URL,
              url: toListAllPath(apiURL),
              headers: getHeader(),
              params: {
                pageNo: 0,
                pageSize: 100000,
                ...(fetchParams.sortBy ? { sortBy: fetchParams.sortBy } : {}),
                ...(fetchParams.sortOrder ? { sortOrder: fetchParams.sortOrder } : {}),
                ...(fetchParams.search ? { search: fetchParams.search } : {}),
              },
            });
            const rows = listResp?.data?.payLoad?.content || [];
            const csv = toCsv(rows, selectedColumns);
            downloadBlob(csv, fileName, "csv");
          }

          // Update toast on completion
          toast.update(promiseToastId, {
            render: "File downloaded successfully!",
            type: "success",
            isLoading: false,
            autoClose: 3000,
          });
        } catch (error) {
          // Update toast on error
          toast.update(promiseToastId, {
            render: "Error during download: " + error.message,
            type: "error",
            isLoading: false,
            autoClose: 3000,
          });
        } finally {
          // Optionally, set loading state back to false or perform other clean-up
        }
      })();
    }
  }, [tableDownload]);

  return { downloadExcel };
};

export default useDownloadExcel;
