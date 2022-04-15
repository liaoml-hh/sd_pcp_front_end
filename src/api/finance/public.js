import request from '@/utils/request'
import { financePrefix } from '@/api/waybill/const'

const prefix = financePrefix + 'waybillfree'

export const publicApi = {
  getCharge(params) {
    return request({
      url: prefix + '/charge',
      method: 'get',
      params
    })
  },
  getSendCost(params) {
    return request({
      url: prefix + '/sendCost',
      method: 'get',
      params
    })
  }
}

