import QueryPanel from './QueryPanel.vue'
import FormDialog from './FormDialog.vue'
// 这里是重点
const SD365UI = {
  install: function(Vue) {
    Vue.component('sd-QueryPanel', QueryPanel)
    Vue.component('sd-FormDialog', FormDialog)
  }
}

// 导出组件
export default SD365UI
