import { PinYin } from './pyconst'// 因为我是同级目录所以这样写了
export default {
/**
     *
     * @param str 判断中英文
     * @returns {boolean} 中文返回true，其他返回false
     */
  isChinese: function(str) {
    var entryVal = str
    var cnChar = entryVal.match(/[^\x00-\x80]/g)
    if (cnChar != null && cnChar.length > 0) { return true }
    return false
  },

  /**
     *
     * @param str 获取拼音的字符串
     * @param split 拼音分隔符
     * @param uppercase 是否转为大写
     * @returns {string} 结果
     */
  getPinYin: function(str, split, uppercase) {
    split = split || ' '
    uppercase = uppercase || false
    var l2 = str.length
    var result = ''
    var reg = new RegExp('[a-zA-Z0-9\- ]')
    var val
    var name
    for (var i = 0; i < l2; i++) {
      val = str.substr(i, 1)
      if (this.isChinese(val)) {
        name = this.arraySearch(val)
        if (reg.test(val)) {
          result += split + val
        } else if (name !== false) {
          result += split + name
        }
      } else {
        result += val
      }
    }
    if (uppercase) result = result.toUpperCase()
    result = result.replace(split, '')
    return result.trim()
  },

  /**
     *
     * @param str 字
     * @returns {*} 结果
     */
  arraySearch: function(str) {
    for (var name in PinYin) {
      if (PinYin[name].indexOf(str) !== -1) {
        return name
      }
    }
    return false
  },

  /**
     *
     * @param str 获取拼音的字符串
     * @param split 拼音分隔符
     * @param uppercase 是否转为大写
     * @returns {string} 结果
     */
  getPinYinFirstCharacter: function(str, split, uppercase) {
    split = split || ' '
    uppercase = uppercase || false
    var len = str.length
    var result = ''
    var reg = new RegExp('[a-zA-Z0-9\- ]')
    var val
    var name
    for (var i = 0; i < len; i++) {
      val = str.substr(i, 1)
      if (this.isChinese(val)) {
        name = this.arraySearch(val)
        if (reg.test(val)) {
          result += split + val
        } else if (name !== false) {
          result += split + name.substring(0, 1)
        }
      } else {
        result += val
      }
    }
    if (uppercase) result = result.toUpperCase()
    result = result.replace(split, '')
    return result.trim()
  }
}
