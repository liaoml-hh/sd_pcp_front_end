import request from '@/utils/request'
const RECHARGE_URL = '/pcp/order/api/v1/recharge'
export function commonQueryRecharge(params) {
  return request({
    url: RECHARGE_URL,
    method: 'get',
    params
  })
}
export function addRecharge(data) {
  return request({
    url: RECHARGE_URL,
    method: 'post',
    data
  })
}
export function removeByIdRecharge(params) {
  return request({
    url: RECHARGE_URL,
    method: 'delete',
    params
  })
}
