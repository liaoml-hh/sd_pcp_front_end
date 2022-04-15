<template>
  <div>
    <div style="height: 350px">
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="发货成本信息" name="fifth">
          发货成本信息
        </el-tab-pane>
        <el-tab-pane label="其他成本信息" name="sixth">
          <el-form size="mini" label-width="80px">
            <el-row>
              <el-col :span="6">
                <el-form-item label="地处费">
                  <el-input value="0" />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="木箱费">
                  <el-input value="0" />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="包装费">
                  <el-input value="0" />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="其他费">
                  <el-input value="0" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="二级承运成本" name="eighth">
          二级承运成本
        </el-tab-pane>
        <el-tab-pane label="收费信息" name="fourth">
          <el-form size="mini" label-width="80px">
            <el-row>
              <el-col :span="24">
                <el-form-item label="计费依据">
                  <el-radio-group v-model="costRadio">
                    <el-radio :label="1">重量</el-radio>
                    <el-radio :label="2">体积重量</el-radio>
                    <el-radio :label="3">体积</el-radio>
                    <el-radio :label="4">件</el-radio>
                    <el-radio :label="5">台</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <el-form-item label="计费量">
                  <el-input value="1.62" />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="地处费">
                  <el-input value="0" />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="派送费率">
                  <el-input value="0" />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="配送费">
                  <el-input value="0" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <el-form-item label="费率">
                  <el-input value="0" />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="运费">
                  <el-input value="0" />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="电报费">
                  <el-input value="0" />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="加急费">
                  <el-input value="0" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <el-form-item label="保险费率">
                  <el-input value="0" />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="保险费">
                  <el-input value="0" />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="自提费率">
                  <el-input value="0" />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="自提费">
                  <el-input value="0" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <el-form-item label="木箱费">
                  <el-input value="0" />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="包装费">
                  <el-input value="0" />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="中转费">
                  <el-input value="0" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div>
      <el-table :data="tableData">
        <el-table-column label="序号" type="index" width="55px" />
        <el-table-column label="客户" prop="customer" />
        <el-table-column label="分单号" prop="id" />
        <el-table-column label="承运单号" prop="orderNo" />
        <el-table-column label="商品" prop="goods" />
        <el-table-column label="数量" prop="quantity" />
        <el-table-column label="体积" prop="cubage" />
        <el-table-column label="重量" prop="weight" />
        <el-table-column label="制单时间" prop="createdTime" />
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MergeDetail',
  props: {
    tableData: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      dialogVisible: true,
      activeName: 'fourth',
      costRadio: '1'
    }
  }
}
</script>

<style scoped>

</style>
