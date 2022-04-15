import request from '@/utils/request'
const AUDIT_URL = '/pcp/basedata/api/v1/auditrule'
export function commonQueryAudit(params) {
  return request({
    url: AUDIT_URL,
    method: 'get',
    params
  })
}
export function addAudit(data) {
  return request({
    url: AUDIT_URL,
    method: 'post',
    data
  })
}
export function removeByIdAudit(params) {
  return request({
    url: AUDIT_URL,
    method: 'delete',
    params
  })
}

export function batchRemoveAudit(data) {
  return request({
    url: AUDIT_URL + '/batchremove',
    method: 'delete',
    data
  })
}

export function updateAudit(data) {
  return request({
    url: AUDIT_URL,
    method: 'put',
    data
  })
}

export function batchUpdateAudit(data) {
  return request({
    url: AUDIT_URL + '/batchupdate',
    method: 'put',
    data
  })
}

export function queryById(params) {
  return request({
    url: AUDIT_URL + '/querybyid',
    method: 'get',
    params
  })
}
