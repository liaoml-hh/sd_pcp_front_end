import request from '@/utils/request'
const CABINET_URL = '/pcp/basedata/api/v1/cabinet'
export function commonQuerycabinet (params) {
  return request({
    url: CABINET_URL,
    method: 'get',
    params
  })
}
export function addcabinet (data) {
  return request({
    url: CABINET_URL,
    method: 'post',
    data
  })
}
export function removeByIdcabinet (params) {
  return request({
    url: CABINET_URL,
    method: 'delete',
    params
  })
}

export function batchRemovecabinet (data) {
  return request({
    url: CABINET_URL + '/batchremove',
    method: 'delete',
    data
  })
}

export function updatecabinet (data) {
  return request({
    url: CABINET_URL,
    method: 'put',
    data
  })
}

export function batchUpdatecabinet (data) {
  return request({
    url: CABINET_URL + '/batchupdate',
    method: 'put',
    data
  })
}

export function queryById (params) {
  return request({
    url: CABINET_URL + '/querybyid',
    method: 'get',
    params
  })
}
export function bathAddcabinet (data) {
  return request({
    url: CABINET_URL + "/batchadd",
    method: 'post',
    data
  })
}