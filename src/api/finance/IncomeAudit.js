import request from '@/utils/request'
import { financePrefix } from '@/api/waybill/const'

const prefix = financePrefix + 'audit'

export const AuditApi = {
  passApproval(data) {
    return request({
      url: prefix,
      method: 'post',
      data: data
    })
  },
  commonUpdate(data) {
    return request({
      url: prefix,
      method: 'put',
      data: data
    })
  },
  commonQuery(params) {
    return request({
      url: prefix,
      method: 'get',
      params
    })
  }
}

