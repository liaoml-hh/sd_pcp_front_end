import request from '@/utils/request'
const USERCOUPON_URL = '/pcp/basedata/api/v1/usercoupon'

export function commonQueryUserCoupon (params) {
  return request({
    url: USERCOUPON_URL,
    method: 'get',
    params
  })
}
export function addUserCoupon (data) {
  return request({
    url: USERCOUPON_URL,
    method: 'post',
    data
  })
}
export function updateUserCoupon (data) {
  return request({
    url: USERCOUPON_URL,
    method: 'put',
    data
  })
}
export function removeByIdUserCoupon (params) {
  return request({
    url: USERCOUPON_URL,
    method: 'delete',
    params
  })
}
export function batchaddUserCoupon (data) {
  return request({
    url: USERCOUPON_URL + '/batchadd',
    method: 'post',
    data
  })
}
export function batchremoveUserCoupon (data) {
  return request({
    url: USERCOUPON_URL + '/batchremove',
    method: 'delete',
    data
  })
}
export function batchupdateUserCoupon (data) {
  return request({
    url: USERCOUPON_URL + '/batchupdate',
    method: 'put',
    data
  })
}
export function queryById (params) {
  return request({
    url: USERCOUPON_URL + '/querybyid',
    method: 'get',
    params
  })
}
