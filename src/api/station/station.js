/*
 * @Author: Xnew
 * @Description: 
 * @Date: 2021-12-27 09:31:44
 * @LastEditors: Xnew
 * @LastEditTime: 2021-12-29 09:37:06
 */
import request from '@/utils/request'
const STATION_URL = '/pcp/basedata/api/v1/station'

export function commonQueryStation (params) {
  return request({
    url: STATION_URL,
    method: 'get',
    params
  })
}
export function commonQueryStationStatus (params) {
  return request({
    url: "/pcp/common/warning/api/v1/status",
    method: 'get',
    params
  })
}
export function commonQueryStationStatusList (params) {
  return request({
    url: "/pcp/common/warning/api/v1/status/findByStationId",
    method: 'get',
    params
  })
}
export function addStation (data) {
  return request({
    url: STATION_URL,
    method: 'post',
    data
  })
}
export function updateStation (data) {
  return request({
    url: STATION_URL,
    method: 'put',
    data
  })
}
export function batchUpdateStation (data) {
  return request({
    url: STATION_URL + "/batchupdate",
    method: 'put',
    data
  })
}
export function batchAddStation (data) {
  return request({
    url: STATION_URL + "/batchadd",
    method: 'post',
    data
  })
}
export function removeByIdStation (params) {
  return request({
    url: STATION_URL,
    method: 'delete',
    params
  })
}
export function batchRemoveStation (data) {
  return request({
    url: STATION_URL + '/batchremove',
    method: 'delete',
    data
  })
}
export function queryById (params) {
  return request({
    url: STATION_URL + '/querybyid',
    method: 'get',
    params
  })
}

export function stationdistribute (params) {

  return request({
    url: STATION_URL + '/stationdistribute',
    method: 'get',
    params
  })
}

export function countenablestation (params) {
  return request({
    url: STATION_URL + '/countenablestation?bytes=-3,-2,-1,0,1,2,3,4,5,6,7,8',
    method: 'get',
    params
  })
}

export function stationStatus (params) {
  return request({
    url: STATION_URL + "/countstatus",
    method: 'get',
    params
  })
}
export function sitePlanningStatistics (params) {
  return request({
    url: STATION_URL + "/siteplanningstatistics",
    method: 'get',
    params
  })
}


export function refreshTheConfiguration (params) {
  return request({
    url: "/pcp/entry/api/v1/cmd/getconfig",
    method: 'get',
    params
  })
}