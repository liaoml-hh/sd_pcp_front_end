import request from '@/utils/request'
import { financePrefix } from '@/api/waybill/const'

const prefix = financePrefix + 'settlementDue'

export const settlementDueApi = {
  settle(data) {
    return request({
      url: prefix + '/settle',
      method: 'post',
      data: data
    })
  },
  commonQuery(params) {
    return request({
      url: prefix,
      method: 'get',
      params
    })
  },
  /**
   * 增加
   * @param {*} data
   * @returns
   */
  add(data) {
    return request({
      url: prefix,
      method: 'post',
      data
    })
  },
  /**
   * 编辑
   * @param {*} data
   * @returns
   */
  edit(data) {
    return request({
      url: prefix + '/updateSettlementDueBill',
      method: 'put',
      data
    })
  },
  /**
   * 删除
   * @param {*} data
   * @returns
   */
  delete(params) {
    return request({
      url: prefix,
      method: 'delete',
      params
    })
  },
  /**
   * 获取编辑信息
   * @param {*} data
   * @returns
   */
  getEditInfo(id) {
    return request({
      url: prefix + `/id/${id}`,
      method: 'get'
    })
  }
}

