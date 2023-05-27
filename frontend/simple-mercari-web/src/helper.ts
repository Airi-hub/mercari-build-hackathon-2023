import { toast } from "react-toastify";
import { server } from "./common/constants";

const wrap = <T>(task: Promise<Response>): Promise<T> => {
  return new Promise((resolve, reject) => {
    task
      .then((response) => {
        if (response.ok) {
          response
            .json()
            .then((json) => {
              // jsonが取得できた場合だけresolve
              resolve(json);
            })
            .catch((error) => {
              reject(error);
            });
        } else {
          reject(response);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const wrapBlob = (task: Promise<Response>): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    task
      .then((response) => {
        if (response.ok) {
          response
            .blob()
            .then((blob) => {
              // jsonが取得できた場合だけresolve
              resolve(blob);
            })
            .catch((error) => {
              reject(error);
            });
        } else {
          reject(new Error(`${response.status}: ${response.statusText}`));
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const fetcher = <T = any>(
  url: string,
  init?: RequestInit
): Promise<T> => {
  return wrap<T>(fetch(server.concat(url), init));
};

export const fetcherBlob = (url: string, init?: RequestInit): Promise<Blob> => {
  return wrapBlob(fetch(server.concat(url), init));
};

export const getGetParams = (token?:string) => ({
  method: "GET",
  headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
  },
})

export const getPostParams = (values: KeyValues, token?:string) => ({
  method: "POST",
  headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  body: JSON.stringify(values),
})

export const handleGetError = (err: any) => {
  console.log(`POST error:`, err);
  toast.error(err.message);
}

export const handlePostError = (err: any) => {
  console.log(`POST error:`, err);
  toast.error(err.message);
}

export const classNames = (...classes: string[]): string => {
  return classes.filter(Boolean).join(' ')
}