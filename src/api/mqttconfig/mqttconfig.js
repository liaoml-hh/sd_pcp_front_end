import request from '@/utils/request'
const MQTTCONFIG_URL = '/pcp/basedata/api/v1/mqttconfig'

export function commonQueryMqttconfig(params) {
  return request({
    url: MQTTCONFIG_URL,
    method: 'get',
    params
  })
}
export function addMqttconfig(data) {
  return request({
    url: MQTTCONFIG_URL,
    method: 'post',
    data
  })
}
export function updateMqttconfig(data) {
  return request({
    url: MQTTCONFIG_URL,
    method: 'put',
    data
  })
}
export function removeByIdMqttconfig(params) {
  return request({
    url: MQTTCONFIG_URL,
    method: 'delete',
    params
  })
}
export function batchRemoveMqttconfig(data) {
  return request({
    url: MQTTCONFIG_URL + '/batchremove',
    method: 'delete',
    data
  })
}
export function batchUpdateMqttconfig(data) {
  return request({
    url: MQTTCONFIG_URL + '/batchupdate',
    method: 'put',
    data
  })
}
export function queryById(params) {
  return request({
    url: MQTTCONFIG_URL + '/querybyid',
    method: 'get',
    params
  })
}
