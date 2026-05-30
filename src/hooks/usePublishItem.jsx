import { toast } from "material-react-toastify";
import { publishItem } from "../api-client/apiCall";
const usePublishItem = async (api_url, id, handleRefreshTable) => {
  const response = await publishItem(api_url, id);
  if (response.isSuccess) {
    if (response.data.is_published) toast.success(" Published Sucessfully");
    else toast.success("Un Published Sucessfully");
    handleRefreshTable();
  } else {
    if (response.data.detail) toast.error(response.data.detail);
    else toast.error("Some Thing Went Wrong");
  }
};

export default usePublishItem;
