
import request from '@/utils/request'
const APPLY_URL = '/pcp/entry/api/v1/powerapply'

export function commonQueryApply (params) {
  return request({
    url: APPLY_URL,
    method: 'get',
    params
  })
}
export function addApply (data) {
  return request({
    url: APPLY_URL,
    method: 'post',
    data
  })
}
export function updateApply (data) {
  return request({
    url: APPLY_URL,
    method: 'put',
    data
  })
}
export function removeByIdApply (params) {
  return request({
    url: APPLY_URL,
    method: 'delete',
    params
  })
}
export function updataeAuditpass (data) {
  return request({
    url: APPLY_URL + '/checkpowerapply',
    method: 'put',
    data
  })
}
export function batchAuditPass (data) {
  return request({
    url: APPLY_URL + '/batchauditpass',
    method: 'put',
    data
  })
}

export function yearweekappointment (params) {
  return request({
    url: APPLY_URL + '/yearweekappointment?bytes=-3,-2,-1,0,1,2,3,4,5,6,7,8',
    method: 'get',
    params
  })
}
export function todayappointment (params) {
  return request({
    url: APPLY_URL + '/todayappointment?bytes=6,7,8',
    method: 'get',
    params
  })
}
export function todayreserved (params) {
  return request({
    url: APPLY_URL + '/todayappointment?bytes=-3,-2,-1,0,1,2,3,4,5,6,7,8',
    method: 'get',
    params
  })
}
export function countallpower (params) {
  return request({
    url: APPLY_URL + '/countallpower?bytes=-3,-2,-1,0,1,2,3,4,5,6,7,8',
    method: 'get',
    params
  })
}
export function agreeToSiteApplication (data) {
  return request({
    url: "/pcp/entry/api/v1/cmd/agreetositeapplication",
    method: 'put',
    data
  })
}