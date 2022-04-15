import { login, logout, getInfo } from '@/api/user'
import {
  getToken, setToken, removeToken, getCode, setCode, removeCode,
  getAccount, setAccount, removeAccount, setUserId, removeUserId, getName, setName, getTel, setTel,
  setOrgId, removeOrgId, setTenantId, removeTenantId, setCompanyId, removeCompanyId
} from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    code: getCode(),
    account: getAccount(),
    token: getToken(),
    name: '',
    dispatcher: getName(),
    tel: getTel(),
    companyId: '',
    orgId: '',
    userId: '',
    tenantId: '',
    avatar: '',
    resources: [],
    hassetroutes: false
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: state => {
    Object.assign(state, getDefaultState())
  },
  SET_CODE: (state, code) => {
    state.code = code
  },
  SET_ACCOUNT: (state, account) => {
    state.account = account
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_USERID: (state, userId) => {
    state.userId = userId
  },
  SET_COMPANYID: (state, companyId) => {
    state.companyId = companyId
  },
  SET_TENANTID: (state, tenantId) => {
    state.tenantId = tenantId
  },
  SET_ORGID: (state, orgId) => {
    state.orgId = orgId
  },
  SET_DISPATCHER: (state, dispatcher) => {
    state.dispatcher = dispatcher
  },
  SET_TEL: (state, tel) => {
    state.tel = tel
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_RESOURCES: (state, resources) => {
    state.resources = resources
  },
  SET_tel: (state, resources) => {
    // state.resources = resources
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { code, account, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ code: code, account: account.trim(), password: password })
        .then(response => {
          if (response.code === 401) {
            reject(response)
          }
          const { data } = response
          console.log(data)
          if (!data.token) {
            reject()
          } else {
            commit('SET_TOKEN', data.token)
            commit('SET_CODE', code)
            commit('SET_ACCOUNT', account)
            setToken(data.token)
            setCode(code)
            setAccount(account)
            console.log('===>token=' + data.token)
            resolve(response)
          }
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  // get user info
  /*
  getInfo ({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response

        if (!data) {
          return reject('Verification failed, please Login again.')
        }

        const { name, avatar } = data

        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },
*/
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo({ code: state.code, account: state.account })
        .then(response => {
          console.log('===>', response)
          const { data, companyId, orgId, tenantId, id, tel } = response
          console.log('===>', data)

          if (!data) {
            return reject('Verification failed, please Login again.')
          }

          const { name, avatar } = data
          setCompanyId(companyId)
          setOrgId(orgId)
          setTenantId(tenantId)
          setUserId(id)
          commit('SET_NAME', name)
          commit('SET_AVATAR', avatar)
          commit('SET_DISPATCHER', name)
          commit('SET_COMPANYID', companyId)
          commit('SET_ORGID', orgId)
          commit('SET_TENANTID', tenantId)
          commit('SET_USERID', id)
          commit('SET_tel', tel)
          setName(name)
          setTel(tel)
          console.log(name + ' ==> ' + avatar)
          if (data.resourceVO === undefined || data.resourceVO === null) {
            commit('SET_RESOURCES', [])
          } else {
            // 过滤其他系统资源，保留分配本系统资源
            data.resourceVO.map(item => {
              if (item.api.includes('PCPSYSTEM')) {
                commit('SET_RESOURCES', item.resourceVOs)
              }
            })
            // commit('SET_RESOURCES', data.resourceVO.resourceVOs)
          }

          resolve()
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token)
        .then(() => {
          removeToken() // must remove  token  first
          resetRouter()
          commit('RESET_STATE')
          resolve()
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  },
  resetCodeAndAccount({ commit }) {
    return new Promise(resolve => {
      removeCode()
      removeAccount()
      removeCompanyId()
      removeTenantId()
      removeUserId()
      removeOrgId()
      commit('RESET_STATE')
      resolve
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
