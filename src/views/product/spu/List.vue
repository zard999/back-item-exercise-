<template>
  <div>
    <el-card>
      <CategorySelect
        @changeCategory="changeCategory"
        :isShowList="isShowList"
      ></CategorySelect>
    </el-card>

    <el-card style="margin-top:20px">
      <!-- spu列表页 -->
      <div v-show="!isShowSpuForm && !isShowSkuForm">
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!category3Id"
          @click="showAddSpu"
          >添加SPU</el-button
        >

        <el-table :data="spuList" style="width: 100%; margin: 20px 0">
          <el-table-column align="center" label="序号" width="80" type="index">
          </el-table-column>

          <el-table-column prop="spuName" label="SPU名称" width="width">
          </el-table-column>

          <el-table-column prop="description" label="SPU描述" width="width">
          </el-table-column>

          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <HintButton
                type="success"
                icon="el-icon-plus"
                size="mini"
                title="添加SKU"
              ></HintButton>
              <HintButton
                type="warning"
                icon="el-icon-edit"
                size="mini"
                title="修改SPU"
                @click="showUpdateSpu(row)"
              ></HintButton>
              <HintButton
                type="info"
                icon="el-icon-info"
                size="mini"
                title="查看SPU的SKU列表"
              ></HintButton>
              <el-popconfirm
                :title="`你确定删除${row.spuName}}吗？`"
                @onConfirm="deleteSpu(row)"
              >
                <HintButton
                  slot="reference"
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  title="删除SPU"
                ></HintButton>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>

        <!-- @size-change="handleSizeChange"
        @current-change="handleCurrentChange" -->
        <el-pagination
          @current-change="getSpuList"
          @size-change="handleSizeChange"
          :current-page="page"
          :page-sizes="[2, 4, 6]"
          :page-size="limit"
          layout="prev, pager, next, jumper, ->, sizes ,total"
          :total="total"
          style="text-align: center"
        >
        </el-pagination>
      </div>

      <!-- 这个是添加和修改spu的页面 -->
      <SpuForm
        ref="spu"
        v-show="isShowSpuForm"
        :visibly.sync="isShowSpuForm"
        @backSuccess="backSuccess"
        @cancelSuccess="cancelSuccess"
      ></SpuForm>

      <!-- 这个是添加sku的页面 -->
      <SkuForm v-show="isShowSkuForm"></SkuForm>
    </el-card>
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

      total: 0,
      page: 1,
      limit: 2,

      isShowSpuForm: false,
      isShowSkuForm: false
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

    // 获取spu列表数据
    async getSpuList(page = 1) {
      this.page = page
      try {
        const result = await this.$API.spu.getPageList(
          this.page,
          this.limit,
          this.category3Id
        )
        if (result.code === 20000 || result.code === 200) {
          this.spuList = result.data.records
          this.total = result.data.total
        } else {
          this.$message.error('获取Spu列表失败')
        }
      } catch (error) {
        this.$message.error('请求获取Spu列表失败')
      }
    },

    // 改变当前页数量
    handleSizeChange(limit) {
      this.limit = limit
      this.getSpuList()
    },

    // 展示更新spu页面
    showUpdateSpu(row) {
      this.$refs.spu.updateSpuListDate(row.id, this.category3Id)
      this.flag = row.id
      this.isShowSpuForm = true
    },

    showAddSpu() {
      this.isShowSpuForm = true
      this.$refs.spu.addSpuListData(this.category3Id)
    },

    // 返回成功更新数据
    backSuccess() {
      if (this.flag) {
        this.getSpuList(this.page)
      } else {
        this.getSpuList()
      }
      this.flag = null
    },

    // 取消让flag为null
    cancelSuccess() {
      this.flag = null
    },

    // 删除spu
    async deleteSpu(row) {
      try {
        const result = await this.$API.spu.remove(row.id)
        if (result.code === 200) {
          this.$message.success('删除spu成功')
          this.getSpuList(this.spuList.length ? this.page : this.page - 1)
        } else {
          this.$message.error('删除spu失败')
        }
      } catch (error) {
        this.$message.error('请求删除spu失败')
      }
    }
  },

  components: {
    SkuForm,
    SpuForm
  }
}
</script>

<style></style>
