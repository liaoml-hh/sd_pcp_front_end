import request from '@/utils/request'
const CONFIG_URL = '/pcp/basedata/api/v1/configsqno'
export function commonQueryConfig(params) {
  return request({
    url: CONFIG_URL,
    method: 'get',
    params
  })
}
export function addConfig(data) {
  return request({
    url: CONFIG_URL,
    method: 'post',
    data
  })
}
export function removeByIdConfig(params) {
  return request({
    url: CONFIG_URL,
    method: 'delete',
    params
  })
}
export function commonQuerycode(params) {
  return request({
    url: CONFIG_URL + '/getcode',
    method: 'get',
    params
  })
}
export function batchRemoveConfig(data) {
  return request({
    url: CONFIG_URL + '/batchremove',
    method: 'delete',
    data
  })
}

export function updateConfig(data) {
  return request({
    url: CONFIG_URL,
    method: 'put',
    data
  })
}

export function batchUpdateConfig(data) {
  return request({
    url: CONFIG_URL + '/batchupdate',
    method: 'put',
    data
  })
}

export function queryById(params) {
  return request({
    url: CONFIG_URL + '/querybyid',
    method: 'get',
    params
  })
}
