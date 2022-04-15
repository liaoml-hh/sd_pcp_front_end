<template>
  <div>
    <el-form ref="tableForm" v-loading="waybillInfoDetailQueryLoading" :model="formData" :rules="rules" label-width="80px" size="mini">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>运单信息</span>
          <i :class="showCard?'el-icon-arrow-up':'el-icon-arrow-down'" style="float: right; padding: 3px 0" @click="showCardClick" />
        </div>
        <el-collapse-transition>
          <div v-show="showCard">
            <el-row>
              <el-col :span="6">
                <el-form-item label="订单号" prop="orderNo" label-width="88px">
                  <el-col :span="22">
                    <el-input v-model="formData.orderNo" :disabled="readonly" />
                  </el-col>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="源头单号" prop="sourceOrderNo">
                  <el-col :span="22">
                    <el-input v-model="formData.sourceOrderNo" :disabled="readonly" />
                  </el-col>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="运单号" prop="mailNo">
                  <el-col :span="22">
                    <el-input v-model="formData.mailNo" :disabled="readonly" />
                  </el-col>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="下单渠道" prop="channel" label-width="88px">
                  <el-col :span="22">
                    <el-select v-model="formData.channel" @change="changeGetCount">
                      <el-option
                        v-for="item in orderChannelOptions"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      />
                    </el-select>
                  </el-col>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="货品" prop="goods" label-width="88px">
                  <el-col :span="22">
                    <el-col :span="24">
                      <el-input v-model="formData.goods" clearable size="mini" placeholder="请填写货品" @change="changeGetCount" />
                    </el-col>
                  </el-col>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="货品类型" prop="goodsTypeShortName">
                  <el-col :span="22">
                    <!-- <el-input v-model="formData.goods" /> -->
                    <el-col :span="24">
                      <el-select v-model="formData.goodsTypeShortName" allow-create filterable clearable size="mini" placeholder="请填写货品类型" @change="changeGetCount">
                        <el-option
                          v-for="goodInfo in goodsList"
                          :key="goodInfo.id"
                          :label="goodInfo.name"
                          :value="goodInfo.name"
                        />
                      </el-select>
                    </el-col>
                  </el-col>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="箱数" prop="quantity">
                  <el-col :span="22">
                    <el-input v-model="formData.quantity" @change="changeGetCount" />
                  </el-col>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="重量" prop="weight" label-width="88px">
                  <el-col :span="22">
                    <el-input v-model="formData.weight" @change="changeGetCount" />
                  </el-col>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="体积" prop="cubage" label-width="88px">
                  <el-col :span="22">
                    <el-input v-model="formData.cubage" @change="changeGetCount" />
                  </el-col>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="订单类型" prop="orderType">
                  <el-col :span="22">
                    <el-select v-model="formData.orderType">
                      <el-option
                        v-for="item in orderTypeOptions"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      />
                    </el-select>
                  </el-col>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="运单类型" prop="waybillType">
                  <el-col :span="22">
                    <el-select v-model="formData.waybillType" @change="changeGetCount">
                      <el-option
                        v-for="item in waybillTypeOptions"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      />
                    </el-select>
                  </el-col>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="保险" prop="insurance" label-width="88px">
                  <el-col :span="22">
                    <el-select v-model="formData.insurance" @change="changeGetCount">
                      <el-option
                        v-for="item in insuranceList"
                        :key="item.insurance"
                        :label="item.name"
                        :value="item.insurance"
                      />
                    </el-select>
                  </el-col>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="计价方式" prop="costWay" label-width="88px">
                  <el-col :span="22">
                    <el-select v-model="formData.costWay" @change="changeGetCount">
                      <el-option
                        v-for="item in costWayOptions"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      />
                    </el-select>
                  </el-col>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="送货前通知" prop="beforeSendNotice" label-width="82px">
                  <el-col :span="22">
                    <el-select v-model="formData.beforeSendNotice" size="mini" placeholder="请填写送货前通知" @change="changeGetCount">
                      <el-option label="需要" :value="1" />
                      <el-option label="不需要" :value="0" />
                    </el-select>
                  </el-col>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="提货方式" prop="deliveryWay">
                  <el-col :span="22">
                    <el-select v-model="formData.deliveryWay" @change="changeGetCount">
                      <el-option
                        v-for="item in deliveryWayOptions"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      />
                    </el-select>
                  </el-col>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="物控" prop="controll" label-width="88px">
                  <el-col :span="22">
                    <el-select v-model="formData.controll" @change="changeGetCount">
                      <el-option
                        v-for="item in controllerOptions"
                        :key="item.status"
                        :label="item.name"
                        :value="item.status"
                      />
                    </el-select>
                  </el-col>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="结算类型" prop="settleType" label-width="88px">
                  <el-col :span="22">
                    <el-select v-model="formData.settleType" @change="changeGetCount">
                      <el-option
                        v-for="item in settleTypeOptions"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      />
                    </el-select>
                  </el-col>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="回单份数" prop="signDocumentNum">
                  <el-col :span="22">
                    <el-input v-model="formData.signDocumentNum" @change="changeGetCount" />
                  </el-col>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="回单要求" prop="signDocumentBackRequirement">
                  <el-col :span="22">
                    <el-input v-model="formData.signDocumentBackRequirement" />
                  </el-col>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="费用" prop="waybillCharges" label-width="88px">
                  <el-col :span="22">
                    <el-input v-model="formData.waybillCharges" />
                  </el-col>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="公司成本" prop="waybillCost" label-width="88px">
                  <el-col :span="22">
                    <el-input v-model="formData.waybillCost" />
                  </el-col>
                </el-form-item>
              </el-col>
              <el-col v-if="!add" :span="6">
                <!-- TODO成本+成本明细 -->
                <el-form-item label="应收" prop="waybillCharges">
                  <el-col :span="22">
                    <el-input v-model="formData.free.Charge" disabled placeholder="0" />
                  </el-col>
                </el-form-item>
              </el-col>
              <el-col v-if="!add" :span="6">
                <!-- TODO费用+费用明细 -->
                <el-form-item label="应付" prop="waybillCost">
                  <el-col :span="22">
                    <el-input v-model="formData.free.SendCost" disabled placeholder="0" />
                  </el-col>
                </el-form-item>
              </el-col>
              <el-col v-if="!add" :span="6">
                <!-- TODO一级承运费 -->
                <el-form-item label="一级承运费" prop="waybillCost" label-width="88px">
                  <el-col :span="22">
                    <el-input v-model="formData.waybillCarrier1SendCost" disabled placeholder="0" />
                  </el-col>
                </el-form-item>
              </el-col>
              <el-col v-if="!add" :span="6">
                <!-- TODO一级承运费 -->
                <el-form-item label="二级承运费" prop="waybillCost" label-width="88px">
                  <el-col :span="22">
                    <el-input v-model="formData.waybillCarrier2SendCost" disabled placeholder="0" />
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </el-collapse-transition>
      </el-card>
      <el-card v-show="tabName !== 'noPass'" class="box-card-router">
        <el-steps :active="routeActiveCount" finish-status="success">
          <!-- v-for="(routeInfo, index) in routeInfos" -->
          <el-step
            v-for="(routeInfo, index) in routeInfos"
            :key="index"
            :title="parseInt(routeInfo.node) === 1?
              '已提货':parseInt(routeInfo.node) === 2?
                '派送中':parseInt(routeInfo.node) === 3?
                  '已到达':parseInt(routeInfo.node) === 4?
                    '已签收':routeInfo.node"
          >
            <template slot="description">
              <div v-show="routeInfo.businessTime">业务时间：{{ routeInfo.businessTime }}</div>
              <el-collapse-transition>
                <div v-show="showRouteDetail">
                  <div v-show="routeInfo.operator">业务员：{{ routeInfo.operator }}</div>
                  <div v-show="routeInfo.fromWhere">起始地址：{{ routeInfo.fromWhere }}</div>
                </div>
              </el-collapse-transition>
            </template>
          </el-step>
          <i :class="showRouteDetail?'el-icon-arrow-up':'el-icon-arrow-down'" style="float: right; padding: 3px 0" @click="showRouteDetailClick" />
        </el-steps>
      </el-card>
      <el-tag type="danger">注意后面的页面哦，有必填项哦！</el-tag>
      <el-tabs type="border-card" style="width:100%">
        <el-tab-pane label="客户信息">
          <el-row>
            <el-col :span="6">
              <el-form-item label="客户" prop="customer" label-width="90px">
                <!-- <el-input v-model="formData.customer" :disabled="readonly" /> -->
                <el-col :span="22">
                  <el-select v-model="formData.customer" :disabled="readonly" filterable clearable @change="handleCustomerChange">
                    <el-option
                      v-for="item in customerList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.name"
                    />
                  </el-select>
                </el-col>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="仓库" prop="warehouseAddress" label-width="90px">
                <el-col :span="22">
                  <el-select v-model="formData.warehouseAddress" filterable clearable style="width:186px" @change="handleWarehouseAddressChange">
                    <el-option
                      v-for="item in warehouseList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.name"
                    />
                  </el-select>
                </el-col>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="22">
              <el-form-item label="送货人要求" prop="senderRequirement" label-width="90px">
                <el-input v-model="formData.senderRequirement" type="textarea" placeholder="请填写送货人要求" />
              </el-form-item>
            </el-col>
            <!-- 这里多行输入 -->
            <el-col :span="24">
              <el-form-item label="委托事项" prop="entrustThing" label-width="90px">
                <el-input v-model="formData.entrustThing" type="textarea" placeholder="请填写委托事项" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="注意事项" prop="extend" label-width="90px">
                <el-input v-model="formData.extend" type="textarea" placeholder="请填写注意事项" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-tab-pane>
        <!-- ======================================   订单细节表    ============================== -->
        <el-tab-pane label="订单详细信息">
          <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAddDetails">添加</el-button>
          <el-button type="success" icon="el-icon-delete" size="mini" @click="handleDeleteDetails">删除</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="handleDeleteAllDetails">清空</el-button>
          <el-table
            ref="tb"
            :data="waybillDetailList"
            :row-class-name="rowClassName"
            :row-key="getRowKeys"
            @selection-change="handleDetailSelectionChange"
          >
            <el-table-column type="selection" reserve-selection width="30" align="center" />
            <el-table-column label="序号" align="center" prop="xh" width="50" />
            <el-table-column label="商品名称" align="center" width="250" prop="goods">
              <template slot-scope="scope">
                <el-input
                  v-model="waybillDetailList[scope.row.xh-1].goods"
                  placeholder="请填写商品名称"
                />
              </template>
            </el-table-column>
            <el-table-column label="数量(个)" align="center" prop="num" width="150">
              <template slot-scope="scope">
                <el-input
                  v-model="waybillDetailList[scope.row.xh-1].num"
                  placeholder="请填写数量"
                />
              </template>
            </el-table-column>
            <el-table-column label="体积(方)" align="center" prop="cubuge" width="150">
              <template slot-scope="scope">
                <el-input
                  v-model="waybillDetailList[scope.row.xh-1].cubuge"
                  placeholder="请填写体积"
                />
              </template>
            </el-table-column>
            <el-table-column label="重量(kg)" align="center" width="150" prop="weight">
              <template slot-scope="scope">
                <el-input
                  v-model="waybillDetailList[scope.row.xh-1].weight"
                  placeholder="请填写重量"
                />
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="发货信息">
          <el-row>
            <el-col :span="24">
              <el-form-item label="下单时间" prop="placeBillwayTime" label-width="100px">
                <!-- <el-input v-model="formData.placeBillwayTime" style="width:186px" /> -->
                <el-col :span="22">
                  <el-date-picker v-model="formData.placeBillwayTime" :default-value="new Date()" type="date" placeholder="选择日期时间" />
                </el-col>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="发货人" prop="sender" label-width="100px">
                <el-col :span="22">
                  <el-input v-model="formData.sender" placeholder="请填写发货人" />
                </el-col>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="发货人邮箱" prop="senderEmail" label-width="100px">
                <el-col :span="22">
                  <el-input v-model="formData.senderEmail" placeholder="请填写发货人邮箱" />
                </el-col>
              </el-form-item>
            </el-col>
            <el-col :span="12" class="">
              <el-form-item label="发货人手机" prop="senderMobile" label-width="100px">
                <el-col :span="22">
                  <el-input v-model="formData.senderMobile" placeholder="请填写发货人手机" />
                </el-col>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="始发省份" prop="startProvince" label-width="100px">
                <el-col :span="22">
                  <el-input v-model="formData.startProvince" placeholder="请填写始发地省份" @change="changeGetCount" />
                </el-col>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="始发地城市" prop="startCity" label-width="100px">
                <el-col :span="22">
                  <el-input v-model="formData.startCity" placeholder="请填写始发地城市" @change="changeGetCount" />
                </el-col>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="始发地县区" prop="startCounty" label-width="100px">
                <el-col :span="22">
                  <el-input v-model="formData.startCounty" placeholder="请填写始发地县区" @change="changeGetCount" />
                </el-col>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="填写详细地址" prop="startAddress" label-width="100px">
                <el-col :span="24">
                  <el-input v-model="formData.startAddress" type="textarea" placeholder="请填写始发地地址" @change="changeGetCount" />
                </el-col>
              </el-form-item>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="收货信息">
          <el-row>
            <el-col :span="12">
              <el-form-item label="收货人" prop="receiver" label-width="100px">
                <!-- <el-autocomplete v-model="formData.receiver" :fetch-suggestions="queryReceiverSearchAsync" value-key="name" placeholder="请输入内容" @select="handleSelect" /> -->
                <el-select v-model="formData.receiver" filterable placeholder="请输入收货人" allow-create remote reserve-keyword :remote-method="remoteReceiverMethod" @change="selectReceiverMethod">
                  <el-option v-for="item in receivers" :key="item.id" :label="item.name" :value="item.name" />
                </el-select>
                <i class="el-icon-circle-plus-outline" style="color:#409EFF;margin-left:10px" @click="showAddReceiver" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="收货人公司" prop="receiverCompany" label-width="110px">
                <el-col :span="22">
                  <el-input v-model="formData.receiverCompany" placeholder="请填写收货人公司" @change="changeGetCount" />
                </el-col>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="收货人电话" prop="receiverMobile" label-width="110px">
                <el-col :span="22">
                  <el-input v-model="formData.receiverMobile" placeholder="请填写收货人电话" @change="changeGetCount" />
                </el-col>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="收货人邮箱" prop="receiverEmail" label-width="110px">
                <el-col :span="22">
                  <el-input v-model="formData.receiverEmail" placeholder="请填写收货人邮箱" @change="changeGetCount" />
                </el-col>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="目的地省份" prop="goalProvince" label-width="100px">
                <el-col :span="22">
                  <el-input v-model="formData.goalProvince" placeholder="请填写目的地省份" @change="changeGetCount" />
                </el-col>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="目的地城市" prop="goalCity" label-width="110px">
                <el-col :span="22">
                  <el-input v-model="formData.goalCity" placeholder="请填写目的地城市" @change="changeGetCount" />
                </el-col>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="目的地县区" prop="goalCounty" label-width="100px">
                <el-col :span="22">
                  <el-input v-model="formData.goalCounty" placeholder="请填写目的地县区" @change="changeGetCount" />
                </el-col>
              </el-form-item>
            </el-col>
            <el-col :span="22">
              <el-form-item label="目的地地址" prop="goalAddres" label-width="100px">
                <el-col :span="24">
                  <el-input v-model="formData.goalAddress" type="textarea" placeholder="请填写目的地地址" @change="changeGetCount" />
                </el-col>
              </el-form-item>
            </el-col>
          </el-row>
        </el-tab-pane>
        <!-- <el-tab-pane label="地址信息">
          <el-row style="margin-left:1%">
            <el-col :span="6">
              <el-form-item label="始发地省份" prop="startProvince" label-width="100px">
                <el-input v-model="formData.startProvince" style="width:186px" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="始发地城市" prop="startCity" label-width="100px">
                <el-input v-model="formData.startCity" style="width:186px" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="始发地地址" prop="startAddress" label-width="100px">
                <el-input v-model="formData.startAddress" style="width:186px" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row style="margin-left:1%">
            <el-col :span="6">
              <el-form-item label="目的地省份" prop="goalProvince" label-width="100px">
                <el-input v-model="formData.goalProvince" style="width:186px" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="目的地城市" prop="goalCity" label-width="100px">
                <el-input v-model="formData.goalCity" style="width:186px" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="目的地地址" prop="goalAddress" label-width="100px">
                <el-input v-model="formData.goalAddress" style="width:186px" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-tab-pane> -->
        <el-tab-pane label="费用信息">
          <el-button type="primary" size="mini" style="position:relative;left:92%;top:30px;z-index:199" @click="addChargeInfo">增加</el-button>
          <el-row v-for="(item,index) in waybillChargeInfo" :key="index" style="margin-left:0%" @mouseenter.native="handleShowRemove(index)">
            <el-col v-for="(itemInfo,indexInfo) in item" :key="indexInfo" :span="6" style="margin-left:30px">
              <el-form-item :label="itemInfo.label" :prop="itemInfo[itemInfo.value]?itemInfo[itemInfo.value].toString():itemInfo[itemInfo.value]" label-width="70px">
                <el-select v-if="itemInfo.value === 'rateType'" v-model="itemInfo[itemInfo.value]">
                  <el-option
                    v-for="itemRate in rateTypeOptions"
                    :key="itemRate.id"
                    :label="itemRate.name"
                    :value="itemRate.name"
                  />
                </el-select>
                <!-- <el-select v-else-if="itemInfo.value === 'chargesRef'" v-model="itemInfo[itemInfo.value]" style="width:176px;">
                  <el-option
                    v-for="itemRate in chargesRefOptions"
                    :key="itemRate.id"
                    :label="itemRate.name"
                    :value="itemRate.id"
                  />
                </el-select> -->
                <el-input v-else v-model="itemInfo[itemInfo.value]" />
              </el-form-item>
            </el-col>
            <el-button v-if="index === showRemoveBtn" icon="el-icon-circle-close" circle size="mini" style="border:0px;margin-left:5px" @click="removeChargeInfo(item)" />
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="成本信息">
          <el-button type="primary" size="mini" style="position:relative;left:92%;top:30px;z-index:199" @click="addSendCostInfo">增加</el-button>
          <el-row v-for="(item,index) in waybillSendCostInfo" :key="index" @mouseenter.native="handleShowRemove(index)">
            <el-col v-for="(itemInfo,indexInfo) in item" :key="indexInfo" :span="6" style="margin-left:30px">
              <el-form-item :label="itemInfo.label" :prop="itemInfo[itemInfo.value]?itemInfo[itemInfo.value].toString():itemInfo[itemInfo.value]" label-width="90px">
                <el-select v-if="itemInfo.value === 'feeType'" v-model="itemInfo[itemInfo.value]">
                  <el-option
                    v-for="itemRate in rateTypeOptions"
                    :key="itemRate.id"
                    :label="itemRate.name"
                    :value="itemRate.name"
                  />
                </el-select>
                <el-select v-else-if="itemInfo.value === 'carrierId'" v-model="itemInfo[itemInfo.value]" clearable filterable>
                  <el-option
                    v-for="itemCarrier in carrierList"
                    :key="itemCarrier.id"
                    :label="itemCarrier.name"
                    :value="itemCarrier.id"
                  />
                </el-select>
                <!-- <el-select v-else-if="itemInfo.value === 'costRef'" v-model="itemInfo[itemInfo.value]">
                  <el-option
                    v-for="itemRate in chargesRefOptions"
                    :key="itemRate.id"
                    :label="itemRate.name"
                    :value="itemRate.id"
                  />
                </el-select>
                <el-select v-else-if="itemInfo.value === 'settleWay'" v-model="itemInfo[itemInfo.value]">
                  <el-option
                    v-for="itemRate in settleWayOptions"
                    :key="itemRate.id"
                    :label="itemRate.name"
                    :value="itemRate.id"
                  />
                </el-select>-->
                <el-input v-else v-model="itemInfo[itemInfo.value]" />
              </el-form-item>
            </el-col>
            <el-button v-show="index === showRemoveBtn" icon="el-icon-circle-close" circle size="mini" style="border:0px;margin-left:5px" @click="removeSendCostInfo(item)" />
          </el-row>
        </el-tab-pane>
      </el-tabs>
    </el-form>
    <div style="margin-left:80%;margin-top:20px">
      <el-button @click="cancelDetailDialog">取 消</el-button>
      <el-button v-if="add" type="primary" @click.native="handleAddWaybill">确 定</el-button>
      <el-button v-if="(readonly && !add) && (tabName === 'noPass') && isShowConfirmBtn" type="primary" @click.native="handleUpdateForm">确 定</el-button>
    </div>
  </div>
