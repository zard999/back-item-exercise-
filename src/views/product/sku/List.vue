<template>
  <el-card class="sku-list">
    <el-table v-loading="loading" :data="skuList" border style="width: 100%">
      <el-table-column type="index" align="center" label="序号" width="80">
      </el-table-column>

      <el-table-column prop="skuName" label="名称" width="width">
      </el-table-column>

      <el-table-column prop="skuDesc" label="描述" width="width">
      </el-table-column>

      <el-table-column align="center" label="默认图片" width="150">
        <template slot-scope="{ row }">
          <img :src="row.skuDefaultImg" style="width:100px;height:100px" />
        </template>
      </el-table-column>

      <el-table-column prop="weight" label="重量(KG)" width="width">
      </el-table-column>

      <el-table-column prop="price" label="价格(元)" width="80">
      </el-table-column>

      <el-table-column prop="prop" align="center" label="操作" width="250">
        <template slot-scope="{ row }">
          <HintButton
            v-if="row.isSale === 1"
            type="success"
            size="mini"
            icon="el-icon-bottom"
            title="下架"
            @click="cancelSale(row)"
          ></HintButton>
          <HintButton
            v-else
            type="info"
            size="mini"
            icon="el-icon-top"
            title="上架"
            @click="onSale(row)"
          ></HintButton>
          <HintButton
            type="primary"
            size="mini"
            icon="el-icon-edit"
            title="修改"
            @click="$message.info('正在开发中')"
          ></HintButton>
          <HintButton
            type="info"
            size="mini"
            icon="el-icon-info"
            title="查看详情"
            @click="showDrawer(row)"
          ></HintButton>
          <el-popconfirm
            title="这是一段内容确定删除吗？"
            @onConfirm="remove(row)"
          >
            <HintButton
              slot="reference"
              type="danger"
              size="mini"
              icon="el-icon-delete"
              title="删除"
            ></HintButton>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <!-- @size-change="handleSizeChange"
        @current-change="handleCurrentChange" -->
    <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="getSkuList"
      :current-page="page"
      :page-sizes="[5, 10, 20, 30, 40, 50]"
      :page-size="limit"
      layout="prev, pager, next, jumper, ->, sizes, total"
      :total="total"
      style="text-align:center"
    >
    </el-pagination>

    <el-drawer :visible.sync="drawer" :with-header="false" size="50%">
      <el-row>
        <el-col :span="5">名称</el-col>
        <el-col :span="16">{{ skuInfo.skuName }}</el-col>
      </el-row>

      <el-row>
        <el-col :span="5">描述</el-col>
        <el-col :span="16">{{ skuInfo.skuDesc }}</el-col>
      </el-row>

      <el-row>
        <el-col :span="5">价格</el-col>
        <el-col :span="16">{{ skuInfo.price }} 元 </el-col>
      </el-row>

      <el-row>
        <el-col :span="5">平台属性</el-col>
        <el-col :span="16">
          <el-tag
            type="success"
            style="margin-right: 5px"
            v-for="value in skuInfo.skuAttrValueList"
            :key="value.id"
          >
            {{ value.attrId + '-' + value.valueId }}
          </el-tag>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="5">商品图片</el-col>
        <el-col :span="16">
          <el-carousel class="sku-carousel" trigger="click" height="400px">
            <el-carousel-item
              v-for="item in skuInfo.skuImageList"
              :key="item.id"
            >
              <img :src="item.imgUrl" alt=" " />
            </el-carousel-item>
          </el-carousel>
        </el-col>
      </el-row>
    </el-drawer>
  </el-card>
</template>

<script>
export default {
  name: 'Sku',
  data() {
    return {
      page: 1,
      limit: 10,
      total: 0,
      skuInfo: {},
      skuList: [],
      loading: false,
      drawer: false
    }
  },
  mounted() {
    this.getSkuList()
  },
  methods: {
    // 获取sku分页列表
    async getSkuList(page = 1) {
      this.page = page
      this.loading = true
      // http://localhost:9529/dev-api/admin/product/list/1/10
      try {
        const result = await this.$API.sku.getList(this.page, this.limit)
        if (result.code === 200) {
          this.skuList = result.data.records
          this.total = result.data.total
        } else {
          this.$message.error('获取spu分页列表失败')
        }
      } catch (error) {
        this.$message.error('请求获取spu分页列表失败')
      }
      this.loading = false
    },

    // 改变每页sku数量
    handleSizeChange(limit) {
      this.limit = limit
      this.getSkuList()
    },

    // 下架
    async cancelSale(row) {
      try {
        const result = await this.$API.sku.cancelSale(row.id)
        if (result.code === 200) {
          this.$message.success('下架成功')
          this.getSkuList()
        } else {
          this.$message.error('下架失败')
        }
      } catch (error) {
        this.$message.error('请求下架失败')
      }
    },

    // 上架
    async onSale(row) {
      try {
        const result = await this.$API.sku.onSale(row.id)
        if (result.code === 200) {
          this.$message.success('上架成功')
          this.getSkuList()
        } else {
          this.$message.error('上架失败')
        }
      } catch (error) {
        this.$message.error('请求上架失败')
      }
    },

    // 展示抽屉
    async showDrawer(row) {
      this.drawer = true
      try {
        const result = await this.$API.sku.get(row.id)
        if (result.code === 200) {
          this.skuInfo = result.data
        } else {
          this.$message.error('获取sku失败')
        }
      } catch (error) {
        this.$message.error('请求获取sku失败')
      }
    },

    // 删除sku
    async remove(row) {
      try {
        const result = await this.$API.sku.remove(row.id)
        if (result.code === 200) {
          this.$message.success('删除sku成功')
          this.getSkuList(this.skuList.length > 1 ? this.page : this.page - 1)
        } else {
          this.$message.error('删除sku失败')
        }
      } catch (error) {
        this.$message.error('请求删除sku失败')
      }
    }
  }
}
</script>

<style lang="scss">
// .sku-list {
//   .el-carousel__indicator {
//     button {
//       display: inline-block;
//       width: 40px;
//       height: 40px;
//       border-radius: 50%;
//       background-color: hotpink;
//     }
//     &.is-active {
//       button {
//         background-color: pink;
//       }
//     }
//   }
// }
</style>

<style lang="scss" scoped>
.sku-list {
  .el-row {
    height: 40px;
    .el-col {
      line-height: 40px;
      &.el-col-5 {
        font-size: 18px;
        font-weight: bold;
        text-align: right;
        margin-right: 20px;
      }
    }
  }

  .sku-carousel {
    width: 400px;
    border: 1px solid #999;
    img {
      width: 400px;
      height: 400px;
    }

    ::v-deep .el-carousel__indicator {
      button {
        display: inline-block;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background-color: hotpink;
      }
      &.is-active {
        button {
          background-color: pink;
        }
      }
    }
  }
}
</style>
