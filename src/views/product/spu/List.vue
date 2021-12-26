<template>
  <div>
    <el-card>
      <CategorySelect
        @changeCategory="changeCategory"
        :isShowList="isShowList"
      ></CategorySelect>
    </el-card>

    <el-card style="margin-top: 20px">
      <!-- 列表页 -->
      <div v-show="!isShowSpuForm && !isShowSkuForm">
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="showAddSpuForm"
          :disabled="!category3Id"
          >添加SPU</el-button
        >

        <el-table :data="spuList" border style="width: 100%; margin: 20px 0">
          <el-table-column type="index" align="center" label="序号" width="80">
          </el-table-column>

          <el-table-column prop="spuName" label="SPU名称" width="width">
          </el-table-column>

          <el-table-column prop="description" label="SPU描述" width="width">
          </el-table-column>

          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row }">
              <HintButton
                type="success"
                size="mini"
                icon="el-icon-plus"
                title="添加SKU"
                @click="showAddSkuForm(row)"
              ></HintButton>

              <HintButton
                type="warning"
                size="mini"
                icon="el-icon-edit"
                title="修改SPU"
                @click="showUpdateSpuForm(row)"
              ></HintButton>

              <HintButton
                type="info"
                size="mini"
                icon="el-icon-info"
                title="查看SPU的SKU列表"
                @click="showDialog(row)"
              ></HintButton>
              <el-popconfirm
                title="这是一段内容确定删除吗？"
                @onConfirm="deleteSpu(row)"
              >
                <HintButton
                  slot="reference"
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                  title="删除SPU"
                ></HintButton>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>

        <el-pagination
          :background="true"
          @size-change="handleSizeChange"
          @current-change="getSpuList"
          :current-page="page"
          :page-sizes="[2, 4, 6]"
          :page-size="limit"
          :total="total"
          :pager-count="7"
          layout=" prev, pager, next, jumper, ->, sizes, total"
          style="text-align: center"
        >
        </el-pagination>
      </div>

      <!-- 添加或修改spu界面 -->
      <SpuForm
        ref="spu"
        v-show="isShowSpuForm"
        :visible.sync="isShowSpuForm"
        @backSuccess="backSuccess"
      ></SpuForm>

      <!-- 添加sku界面 -->
      <SkuForm
        ref="sku"
        v-show="isShowSkuForm"
        :visible.sync="isShowSkuForm"
      ></SkuForm>
    </el-card>

    <el-dialog
      :title="`${spu.spuName}的sku列表`"
      :visible.sync="dialogTableVisible"
      :before-close="handlerClose"
    >
      <el-table :data="skuList" v-loading="loading">
        <el-table-column property="skuName" label="名称"></el-table-column>
        <el-table-column property="price" label="价格"></el-table-column>
        <el-table-column property="weight" label="重量"></el-table-column>
        <el-table-column property="name" label="默认图片">
          <template slot-scope="{ row }">
            <img :src="row.skuDefaultImg" style="width:100px;height:80px;" />
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import SkuForm from './components/SkuForm'
import SpuForm from './components/SpuForm'
export default {
  name: 'Spu',
  data() {
    return {
      isShowList: true,
      category1Id: '',
      category2Id: '',
      category3Id: '',
      spuList: [],

      page: 1,
      limit: 2,
      total: 0,

      isShowSpuForm: false,
      isShowSkuForm: false,

      // 查看spu需要用到的数据
      dialogTableVisible: false,
      spu: '',
      skuList: [],
      loading: false
    }
  },
  watch: {
    isShowSpuForm: {
      handler(newVal) {
        this.isShowList = !newVal
      }
    },

    isShowSkuForm(newVal) {
      this.isShowList = !newVal
    }
  },
  methods: {
    changeCategory({ categoryId, level }) {
      if (level === 1) {
        this.category1Id = categoryId
        this.category2Id = ''
        this.category3Id = ''
        this.spuList = []
      } else if (level === 2) {
        this.category2Id = categoryId
        this.category3Id = ''
        this.spuList = []
      } else {
        this.category3Id = categoryId
        this.getSpuList()
      }
    },

    // 获取spu列表
    async getSpuList(pageNum = 1) {
      this.page = pageNum
      let { page, limit, category3Id } = this
      try {
        const result = await this.$API.spu.getList(page, limit, category3Id)
        if (result.code === 200) {
          this.total = result.data.total
          this.spuList = result.data.records
        } else {
          this.$message.error('获取spu列表失败')
        }
      } catch (error) {
        this.$message.error('请求获取spu列表失败')
      }
    },

    // 修改当前页数量
    handleSizeChange(limit) {
      this.limit = limit
      this.getSpuList()
    },

    // 点击添加Spu的按钮
    showAddSpuForm() {
      this.isShowSpuForm = true
      this.$refs.spu.getInitAddSpuFormData(this.category3Id)
    },

    // 点击修改Spu的按钮
    showUpdateSpuForm(row) {
      this.isShowSpuForm = true
      // this.flag = row.id
      this.$refs.spu.getInitUpdateSpuFormData(row, this.category3Id)
    },

    // 点击添加Sku的按钮
    showAddSkuForm(row) {
      this.isShowSkuForm = true
      // 点击添加sku按钮发请求
      this.$refs.sku.addInitSkuFormData(row, this.category1Id, this.category2Id)
    },

    // 成功返回发数据
    backSuccess(spuId) {
      // this.flag用来标识是修改还是添加
      if (spuId) {
        this.getSpuList(this.page)
      } else {
        this.getSpuList(1)
      }
      // this.flag = null
    },

    // 成功取消
    // cancelSuccess() {
    //   this.flag = null
    // },

    // 删除Spu
    async deleteSpu(row) {
      try {
        const result = await this.$API.spu.remove(row.id)
        if (result.code === 200) {
          this.$message.success('删除spu成功')
          this.getSpuList(this.spuList > 1 ? this.page : this.page - 1)
        } else {
          this.$message.error('删除spu失败')
        }
      } catch (error) {
        this.$message.error('请求删除spu失败')
      }
    },

    // 查看对应spu的sku
    async showDialog(row) {
      this.spu = row
      this.dialogTableVisible = true
      this.loading = true

      try {
        const result = await this.$API.sku.getListBySpuId(row.id)
        if (result.code === 200) {
          this.skuList = result.data
        } else {
          this.$message.error('获取sku列表失败')
        }
      } catch (error) {
        this.$message.error('请求获取sku列表失败')
      }
      this.loading = false
    },

    // dialog关闭之前
    handlerClose() {
      this.skuList = []
      this.dialogTableVisible = false
      this.loading = false
    }
  },

  components: {
    SpuForm,
    SkuForm
  }
}
</script>

<style></style>
