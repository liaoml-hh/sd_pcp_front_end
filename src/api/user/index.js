import request from '@/utils/request'
const USER_URL = '/pcp/basedata/api/v1/user'
// const USER_URL = '/pcp/entry/api/v1/user'

const USERDISTRIBUTE_URL = '/pcp/basedata/api/v1/user/userdistribute'
export function commonQueryUser (params) {
  return request({
    url: USER_URL,
    method: 'get',
    params
  })
}
export function addUser (data) {
  return request({
    url: USER_URL,
    method: 'post',
    data
  })
}
export function removeByIdUser (params) {
  return request({
    url: USER_URL,
    method: 'delete',
    params
  })
}
export function userdistribute (params) {
  return request({
    url: USERDISTRIBUTE_URL,
    method: 'get',
    params
  })
}
export function batchpdateUserLockStatus (data) {
  return request({
    url: USER_URL + "/batchupdateuserlockstatus",
    method: 'put',
    data
  })
}
export function updateUserLockStatus (data) {
  return request({
    url: USER_URL + "/updateuserlockstatus",
    method: 'put',
    data
  })
}