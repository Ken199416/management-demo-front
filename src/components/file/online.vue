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
          :icon-class="treeDirClassIcon"
          @node-click="handleNodeClick"
          @node-contextmenu="rightClick"
        >
          <span class="custom-tree-node" slot-scope="{ node,data }">
            <i v-if="data.isNode == 1" class="el-icon-document"></i>
            <span>{{ node.label }}&nbsp;&nbsp;&nbsp;&nbsp;</span>
            <!-- <el-button
              v-if="data.isNode == 0"
              type="text"
              circle
              size="mini"
              icon="el-icon-circle-plus"
              @click.stop="() => append(data)"
            ></el-button> -->
          </span>
        </el-tree>
        <div v-show="menuVisible">
          <ul id="menu" class="menu">
            <li class="menu_item" @click="addDir" >添加文件夹</li>
            <li class="menu_item" @click="addFile">添加文件</li>
            <!-- <li class="menu_item" @click="3">删除</li> -->
          </ul>
        </div>
      </el-aside>
      <el-container>
        <!-- 文件头 -->
        <el-header>
          <strong v-if="!isAllowEditFileName" @dblclick="editFileName">{{ fileForm.fileName }}</strong>
          <div v-if="isAllowEditFileName">
            <el-input style="width:85%"  v-model="fileForm.fileName"></el-input>
            <el-link style="margin-left:15px" icon="el-icon-check" type="primary" @click="updateFile"></el-link>
            <el-link style="margin-left:20px" icon="el-icon-close" type="danger" @click="isAllowEditFileName = false"></el-link>
          <!-- <el-button type="text" style="margin-left:15px" icon="el-icon-check" :loading="fileNameSaveButtonLoad"></el-button>
          <el-button type="text" style="margin-left:20px" icon="el-icon-close"></el-button> -->
          </div>

        </el-header>
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
      fileNameSaveButtonLoad:false,
      isAllowEditFileName:false,
      treeDirClassIcon: "el-icon-folder",
      treeFileClassIcon: "el-icon-document",
      addButtonContent: "&nbsp;+&nbsp;",
      filterText: "",
      highlightCurrent: true,
      aside: 300,
      toggleIcon: "el-icon-d-arrow-left",
      isCollapse: false,
      dialogVisible: false,
      menuVisible: false,
      rightMenuNodeId:"",
      fileForm:{
        id:"",
        fileName:"",
        fileContent:""
      },
      fileNodeId:"",
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
      const { data: response } = await this.$http.get("/fileContent/getTree");
      this.treeData = response.data;
    },
    getTreeClassicon(event){
      console.log(event);
    },
    editFileName(){
      console.log(this.fileForm.fileName)
      if(this.fileForm.fileName == "请选择一个文件"){
        return;
      }
      this.isAllowEditFileName = true;
    },
    async updateFile(){
        console.log(this.fileForm)
        // 发起修改文件接口
        const { data : response } = await this.$http.post("/fileContent/updateFile",this.fileForm);
        if(response.code != 200){
          this.$message.error(response.message);
        }
        this.isAllowEditFileName = false;
        window.sessionStorage.setItem("currentFileName",this.fileForm.fileName);
        // 待优化，需要去查询一下当前节点的名称，如果修改失败，让文件名和服务器保持一致
    },
    rightClick($event, file, node, component) {
      // 鼠标右击触发事件
      if(file.isNode == 1){
        return
      }
      this.rightMenuNodeId = file.id;
      this.menuVisible = false; 
      this.menuVisible = true; 
      var menu = document.querySelector("#menu");
      document.addEventListener("click", this.foo); // 给整个document添加监听鼠标事件，点击任何位置执行foo方法
      menu.style.display = "block";
      //减所少看自己情况
      menu.style.left = $event.clientX + 25 + "px";
      menu.style.top = $event.clientY - 10 + "px";
    },

    foo() {
      // 取消鼠标监听事件 菜单栏
      this.menuVisible = false;
      document.removeEventListener("click", this.foo); // 要及时关掉监听
    },
    handleClose() {
      this.dialogVisible = false;
    },
    // 点击节点
    handleNodeClick(data) {
       window.sessionStorage.setItem("currentFileid", data.id);
       window.sessionStorage.setItem("currentFileName", data.fileName);
      this.isAllowEditFileName = false;
      this.fileForm.id = data.id
      this.menuVisible = false; // 先把模态框关死，目的是 第二次或者第n次右键鼠标的时候 它默认的是true
      this.fileForm.fileName = data.fileName;
      if (data.isNode === 1) {
        this.$router.push("/folder/online/file/" + data.id);
      } else {
        this.$router.push("/folder/online/noSelect");
      }
    },
    addDir(){
      console.log("添加文件夹")
      console.log(this.rightMenuNodeId);
    },
    addFile(){
      console.log("添加文件")
      console.log(this.rightMenuNodeId);

    },
    // 右键节点
    // rightClickHandle(event, file, node, component) {
    //   // file.isShowAdd = 1;
    //   // 判断节点是文件还是文件夹
    //   if (file.isNode == 0) {
    //     // this.dialogVisible = true;
    //           this.$refs.popverRef.doShow();

    //   }

    //   console.log(file);
    // },
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
    this.fileForm.fileName = window.sessionStorage.getItem("currentFileName")
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
.menu_item {
  line-height: 20px;
  text-align: left;
  margin-top: 3px;
  padding-left: 7px;
}

.menu {
  height: 50px;
  width: 80px;
  position: absolute;
  border-radius: 3px;
  border: 1px solid #999999;
  background-color: white;
  padding-left:1px ;
  cursor:pointer
}

li:hover {
  background-color: #1790ff;
  color: white;
}
li {
  font-size: 10px;
  color: black;
}
ul {
  list-style: none;
}
</style>