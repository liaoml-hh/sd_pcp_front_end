import request from '@/utils/request'
const COUPON_URL = '/pcp/basedata/api/v1/coupon'

export function commonQueryCoupon (params) {
  return request({
    url: COUPON_URL,
    method: 'get',
    params
  })
}
export function addCoupon (data) {
  return request({
    url: COUPON_URL,
    method: 'post',
    data
  })
}
export function updateCoupon (data) {
  return request({
    url: COUPON_URL,
    method: 'put',
    data
  })
}
export function removeByIdCoupon (params) {
  return request({
    url: COUPON_URL,
    method: 'delete',
    params
  })
}
export function batchremoveCoupon (data) {
  return request({
    url: COUPON_URL + '/batchremove',
    method: 'delete',
    data
  })
}
export function batchupdateCoupon (data) {
  return request({
    url: COUPON_URL + '/batchupdate',
    method: 'put',
    data
  })
}
export function queryById (params) {
  return request({
    url: COUPON_URL + '/querybyid',
    method: 'get',
    params
  })
}
