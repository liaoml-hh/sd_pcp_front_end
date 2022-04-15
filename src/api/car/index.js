import request from '@/utils/request'
const CAR_URL = '/pcp/basedata/api/v1/car'
export function commonQueryCar (params) {
  return request({
    url: CAR_URL,
    method: 'get',
    params
  })
}
export function addCar (data) {
  return request({
    url: CAR_URL,
    method: 'post',
    data
  })
}
export function removeByIdCar (params) {
  return request({
    url: CAR_URL,
    method: 'delete',
    params
  })
}

export function batchRemoveCar (data) {
  return request({
    url: CAR_URL + '/batchremove',
    method: 'delete',
    data
  })
}

export function updateCar (data) {
  return request({
    url: CAR_URL,
    method: 'put',
    data
  })
}

export function batchUpdateCar (data) {
  return request({
    url: CAR_URL + '/batchupdate',
    method: 'put',
    data
  })
}

export function queryById (params) {
  return request({
    url: CAR_URL + '/querybyid',
    method: 'get',
    params
  })
}

export function checkCarNo (params) {
  return request({
    url: CAR_URL + '/checkcarno',
    method: 'get',
    params
  })
}
export function queryPowerType (params) {
  return request({
    url: '/pcp/basedata/api/v1/dictionary?dictionaryTypeId=1461525103069233152',
    method: 'get',
    params
  })
}