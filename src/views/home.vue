<template>
  <div class="custom-home">
    <header>
      <first-Nav :firstNav="firstNav" @changeNav="changeNav">
        <div class="leftItem header-top-right">
          <!-- <div class="menu_box">
            <img class="menu_img menu1" src="../assets/images/AppManagement-active.png" @click="getSecondMenu('Home')" alt="">
            <div class="menu_name">应用管理</div>
          </div> -->
          <img class="menu_img menu1" src="../assets/images/AppManagement-active.png" @click="getSecondMenu('Home')" alt="">
          <!-- <img class="menu_img menu1" src="../assets/images/Home-active.png" @click="getSecondMenu('Home')" alt=""> -->
          <img class="menu_img menu3" src="../assets/images/WorkflowDesign.png" @click="getSecondMenu('Business')" alt="">
          <img class="menu_img menu4" src="../assets/images/WorkflowMonitoring.png" @click="getSecondMenu('Statistical')" alt="">
          <img class="menu_img menu5" src="../assets/images/Basics.png" @click="getSecondMenu('Basics')" alt="">
          <img class="menu_img menu6" src="../assets/images/system.png" @click="getSecondMenu('system')" alt="">

          <div class="loginArea" @mouseover="changeStyle" @mouseout="restStyle">
            <img :src=" userInfo.photourl" alt>

            <div class='infoPop'>
              <div class="nick">你好，周新宇</div>
              <div class="line"></div>
              <div class="loginout" @click="loginout()">[退出登录]</div>
            </div>
          </div>
        </div>
      </first-Nav>

    </header>

    <aside v-show="menuShow" class="primary-menu">
      <aside class="kl-aside">
        <!-- <second-Nav :secondNav="firstNav.navData"></second-Nav> -->
        <!-- 基础配置 -->
        <second-Nav :secondNav="basicsMenu.secondNav" v-show="menuShowData.basicsMenuShow"></second-Nav>
        <second-Nav :secondNav="systemMenu.secondNav" v-show="menuShowData.systemMenuShow"></second-Nav>
      </aside>
      <div class="collapse" @click="collapse">
        <i class="el-icon-arrow-left leftChange"></i>
      </div>
    </aside>
    <section class="kl-container  aside-show-css">
      <div class="kl-main loadingHiden" style="margin-left: 0px;" id="main-home">
        <router-view v-if='isRouterAlive'></router-view>
      </div>
    </section>
  </div>
