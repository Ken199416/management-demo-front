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
          :default-expanded-keys="expandedNode"
          :default-checked-keys="checkedNode"
        >
          <span class="custom-tree-node" slot-scope="{ node, data }">
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
            <li class="menu_item" @click="openAddDialog(0)">添加文件夹</li>
            <li class="menu_item" @click="openAddDialog(1)">添加文件</li>
            <!-- <li class="menu_item" @click="3">删除</li> -->
          </ul>
        </div>
      </el-aside>
      <el-container>
        <!-- 文件头 -->
        <el-header>
          <strong v-if="!isAllowEditFileName" @dblclick="editFileName">{{
            fileForm.fileName
          }}</strong>
          <div v-if="isAllowEditFileName">
            <el-input style="width: 85%" v-model="fileForm.fileName"></el-input>
            <el-link
              style="margin-left: 15px"
              icon="el-icon-check"
              type="primary"
              @click="updateFile"
            ></el-link>
            <el-link
              style="margin-left: 20px"
              icon="el-icon-close"
              type="danger"
              @click="isAllowEditFileName = false"
            ></el-link>
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
      :title="fileContentForm.isNode == 0 ? '添加文件夹' : '添加文件'"
      :visible.sync="fileDialogVisible"
      width="30%"
      :before-close="handleClose"
    >
    <div class="demo-input-suffix">
       <!-- {{ fileContentForm.isNode == 0 ? '文件夹名' : '文件名' }} : -->
      <el-input :placeholder="fileContentForm.isNode == 0 ? '文件夹名' : '文件名'" v-model="fileContentForm.fileName"></el-input>
    </div>
   
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="add"
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
      checkedNode:[],
      expandedNode:[],
      fileDialogVisible:false,
      fileContentForm:{},
      oldFileName: "",
      fileNameSaveButtonLoad: false,
      isAllowEditFileName: false,
      treeDirClassIcon: "el-icon-folder",
      treeFileClassIcon: "el-icon-document",
      addButtonContent: "&nbsp;+&nbsp;",
      filterText: "",
      highlightCurrent: true,
      aside: 300,
      toggleIcon: "el-icon-d-arrow-left",
      isCollapse: false,
      menuVisible: false,
      rightMenuNodeId: "",
      fileForm: {
        id: "",
        fileName: "",
        fileContent: "",
      },
      fileNodeId: "",
      treeData: [],
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
    getTreeClassicon(event) {
      console.log(event);
    },
    editFileName() {
      console.log(this.fileForm.fileName);
      if (this.fileForm.fileName == "请选择一个文件") {
        return;
      }
      this.isAllowEditFileName = true;
    },
    async updateFile() {
      try {
        const { data: response } = await this.$http.post(
          "/fileContent/updateFile",
          this.fileForm
        );
        if (response.code != 200) {
          this.$message.error(response.message);
          this.fileForm.fileName = this.oldFileName;
        }else{
          this.isAllowEditFileName = false;
          window.sessionStorage.setItem("currentFileName", this.fileForm.fileName);
        }
      } catch (e) {
        // this.$message.error("服务器异常，请稍后重试");
        this.fileForm.fileName = this.oldFileName;
        this.this.isAllowEditFileName = false;
      }
         },
    rightClick($event, file, node, component) {
      // 鼠标右击触发事件
      if (file.isNode == 1) {
        return;
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
      this.fileDialogVisible = false;
      // this.fileContentForm.fileName = "";
    },
    // 点击节点
    handleNodeClick(data) {
      window.sessionStorage.setItem("currentFileid", data.id);
      window.sessionStorage.setItem("currentFileName", data.fileName);
      this.isAllowEditFileName = false;
      this.fileForm.id = data.id;
      this.menuVisible = false; // 先把模态框关死，目的是 第二次或者第n次右键鼠标的时候 它默认的是true
      this.fileForm.fileName = data.fileName;
      this.oldFileName = data.fileName;
      if (data.isNode === 1) {
        this.$router.push("/folder/online/file/" + data.id);
      } else {
        this.$router.push("/folder/online/noSelect");
      }
    },
    openAddDialog(isNode){
        // 文件夹
        this.fileContentForm.isNode = isNode;
        this.fileDialogVisible = true;
    },
    // 添加文件夹或者文件
    async add() {
      this.fileContentForm.parentId = this.rightMenuNodeId;
      console.log(this.fileContentForm);
      const { data: response} = await this.$http.post("/fileContent/add",this.fileContentForm);
      this.handleClose();
      if(response.code == 200){
        if(response.data.isNode == 1){
          this.$router.push('/folder/online/file/' + response.data.id);
        }else{
          this.$router.push('/folder/online/noSelect');
        }
        this.treeData = response.tree;
        this.fileForm.fileName = response.data.fileName;
        this.expandedNode.push(response.data.parentId);
        this.checkedNode.push(response.data.id);
      }
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
    this.fileForm.fileName = window.sessionStorage.getItem("currentFileName");
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
  padding-left: 1px;
  cursor: pointer;
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