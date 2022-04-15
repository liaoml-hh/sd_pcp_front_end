

import request from '@/utils/request'
const CHARGERULE_URL = '/pcp/basedata/api/v1/chargerule'
export function commonQueryChargeRule (params) {
  return request({
    url: CHARGERULE_URL,
    method: 'get',
    params
  })
}
export function addChargeRule (data) {
  return request({
    url: CHARGERULE_URL,
    method: 'post',
    data
  })
}
export function removeByIdChargeRule (params) {
  return request({
    url: CHARGERULE_URL,
    method: 'delete',
    params
  })
}

export function batchRemove (data) {
  return request({
    url: CHARGERULE_URL + "/batchremove",
    method: 'delete',
    data
  })
}
export function batchUpdate (data) {
  return request({
    url: CHARGERULE_URL + "/batchupdate",
    method: 'put',
    data
  })
}
export function queryById (params) {
  return request({
    url: CHARGERULE_URL + '/querybyid',
    method: 'get',
    params
  })
}

export function updateChargeRule (data) {
  return request({
    url: CHARGERULE_URL,
    method: 'put',
    data
  })
}



