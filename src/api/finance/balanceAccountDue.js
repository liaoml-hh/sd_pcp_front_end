import request from '@/utils/request'
import { financePrefix } from '@/api/waybill/const'

const prefix = financePrefix + 'balanceDue'

export const BalanceDueApi = {
  check(data) {
    return request({
      url: prefix + '/check',
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
   * @param {*} params
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
   * 编辑对账单
   * @param {*} data
   * @returns
   */
  edit(data) {
    return request({
      url: prefix,
      method: 'put',
      data
    })
  },
  /**
   * 删除对账单
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
   * 获取编辑的信息
   * @param {*} id
   * @returns
   */
  getBARInfo(id) {
    return request({
      url: prefix + `/id/${id}`,
      method: 'get'
    })
  }
}

