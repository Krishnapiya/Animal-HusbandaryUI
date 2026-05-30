import axios from "axios";
import { useState } from "react";
// import { getItemPostList } from "../api-client/apiCall";
import { toast } from "material-react-toastify";

const BASE_API_URL = import.meta.env.VITE_APP_BASE_API_URL;

import { getHeader } from "../utils";
const changeParameterMapping = (
  fetchParams,
  office_mapping_level,
  spatial_filter,
) => {
  if (spatial_filter === "revenue_jurisdiction") {
    if (fetchParams.id__in.length > 0)
      return { spatial_village_ids: fetchParams.id__in };
    if (fetchParams.taluk__in.length > 0)
      return { spatial_taluk_ids: fetchParams.taluk__in };
    if (fetchParams.taluk__district__in.length > 0)
      return { spatial_district_ids: fetchParams.taluk__district__in };
    return {};
  }
  if (spatial_filter === "lsgd") {
    if (fetchParams.id__in.length > 0)
      return { spatial_local_body_ids: fetchParams.id__in };
    if (fetchParams.district__in.length > 0)
      return { spatial_district_ids: fetchParams.district__in };
    return {};
  }
  if (office_mapping_level === "station") {
    if (fetchParams?.id__in.length > 0)
      return { station__in: fetchParams?.id__in };
    if (fetchParams?.parent_level__in.length > 0)
      return { station__parent_level__in: fetchParams?.parent_level__in };
    if (fetchParams?.parent_level__parent_level__in.length > 0)
      return {
        station__parent_level__parent_level__in:
          fetchParams?.parent_level__parent_level__in,
      };
    if (fetchParams?.parent_level__parent_level__parent_level__in.length > 0)
      return {
        station__parent_level__parent_level__parent_level__in:
          fetchParams?.parent_level__parent_level__parent_level__in,
      };
  }
  if (office_mapping_level === "office_spatial") {
    if (fetchParams?.id__in.length > 0)
      return { spatial_office_ids: fetchParams?.id__in };
    if (fetchParams?.parent_level__in.length > 0)
      return { spatial_office_ids: fetchParams?.parent_level__in };
    if (fetchParams?.parent_level__parent_level__in.length > 0)
      return {
        spatial_office_ids: fetchParams?.parent_level__parent_level__in,
      };
    if (fetchParams?.parent_level__parent_level__parent_level__in.length > 0)
      return {
        spatial_office_ids:
          fetchParams?.parent_level__parent_level__parent_level__in,
      };
  }
  return fetchParams;
};
const useFetchGeoJSON = (apiURL, handleClose) => {
  const [geoJSONData, setGeoJSONData] = useState(null);
  const [progress, setProgress] = useState(0);
  const [fetchParams, setFetchParams] = useState({});
  const [isDataLoading, setIsDataLoading] = useState(false);
  const handleSearchData = (key) => {
    setFetchParams({
      ...fetchParams,
      search: key,
    });
  };
  const handleFilterData = (
    params,
    office_mapping_level = null,
    spatial_filter,
  ) => {
    const mappedParams = changeParameterMapping(
      fetchParams,
      office_mapping_level,
      spatial_filter,
    );
    (async () => {
      setIsDataLoading(true);

      try {
        const config = {
          method: "POST",
          baseURL: BASE_API_URL,
          url: apiURL,
          data: office_mapping_level ? { ...mappedParams, ...params } : params,
          params: { geo_json: true },
          headers: getHeader(),
        };
        setProgress(0);
        const response = await axios({
          ...config,
          onDownloadProgress: (progressEvent) => {
            const percentageProgress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total,
            );
            setProgress(percentageProgress);
          },
        });
        const feature_count = response.data.features.length;
        if (feature_count === 0) {
          toast.info("No Data Found !!!");
        } else {
          setGeoJSONData(response.data);
          if (feature_count == 1) {
            toast.success("1 Entry Found");
          } else {
            toast.success(`${feature_count} Entries Found`);
          }
        }
      } catch (error) {
        toast.error(error.response.data.detail);
      } finally {
        setTimeout(() => {
          setIsDataLoading(false);
        }, 1);
        handleClose();
      }
    })();
  };
  const handleClearFetchParams = () => {
    setFetchParams({});
  };

  return {
    geoJSONData,
    progress,
    isDataLoading,
    fetchParams,
    setFetchParams,
    handleSearchData,
    handleFilterData,
    handleClearFetchParams,
    //handleRefreshData
  };
};

export default useFetchGeoJSON;
