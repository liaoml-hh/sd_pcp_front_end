import request from '@/utils/request'
const PACKAGE_URL = '/pcp/basedata/api/v1/batterypackage'
export function commonQueryBatterypackage (params) {
  return request({
    url: PACKAGE_URL,
    method: 'get',
    params
  })
}
export function addBatterypackage (data) {
  return request({
    url: PACKAGE_URL,
    method: 'post',
    data
  })
}
export function removeByIdBatterypackage (params) {
  return request({
    url: PACKAGE_URL,
    method: 'delete',
    params
  })
}

export function batchRemoveBatterypackage (data) {
  return request({
    url: PACKAGE_URL + '/batchremove',
    method: 'delete',
    data
  })
}

export function updateBatterypackage (data) {
  return request({
    url: PACKAGE_URL,
    method: 'put',
    data
  })
}

export function batchUpdateBatterypackage (data) {
  return request({
    url: PACKAGE_URL + '/batchupdate',
    method: 'put',
    data
  })
}

export function queryById (params) {
  return request({
    url: PACKAGE_URL + '/querybyid',
    method: 'get',
    params
  })
}
export function checkNamekExist (params) {
  return request({
    url: PACKAGE_URL + '/checknamekexist',
    method: 'get',
    params
  })
}
