import request from '@/utils/request'
const DUTYROSTER_URL = '/pcp/basedata/api/v1/dutyroster'

export function commonQueryDutyRoster (params) {
  return request({
    url: DUTYROSTER_URL,
    method: 'get',
    params
  })
}
export function addDutyRoster (data) {
  return request({
    url: DUTYROSTER_URL,
    method: 'post',
    data
  })
}
export function updateDutyRoster (data) {
  return request({
    url: DUTYROSTER_URL,
    method: 'put',
    data
  })
}
export function removeByIdDutyRoster (params) {
  return request({
    url: DUTYROSTER_URL,
    method: 'delete',
    params
  })
}
export function batchremoveDutyRoster (data) {
  return request({
    url: DUTYROSTER_URL + '/batchremove',
    method: 'delete',
    data
  })
}
export function batchupdateDutyRoster (data) {
  return request({
    url: DUTYROSTER_URL + '/batchupdate',
    method: 'put',
    data
  })
}
export function queryById (params) {
  return request({
    url: DUTYROSTER_URL + '/querybyid',
    method: 'get',
    params
  })
}
