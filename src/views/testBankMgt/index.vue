<template>
  <div class="main">
    <el-button type="primary" @click="addScenes">新增题目</el-button>
    <el-input
      v-model.trim="inputVal"
      class="input"
      placeholder="关键词搜索"
      clearable
    />
    <el-button type="primary" @click="search">确定</el-button>
    <el-table
      :data="tableData"
      style="width: 100%"
    >
      <el-table-column
        label="题目标题"
        prop="name"
        width="300"
      />
      <el-table-column
        label="答案"
      >
        <template slot-scope="scope">
          <div v-for="(item,index) in scope.row.list" :key="index" class="left">{{ item.name }}</div>
        </template>
      </el-table-column>
      <el-table-column
        label="正确答案"
      >
        <template slot-scope="scope">
          <span v-for="item in scope.row.list">
            <span v-if="item.isTrue">{{ item.name }}</span>
          </span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
      >>
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row)"
          >编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
          >删除</el-button>
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
    <el-dialog title="新增题目" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="题目标题" :label-width="formLabelWidth">
          <el-input v-model="form.name" placeholder="请输入题目" class="diaInputWidth" />
        </el-form-item>
        <el-form-item label="答案选项" :label-width="formLabelWidth">
          <el-button @click="addOptions">新增选项</el-button>
        </el-form-item>
        <el-form-item v-for="(item,index) in list" :key="index" label="选项" :label-width="formLabelWidth">
          <el-input v-model="item.name" placeholder="请输入答案选项" class="diaInputWidth" />
          <el-button @click="delOptions(index)">删除</el-button>
          <el-checkbox v-model="item.isTrue" class="scal" @change="c" />
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
        name: ''
      },
      dialogVisible1: false,
      list: [{ name: '', isTrue: false }, { name: '', isTrue: false }, { name: '', isTrue: false }, { name: '', isTrue: false }],
      id: ''
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    c(e) {
      console.log(e)
    },
    getList() {
      request({
        url: '/question/list',
        method: 'get',
        params: {
          pageNo: this.pageNo,
          pageSize: this.pageSize,
          name: this.inputVal
        }
      }).then((res) => {
        console.log(res)
        this.tableData = res.data
        this.total = res.count
      })
    },
    search() {
      this.pageNo = 1
      this.getList()
    },
    addScenes() {
      this.list = [{ name: '', isTrue: false }, { name: '', isTrue: false }, { name: '', isTrue: false }, { name: '', isTrue: false }]
      this.form.name = ''
      this.dialogFormVisible = true
      this.id = ''
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
      this.form.name = row.name
      const tmpList = [...row.list]
      this.id = row.id
      tmpList.forEach((item) => {
        item.isTrue = !!item.isTrue
      })
      this.list = tmpList
      this.dialogFormVisible = true
    },
    delListItem(ids) {
      request({
        url: '/question/delete',
        method: 'post',
        data: {
          ids
        }
      }).then((res) => {
        this.getList()
        this.$message({
          type: 'success',
          message: res.message
        })
      })
    },
    handleDelete(index, row) {
      console.log(index, row)
      this.$confirm('此操作将永久删除该场景, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.delListItem(row.id + '')
      }).catch(() => {
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
      this.dialogVisible1 = true
    },
    upload(response, file, fileList) {
      console.log(response, file, fileList)
    },
    // 保存
    submit() {
      let selct = false
      console.log(this.list)
      this.list.forEach((item) => {
        if (item.isTrue) {
          selct = true
        }
      })
      if (!selct) {
        this.$message({
          message: '最少选择一个正确答案',
          type: 'warning'
        })
        return
      }
      if (this.list.length > 0) {
        console.log(this.list)
        const temp = [...this.list]
        temp.forEach((item) => {
          if (item.isTrue) {
            item.isTrue = 1
          } else {
            item.isTrue = 0
          }
        })
        const data = {
          list: temp,
          name: this.form.name
        }
        if (this.id != '') {
          data.id = this.id
        }
        request({
          url: '/question/save',
          method: 'post',
          data
        }).then((res) => {
          this.dialogFormVisible = false
          console.log(res)
          this.list = [{ name: '', isTrue: false }, { name: '', isTrue: false }, { name: '', isTrue: false }, { name: '', isTrue: false }]
          this.form.name = ''
          this.getList()
          this.$message({
            type: 'success',
            message: res.message
          })
        })
      } else {
        console.log(this.list)
      }
    },
    // 新增选项
    addOptions() {
      const obj = { name: '', isTrue: 0 }
      this.list.push(obj)
    },
    // 删除选项
    delOptions(index) {
      this.list.splice(index, 1)
    }
  }
}
</script>
<style lang="scss" scoped>
// >>> .el-checkbox__inner{
//     width:36px;
//     height: 36px;
// }
     .main{
        padding:30px;
        .input{
            width:200px;
            margin: 0 20px;
            margin-bottom:20px;
        }
        .img{
            width:40px;
            height: 40px;
            border-radius: 50%;
        }
        .pagination{
            float:right;
            margin:30px;
        }
        .diaInputWidth{
            width:360px;
        }
        .scal{
            margin-left:10px;
            transform: scale(2);
        }
        // .left{
        //     text-align: center;
        // }
    }
</style>
