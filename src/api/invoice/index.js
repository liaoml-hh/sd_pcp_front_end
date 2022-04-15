import request from '@/utils/request'
const INVOICE_URL = '/pcp/order/api/v1/invoice'
const AUDITINVOICE_URL = '/pcp/common/invoice'
export function commonQueryInvoice(params) {
  return request({
    url: INVOICE_URL,
    method: 'get',
    params
  })
}
export function addInvoice(data) {
  return request({
    url: INVOICE_URL,
    method: 'post',
    data
  })
}
export function openinvoice(data) {
  return request({
    url: AUDITINVOICE_URL + '/openinvoice',
    method: 'post',
    data
  })
}
export function removeByIdInvoice(params) {
  return request({
    url: INVOICE_URL,
    method: 'delete',
    params
  })
}
export function eamilsend(data) {
  return request({
    url: AUDITINVOICE_URL + '/send',
    method: 'post',
    data
  })
}
export function updateInvoice(data) {
  return request({
    url: INVOICE_URL,
    method: 'put',
    data
  })
}
export function queryBiId(params) {
  return request({
    url: INVOICE_URL + '/querybyid',
    method: 'get',
    params
  })
}
