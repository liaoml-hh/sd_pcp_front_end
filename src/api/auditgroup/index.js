import request from '@/utils/request'
const AUDITGROUP_URL = '/pcp/basedata/api/v1/auditgroup'
export function commonQueryAuditgroup(params) {
  return request({
    url: AUDITGROUP_URL,
    method: 'get',
    params
  })
}
export function addAuditgroup(data) {
  return request({
    url: AUDITGROUP_URL,
    method: 'post',
    data
  })
}
export function updateAuditgroup(data) {
  return request({
    url: AUDITGROUP_URL,
    method: 'put',
    data
  })
}
export function removeByIdAuditgroup(params) {
  return request({
    url: AUDITGROUP_URL,
    method: 'delete',
    params
  })
}

export function batchupadateAuditgroup(data) {
  return request({
    url: AUDITGROUP_URL + '/batchupdate',
    method: 'put',
    data
  })
}
export function batchremoveAuditgroup(data) {
  return request({
    url: AUDITGROUP_URL + '/batchremove',
    method: 'delete',
    data
  })
}
export function queryByIdAuditgroup(params) {
  return request({
    url: AUDITGROUP_URL + '/querybyid',
    method: 'get',
    params
  })
}

