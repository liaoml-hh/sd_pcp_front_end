import Cookies from 'js-cookie'

const TokenKey = 'vue_sd365_token'
const CodeKey = 'vue_sd365_code' // 账号
const AccountKey = 'vue_sd365_account' // 租户号
const TenantIdKey = 'vue_sd365_tenantId' // 租户id
const CompanyIdKey = 'vue_sd365_companyId' // 公司id
const OrgIdKey = 'vue_sd365_orgId' // 组织id
const UserIdKey = 'vue_sd365_userId' // 用户id
const NameKey = 'vue_sd365_name' // 用户名
const TelKey = 'vue_sd365_tel' // 电话

export function getName() {
  return Cookies.get(NameKey)
}

export function setName(name) {
  return Cookies.set(NameKey, name)
}
export function getTel() {
  return Cookies.get(TelKey)
}

export function setTel(tel) {
  return Cookies.set(TelKey, tel)
}
export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getCode() {
  return Cookies.get(CodeKey)
}

export function setCode(code) {
  return Cookies.set(CodeKey, code)
}

export function removeCode() {
  return Cookies.remove(CodeKey)
}

export function getAccount() {
  return Cookies.get(AccountKey)
}

export function setAccount(account) {
  return Cookies.set(AccountKey, account)
}

export function removeAccount() {
  return Cookies.remove(AccountKey)
}
export function getTenantId() {
  return Cookies.get(TenantIdKey)
}

export function setTenantId(tenantId) {
  return Cookies.set(TenantIdKey, tenantId)
}

export function removeTenantId() {
  return Cookies.remove(TenantIdKey)
}
export function getCompanyId() {
  return Cookies.get(CompanyIdKey)
}

export function setCompanyId(companyId) {
  return Cookies.set(CompanyIdKey, companyId)
}

export function removeCompanyId() {
  return Cookies.remove(CompanyIdKey)
}
export function getOrgId() {
  return Cookies.get(OrgIdKey)
}

export function setOrgId(orgId) {
  return Cookies.set(OrgIdKey, orgId)
}

export function removeOrgId() {
  return Cookies.remove(OrgIdKey)
}
export function getUserId() {
  return Cookies.get(UserIdKey)
}

export function setUserId(userId) {
  return Cookies.set(UserIdKey, userId)
}

export function removeUserId() {
  return Cookies.remove(UserIdKey)
}
