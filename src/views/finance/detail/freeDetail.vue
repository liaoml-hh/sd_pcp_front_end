<template>
  <!-- Charge -->
  <div>
    <el-table
      v-show="freeType === 'Charge'"
      :data="waybillChargeDTOS"
      highlight-current-row
      border
      :summary-method="getSummaries"
      :show-summary="true"
      sum-text="合计"
      :height="waybillChargeDTOS.length<6?'':500"
      :span-method="objectSpanSendCostMethod"
      :header-cell-style="{'color':'#606266', 'height':'6px', 'padding':'0px'}"
      style="width:100%;font-size:12px;display:inline-block;"
    >
      <el-table-column align="center" label="序号" type="index" width="100" />
      <el-table-column align="center" prop="rateType" label="费用类型" show-overflow-tooltip width="252">
        <template slot-scope="{row}">
          <span>
            {{ row.rateType?row.rateType:'无' }}
          </span>
        </template>
      </el-table-column>
      <!-- <el-table-column align="center" prop="chargeRef" label="收费依据" width="100">
        <template slot-scope="{row}">
          <span>
            {{ row.chargeRef?row.chargeRef:'无' }}
          </span>
        </template>
      </el-table-column> -->
      <el-table-column sortable align="center" prop="fee" label="费用">
        <template slot-scope="{row}">
          <span>
            {{ row.fee?row.fee: 0 }}
          </span>
        </template>
      </el-table-column>
      <el-table-column sortable align="center" prop="waybillFree" label="运单费用" />
    </el-table>
    <el-table
      v-show="freeType === 'SendCost'"
      :data="waybillSendCostDTOS"
      highlight-current-row
      border
      :summary-method="getSummaries"
      :show-summary="true"
      :height="waybillSendCostDTOS.length<6?'':500"
      :span-method="objectSpanSendCostMethod"
      :header-cell-style="{'color':'#606266', 'height':'6px', 'padding':'0px'}"
      style="width:100%;font-size:12px;display:inline-block;"
    >
      <el-table-column align="center" label="序号" type="index" width="130" />
      <el-table-column align="center" prop="carrierVO.name" label="承运商" show-overflow-tooltip width="259">
        <template slot-scope="{row}">
          <span>
            {{ row.carrierVO.name?row.carrierVO.name:'无' }}
          </span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="feeType" label="费用类型" show-overflow-tooltip width="259">
        <template slot-scope="{row}">
          <span>
            {{ row.feeType?row.feeType:'无' }}
          </span>
        </template>
      </el-table-column>
      <el-table-column sortable align="center" prop="fee" label="费用" width="115">
        <template slot-scope="{row}">
          <span>
            {{ row.fee?row.fee: 0 }}
          </span>
        </template>
      </el-table-column>
      <el-table-column sortable align="center" prop="waybillFree" label="运单成本" />
    </el-table>
  </div>

</template>

<script>
import { publicApi } from '@/api/finance/public'
export default {
  props: {
    freeType: {
      type: String,
      default: () => {
        return 'Charge'
      }
    },
    waybillFree: {
      type: String || Number,
      default: () => {}
    }
  },
  data() {
    return {
      waybillChargeDTOS: [],
      waybillSendCostDTOS: []
    }
  },
  methods: {
    /**
     * 获取成本和费用
     */
    getFree(id) {
      publicApi[`get${this.freeType}`]({ id }).then(res => {
        // 对父组件传入的waybillFree进行赋值
        res.data.map((item, index) => {
          if (index > 0) {
            return
          }
          item.waybillFree = this.waybillFree
        })
        // 赋值给表数据
        this[`waybill${this.freeType}DTOS`] = res.data
      })
    },
    /**
     * 统计总应收和总应付
     */
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        } else if (index === columns.length - 1) {
          console.log(sums)
          let sum = 0
          sums.map((item, sumIndex) => {
            if (sumIndex && !isNaN(parseFloat(item))) {
              console.log(parseFloat(item))
              sum += parseFloat(item)
            }
          })
          sums[index] = `${this.freeType === 'Charge' ? '应收' : '应付'}  ${sum + this.waybillFree}`
          return
        }
        const values = data.map(item => Number(item[column.property]))
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)
        } else {
          sums[index] = ' '
        }
      })
      return sums
    },
    /**
     * 成本列合并
     */
    objectSpanSendCostMethod({ row, column, rowIndex, columnIndex }) {
      const waybillDataLength = this[`waybill${this.freeType}DTOS`].length
      if (columnIndex === (this.freeType === 'Charge' ? waybillDataLength : (waybillDataLength + 2))) {
        if (rowIndex === 0) {
          return {
            rowspan: this.freeType === 'Charge' ? waybillDataLength : (waybillDataLength + 2),
            colspan: 1
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
    }
  }
}
</script>
