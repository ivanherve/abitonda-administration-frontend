import { useEffect, useRef } from "react";

//export const ENDPOINT = "http://localhost:8080/api/";
export const ENDPOINT = (link) => {
  let http = "http://";
  // let domain = "localhost:8080";
  let domain = "vps-7bed9a50.vps.ovh.net:8082";
  let api = "/api/";
  let wholeLink = http + domain + api + link;
  return wholeLink;
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
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: data,
  };
};

export const putAuthRequest = (data, token) => {
  return {
    method: "PUT",
    headers: {
      Authorization: token,
      "Content-Type": "application/json",
    },
    body: data,
  };
};

export const postAuthRequestFormData = (data, token) => {
  return {
    method: "post",
    headers: {
      "Authorization": token,
    },
    body: data,
  };
};

export const getAuthRequest = (token) => {
  return {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": token,
    },
  };
};

export const Loading = () => {
  return <div>Chargement...</div>;
};
