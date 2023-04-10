import { setUserToken, resetUser } from "./user";
import { reqLogin, reqLogout } from "@/api/login";
import { setToken, removeToken } from "@/utils/auth";
export const login = (username, password) => (dispatch) => {
  return new Promise((resolve, reject) => {
    reqLogin({ userName: username.trim(), userPassword: password })
      .then((response) => {
        const data = response;
        if (data.code === 0) {
          const token = data.data;
          dispatch(setUserToken(token));
          setToken(token);
          resolve(data);
        } else {
          const msg = data.message;
          reject(msg);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const logout = (token) => (dispatch) => {
  return new Promise((resolve, reject) => {
    reqLogout(token)
      .then((response) => {
        const res= response;
        if (res.code === 0) {
          dispatch(resetUser());
          removeToken();
          resolve(res);
        } else {
          const msg = res.message;
          reject(msg);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};
