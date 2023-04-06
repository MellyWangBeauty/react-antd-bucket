import request from "@/utils/request";

export function reqLogin(data) {
  return request({
    url: "/user/login",
    method: "post",
    data,
  });
}

export function reqLogout(data) {
  return request({
    url: "/user/logout",
    method: "post",
    data,
  });
}

export function register(data) {
  return request({
    url: "/user/register/email",
    method: "post",
    data,
  });
}
export function sendcode(data) {
  return request({
    url: "/user/register/sendcode",
    method: "post",
    data,
  });
}
