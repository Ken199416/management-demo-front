<template>
  <div>
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>文件系统</el-breadcrumb-item>
      <el-breadcrumb-item>在线文档</el-breadcrumb-item>
    </el-breadcrumb>
    <el-container>
      <el-aside :width="aside + 'px'" style="margin-right: 10px">
        <div class="toggle-button" @click="toggleChange()">
          <i :class="toggleIcon"></i>
        </div>
        <el-input
          v-show="!isCollapse"
          style="margin-bottom: 5px"
          placeholder="输入文件名进行检索"
          v-model="filterText"
        >
        </el-input>
        <el-tree
          v-show="!isCollapse"
          class="filter-tree"
          node-key="id"
          :filter-node-method="filterNode"
          :data="treeData"
          :props="defaultProps"
          :highlight-current="highlightCurrent"
          :icon-class="treeClassIcon"
          @node-click="handleNodeClick"
          @node-contextmenu="rightClickHandle"
        >
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span>{{ node.label }}&nbsp;&nbsp;&nbsp;&nbsp;</span>
            <el-popover placement="right" width="20px" trigger="click" ref="popverRef">
              <el-button type="primary" size="mini">添加文件夹</el-button>
              <el-button type="primary" size="mini">添加文件</el-button>
              <el-button
                slot="reference"
                v-if="data.isNode == 0"
                type="text"
                circle
                size="mini"
                icon="el-icon-circle-plus"
                @click.stop="() => append(data)"
              >
              </el-button>
            </el-popover>
            <!-- <el-button style="" v-if='data.isShowAdd == 1'>添加文件</el-button> -->
          </span>
        </el-tree>
      </el-aside>
      <el-container>
        <el-header>
          <strong>{{ fileName }}</strong></el-header
        >
        <el-main>
          <keep-alive>
            <router-view v-if="$route.meta.keepAlive"></router-view>
          </keep-alive>
          <router-view v-if="!$route.meta.keepAlive"></router-view>
        </el-main>
      </el-container>
    </el-container>
    <el-dialog
      title="添加文件或者文件夹"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <span>这是一段信息</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      treeClassIcon: "el-icon-folder",
      addButtonContent: "&nbsp;+&nbsp;",
      fileName: "请选择一个文件",
      filterText: "",
      highlightCurrent: true,
      aside: 300,
      toggleIcon: "el-icon-d-arrow-left",
      isCollapse: false,
      dialogVisible: false,
      treeData: [
        // {
        //     id:1,
        //   label: "一级 1",
        //   children: [
        //     {id:2,
        //       label: "二级 1-1",
        //       children: [
        //         {
        //             id:3,
        //           label: "三级 1-1-1",
        //         },
        //       ],
        //     },
        //   ],
        // },
        // {
        //     id:4,
        //   label: "一级 2",
        //   children: [
        //     {id:5,
        //       label: "二级 2-1",
        //       children: [
        //         {id:6,
        //           label: "三级 2-1-1",
        //         },
        //       ],
        //     },
        //     {
        //         id:7,
        //       label: "二级 2-2",
        //       children: [
        //         {id:8,
        //           label: "三级 2-2-1",
        //         },
        //       ],
        //     },
        //   ],
        // },
        // {id:9,
        //   label: "一级 3",
        //   children: [
        //     {id:10,
        //       label: "二级 3-1",
        //       children: [
        //         {id:11,
        //           label: "三级 3-1-1",
        //         },
        //       ],
        //     },
        //     {id:12,
        //       label: "二级 3-2",
        //       children: [
        //         {id:13,
        //           label: "三级 3-2-1",
        //         },
        //       ],
        //     },
        //   ],
        // },
      ],
      defaultProps: {
        children: "children",
        label: "fileName",
      },
    };
  },
  methods: {
    // 获取节点树
    async getFileContent() {
      const { data: response } = await this.$http.get("/fileContent/queryAll");
      this.treeData = response.data;
    },
    // 添加节点
    append(data) {
      console.log(data);
    },
    handleClose() {
      this.dialogVisible = false;
    },
    // 点击节点
    handleNodeClick(data) {
      //   console.log(data);
      this.fileName = data.fileName;
      if (data.isNode === 1) {
        this.$router.push("/folder/online/file/" + data.id);
      } else {
        this.$router.push("/folder/online/noSelect");
      }
    },
    // 右键节点
    rightClickHandle(event, file, node, component) {
      // file.isShowAdd = 1;
      // 判断节点是文件还是文件夹
      if (file.isNode == 0) {
        // this.dialogVisible = true;
              this.$refs.popverRef.doShow();

      }

      console.log(file);
    },
    // 过滤节点
    filterNode(value, data) {},
    // 展开/收缩
    toggleChange() {
      console.log(this.isCollapse);
      this.isCollapse = !this.isCollapse;
      if (this.aside == 300) {
        this.aside = 20;
        this.toggleIcon = "el-icon-d-arrow-right";
      } else {
        this.aside = 300;
        this.toggleIcon = "el-icon-d-arrow-left";
      }
    },
  },
  mounted() {
    this.getFileContent();
  },
};
</script>
<style lang="less" scoped>
.el-header {
  background-color: #e0e7f0;
  color: #333;
  text-align: center;
  line-height: 60px;
  margin-bottom: 5px;
}
.el-aside {
  height: 100%;
}
.el-main {
  background-color: #f9fbfc;
}
.toggle-button {
  //   background-color: #fdfbfa;
  color: rgb(14, 13, 13);
  font-size: 20px;
  line-height: 20px;
  text-align: center;
  letter-spacing: 0.3em;
  cursor: pointer;
  margin-bottom: 5px;
}
</style>