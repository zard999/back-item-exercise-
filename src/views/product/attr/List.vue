<template>
  <div>
    <el-card>
      <CategorySelect
        @changeCategory="changeCategory"
        :isShowList="isShowList"
      ></CategorySelect>
    </el-card>

    <el-card style="margin-top:20px">
      <!-- 这个div代表平台属性列表 -->
      <div v-show="isShowList">
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!category3Id"
          @click="showAddDiv"
          >添加属性</el-button
        >

        <el-table :data="attrList" border style="width: 100%">
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column prop="attrName" label="属性名称" width="150">
          </el-table-column>
          <el-table-column prop="prop" label="属性值列表" width="width">
            <template slot-scope="{ row }">
              <el-tag
                type="success"
                v-for="attrValue in row.attrValueList"
                :key="attrValue.id"
                >{{ attrValue.valueName }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="150">
            <template slot-scope="{ row }">
              <HintButton
                type="warning"
                icon="el-icon-edit"
                size="mini"
                title="修改"
                @click="showUpdateDiv(row)"
              ></HintButton>
              <el-popconfirm
                :title="`你确定要删除${row.attrName}}吗？`"
                @onConfirm="deleteAttr(row)"
              >
                <HintButton
                  slot="reference"
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  title="删除"
                ></HintButton>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 这个div代表平台属性添加或者修改的页面 -->
      <div v-show="!isShowList">
        <el-form :model="attrForm" :inline="true">
          <el-form-item label="属性名">
            <el-input
              placeholder="请输入属性名"
              v-model="attrForm.attrName"
            ></el-input>
          </el-form-item>
        </el-form>

        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!attrForm.attrName"
          @click="addAttrValue"
          >添加属性值</el-button
        >
        <el-button @click="isShowList = true">取消</el-button>

        <el-table
          :data="attrForm.attrValueList"
          border
          style="width: 100%; margin:20px 0"
        >
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>

          <el-table-column prop="prop" label="属性值名称" width="width">
            <template slot-scope="{ row, $index }">
              <el-input
                :ref="$index"
                size="mini"
                v-if="row.isEdit"
                v-model="row.valueName"
                placeholder="请输入属性值名称"
                @blur="toLook(row)"
                @keyup.enter.native="toLook(row)"
              ></el-input>
              <span
                v-else
                @click="toEdit(row, $index)"
                style="display:block;width:100%"
                >{{ row.valueName }}</span
              >
            </template>
          </el-table-column>

          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <el-popconfirm
                :title="`你确定要删除${row.valueName}这个属性值吗？`"
                @onConfirm="attrForm.attrValueList.splice($index, 1)"
              >
                <HintButton
                  slot="reference"
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  title="删除"
                ></HintButton>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>

        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="isShowList = true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep'
export default {
  name: 'Attr',
  data() {
    // data里面的数据不能通过this拿，因为谁先后还不一定呢
    return {
      category1Id: '',
      category2Id: '',
      category3Id: '',
      attrList: [],
      isShowList: true,
      attrForm: {
        attrName: '',
        attrValueList: [
          // {
          //   attrId: 0,
          //   id: 0,
          //   valueName: 'string'
          // }
        ],
        categoryId: '',
        categoryLevel: 3
      }
    }
  },
  methods: {
    changeCategory({ categoryId, level }) {
      if (level === 1) {
        this.category1Id = categoryId
        this.category2Id = ''
        this.category3Id = ''
        this.attrList = []
      } else if (level === 2) {
        this.category2Id = categoryId
        this.category3Id = ''
        this.attrList = []
      } else {
        this.category3Id = categoryId
        this.attrList = []
        // 发请求
        this.getAttrList()
      }
    },

    // 根据选中的1,2,3,级id获取平台属性列表
    async getAttrList() {
      let { category1Id, category2Id, category3Id } = this
      try {
        const result = await this.$API.attr.getList(
          category1Id,
          category2Id,
          category3Id
        )
        if (result.code === 20000 || result.code === 200) {
          this.attrList = result.data
        } else {
          this.$message.error('获取平台属性列表失败')
        }
      } catch (error) {
        this.$message.error('请求获取平台属性列表失败')
      }
    },

    // 点击列表添加属性值，进入添加页面
    showAddDiv() {
      this.isShowList = false

      // 点进来清空attrForm
      // 这里可以收集，因为data早就收集完了
      this.attrForm = {
        attrName: '',
        attrValueList: [
          // {
          //   attrId: 0,
          //   id: 0,
          //   valueName: 'string'
          // }
        ],
        categoryId: this.category3Id,
        categoryLevel: 3
      }
    },

    // 点击修改按钮，还是进入添加页面
    showUpdateDiv(row) {
      this.isShowList = false

      // row里面有对象类型的数据，所以要深拷贝
      this.attrForm = cloneDeep(row)

      // 修改的时候会有一些已经存在的属性值，此时编辑和查看模式标识也得添加
      this.attrForm.attrValueList.forEach(item =>
        this.$set(item, 'isEdit', false)
      ) // item.isEdit不是响应式数据
    },

    /**
     * 手机属性值列表
     * 1. 一开始列表是空的
     * 2. 需要点击属性值的时候添加一个对象
     * 3. 让表格显示出来一个input框
     * 4. input框出来后，让用户去输入，我们通过v-mode接收到用户输入的值
     */
    addAttrValue() {
      this.attrForm.attrValueList.push({
        attrId: this.attrForm.id, // 当前属性值所在属性的id
        // 添加属性的时候，这个属性时undefined，修改属性时，这个属性是正常获取服务器的id
        valueName: '',
        isEdit: true // 这个数据是编辑模式和查看模式的标识数据
      })

      // 自动获取焦点
      this.$nextTick(() => {
        this.$refs[this.attrForm.attrValueList.length - 1].focus()
      })
    },

    // 点击span切换ipnut，从查看模式切换编辑模式
    toEdit(row, index) {
      row.isEdit = true

      // 自动获取焦点
      this.$nextTick(() => {
        this.$refs[index].focus()
      })
    },

    // input失去焦点或者回车切换span，从编辑模式切换查看模式
    toLook(row) {
      // 对用户输入的数据进行限制
      // 1. 输入的数据不能是空
      // 2. 已经存在的属性值名称不能它重复
      let valueName = row.valueName
      if (!valueName.trim()) {
        // this.$message.error('输入的属性值不能是空串')
        row.valueName = ''
        return
      }

      let isRepeat = this.attrForm.attrValueList.some(item => {
        // 除了自己以外，输入的数据是不是和其它的属性值名称重复
        if (item !== row) {
          return item.valueName === valueName
        }
      })

      if (isRepeat) {
        this.$message.info('输入的属性值不能有重复')
        row.valueName = ''
        return
      }
      row.isEdit = false
    },

    // 点击保存
    async save() {
      /**
       * 1. 获取参数数据
       * 2. 整理数据
       * 3. 发请求
       * 4. 成功干啥
       * 5. 失败干啥
       */
      // 获取参数数据
      let attr = this.attrForm

      // 整理数据
      // 1、属性值名称如果为空串，从属性值列表当中去除
      // 2、属性值当中去除isEdit属性
      attr.attrValueList = attr.attrValueList.filter(item => {
        if (item.valueName) {
          delete item.isEdit
          return true
        }
      })
      // 3、属性值列表如果没有属性值，不发请求
      if (!attr.attrValueList.length) return

      // 发请求
      try {
        const result = await this.$API.attr.arrOrUpdate(attr)
        console.log(result)
        if (result.code === 20000 || result.code === 200) {
          this.$message.success('保存属性成功')
          this.isShowList = true
          this.getAttrList()
        } else {
          this.$message.error('保存属性失败')
        }
      } catch (error) {
        this.$message.error('请求保存属性失败')
      }
    },

    // 删除属性
    async deleteAttr(row) {
      try {
        const result = await this.$API.attr.remove(row.id)
        console.log(result)
        if (result.code === 20000 || result.code === 200) {
          this.$message.success('删除属性成功')
          this.getAttrList()
        } else {
          this.$message.error('删除属性失败')
        }
      } catch (error) {
        this.$message.error('请求请求保存属性失败')
      }
    }
  }
}
</script>

<style></style>
