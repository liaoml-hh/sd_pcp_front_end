import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken, getUserId, getTenantId, getCompanyId, getOrgId } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 20000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      console.log(store.getters.resources)
      config.headers['accessToken'] = getToken()
    }

    // 判断请求的类型：如果是post请求就把默认参数拼到data里面；如果是get请求就拼到params里面
    if (config.method === 'post' || config.method === 'put') {
      try {
        config.data.tenantId = getTenantId()
        config.data.orgId = getOrgId()
        config.data.companyId = getCompanyId()
        config.data.createdBy = getUserId()
        console.log(config.data)
      } catch (e) {
        console.log('自动注入字段错误')
        console.log(e)
      }
    }
    if (config.method === 'get') {
      if (!getCompanyId()) {
        config.params.companyId = getCompanyId()
        config.headers['Content-Type'] ='application/json'
      }
      if (!getOrgId()) {
        config.params.orgId = getOrgId()
      }
      if (!getTenantId()) {
        config.params.tenantId = getTenantId()
      }
    }

    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data

    // if the custom code is not 20000, it is judged as an error.
    if (res.Code === 'fail' || res.head.code !== '0') {
      Message({
        message: res.Message || res.head.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (
        res.head &&
        res.head.code && (
          res.head.code === '50008' ||
        res.head.code === '50012' ||
        res.head.code === '50014')
      ) {
        // to re-login
        MessageBox.confirm(
          'You have been logged out, you can cancel to stay on this page, or log in again',
          'Confirm logout',
          {
            confirmButtonText: 'Re-Login',
            cancelButtonText: 'Cancel',
            type: 'warning'
          }
        ).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      return Promise.reject(new Error((res.head ? res.head.message : res.Message) || 'Error'))
    } else {
      console.log('response', res.body)
      return res.body
    }
  },
  error => {
    console.log('err', error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