</template>
<script>
import ApplicationManagement from './ApplicationManagement/index'
export default {
  name: "custom-home",
  components: {
    ApplicationManagement,
  },
  data() {
    return {
      firstNav: {
        //系统名称
        title: '工作流引擎运维平台',
        //logo路径
        logoSrc: require('../assets/images/logo3.png'),
        //导航
        navData: {
          navList: [
          ],
          //默认路径
          activeChanel: '/CenterSideIndex',
        },
      },
      // 显示侧边栏
      menuShowData: {
        // 基础信息
        basicsMenuShow: false,
        systemMenuShow: false,
      },
      // 基础配置侧边栏菜单
      basicsMenu: {
        secondNav: {
          navList: [
            {
              type: 'firstmenu',
              icon: "BusinessArea1-1",
              children: [],
              NavName: "岗位管理",
              url: "/BasicSet/PositionManagement"
            },
            {
              type: 'firstmenu',
              icon: "BusinessArea1-2",
              children: [],
              NavName: "角色线管理",
              url: "/BasicSet/RoleLineManagement",
            },
            {
              type: 'firstmenu',
              icon: "BusinessArea1-2",
              children: [],
              NavName: "组织架构",
              url: "/BasicSet/Organization",
            },
            {
              type: 'firstmenu',
              icon: "BusinessArea1-2",
              children: [],
              NavName: "人员管理",
              url: "/BasicSet/UsersManagement",
            },
          ],
        },
      },
      // 系统管理侧边栏菜单
      systemMenu: {
        secondNav: {
          navList: [
            {
              type: 'firstmenu',
              icon: "BusinessArea1-2",
              children: [],
              NavName: "系统用户管理",
              url: "/SystemSet/SystemUserManagement",
            },
            {
              type: 'firstmenu',
              icon: "BusinessArea1-2",
              children: [],
              NavName: "接口调用日志",
              url: "/SystemSet/InterfaceCallLog",
            },
            {
              type: 'firstmenu',
              icon: "BusinessArea1-2",
              children: [],
              NavName: "数据字典",
              url: "/SystemSet/DataDctionary",
            },
          ],
        },
      },

      secondNav: {
        navList: [

        ],
      },
      isRouterAlive: true,
      defaultPage: '/',
      userInfo: { photourl: require('../assets/images/cute.jpeg') },
      host: "",
      menuShow: false,
      activeIndex: "/",

    }
  },
  mounted() {
    var _this = this
    eventBus.$on('asideMenuShow', (show) => {
      Object.keys(this.menuShowData).forEach(function (key) {
        if (key == show) {
          _this.menuShowData[key] = true
        } else {
          _this.menuShowData[key] = false
        }
      })
    })
    let n = window.location.host.search(':')
    let str = window.location.host + ""

    this.host = str.slice(0, n)
    if (this.host === '127.0.0.1')
      this.host = 'localhost'
    // 获取菜单
    this.getSecondMenu('Home')

  },
  updated() {
    this.$nextTick(() => {
      if (!this.hasReset) {
        this.hasReset = true
      }
    })
  },
  methods: {
    changeStyle(obj) {
      $('.loginArea > .infoPop').css('display', 'block');
    },
    loginout() {
      localStorage.removeItem('token');
      let n = window.location.host.indexOf("/#/") + 1;
      let str = window.location.host.substring(0, n);
      window.location.href = str;
    },
    restStyle(obj) {
      $('.loginArea > .infoPop').css('display', 'none');

    },
    getSecondMenu(menuName) {

      if (menuName == 'Home') {// 应用管理
        if (localStorage.getItem('text') != 'true') {
          this.$router.push('/ApplicationManagement')
        }
        localStorage.setItem('text', 'false')
        $('.menu_img').eq(0).attr('src', require('../assets/images/AppManagement-active.png'))
        // $('.menu_img').eq(0).attr('src', require('../assets/images/Home-active.png'))
        $('.menu_img').eq(1).attr('src', require('../assets/images/WorkflowDesign.png'))
        $('.menu_img').eq(2).attr('src', require('../assets/images/WorkflowMonitoring.png'))
        $('.menu_img').eq(3).attr('src', require('../assets/images/Basics.png'))
        $('.menu_img').eq(4).attr('src', require('../assets/images/system.png'))
        this.firstNav.navData = {
          navList: [],
        }
        $('.custom-home header').css('height', '58px')
        $('.custom-home > .kl-container').css('height', 'calc(100% - 60px)')
        $('#firstNav .nav .navList > li').css('min-width', '80px')
      } else if (menuName == 'Business') {// 工作流设计
        this.$router.push('/WorkflowDesign')
        $('.menu_img').eq(0).attr('src', require('../assets/images/AppManagement.png'))
        $('.menu_img').eq(1).attr('src', require('../assets/images/WorkflowDesign-active.png'))
        $('.menu_img').eq(2).attr('src', require('../assets/images/WorkflowMonitoring.png'))
        $('.menu_img').eq(3).attr('src', require('../assets/images/Basics.png'))
        $('.menu_img').eq(4).attr('src', require('../assets/images/system.png'))
        this.firstNav.navData = {
          navList: []
        }
        $('.custom-home header').css('height', '58px')
        $('.custom-home > .kl-container').css('height', 'calc(100% - 60px)')
        $('#firstNav .nav .navList > li').css('min-width', '80px')
      } else if (menuName == 'Statistical') {// 工作流监控
        this.$router.push('/WorkflowMonitoring')
        $('.menu_img').eq(0).attr('src', require('../assets/images/AppManagement.png'))
        $('.menu_img').eq(1).attr('src', require('../assets/images/WorkflowDesign.png'))
        $('.menu_img').eq(2).attr('src', require('../assets/images/WorkflowMonitoring-active.png'))
        $('.menu_img').eq(3).attr('src', require('../assets/images/Basics.png'))
        $('.menu_img').eq(4).attr('src', require('../assets/images/system.png'))
        this.firstNav.navData = {
          navList: [],
        }
        $('.custom-home header').css('height', '58px')
        $('.custom-home > .kl-container').css('height', 'calc(100% - 60px)')
        this.$nextTick(function () {
          $('#firstNav .nav .navList > li').css('min-width', '80px')
        })
      } else if (menuName == 'Basics') {// 基础信息
        var _this = this
        this.$router.push('/BasicSet')
        $('.menu_img').eq(0).attr('src', require('../assets/images/AppManagement.png'))
        $('.menu_img').eq(1).attr('src', require('../assets/images/WorkflowDesign.png'))
        $('.menu_img').eq(2).attr('src', require('../assets/images/WorkflowMonitoring.png'))
        $('.menu_img').eq(3).attr('src', require('../assets/images/Basics-active.png'))
        $('.menu_img').eq(4).attr('src', require('../assets/images/system.png'))
        this.firstNav.navData = {
          navList: [
            // 菜单路径在data里面配置
          ],
        }
        $('.custom-home header').css('height', '58px')
        $('.custom-home > .kl-container').css('height', 'calc(100% - 60px)')
        $('#firstNav .nav .navList > li').css('min-width', '80px')
      } else if (menuName == 'system') {// 系统管理
        this.$router.push('/SystemSet')
        $('.menu_img').eq(0).attr('src', require('../assets/images/AppManagement.png'))
        $('.menu_img').eq(1).attr('src', require('../assets/images/WorkflowDesign.png'))
        $('.menu_img').eq(2).attr('src', require('../assets/images/WorkflowMonitoring.png'))
        $('.menu_img').eq(3).attr('src', require('../assets/images/Basics.png'))
        $('.menu_img').eq(4).attr('src', require('../assets/images/system-active.png'))
        this.firstNav.navData = {
          navList: [
            // 菜单路径在data里面配置
          ],
        }
        $('.custom-home header').css('height', '58px')
        $('.custom-home > .kl-container').css('height', 'calc(100% - 60px)')
        // $('.custom-home > .kl-container').css('height', 'calc(100% - 110px)')
        $('#firstNav .nav .navList > li').css('min-width', '80px')
      }

    },

    changeNav(val) {

      let strurl = val.path.match(/^(\/[\w]+)\/?/)[1];
      // var arr = ["/approvalPage", '/ApplicationManagement', '/ProcessApproval/PendingTrial', '/HallBusiness', '/saleManagement', '/BusinessManagement', '/CustomerManagementCenter', '/CallCenter', '/RoleManage', '/UserManage']
      var arr = ['/ApplicationManagement', '/WorkflowDesign', '/WorkflowMonitoring']
      var arr1 = ['/ProcessApproval/PendingTrial']

      if (arr.includes(val.path)) {
        this.menuShow = false;
        $(".primary-menu").css('width', '0px');
        // $('.kl-container').css('width', 'calc(100% - 20px)');
        $('.kl-container').css('width', '100%');
        $('.primary-menu .kl-aside').css('display', 'none');
        $('.primary-menu .leftChange').addClass('el-icon-arrow-right').removeClass('el-icon-arrow-left');
      } else {
        this.menuShow = true;
        $(".primary-menu").css('width', '200px');
        $('.kl-container').css('width', 'calc(100% - 210px)');
        // $('.kl-container').css('width', 'calc(100% - 230px)');
        $('.primary-menu .kl-aside').css('display', 'block');
        $('.primary-menu .leftChange').addClass('el-icon-arrow-left').removeClass('el-icon-arrow-right');
      }

    },
    collapse() {
      this.util.menuShow('.primary-menu', '.kl-container', '.primary-menu .kl-aside', '.primary-menu .leftChange')
    }
  },
  watch: {
    controllChilder(a, b) {
    },
    defaultPage() {
      return this.defaultPage
    },
    $route(newVal) {
      this.changeNav(newVal);
    }


  },

}
</script>

