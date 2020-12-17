<template>
  <div class="login_container">
    <div class="login_title">{{ title }}</div>
    <div class="login_box">
      <div class="avatar_box">
        <img src="../assets/img/heifengli.jpg" alt="黑凤梨" />
      </div>
      <div>
        <el-form
          ref="loginFormRef"
          :rules="rules"
          class="login_form"
          :model="form"
          label-width="70px"
        >
          <el-form-item label="用户" prop="userName">
            <el-input
              @keyup.enter.native="login()"
              prefix-icon="el-icon-user"
              v-model="form.userName"
              placeholder="请输入用户名"
            ></el-input>
          </el-form-item>

          <el-form-item label="密码" prop="password">
            <el-input
              @keyup.enter.native="login()"
              type="password"
              prefix-icon="el-icon-key"
              v-model="form.password"
              placeholder="请输入密码"
            ></el-input>
          </el-form-item>
          <el-form-item class="btns">
            <el-button type="primary" @click="login()">登录</el-button>
            <!-- <el-button type="info" @click="reset()">重置</el-button> -->
            <el-button type="danger" @click="register()">注册</el-button>
            <!-- <el-button type="success" @click="test()">预览</el-button> -->
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dialogVisible: false,
      title: "黑凤梨项目管理系统",
      form: {
        userName: "",
        password: "",
      },
      rules: {
        userName: [
          { required: true, message: "请输入您的用户名", trigger: "blur" },
          {
            min: 2,
            max: 20,
            message: "长度在 2 到 20 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入您的密码", trigger: "blur" },
          {
            min: 4,
            max: 20,
            message: "长度在 4 到 20 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    reset() {
      // 为绑定的form表单清除内容
      this.$refs.loginFormRef.resetFields();
    },
    openInitProjectDialog() {
      this.$message("该功能还在内测中...，敬请期待!");
      // 先不做
      // this.dialogVisible = true;
    },
    async login() {
      this.$refs.loginFormRef.validate(async (valid) => {
        if(valid) {
          const {data: response} = await this.$http.post("/user/login", this.form);
          // console.log(result);
          if (response.code == 200) {
            this.$message.success(response.message);
            // console.log("token ： " + data.data.id);
            window.localStorage.setItem("token", response.data);
            // window.localStorage.setItem('customerName', data.data.customerName)
            this.$router.push("/home");
          } else {
            this.$message.error(response.message);
          }
        } else {
        }
      });
    },
    register() {
      this.$message("注册功能尚未开放,请微信联系我");
    },
    handleClose() {
      this.dialogVisible = false;
    },
    test() {
      // var that = this;
      this.$http.post("/other", this.form).then((data) => {
        console.log(data.data);
        if (data.data.code == 40004) {
          this.$message.error(data.data.msg);
        } else {
          this.$message.error("未知错误");
        }
      });
    },
  },
};
</script>
<style lang="less" scoped>
.login_container {
  background-color: slategray;
  height: 100%;
}

.login_box {
  width: 450px;
  height: 300px;
  background-color: white;
  border-radius: 10px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  .avatar_box {
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 125px;
    height: 125px;
    border: 1px solid white;
    border-radius: 10%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    background-color: thistle;
    img {
      width: 100%;
      height: 100%s;
      border-radius: 10%;
      background-color: #eee;
    }
  }
}

.btns {
  display: flex;
  justify-content: flex-end;
}

.registerBtn {
  display: flex;
  justify-content: flex-start;
}

.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}

.login_title {
  padding-top: 100px;
  text-align: center;
  font-size: 400%;
  color: wheat;
}
</style>
