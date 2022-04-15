import request from '@/utils/request'

export function getAllStatusCount() {
  return request({
    url: 'tms/pe/planAndExecute/api/v1/pickup/getAllStatusCount',
    method: 'get'
  })
}
