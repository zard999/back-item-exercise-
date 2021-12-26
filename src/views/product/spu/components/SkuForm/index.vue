<template>
  <div>
    <el-form :model="skuForm" label-width="100px">
      <el-form-item label="SPU名称"> {{ spu.spuName }}</el-form-item>

      <el-form-item label="SKU名称">
        <el-input v-model="skuForm.skuName" placeholder="SKU名称"></el-input>
      </el-form-item>

      <el-form-item label="价格(元)">
        <el-input
          type="number"
          v-model="skuForm.price"
          placeholder="价格(元)"
        ></el-input>
      </el-form-item>

      <el-form-item label="重量(千克)">
        <el-input
          type="number"
          v-model="skuForm.weight"
          placeholder="重量(千克)"
        ></el-input>
      </el-form-item>

      <el-form-item label="规格描述">
        <el-input
          v-model="skuForm.skuDesc"
          type="textarea"
          placeholder="规格描述"
          rows="4"
        ></el-input>
      </el-form-item>

      <el-form-item label="平台属性">
        <el-form :inline="true" label-width="100px">
          <el-form-item
            :label="attr.attrName"
            v-for="attr in attrList"
            :key="attr.id"
          >
            <el-select v-model="attr.attrIdValueId" placeholder="请选择">
              <el-option
                :label="attrValue.valueName"
                :value="`${attr.id}:${attrValue.id}`"
                v-for="attrValue in attr.attrValueList"
                :key="attrValue.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>

      <el-form-item label="销售属性">
        <el-form :inline="true" label-width="100px">
          <el-form-item
            :label="saleAttr.saleAttrName"
            v-for="saleAttr in spuSaleAttrList"
            :key="saleAttr.id"
          >
            <el-select
              v-model="saleAttr.saleAttrIdValueId"
              placeholder="请选择"
            >
              <el-option
                :label="saleAttrValue.saleAttrValueName"
                :value="`${saleAttr.id}:${saleAttrValue.id}`"
                v-for="saleAttrValue in saleAttr.spuSaleAttrValueList"
                :key="saleAttrValue.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>

      <el-form-item label="图片列表">
        <!-- 
            @selection-change="handleSelectionChange"
            选中或者取消图片选择的时候，这个事件会自动触发，
            并且会把选中的图片组成数组
         -->
        <el-table
          :data="spuImageList"
          border
          ref="multipleTable"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection"> </el-table-column>
          <el-table-column label="图片">
            <template slot-scope="{ row }">
              <img :src="row.imgUrl" style="width:100px;height:100px;" />
            </template>
          </el-table-column>
          <el-table-column prop="imgName" label="名称"> </el-table-column>
          <el-table-column prop="address" label="操作" show-overflow-tooltip>
            <template slot-scope="{ row }">
              <el-tag v-if="row.isDefault === '1'" type="success">默认</el-tag>
              <el-button
                v-else
                type="primary"
                size="mini"
                @click="handleDefault(row)"
                >设为默认</el-button
              >
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
  name: 'SkuForm',
  data() {
    return {
      spu: {},
      attrList: [],
      spuSaleAttrList: [],
      spuImageList: [],

      skuImageList: [], // 选择了图片收集spu图片列表

      skuForm: {
        // 从父组件传过来
        category3Id: '',
        spuId: '',
        tmId: '',

        price: '',
        weight: '',
        skuDesc: '',
        skuName: '',

        skuDefaultImg: '',
        skuAttrValueList: [
          // {
          //   attrId: 0,
          //   attrName: 'string',
          //   id: 0,
          //   skuId: 0,
          //   valueId: 0,
          //   valueName: 'string'
          // }
        ],
        skuImageList: [
          // {
          //   id: 0,
          //   imgName: 'string',
          //   imgUrl: 'string',
          //   isDefault: 'string',
          //   skuId: 0,
          //   spuImgId: 0
          // }
        ],
        skuSaleAttrValueList: [
          // {
          //   id: 0,
          //   saleAttrId: 0,
          //   saleAttrName: 'string',
          //   saleAttrValueId: 0,
          //   saleAttrValueName: 'string',
          //   skuId: 0,
          //   spuId: 0
          // }
        ]
      }
    }
  },
  methods: {
    // 收集sku图片列表的回调
    handleSelectionChange(val) {
      console.log(val)
      this.skuImageList = val
    },

    // 添加获取初始化数据
    async addInitSkuFormData(row, category1Id, category2Id) {
      this.spu = row
      // 获取对应sku的销售属性
      const promise1 = this.$API.sku.getSpuSaleAttrList(row.id)
      // 获取平台属性
      const promise2 = this.$API.attr.getList(
        category1Id,
        category2Id,
        row.category3Id
      )
      // 获取spu图片列表
      const promise3 = this.$API.sku.getSpuImageList(row.id)

      const result = await Promise.all([promise1, promise2, promise3])
      this.spuSaleAttrList = result[0].data
      this.attrList = result[1].data

      let spuImageList = result[2].data
      spuImageList.forEach(item => {
        this.$set(item, 'isDefault', 0)
      })
      this.spuImageList = spuImageList
    },

    // 改变默认图片
    handleDefault(row) {
      this.spuImageList.forEach(item => (item.isDefault = '0'))
      row.isDefault = '1'
      this.skuForm.skuDefaultImg = row.imgUrl
    },

    // 保存
    async save() {
      // 1. 获取数据
      let { spu, skuForm, skuImageList, attrList, spuSaleAttrList } = this
      // 2. 整理数据
      skuForm.category3Id = spu.category3Id
      skuForm.spuId = spu.id
      skuForm.tmId = spu.tmId

      // 整理skuImageList
      skuForm.skuImageList = skuImageList.map(item => {
        return {
          imgName: item.imgName,
          imgUrl: item.imgUrl,
          isDefault: item.isDefault,
          spuImgId: item.id
        }
      })

      //  整理skuAttrValueList
      skuForm.skuAttrValueList = attrList.reduce((p, c) => {
        if (c.attrIdValueId) {
          let [attrId, valueId] = c.attrIdValueId.split(':')
          let obj = { attrId, valueId }
          p.push(obj)
        }
        return p
      }, [])

      // 整理skuSaleAttrValueList
      skuForm.skuSaleAttrValueList = spuSaleAttrList.reduce((p, c) => {
        if (c.saleAttrIdValueId) {
          let [saleAttrId, saleAttrValueId] = c.saleAttrIdValueId.split(':')
          let obj = { saleAttrId, saleAttrValueId }
          p.push(obj)
        }
        return p
      }, [])
      console.log(skuForm)
      // 发请求
      try {
        const result = await this.$API.sku.addUpdate(skuForm)
        console.log(result)
        if (result.code == 200) {
          this.$message.success('保存sku成功')
          this.$emit('update:visible', false)
        } else {
          this.$message.error('保存sku失败')
        }
      } catch (error) {
        this.$message.error('请求保存sku失败')
      }
    },

    // 重置数据
    resetData() {
      Object.assign(this._data, this.$options.data())
    },

    // 取消
    cancel() {
      this.$emit('update:visible', false)
      this.resetData()
    }
  }
}
</script>

<style></style>
