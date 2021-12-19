<template>
  <div>
    <el-button type="primary" icon="el-icon-plus" @click="showAddDialog"
      >添加</el-button
    >

    <el-table :data="trademarkList" border style="width: 100%; margin:20px 0;">
      <el-table-column label="序号" type="index" width="80" align="center">
      </el-table-column>

      <el-table-column prop="tmName" label="品牌名称" width="width">
      </el-table-column>

      <el-table-column prop="logoUrl" label="品牌LOGO" width="width">
        <template slot-scope="{ row }">
          <img :src="row.logoUrl" style="width:80px; height:60px;" />
        </template>
      </el-table-column>

      <el-table-column prop="prop" label="操作" width="width">
        <template slot-scope="{ row }">
          <el-button
            type="warning"
            icon="el-icon-edit"
            size="mini"
            @click="showUpdateDialog(row)"
            >修改</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="deleteTrademark(row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页器 -->
    <el-pagination
      @current-change="getTrademarkList"
      @size-change="handleSizeChange"
      style="text-align: center;"
      layout="prev, pager, next, jumper,->,sizes, total"
      :page-sizes="[3, 5, 10]"
      :pager-count="5"
      :current-page="page"
      :page-size="limit"
      :total="total"
    >
    </el-pagination>

    <!-- 添加或修改品牌属性 -->
    <el-dialog
      :title="attrForm.id ? '修改品牌' : '添加品牌'"
      :visible.sync="dialogFormVisible"
    >
      <!-- 做表单验证必须写model -->
      <el-form
        style="width:80%"
        :model="attrForm"
        :rules="rules"
        ref="formName"
      >
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input autocomplete="off" v-model="attrForm.tmName"></el-input>
        </el-form-item>

        <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
          <!-- action：代表图片上传的接口地址 show-file-list：false只能上传一张 -->
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img
              v-if="attrForm.logoUrl"
              :src="attrForm.logoUrl"
              class="avatar"
            />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div class="el-upload__tip" slot="tip">
              只能上传jpg文件，且不超过2M
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateTrademark"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Trademark',
  data() {
    // 自定义校验规则
    var validateTmName = (rule, value, callback) => {
      if (value.length < 2 || value.length > 10) {
        callback(new Error('长度在 2 到 10 个字符'))
      } else {
        callback()
      }
    }
    return {
      page: 1,
      limit: 3,
      trademarkList: [],
      total: 0,
      dialogFormVisible: false,
      attrForm: {
        logoUrl: '',
        tmName: ''
      },
      rules: {
        tmName: [
          { required: true, message: '请输入品牌名称', trigger: 'blur' },
          { validator: validateTmName, trigger: 'change' }
        ],
        logoUrl: [{ required: true, message: '请上传图片', trigger: 'change' }]
      }
    }
  },
  mounted() {
    this.getTrademarkList()
  },

  methods: {
    // 获取品牌数据
    async getTrademarkList(page = 1) {
      this.page = page
      try {
        const result = await this.$API.trademark.getPageList(
          this.page,
          this.limit
        )
        console.log(result)
        if (result.code === 20000 || result.code === 200) {
          this.total = result.data.total
          this.trademarkList = result.data.records || []
        } else {
          alert('获取列表失败')
        }
      } catch (error) {
        alert('请求列表失败')
      }
    },

    // 分页器点击修改每页显示数量
    handleSizeChange(limit) {
      this.limit = limit
      this.getTrademarkList()
    },

    // 拷贝的upload组件内函数
    // 收集上传的图片网络链接
    handleAvatarSuccess(res, file) {
      /**
       * res: 响应的数据
       * file：更详细的信息
       */
      // 这行拿的是本地的图片链接，不能要
      // this.attrForm.logoUrl = URL.createObjectURL(file.raw)
      this.attrForm.logoUrl = res.data || file.response.data
    },

    // 判断上传的图片是否满足条件
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },

    // 点击添加按钮显示dialog对话框
    showAddDialog() {
      this.dialogFormVisible = true
      // 解决添加取消之后下次添加内容还存在的问题
      this.attrForm = {
        logoUrl: '',
        tmName: ''
      }
    },

    // 点击修改按钮显示dialog对话框
    showUpdateDialog(row) {
      this.dialogFormVisible = true
      this.attrForm = { ...row }
    },

    // 点击dialog确定按钮添加或修改品牌
    async addOrUpdateTrademark() {
      // 整体校验
      this.$refs.formName.validate(async valid => {
        if (valid) {
          // 1. 获取参数数据
          // 2. 整理数据
          // 3. 发请求
          // 4. 成功和失败的回调
          let trademark = this.attrForm
          try {
            const result = await this.$API.trademark.addOrUpdate(trademark)
            if (result.code === 20000 || result.code === 200) {
              this.$message.success(
                trademark.id ? '修改品牌成功' : '添加品牌成功'
              )
              this.dialogFormVisible = false
              this.getTrademarkList(trademark.id ? this.page : 1)
            } else {
              this.$message.error(
                trademark.id ? '修改品牌失败' : '添加品牌失败'
              )
            }
          } catch (error) {
            this.$message.error(
              trademark.id ? '请求修改品牌失败' : '请求添加品牌失败'
            )
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },

    // 点击删除当前品牌
    deleteTrademark(row) {
      this.$confirm(`你确定要删除${row.tmName}吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          try {
            const result = await this.$API.trademark.remove(row.id)
            if (result.code === 20000 || result.code === 200) {
              this.$message.success('删除品牌成功')
              // 如果当前页数量只有一个，删除了自然而然就应该显示上一页
              this.getTrademarkList(
                this.trademarkList.length > 1 ? this.page : this.page - 1
              )
            } else {
              this.$message.error('删除品牌失败')
            }
          } catch (error) {
            this.$message.error('请求删除品牌失败')
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    }
  }
}
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