<style lang="scss">
@import "../assets/styles/scss/base/fn";
$imgWidth: 200px;
$theme-color: #297acc;

// .el-tooltip__popper{
//       top: 600px !important;
// }
.fontRight {
  float: right;
  margin: 0 0 10px;
}
#second_nav .badge {
  height: 17px;
  line-height: 17px;
}

.legendColumn {
  background: #efefef;
  font-weight: 700;
  padding: 5px 20px;
  font-size: 14px;
  margin-bottom: 5px;
}
.qianfei {
  .el-dialog {
    height: 80% !important;
  }
}
.el-checkbox__label {
  font-size: 12px;
}
.searchInput,
.bigSelect {
  width: 220px;
  .el-form-item__content {
    width: calc(100% - 65px);
  }
  .el-input__inner,
  .el-select {
    width: 100%;
  }
}
.bigSelect {
  width: 230px;
}
.el-dialog {
  margin: 0 auto;
  width: 80%;
  height: 94%;
  margin-top: 38px !important;
}
.center-side-right .table-top {
  margin-top: 20px;
  .el-table__body-wrapper {
    font-weight: 700;
  }
  .el-table__body-wrapper tr td:nth-child(1) .cell {
    color: #3195f4;
    cursor: pointer;
  }
}
.custom-home .tab-title {
  height: 2.5rem;
  line-height: 2.5rem;
  margin: 0;
  background: #fff;
  color: #000;
  border-radius: 6px 6px 0 0;
  padding-left: 20px;
  font-size: large;
  font-weight: 600;
  border-bottom: 1px solid #f3f5fb;
  span {
    font-weight: 400;
  }
}
.custom-home .tab-title i {
  width: 4px;
  background: #c4d600;
  border-radius: 4px;
  height: 18px;
  display: inline-block;
  vertical-align: middle;
}
.el-table--striped .el-table__body tr.el-table__row--striped td {
  background: #f5f5f5;
}
#firstNav {
  .top,
  .logo,
  .setting {
    height: 58px !important;
  }
  .logoLine {
    line-height: 58px;
  }
  .logo img {
    height: 42px;
  }
  .title {
    height: 58px;
    line-height: 58px;
    font-size: 23px;
  }
}
#firstNav .nav .navList > li {
  line-height: 25px;
  height: 24px !important;
}
#nav {
  display: none;
}
.el-table__header {
  th {
    color: #111;
    background: #f3f5fb;
  }
}
// .el-table .cell{
//     line-height: 30px;
//     height: 30px;
// }
.toolbar {
  padding: 10px 20px;
  &:after {
    @include _clearBoth();
  }
  .form-left {
    float: left;
    margin-bottom: 0px;
  }
  .form-right {
    float: right;
    margin-bottom: 0px;
    margin-right: 0px;
  }
}

