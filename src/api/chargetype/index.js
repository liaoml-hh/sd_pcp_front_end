
import request from '@/utils/request'
const CHARGETYPE_URL = '/pcp/basedata/api/v1/chargetype'
export function commonQueryChargeType(params) {
  return request({
    url: CHARGETYPE_URL,
    method: 'get',
    params
  })
}
export function addChargeType(data) {
  return request({
    url: CHARGETYPE_URL,
    method: 'post',
    data
  })
}
export function removeByIdChargeType(params) {
  return request({
    url: CHARGETYPE_URL,
    method: 'delete',
    params
  })
}

export function batchRemoveChargeType(data) {
  return request({
    url: CHARGETYPE_URL + '/batchremove',
    method: 'delete',
    data
  })
}

export function updateChargeType(data) {
  return request({
    url: CHARGETYPE_URL,
    method: 'put',
    data
  })
}

export function batchUpdateChargeType(data) {
  return request({
    url: CHARGETYPE_URL + '/batchupdate',
    method: 'put',
    data
  })
}

export function queryById(params) {
  return request({
    url: CHARGETYPE_URL + '/querybyid',
    method: 'get',
    params
  })
}
