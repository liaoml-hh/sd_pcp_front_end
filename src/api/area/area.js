/*
 * @Author: Xnew
 * @Description: 
 * @Date: 2022-03-01 17:16:41
 * @LastEditors: Xnew
 * @LastEditTime: 2022-03-09 11:03:56
 */
import request from '@/utils/request'
const AREA_URL = '/pcp/basedata/api/v1/area'

export function commonQueryArea (params) {
  return request({
    url: AREA_URL,
    method: 'get',
    params
  })
}
export function addArea (data) {
  return request({
    url: AREA_URL,
    method: 'post',
    data
  })
}
export function updateArea (data) {
  return request({
    url: AREA_URL,
    method: 'put',
    data
  })
}
export function removeByIdArea (params) {
  return request({
    url: AREA_URL,
    method: 'delete',
    params,
  })
}
export function batchRemoveArea (data) {
  return request({
    url: AREA_URL + '/batchremove',
    method: 'delete',
    data
  })
}
export function batchUpdateArea (data) {
  return request({
    url: AREA_URL + '/batchupdate',
    method: 'put',
    data
  })
}
export function queryById (params) {
  return request({
    url: AREA_URL + '/querybyid',
    method: 'get',
    params
  })
}

