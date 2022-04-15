<template>
  <div>
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane label="货品" name="goods">
        <el-form size="mini"  v-model="formData" label-width="80px">
          <el-row>
            <el-col :span="5">
              <el-form-item v-model="formData.goods" label="物品">
                <el-input value="设备" />
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="原件数">
                <el-input v-model value="1" />
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="实际件数">
                <el-input value="1" />
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="台数">
                <el-input value="25" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="5">
              <el-form-item label="实际重量">
                <el-input value="1.62" />
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="体积重量">
                <el-input value="0" />
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="声明价格">
                <el-input value="0" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="5">
              <el-form-item label="原包装">
                <el-input value="" />
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="包装要求">
                <el-input value="" />
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="体积">
                <el-input value="0" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="发货人信息" name="second">
        <el-form size="mini" label-width="80px">
          <el-row>
            <el-col :span="6">
              <el-form-item label="发货人">
                <el-input value="欧维特" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="手机">
                <el-input value="" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="电话">
                <el-input value="" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="地址">
                <el-input value="" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="结算方">
                <el-input value="" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="结算方式">
                <el-input value="" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="代收款">
                <el-input value="" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="收货人信息" name="third">
        <el-form size="mini" label-width="80px">
          <el-row>
            <el-col :span="6">
              <el-form-item label="收货人">
                <el-input value="福州市仓山区" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="联系人">
                <el-input value="丘泰泉" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="手机">
                <el-input value="" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="电话">
                <el-input value="" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="地址">
                <el-input value="" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="配送方式">
                <el-input value="" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="运输方式">
                <el-input value="" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="物控">
                <el-radio v-model="radio" label="1">是</el-radio>
                <el-radio v-model="radio" label="2">否</el-radio>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="签收原件">
                <el-input value="原件返回" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="份数">
                <el-input value="1" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
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
    </el-tabs>
  </div>
</template>

<script>
export default {
  name: 'WaybillEdit',
  data() {
    return {
      activeName: '',
      formData: {}
    }
  }
}
</script>

<style scoped>

</style>
