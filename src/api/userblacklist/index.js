import request from '@/utils/request'
const USERBLACKLIST_URL = '/pcp/basedata/api/v1/userblacklist'
export function commonQueryUserBlackList (params) {
  return request({
    url: USERBLACKLIST_URL,
    method: 'get',
    params
  })
}
export function addUserBlackList (data) {
  return request({
    url: USERBLACKLIST_URL,
    method: 'post',
    data
  })
}
export function removeByIdUserBlackList (params) {
  return request({
    url: USERBLACKLIST_URL,
    method: 'delete',
    params
  })
}

export function batchRemoveUserBlackList (data) {
  return request({
    url: USERBLACKLIST_URL + '/batchremove',
    method: 'delete',
    data
  })
}


export function batchAddUserBlackList (data) {
  return request({
    url: USERBLACKLIST_URL + '/batchadd',
    method: 'post',
    data
  })
}

export function updateUserBlackList (data) {
  return request({
    url: USERBLACKLIST_URL,
    method: 'put',
    data
  })
}

export function batchUpdateUserBlackList (data) {
  return request({
    url: USERBLACKLIST_URL + '/batchupdate',
    method: 'put',
    data
  })
}

export function queryById (params) {
  return request({
    url: USERBLACKLIST_URL + '/querybyid',
    method: 'get',
    params
  })
}
