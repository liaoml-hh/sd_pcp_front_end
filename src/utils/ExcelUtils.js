export function exportExcel(table, fileName) {
  const columns = table.columns
  const tableData = table.data
  const tHeader = []
  const filterVal = []
  for (const item of columns) {
    if (item.label && item.property) {
      tHeader.push(item.label)
      filterVal.push(item.property)
    }
  }
  require.ensure([], () => {
    const { export_json_to_excel } = require('@/excel/Export2Excel')
    const data = formatJson(filterVal, tableData)
    export_json_to_excel(tHeader, data, fileName || '列表excel')
  })
}
function formatJson(filterVal, jsonData) {
  return jsonData.map(v => filterVal.map(j => v[j]))
}
