<template>
  <div>
    <el-table
      :data="waybillChargeDTOS"
      highlight-current-row
      border
      :height="waybillChargeDTOS.length>=4?212:''"
      :header-cell-style="{'color':'#606266', 'height':'6px', 'padding':'0px'}"
      :span-method="objectSpanChargeMethod"
      style="width:623px;font-size:12px;display:inline-block;"
    >
      <el-table-column align="center" label="类别" width="140">
        <template slot-scope>
          <span>费用明细</span>
        </template>
      </el-table-column>
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
      <el-table-column sortable align="center" prop="fee" label="费用" width="115">
        <template slot-scope="{row}">
          <span>
            {{ row.fee?row.fee: 0 }}
          </span>
        </template>
      </el-table-column>
    </el-table>
    <el-table
      :data="waybillSendCostDTOS"
      highlight-current-row
      border
      :height="waybillSendCostDTOS.length>=4?212:''"
      :span-method="objectSpanSendCostMethod"
      :header-cell-style="{'color':'#606266', 'height':'6px', 'padding':'0px'}"
      style="width:888px;font-size:12px;display:inline-block;"
    >
      <el-table-column align="center" label="类别" width="109">
        <template slot-scope>
          <span>成本明细</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="序号" type="index" width="130" />
      <el-table-column align="center" prop="feeType" label="承运商" show-overflow-tooltip width="259">
        <template slot-scope="{row}">
          <span>
            {{ row.carrierId?row.carrierId:'无' }}
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
      <!-- <el-table-column align="center" prop="settleWay" label="结算方式" show-overflow-tooltip width="100">
        <template slot-scope="{row}">
          <span>
            {{ row.settleWay?row.settleWay:'无' }}
          </span>
        </template>
      </el-table-column>
      <el-table-column sortable align="center" prop="costRef" label="成本依据" show-overflow-tooltip width="100">
        <template slot-scope="{row}">
          <span>
            {{ row.costRef?row.costRef: '无' }}
          </span>
        </template>
      </el-table-column> -->
      <el-table-column sortable align="center" prop="fee" label="费用" width="115">
        <template slot-scope="{row}">
          <span>
            {{ row.fee?row.fee: 0 }}
          </span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {

  props: ['waybillChargeDTOS', 'waybillSendCostDTOS'],
  data() {
    return {
      waybillChargeDTOSS: {
        rateType: '无',
        fee: '无'
      }
    }
  },
  methods: {
    /**
     * 费用列合并
     */
    objectSpanChargeMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        if (rowIndex === 0) {
          return {
            rowspan: this.waybillChargeDTOS.length ? this.waybillChargeDTOS.length : 1,
            colspan: 1
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
    },
    /**
     * 成本列合并
     */
    objectSpanSendCostMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        if (rowIndex === 0) {
          return {
            rowspan: this.waybillSendCostDTOS.length,
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
