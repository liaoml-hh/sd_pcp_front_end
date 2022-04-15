import request from '@/utils/request'
const NOTIFY_USERMESSAGE_URL = '/pcp/basedata/api/v1/notifyusermessage'

export function commonMsg (params) {
  return request({
    url: NOTIFY_USERMESSAGE_URL,
    method: 'get',
    params
  })
}
export function sendPart (data) {
  return request({
    url: NOTIFY_USERMESSAGE_URL + "/sendpart",
    method: 'post',
    data
  })
}
export function sendAll (data) {
  return request({
    url: NOTIFY_USERMESSAGE_URL + "/sendall",
    method: 'post',
    data
  })
}
export function deleteMsg (params) {
  return request({
    url: NOTIFY_USERMESSAGE_URL,
    method: 'delete',
    params
  })
}
