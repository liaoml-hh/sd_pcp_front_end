// eslint-disable-next-line quotes
import request from '@/utils/request'

// eslint-disable-next-line quotes
const SUBSYSTEM_URL = '/permission/centre/subsystem'
/**
 * @param: 子系统DTO
 * @return: 成功则true CommonResponse 应答码和消息统一参考基础框架
 * @see
 * @since
 */

/**
 * @param:
 * @return:  CommonResponse<CommonPage<CustomerVO>>
 * @see
 * @since
 */
// 查询所有子系统
export function commonQuery(subSystemQuery) {
  return request({
    url: SUBSYSTEM_URL,
    method: 'get',
    params: subSystemQuery
  })
}
