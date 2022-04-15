import { planAndExecutePrefix } from '@/api/planAndExecute/const'
import request from '@/utils/request'

const prefix = planAndExecutePrefix + '/receiptAudit'
export const planAndExecuteApi = {
  /**
   * 上传图片
   * @param {*} putData
   * @returns
   */
  upLoadPicture(putData) {
    return request({
      url: prefix + '/editBatch',
      method: 'put',
      data: putData
    })
  },
  queryCustomerAndWarehouse() {
    return request({
      url: planAndExecutePrefix + '/pickup/queryCustomerAndWarehouse',
      method: 'get'
    })
  },
  queryDriver() {
    return request({
      url: planAndExecutePrefix + '/pickup/queryDriver',
      method: 'get'
    })
  },
  commonQuery(params) {
    return request({
      url: prefix,
      method: 'get',
      params,
      paramsSerializer: function(params) {
        if (params) {
          // const keysPage = params.keys
          var _result = []
          for (var key in params) {
            var value = params[key]
            if (value instanceof Array && value.constructor === Array) {
              value.forEach(function(_value) {
                _result.push(key + '=' + _value)
              })
            } else {
              _result.push(key + '=' + value)
            }
          }
          return _result.join('&')
        }
      }
    })
  },
  update(data) {
    return request({
      url: prefix,
      method: 'put',
      data: data
    })
  },
  showReceiptAudit(data) {
    return request({
      url: prefix + '/showReceiptAudit',
      method: 'get',
      params: data
    })
  },
  /**
   * 发送回单
   * @param {*} data
   * @returns
   */
  sendReceiptAudit(data) {
    return request({
      url: prefix + '/sendReceiptAudit',
      method: 'put',
      data
    })
  }
}
