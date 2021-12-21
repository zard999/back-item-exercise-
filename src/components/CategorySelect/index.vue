<template>
  <div>
    <el-form :inline="true" class="demo-form-inline" :model="cForm">
      <el-form-item label="一级分类">
        <!-- select 的 change 会把选中的id传给回调函数 -->
        <el-select
          v-model="cForm.category1Id"
          placeholder="请选择"
          @change="handleCategory1"
          :disabled="!isShowList"
        >
          <el-option
            :label="c1.name"
            :value="c1.id"
            v-for="c1 in category1List"
            :key="c1.id"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="二级分类">
        <el-select
          v-model="cForm.category2Id"
          placeholder="请选择"
          @change="handleCategory2"
          :disabled="!isShowList"
        >
          <el-option
            :label="c2.name"
            :value="c2.id"
            v-for="c2 in category2List"
            :key="c2.id"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="三级分类">
        <el-select
          v-model="cForm.category3Id"
          placeholder="请选择"
          @change="handleCategory3"
          :disabled="!isShowList"
        >
          <el-option
            :label="c3.name"
            :value="c3.id"
            v-for="c3 in category3List"
            :key="c3.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'CategorySelect',
  props: ['isShowList'],
  data() {
    return {
      category1List: [],
      category2List: [],
      category3List: [],
      cForm: {
        category1Id: '',
        category2Id: '',
        category3Id: ''
      }
    }
  },
  mounted() {
    this.getCategory1List()
  },

  methods: {
    // 获取一级分类列表
    async getCategory1List() {
      try {
        const result = await this.$API.category.getCategory1()
        if (result.code === 20000 || result.code === 200) {
          this.category1List = result.data
        } else {
          this.$message.error('获取一级列表失败')
        }
      } catch (error) {
        this.$message.error('请求获取一级列表失败')
      }
    },

    // 获取二级分类列表
    async handleCategory1(category1Id) {
      // 先干掉二三级列表
      this.category2List = []
      this.category3List = []
      this.cForm.category2Id = ''
      this.cForm.category3Id = ''

      // 传递1级id
      this.$emit('changeCategory', { categoryId: category1Id, level: 1 })

      try {
        const result = await this.$API.category.getCategory2(category1Id)
        if (result.code === 20000 || result.code === 200) {
          this.category2List = result.data
        } else {
          this.$message.error('获取二级列表失败')
        }
      } catch (error) {
        this.$message.error('请求获取二级列表失败')
      }
    },

    // 获取三级分类列表
    async handleCategory2(category2Id) {
      // 先把三级干掉
      this.category3List = []
      this.cForm.category3Id = ''

      // 传递2级id
      this.$emit('changeCategory', { categoryId: category2Id, level: 2 })

      try {
        const result = await this.$API.category.getCategory3(category2Id)
        if (result.code === 20000 || result.code === 200) {
          this.category3List = result.data
        } else {
          this.$message.error('获取三级列表失败')
        }
      } catch (error) {
        this.$message.error('请求获取三级列表失败')
      }
    },

    handleCategory3(category3Id) {
      // 传递3级id
      this.$emit('changeCategory', { categoryId: category3Id, level: 3 })
    }
  }
}
</script>

<style></style>
