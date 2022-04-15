<template>
  <div>
    <div>
      <!--查询区-->
      <el-form
        :inline="true"
        :model="searchForm"
        class="searchFormStyle"
        size="mini"
        label-width="105px"
      >

        <el-row style="margin-top:-0%">
          <el-col
            :span="6"
            style="margin:0;margin-left:-3%;"
          >
            <el-form-item label="客户">
              <!-- <el-input v-model="searchForm.customer" style="width:88%" /> -->
              <el-select
                v-model="searchForm.ids"
                filterable
                multiple
                style="width:88%"
                clearable
                size="mini"
                @change="getWarehouse"
              >
                <el-option
                  v-for="item in customerList"
                  :key="item.id"
                  size="mini"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="仓库">
              <el-select
                v-model="searchForm.warehouseName"
                filterable
                style="width:88%"
                clearable
                size="mini"
              >
                <el-option
                  v-for="item in warehouseList"
                  :key="item.name"
                  size="mini"
                  :label="item.name"
                  :value="item.name"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col
            :span="6"
            style="margin:0;margin-left:-8%"
          >
            <el-form-item label="订单号">
              <el-input
                v-model="searchForm.orderNo"
                style="width: 88%"
              />
            </el-form-item>
            <el-form-item
              label="源头单号"
              style="padding:0;width:100%"
            >
              <el-input
                v-model="searchForm.sourceOrderNo"
                style="width: 88%"
                size="mini"
                @keyup.enter.native="onBtnQueryClick()"
              />
            </el-form-item>
            <!-- <el-form-item label="运单号">
              <el-input v-model="searchForm.mailNo" />
            </el-form-item> -->
          </el-col>
          <el-col
            :span="6"
            style="margin-left:-8%"
          >
            <el-form-item
              label="运单状态"
              style="width:100%"
              label-width="30%"
            >
              <el-select
                v-model="searchForm.status"
                filterable
                clearable
                style="width:80%"
              >
                <el-option
                  v-for="item in statusList"
                  :key="item.status"
                  :label="item.label"
                  :value="item.status"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              label="注意事项"
              style="padding:0;width:100%"
              label-width="30%"
            >
              <el-input
                v-model="searchForm.extend"
                style="width:80%"
                clearable
                size="mini"
                placeholder="请输入"
              />
            </el-form-item>
            <!-- <el-form-item label="提货方式">
              <el-select v-model="searchForm.deliveryWay" clearable style="width:163px">
                <el-option
                  v-for="item in deliveryWayList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item> -->
          </el-col>
          <el-col
            :span="6"
            style="margin-left:-8%"
          >
            <!-- <el-form-item label="订单类型">
              <el-select v-model="searchForm.orderType" clearable filterable style="width:80%">
                <el-option
                  v-for="item in orderTypeOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item> -->
            <el-form-item
              label="收货人"
              style="padding:0;width:100%"
              label-width="120px"
            >
              <el-input
                v-model="searchForm.receiver"
                size="mini"
                placeholder="请输入"
                style="width:110%"
                @keyup.enter.native="onBtnQueryClick()"
              />
            </el-form-item>
            <el-form-item
              label="客户类型"
              label-width="120px"
            >
              <el-select
                v-model="searchForm.customerType"
                placeholder="请选择"
                filterable
                clearable
                size="mini"
              >
                <el-option
                  v-for="item in customerTypeList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <!-- <el-form-item label="下单渠道">
              <el-select v-model="searchForm.channel" clearable>
                <el-option
                  v-for="item in orderChannelOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item> -->
          </el-col>
          <el-col
            :span="7"
            style="margin-left:-8%"
          >
            <el-form-item label="收货地址">
              <el-input
                v-model="searchForm.goalAddress"
                clearable
                style="width:124%"
              />
            </el-form-item>
            <el-form-item label="下单时间">
              <el-date-picker
                v-model="timeList"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                style="width:220px"
                end-placeholder="结束日期"
                @change="changeTime"
              />
            </el-form-item>
          </el-col>
          <!-- <el-col  :span="6" style="margin-left:-10%">
            <el-form-item label="上游订单号">
              <el-input v-model="searchForm.upstreamOrderNo" />
            </el-form-item>
            <el-form-item label="源头单号">
              <el-input v-model="searchForm.sourceOrderNo" />
            </el-form-item>
          </el-col> -->
          <el-col
            :span="2"
            style="margin-left:-4%;margin-top:2.4%"
          >
            <el-form-item>
              <el-button
                type="primary"
                icon="el-icon-search"
                @click="handleSearch"
              >查询</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="batchBtnStyle">
      <!--功能区-->
      <el-button
        v-if="tabName === 'noPass'"
        size="mini"
        icon="el-icon-plus"
        type="primary"
        @click="handleClickAdd"
      >增加</el-button>
      <el-button
        size="mini"
        type="danger"
        icon="el-icon-delete"
        @click="handleMultiDelete"
      >删除</el-button>
      <el-button
        v-if="tabName === 'noPass'"
        size="mini"
        icon="el-icon-receiving"
        type="primary"
        @click="handleMerge"
      >合单</el-button>
      <el-button
        v-if="tabName === 'noPass'"
        size="mini"
        icon="el-icon-warning"
        type="primary"
        @click="handleApproval"
      >审核</el-button>
      <el-button
        v-if="tabName !== 'noPass'"
        size="mini"
        type="primary"
        icon="el-icon-s-claim"
        @click="handleFinishPickup"
      >完成提货</el-button>
      <el-button
        v-if="tabName !== 'noPass'"
        size="mini"
        type="primary"
        icon="el-icon-s-claim"
        @click="handleSign"
      >签收</el-button>

      <!-- <el-dropdown split-button type="primary" style="margin-left:3px;margin-right:7px;margin-bottom:5px" @command="onDropdownCommandMerge">
        合单撤单
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="merge">合单</el-dropdown-item>
          <el-dropdown-item command="unMerge">撤销合单</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown> -->
      <el-button
        icon="el-icon-share"
        size="mini"
        type="primary"
        @click="handleExport"
      >导出</el-button>

    </div>
    <el-tabs
      v-model="tabName"
      class="tabBox"
      type="card"
      @tab-click="handTabClick"
    >
      <el-tab-pane
        label="未审核"
        name="noPass"
      >
        <div>
          <!--内容区-->
          <el-table
            ref="table"
            :key="tableKey"
            v-loading="queryLoading"
            class="tableBox"
            element-loading-text="Loading"
            fit
            highlight-current-row
            border
            :data="tableData"
            height="600"
            style="margin-top:0px"
            :row-key="getRowKeys"
            :expand-row-keys="expands"
            @expand-change="expandChange"
            @sort-change="changeTableSort"
            @selection-change="handleSelectionChange"
            @row-dblclick="handleDbClick"
          >
            <el-table-column
              :key="Math.random()"
              label="全选"
              :selectable="selectEvent"
              type="selection"
              reserve-selection
              width="40"
              align="center"
            />
            <el-table-column
              :key="Math.random()"
              label="序号"
              type="index"
              width="40"
              align="center"
            />
            <el-table-column
              :key="Math.random()"
              class="orderTableDetail"
              align="center"
              prop="orderTableDetail"
              label="明细"
              type="expand"
              width="40"
            >
              <template slot-scope>
                <item-detail
                  ref="orderTableDetail"
                  :order-table-detail="orderTableDetail"
                  :detail-query-loading="detailQueryLoading"
                />
              </template>
            </el-table-column>
            <el-table-column
              :key="Math.random()"
              label="源头单号"
              sortable
              prop="sourceOrderNo"
              width="90"
              show-overflow-tooltip
              align="center"
            >
              <template slot-scope="{ row }">
                <span
                  :data-clipboard-text="row.sourceOrderNo"
                  class="tag-read"
                  @click="copyText"
                > {{ row.sourceOrderNo == null ? '空' : row.sourceOrderNo }}</span>
              </template>
            </el-table-column>
            <el-table-column
              :key="Math.random()"
              label="订单号"
              sortable
              prop="orderNo"
              width="100"
              show-overflow-tooltip
              align="center"
            >
              <template slot-scope="{ row }">
                <span
                  style="color:#409EFF"
                  :data-clipboard-text="row.orderNo"
                  class="tag-read"
                  @click="copyText"
                > {{ row.orderNo == null ? '空' : row.orderNo }}</span>
              </template>
            </el-table-column>
            <el-table-column
              :key="Math.random()"
              label="客户"
              sortable
              prop="customer"
              width="70"
              show-overflow-tooltip
              align="center"
            >

              <template slot-scope="{row}">
                <span>
                  {{ row.customerDTO.ename!==undefined?row.customerDTO.ename:'无' }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              v-if="tableColVisible"
              :key="Math.random()"
              align="center"
              prop="entrustThing"
              label="委托事项"
              show-overflow-tooltip
              width="40"
            >
              <template slot-scope="{ row }">
                <span>{{ row.entrustThing == 0 ? '无' :row.entrustThing == null ? '无' : row.entrustThing }}</span>
              </template>
            </el-table-column>
            <el-table-column
              v-if="tableColVisible"
              :key="Math.random()"
              align="center"
              prop="extend"
              label="注意事项"
              show-overflow-tooltip
              width="40"
            >
              <template slot-scope="{ row }">
                <span>{{ row.extend == 0 ? '无' :row.extend == null ? '无' : row.extend }}</span>
              </template>
            </el-table-column>
            <el-table-column
              :key="Math.random()"
              label="下单时间"
              show-overflow-tooltip
              sortable
              prop="placeBillwayTime"
              width="82"
              align="center"
            />
            <el-table-column
              :key="Math.random()"
              label="状态"
              width="60"
              sortable
              prop="status"
              align="center"
              @mousedown="showwaybillstatus"
            >
              <template slot-scope="{row}">
                <div
                  @mouseenter="showwaybillstatus(row)"
                  @mouseleave="closewwaybillstatus(row)"
                >

                  <el-popover
                    placement="right"
                    width="300"
                    trigger="hover"
                  >

                    <el-table
                      v-loading="querywaybillstatusloading"
                      width="270"
                      :data="gridData"
                    >
                      <!-- <el-table-column
                        width="90"
                        property="businessTime"
                        label="业务时间"
                      /> -->
                      <el-table-column
                        width="90"
                        property="discription"
                        label="描述"
                      />
                      <el-table-column
                        width="90"
                        property="statusValue"
                        label="状态值"
                      />
                    </el-table>
                    <div
                      slot="reference"
                      @click="querywaybillstatus(row)"
                    >
                      <span>
                        {{
                          parseInt(row.status) === 1
                            ?'待制定'
                            :parseInt(row.status) === 21
                              ?'待提货'
                              :parseInt(row.status) === 31
                                ?'提货中'
                                :parseInt(row.status) === 41
                                  ?'已提货'
                                  :parseInt(row.status) === 51
                                    ?'待配送'
                                    :parseInt(row.status) === 61
                                      ?'配送中'
                                      :parseInt(row.status) === 71
                                        ?'到达'
                                        :parseInt(row.status) === 81
                                          ?'配送签收'
                                          :parseInt(row.status) === 91
                                            ?'签收异常'
                                            :parseInt(row.status) === 111
                                              ?'部分签收':row.status
                        }}
                      </span>
                    </div>
                    <!-- <el-button slot="reference"></el-button> -->
                  </el-popover>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              :key="Math.random()"
              label="仓库"
              sortable
              show-overflow-tooltip
              prop="customerWarehouse"
              width="70"
              align="center"
            >
              <template slot-scope="{row}">
                <span>
                  {{ row.customerWarehouse = row.customerWarehouseDTO.name }}
                </span>
              </template>
            </el-table-column>
            <!-- <el-table-column label="运单号" sortable prop="mailNo" width="120" align="center" /> -->
            <el-table-column
              :key="Math.random()"
              label="货品"
              prop="goods"
              width="60"
              show-overflow-tooltip
              align="center"
            />
            <el-table-column
              :key="Math.random()"
              label="货品类型"
              prop="goodsTypeShortName"
              width="60"
              show-overflow-tooltip
              align="center"
            />
            <el-table-column
              :key="Math.random()"
              label="回单"
              prop="signDocumentNum"
              width="40"
              align="center"
            >
              <template slot-scope="{row}">
                <span>
                  {{ !row.signDocumentNum?0:row.signDocumentNum }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              v-if="tableColVisible"
              :key="Math.random()"
              label="回单要求"
              prop="signDocumentBackRequirement"
              show-overflow-tooltip
              align="center"
            >
              <template slot-scope="{row}">
                <span>
                  {{ !row.signDocumentBackRequirement?'无':row.signDocumentBackRequirement }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              :key="Math.random()"
              label="箱数"
              sortable
              prop="quantity"
              width="56"
              align="center"
            >
              <template slot-scope="{row}">
                <span>
                  {{ !row.quantity?0: row.quantity }}
                </span>
              </template>
            </el-table-column>

            <el-table-column
              :key="Math.random()"
              label="未提箱数"
              sortable
              prop="stock"
              width="65"
              align="center"
            >
              <template slot-scope="{row}">
                <span>
                  {{ !row.stock?'0':row.stock }}
                </span>
              </template>
            </el-table-column>

            <el-table-column
              :key="Math.random()"
              label="小件"
              sortable
              prop="quantity"
              width="56"
              align="center"
            >
              <template slot-scope="{row}">
                <span>
                  {{ getNum(row.waybillDetailDTOS) }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              :key="Math.random()"
              label="体积"
              prop="cubage"
              width="60"
              align="center"
            >
              <template slot-scope="{row}">
                <span>
                  {{ !row.cubage?0: row.cubage }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              :key="Math.random()"
              label="重量"
              prop="weight"
              width="60"
              align="center"
            >
              <template slot-scope="{row}">
                <span>
                  {{ !row.weight?0: row.weight }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              :key="Math.random()"
              label="计价"
              width="50"
              prop="dictionaryDTO.value"
              show-overflow-tooltip
              align="center"
            />
            <el-table-column
              v-if="tableColVisible"
              :key="Math.random()"
              align="center"
              label="运输方式"
              prop="transportWay"
              show-overflow-tooltip
            />
            <el-table-column
              v-if="tableColVisible"
              :key="Math.random()"
              align="center"
              label="承运商1"
              prop="carrierDTO1.name"
              width="70"
              show-overflow-tooltip
            />
            <el-table-column
              v-if="tableColVisible"
              :key="Math.random()"
              align="center"
              label="承运商2"
              prop="carrierDTO2.name"
              width="70"
              show-overflow-tooltip
            />
            <el-table-column
              :key="Math.random()"
              label="收货人"
              sortable
              prop="receiver"
              width="66"
              show-overflow-tooltip
              align="center"
            />
            <el-table-column
              :key="Math.random()"
              label="收货公司"
              sortable
              prop="receiverCompany"
              width="80"
              show-overflow-tooltip
              align="center"
            />
            <el-table-column
              :key="Math.random()"
              label="提货"
              width="60"
              sortable
              prop="pickGoodsWayDICDTO.value"
              align="center"
            />
            <el-table-column
              v-if="tableColVisible"
              :key="Math.random()"
              label="目的省份"
              prop="goalProvince"
              width="100"
              show-overflow-tooltip
              align="center"
            />
            <el-table-column
              v-if="tableColVisible"
              :key="Math.random()"
              label="目的城市"
              sortable
              show-overflow-tooltip
              prop="goalCity"
              width="100"
              align="center"
            />
            <el-table-column
              :key="Math.random()"
              label="目的县区"
              sortable
              show-overflow-tooltip
              prop="goalCounty"
              width="78"
              align="center"
            />
            <el-table-column
              :key="Math.random()"
              label="目的地址"
              sortable
              show-overflow-tooltip
              prop="goalAddress"
              width="100"
              align="center"
            />
            <el-table-column
              v-if="tableColVisible"
              :key="Math.random()"
              label="运单类型"
              sortable
              prop="waybillTypeDICDTO.value"
              width="120"
              align="center"
            />
            <el-table-column
              v-if="tableColVisible"
              :key="Math.random()"
              label="主&从"
              sortable
              prop="masterFlag"
              width="100"
              align="center"
            >
              <template slot-scope="scope">
                <el-tag
                  v-if="scope.row.masterFlag === 0 "
                  type="danger"
                  effect="dark"
                >主</el-tag>
                <el-tag
                  v-else-if="scope.row.masterFlag === 1"
                  type=""
                >从</el-tag>
                <el-tag
                  v-else-if=" scope.row.masterFlag === 2"
                  type="success"
                  effect="light"
                >主</el-tag>
                <el-tag
                  v-else
                  type="success"
                >{{ scope.row.masterFlag }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column
              :key="Math.random()"
              label="费用"
              prop="waybillCharges"
              width="50"
              align="center"
            >
              <template slot-scope="{row}">
                <span>
                  {{ row.waybillCharges?row.waybillCharges:0 }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              :key="Math.random()"
              label="成本"
              prop="waybillCost"
              width="50"
              align="center"
            >
              <template slot-scope="{row}">
                <span>
                  {{ row.waybillCost?row.waybillCost:0 }}
                </span>
              </template>
            </el-table-column>
            <!-- <el-table-column :key="Math.random()"
                             label="应收"
                             prop="free.Charge"
                             width="50"
                             align="center">
              <template slot-scope="{row}">
                <span v-if="!Object.keys(row.free).length">
                  0
                </span>
                <span v-else>
                  {{
                    !row.free.Charge
                      ?'0':row.free.Charge
                  }}
                </span>
              </template>
            </el-table-column> -->
            <!-- <el-table-column :key="Math.random()"
                             label="应付"
                             prop="free.SendCost"
                             width="50"
                             align="center">
              <template slot-scope="{row}">
                <span v-if="!Object.keys(row.free).length">
                  0
                </span>
                <span v-else>
                  {{
                    !row.free.SendCost
                      ?'0':row.free.SendCost
                  }}
                </span>
              </template>
            </el-table-column> -->
            <!-- ======================================================================== -->
            <el-table-column
              v-if="tableColVisible"
              :key="Math.random()"
              label="订单类型"
              prop="orderTypeDICDTO.value"
              align="center"
            />
            <el-table-column
              v-if="tableColVisible"
              :key="Math.random()"
              label="下单渠道"
              sortable
              prop="channelDICDTO.value"
              width="110"
              show-overflow-tooltip
              align="center"
            />
            <el-table-column
              v-if="tableColVisible"
              :key="Math.random()"
              label="物控"
              sortable
              prop="controll"
              align="center"
            >
              <template slot-scope="{ row }">
                <span>
                  {{
                    parseInt(row.controll) === 0
                      ? '否'
                      : parseInt(row.controll) === 1
                        ? '是' : row.controll
                  }}
                </span>
              </template>
            </el-table-column>
            <!-- <el-table-column label="机构" prop="organization.name" show-overflow-tooltip align="center" />
            <el-table-column label="公司" prop="company.name" show-overflow-tooltip align="center" />
            <el-table-column label="更新人" prop="modifier" show-overflow-tooltip align="center" />
            <el-table-column label="更新时间" prop="updatedTime" width="100" align="center" />
            <el-table-column label="上游单号" prop="upstreamOrderNo" width="150" show-overflow-tooltip align="center" /> -->
            <el-table-column
              :key="Math.random()"
              label="操作"
              width="100"
              align="center"
            >
              <template slot="header">
                <span>
                  操作
                </span>
                <img
                  v-show="!tableColVisible"
                  src="../../assets/404_images/moreIcon.png"
                  style="vertical-align: middle;margin-top: -2px;"
                  width="12px"
                  @click="tableColMoreClick(row)"
                >
                <img
                  v-show="tableColVisible"
                  src="../../assets/404_images/lessIcon.png"
                  style="vertical-align: middle;margin-top: -2px;"
                  width="12px"
                  @click="tableColMoreClick(row)"
                >
                <!-- <i class="el-icon-d-arrow-right" style="color:red" @click="tableColMoreClick(row)" /> -->
                <!-- <el-button size="mini" class="moreBtn" type="success" plain > {{ tableColVisible?'隐藏':'展开' }} </el-button> -->
              </template>
              <template slot-scope="s">
                <!-- <el-button :disabled="s.row.hasSlave!==1" type="text" @click.native.stop="handleDivide(s.row)">拆单</el-button> -->
                <!-- <el-button type="text" @click="handleDetail(s.row)">详情</el-button> -->
                <!-- <el-button type="text" @click="handleEdit(s.row)">编辑</el-button> -->
                <el-button
                  type="text"
                  size="mini"
                  @click.native.stop="handleEdit(s.row)"
                >编辑</el-button>
                <el-button
                  type="text"
                  size="mini"
                  @click.native.stop="handleDelete(s.row)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="paginationBox">
          <!--分页-->
          <el-pagination
            :current-page="page.current"
            :page-sizes="page.sizes"
            :page-size="page.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="page.total"
            @size-change="sizeChange"
            @current-change="currentChange"
          />
        </div>
      </el-tab-pane>
      <!-- ====================================已审核区域============================================== -->
      <el-tab-pane
        label="已审核"
        name="pass"
      >
        <div>
          <!--内容区-->
          <el-table
            ref="approvalTable"
            :key="tableKey"
            v-loading="queryLoading"
            class="tableBox"
            element-loading-text="Loading"
            :data="tableData"
            fit
            highlight-current-row
            border
            height="600"
            style="margin-top:0px"
            :row-key="getRowKeys"
            :expand-row-keys="expands"
            :row-class-name="tableRowClassName"
            @sort-change="changeTableSort"
            @selection-change="handleSelectionChange"
            @row-dblclick="handleDbClick"
            @expand-change="expandChange"
          >
            <el-table-column
              :key="Math.random()"
              label="全选"
              :selectable="selectEvent"
              type="selection"
              reserve-selection
              width="40"
              align="center"
            />
            <el-table-column
              :key="Math.random()"
              label="序号"
              type="index"
              width="40"
              align="center"
            />
            <el-table-column
              :key="Math.random()"
              class="orderTableDetail"
              align="center"
              prop="orderTableDetail"
              label="明细"
              type="expand"
              width="40"
            >
              <template slot-scope>
                <item-detail
                  ref="itemDetail"
                  :order-table-detail="orderTableDetail"
                  :detail-query-loading="detailQueryLoading"
                />
              </template>
            </el-table-column>
            <el-table-column
              :key="Math.random()"
              label="源头单号"
              sortable
              prop="sourceOrderNo"
              width="90"
              show-overflow-tooltip
              align="center"
            >
              <template slot-scope="{ row }">
                <span
                  :data-clipboard-text="row.sourceOrderNo"
                  class="tag-read"
                  @click="copyText"
                > {{ row.sourceOrderNo == null ? '空' : row.sourceOrderNo }}</span>
              </template>
            </el-table-column>
            <el-table-column
              :key="Math.random()"
              label="订单号"
              sortable
              prop="orderNo"
              width="100"
              show-overflow-tooltip
              align="center"
            >
              <template slot-scope="{ row }">
                <span
                  style="color:#409EFF"
                  :data-clipboard-text="row.orderNo"
                  class="tag-read"
                  @click="copyText"
                > {{ row.orderNo == null ? '空' : row.orderNo }}</span>
              </template>
            </el-table-column>
            <el-table-column
              :key="Math.random()"
              label="客户"
              sortable
              prop="customer"
              width="70"
              show-overflow-tooltip
              align="center"
            >

              <template slot-scope="{row}">
                <span>
                  {{ row.customerDTO.ename!==undefined?row.customerDTO.ename:'无' }}
                </span>
              </template>

            </el-table-column>
            <el-table-column
              v-if="tableColVisible"
              :key="Math.random()"
              align="center"
              prop="entrustThing"
              label="委托事项"
              show-overflow-tooltip
              width="40"
            >
              <template slot-scope="{ row }">
                <span>{{ row.entrustThing == 0 ? '无' :row.entrustThing == null ? '无' : row.entrustThing }}</span>
              </template>
            </el-table-column>
            <el-table-column
              v-if="tableColVisible"
              :key="Math.random()"
              align="center"
              prop="extend"
              label="注意事项"
              show-overflow-tooltip
              width="40"
            >
              <template slot-scope="{ row }">
                <span>{{ row.extend == 0 ? '无' :row.extend == null ? '无' : row.extend }}</span>
              </template>
            </el-table-column>
            <el-table-column
              :key="Math.random()"
              label="下单时间"
              show-overflow-tooltip
              sortable
              prop="placeBillwayTime"
              width="82"
              align="center"
            />
            <el-table-column
              :key="Math.random()"
              label="状态"
              sortable
              prop="status"
              align="center"
              width="60"
            >
              <template slot-scope="{row}">
                <div
                  @mouseenter="showwaybillstatus(row)"
                  @mouseleave="closewwaybillstatus(row)"
                >

                  <el-popover
                    placement="right"
                    width="300"
                    trigger="hover"
                  >

                    <el-table
                      v-loading="querywaybillstatusloading"
                      width="270"
                      :data="gridData"
                    >

                      <el-table-column
                        width="90"
                        property="discription"
                        label="描述"
                      />
                      <el-table-column
                        width="90"
                        property="statusValue"
                        label="状态值"
                      />
                    </el-table>
                    <div
                      slot="reference"
                      @click="querywaybillstatus(row)"
                    >
                      <span>
                        {{
                          parseInt(row.status) === 1
                            ?'待制定'
                            :parseInt(row.status) === 21
                              ?'待提货'
                              :parseInt(row.status) === 31
                                ?'提货中'
                                :parseInt(row.status) === 41
                                  ?'已提货'
                                  :parseInt(row.status) === 51
                                    ?'待配送'
                                    :parseInt(row.status) === 61
                                      ?'配送中'
                                      :parseInt(row.status) === 71
                                        ?'到达'
                                        :parseInt(row.status) === 81
                                          ?'配送签收'
                                          :parseInt(row.status) === 91
                                            ?'签收异常'
                                            :parseInt(row.status) === 111
                                              ?'部分签收':row.status
                        }}
                      </span>
                    </div>
                    <!-- <el-button slot="reference"></el-button> -->
                  </el-popover>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              :key="Math.random()"
              label="仓库"
              sortable
              show-overflow-tooltip
              prop="customerWarehouseDTO.name"
              width="70"
              align="center"
            />
            <!-- <el-table-column label="运单号" sortable prop="mailNo" width="120" align="center" /> -->
            <el-table-column
              :key="Math.random()"
              label="货品"
              prop="goods"
              width="60"
              show-overflow-tooltip
              align="center"
            />
            <el-table-column
              :key="Math.random()"
              label="货品类型"
              prop="goodsTypeShortName"
              width="60"
              show-overflow-tooltip
              align="center"
            />
            <el-table-column
              :key="Math.random()"
              label="回单"
              prop="signDocumentNum"
              width="40"
              align="center"
            >
              <template slot-scope="{row}">
                <span>
                  {{ !row.signDocumentNum?0:row.signDocumentNum }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              v-if="tableColVisible"
              :key="Math.random()"
              label="回单要求"
              prop="signDocumentBackRequirement"
              show-overflow-tooltip
              align="center"
            >
              <template slot-scope="{row}">
                <span>
                  {{ !row.signDocumentBackRequirement?'无':row.signDocumentBackRequirement }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              :key="Math.random()"
              label="箱数"
              sortable
              prop="quantity"
              width="50"
              align="center"
            >
              <template slot-scope="{row}">
                <span>
                  {{ !row.quantity?0: row.quantity }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              :key="Math.random()"
              label="未提箱数"
              sortable
              prop="stock"
              width="65"
              align="center"
            >
              <template slot-scope="{row}">
                <span>
                  {{ !row.stock?'0':row.stock }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              :key="Math.random()"
              label="体积(m³)"
              prop="cubage"
              width="70"
              align="center"
            >
              <template slot-scope="{row}">
                <span>
                  {{ !row.cubage?0: row.cubage }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              :key="Math.random()"
              label="重量(kg)"
              prop="weight"
              width="70"
              align="center"
            >
              <template slot-scope="{row}">
                <span>
                  {{ !row.weight?0: row.weight }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              :key="Math.random()"
              label="计价"
              width="60"
              prop="dictionaryDTO.value"
              show-overflow-tooltip
              align="center"
            />
            <el-table-column
              v-if="tableColVisible"
              :key="Math.random()"
              align="center"
              label="运输方式"
              prop="transportWay"
              show-overflow-tooltip
            />
            <el-table-column
              v-if="tableColVisible"
              :key="Math.random()"
              align="center"
              label="承运商1"
              prop="carrierDTO1.name"
              width="70"
              show-overflow-tooltip
            />
            <el-table-column
              v-if="tableColVisible"
              :key="Math.random()"
              align="center"
              label="承运商2"
              prop="carrierDTO2.name"
              width="70"
              show-overflow-tooltip
            />
            <el-table-column
              :key="Math.random()"
              label="收货人"
              sortable
              prop="receiver"
              width="60"
              show-overflow-tooltip
              align="center"
            />
            <el-table-column
              :key="Math.random()"
              label="收货公司"
              sortable
              prop="receiverCompany"
              width="70"
              show-overflow-tooltip
              align="center"
            />
            <el-table-column
              :key="Math.random()"
              label="提货"
              width="75"
              sortable
              prop="pickGoodsWayDICDTO.value"
              align="center"
            />
            <el-table-column
              v-if="tableColVisible"
              :key="Math.random()"
              label="目的省份"
              prop="goalProvince"
              width="100"
              show-overflow-tooltip
              align="center"
            />
            <el-table-column
              v-if="tableColVisible"
              :key="Math.random()"
              label="目的城市"
              sortable
              show-overflow-tooltip
              prop="goalCity"
              width="100"
              align="center"
            />
            <el-table-column
              :key="Math.random()"
              label="目的县区"
              sortable
              show-overflow-tooltip
              prop="goalCounty"
              width="78"
              align="center"
            />
            <el-table-column
              :key="Math.random()"
              label="目的地址"
              sortable
              show-overflow-tooltip
              prop="goalAddress"
              width="100"
              align="center"
            />
            <el-table-column
              v-if="tableColVisible"
              :key="Math.random()"
              label="运单类型"
              sortable
              prop="waybillTypeDICDTO.value"
              width="120"
              align="center"
            />
            <el-table-column
              v-if="tableColVisible"
              :key="Math.random()"
              label="主&从"
              sortable
              prop="masterFlag"
              width="100"
              align="center"
            >
              <template slot-scope="scope">
                <el-tag
                  v-if="scope.row.masterFlag === 0 "
                  type="danger"
                  effect="dark"
                >主</el-tag>
                <el-tag
                  v-else-if="scope.row.masterFlag === 1"
                  type=""
                >从</el-tag>
                <el-tag
                  v-else-if=" scope.row.masterFlag === 2"
                  type="success"
                  effect="light"
                >主</el-tag>
                <el-tag
                  v-else
                  type="success"
                >{{ scope.row.masterFlag }}</el-tag>
              </template>
            </el-table-column>
            <!-- ======================================================================== -->
            <el-table-column
              v-if="tableColVisible"
              :key="Math.random()"
              label="订单类型"
              prop="orderTypeDICDTO.value"
              align="center"
            />
            <el-table-column
              v-if="tableColVisible"
              :key="Math.random()"
              label="下单渠道"
              sortable
              prop="channelDICDTO.value"
              width="110"
              show-overflow-tooltip
              align="center"
            />
            <el-table-column
              v-if="tableColVisible"
              :key="Math.random()"
              label="物控"
              sortable
              prop="controll"
              align="center"
            >
              <template slot-scope="{ row }">
                <span>
                  {{
                    parseInt(row.controll) === 0
                      ? '否'
                      : parseInt(row.controll) === 1
                        ? '是' : row.controll
                  }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              :key="Math.random()"
              label="费用"
              prop="waybillCharges"
              width="60"
              align="center"
            >
              <template slot-scope="{row}">
                <span>
                  {{ row.waybillCharges?row.waybillCharges:0 }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              :key="Math.random()"
              label="成本"
              prop="waybillCost"
              width="60"
              align="center"
            >
              <template slot-scope="{row}">
                <span>
                  {{ row.waybillCost?row.waybillCost:0 }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              :key="Math.random()"
              label="应收"
              prop="free.Charge"
              width="60"
              align="center"
            >
              <template slot-scope="{row}">
                <span v-if="!Object.keys(row.free).length">
                  0
                </span>
                <span v-else>
                  {{
                    !row.free.Charge
                      ?'0':row.free.Charge
                  }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              :key="Math.random()"
              label="应付"
              prop="free.SendCost"
              width="70"
              align="center"
            >
              <template slot="header">
                <span>
                  应付
                </span>
                <!-- <i class="el-icon-d-arrow-right" style="color:red" @click="tableColMoreClick(row)" /> -->
                <img
                  v-show="!tableColVisible"
                  src="../../assets/404_images/moreIcon.png"
                  style="vertical-align: middle;margin-top: -2px;"
                  width="12px"
                  @click="tableColMoreClick(row)"
                >
                <img
                  v-show="tableColVisible"
                  src="../../assets/404_images/lessIcon.png"
                  style="vertical-align: middle;margin-top: -2px;"
                  width="12px"
                  @click="tableColMoreClick(row)"
                >
                <!-- <el-button size="mini" class="moreBtn" type="success" plain > {{ tableColVisible?'隐藏':'展开' }} </el-button> -->
              </template>
              <template slot-scope="{row}">
                <span v-if="!Object.keys(row.free).length">
                  0
                </span>
                <span v-else>
                  {{
                    !row.free.SendCost
                      ?'0':row.free.SendCost
                  }}
                </span>
              </template>
            </el-table-column>
            <!-- ======================================================================== -->
            <!-- <el-table-column label="机构" prop="organizationDTO.name" show-overflow-tooltip align="center" />
            <el-table-column label="公司" prop="companyDTO.name" show-overflow-tooltip align="center" />
            <el-table-column label="更新人" prop="modifier" show-overflow-tooltip align="center" />
            <el-table-column label="更新时间" prop="updatedTime" width="100" align="center" />
            <el-table-column label="上游单号" prop="upstreamOrderNo" width="150" show-overflow-tooltip align="center" /> -->
            <!-- <el-table-column label="操作" width="200" fixed="right" align="center">
              <template slot-scope="s">
                <el-button type="text" @click="handleDetail(s.row)">详情</el-button>
                <el-button type="text" @click.native.stop="handleEdit(s.row)">编辑</el-button>
                <el-button type="text" @click.native.stop="handleDelete(s.row)">删除</el-button>
              </template>
            </el-table-column> -->
          </el-table>
        </div>
        <div class="paginationBox">
          <!--分页-->
          <el-pagination
            :current-page="page.current"
            :page-sizes="page.sizes"
            :page-size="page.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="page.total"
            @size-change="sizeChange"
            @current-change="currentChange"
          />
        </div>
      </el-tab-pane>
    </el-tabs>
    <div>
      <!--对话框-->
      <el-dialog
        v-dialogDrag
        top="1vh"
        title="运单详情"
        :visible.sync="dialogVisible"
        :close-on-click-modal="false"
        width="60%"
      >
        <!-- fullscreen -->
        <!-- <waybill-detail v-if="dialogVisible" ref="detail" :data="row" :readonly="waybillDetailDisabled" :add="addFlag" /> -->
        <detail
          v-if="dialogVisible"
          ref="detail"
          :order-channel-options="orderChannelOptions"
          :order-type-options="orderTypeOptions"
          :delivery-way-options="deliveryWayList"
          :readonly="waybillDetailDisabled"
          :warehouse-list="warehouseList"
          :customer-list="customerList"
          :waybill-info-detail-query-loading="waybillInfoDetailQueryLoading"
          :data="waybillInfo"
          :add="addFlag"
          :tab-name="tabName"
          @handleAddWaybill="handleAddWaybill"
          @showAddReceiver="showAddReceiver"
          @handleUpdateForm="handleUpdateForm"
          @cancelDetailDialog="cancelDetailDialog"
        />
        <!-- <span slot="footer" class="dialog-footer" style="margin-left:70%">
          <el-button @click="cancelDetailDialog">取 消</el-button>
          <el-button v-if="addFlag" type="primary" @click="handleAddWaybill">确 定</el-button>
          <el-button v-if="(waybillDetailDisabled && !addFlag) && (tabName === 'noPass')" type="primary" @click="handleUpdateForm">确 定</el-button>
        </span> -->
      </el-dialog>
      <!-- 到达签收模块 -->
      <el-dialog
        v-dialogDrag
        :before-close="closeSignDetailDialog"
        :close-on-click-modal="false"
        style="left:10%;height:100%"
        top="2vh"
        :visible.sync="signDetailDialogVisible"
        width="80%"
        append-to-body
        title="签收信息"
      >
        <sign-detail
          ref="signDetail"
          :table-data="signDetailData"
          @parentCancelHandel="parentCancelHandel"
          @close="closeSignDetailDialog"
        />
      </el-dialog>
      <!-- 完成提货模块 -->
      <el-dialog
        v-dialogDrag
        :before-close="closePickupDetailDialog"
        :close-on-click-modal="false"
        style="left:10%;height:100%"
        top="2vh"
        :visible.sync="pickupDetailDialogVisible"
        width="90%"
        append-to-body
        title="提货信息"
      >
        <finishPickDetail
          ref="finishPickupDetail"
          :table-data="pickupDetailData"
          @parentCancelHandel="parentCancelPickupHandel"
          @close="closePickupDetailDialog"
        />
      </el-dialog>
      <!-- 运单详情中添加收货人 -->
      <el-dialog
        v-dialogDrag
        :before-close="parentCancelAddreceiverHandel"
        :close-on-click-modal="false"
        style="left:10%;height:100%"
        top="15vh"
        :visible.sync="addReceiverDialogVisible"
        width="50%"
        append-to-body
        title="增加收货人"
      >
        <addReceiver
          ref="addReceiver"
          @addReceiverInfo="addReceiverInfo"
          @parentCancelHandel="parentCancelAddreceiverHandel"
          @close="parentCancelAddreceiverHandel"
        />
      </el-dialog>
      <el-dialog
        v-dialogDrag
        top="5vh"
        title="运单合并"
        :visible.sync="mergeVisible"
        :close-on-click-modal="false"
        width="90%"
        center
      >
        <merge-detail :table-data="multiSelection" />
        <span
          slot="footer"
          class="dialog-footer"
          style="margin-left:80%"
        >
          <el-button @click="mergeVisible = false">返 回</el-button>
          <el-button
            type="primary"
            @click="handleMergeWaybill"
          >确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog
        v-dialogDrag
        top="5vh"
        :close-on-click-modal="false"
        :visible.sync="approvalVisible"
        width="50%"
        append-to-body
        title="运单审核"
      >
        <el-form
          style="height:300px;margin-top:2%"
          :model="approvalForm"
          class="form-inline"
          label-width="120px"
        >
          <!-- <el-row>
            <el-form-item label="运单号:">
              <el-input v-model="approvalForm.mailNo" clearable size="mini" />
            </el-form-item>
          </el-row> -->
          <el-row>
            <el-form-item label="审核结果:">
              <!-- <el-switch
                v-model="isAprovalPass"
                active-text="通过"
                inactive-text="未通过"
              /> -->
              <el-switch
                v-model="isAprovalPass"
                active-text="通过"
                disabled
              />
            </el-form-item>
          </el-row>
          <!-- <el-form-item label="操作时间:">
            <el-input v-model="approvalForm.time" clearable size="mini" disabled />
          </el-form-item>
          <el-form-item label="操作员:">
            <el-input v-model="approvalForm.operator" clearable size="mini" disabled />
          </el-form-item> -->
          <el-form-item label="审核意见">
            <el-input
              v-model="approvalForm.text"
              type="textarea"
              style="width:90%;"
            />
          </el-form-item>
        </el-form>
        <span
          slot="footer"
          class="dialog-footer"
        >
          <el-button @click="approvalVisible = false">取消</el-button>
          <el-button
            type="primary"
            :loading="approvalBtnLoading"
            @click="handlePassApproval"
          >确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { planAndExecuteApi } from '@/api/planAndExecute/pickupPlan'
// import WaybillDetail from '@/views/waybill/waybill-detail'
import detail from '@/views/waybill/detail'
import MergeDetail from '@/views/waybill/mergeDetail'
import addReceiver from '@/views/waybill/addReceiver'
import ItemDetail from '@/views/waybill/item-detail'
import { WaybillApi } from '@/api/waybill/waybill'
import { pageMixin } from '@/views/mixin/page'
import { exportExcel } from '@/utils/ExcelUtils'
import { getName } from '@/utils/auth'
import SignDetail from '@/views/waybill/sign-detail'
import finishPickDetail from '@/views/waybill/finishPickup-detail'
import Clipboard from 'clipboard'
export default {
  name: 'Index',
  components: {
    // detail,
    // WaybillDetail,
    detail,
    ItemDetail,
    MergeDetail,
    SignDetail,
    finishPickDetail,
    addReceiver
  },
  mixins: [pageMixin],
  data() {
    return {
      querywaybillstatusloading: true,
      gridData: [],
      ishsow: false,
      addFlag: false,
      multiSelection: [],
      tableData: [],
      queryLoading: false,
      isAprovalPass: true, // 审核通过不通过开关
      detailQueryLoading: false, // 订单明细加载
      addReceiverDialogVisible: false, // 展开添加收货人地址
      addReceiverVO: {
        name: '',
        email: '',
        address: ''
      }, // 增加收货人
      waybillInfoDetailQueryLoading: false, // 运单详情加载
      pickupDetailDialogVisible: false, // 提货完成弹出
      detailDialogType: 'edit',
      customerList: [], // 客户下拉列表
      warehouseList: [], // 仓库下拉列表
      deliveryWayList: [], // 提货方式下拉列表
      statusList: [ // 运单状态下拉列表
        { status: 1, label: '待制定' },
        { status: 21, label: '待提货' },
        { status: 31, label: '提货中' },
        { status: 41, label: '已提货' },
        { status: 51, label: '待配送' },
        { status: 61, label: '配送中' },
        { status: 71, label: '到达' },
        { status: 81, label: '配送签收' },
        { status: 91, label: '签收异常' }
      ],
      dialogVisible: false,
      signDetailData: [], // 签收数据
      pickupDetailData: [], // 完成提货数据
      signDetailDialogVisible: false, // 签收弹窗
      pickDetailDialogVisible: false, // 完成提货弹窗
      mergeVisible: false,
      page: { // 分页
        pageSize: 10,
        current: 1,
        total: 0,
        sizes: [10, 20, 50, 100]
      },
      approvalBtnLoading: false,
      approvalVisible: false,
      isApproval: false,
      timeList: [new Date(new Date() - 24 * 60 * 60 * 1000), new Date()],
      searchForm: {
        placeStartTime: new Date(new Date() - 24 * 60 * 60 * 1000),
        placeEndTime: new Date()
      },
      tabName: 'noPass',
      expands: [], // 展开行
      getRowKeys(row) { // 行id
        return row.id
      },
      waybillInfo: {
        free: {}
      }, // 运单信息
      approvalForm: { mailNo: '', time: '', operator: getName() },
      orderTypeOptions: [], // 订单类型下拉框
      orderChannelOptions: [], // 下单渠道下拉框
      waybillDetailDisabled: true,
      orderTableDetail: [],
      detailTableHeight: 64,
      tableKey: true,
      customerTypeList: [], // 客户类型
      tableColVisible: false // 列的显示与隐藏
    }
  },
  created() {
    // 客户以及仓库下拉框
    planAndExecuteApi.queryCustomerAndWarehouse().then(res => {
      this.customerList = res.customerDTOS
      this.warehouseList = res.customerWarehouseVOS
    }).catch(err => {
      this.$message.error(err)
    })
    // 提货方式下拉框
    WaybillApi.getDictionaryWay(1327173901054246912n).then(res => {
      this.deliveryWayList = res.data
    }).catch(err => {
      this.$message.error(err)
    })
    // 客户类型下拉框
    WaybillApi.getDictionaryWay(1340624706952364033n).then(res => {
      this.customerTypeList = res.data
    }).catch(err => {
      this.$message.error(err)
    })
    // 订单类型下拉框
    WaybillApi.getDictionaryWay(1326445285106384896n).then(res => {
      this.orderTypeOptions = res.data
    }).catch(err => {
      this.$message.error(err)
    })
    // 下单渠道下拉框
    WaybillApi.getDictionaryWay(1328330968708284416n).then(res => {
      this.orderChannelOptions = res.data
    }).catch(err => {
      this.$message.error(err)
    })
  },
  mounted() {
    this.getTableData(this.searchForm)
  },
  beforeUpdate() {
    this.$nextTick(() => {
      this.$refs.table.doLayout()
      this.$refs.approvalTable.doLayout()
    })
  },
  methods: {
    /**
     * 从子组件增加收货人点击确定之后获取所增加的信息
     */
    addReceiverInfo(receiverInfo) {
      this.$set(this.$refs.detail.formData, 'receiver', receiverInfo.name)
      this.$set(this.$refs.detail.formData, 'receiverMobile', receiverInfo.mobile)
      this.$set(this.$refs.detail.formData, 'receiverEmail', receiverInfo.email)
      this.$set(this.$refs.detail.formData, 'goalProvince', receiverInfo.province)
      this.$set(this.$refs.detail.formData, 'goalCity', receiverInfo.city)
      this.$set(this.$refs.detail.formData, 'goalCounty', receiverInfo.county)
      this.$set(this.$refs.detail.formData, 'goalAddress', receiverInfo.address)
    },
    // 展示增加收货人
    showAddReceiver() {
      this.addReceiverDialogVisible = true
    },
    /**
     * 获取指定客户的仓库
     */
    getWarehouse(ids) {
      planAndExecuteApi.queryCustomerAndWarehouse({ ids }).then(res => {
        this.warehouseList = res.customerWarehouseVOS
        if (this.warehouseList.length) {
          this.$set(this.searchForm, 'warehouseName', this.warehouseList[0].name)
        } else {
          this.$set(this.searchForm, 'warehouseName', '')
        }
      })
    },
    /**
     * 复制订单号或源头订单号
     */
    copyText() {
      var clipboard = new Clipboard('.tag-read')
      clipboard.on('success', e => {
        this.$message({
          message: '复制成功',
          type: 'success'
        })
        //  释放内存
        e.clearSelection()
        clipboard.destroy()
      })
      clipboard.on('error', e => {
        // 不支持复制
        this.$message({
          message: '该浏览器不支持复制',
          type: 'success'
        })
        console.log('该浏览器不支持复制')
        // 释放内存
        e.clearSelection()
        clipboard.destroy()
      })
    },
    // 控制列的显示与隐藏
    tableColMoreClick(row) {
      this.tableColVisible = !this.tableColVisible
      this.$nextTick(() => { this.$refs.approvalTable.doLayout() })
      this.$nextTick(() => { this.$refs.table.doLayout() })
    },
    // 监听表格排序变化
    changeTableSort(column) {
      console.log(column)
      console.log(this.$refs.table.tableData)
      // 获取排序后的数据
      this.tableData = this.$refs.table.tableData

      console.log(this.tableData)
    },
    selectEvent(row, index) {
      if (row.masterFlag === 1) {
        return false // 不可勾选 }
      } else { return true } // 可勾选
    },
    // 不同状态显示不同颜色
    tableRowClassName({ row, rowIndex }) {
      // if (parseInt(row.status) === 1) {
      //   return 'green'
      // } else if (parseInt(row.status) === 21) {
      //   return 'red'
      // } else if (parseInt(row.status) === 31) {
      //   return 'yellow'
      // } else if (parseInt(row.status) === 41) {
      //   return 'pink'
      // } else if (parseInt(row.status) === 51) {
      //   return 'blue'
      // } else if (parseInt(row.status) === 61) {
      //   return 'yellowgreen'
      // } else if (parseInt(row.status) === 71) {
      //   return 'aqua'
      // } else if (parseInt(row.status) === 81) {
      //   return 'wheat'
      // } else
      if (parseInt(row.status) === 91) {
        return 'lightSky'
      } else if (parseInt(row.status) === 111) {
        return 'lightpurple'
      }
    },
    /**
     * 获取运单明细总数
     */
    getNum(waybillDetailDTOS) {
      let sum = 0
      waybillDetailDTOS.map(item => {
        if (item.num) {
          sum += item.num
        }
      })
      return sum
    },
    /**
     * 点击 X 关闭对话框的回调
     */
    closeSignDetailDialog() {
      this.signDetailDialogVisible = false
      this.signDetailData = []
      this.getTableData(this.searchForm)
      // this.$refs.pickup.tableData = []
    },
    /**
     * 点击 X 关闭对话框的回调
     */
    closePickupDetailDialog() {
      this.pickupDetailDialogVisible = false
      this.pickupDetailData = []
      this.getTableData(this.searchForm)
      // this.$refs.pickup.tableData = []
    },
    /**
     * 点击 X 关闭对话框的回调
     */
    closeAddReceiverDialog() {
      this.addReceiverDialogVisible = false
    },
    /**
     * 点击 取消 关闭对话框的回调
     */
    parentCancelHandel() {
      this.signDetailDialogVisible = false
      this.signDetailData = []
      // this.$refs.pickup.tableData = []
    },
    /**
     * 点击 取消 关闭对话框的回调
     */
    parentCancelPickupHandel() {
      this.pickupDetailDialogVisible = false
      this.pickupDetailData = []
      // this.$refs.pickup.tableData = []
    },
    /**
     * 点击 取消 关闭对话框的回调
     */
    parentCancelAddreceiverHandel() {
      this.addReceiverDialogVisible = false
    },
    // 签收模块
    handleSign() {
      if (!this.multiSelection.length) {
        this.$message.warning('至少选择一条数据')
        return
      }
      let hasDispatchArrive = false
      this.multiSelection.map(item => {
        // 判断是否为配送执行中或者为配送到达状态，如果都不是则提示用户
        if (parseInt(item.status) !== 61 && parseInt(item.status) !== 71) {
          hasDispatchArrive = true
        }
        if (!hasDispatchArrive) {
          item.signTime = new Date()
          item.arriveTime = new Date(new Date() - 1 * 60 * 60 * 1000)
        }
      })
      if (hasDispatchArrive) {
        this.$message.warning('状态为配送执行中或配送到达的运单才能被签收')
        return
      }
      this.signDetailData = this.multiSelection
      this.$nextTick(() => {
        this.$refs.signDetail.initData(this.multiSelection)
      })
      this.signDetailDialogVisible = true
    },
    // 提货模块
    handleFinishPickup() {
      
      if (!this.multiSelection.length) {
        this.$message.warning('至少选择一条数据')
        return
      }
      let hasFinishPickupArrive = false // 判断是否已提货完成
      this.multiSelection.map(item => {
        // 判断是否为配送执行中或者为配送到达状态，如果都不是则提示用户
        if (parseInt(item.status) < 21) {
          hasFinishPickupArrive = true
        }
        if (!hasFinishPickupArrive) {
          item.arriveTime = new Date()
        }
      })
      if (hasFinishPickupArrive) {
        this.$message.warning('状态为提货执行中的运单才能被完成提货')
        return
      }
      this.pickupDetailData = this.multiSelection
      this.$nextTick(() => {
        this.$refs.finishPickupDetail.initData(this.multiSelection)
      })
      this.pickupDetailDialogVisible = true
    },
    expandChange(row, expandedRows) {
      // 全屏遮罩加载显示
      this.expand_change_arr = row
      // this.detailQueryLoading = true
      //	每次只展开一个扩展列表
      if (expandedRows.length) {
        if (row) {
          this.expands = [row.id]
        }
      } else {
        this.expands = []
      }
      this.detailTableHeight = 84
      this.orderTableDetail = []
      this.$set(this, 'detailQueryLoading', true)
      WaybillApi.getWaybillDetail(row.id).then(res => {
        if (res.data) {
          this.orderTableDetail = res.data
          if (res.data.length > 5) {
            this.detailTableHeight = 350
          } else {
            this.detailTableHeight = ''
          }
          this.$forceUpdate()
        }
        this.detailQueryLoading = false
        this.tableKey = !this.tableKey
      }).catch(err => {
        this.$message.error(err)
        this.detailQueryLoading = false
      })
    },
    // 监听分页页数变化
    sizeChange(val) {
      this.page.pageSize = val
      this.getTableData(this.searchForm, false)
    },
    // 监听分页页码变化
    currentChange(val) {
      this.page.current = val
      this.getTableData(this.searchForm, false)
    },
    // 监听查询时间变化
    changeTime() {
      if (this.timeList != null && this.timeList !== undefined && this.timeList.length === 2) {
        this.searchForm.placeStartTime = this.timeList[0]
        this.searchForm.placeEndTime = this.timeList[1]
      } else {
        this.searchForm.placeStartTime = null
        this.searchForm.placeEndTime = null
      }
    },
    handleClickAdd() {
      this.addFlag = true
      this.dialogVisible = true
      this.waybillDetailDisabled = false
      this.$nextTick(() => {
        // placeBillwayTime: new Date()
        // this.waybillInfo
        // this.$set(this.$refs.detail.formData, 'placeBillwayTime', new Date())
        this.$set(this.waybillInfo, 'placeBillwayTime', new Date())
      })
    },
    handleAddWaybill() {
      // const is = this.$refs.detail.submitForm()
      // console.log(is)
      this.$refs.detail.waybillChargeInfo.map(itemChargeInfos => {
        let rateType, fee
        itemChargeInfos.map(item => {
          if (item.rateType) {
            rateType = item.rateType
          } else if (item.fee) {
            fee = item.fee
          }
        })
        this.$refs.detail.waybillChargeDTOS.push({
          rateType, fee
        })
      })
      this.$refs.detail.waybillSendCostInfo.map(itemSendCostInfos => {
        let feeType, fee, carrierId
        itemSendCostInfos.map(item => {
          if (item.feeType) {
            feeType = item.feeType
          } else if (item.fee) {
            fee = item.fee
          } else if (item.carrierId) {
            carrierId = item.carrierId
          }
        })
        this.$refs.detail.waybillSendCostDTOS.push({
          feeType, fee, carrierId
        })
      })
      // WaybillApi.updatedCharge(this.$refs.detail.waybillChargeDTOS).then(res => {
      //   if (res) {
      //     this.$message.success('费用信息修改成功')
      //   } else {
      //     this.$confirm('费用信息修改失败请重新对费用信息进行更改！', '提示', {
      //       confirmButtonText: '确定',
      //       type: 'warning',
      //       callback: actions => {}
      //     })
      //   }
      // }).catch(err => {
      //   this.$message.error(err)
      //   this.$alert('费用信息修改失败请重新对费用信息进行更改！', '提示', {
      //     confirmButtonText: '确定',
      //     type: 'warning',
      //     callback: actions => {}
      //   })
      // })
      // WaybillApi.updatedSendCost(this.$refs.detail.waybillSendCostDTOS).then(res => {
      //   console.log(res)
      //   if (res) {
      //     this.$message.success('成本信息修改成功')
      //   } else {
      //     this.$confirm('成本信息修改失败请重新对成本信息进行更改！', '提示', {
      //       confirmButtonText: '确定',
      //       type: 'warning'
      //     })
      //   }
      // }).catch(err => {
      //   this.$message.error(err)
      // })
      this.$refs.detail.formData.placeBillwayTime = new Date(this.$refs.detail.formData.placeBillwayTime).format('yyyy-MM-dd hh:mm:ss')
      const allData = {}
      Object.assign(allData, this.$refs.detail.formData,
        { waybillChargeDTOS: this.$refs.detail.waybillChargeDTOS },
        { waybillSendCostDTOS: this.$refs.detail.waybillSendCostDTOS },
        { waybillDetailDTOS: this.$refs.detail.waybillDetailList }
      )
      WaybillApi.add(allData).then(res => {
        if (res) {
          this.$message.success('运单信息修改成功')
        } else {
          this.$message.success('运单信息修改失败请重试')
        }
        this.getTableData(this.searchForm)
        this.dialogVisible = false
        this.addFlag = false
      })
    },
    cancelDetailDialog() {
      this.dialogVisible = false
      this.addFlag = false
    },
    // 导出事件
    handleExport() {
      this.queryLoading = true
      const query = {}
      var page = {}
      page = {
        pageNum: 1,
        pageSize: this.page.total
      }
      Object.assign(query, page)
      if (Object.keys(this.searchForm).length) {
        Object.assign(query, this.searchForm)
      }
      if (query.placeStartTime && query.placeEndTime) {
        query.placeStartTime = this.dayTime(query.placeStartTime, 'start')
        query.placeEndTime = this.dayTime(query.placeEndTime, 'end')
      } else {
        query.placeStartTime = ''
        query.placeEndTime = ''
      }
      query.passFlag = this.tabName === 'noPass' ? 0 : 1
      WaybillApi.commonQuery(query).then(res => {
        this.tableData = res.data
      }).then(res => {
        if (this.tabName === 'noPass') {
          exportExcel(this.$refs.table, '运单列表(未审核)').then(res => {
            this.getTableData(this.searchForm)
            this.queryLoading = false
          })
          // exportExcel(this.$refs.table, '运单列表')
        } else {
          exportExcel(this.$refs.approvalTable, '运单列表(已审核)').then(res => {
            this.getTableData(this.searchForm)
            this.queryLoading = false
          })
          // exportExcel(this.$refs.approvalTable, '运单列表')
        }
      }).catch(err => {
        this.getTableData(this.searchForm)
        this.$message.error(err)
        this.queryLoading = false
      })
    },
    handlePassApproval() {
      console.log(this.multiSelection)
      const ids = []
      for (const item of this.multiSelection) {
        ids.push(item.id)
      }
      let audit_result
      if (this.isAprovalPass) {
        audit_result = 1
      } else {
        audit_result = 0
      }
      const p = { auditVerdict: this.approvalForm.text, audit_result }
      p.ids = ids
      this.approvalBtnLoading = true
      WaybillApi.passApproval(p).then(res => {
        this.approvalBtnLoading = false
        this.approvalVisible = false
        this.$message.success('审核成功')
        this.getTableData(this.searchForm)
      })
    },
    handTabClick() {
      this.multiSelection = []
      this.$refs['approvalTable'].clearSelection()
      this.$refs['table'].clearSelection()
      this.page.current = 1
      this.getTableData(this.searchForm)
    },
    getTableData(param, isClear = true) {
      if (isClear) {
        this.$refs['table'].clearSelection()
      }
      this.queryLoading = true
      const query = {}
      var page = {
        pageNum: this.page.current,
        pageSize: this.page.pageSize
      }
      Object.assign(query, page)
      if (param) {
        Object.assign(query, param)
      }
      if (query.placeStartTime && query.placeEndTime) {
        query.placeStartTime = this.dayTime(query.placeStartTime, 'start')
        query.placeEndTime = this.dayTime(query.placeEndTime, 'end')
      } else {
        query.placeStartTime = ''
        query.placeEndTime = ''
      }
      // 审核状态
      query.passFlag = this.tabName === 'noPass' ? 0 : 1
      WaybillApi.commonQuery(query).then(res => {
        if (res.total) {
          this.page.total = parseInt(res.total)
        } else {
          this.page.total = 0
        }

        this.tableData = res.data
        this.queryLoading = false
      }).catch(err => {
        this.$message.error(err)
        this.queryLoading = false
      })
    },
    /**
     * 时间格式化查询
     */
    dayTime(myTime, type) {
      const time = new Date(myTime)
      let str = ''
      myTime = time.getFullYear() + '-' +
        ((time.getMonth() + 1) < 10 ? '0' + (time.getMonth() + 1) : time.getMonth() + 1) + '-' +
        time.getDate()
      if (type === 'end') {
        str = ' 23:59:59'
      } else {
        str = ' 00:00:00'
      }
      return myTime + str
    },
    /**
     * 查询事件
     */
    handleSearch() {
      const p = Object.assign({}, this.searchForm)
      this.page.current = 1
      this.getTableData(p)
    },
    handleUpdateForm() {
      if (this.detailDialogType === 'edit') {
        this.$refs.detail.waybillChargeInfo.map(itemChargeInfos => {
          let rateType, fee, id, version
          // rate, chargesRef,
          itemChargeInfos.map(item => {
            if (item.rateType) {
              rateType = item.rateType
              id = item.id
              version = item.version
            } else if (item.fee) {
              fee = item.fee
            }
            //  else if (item.chargesRef) {
            //   chargesRef = item.chargesRef
            // }
            // else if (item.rate) {
            //   rate = item.rate
            // }
          })
          // && !chargesRef
          if (!rateType) {
            return
          }
          this.$refs.detail.waybillChargeDTOS.push({
            rateType, fee, id, version,
            // rate, chargesRef,
            waybillId: this.$refs.detail.formData.id
          })
        })
        this.$refs.detail.waybillSendCostInfo.map(itemSendCostInfos => {
          let feeType, carrierId, fee, id, version
          // rate, settleWay, costRef,
          itemSendCostInfos.map(item => {
            if (item.feeType) {
              feeType = item.feeType
              id = item.id
              version = item.version
            } else if (item.fee) {
              fee = item.fee
            } else if (item.carrierId) {
              carrierId = item.carrierId
            }

            //  else if (item.settleWay) {
            //   settleWay = item.settleWay
            // } else if (item.costRef) {
            //   costRef = item.costRef
            // }
            // else if (item.rate) {
            //   rate = item.rate
            // }
          })
          //  && !settleWay && !costRef
          if (!feeType) {
            return
          }
          this.$refs.detail.waybillSendCostDTOS.push({
            feeType, carrierId, fee, id, version,
            // rate, settleWay, costRef,
            waybillId: this.$refs.detail.formData.id
          })
        })
        // if (this.$refs.detail.waybillChargeDTOS.length) {
        //   WaybillApi.updatedCharge(this.$refs.detail.waybillChargeDTOS).then(res => {
        //     if (res) {
        //       this.$message.success('费用信息修改成功')
        //     } else {
        //       this.$confirm('费用信息修改失败请重新对费用信息进行更改！', '提示', {
        //         confirmButtonText: '确定',
        //         type: 'warning',
        //         callback: actions => {}
        //       })
        //     }
        //   }).catch(err => {
        //     this.$message.error(err)
        //     this.$alert('费用信息修改失败请重新对费用信息进行更改！', '提示', {
        //       confirmButtonText: '确定',
        //       type: 'warning',
        //       callback: actions => {}
        //     })
        //   })
        // }
        // if (this.$refs.detail.waybillSendCostDTOS.length) {
        //   WaybillApi.updatedSendCost(this.$refs.detail.waybillSendCostDTOS).then(res => {
        //     console.log(res)
        //     if (res) {
        //       this.$message.success('成本信息修改成功')
        //     } else {
        //       this.$confirm('成本信息修改失败请重新对成本信息进行更改！', '提示', {
        //         confirmButtonText: '确定',
        //         type: 'warning'
        //       })
        //     }
        //   }).catch(err => {
        //     this.$message.error(err)
        //     this.$alert('成本信息修改失败请重新对成本信息进行更改！', '提示', {
        //       confirmButtonText: '确定',
        //       type: 'warning',
        //       callback: actions => {}
        //     })
        //   })
        // }
        const form = this.$refs.detail.formData
        form.placeBillwayTime = new Date(form.placeBillwayTime).format('yyyy-MM-dd hh:mm:ss')
        const allData = {}
        Object.assign(allData, form,
          { waybillChargeDTOS: this.$refs.detail.waybillChargeDTOS },
          { waybillSendCostDTOS: this.$refs.detail.waybillSendCostDTOS },
          { waybillDetailDTOS: this.$refs.detail.waybillDetailList }
        )
        WaybillApi.update(allData).then(res => {
          if (res) {
            this.$message.success('运单信息修改成功')
          } else {
            this.$message.success('运单信息修改失败请重试')
          }
          this.getTableData(this.searchForm)
          this.dialogVisible = false
        }).catch(err => {
          this.$message.error(err)
          this.$message.error('运单信息修改失败请重试')
        })
      } else if ((this.detailDialogType === 'merge')) {
        this.$confirm('合单操作将是不可逆操作, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const form = this.$refs.detail.formData
          form.placeBillwayTime = new Date(form.placeBillwayTime).format('yyyy-MM-dd hh:mm:ss')
          WaybillApi.confirmMergeWaybill(form).then(res => {
            if (res) {
              this.$message.success('合单成功')
            } else {
              this.$message.success('合单失败请重试')
            }
            this.getTableData(this.searchForm)
            this.dialogVisible = false
          }).catch(err => {
            this.$message.error(err)
            this.$message.error('合单失败请重试')
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消合单'
          })
        })
      }
    },
    // 表格双击编辑事件
    handleDbClick(row, col, e) {
      this.handleEdit(row)
      this.$refs.detail.onBtnViewRouteClick(row)
    },
    /**
     *编辑
     */
    handleEdit(row, flag) {
      this.addFlag = false
      this.detailDialogType = 'edit'
      this.waybillInfoDetailQueryLoading = true
      WaybillApi.getWaybillInfo(row.id).then(res => {
        this.editAndMerge(res)
      }).catch(err => {
        this.$message.error(err)
        this.waybillInfoDetailQueryLoading = false
      })
      this.waybillDetailDisabled = true
      if (flag) this.isApproval = true
      else this.isApproval = false
      this.dialogVisible = true
    },
    /**
     * 编辑以及合单都调用此方法
     * @param res 传后端返回的数据
     */
    editAndMerge(res) {
      // 对费用信息进行收录,转换成我们需要的数据形式
      const waybillChargeInfo = []
      res.waybillChargeDTOS.map(item => {
        const { rateType, id, version } = item
        let { fee } = item
        // let { rate, fee, chargesRef, } = item
        // if (!parseFloat(rate)) {
        //   rate = 0
        // }
        if (!parseFloat(fee)) {
          fee = 0
        }
        const waybillCharge = [
          { label: '费用类型', rateType, value: 'rateType', id, version },
          // { label: '收费依据', chargesRef, value: 'chargesRef' },
          // { label: '费率', rate, value: 'rate' },
          { label: '费用', fee, value: 'fee' }
        ]
        waybillChargeInfo.push(waybillCharge)
      })
      // 对成本信息进行收录,转换成我们需要的数据形式
      const waybillSendCostInfo = []
      res.waybillSendCostDTOS.map(item => {
        const { feeType, carrierId, id, version } = item
        let { fee } = item
        // let { rate, fee,  settleWay, costRef,} = item
        // if (!parseFloat(rate)) {
        //   console.log(parseFloat(rate))

        //   rate = 0
        // }
        if (!parseFloat(fee)) {
          fee = 0
        }
        const waybillSendCost = [
          { label: '承运商', carrierId, value: 'carrierId' },
          { label: '费用类型', feeType, value: 'feeType', id, version },
          // { label: '结算方式', settleWay, value: 'settleWay' },
          // { label: '成本依据', costRef, value: 'costRef' },
          // { label: '费率', rate, value: 'rate' },
          { label: '费用', fee, value: 'fee' }
        ]

        waybillSendCostInfo.push(waybillSendCost)
      })
      const waybillDetailList = res.waybillDetailDTOS
      if (waybillDetailList.length) {
        this.$refs.detail.waybillDetailList = waybillDetailList
      }
      // 判断是否为空,如果为空就提货detail组件里面所初始化的值
      if (waybillChargeInfo.length) {
        this.$refs.detail.waybillChargeInfo = waybillChargeInfo
      }
      if (waybillSendCostInfo.length) {
        this.$refs.detail.waybillSendCostInfo = waybillSendCostInfo
      }
      // this.waybillInfo = res
      this.$refs.detail.formData = res
      this.waybillInfoDetailQueryLoading = false
    },
    handleDetail(row, flag) {
      this.waybillInfo = row
      this.waybillDetailDisabled = true
      if (flag) this.isApproval = true
      else this.isApproval = false
      this.dialogVisible = true
    },
    /**
     * @description: 下拉列表 合单和撤单
     * @param {*} command
     * @return {*}
     */
    onDropdownCommandMerge(command) {
      switch (command) {
        case 'merge': {
          // this.handleMergeWaybill() // 合单
          this.handleMerge() // 合单
          break
        }
        case 'unMerge': {
          this.handleDivide() // 撤单
          break
        }
      }
    },
    handleMerge() {
      if (!this.multiSelection || this.multiSelection.length < 2) {
        this.$message.info('勾选的运单数不得少于两条')
        return
      }
      let isOldMerge = false // 判断是否已被合单过
      let isMerged = false // 判断是否是被合过的运单
      let receiverList = this.multiSelection.map(item => {
        if (!isOldMerge) {
          if (item.masterFlag === 1) {
            // this.$message.info('从数不得少于两条')
            isOldMerge = true
          } else if (item.masterFlag === 2) {
            isMerged = true
          }
        }
        return item.receiver
      })
      if (isOldMerge) {
        this.$message.warning('从单不能再次被合单')
        return
      }
      if (isMerged) {
        this.$message.warning('合单不能不能再次被合单')
        return
      }
      receiverList = [...new Set(receiverList)]
      if (receiverList.length !== 1) {
        this.$confirm('系统检测到所选运单中存在不同收货人, 是否继续合单?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.getMergeWaybillInfo()
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消合单'
          })
          return
        })
      } else {
        this.getMergeWaybillInfo()
      }
      // this.mergeVisible = true
    },
    // 封装合单冗余代码
    getMergeWaybillInfo() {
      this.$confirm('合单操作将是不可逆操作, 是否继续合单?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const ids = []
        this.multiSelection.map(item => {
          ids.push(item.id)
        })
        this.waybillInfoDetailQueryLoading = true
        this.waybillDetailDisabled = true
        this.dialogVisible = true
        this.detailDialogType = 'merge'
        WaybillApi.getMergeWaybill({ ids }).then(res => {
          this.editAndMerge(res)
        }).catch(err => {
          this.$message.error(err)
          this.$message.error('网络错误，请重试')
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消合单'
        })
      })
    },
    // 合并订单
    handleMergeWaybill() {
      const p = []
      for (const item of this.multiSelection) {
        p.push(item.id)
      }

      WaybillApi.mergeWaybill(p).then(res => {
        this.getTableData(this.searchForm)
        this.mergeVisible = false
        this.$message.success('合并成功!')
      })
    },
    handleApproval() {
      if (!this.multiSelection || this.multiSelection.length < 1) {
        this.$message.info('勾选的数据不能为空')
        return
      }
      this.approvalForm.time = new Date().format('yyyy-MM-dd hh:mm:ss')
      this.approvalForm.mailNo = this.multiSelection.mailno
      this.approvalVisible = true
    },
    // 选择的数据
    handleSelectionChange(val) {
      this.multiSelection = val
    },
    handleMultiDelete() {
      if (!this.multiSelection || this.multiSelection.length < 1) {
        this.$message.info('勾选的数据不能为空')
        return
      }
      this.$confirm('确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const p = []
        for (const item of this.multiSelection) {
          p.push(item.id)
        }
        WaybillApi.deleteList(p).then(res => {
          this.getTableData(this.searchForm)
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
      })
    },
    handleDelete(row) {
      this.$confirm('确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        WaybillApi.deleteOne({ id: row.id }).then(res => {
          this.getTableData(this.searchForm)
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 拆单
    showwaybillstatus(row) {
      this.querywaybillstatus(row)
    },
    closewwaybillstatus(row) {
      this.gridData = []
    },
    querywaybillstatus(row) {
      
      planAndExecuteApi.getwaybillstatslist({ orderNo: row.orderNo }).then(res => {
        
        this.gridData = res.data
        this.querywaybillstatusloading = false
      }).catch(error => {
        this.$message.error(error)
      })
    },
    handleDivide(row) {
      this.$confirm('确定拆解该订单?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        WaybillApi.divideWaybill({ id: row.id }).then(res => {
          this.getTableData(this.searchForm)
          this.$message({
            type: 'success',
            message: '拆解成功!'
          })
        })
      }).catch(() => { })
    }

  }
}
</script>

<style scoped>
.dialog-footer {
  text-align: none;
}
.el-table >>> .red {
  background: hsl(0, 83%, 93%);
}
.el-table >>> .green {
  background: hsl(138, 84%, 87%);
}
.el-table >>> .pink {
  background: hsl(332, 95%, 84%);
}
.el-table >>> .blue {
  background: hsl(184, 71%, 77%);
}
.el-table >>> .wheat {
  background: wheat;
}
.el-table >>> .yellow {
  background: hsl(56, 100%, 84%);
}
.el-table >>> .aqua {
  background: aqua;
}
.el-table >>> .yellowgreen {
  background: hsl(71, 100%, 50%);
}
.el-table >>> .lightSky {
  background: hsl(177, 100%, 50%);
}
.el-table >>> .lightpurple {
  background: hsl(286, 100%, 50%);
}
.el-table >>> th {
  padding: 0px 0;
  font-size: 8px;
}
.tabBox {
  margin-left: 5px;
}
.tabBox >>> .el-tabs__header {
  margin: 0;
  padding: 0;
}
.el-table >>> .cell {
  padding: 0 2px !important;
  font-size: 8px;
}
.tableBox {
  width: 100%;
  margin: 0;
  margin-top: 20px;
  font-size: 8px;
  /* transform:scale(0.7);
    -ms-transform:scale(0.7);
    -webkit-transform:scale(0.7)!important; */
  /* margin-left: -10vw;
    margin-top: -6vw; */
}
.searchFormStyle {
  /* transform:scale(0.8);
    -ms-transform:scale(0.8);
    -webkit-transform:scale(0.8)!important;  */
  /* margin-left: -11%; */
}
.batchBtnStyle {
  margin-bottom: 10px;
  margin-left: 5px;
  /* position: absolute;
    left: 0vw;
    transform:scale(0.7);
    -ms-transform:scale(0.7);
    -webkit-transform:scale(0.7)!important; */
}
.paginationBox {
  /* transform:scale(0.8);
    -ms-transform:scale(0.8);
    -webkit-transform:scale(0.8)!important; */
  margin-left: 5px;
  /* margin-top: -5.9%; */
}
.moreInfoIcon {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 1px solid #34a6ff;
  border-radius: 50%;
  vertical-align: center;
}
</style>
<style>
.el-table__expanded-cell[class*="cell"] {
  padding: 0px;
}
</style>
