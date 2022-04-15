import request from '@/utils/request'
const CABINETDETAIL_URL = '/pcp/basedata/api/v1/cabinetdetail'
export function commonQuerycabinetdetail (params) {
  return request({
    url: CABINETDETAIL_URL,
    method: 'get',
    params
  })
}
export function addcabinetdetail (data) {
  return request({
    url: CABINETDETAIL_URL,
    method: 'post',
    data
  })
}
export function removeByIdcabinetdetail (params) {
  return request({
    url: CABINETDETAIL_URL,
    method: 'delete',
    params
  })
}

export function updatecabinetdetail (data) {
  return request({
    url: CABINETDETAIL_URL,
    method: 'put',
    data
  })
}

export function bathAddcabinetdetail (data) {
  return request({
    url: CABINETDETAIL_URL + '/batchadd',
    method: 'post',
    data
  })
}

export function queryById (params) {
  return request({
    url: CABINETDETAIL_URL + '/querybyid',
    method: 'get',
    params
  })
}
