<template>

  <div style="position:relative;">
    <div style="position:absolute;right:30px;top:-30px">已上传图片：{{ fileList.length }}</div>
    <!-- <div> <el-input v-model="uploaddate" /><el-button @click="testuploadfile">测试按钮</el-button></div> -->
    <el-upload
      ref="uploadOSS"
      v-loading="uploadLoading"
      :file-list="fileList"
      action=""
      :on-remove="handleRemovePicture"
      multiple
      :auto-upload="false"
      accept=".jpg,.jpeg,.png,.JPG,.JPEG,.PNG"
      :on-change="onChangePicture"
      :on-preview="handlePictureCardPreview"
      list-type="picture-card"
      element-text-loading="Loading"
    >
      <i class="el-icon-plus" />
    </el-upload>
    <el-button
      style="margin-top:-20px;float:right;"
      size="small"
      @click="parentCancelHandel()"
    >取 消</el-button>
    <el-button
      v-loading="uploadLoading"
      style="margin-top: -20px;float:right;margin-right:10px"
      size="small"
      type="success"
      @click="uploadPicture"
    >上传图片</el-button>
    <el-button
      v-loading="uploadLoading"
      style="margin-top: -20px;float:right;margin-right:10px"
      size="small"
      type="success"
      @click="uploadPictureAndAudit"
    >上传并审核</el-button>
  </div>