.custom-home {
  background: #eaf4ff;
  zoom: 1;
  &:after {
    @include _clearBoth();
  }
  .title {
    color: #fff;
    cursor: pointer;
    font-size: 20px;
    font-weight: bold;
    height: 50px;
    /* line-height: 50px; */
    padding: 0 20px;
  }
  height: 100%;
  .select-tree {
    z-index: 3000;
    position: fixed;
    right: 0;
    top: 60px;
    height: calc(100% - 60px);
    /*background: #ccc !important;*/
    transition: width 500ms linear;
    box-shadow: 0 0 10px 0 #ccc;
  }
  .show-tree {
    width: 300px;
  }
  .hide-tree {
    width: 0px;
  }
  > header {
    height: 88px;
    background-color: #297acc;
    .header-top {
      // display: flex;
      padding-right: 30px;
      color: #fff;
      text-align: center;
      height: 68px;
      line-height: 38px;
      -webkit-box-sizing: border-box;
      -moz-box-sizing: border-box;
      box-sizing: border-box;
      zoom: 1;
      &::after {
        display: block;
        content: "";
        clear: both;
      }
      .nav-right {
        height: 38px;
      }
      .header-top-left {
        float: left;
        height: 38px;
        // & > * {
        //   float: left;
        //   margin-top: px2rem(8);
        // }
        img {
          // margin-right: px2rem(30);
          height: 34px;
          vertical-align: middle;
          line-height: 34px;
          margin-top: -13px;
        }
        i {
          width: 1.8px;
          height: 20px;
          margin-top: 9px;
          background-color: #dfdfea;
          display: inline-block;
          opacity: 0.5;
        }
        & > p {
          float: left;
          height: px2rem(24px);
          border-right: 1px solid #000;
          margin: px2rem(27) px2rem(20);
        }
        span {
          font-weight: bolder;
          font-size: 18px;
          vertical-align: top;
        }
      }
      & > b {
        font-size: 20px;
      }
      .kl-button--mini {
        padding: 2px 10px;
      }
    }
  }
  .header-top-right {
    // margin-right: px2rem(30);
    // margin-left:5.7rem;
    display: flex;
    align-items: center;
    height: 100%;
    float: right;
    .menu1 {
      margin-right: 40px !important;
      height: 40px;
      cursor: pointer;
    }
    .menu6 {
      margin-right: 5px !important;
    }
    .menu_img {
      margin-right: 30px;
      height: 40px;
      cursor: pointer;
    }
    .el-input__icon {
      line-height: 45px;
    }
    .loginArea {
      display: block;
      float: left;
      position: relative;
      line-height: 8px;
      padding: 0px 10px 0px 40px;
      font-size: 12px;
      text-align: center;
      img {
        width: 45px;
        height: 45px;
        margin: 5px 0;
        border-radius: 50%;
      }
      .infoPop {
        display: none;
        position: absolute;
        right: 3px;
        top: 55px;
        width: 100px;
        font-size: 12px;
        line-height: 22px;
        border: 1px solid #e2e2e2;
        background: #fff;
        padding: 10px;
        border-radius: 4px;
        -webkit-box-shadow: 1px 2px 2px #e2e2e2;
        box-shadow: 1px 2px 2px #e2e2e2;
        text-align: left;
        z-index: 2000;

        &:after {
          content: "";
          display: block;
          border-bottom: 10px solid #c5343400;
          border-left: 10px solid #ffffff;
          position: absolute;
          right: 23px;
          top: -3px;
          z-index: 11;
          background-color: transparent;
          transform: rotate(45deg);
        }
        .nick {
          width: 100%;
          color: #4889f3;
          margin: 0;
          -o-text-overflow: ellipsis;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
        }
        .line {
          border-bottom: 1px dashed #e4e4e4;
          height: 0;
          font-size: 0;
          overflow: hidden;
          margin: 5px 0;
        }
        .loginout {
          color: #5c5c5c;
          cursor: pointer;
          &:hover {
            color: #bf5757;
          }
        }
      }
    }

    & > span {
      color: #fff;
      font-size: 14px;
      i {
        color: #fff;
        font-size: 14px;
        vertical-align: middle;
        height: 14px;
        width: 14px;
      }
    }
    & > * {
      float: left;
    }
    .el-button--primary {
      border-color: #f78e1e;
      background-color: #f78e1e;
    }
    i {
      height: 40px;
      width: 40px;
      border-radius: 50%;
      overflow: hidden;
      margin-left: 10px;
      img {
        width: 40px;
        height: 40px;
        float: left;
      }
    }
    b {
      height: 36px;
      line-height: 36px;
      font-size: 14px;
      padding: 0 20px 0 10px;
      font-weight: 400;
    }
    & > div {
      margin-left: 10px;
      span {
        font-size: 14px;
        color: #f5f7f9;
      }
      u {
        position: absolute;
        padding: 5px;
        border-radius: 50%;
        top: 5px;
        right: 0;
        &.active {
          background: red;
        }
      }
      .el-input.el-input--suffix {
        input {
          border: 0;
          color: #000;
          width: 2.5rem;
          padding-right: 0;
          padding-left: 10px;
          font-size: 12px;
          width: 90px;
          height: 26px;
        }
        .el-input__suffix {
          right: -4px;
          top: -3px;
          .el-input__suffix-inner {
            .el-select__caret {
              height: auto;
              // margin-top: -4px;
            }
          }
        }
      }
    }
  }
  .first_box {
    width: 100%;
    height: 0.35rem;
    .menu {
      height: 100%;
      div {
        display: inline-block;
        // width: 7%;
        height: 0.25rem;
        line-height: 0.25rem;
        background: white;
        text-align: center;
        border-radius: 0.05rem;
        border: 1px solid red;
        margin-left: 0.1%;
        cursor: pointer;
        margin-top: 0.4%;
        span {
          font-size: 0.12rem;
          color: #428ad2;
          // vertical-align: middle;
          line-height: 70%;
          display: inline-block;
          // margin-top: 2%;
          padding: 0.1rem;
        }
      }
    }
  }

  & > .kl-container {
    height: calc(100% - 90px);
    position: relative;
    background: #eaf4ff;
    padding: 10px;
    float: left;
    width: 100%;
    // width: calc(100% - 20px);
    .kl-aside {
      position: absolute;
      left: 10px;
      // top: 10px;
      width: $imgWidth;
      z-index: 1000;
      background: #fff;
      height: calc(100% - 18px);
      color: #000;
      border-radius: 3px;
    }
    .kl-main {
      height: 100%;
      margin-left: 210px;
      border-radius: 3px;
      background: #fff;
      .model-first-rank {
        padding: 0px;
      }
    }
  }
  & > .primary-menu {
    float: left;
    width: 200px;
    height: calc(100% - 80px);
    position: relative;
    background: #fff;
    margin: 10px;
    margin-right: 0px;
    .kl-aside {
      position: absolute;
      left: 0px;
      // top: 10px;
      width: 200px;
      z-index: 1000;
      background: #fff;
      height: calc(100% - 18px);
      color: #000;
      border-radius: 3px;
      .el-menu {
        width: 100%;
        border: none;
        overflow: auto;
        background: transparent;
        background: #fff;
        height: 100%;

        .el-menu-item {
          height: 38px;
        }

        .el-menu-item.is-active {
          background: #328ed1;
          color: #fff;
        }

        .el-menu-item {
          width: 100%;

          text-align: center;
        }
        li.el-submenu {
          color: #000;
          .el-menu {
            background: transparent;
          }
          .el-submenu__title {
            text-align: left;
            height: 50px !important;
            line-height: 50px !important;
            font-size: 14px;
            font-weight: 700;
            &:hover,
            &:focus {
              background: $theme-color;
            }
          }
        }
        .el-menu-item {
          background: transparent;
          color: #3b3a3a;
          text-align: left;
          height: 38px !important;
          line-height: 38px !important;
          font-size: 14px;
          min-width: 180px;
          &:hover,
          &:focus {
            background: $theme-color;
          }
          &.is-active {
            background: $theme-color;
            color: #fff;
            height: 38px !important;
            line-height: 38px !important;
          }
        }
      }
      .kr-title {
        color: #3195f4;
        cursor: pointer;
        font-size: 20px;
        font-weight: bold;
        height: 50px;
        line-height: 50px;
        padding: 0 20px;
        text-align: center;
      }

      .switch-btn {
        position: relative;
        width: 18px;
        height: 100%;
        float: left;
        background: rgba(0, 70, 142, 0.1);
        line-height: 100%;
        text-align: center;
        .glyphicon-menu-right,
        .glyphicon-menu-left {
          vertical-align: middle;
          background: rgb(0, 70, 141);
          color: #fff;
          height: 60px;
          line-height: 60px;
          font-weight: bolder;
          position: absolute;
          top: 50%;
          left: 3%;
          transform: translateY(-50%);
          border-radius: 0 3px 3px 0;
        }
      }
    }
    .kl-main {
      height: 100%;
      margin-left: 210px;
      border-radius: 3px;
      background: #fff;
      .model-first-rank {
        padding: 0px;
      }
    }
  }
}
.el-select-dropdown__item {
  padding: 0 17px;
}

