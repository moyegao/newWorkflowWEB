<template>
    <div class="errorPage">
        <section class="errMsg">
            <h2>{{msg}}</h2>
            <h2>3秒后自动跳转回登录页面</h2>
        </section>
        
    </div>
</template>
<script>
export default {
    name:"errorPage",
    data(){
        return{
            msg:"用户名或者密码错误，请重新输入"
        }
    },
    mounted(){
        this.$nextTick(()=>{
          setTimeout(()=>{
              this.$router.push('/')
          },3000)
        })
    },

}
</script>
<style lang="scss">
.errorPage{
    width: 100%;
    height: 100%;
    .errMsg{
        width: 80%;
        margin:20px auto;
        color: red;
        font-size: 20px;
        text-align: center;
    }
}
</style>
