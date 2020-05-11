<template>
  <div class="main">
    <el-button type="primary" @click="addScenes">新增场景</el-button>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column label="序号" align="center" prop="id" width="100" />
      <el-table-column align="center" label="场景缩略图" width="100">
        <template slot-scope="scope">
          <a :href="scope.row.fileUrl" target="_blank">
            <img :src="scope.row.fileUrl" class="img">
          </a>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="fileName" label="场景名称" />
      <el-table-column align="center" prop="fileDescription" label="描述" />
      <el-table-column align="center" prop="createDate" label="创建时间" />
      <el-table-column align="center" label="操作">
        >
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="pagination"
      background
      :current-page="pageNo"
      :page-sizes="[10, 20, 40, 100]"
      :page-size="10"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <!-- dialog -->
    <el-dialog title="新增场景" :visible.sync="dialogFormVisible" @closed="diaClose">
      <el-form ref="upForm" :model="form">
        <el-form-item
          label="场景名称"
          :label-width="formLabelWidth"
          placeholder="请输入场景名称"
          prop="fileName"
          :rules="[{
            required: true, message: '场景名称不能为空', trigger: 'blur'
          }]"
        >
          <el-input v-model="form.fileName" autocomplete="off" />
        </el-form-item>
        <el-form-item
          label="场景描述"
          prop="fileDescription"
          :rules="[{
            required: true, message: '场景描述不能为空', trigger: 'blur'
          }]"
          :label-width="formLabelWidth"
        >
          <el-input v-model="form.fileDescription" type="textarea" placeholder="请输入场景描述" />
        </el-form-item>
        <el-form-item
          label="场景图"
          prop="fileUrl"
          :rules="[{
            required: true, message: '场景图不能为空', trigger: 'blur'
          }]"
          :label-width="formLabelWidth"
        >
          <el-upload
            class="avatar-uploader"
            :action="upload_qiniu_url"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :on-error="handleError"
            :before-upload="beforeAvatarUpload"
            :data="qiniuData"
          >
            <img v-if="form.fileUrl" :src="form.fileUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import request from '@/utils/request'
export default {
  data() {
    return {
      tableData: [],
      total: 0,
      inputVal: '',
      pageSize: 10,
      pageNo: 1,
      dialogFormVisible: false,
      formLabelWidth: '120px',
      form: {
        fileDescription: '',
        fileName: '',
        fileUrl: ''
      },
      qiniuData: {
        key: '',
        token: ''
      },
      // 七牛云上传储存区域的上传域名（华东、华北、华南、北美、东南亚）
      upload_qiniu_url: 'http://upload.qiniup.com',
      // 七牛云返回储存图片的子域名
      upload_qiniu_addr: 'http://cdn.zuitiankeji.com/',
      imageUrl: ''
    }
  },
  mounted() {
    this.getQiniuToken()
    this.getList()
  },
  methods: {
    getList() {
      request({
        url: '/sourceFile/list',
        method: 'get',
        params: {
          pageNo: this.pageNo,
          pageSize: this.pageSize,
          type: 0
        }
      }).then(res => {
        this.total = res.count
        this.tableData = res.data
        console.log(res.data)
      })
    },
    addScenes() {
      this.dialogFormVisible = true
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.pageSize = val
      this.pageNo = 1
      this.getList()
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.pageNo = val
      this.getList()
    },
    handleEdit(index, row) {
      console.log(index, row)
      this.form = row
      this.dialogFormVisible = true
    },
    delList(id, index) {
      this.$message({
        type: 'success',
        message: '删除成功!'
      })
      this.getList()
    },
    handleDelete(index, row) {
      console.log(index, row)
      this.$confirm('此操作将永久删除该场景, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.delList(row.id, index)
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePictureCardPreview(file) {
      this.form.img = file.url
      console.log(this.form)
    },
    upload(response, file, fileList) {
      console.log(response, file, fileList)
    },
    diaClose() {
      this.imgList = []
    },
    // 保存素材
    saveSourceFile() {
      request({
        url: '/sourceFile/save',
        method: 'post',
        data: this.form
      }).then(res => {
        console.log(res)
        this.getList()
        this.dialogFormVisible = false
        this.$message({
          message: res.message,
          type: 'success'
        })
      })
    },
    // 保存
    submit() {
      console.log(this.form)
      this.$refs['upForm'].validate((valid) => {
        if (valid) {
          console.log(this.form)
          this.saveSourceFile()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getQiniuToken() {
      request({
        url: '/file/getToken',
        method: 'get'
      }).then(res => {
        this.qiniuData.token = res.data.token
        console.log(res.data.token)
      })
    },
    beforeAvatarUpload: function(file) {
      this.qiniuData.key = file.name
    //   const isJPG = file.type === "image/jpeg";
    //   const isPNG = file.type === "image/png";
    //   const isLt2M = file.size / 1024 / 1024 < 2;
    //   if (!isJPG && !isPNG) {
    //     this.$message.error("图片只能是 JPG/PNG 格式!");
    //     return false;
    //   }
    //   if (!isLt2M) {
    //     this.$message.error("图片大小不能超过 2MB!");
    //     return false;
    //   }
    },
    handleAvatarSuccess: function(res, file) {
      this.form.fileUrl = this.upload_qiniu_addr + res.key
      console.log(this.form.fileUrl)
    },
    handleError: function(res) {
      this.$message({
        message: '上传失败',
        duration: 2000,
        type: 'warning'
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.main {
  padding: 30px;
  .input {
    width: 200px;
    margin-right: 20px;
    margin-bottom: 20px;
  }
  .img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }
  .pagination {
    float: right;
    margin: 30px;
  }
//   图片上传
.avatar-uploader .el-upload {
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
    border: 1px dashed #d9d9d9;
  }
  .avatar {
    width: 178px;
    // height: 178px;
    display: block;
  }
}
</style>