</template>

<script>
import { WaybillApi } from '@/api/waybill/waybill'
import { planAndExecuteApi } from '@/api/planAndExecute/pickupPlan'

export default {
  name: 'WaybillDetail',
  props: {
    data: {
      type: Object,
      default: () => {
        return {
          free: {}
        }
      }
    },
    orderChannelOptions: { // 下单渠道下拉框
      type: Array,
      default: () => []
    },
    orderTypeOptions: { // 订单类型下拉框
      type: Array,
      default: () => []
    },
    deliveryWayOptions: { // 提货方式下拉框
      type: Array,
      default: () => []
    },
    readonly: { // 只读禁用更改
      type: Boolean,
      default: false
    },
    waybillInfoDetailQueryLoading: {
      type: Boolean,
      default: false
    },
    add: {
      type: Boolean,
      default: false
    },
    warehouseList: {
      type: Array,
      default: () => {}
    },
    customerList: {
      type: Array,
      default: () => {}
    },
    tabName: {
      type: String,
      default: 'noPass'
    }
  },
  data() {
    // 校验体积以及重量是否都为0
    var validateCW = (rule, value, callback) => {
      if (!this.formData.cubage && !this.formData.weight) {
        callback(new Error('体积或体重须有一项大于0'))
      } else {
        callback()
      }
    }
    return {
      rules: {
        customer: [
          { required: true, message: '请输入客户', trigger: 'blur' }
        ],
        orderNo: [
          { required: true, message: '请输入订单号', trigger: 'blur' }
        ],
        sourceOrderNo: [
          { required: true, message: '请输入源头订单号', trigger: 'blur' }
        ],
        // mailNo: [
        //   { required: true, message: '请输入运单号', trigger: 'blur' }
        // ],
        receiver: [
          { required: true, message: '请输入收货人', trigger: 'blur' }
        ],
        // orderType: [
        //   { required: true, message: '请选择订单类型', trigger: 'blur' }
        // ],
        // waybillType: [
        //   { required: true, message: '请选择订单类型', trigger: 'blur' }
        // ],
        // settleType: [
        //   { required: true, message: '请选择结算类型', trigger: 'blur' }
        // ],
        // deliveryWay: [
        //   { required: true, message: '请选择结算类型', trigger: 'blur' }
        // ],
        // deliveryWayOptions: [
        //   { required: true, message: '请选择提货方式', trigger: 'blur' }
        // ],
        signDocumentNum: [
          { required: true, message: '请输入回单份数', trigger: 'blur' }
        ],
        // placeBillwayTime: [
        //   { required: true, message: '请选择下单时间', trigger: 'blur' }
        // ],
        goods: [
          { required: true, message: '请输入货品', trigger: 'blur' }
        ],
        goodsTypeShortName: [
          { required: true, message: '请输入货品类型', trigger: 'blur' }
        ],
        quantity: [
          { required: true, message: '请输入箱数', trigger: 'blur' }
        ],
        cubage: [
          { validator: validateCW, trigger: 'blur' }
        ],
        weight: [
          { validator: validateCW, trigger: 'blur' }
        ],
        // controll: [
        //   { required: true, message: '请选择是否物控', trigger: 'blur' }
        // ],
        warehouseAddress: [
          { required: true, message: '请选择仓库地址', trigger: 'blur' }
        ],
        // costWay: [
        //   { required: true, message: '请选择计价方式', trigger: 'blur' }
        // ],
        // startProvince: [
        //   { required: true, message: '请输入起始省份', trigger: 'blur' }
        // ],
        // startCity: [
        //   { required: true, message: '请输入起始城市', trigger: 'blur' }
        // ],
        // startAddress: [
        //   { required: true, message: '请输入起始地址', trigger: 'blur' }
        // ],
        // goalProvince: [
        //   { required: true, message: '请输入目的省份', trigger: 'blur' }
        // ],
        goalCity: [
          { required: true, message: '请输入目的城市', trigger: 'blur' }
        ],
        goalAddress: [
          { required: true, message: '请输入目的地址', trigger: 'blur' }
        ]
      },
      formData: this.data,
      carrierList: [], // 承运商下拉框列表
      waybillDetailList: [], // 订单细节
      waybillTypeOptions: [], // 运单类型
      settleTypeOptions: [], // 结算类型
      costWayOptions: [], // 计价方式
      rateTypeOptions: [], // 费用类型
      // chargesRefOptions: [], // 成本或收费依据 与计价方式请求id一样
      // settleWayOptions: [], // 结算方式
      showRemoveBtn: 0,
      getRowKeys(row) { // 行id
        return row.id
      },
      isShowConfirmBtn: true, // 是否展示确定按钮
      controllerOptions: [
        { status: 1, name: '是' },
        { status: 0, name: '否' }
      ], // 物控
      insuranceList: [
        { insurance: 0, name: '没有' },
        { insurance: 1, name: '有' }
      ],
      routeInfos: [
        { node: 1, businessTime: '', operator: '', fromWhere: '' },
        { node: 2, businessTime: '', operator: '', fromWhere: '' },
        { node: 3, businessTime: '', operator: '', fromWhere: '' },
        { node: 4, businessTime: '', operator: '', fromWhere: '' }
      ], // 路由信息的数组，后端传来的list
      routeActiveCount: 0, // 路由激活状态
      // 费用信息
      waybillChargeInfo: [
        [
          { label: '费用类型', rateType: '', value: 'rateType' },
          // { label: '收费依据', chargesRef: '', value: 'chargesRef' },
          // { label: '费率', rate: '0', value: 'rate' },
          { label: '费用', fee: '0', value: 'fee' }
        ]
      ],
      // 成本信息
      waybillSendCostInfo: [
        [
          { label: '承运商', carrierId: '', value: 'carrierId' },
          { label: '费用类型', feeType: '', value: 'feeType' },
          // { label: '结算方式', settleWay: '', value: 'settleWay' },
          // { label: '成本依据', costRef: '', value: 'costRef' },
          // { label: '费率', rate: '0', value: 'rate' },
          { label: '费用', fee: '0', value: 'fee' }
        ]
      ],
      waybillChargeDTOS: [], // 存储发给后端的费用
      waybillSendCostDTOS: [], // 存储发给后端的成本
      receivers: [], // 收货人下拉框
      addReceiverVisible: false, // 收货人弹窗
      addReceiverVO: [], // 增加收货人的信息
      showCard: true, // 展示订单信息框
      showRouteDetail: false, // 展示路由信息
      goodsList: [] // 存放货品类型信息
    }
  },
  created() {
    if (this.add) {
      this.formData = {}
      this.$set(this.formData, 'channel', this.orderChannelOptions[0].id)
      this.$set(this.formData, 'orderType', this.orderTypeOptions[0].id)
      // this.$set(this.formData, 'waybillType', this.waybillTypeOptions[0].id)
      // this.$set(this.formData, 'settleType', this.settleTypeOptions[0].id)
      // this.$set(this.formData, 'deliveryWay', this.deliveryWayOptions[0].id)
      // this.$set(this.formData, 'placeBillwayTime', new Date())
      this.$set(this.formData, 'beforeSendNotice', 0)
      this.$set(this.formData, 'weight', 0)
      this.$set(this.formData, 'cubage', 0)
    }
  },
  mounted() {
    // 获取承运商列表
    planAndExecuteApi.getCarrierList({ pageSize: 1000 }).then(res => {
      this.carrierList = res.data
    })
    // 获取货品类型
    WaybillApi.queryGoods({ name: '', pageSize: 1000 }).then((response) => {
      // 查询goods
      if (response == null) {
        return
      } else {
        this.goodsList = response.data
      }
    }).catch(() => {
      this.$message.error('网络错误')
    })
    // 结算类型下拉框列表
    WaybillApi.getAllTypeList(1326439352527618049n).then(res => {
      this.settleTypeOptions = res.data
      if (this.add) {
        this.$set(this.formData, 'settleType', this.settleTypeOptions[0].id)
      }
    }).catch(err => {
      this.$message.error(err)
    })
    WaybillApi.queryReceiver({ name: '' }).then(response => {
      if (response == null) {
        return
      } else {
        this.receivers = response.data
      }
    })
      .catch(() => {
        this.$message.error('网络错误')
      })
    // 结算方式下拉框列表
    WaybillApi.getAllTypeList(1326439352527618049n).then(res => {
      this.settleWayOptions = res.data
      if (this.add) {
        this.$set(this.formData, 'settleWay', this.settleWayOptions[0].id)
      }
    }).catch(err => {
      this.$message.error(err)
    })
    // 运单类型下拉框列表
    WaybillApi.getAllTypeList(1340588501313388544n).then(res => {
      this.waybillTypeOptions = res.data
      if (this.add) {
        this.$set(this.formData, 'waybillType', this.waybillTypeOptions[0].id)
      }
    }).catch(err => {
      this.$message.error(err)
    })
    // 计价方式下拉框列表
    WaybillApi.getAllTypeList(1326439353026740225n).then(res => {
      this.costWayOptions = res.data
      // this.chargesRefOptions = res.data
      if (this.add) {
        // this.$set(this.formData, 'chargesRef', this.chargesRefOptions[0].id)
        this.$set(this.formData, 'costWay', this.costWayOptions[0].id)
      }
    }).catch(err => {
      this.$message.error(err)
    })
    // 费用类型下拉框列表
    WaybillApi.getAllTypeList(1340624706952364032n).then(res => {
      this.rateTypeOptions = res.data
      if (this.add) {
        this.$set(this.formData, 'rateType', this.rateTypeOptions[0].id)
      }
    }).catch(err => {
      this.$message.error(err)
    })
    if (this.add) {
      WaybillApi.getOrderNo().then(res => {
        console.log(res)
        const { currentSqno, purpose } = res
        this.$set(this.formData, 'orderNo', purpose + currentSqno)
        this.$set(this.formData, 'sourceOrderNo', purpose + currentSqno)
        this.$set(this.formData, 'warehouseId', [])
      }).catch(err => {
        this.$message.error(err)
      })
    }

    if (this.deliveryWayOptions.length) {
      this.$set(this.formData, 'deliveryWay', this.deliveryWayOptions[0].id)
    }
    if (this.costWayOptions.length) {
      this.$set(this.formData, 'costWay', this.costWayOptions[0].id)
    }

    this.$set(this.formData, 'signDocumentNum', 1)
    this.$set(this.formData, 'insurance', 1)
    this.$set(this.formData, 'controll', 0)
    this.$set(this.formData, 'placeBillwayTime', new Date())
    this.$set(this.formData, 'beforeSendNotice', 0)
  },
  methods: {
    // 展开与隐藏弹窗卡片
    showRouteDetailClick() {
      this.showRouteDetail = !this.showRouteDetail
    },
    /**
     * 重算费用
     */
    changeGetCount() {
      const params = {}
      Object.assign(params, this.formData, { placeBillwayTime: '' })
      WaybillApi.getCount(params).then(res => {
        this.$set(this.formData, 'waybillCharges', res.waybillCharges)
        console.log(res)
      })
    },
    /**
 * 时间格式化
 * @param time 传入所需格式化时间
 */
    formatTime(time) {
      if (!time) {
        return
      }
      time = new Date(time)
      time = time.getFullYear() + '-' +
        ((time.getMonth() + 1) < 10 ? '0' + (time.getMonth() + 1) : time.getMonth() + 1) + '-' +
        (time.getDate() < 10 ? '0' + time.getDate() : time.getDate()) + ' ' +
        (time.getHours() + 1 < 10 ? '0' + time.getHours() : time.getHours()) + ':' +
        (time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes()) + ':' +
        (time.getSeconds() < 10 ? '0' + time.getSeconds() : time.getSeconds())
      return time
    },
    /**
     * @description: 点击每一行的 查看 路由 信息 事件
     * @param {*} index
     * @param {*} row
     * @return {*}
     */
    onBtnViewRouteClick(row) {
      
      try {
        this.routeInfos = [
          { node: 1, businessTime: '', operator: '', fromWhere: '' },
          { node: 2, businessTime: '', operator: '', fromWhere: '' },
          { node: 3, businessTime: '', operator: '', fromWhere: '' },
          { node: 4, businessTime: '', operator: '', fromWhere: '' }
        ]
        this.routeLoading = true
        // 如果有审核记录则调用修改，如果无审核记录则进行审核
        
        WaybillApi.queryOrderRouteInfoByCustomerId(row.waybillNo).then(
          response => {
            if (!response.data.length) {
              this.routeLoading = false
              return
            }
            response.data[0].color = '#0bbd87'
            if (response != null) {
              if (response.data.length) {
                this.routeActiveCount = response.data.length
                response.data.map(item => {
                  this.routeInfos.map(routeItem => {
                    // routeActiveCount:0, //路由激活状态
                    if (parseInt(item.node) === routeItem.node) {
                      routeItem.businessTime = item.businessTime
                      routeItem.operator = item.operator
                      routeItem.fromWhere = item.fromWhere
                    }
                  })
                })
                // this.routeInfos = response.data
              }
            } else {
              this.routeInfos = [
                { node: 1, businessTime: '', operator: '', fromWhere: '' },
                { node: 2, businessTime: '', operator: '', fromWhere: '' },
                { node: 3, businessTime: '', operator: '', fromWhere: '' },
                { node: 4, businessTime: '', operator: '', fromWhere: '' }
              ]
            }
            this.routeLoading = false
          }
        )
      } catch (error) {
        console.log(error)
        this.$message.error('网络异常')
        this.routeLoading = false
      }
    },
    /**
     * 获取指定客户的仓库
     */
    getWarehouse(ids) {
      planAndExecuteApi.queryCustomerAndWarehouse({ ids }).then(res => {
        //   this.customerList = res.customerDTOS
        this.warehouseList = res.customerWarehouseVOS
        if (this.warehouseList.length) {
          this.$set(this.formData, 'warehouseAddress', this.warehouseList[0].name)
          this.handleWarehouseAddressChange(this.warehouseList[0].name)
        } else {
          this.$set(this.formData, 'warehouseAddress', '')
        }
      })
    },
    // 展开与隐藏弹窗卡片
    showCardClick() {
      this.showCard = !this.showCard
    },
    /**
     * 收货人选框搜索
     */
    remoteReceiverMethod(query) {
      if (query) {
        WaybillApi.queryReceiver({ name: query }).then(res => {
          if (res.data.length) {
            this.receivers = res.data
          }
        })
      } else {
        WaybillApi.queryReceiver().then(res => {
          if (res.data.length) {
            this.receivers = res.data
          }
        })
      }
    },
    /**
     * 收货人选框
     */
    selectReceiverMethod(query) {
      // receivers
      const receiverDTO = this.receivers.find((item) => { // 这里的userList就是上面遍历的数据源
        return item.name === query// 筛选出匹配数据
      })
      // formData.receiverEmail
      if (receiverDTO) {
        this.$set(this.formData, 'receiverEmail', receiverDTO.email)
        this.$set(this.formData, 'goalProvince', receiverDTO.province)
        this.$set(this.formData, 'goalCity', receiverDTO.city)
        this.$set(this.formData, 'goalAddress', receiverDTO.address)
        console.log(receiverDTO)
        console.log(query)
      }
    },
    // 展示增加收货人
    showAddReceiver() {
      this.$emit('showAddReceiver')
    },
    // 订单细节diolog里面的table 的 序号
    rowClassName({ row, rowIndex }) {
      row.xh = rowIndex + 1
    },
    // 订单细节diolog里面的table， 单选框选中数据
    handleDetailSelectionChange(selection) {
      if (selection.length > 1) {
        this.$refs.tb.clearSelection()
        this.$refs.tb.toggleRowSelection(selection.pop())
      } else {
        this.checkedDetail = selection
      }
    },
    // 添加 一行订单细节的 的 按钮 的事件
    handleAddDetails() {
      if (this.waybillDetailList === undefined) {
        this.waybillDetailList = []
      }
      const obj = {}
      // obj.customerOrderId = this.formData.id
      obj.goods = ''
      obj.num = '0'
      obj.cubuge = '0'
      obj.weight = '0'

      this.waybillDetailList.push(obj)
    },
    // 删除 一行订单细节的 的 按钮操作！！！
    handleDeleteDetails() {
      if (this.checkedDetail.length === 0) {
        this.$alert('请先选择要删除的数据', '提示', {
          confirmButtonText: '确定'
        })
      } else {
        this.waybillDetailList.splice(this.checkedDetail[0].xh - 1, 1)
      }
    },
    // 清空 一行订单细节的 的 按钮操作
    handleDeleteAllDetails() {
      this.waybillDetailList = null
    },
    // 取消
    cancelDetailDialog() {
      this.$emit('cancelDetailDialog')
    },
    // 编辑
    handleUpdateForm() {
      this.$refs['tableForm'].validate((valid) => {
        if (valid) {
          this.$emit('handleUpdateForm')
        }
      })
    },
    // 增加
    handleAddWaybill() {
      this.$refs['tableForm'].validate((valid) => {
        if (valid) {
          this.$emit('handleAddWaybill')
        }
      })
    },
    /**
     * 取得仓库code和address
     */
    handleWarehouseAddressChange(value) {
      this.warehouseList.map(item => {
        if (item.name === value) {
          this.formData.warehouseCode = item.id
        }
      })
    },
    /**
     * 取得客户customerId和customer
     */
    handleCustomerChange(value) {
      this.customerList.map(item => {
        if (item.name === value) {
          this.formData.customerId = item.id
        }
      })
      this.getWarehouse(this.formData.customerId)
    },
    // 控制删除费用或添加按钮显示与隐藏
    handleShowRemove(index) {
      this.showRemoveBtn = index
    },
    // 增加费用条目
    addChargeInfo() {
      this.waybillChargeInfo.push([
        { label: '费用类型', rateType: '', value: 'rateType', id: '', version: '' },
        // { label: '收费依据', chargesRef: '', value: 'chargesRef' },
        // { label: '费率', rate: '', value: 'rate' },
        { label: '费用', fee: '', value: 'fee' }
      ])
    },
    // 增加成本条目
    addSendCostInfo() {
      this.waybillSendCostInfo.push([
        { label: '承运商', carrierId: '', value: 'carrierId', id: '', version: '' },
        { label: '费用类型', feeType: '', value: 'feeType', id: '', version: '' },
        // { label: '结算方式', settleWay: '', value: 'settleWay' },
        // { label: '成本依据', costRef: '', value: 'costRef' },
        // { label: '费率', rate: '', value: 'rate' },
        { label: '费用', fee: '', value: 'fee' }
      ])
    },
    // 删除费用条目
    removeChargeInfo(chargeInfo) {
      this.$confirm('确认删除该条费用信息吗！', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (chargeInfo[0].id) {
          let rateType,
            // rate,chargesRef,
            fee, id, version
          chargeInfo.map(item => {
            if (item.rateType) {
              rateType = item.rateType
              id = item.id
              version = item.version
            } else if (item.fee) {
              fee = item.fee
            }
            // else if (item.chargesRef) {
            //   chargesRef = item.chargesRef
            // }
            // else if (item.rate) {
            //   rate = item.rate
            // }
          })
          this.waybillChargeDTOS.push({
            rateType,
            // rate, chargesRef,
            fee, id, version,
            waybillId: this.formData.id,
            status: 0
          })
        }
        // eslint-disable-next-line no-extend-native
        Array.prototype.remove = function(val) {
          var index = this.indexOf(val)
          if (index > -1) {
            this.splice(index, 1)
          }
        }
        if (this.waybillChargeInfo.length === 1) {
          this.$message.warning('最后一项不可删除')
          return
        }
        this.waybillChargeInfo.remove(chargeInfo)
      }).catch(() => {})
    },
    // 删除成本条目
    removeSendCostInfo(SendCostInfo) {
      this.$confirm('确认删除该条成本信息吗！', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (SendCostInfo[0].id) {
          let feeType, carrierId,
            // rate, settleWay, costRef,
            fee, id, version
          SendCostInfo.map(item => {
            if (item.feeType) {
              feeType = item.feeType
              id = item.id
              version = item.version
            } else if (item.fee) {
              fee = item.fee
            } else if (item.carrierId) {
              carrierId = item.carrierId
            }
            // else if (item.settleWay) {
            //   settleWay = item.settleWay
            // } else if (item.costRef) {
            //   costRef = item.costRef
            // }
            // else if (item.rate) {
            //   rate = item.rate
            // }
          })
          this.waybillSendCostDTOS.push({
            feeType, carrierId,
            // rate, settleWay, costRef,
            fee, id, version,
            waybillId: this.formData.id,
            status: 0
          })
        }

        if (this.waybillSendCostInfo.length === 1) {
          this.$message.warning('最后一项不可删除')
          return
        }
        // eslint-disable-next-line no-extend-native
        Array.prototype.remove = function(val) {
          var index = this.indexOf(val)
          if (index > -1) {
            this.splice(index, 1)
          }
        }
        this.waybillSendCostInfo.remove(SendCostInfo)
      }).catch(() => {})
    },
    submitForm() {
      const p = { id: this.formData.id }
      WaybillApi.update(p, this.formData).then(res => {
      })
    }
  }
}
</script>

<style scoped>

</style>
