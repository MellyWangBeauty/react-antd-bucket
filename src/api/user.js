import request from '@/utils/request'

export function reqUserInfo(data) {
  return request({
    url: '/user/get/login',
    method: 'get',
    data
  })
}

export function getUsers() {
  return request({
    url: '/user/list',
    method: 'get'
  })
}

export function deleteUser(data) {
  return request({
    url: '/user/delete',
    method: 'post',
    data
  })
}

export function editUser(data) {
  return request({
    url: '/user/update',
    method: 'post',
    data
  })
}

export function applyKey(data) {
  return request({
    url: '/user/key/apply',
    method: 'post',
    data
  })
}

export function reqValidatUserID(data) {
  return request({
    url: '/user/validatUserID',
    method: 'post',
    data
  })
}

export function addUser(data) {
  return request({
    url: '/user/add',
    method: 'post',
    data
  })
}