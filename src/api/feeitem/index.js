import request from '@/utils/request'
const CHARGERULE_URL = '/pcp/basedata/api/v1/feeitem'
export function commonQueryFeeItem (params) {
  return request({
    url: CHARGERULE_URL,
    method: 'get',
    params
  })
}
export function addFeeItem (data) {
  return request({
    url: CHARGERULE_URL,
    method: 'post',
    data
  })
}
export function removeByIdFeeItem (params) {
  return request({
    url: CHARGERULE_URL,
    method: 'delete',
    params
  })
}

export function batchRemoveFeeItem (data) {
  return request({
    url: CHARGERULE_URL + "/batchremove",
    method: 'delete',
    data
  })
}
export function queryByIdFeeItem (params) {
  return request({
    url: CHARGERULE_URL + '/querybyid',
    method: 'get',
    params
  })
}

export function updateFeeItem (data) {
  return request({
    url: CHARGERULE_URL,
    method: 'put',
    data
  })
}