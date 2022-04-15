import request from '@/utils/request'
const STOCK_URL = '/pcp/basedata/api/v1/batterystock'
export function commonQuerybatterystock(params) {
  return request({
    url: STOCK_URL,
    method: 'get',
    params
  })
}
export function addbatterystock(data) {
  return request({
    url: STOCK_URL,
    method: 'post',
    data
  })
}
export function removeByIdbatterystock(params) {
  return request({
    url: STOCK_URL,
    method: 'delete',
    params
  })
}

export function batchRemovebatterystock(data) {
  return request({
    url: STOCK_URL + '/batchremove',
    method: 'delete',
    data
  })
}

export function updatebatterystock(data) {
  return request({
    url: STOCK_URL,
    method: 'put',
    data
  })
}

export function batchUpdatebatterystock(data) {
  return request({
    url: STOCK_URL + '/batchupdate',
    method: 'put',
    data
  })
}

export function queryById(params) {
  return request({
    url: STOCK_URL + '/querybyid',
    method: 'get',
    params
  })
}
