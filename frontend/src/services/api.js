import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000",
  timeout: 10000,
});

const unwrapList = (data) => {
  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.value)) {
    return data.value;
  }

  if (Array.isArray(data?.data)) {
    return data.data;
  }

  if (Array.isArray(data?.results)) {
    return data.results;
  }

  return [];
};

export const getCoverage = async () => {
  const response = await API.get("/api/ai/coverage");
  console.log("Coverage API response:", response.data);
  return unwrapList(response.data);
};

export const getAnomalies = async () => {
  const response = await API.get("/api/ai/anomalies");
  return unwrapList(response.data);
};

export const getResources = async () => {
  const response = await API.get("/api/ai/resources");
  return unwrapList(response.data);
};

export const getPerformance = async () => {
  const response = await API.get("/api/ai/performance");
  return unwrapList(response.data);
};

export const getGeographicGaps = async () => {
  const response = await API.get("/api/ai/geographic-gaps");
  return unwrapList(response.data);
};

export const getOverlaps = async () => {
  const response = await API.get("/api/ai/overlaps");
  return unwrapList(response.data);
};

export const getRecommendations = async () => {
  const response = await API.get("/api/ai/recommendations");
  return unwrapList(response.data);
};

export default API;
