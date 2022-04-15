import request from '@/utils/request'
const PACKAGE_URL = '/pcp/basedata/api/v1/businessparamstype'
export function commonQueryparametertype(params) {
  return request({
    url: PACKAGE_URL,
    method: 'get',
    params
  })
}
export function addparametertype(data) {
  return request({
    url: PACKAGE_URL,
    method: 'post',
    data
  })
}
export function removeByIdparametertype(params) {
  return request({
    url: PACKAGE_URL,
    method: 'delete',
    params
  })
}

export function batchRemoveparametertype(data) {
  return request({
    url: PACKAGE_URL + '/batchremove',
    method: 'delete',
    data
  })
}

export function updateparametertype(data) {
  return request({
    url: PACKAGE_URL,
    method: 'put',
    data
  })
}

export function batchUpdateparametertype(data) {
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
