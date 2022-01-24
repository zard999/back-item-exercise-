<template>
  <div>
    <el-card>
      <div slot="header" class="header">
        <div class="title">分类销售排行</div>
        <div class="radio">
          <el-radio-group v-model="radio2" size="mini">
            <el-radio-button label="品类"></el-radio-button>
            <el-radio-button label="商品"></el-radio-button>
          </el-radio-group>
        </div>
      </div>
      <div class="main">
        <v-chart autoresize :options="getOptions()"></v-chart>
      </div>
    </el-card>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'RankView',
  data() {
    return {
      radio2: '品类',
    }
  },
  methods: {
    getOptions() {
      let { allAxisXNum, namesData } = this.useData
      // let { allDatas1Num, allDatas2Num, categoryData, goodsData } = this.useData
      return {
        title: [
          {
            text: `${this.radio2}分类`,
            textStyle: {
              fontSize: 14,
            },
            left: '6%',
            top: '5%',
          },
          {
            text: '累计数量',

            subtext: allAxisXNum,
            textStyle: {
              fontSize: 14,
            },
            subtextStyle: {
              fontSize: 28,
              color: '#000',
            },
            left: '34%',
            top: '34%',
            textAlign: 'center',
          },
        ],

        tooltip: {
          trigger: 'item',
          formatter: params => {
            let { marker, name, value, percent } = params
            return `
                ${this.radio2}分类<br/>
                ${marker}名称：${name.split('|')[0]}<br/>
                ${marker}名称：${value}<br/>
                ${marker}名称：${percent}
            `
          },
        },

        // 图例相关，修改位置
        legend: {
          top: '30%',
          left: '70%',
          orient: 'vertical',
        },

        label: {
          show: true,
          // 规定图形文字显示的内容，可以使回调也可以使字符串
          formatter: params => {
            return params.name.split('|')[0]
          },
        },

        series: [
          {
            name: `${this.radio2}分类`,
            type: 'pie',
            center: ['35%', '40%'], // 圆心的坐标
            radius: ['30%', '43%'], // 内外圆的半径
            avoidLabelOverlap: false,
            label: {
              show: true,
              // position: 'center'
            },
            // emphasis: {
            //   label: {
            //     show: true,
            //     fontSize: '40',
            //     fontWeight: 'bold'
            //   }
            // },
            labelLine: {
              // 文字引导线
              show: true,
              length: 5,
              length2: 5,
            },
            data: namesData,

            /* itemStyle 图形样式
        borderColor: 描边颜色
        borderWidth: 描边线宽 */
            itemStyle: {
              borderColor: '#fff',
              borderWidth: 2,
            },
          },
        ],
      }
    },
  },

  computed: {
    ...mapState({
      saleRank: state => state.mock.echartsData.saleRank,
    }),

    useData() {
      if (this.saleRank) {
        let { axisX, data1 } =
          this.radio2 === '品类' ? this.saleRank.category : this.saleRank.goods
        // let {
        //   category: { axisX: names1, data1: datas1 },
        //   goods: { axisX: names2, data1: datas2 }
        // } = this.saleRank

        // 计算品类相关的数据
        let allAxisXNum = data1.reduce((p, c) => p + c, 0)
        let namesData = axisX.map((item, index) => {
          return {
            name:
              item +
              '|' +
              ((data1[index] * 100) / allAxisXNum).toFixed(2) +
              '%',
            value: data1[index],
          }
        })
        return {
          allAxisXNum,
          namesData,
        }
        // console.log(names1, names2, datas1, datas2)
      } else {
        return {}
      }
    },
  },
}
</script>

<style lang="scss" scoped>
::v-deep .el-card__header {
  padding: 13px 20px;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.main {
  height: 455px;
}
</style>
