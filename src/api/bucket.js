import request from '@/utils/request'

export function bucketAdd(data) {
  return request({
    url: '/bucket/add',
    method: 'post',
    data
  })
}
export function bucketQuery() {
  return request({
    url: '/bucket',
    method: 'get'
  })
}
export function checkExits(data) {
  return request({
    url: '/bucket/checkExits?bucketName='+data,
    method: 'post',
  })
}
export function deleteBucket(data) {
  return request({
    url: '/bucket/delete',
    method: 'post',
    headers:{
      bucketId:data
    }
  })
}