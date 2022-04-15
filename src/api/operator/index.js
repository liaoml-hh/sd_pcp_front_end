import request from '@/utils/request'
const STATION_OPERATOR_URL = '/pcp/basedata/api/v1/stationoperator'

export function commonqueryStationOperator (params) {
  return request({
    url: STATION_OPERATOR_URL,
    method: 'get',
    params
  })
}
export function addStationOperator (data) {
  return request({
    url: STATION_OPERATOR_URL,
    method: 'post',
    data
  })
}

export function batchAddStationOperator (data) {
  return request({
    url: STATION_OPERATOR_URL + "/batchadd",
    method: 'post',
    data
  })
}
export function updateStationOperator (data) {
  return request({
    url: STATION_OPERATOR_URL,
    method: 'put',
    data
  })
}
export function removeByIdStationOperator (params) {
  return request({
    url: STATION_OPERATOR_URL,
    method: 'delete',
    params
  })
}
export function batchRemoveStationOperator (data) {
  return request({
    url: STATION_OPERATOR_URL + '/batchremove',
    method: 'delete',
    data
  })
}
export function batchUpdateStationOperator (data) {
  return request({
    url: STATION_OPERATOR_URL + '/batchupdate',
    method: 'put',
    data
  })
}
export function queryByIdStationOperator (params) {
  return request({
    url: STATION_OPERATOR_URL + '/querybyid',
    method: 'get',
    params
  })
}