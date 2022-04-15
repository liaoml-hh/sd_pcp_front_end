import { planAndExecutePrefix } from '@/api/planAndExecute/const'
import request from '@/utils/request'

const prefix = planAndExecutePrefix + '/agencyFundPayment'
export const planAndExecuteApi = {
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
  showAgencyFundPayment(data){
    return request({
      url: prefix+'/showAgencyFundPayment',
      method: 'get',
      params: data
    })
  },
}