.header-menu {
  //ul
  background-color: #0c6ad7;
  border-right: 0px !important;
  display: flex;
  width: 50%;
  height: 100%;
  .menu-item {
    padding: 3px;
    & > li {
      padding: 11px 15px !important;
      height: 24px;
      font-size: 12px;
    }
    .el-menu-item {
      line-height: 2px;
      border-radius: 2px;
      color: #297acc;
    }
  }
  .el-menu-item:hover {
    //li
    background: #cdcdcd !important;
    color: #297acc !important;
  }
  .el-menu-item {
    height: 100%;
  }
  .is-active {
    background: #328ed1 !important;
    color: #fff !important;
  }
}
#firstNav .setting {
  margin-right: 50px;
}

.read-only.el-input.is-disabled .el-input__inner {
  border: none;
  // border-bottom: 1px solid #ccc;
  background-color: transparent;
  border-radius: 0px;
  cursor: text !important;
  &::-webkit-input-placeholder {
    color: #000;
  }
  &::-moz-placeholder {
    color: #000;
  }
  &:-ms-input-placeholder {
    color: #000;
  }
}

.el-table {
  padding: 0px;
  .el-input__inner {
    // border:none;
    background: transparent;
    height: 30px;
    line-height: 30px;
    padding-right: 0px;
    width: 100% !important;
    padding-left: 0px;
  }
  .el-input__inner:hover {
    border: 1px solid #b8bdca;
  }
  .el-date-editor .el-input__inner {
    padding-left: 30px;
  }
}
#app .center-side .el-dialog {
  width: 70% !important;
  .el-dialog__body {
    height: calc(100% - 56px);
  }
}
#app .searchBtn {
  background: #faa646;
  color: #fff;
}
#app .textareaBecs {
  width: 100%;
  .el-form-item__content {
    width: 50%;
  }
}
#app .basicInfoForm {
  margin: 20px;
  .el-form-item {
    margin-bottom: 18px;
    width: 75%;
    .el-form-item__content {
      width: calc(100% - 150px);
      .el-select {
        width: 100%;
      }
    }
  }
  .el-input--mini /deep/ .el-input__inner {
    width: 100% !important;
  }
}

