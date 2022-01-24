<template>
  <div>
    <el-card>
      <div slot="header">关键词搜索</div>
      <div class="content">
        <div class="main">
          <el-row :gutter="10">
            <el-col :span="18">
              <div>
                <div class="title">搜索用户数</div>
                <div class="count">
                  {{ searchData.totalSearchNum | numberFormat }}
                </div>
                <div class="view">
                  <v-chart autoresize :options="getOptions(1)"></v-chart>
                </div>
              </div>
            </el-col>
            <el-col :span="6">
              <div>
                <div class="title">搜索量</div>
                <div class="count">
                  {{ searchData.totalUserNum | numberFormat }}
                </div>
                <div class="view">
                  <v-chart autoresize :options="getOptions(2)"></v-chart>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
        <div class="table">
          <el-table :data="tableData" style="width: 100%">
            <el-table-column type="index" label="排名" width="100">
            </el-table-column>
            <el-table-column prop="word" label="关键字" width="width">
            </el-table-column>
            <el-table-column prop="count" label="搜索数量" width="width">
            </el-table-column>
            <el-table-column prop="user" label="搜索用户数" width="width">
            </el-table-column>
            <el-table-column prop="percent" label="搜索占比" width="width">
            </el-table-column>
          </el-table>

          <el-pagination
            style="text-align: center; margin: 20px 0"
            @current-change="page = $event"
            :current-page="page"
            :page-size="limit"
            layout="prev, pager, next,total"
            :total="searchWord.length"
          >
          </el-pagination>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'SearchView',
  data() {
    return {
      page: 1,
      limit: 5,
    }
  },
  methods: {
    getOptions(num) {
      let { keywords, userNums, searchNums } = this.searchData
      return {
        grid: {
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
        },
        xAxis: {
          data: keywords || [],
          show: false,
        },
        yAxis: {
          show: false,
        },
        tooltip: {
          trigger: 'axis',
        },
        series: {
          type: 'line',
          data: num === 1 ? userNums : searchNums,
          itemStyle: {
            opacity: 0,
          },
          smooth: true,
          areaStyle: {
            color: 'hotpink',
          },
        },
        color: 'skyblue',
      }
    },
  },
  computed: {
    ...mapState({
      searchWord: state => state.mock.echartsData.searchWord || [],
    }),

    searchData() {
      if (this.searchWord) {
        // x轴数据
        let keywords = this.searchWord.map(item => item.word)
        // 用户数量图形series里面的data
        let userNums = this.searchWord.map(item => item.user)
        // 搜索数量图形series里面的data
        let searchNums = this.searchWord.map(item => item.count)
        // 用户的总量
        let totalUserNum = userNums.reduce((p, c) => p + c, 0)
        // 搜索的总量
        let totalSearchNum = searchNums.reduce((p, c) => p + c, 0)

        // 想要完成表格：
        // 1、给searchWord里面每个对象需要添加一个字段
        // 2、前端自己分页计算每页数据
        this.searchWord.forEach(item => {
          item.percent = ((item.count * 100) / totalSearchNum).toFixed(2) + '%'
        })
        return {
          keywords,
          userNums,
          searchNums,
          totalUserNum,
          totalSearchNum,
        }
      } else {
        return {}
      }
    },

    // 2、前端自己分页计算每页数据
    // 计算分页数据让表格使用
    // tableData() {
    //   let { page, limit, searchWord } = this
    //   console.log(page, limit, searchWord)
    //   return searchWord.slice((page - 1) * limit, page * limit)
    // }
    tableData() {
      return this.searchWord.slice(
        (this.page - 1) * this.limit,
        this.page * this.limit
      )
    },
  },
}
</script>

<style lang="scss" scoped>
.title {
  color: #999;
  font-size: 14px;
}
.count {
  font-size: 24px;
  letter-spacing: 2px;
}
.view {
  widows: 100%;
  height: 50px;
}
</style>
