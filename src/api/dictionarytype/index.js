import request from '@/utils/request'
const DICTIONARYTYPE_URL = '/pcp/basedata/api/v1/dictionarytype'

export function commonQueryDictionarytype (params) {
  return request({
    url: DICTIONARYTYPE_URL,
    method: 'get',
    params
  })
}
export function addDictionarytype (data) {
  return request({
    url: DICTIONARYTYPE_URL,
    method: 'post',
    data
  })
}
export function updateDictionarytype (data) {
  return request({
    url: DICTIONARYTYPE_URL,
    method: 'put',
    data
  })
}
export function removeByIdDictionarytype (params) {
  return request({
    url: DICTIONARYTYPE_URL,
    method: 'delete',
    params
  })
}
export function batchremoveDictionarytype (data) {
  return request({
    url: DICTIONARYTYPE_URL + '/batchremove',
    method: 'delete',
    data
  })
}
export function batchUpdateDictionarytype (data) {
  return request({
    url: DICTIONARYTYPE_URL + '/batchupdate',
    method: 'put',
    data
  })
}
export function queryById (params) {
  return request({
    url: DICTIONARYTYPE_URL + '/querybyid',
    method: 'get',
    params
  })
}
