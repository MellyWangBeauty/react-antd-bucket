import request from "@/utils/request";

export function bucketAdd(data) {
  return request({
    url: "/bucket/add",
    method: "post",
    data,
  });
}

export function bucketUpdate(data) {
  return request({
    url: "/bucket/update",
    method: "post",
    headers: {
      bucketId: data.bucketId,
    },
    data,
  });
}

export function bucketFile(data) {
  return request({
    url: "/bucket/file",
    method: "post",
    headers: {
      bucketId: data.bucketId,
    },
    data,
  });
}

export function bucketQuery() {
  return request({
    url: "/bucket",
    method: "get",
  });
}

export function bucketStatistics(data) {
  return request({
    url: "/statistics",
    method: "post",
    headers: {
      bucketId: data.bucketId,
    },
    data,
  });
}

export function bucketFileDownload(data) {
  return request({
    url: "/file/download",
    method: "post",
    headers: {
      bucketId: data.bucketId,
    },
    data,
  });
}

export function bucketFileBackup(data) {
  return request({
    url: "/file/backup/create",
    method: "post",
    headers: {
      bucketId: data.bucketId,
    },
    data,
  });
}

export function bucketFileCreateDir(data) {
  return request({
    url: "/file/create/dir",
    method: "post",
    headers: {
      bucketId: data.bucketId,
    },
    data,
  });
}

export function bucketFileDelete(data) {
  return request({
    url: "/file/delete",
    method: "post",
    headers: {
      bucketId: data.bucketId,
    },
    data,
  });
}

export function checkExits(data) {
  return request({
    url: "/bucket/checkExits?bucketName=" + data,
    method: "post",
  });
}

export function deleteBucket(data) {
  return request({
    url: "/bucket/delete",
    method: "post",
    headers: {
      bucketId: data,
    },
  });
}

/**
 * 用户授权
 * @param data
 * @returns {*}
 */
export function bucketGrant(data) {
  return request({
    url: "/bucket/grant",
    method: "post",
    headers: {
      bucketId: data.bucketId,
    },
    data,
  });
}
