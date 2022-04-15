import { planAndExecutePrefix, waybillPrefix } from '@/api/planAndExecute/const'
import request from '@/utils/request'

const prefix = planAndExecutePrefix + '/dispatch'
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
  /**
   * 获取顾客和仓库数据
   * @returns
   */
  queryCustomerAndWarehouse () {
    return request({
      url: planAndExecutePrefix + '/pickup/queryCustomerAndWarehouse',
      method: 'get'
    })
  },
  /**
   *获取司机数据
   * @returns
   */
  queryDriver () {
    return request({
      url: planAndExecutePrefix + '/pickup/queryDriver',
      method: 'get'
    })
  },
  /**
   * 查询
   * @param {*} params
   * @returns
   */
  commonQuery (params) {
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
  add (data) {
    return request({
      url: prefix,
      method: 'post',
      data: data
    })
  },
  /**
   * 增加
   * @param {*} data
   * @returns
   */
  addCarrierPlan (data) {
    return request({
      url: prefix + '/carrierMakePlan',
      method: 'post',
      data: data
    })
  },
  /**
   * 编辑配送计划
   * @param {*} data
   * @returns
   */
  update (data) {
    return request({
      url: prefix,
      method: 'put',
      data: data
    })
  },
  /**
   * 编辑承运商配送计划
   * @param {*} data
   * @returns
   */
  carrierUpdatePlan (data) {
    return request({
      url: prefix + '/carrierUpdatePlan',
      method: 'put',
      data: data
    })
  },
  /**
   * 查询自配送计划
   * @param {*} id
   * @returns
   */
  showPlan (id) {
    return request({
      url: prefix + '/showPlan?id=' + id,
      method: 'get'
    })
  },
  /**
   * 查询委运配送计划
   * @param {*} id
   * @returns
   */
  showCarrierPlan (id) {
    return request({
      url: prefix + '/showPlan/carrier?id=' + id,
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
      // url: prefix + '/queryPlanDetail',
      url: prefix,
      method: 'get',
      params
    })
  },
  allocation () {
    return request({
      url: planAndExecutePrefix + '/allocation',
      method: 'get'
    })
  },
  allocationGetCompany () {
    return request({
      url: planAndExecutePrefix + '/allocation/getCompany',
      method: 'get'
    })
  },
  getVehicle () {
    return request({
      url: BASE_URL + '/vehicle',
      method: 'get'
    })
  },
  updatePlanByTransfer (info) {
    return request({
      url: planAndExecutePrefix + '/updatePlanByTransfer',
      method: 'put',
      data: info
    })
  },
  updatewaybillbytransfer (info) {
    return request({
      url: waybillPrefix + 'updatePlanByTransfer',
      method: 'put',
      data: info
    })
  }
}

