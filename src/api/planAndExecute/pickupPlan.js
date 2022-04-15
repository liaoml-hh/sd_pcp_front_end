import { planAndExecutePrefix } from '@/api/planAndExecute/const'
import request from '@/utils/request'

const prefix = planAndExecutePrefix + '/pickup'
const BASE_URL = 'tms/pe/planAndExecute/api/v1'
const transport = 'tms/pe/planAndExecute/transport/api/v1'

export const planAndExecuteApi = {
  /**
   * 获取承运商数据
   * @returns
   */
  getCarrierList (params) {
    return request({
      url: transport + '/carrier',
      method: 'get',
      params
    })
  },

  getwaybillstatslist (params) {
    return request({
      url: BASE_URL + '/waybillstate',
      method: 'get',
      params
    })
  },
  /**
   * 获取顾客yi仓库
   * @param {*} params
   * @returns
   */
  queryCustomerAndWarehouse (params = {}) {
    return request({
      url: prefix + '/queryCustomerAndWarehouse',
      method: 'get',
      params,
      /**
     * 当参数既有数组又有键值对的时候对数组进行格式化
     * @param {*} params
     */
      paramsSerializer: function (params) {
        if (params) {
          // const keysPage = params.keys
          var _result = []
          for (var key in params) {
            var value = params[key]
            if (value instanceof Array && value.constructor === Array) {
              value.forEach(function (_value) {
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
  queryDriver () {
    return request({
      url: prefix + '/queryDriver',
      method: 'get'
    })
  },
  commonQuery (params) {
    return request({
      url: prefix,
      method: 'get',
      params
    })
  },
  add (data) {
    return request({
      url: prefix,
      method: 'post',
      data: data
    })
  },
  update (data) {
    return request({
      url: prefix,
      method: 'put',
      data: data
    })
  },
  showPlan (id) {
    return request({
      url: prefix + '/showPlan?id=' + id,
      method: 'get'
    })
  },
  copyPlan (data) {
    return request({
      url: prefix + '/copyPlan',
      method: 'post',
      data: data
    })
  },

  publishPlan (data) {
    return request({
      url: prefix + '/publishPlan',
      method: 'post',
      data: data
    })
  },
  undoPlan (data) {
    return request({
      url: prefix + '/undoPlan',
      method: 'post',
      data: data
    })
  },
  rePublishPlan (data) {
    return request({
      url: prefix + '/rePublishPlan',
      method: 'post',
      data: data
    })
  },
  // deleteOne(param) {
  //   return request({
  //     url: prefix,
  //     method: 'delete',
  //     params: param
  //   })
  // },
  deleteList (data) {
    return request({
      url: prefix,
      method: 'delete',
      data: data
    })
  },
  queryPlanDetail (params) {
    return request({
      // url: prefix + '/queryPlanDetail1',
      url: prefix,
      method: 'get',
      params
    })
  },
  getStation () {
    return request({
      url: BASE_URL + '/station',
      method: 'get'
    })
  },
  getVehicle () {
    return request({
      url: BASE_URL + '/vehicle',
      method: 'get'
    })
  },
  getPrintData (params) {
    return request({
      url: BASE_URL + '/pickup/barCode',
      method: 'get',
      params,
      paramsSerializer: function (params) {
        if (params) {
          // const keysPage = params.keys
          var _result = []
          for (var key in params) {
            var value = params[key]
            if (value instanceof Array && value.constructor === Array) {
              value.forEach(function (_value) {
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
  }

}

