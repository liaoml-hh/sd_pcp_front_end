import request from '@/utils/request'
const APPVERSION_URL = '/pcp/basedata/api/v1/appversion'
export function commonQueryAppVersion (params) {
  return request({
    url: APPVERSION_URL,
    method: 'get',
    params
  })
}
export function addAppVersion (data) {
  return request({
    url: APPVERSION_URL,
    method: 'post',
    data
  })
}
export function removeByIdAppVersion (params) {
  return request({
    url: APPVERSION_URL,
    method: 'delete',
    params
  })
}

export function updateAppVersion (data) {
  return request({
    timeout: 200000,
    url: APPVERSION_URL + "/update",
    method: 'post',
    data,
    headers: {
      "Content-Type": "multipart/form-data"
    }
  })
}

export function queryAppById (params) {
  return request({
    url: APPVERSION_URL + '/querybyid',
    method: 'get',
    params
  })
}
export function addAppVsersionFile (data) {
  return request({
    timeout: 200000,
    url: APPVERSION_URL + '/addappversionfile',
    method: 'post',
    data,
    headers: {
      "Content-Type": "multipart/form-data"
    }
  })
}


export function batchDeleteAppVersion (data) {
  return request({
    url: APPVERSION_URL + '/batchdel',
    method: 'delete',
    data
  })
}

export function batchUpdateAppVersion (data) {
  return request({
    url: APPVERSION_URL + '/batchupdate',
    method: 'put',
    data
  })
}
