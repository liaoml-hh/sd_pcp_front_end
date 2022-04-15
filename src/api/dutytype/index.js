import request from '@/utils/request'
const DUTYTYPE_URL = '/pcp/basedata/api/v1/dutytype'

export function commonQueryDutyType (params) {
  return request({
    url: DUTYTYPE_URL,
    method: 'get',
    params
  })
}
export function addDutyType (data) {
  return request({
    url: DUTYTYPE_URL,
    method: 'post',
    data
  })
}
export function updateDutyType (data) {
  return request({
    url: DUTYTYPE_URL,
    method: 'put',
    data
  })
}
export function removeByIdDutyType (params) {
  return request({
    url: DUTYTYPE_URL,
    method: 'delete',
    params
  })
}
export function batchremoveDutyType (data) {
  return request({
    url: DUTYTYPE_URL + '/batchremove',
    method: 'delete',
    data
  })
}
export function batchupdateDutyType (data) {
  return request({
    url: DUTYTYPE_URL + '/batchupdate',
    method: 'put',
    data
  })
}
export function queryById (params) {
  return request({
    url: DUTYTYPE_URL + '/querybyid',
    method: 'get',
    params
  })
}
