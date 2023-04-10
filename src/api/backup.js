import request from "@/utils/request";

export function backUpFile(data) {
  return request({
    url: "/bucket/backup",
    method: "post",
    headers: {
      bucketId: data.bucketId,
    },
    data,
  });
}

export function backUpFileDelete(data) {
  return request({
    url: "/file/backup/delete",
    method: "post",
    headers: {
      bucketId: data.bucketId,
    },
    data,
  });
}

export function backUpFileResume(data) {
  return request({
    url: "/file/backup/recover",
    method: "post",
    headers: {
      bucketId: data.bucketId,
    },
    data,
  });
}
