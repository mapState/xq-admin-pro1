<template>
  <div class="main">
    <el-input
      v-model.trim="inputVal"
      class="input"
      placeholder="关键词搜索"
      clearable
    />
    <el-button type="primary" class="btn" @click="search">确定</el-button>
    <span>共有{{ total }}次祝福</span>
    <el-table
      :data="tableData"
      style="width: 100%"
    >
      <el-table-column
        label="序号"
        align="center"
        prop="a"
        width="100"
      />
      <el-table-column
        align="center"
        label="用户头像"
        width="90"
      >
        <template slot-scope="scope">
          <a :href="scope.row.img" target="_blank">
            <img :src="scope.row.img" alt="头像" class="img">
          </a>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="address"
        label="用户昵称"
      />
      <el-table-column
        align="center"
        prop="address"
        label="用户姓名"
      />
      <el-table-column
        align="center"
        prop="address"
        label="用户性别"
      />
      <el-table-column
        align="center"
        prop="address"
        label="其他信息"
      />
      <el-table-column
        align="center"
        prop="address"
        label="创建时间"
      />

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
      pageNo: 1
    }
  },
  mounted() {
    // this.getList()
  },
  methods: {
    getList() {
      request({
        url: '/question/getPhotoCount',
        method: 'get',
        params: {
          pageNo: this.pageNo,
          pageSize: this.pageSize,
          messageType: 2// 云祝福
        }
      }).then((res) => {
        console.log(res)
        this.total = res.data
        // this.tableData=res.data
      })
    },
    search() {
      console.log(this.inputVal)
      if (this.inputVal === '') {
        this.$message({
          message: '关键词不能为空',
          type: 'warning'
        })
      } else {
        // this.getList()
      }
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
    }

  }
}
</script>
<style lang="scss" scoped>
     .main{
        padding:30px;
        .input{
            width:200px;
            margin-right: 20px;
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
        .btn{
            margin-right: 40px;
        }

    }
</style>
