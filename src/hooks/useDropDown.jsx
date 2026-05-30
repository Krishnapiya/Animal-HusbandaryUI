import { useState, useEffect, useMemo } from "react";
import axios from "axios";

const BASE_API_URL = import.meta.env.VITE_APP_BASE_API_URL;
import { getHeader } from "../utils";

/** Normalize list from RestResponse + PaginationPayLoad (or raw array). */
const extractListFromResponse = (data) => {
  if (!data) return [];
  const page = data.payLoad ?? data.payload;
  if (Array.isArray(page?.content)) return page.content;
  if (Array.isArray(page)) return page;
  return [];
};

/**
 * @param {Array<{ api_url: string, includeToken?: boolean, dropdown: string }>} dropdown_config
 * @param {unknown[]} [deps] — optional extra effect deps (primitives recommended)
 */
const useDropDown = (dropdown_config, deps) => {
  const [dropdownData, setDropdownData] = useState({});

  const configKey = useMemo(() => {
    if (!Array.isArray(dropdown_config) || dropdown_config.length === 0) return "";
    return dropdown_config.map((c) => `${c.dropdown}:${c.api_url}`).join("|");
  }, [dropdown_config]);

  const extraDeps = Array.isArray(deps) ? deps : [];

  useEffect(() => {
    if (!Array.isArray(dropdown_config) || dropdown_config.length === 0) {
      setDropdownData({});
      return;
    }

    const fetchData = async () => {
      try {
        const promises = dropdown_config.map(async (item) => {
          const response = await axios({
            method: "GET",
            baseURL: BASE_API_URL,
            url: item.api_url.startsWith("/") ? item.api_url : `/${item.api_url}`,
            headers: item.includeToken ? getHeader() : {},
          });

          const list = extractListFromResponse(response?.data);
          return {
            [item.dropdown]: list,
          };
        });

        const results = await Promise.all(promises);
        const mergedData = Object.assign({}, ...results);
        setDropdownData(mergedData);
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
        setDropdownData({});
      }
    };

    fetchData();

    return () => {
      setDropdownData({});
    };
    // dropdown_config read when configKey changes (stable URL set)
  }, [configKey, ...extraDeps]);

  return dropdownData;
};

export default useDropDown;