#app .water-side .el-tabs__header.is-top,
#app .WaterSideIndex .el-tabs__header.is-top {
  display: none !important;
}

#app .water-side .mydestop .el-tabs .el-tabs__content,
#app .WaterSideIndex .mydestop .el-tabs .el-tabs__content {
  width: calc(100% - 41px);
}
#app .toolbar-line {
  width: 4px;
  background: #c4d600;
  border-radius: 4px;
  height: 18px;
  display: inline-block;
  vertical-align: middle;
}
#app .toolbar-font {
  font-weight: 700;
  font-size: 16px;
  height: 19px;
  display: inline-block;
  line-height: 19px;
  vertical-align: middle;
}
#app .toolbar-fontSon {
  font-size: 14px;
  height: 19px;
  display: inline-block;
  line-height: 19px;
  vertical-align: middle;
}

.el-tree {
  .el-tree-node__label {
    font-size: 12px;
  }
}
.date-picker .el-date-editor {
  display: inline-block;
  width: calc(100% - 30px) !important;
  .el-input__inner {
    width: 100% !important;
    border: none;
    border-bottom: 1px solid #ccc;
    background-color: transparent;
    border-radius: 0px;
  }
}
#app .center-side .quotaSetting .el-dialog__body,
#app .WaterSideIndex2 .quotaSetting .el-dialog__body {
  height: calc(100% - 136px);
}
#app .center-side .echartsWaterSaless .el-dialog {
  height: 70%;
  margin-top: 30px !important;
}
#app .el-input.is-disabled .el-input__inner {
  color: #000;
}
#app .collapse {
  z-index: 1122;
  position: absolute;
  right: 0;
  top: 50%;
  margin-bottom: 25px;
  cursor: pointer;
  background-color: #000;
  color: #f3f3f3;
  height: 32px;
  line-height: 32px;
  font-size: 12px;
  -webkit-border-top-left-radius: 3px;
  -webkit-border-bottom-left-radius: 3px;
  -moz-border-radius-topleft: 3px;
  -moz-border-radius-bottomleft: 3px;
  border-top-left-radius: 3px;
  border-bottom-left-radius: 3px;
  filter: alpha(opacity=25);
  -moz-opacity: 0.25;
  opacity: 0.25;
}
#app .StepCollapse {
  z-index: 1122;
  position: absolute;
  right: 153px;
  top: 50%;
  margin-bottom: 25px;
  cursor: pointer;
  background-color: #000;
  color: #f3f3f3;
  height: 32px;
  line-height: 32px;
  font-size: 12px;
  -webkit-border-top-right-radius: 3px;
  -webkit-border-bottom-right-radius: 3px;
  -moz-border-radius-topright: 3px;
  -moz-border-radius-bottomright: 3px;
  border-top-right-radius: 3px;
  border-bottom-right-radius: 3px;
  filter: alpha(opacity=25);
  -moz-opacity: 0.25;
  opacity: 0.25;
}
#app .stepsCompar {
  width: 150px;
  height: 100%;
  display: inline-block;
  border-left: 10px solid #eaf4ff;
  position: relative;
  .stepsTitle {
    font-size: 16px;
    margin-left: 10px;
    font-weight: 700;
    color: #4593d8;
    display: inline-block;
  }
  .el-step__title {
    font-size: 14px;
  }
  .el-steps {
    width: calc(100% - 30px);
    height: calc(100% - 80px) !important;
    margin-left: 30px;
  }
  .line {
    border-bottom: 1px solid #4593d8;
    height: 0;
    font-size: 0;
    overflow: hidden;
    margin: 5px 10px;
  }
}
#app .approvalPageDio {
  .el-dialog__body {
    height: calc(100% - 55px);
  }
}
#app .animation {
  transition: all 0.5s;
  -webkit-transform: translateX(0px);
  -ms-transform: translateX(0px);
  transform: translateX(0px);
}
#app .el-checkbox__input.is-checked + .el-checkbox__label {
  margin-right: 0px !important;
}
.el-loading-spinner i {
  font-size: 50px;
}
.el-loading-spinner .el-loading-text {
  font-size: 18px;
}
#app .el-textarea .el-input__count {
  height: 20px;
}
</style>
