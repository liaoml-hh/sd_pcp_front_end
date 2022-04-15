import request from '@/utils/request'
const MACHINE_URL = '/pcp/basedata/api/v1/machine'
export function commonQueryMachine (params) {
  return request({
    url: MACHINE_URL,
    method: 'get',
    params
  })
}
export function addMachine (data) {
  return request({
    url: MACHINE_URL,
    method: 'post',
    data
  })
}
export function removeByIdMachine (params) {
  return request({
    url: MACHINE_URL,
    method: 'delete',
    params
  })
}
export function batchRemoveMachine (data) {
  return request({
    url: MACHINE_URL + '/batchremove',
    method: 'delete',
    data
  })
}
export function batchUpdateMachine (data) {
  return request({
    url: MACHINE_URL + '/batchupdate',
    method: 'put',
    data
  })
}
export function queryById (params) {
  return request({
    url: MACHINE_URL + '/querybyid',
    method: 'get',
    params
  })
}
export function updateMachine (data) {
  return request({
    url: MACHINE_URL,
    method: 'put',
    data
  })
}
