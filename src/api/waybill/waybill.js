import { waybillPrefix } from '@/api/waybill/const'
import request from '@/utils/request'

const prefix = waybillPrefix + 'waybill'
const prefixDispatch = 'tms/pe/planAndExecute/api/v1/dispatch/'
const prefixPickup = 'tms/pe/planAndExecute/api/v1/pickup/'
export const WaybillApi = {
  /**
   * 增加收货人信息
   * @param {收货人信息} data
   * @returns
   */
  addReceiverInfo(data) {
    return request({
      url: '/oms/order/v1/order/addReceiver',
      method: 'post',
      data
    })
  },
  /**
   * 增加收货人信息
   * @param {收货人信息} data
   * @returns
   */
  getCount(data) {
    return request({
      url: prefix + '/recount',
      method: 'put',
      data
    })
  },
  /**
   * @description: 请求goods的方法，跟后端接口对应
   * @param {*} queryparam
   * @return {*}
   */
  queryGoods(queryParam) {
    return request({
      url: '/oms/order/v1/order/goods',
      method: 'get',
      params: queryParam
    })
  },
  /**
 * @description: 请求收获人的方法，跟后端接口对应
 * @param {*} queryparam
 * @return {*}
 */
  queryReceiver(queryparam) {
    return request({
      url: '/oms/order/v1/order/queryReceiver',
      method: 'get',
      params: queryparam
    })
  },
  /**
   * 路由查询
   * @param {*} waybillNo
   * @returns
   */
  queryOrderRouteInfoByCustomerId(waybillNo) {
    return request({
      url: '/oms/order/v1/order_transfer_route_info/' + waybillNo,
      method: 'get'
    })
  },
  /**
   * 增加收货人信息
   * @param {收货人信息} data
   * @returns
   */
  addReceiverInfo(data) {
    return request({
      url: '/oms/order/v1/order/addReceiver',
      method: 'post',
      data
    })
  },
  /**
   *获取订单号
  */
  getOrderNo() {
    return request({
      url: '/oms/app/v1/order/sysno?configSqnoType=orderNo',
      method: 'get'
    })
  },
  divideWaybill(params) {
    return request({
      url: prefix + '/divide',
      method: 'post',
      params: params
    })
  },
  mergeWaybill(data) {
    return request({
      url: prefix + '/merge',
      method: 'post',
      data: data
    })
  },
  confirmMergeWaybill(data) {
    return request({
      url: prefix + '/mergepost',
      method: 'post',
      data: data
    })
  },
  getMergeWaybill(data) {
    return request({
      url: prefix + '/merge',
      method: 'get',
      params: data,
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
  passApproval(data) {
    return request({
      url: prefix + '/approval',
      method: 'post',
      data: data
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
  add(data) {
    return request({
      url: prefix + '/',
      method: 'post',
      data: data
    })
  },
  // 编辑运单详情
  update(data) {
    return request({
      url: prefix,
      method: 'put',
      data: data
    })
  },
  // /tms/pe/waybill/api/v1/free/addCharge
  updatedCharge(data) {
    return request({
      url: waybillPrefix + 'free/addCharge',
      method: 'post',
      data
    })
  },
  updatedSendCost(data) {
    return request({
      url: waybillPrefix + 'free/addSendCost',
      method: 'post',
      data
    })
  },
  deleteOne(param) {
    return request({
      url: prefix,
      method: 'delete',
      params: param
    })
  },
  deleteList(data) {
    return request({
      url: prefix + '/list',
      method: 'delete',
      data: data
    })
  },
  getWaybillDetail(id) {
    return request({
      url: waybillPrefix + '/waybillDetail?id=' + id,
      method: 'get'
    })
  },
  getWaybillInfo(id) {
    return request({
      url: waybillPrefix + '/waybill/id/' + id,
      method: 'get'
    })
  },
  getDictionaryWay(id) {
    return request({
      url: waybillPrefix + 'dictionary?id=' + id,
      method: 'get'
    })
  },
  getAllTypeList(id) {
    return request({
      url: waybillPrefix + 'dictionary?id=' + id,
      method: 'get'
    })
  },
  // 配送签收
  dispatchSign(putData) {
    return request({
      url: prefixDispatch + 'customerSign',
      method: 'put',
      data: putData
    })
  },
  /**
   * 完成提货
   * @param {*} putData
   * @returns
   */
  finishPickup(putData) {
    return request({
      url: prefixPickup + 'customerSign',
      method: 'put',
      data: putData
    })
  }
}

