import request from '@/utils/request'
const PACKAGE_URL = '/pcp/basedata/api/v1/businessparams'
export function commonQueryparameter(params) {
  return request({
    url: PACKAGE_URL,
    method: 'get',
    params
  })
}
export function addparameter(data) {
  return request({
    url: PACKAGE_URL,
    method: 'post',
    data
  })
}
export function removeByIdparameter(params) {
  return request({
    url: PACKAGE_URL,
    method: 'delete',
    params
  })
}

export function batchRemoveparameter(data) {
  return request({
    url: PACKAGE_URL + '/batchremove',
    method: 'delete',
    data
  })
}

export function updateparameter(data) {
  return request({
    url: PACKAGE_URL,
    method: 'put',
    data
  })
}

export function batchUpdateparameter(data) {
  return request({
    url: PACKAGE_URL + '/batchupdate',
    method: 'put',
    data
  })
}

export function queryById(params) {
  return request({
    url: PACKAGE_URL + '/querybyid',
    method: 'get',
    params
  })
}
