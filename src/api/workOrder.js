import request from '@/utils/request'

export function workOrderAdd(data) {
  return request({
    url: '/workOrder/submit',
    method: 'post',
    data
  })
}