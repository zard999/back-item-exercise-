<template>
  <div>
    <el-form :model="spuForm">
      <el-form-item label="SPU名称" label-width="100px">
        <el-input v-model="spuForm.spuName" placeholder="SPU名称"></el-input>
      </el-form-item>

      <el-form-item label="品牌" label-width="100px">
        <el-select v-model="spuForm.tmId" placeholder="请选择品牌">
          <el-option
            :label="tm.tmName"
            :value="tm.id"
            v-for="tm in trademarkList"
            :key="tm.id"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="SPU描述" label-width="100px">
        <el-input
          v-model="spuForm.description"
          type="textarea"
          rows="4"
          placeholder="SPU描述"
        ></el-input>
      </el-form-item>

      <el-form-item label="SPU图片" label-width="100px">
        <el-upload
          action="/dev-api/admin/product/fileUpload"
          list-type="picture-card"
          :file-list="spuImageList"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-success="handlePictureSuccess"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>

      <el-form-item label="销售属性" label-width="100px">
        <el-select
          v-model="unUseSaleAttrIdName"
          :placeholder="
            unUseSaleAttrList.length
              ? `还有${unUseSaleAttrList.length}未选择`
              : '没有啦！！！'
          "
        >
          <el-option
            :label="unUseSaleAttr.name"
            :value="`${unUseSaleAttr.id}:${unUseSaleAttr.name}`"
            v-for="unUseSaleAttr in unUseSaleAttrList"
            :key="unUseSaleAttr.id"
          ></el-option>
        </el-select>

        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="addSaleAttr"
          :disabled="!unUseSaleAttrIdName"
          >添加销售属性</el-button
        >

        <el-table :data="spuForm.spuSaleAttrList" style="width: 100%" border>
          <el-table-column align="center" type="index" label="序号" width="80">
          </el-table-column>

          <el-table-column prop="saleAttrName" label="属性名" width="150">
          </el-table-column>

          <el-table-column prop="prop" label="属性值名称列表" width="width">
            <template slot-scope="{ row, $index }">
              <el-tag
                closable
                v-for="(spuSaleAttrValue, index) in row.spuSaleAttrValueList"
                :key="spuSaleAttrValue.id"
                style="margin-right:10px"
                @close="row.spuSaleAttrValueList.splice(index, 1)"
                >{{ spuSaleAttrValue.saleAttrValueName }}</el-tag
              >
              <el-input
                ref="saveTagInput"
                v-if="row.inputVisibly"
                v-model="row.inputValue"
                style="width:90px;"
                size="small"
                @blur="handleButton(row)"
                @keyup.enter.native="handleButton(row)"
              ></el-input>
              <el-button v-else size="small" @click="handleInput(row, $index)"
                >添加</el-button
              >
            </template>
          </el-table-column>

          <el-table-column prop="prop" label="操作" width="150">
            <template slot-scope="{ row, $index }">
              <HintButton
                type="danger"
                size="mini"
                icon="el-icon-delete"
                title="删除销售属性"
                @click="spuForm.spuSaleAttrList.splice($index, 1)"
              ></HintButton>
            </template>
          </el-table-column>
        </el-table>

        <div style="margin-top:20px">
          <el-button type="primary" @click="save">保存</el-button>
          <el-button @click="cancel">取消</el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'SpuForm',
  data() {
    return {
      dialogImageUrl: '',
      dialogVisible: false,

      category3Id: '',

      spuForm: {
        category3Id: '',
        description: '',
        spuImageList: [
          // {
          //   imgName: '',
          //   imgUrl: 'string',
          //   spuId: 0
          // }
        ],
        spuName: '',
        spuSaleAttrList: [
          // {
          //   baseSaleAttrId: 0,
          //   saleAttrName: 'string',
          //   spuId: 0,
          //   spuSaleAttrValueList: [
          //     {
          //       baseSaleAttrId: 0,
          //       isChecked: 'string',
          //       saleAttrName: 'string',
          //       saleAttrValueName: 'string',
          //       spuId: 0
          //     }
          //   ]
          // }
        ],
        tmId: ''
      },

      trademarkList: [],
      spuImageList: [],
      saleAttrList: [],

      unUseSaleAttrIdName: '' // 没有使用的销售属性的id和name
    }
  },
  methods: {
    // 移除图片的回调
    handleRemove(file, fileList) {
      this.spuImageList = fileList
    },
    // 大图的回调
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },

    // 成功的回调
    handlePictureSuccess(res, file, fileList) {
      this.spuImageList = fileList
    },

    // 点击修改需要发送的请求
    async updateSpuListDate(spuId, category3Id) {
      this.category3Id = category3Id
      // 品牌列表
      const trademarkResult = await this.$API.trademark.getList()
      if (trademarkResult.code === 200) {
        this.trademarkList = trademarkResult.data
      }

      // 根据spuId获取spu详细数据
      const spuFormResult = await this.$API.spu.getSpuInfo(spuId)
      if (spuFormResult.code === 200) {
        this.spuForm = spuFormResult.data
      }

      // 获取图片列表数据
      const imageListResult = await this.$API.sku.getSpuImageList(spuId)
      if (imageListResult.code === 200) {
        let spuImageList = imageListResult.data
        spuImageList.forEach(item => {
          ;(item.name = item.imgName), (item.url = item.imgUrl)
        })
        this.spuImageList = spuImageList
      }

      // 获取销售属性
      const saleAttrResult = await this.$API.spu.getSaleAttr()
      if (saleAttrResult.code === 200) {
        this.saleAttrList = saleAttrResult.data
      }
    },

    // 点击添加需要发送的请求
    async addSpuListData(category3Id) {
      this.category3Id = category3Id
      // 获取销售属性
      const saleAttrResult = await this.$API.spu.getSaleAttr()
      if (saleAttrResult.code === 200) {
        this.saleAttrList = saleAttrResult.data
      }

      // 品牌列表
      const trademarkResult = await this.$API.trademark.getList()
      if (trademarkResult.code === 200) {
        this.trademarkList = trademarkResult.data
      }
    },

    // 添加销售属性
    addSaleAttr() {
      let [baseSaleAttrId, saleAttrName] = this.unUseSaleAttrIdName.split(':')
      let obj = {
        baseSaleAttrId,
        saleAttrName,
        spuSaleAttrValueList: []
      }
      this.spuForm.spuSaleAttrList.push(obj)

      this.unUseSaleAttrIdName = ''
    },

    // 点击按钮变成input
    handleInput(row) {
      this.$set(row, 'inputVisibly', true)

      this.$set(row, 'inputValue', '')

      // 自动获取焦点
      this.$nextTick(() => {
        this.$refs.saveTagInput.focus()
      })
    },

    // 失去焦点或按下回车变成button
    handleButton(row) {
      /**
       * 1. 如果值为空，则不变
       * 2. 如果值和之前得值重复，则报错并清空
       */
      let saleAttrValueName = row.inputValue
      if (!saleAttrValueName.trim()) {
        row.inputValue = ''
        return
      }

      let isRepeat = row.spuSaleAttrValueList.some(
        item => saleAttrValueName === item.saleAttrValueName
      )

      if (isRepeat) {
        this.$message.error('属性值重复')
        row.inputValue = ''
        return
      }

      let obj = {
        saleAttrValueName,
        baseSaleAttrId: row.baseSaleAttrId
      }

      row.spuSaleAttrValueList.push(obj)

      row.inputValue = ''
      row.inputVisibly = false
    },

    // 保存
    async save() {
      // 1. 获取参数数据
      let { spuImageList, spuForm, category3Id } = this
      // 整理数据
      spuForm.category3Id = category3Id

      spuForm.spuImageList = spuImageList.map(item => {
        return {
          imgName: item.name,
          imgUrl: item.imgUrl || item.response.data
        }
      })

      // 删除多余的数据，inputValue和inputVisibly
      spuForm.spuSaleAttrList.forEach(item => {
        delete item.inputValue
        delete item.inputVisibly
      })

      try {
        const result = await this.$API.spu.addOrUpdate(spuForm)
        console.log(result)
        if (result.code === 200) {
          this.$message.success('保存spu成功')
          // 关闭SpuForm
          this.$emit('update:visibly', false)
          // 让父组件更新数据
          this.$emit('backSuccess')
          // 重置data
          this.resetData()
        } else {
          this.$message.error('保存spu失败')
        }
      } catch (error) {
        his.$message.error('请求保存spu失败')
      }
    },

    // 重置data数据
    resetData() {
      this.dialogImageUrl = ''
      this.dialogVisible = false
      this.category3Id = ''
      this.spuForm = {
        category3Id: '',
        description: '',
        spuImageList: [],
        spuName: '',
        spuSaleAttrList: [],
        tmId: ''
      }

      this.trademarkList = []
      this.saleAttrList = []
      this.spuImageList = []
      this.unUseSaleAttrIdName = '' // 收集的未使用的销售属性
    },

    // 取消回到列表页
    cancel() {
      this.$emit('update:visibly', false)
      // 通知父组件
      this.$emit('cancelSuccess')
      // 重置数据
      this.resetData()
    }
  },

  computed: {
    // 展示所有的销售属性，但是除去自己，剩余的销售属性
    // 销售属性表里的数据要是不在spuForm里，则证明其没有添加到spuForm里
    unUseSaleAttrList() {
      return this.saleAttrList.filter(saleAttr =>
        this.spuForm.spuSaleAttrList.every(
          spuSaleAttr => spuSaleAttr.saleAttrName !== saleAttr.name
        )
      )
    }
  }
}
</script>

<style></style>
