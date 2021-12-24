<template>
  <div>
    <el-form label-width="100px" :model="spuInfo">
      <el-form-item label="SPU名称">
        <el-input v-model="spuInfo.spuName" placeholder="SPU名称"></el-input>
      </el-form-item>

      <el-form-item label="品牌">
        <el-select v-model="spuInfo.tmId" placeholder="请选择品牌">
          <el-option
            :label="tm.tmName"
            :value="tm.id"
            v-for="tm in trademarkList"
            :key="tm.id"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="SPU描述">
        <el-input
          v-model="spuInfo.description"
          type="textarea"
          rows="4"
          placeholder="SPU描述"
        ></el-input>
      </el-form-item>

      <el-form-item label="SPU图片">
        <el-upload
          action="/dev-api//admin/product/fileUpload"
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

      <el-form-item label="销售属性">
        <el-select
          v-model="unUsedSaleAttrIdValueId"
          :placeholder="
            unUsedSaleAttrList.length
              ? `还有${unUsedSaleAttrList.length}未选择`
              : '没有啦!!!'
          "
        >
          <el-option
            :label="unUsedSaleAttr.name"
            :value="`${unUsedSaleAttr.id}:${unUsedSaleAttr.name}`"
            v-for="unUsedSaleAttr in unUsedSaleAttrList"
            :key="unUsedSaleAttr.id"
          ></el-option>
        </el-select>

        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="addSaleValue"
          :disabled="!unUsedSaleAttrIdValueId"
          >添加销售属性</el-button
        >

        <el-table :data="spuInfo.spuSaleAttrList" border style="width: 100%">
          <el-table-column type="index" align="center" label="序号" width="80">
          </el-table-column>

          <el-table-column prop="saleAttrName" label="属性名" width="150">
          </el-table-column>

          <el-table-column prop="prop" label="属性值名称列表" width="width">
            <template slot-scope="{ row, $index }">
              <el-tag
                @close="row.spuSaleAttrValueList.splice(index, 1)"
                v-for="(saleAttrValue, index) in row.spuSaleAttrValueList"
                :key="saleAttrValue.id"
                closable
                :disable-transitions="false"
                >{{ saleAttrValue.saleAttrValueName }}
              </el-tag>
              <el-input
                v-if="row.inputVisible"
                v-model="row.inputValue"
                class="input-new-tag"
                ref="saveTagInput"
                size="small"
                @blur="handleButton(row)"
                @keyup.enter.native="handleButton(row)"
              >
              </el-input>
              <!-- @click="showInput" -->
              <el-button
                v-else
                class="button-new-tag"
                size="small"
                @click="handleInput(row)"
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
                @click="spuInfo.spuSaleAttrList.splice($index, 1)"
              ></HintButton>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="cancel">取消</el-button>
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

      // 下面这个对象是为了添加用的
      category3Id: '',
      spuInfo: {
        category3Id: '',
        spuName: '',
        description: '',
        tmId: '',
        spuImageList: [
          // {
          //   id: 0,
          //   imgName: 'string',
          //   imgUrl: 'string',
          //   spuId: 0,
          // },
        ],
        spuSaleAttrList: [
          // {
          //   baseSaleAttrId: 0,
          //   id: 0,
          //   saleAttrName: 'string',
          //   spuId: 0,
          //   spuSaleAttrValueList: [
          //     {
          //       baseSaleAttrId: 0,
          //       id: 0,
          //       isChecked: 'string',
          //       saleAttrName: 'string',
          //       saleAttrValueName: 'string',
          //       spuId: 0,
          //     },
          //   ],
          // },
        ],
      },

      spuImageList: [],
      trademarkList: [],
      baseSaleAttrList: [],

      unUsedSaleAttrIdValueId: '', // 这个销售属性收集id和name
    }
  },
  methods: {
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handlePictureSuccess(res, file, fileList) {
      this.spuImageList = fileList
    },

    // 请求添加的初始化数据
    async getInitAddSpuFormData(category3Id) {
      console.log(category3Id)
      this.category3Id = category3Id
      // 获取品牌列表
      const result2 = await this.$API.trademark.getList()
      if (result2.code === 200 || result2.code === 20000) {
        this.trademarkList = result2.data
      }

      // 获取销售列表
      const result3 = await this.$API.spu.getSaleAttrList()
      if (result3.code === 200 || result3.code === 20000) {
        this.baseSaleAttrList = result3.data
      }
    },

    // 请求获取初始化更新spu数据
    async getInitUpdateSpuFormData(spu, category3Id) {
      this.category3Id = category3Id
      // 这里面发送4个请求
      // 通过spuId获取spu
      const result = await this.$API.spu.get(spu.id)
      if (result.code === 200 || result.code === 20000) {
        this.spuInfo = result.data
      }

      // 获取图片列表
      const result1 = await this.$API.sku.getSpuImageList(spu.id)
      if (result1.code === 200 || result1.code === 20000) {
        const spuImageList = result1.data

        // 往每个图片对象当中添加name和url
        spuImageList.forEach(item => {
          item.name = item.imgName
          item.url = item.imgUrl || item.response.data
        })

        // 这才是响应式的
        this.spuImageList = spuImageList
      }

      // 获取品牌列表
      const result2 = await this.$API.trademark.getList()
      if (result2.code === 200 || result2.code === 20000) {
        this.trademarkList = result2.data
      }

      // 获取销售列表
      const result3 = await this.$API.spu.getSaleAttrList()
      if (result3.code === 200 || result3.code === 20000) {
        this.baseSaleAttrList = result3.data
      }
    },

    // 添加销售属性
    addSaleValue() {
      const [baseSaleAttrId, saleAttrName] =
        this.unUsedSaleAttrIdValueId.split(':')
      const obj = {
        baseSaleAttrId,
        saleAttrName,
        spuSaleAttrValueList: [],
      }

      this.spuInfo.spuSaleAttrList.push(obj)
      this.unUsedSaleAttrIdValueId = ''
    },

    // 展示input
    handleInput(row) {
      this.$set(row, 'inputVisible', true)

      this.$set(row, 'inputValue', '')

      this.$nextTick(() => {
        this.$refs.saveTagInput.focus()
      })
    },

    // 展示button
    handleButton(row) {
      let saleAttrValueName = row.inputValue
      if (!saleAttrValueName.trim()) {
        row.inputValue = ''
        return
      }

      let isRepeat = row.spuSaleAttrValueList.some(
        item => item.saleAttrValueName === saleAttrValueName
      )

      if (isRepeat) {
        this.$message.error('属性值重复')
        row.inputValue = ''
        return
      }

      let obj = {
        baseSaleAttrId: row.baseSaleAttrId,
        saleAttrValueName,
      }

      row.spuSaleAttrValueList.push(obj)
      row.inputVisible = false
      row.inputValue = ''
    },

    // 保存
    async save() {
      // 获取数据
      let { spuImageList, spuInfo, category3Id } = this
      spuInfo.category3Id = category3Id
      // 整理图片列表
      /**
       * imgName: 'string',
       */
      spuInfo.spuImageList = spuImageList.map(item => {
        return {
          imgName: item.name,
          imgUrl: item.imgUrl || item.response.data,
        }
      })

      // 删除多余的inputValue和inputVisible
      spuInfo.spuSaleAttrList.forEach(item => {
        delete item.inputValue
        delete item.inputVisible
      })
      console.log(spuInfo)
      // 发请求
      try {
        const result = await this.$API.spu.addUpdate(spuInfo)
        if (result.code === 200) {
          this.$message.success('保存spu成功')
          // 回到列表页
          this.$emit('update:visible', false)
          // 清除整个data
          this.resetData()
          // 重新发数据
          this.$emit('backSuccess')
        } else {
          this.$message.error('保存spu失败')
        }
      } catch (error) {
        this.$message.error('请求保存spu失败')
      }
    },

    resetData() {
      this.dialogImageUrl = ''
      this.dialogVisible = false

      // 下面这个对象是为了添加用的
      this.spuInfo = {
        category3Id: '',
        spuName: '',
        description: '',
        tmId: '',
        spuImageList: [],
        spuSaleAttrList: [],
      }
      this.spuImageList = []
      this.trademarkList = []
      this.baseSaleAttrList = []

      this.unUsedSaleAttrIdValueId = '' // 这个销售属性收集id和name
    },

    // 取消按钮
    cancel() {
      this.$emit('update:visible', false)

      this.$emit('cancelSuccess')

      // 重置数据
      this.resetData()
    },
  },

  computed: {
    // 根据所有的销售属性列表和spu自己的销售属性列表计算剩余的销售属性列表
    unUsedSaleAttrList() {
      return this.baseSaleAttrList.filter(item =>
        this.spuInfo.spuSaleAttrList.every(
          saleAttr => saleAttr.saleAttrName !== item.name
        )
      )
    },
  },
}
</script>

<style>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
