import { EncryptStorage } from "encrypt-storage";

export const removeDuplicateKeyValuePairs = (array) => {
  const uniqueArray = [];
  const seenIds = new Set();

  array.forEach((item) => {
    if (!seenIds.has(item.id)) {
      seenIds.add(item.id);
      uniqueArray.push(item);
    }
  });

  return uniqueArray;
};

export const parseURLParams = (search) => {
  const params = new URLSearchParams(search);
  const paramsObj = {};
  for (const [key, value] of params.entries()) {
    paramsObj[key] = key.includes("__") ? [value] : value;
  }
  return paramsObj;
};
import { toast } from "material-react-toastify";

export const downloadFile = (url) => {
  const fileNameWithExtension = url.substring(url.lastIndexOf("/") + 1);
  fetch(url)
    .then((response) => response.blob())
    .then((blob) => {
      const href = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = href;
      link.setAttribute("download", fileNameWithExtension); //or any other extension
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(href);
    })
    .catch((error) => {
      toast.error("Error downloading the file:", error);
    });
};

export const yymmdd_to_ddmmyy = (data) => {
  return data;
};

export const filterArrayOfObjectsByValue = (array, string) => {
  return array.filter((o) =>
    Object.keys(o).some((k) =>
      String(o[k]).toLowerCase().includes(string.toLowerCase()),
    ),
  );
};

export const formatBytes = (bytes) => {
  if (bytes < 0) return "Invalid value";
  if (bytes === 0) return "0 Bytes";

  const units = ["Bytes", "KB", "MB", "GB"];
  let index = 0;

  // Use a loop to determine the appropriate unit
  while (bytes >= 1024 && index < units.length - 1) {
    bytes /= 1024;
    index++;
  }

  // Return the value with appropriate unit
  return `${bytes.toFixed(2)} ${units[index]}`;
};

export const isValidURL = (urlString) => {
  try {
    new URL(urlString);
    return true; // Valid URL
  } catch (e) {
    console.log(e);
    return false; // Invalid URL
  }
};

const secret_key =
  import.meta.env.VITE_LOCAL_STORAGE_ENCRYPT_KEY || "secret-key-123";

export const encryptStorage = new EncryptStorage(secret_key, {
  doNotParseValues: true,
});

export const getCurrentOffice = () => {
  return encryptStorage.getItem("officeId");
};

export const getHeader = () => {
  const userDataStr = encryptStorage.getItem("userAuthDetails");
  if (!userDataStr) return null;

  const data = JSON.parse(userDataStr);
  const token = data?.token;  // ✅ EXACTLY where your token is

  if (token) {
    console.log("token is:", token);
    return { Authorization: "Bearer " + token };
  }

  return null;
};

export const getUserAttributes = () => {
  const userStr = encryptStorage.getItem("userAuthDetails");
  if (!userStr) return null;

  try {
    const userDetails = JSON.parse(userStr)?.user;
    return userDetails;
  } catch (err) {
    console.error("Failed to parse userAuthDetails:", err);
    return null;
  }
};

