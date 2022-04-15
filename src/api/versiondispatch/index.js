import request from '@/utils/request'
const VERSIONDISPATCH_URL = '/pcp/basedata/api/v1/versiondispatch'
export function commonQueryVersionDispatch (params) {
  return request({
    url: VERSIONDISPATCH_URL,
    method: 'get',
    params
  })
}
export function addVersionDispatch (data) {
  return request({
    url: VERSIONDISPATCH_URL,
    method: 'post',
    data
  })
}
export function removeByIdVersionDispatch (params) {
  return request({
    url: VERSIONDISPATCH_URL,
    method: 'delete',
    params
  })
}

export function updateVersionDispatch (data) {
  return request({
    url: VERSIONDISPATCH_URL,
    method: 'put',
    data
  })
}

export function queryByIdVsersionDispatch (params) {
  return request({
    url: VERSIONDISPATCH_URL + '/querybyid',
    method: 'get',
    params
  })
}

export function batchAddVsersionDispatch (data) {
  return request({
    url: VERSIONDISPATCH_URL + '/batchadd',
    method: 'put',
    data
  })
}
