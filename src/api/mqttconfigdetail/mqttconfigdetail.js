import request from '@/utils/request'
const MQTTCONFIGDETAIL_URL = '/pcp/basedata/api/v1/mqttconfigdetail'

export function commonQueryMqttconfigdetail(params) {
    return request({
      url: MQTTCONFIGDETAIL_URL,
      method: 'get',
      params
    })
  }
export function addMqttconfigdetail(data) {
return request({
    url: MQTTCONFIGDETAIL_URL,
    method: 'post',
    data
})
}
export function updateMqttconfigdetail(data) {
return request({
    url: MQTTCONFIGDETAIL_URL,
    method: 'put',
    data
})
}
export function removeByIdMqttconfigdetail(params) {
return request({
    url: MQTTCONFIGDETAIL_URL,
    method: 'delete',
    params
})
}
export function batchRemoveMqttconfigdetail(data) {
return request({
    url: MQTTCONFIGDETAIL_URL + '/batchremove',
    method: 'delete',
    data
})
}
export function batchUpdateMqttconfigdetail(data) {
    return request({
        url: MQTTCONFIGDETAIL_URL + '/batchupdate',
        method: 'put',
        data
    })
    }
export function queryById(params) {
return request({
    url: MQTTCONFIGDETAIL_URL + '/querybyid',
    method: 'get',
    params
})
}
export function testSendMqttconfig(data) {
    return request({
        url: MQTTCONFIGDETAIL_URL + '/testsendmqttconfig',
        method: 'put',
        data
    })
}