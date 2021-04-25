import { useEffect, useRef } from "react";

//export const ENDPOINT = "http://localhost:8080/api/";
export const ENDPOINT = (link) => {
  return "http://localhost:8080/api/" + link;
};

export const postRequest = (data) => {
  return {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: data,
  };
};

export const postAuthRequest = (data, token) => {
  return {
    method: "post",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: data,
  };
};

export const postAuthRequestFormData = (data, token) => {
  return {
    method: "post",
    headers: {
      Authorization: token,
    },
    body: data,
  };
};

export const getAuthRequest = (token) => {
  return {
    method: "get",
    headers: {
      Authorization: token,
    },
  };
};

export const Loading = () => {
  return <div>Chargement...</div>;
};
