import request from '@/utils/request'
const DICTIONARY_URL = '/pcp/basedata/api/v1/dictionary'

export function commonQueryDictionary (params) {
  return request({
    url: DICTIONARY_URL,
    method: 'get',
    params
  })
}
export function addDictionary (data) {
  return request({
    url: DICTIONARY_URL,
    method: 'post',
    data
  })
}
export function updateDictionary (data) {
  return request({
    url: DICTIONARY_URL,
    method: 'put',
    data
  })
}
export function removeByIdDictionary (params) {
  return request({
    url: DICTIONARY_URL,
    method: 'delete',
    params
  })
}
export function queryById (params) {
  return request({
    url: DICTIONARY_URL + '/querybyid',
    method: 'get',
    params
  })
}
export function batchRemoveDictionary (data) {
  return request({
    url: DICTIONARY_URL + '/batchremove',
    method: 'delete',
    data
  })
}
export function batchUpdateDictionary (data) {
  return request({
    url: DICTIONARY_URL + '/batchupdate',
    method: 'put',
    data
  })
}
