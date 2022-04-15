import { planAndExecutePrefix } from '@/api/planAndExecute/const'
import request from '@/utils/request'

const prefix = planAndExecutePrefix + '/sign'
const pickupPrefix = planAndExecutePrefix + '/pickup'
export const planAndExecuteApi = {
  // 客户和仓库查询
  queryCustomerAndWarehouse() {
    return request({
      url: pickupPrefix + '/queryCustomerAndWarehouse',
      method: 'get'
    })
  },
  commonQuery(params) {
    return request({
      url: prefix,
      method: 'get',
      params
    })
  },
  queryDriver() {
    return request({
      url: planAndExecutePrefix + '/pickup/queryDriver',
      method: 'get'
    })
  },
  showSign(data) {
    return request({
      url: prefix + '/showSign',
      method: 'get',
      params: data
    })
  }
}
