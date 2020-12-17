<template>
  <div>
      <el-breadcrumb>
    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用例管理</el-breadcrumb-item>
      <el-breadcrumb-item>单独项目</el-breadcrumb-item>
    </el-breadcrumb>
   
  </div>

</template>
<script>
export default {
  data() {
    return {};
  },
  methods: {
    
  },
};
</script>
<style scoped>
    #echartsEle{
    width: 80%;
    height: 500px;
    border: 1px solid red;
    margin: 0 auto;
  }
</style>
