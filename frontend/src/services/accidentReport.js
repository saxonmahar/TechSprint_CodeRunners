import axiosInstance from "../utils/axios.js";

/**
 * Submit Accident Report
 */
export const submitAccidentReport = async (reportData) => {
  try {
    const response = await axiosInstance.post(
      "/accident/report",
      reportData
    );

    return response.data; // return full backend response
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      "Failed to submit accident report. Please try again.";
    throw new Error(errorMessage);
  }
};

/**
 * Get all accident reports (optional - admin / dashboard)
 */
export const getAllAccidentReports = async () => {
  try {
    const response = await axiosInstance.get("/accident/report");
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      "Failed to fetch accident reports";
    throw new Error(errorMessage);
  }
};

/**
 * Get single accident report by ID (optional)
 */
export const getAccidentReportById = async (id) => {
  try {
    const response = await axiosInstance.get(
      `/api/v1/accident/${id}`
    );
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      "Failed to fetch accident report";
    throw new Error(errorMessage);
  }
};