</template>
<script>
import { planAndExecuteApi } from '@/api/planAndExecute/receiptAudit'
import { client } from '@/api/ali-oss/oss' // 引入oss.js文件
export default {
  name: 'PictureUpload',
  props: {
    upLoadCustomer: {
      type: Array,
      default: () => {
        return [{ customer: String, orderNo: String }]
      }
    },
    onlyOrderNo: {
      type: String,
      required: true
    },
    isOnly: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      uploaddate: '',
      fileList: [],
      dialogImageUrl: '',
      dialogVisible: false,
      uploadLoading: false,
      isAudit: false
    }
  },
  methods: {
    handleRemove(file) {
      console.log(file)
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    // 删除事件，需要根据具体业务分析，即删除时候从数组中去除选中的文件
    handleRemovePicture(file, fileList) {
      this.fileList = fileList
    },
    // 选择文件时候触发  需根据需求具体分析
    onChangePicture(file, fileList) {
      console.log(fileList)
      this.fileList = fileList
    },
    /**
     * 上传并审核
     */
    uploadPictureAndAudit() {
      this.isAudit = true
      this.uploadPicture()
    },

    // 开发测试
    testuploadfile() {
      const test_base_url = 'https://tmsfilesave.oss-cn-shenzhen.aliyuncs.com/mnt/sd365/pe/receiptAudit_file/' + this.uploaddate.trim() + '/'
      const singorder = []
      const doubleorder = []
      this.fileList.map(item => {
        if (item.name.includes('_')) {
          doubleorder.push(item.name)
        } else {
          const obj = { filename: item.name, orderlist: [] }
          singorder.push(obj)
        }
      })

      singorder.map(singorderitem => {
        doubleorder.map(doubleorderitem => {
          if (doubleorderitem.includes(singorderitem.filename.split('.')[0])) {
            singorderitem.orderlist.push(doubleorderitem)
          }
        })
      })

      const waitingsend = []
      singorder.map(item => {
        const obj = { orderNo: '', oosurl: '' }
        obj.orderNo = item.filename.split('.')[0]

        if (item.orderlist.length === 0) {
          obj.oosurl = test_base_url + item.filename
        } else {
          const orderurllist = []
          const str = test_base_url + item.filename
          orderurllist.push(str)
          item.orderlist.map(item => {
            const str = test_base_url + item
            orderurllist.push(str)
          })
          obj.oosurl = orderurllist.join('&')
        }
        waitingsend.push(obj)
      })
      planAndExecuteApi.upLoadPicture(waitingsend).then(res => {
        this.$message.success('成功')
        
      })
      
    },
    // 上传接口，进行上传
    uploadPicture() {
      if (!this.fileList.length) {
        return false
      }
      console.log(this.fileList)

      let isExceptPicture = false // 判断图片类型
      let isChianeseName = false // 判断是包含中文
      let isOnlyOrderNo = true // 判断单条数据的订单号是否是所传图片的
      const exceptPictureList = []
      const exceptNameList = [] // 存放名字格式存在问题的回单
      this.fileList.map(item => {
        // 判断图片类型
        if (!/\.(png|jpg)$/.test(item.name.toLowerCase())) {
          isExceptPicture = true
          exceptPictureList.push(item.name)
        }
        // 判断是包含中文
        if (!this.checkChinese(item.name)) {
          isChianeseName = true
        }
        // 判断单条数据的订单号是否是所传图片的
        const { extType, orderFileName, realFileName } = this.getType(item.name)
        console.log(this.onlyOrderNo && !realFileName.includes(this.onlyOrderNo))
        console.log(!realFileName.includes(this.onlyOrderNo))
        console.log(this.onlyOrderNo)
        console.log(this.isOnly)
        if (this.isOnly && !realFileName.includes(this.onlyOrderNo)) {
          isOnlyOrderNo = false
        }
      })
      if (!isOnlyOrderNo) {
        this.$message.error(`文件名所属订单号与所选上传的回单数据订单号不符`)
        return
      }
      if (isChianeseName) {
        this.$message.error(`图片名不能包含中文，请请检查`)
        return
      }
      if (isExceptPicture) {
        this.$message.error(`图片${exceptPictureList.join(',')}格式不正确，请上传png或者jpg格式`)
        return
      }
      this.uploadLoading = true
      let index = 0
      const waybillDTOList = [] // 存放运单数据
      const resOSSList = [] // 存放OSS响应数据，后续用来遍历更改oosurlOSURL
      let orderFileNameList = []
      this.fileList.map(item => {
        let imgPath = 'mnt/sd365/pe/receiptAudit_file/'
        const { extType, orderFileName, realFileName } = this.getType(item.name)
        // const extType = this.getType(item.name)
        imgPath = imgPath + this.fileFormatTime(new Date()) + '/' + item.name
        if (realFileName.includes('-')) {
          orderFileNameList.push(orderFileName)
        } else {
          orderFileNameList.push(realFileName)
        }

        client.put(imgPath, item.raw).then(resOSS => {
          resOSSList.push(resOSS)
          index += 1
          if (index === (this.fileList.length - exceptNameList.length)) {
            orderFileNameList = [...new Set(orderFileNameList)]
            const uploadPictureList = []
            orderFileNameList.map(orderFileNameitem => {
              let oosurl = ''
              resOSSList.map(ossItem => {
                if (ossItem.url.includes(orderFileNameitem)) {
                  if (!oosurl) {
                    oosurl = ossItem.url
                  } else {
                    oosurl = oosurl + '&' + ossItem.url
                  }
                }
              })
              if (oosurl) {
                if (!this.isAudit) {
                  uploadPictureList.push({ orderNo: orderFileNameitem, oosurl })
                } else {
                  uploadPictureList.push({ orderNo: orderFileNameitem, oosurl, receiptStauts: 103 })
                }
              }
            })
            
            planAndExecuteApi.upLoadPicture(uploadPictureList).then(res => {
              if (res) {
                this.parentCancelHandel()
                this.uploadLoading = false
              } else {
                this.$message.error('上传出错，请重试')
                this.uploadLoading = false
                this.isAudit = false
                this.parentCancelHandel()
              }
            }).catch(err => {
              this.uploadLoading = false
              this.$message.error(err)
              this.$message.error('上传失败，请重新上传')
              this.isAudit = false
              this.parentCancelHandel()
            })
          }
        }).catch(err => {
          this.uploadLoading = false
          this.isAudit = false
          this.$message.error(err)
        })
        // }
      })
      this.isOnly = false
    },
    // 获取文件后缀名
    getType(file) {
      var index1 = file.lastIndexOf('.')
      var index2 = file.length
      var extType = file.substring(index1, index2).toLowerCase()
      var orderFileName
      const realFileName = file.substring(index1, 0)
      if (realFileName.indexOf('-') !== -1) {
        var index3 = realFileName.lastIndexOf('-')
        orderFileName = file.substring(index3, 0)
      }
      return { extType, orderFileName, realFileName }
      // return { extType, realFileName }
    },
    /**
   * 文件时间格式化封装
   * @param time
   */
    fileFormatTime(time) {
      if (!time) {
        return
      }
      time = new Date(time)
      time = time.getFullYear() + '-' +
        ((time.getMonth() + 1) < 10 ? '0' + (time.getMonth() + 1) : time.getMonth() + 1) + '-' +
        (time.getDate() < 10 ? '0' + time.getDate() : time.getDate())
      return time
    },
    /**
     * 判断是否为中文
     */
    checkChinese(val) {
      var reg = new RegExp('[\\u4E00-\\u9FFF]+', 'g')
      if (reg.test(val)) {
        return false
      } else {
        return true
      }
    },
    parentCancelHandel() {
      this.$emit('parentCancelHandel')
      this.fileList = []
    }
  }
}
</script>
