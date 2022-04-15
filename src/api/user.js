import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/permission/centre/vue-admin-template/user/login',
    method: 'get',
    params: data
  })
}

export function getInfo(data) {
  return request({
    url: '/permission/centre/vue-admin-template/user/info',
    method: 'get',
    params: data
  })
}

export function logout() {
  return request({
    url: '/permission/centre/vue-admin-template/user/logout',
    method: 'get'
  })
}
