<template>
  <div class="login_container">
    <el-dialog
      title="用户注册"
      :close-on-click-modal="false"
      :visible.sync="dialogVisible"
      width="30%"
      @close="handleClose"
    >
      <!-- 添加用户表单 -->
      <el-form 
                      v-loading="emailLoading"
              element-loading-text="邮件发送中..."
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
       ref="addFormRef" :rules="addFormRules" :model="addForm">
        <el-form-item label="用户名" prop="userName">
          <el-input
            prefix-icon="el-icon-user"
            v-model="addForm.userName"
            placeholder="请输入用户名（登录时使用）"
            :disabled="inputDisabled"
          ></el-input>
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input
            type="password"
            prefix-icon="el-icon-key"
            v-model="addForm.password"
            placeholder="请输入密码"
            :disabled="inputDisabled"
          ></el-input>
        </el-form-item>

        <el-form-item label="邮箱（发送验证码使用，发送验证码后方可注册）" prop="email">
          <el-input
                      style="margin-bottom: 10px"

            prefix-icon="el-icon-message"
            v-model="addForm.email"
            placeholder="请输入邮箱"
            :disabled="inputDisabled"
          ></el-input>
          <el-button
            type="primary"
            @click="sendEmailCode"
            >发送验证码</el-button
          >
        </el-form-item>

        <el-form-item
          v-if="emailCodeStatus"
          label="邮箱验证码（区分大小写）"
          prop="emailCode"
        >
          <el-input
            prefix-icon="el-icon-message"
            v-model="addForm.emailCode"
            placeholder="请输入邮箱验证码(区分大小写)"
          ></el-input>
        </el-form-item>
      </el-form>

      <!-- 添加底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button :disabled="addUserDisabled" type="primary" @click="addUser()">注 册（发送验证码后方可注册）</el-button>
      </span>
    </el-dialog>
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
            <el-button type="danger" @click="register()">注册</el-button>
          </el-form-item>
        </el-form>
        <!-- 添加用户的对话框 -->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    var checkEmail = (rule, value, callback) => {
      // 验证邮箱的正则
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
      if (regEmail.test(value)) {
        return callback();
      }
      callback(new Error("请输入合法的邮箱,已确保您可以收到验证码"));
    };
    return {
      emailLoading:false,
      addUserDisabled:true,
      inputDisabled:false,
      emailCodeStatus: false,
      dialogVisible: false,
      title: "黑凤梨项目管理系统",
      form: {
        userName: "",
        password: "",
      },
      addForm: {
        userName: "",
        password: "",
        email: "",
        emailCode:""
      },
      addFormRules: {
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
            min: 2,
            max: 20,
            message: "长度在 2 到 20 个字符",
            trigger: "blur",
          },
        ],
        email: [
          {
            required: true,
            message: "请输入您的邮箱地址,已确保您可以收到验证码",
            trigger: "blur",
          },
          { validator: checkEmail, trigger: "blur" },
        ],
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
    resetAddForm(){
      this.$refs.addFormRef.resetFields();
    },
    async login() {
      this.$refs.loginFormRef.validate(async (valid) => {
        if (valid) {
          const { data: response } = await this.$http.post(
            "/user/login",
            this.form
          );
          // console.log(result);
          if (response.code == 200) {
            this.$message.success(response.message);
            // console.log("token ： " + data.data.id);
            window.localStorage.setItem("token", response.data);
            window.localStorage.setItem("customerName", response.customerName);
            this.$router.push("/home");
          } else {
            this.$message.error(response.message);
          }
        } else {
        }
      });
    },
    register() {
      this.dialogVisible = true;
    },
    handleClose() {
      this.dialogVisible = false;
      this.resetAddForm();
      this.inputDisabled = false;
      this.emailCodeStatus = false;
    },
    async addUser() {
      console.log(this.addForm);
      if(this.addForm.emailCode == ''){
        this.$message.error("请输入邮箱中的4位验证码")
      }else if(this.addForm.emailCode.length != 4){
        this.$message.error("验证码需为4位")
      }else{
        const { data: response } = await this.$http.get(
            "user/activate?uid=" + this.addForm.id + "&emailCode=" + this.addForm.emailCode
          );
          if(response.code == 200){
            this.$message.success(response.message);
            this.handleClose();
          }else{
            this.$message.error(response.message);
          }
      }
    },
    sendEmailCode() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (valid) {
          this.emailLoading = true;
          const { data: response } = await this.$http.post(
            "user/register",
            this.addForm
          );
          if (response.code == 200) {
            this.$message.success(response.message);
            this.emailCodeStatus = true;
            this.inputDisabled = true;
            this.addUserDisabled = false;
            this.addForm.id = response.data;
          }else{
            this.$message.error(response.message);
          }
          this.emailLoading = false;
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
