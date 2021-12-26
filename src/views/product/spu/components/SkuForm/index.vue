<template>
  <div>
    <el-form label-width="100px">
      <el-form-item label="SPU名称"> </el-form-item>

      <el-form-item label="SKU名称">
        <el-input placeholder="SKU名称"></el-input>
      </el-form-item>

      <el-form-item label="价格(元)">
        <el-input placeholder="价格(元)"></el-input>
      </el-form-item>

      <el-form-item label="重量(千克)">
        <el-input placeholder="重量(千克)"></el-input>
      </el-form-item>

      <el-form-item label="规格描述">
        <el-input type="textarea" placeholder="规格描述" rows="4"></el-input>
      </el-form-item>

      <el-form-item label="平台属性">
        <el-form :inline="true" label-width="100px">
          <el-form-item
            :label="attr.attrName"
            v-for="attr in attrList"
            :key="attr.id"
          >
            <el-select value="" placeholder="请选择">
              <el-option
                :label="attrValue.valueName"
                :value="attrValue.id"
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
            <el-select value="" placeholder="请选择">
              <el-option
                :label="saleAttrValue.saleAttrValueName"
                :value="saleAttrValue.id"
                v-for="saleAttrValue in saleAttr.spuSaleAttrValueList"
                :key="saleAttrValue.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>

      <el-form-item label="图片列表">
        <!-- @selection-change="handleSelectionChange" -->
        <el-table
          :data="spuImageList"
          border
          ref="multipleTable"
          tooltip-effect="dark"
          style="width: 100%"
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
              <el-button type="primary">设为默认</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>

      <el-form-item>
        <el-button type="primary">保存</el-button>
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
      spuImageList: []
    }
  },
  methods: {
    // 收集sku图片列表的回调
    handleSelectionChange(val) {
      this.multipleSelection = val
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
      console.log(result)
      this.spuSaleAttrList = result[0].data
      this.attrList = result[1].data
      this.spuImageList = result[2].data
    },

    // 取消
    cancel() {
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style></style>
