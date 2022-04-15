import XLSX from 'xlsx'

export function readExcel(file) {
  return new Promise((resolve, reject) => {
    const types = file.name.split('.')[1]
    const fileType = [
      'xlsx',
      'xlc',
      'xlm',
      'xls',
      'xlt',
      'xlw',
      'csv'
    ].some((item) => item === types)
    if (!fileType) {
      return reject({ message: '格式错误！请重新选择' })
    }

    const reader = new FileReader()
    const result = []
    reader.onload = function(e) {
      const data = e.target.result
      const wb = XLSX.read(data, {
        type: 'binary'
      })
      wb.SheetNames.forEach((sheetName) => {
        result.push({
          sheetName: sheetName,
          sheet: XLSX.utils.sheet_to_json(wb.Sheets[sheetName])
        })
        resolve(result.length > 1 ? result : result[0].sheet)
      })
    }
    reader.onerror = function(error) {
      return reject(error)
    }
    reader.readAsBinaryString(file.raw || file)
  })
}
export function formatJson(header, filterVal, jsonData) {
  return jsonData.map((v) => {
    const obj = {}
    header.forEach((h, i) => {
      obj[[`${filterVal[i]}`]] = v[h]
    })
    return obj
  })
}
