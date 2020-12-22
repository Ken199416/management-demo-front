<template>
  <div>
    <div style="margin-bottom:10px;">
      <el-button size="mini" >编辑</el-button>
      <el-button size="mini">保存</el-button>
    </div>
    <div>
           <quill-editor v-if="Node.isNode == 1" ref="myTextEditor" v-model="Node.fileContent" :options="editorOption" style="height:600px;" ></quill-editor>
      </div>

    
  </div>
</template>
<script>
import { quillEditor } from 'vue-quill-editor';
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';
export default {
  props: ['id'],
  components:{
    quillEditor
  },
    data() {
        return {
          Node:{},
          content:"",
          editorOption: {
               placeholder: '编辑文章内容'
             },
          // toolbar:[
          //                 ['bold', 'italic', 'underline', 'strike'],    //加粗，斜体，下划线，删除线
          //                 ['blockquote', 'code-block'],     //引用，代码块
          //                 [{ 'header': 1 }, { 'header': 2 }],        // 标题，键值对的形式；1、2表示字体大小
          //                 [{ 'list': 'ordered'}, { 'list': 'bullet' }],     //列表
          //                 [{ 'script': 'sub'}, { 'script': 'super' }],   // 上下标
          //                 [{ 'indent': '-1'}, { 'indent': '+1' }],     // 缩进
          //                 [{ 'direction': 'rtl' }],             // 文本方向
          //                 [{ 'size': ['small', false, 'large', 'huge'] }], // 字体大小
          //                 [{ 'header': [1, 2, 3, 4, 5, 6, false] }],     //几级标题
          //                 [{ 'color': [] }, { 'background': [] }],     // 字体颜色，字体背景颜色
          //                 [{ 'font': [] }],     //字体
          //                 [{ 'align': [] }],    //对齐方式
          //                 ['clean'],    //清除字体样式
          //                 ['image','video']    //上传图片、上传视频
          //         ]
        }
    },
    methods:{
        onEditorReady(editor) { // 准备编辑器
 
        },
        onEditorBlur(){
          console.log("失去了焦点")
                    console.log(this.content);
        }, // 失去焦点事件
        onEditorFocus(){}, // 获得焦点事件
        onEditorChange(){}, // 内容改变事件,;
        seeContent(){
          console.log(this.content)
        },

        // 转码
        escapeStringHTML(str) {
            str = str.replace(/&lt;/g,'<');
            str = str.replace(/&gt;/g,'>');
            return str;
        },
        async getNodeById(id){
          // console.log("获取node节点")
            const { data: response } = await this.$http.get("/fileContent/getNodeById?id=" + id);
            this.Node = response.data;
            // console.log(this.Node)
            if(this.Node.isNode == 1){
              
            }
        }


        
    },
    computed: {
        editor() {
            return this.$refs.myQuillEditor.quill;
        },
    },
    watch:{
      id:function(value,oldValue){
        console.log(value);
        this.content = '编辑文章内容,内容id：' + value;
        this.getNodeById(value);

      } 
    },
    mounted(){
      this.getNodeById(this.id);
    }

}
</script>
<style lang="less" scoped>

</style>