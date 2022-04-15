import request from '@/utils/request'
const EXCHANGEORDER_URL = '/pcp/order/api/v1/order'
export function commonQueryApply (params) {
  return request({
    url: EXCHANGEORDER_URL,
    method: 'get',
    params
  })
}
export function allsumprice (params) {
  return request({
    url: EXCHANGEORDER_URL + '/allsumprice',
    method: 'get',
    params
  })
}
export function todaysumprice (params) {
  return request({
    url: EXCHANGEORDER_URL + '/todaysumprice',
    method: 'get',
    params
  })
}
