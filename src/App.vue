<template>
  <div id="app">

    <router-view />

  </div>
</template>

<script>
(function (doc, win) {
  var docEl = doc.documentElement,
    resizeEvt = "orientationchange" in window ? "orientationchange" : "resize",
    recalc = function () {
      var clientWidth = docEl.clientWidth;

      if (!clientWidth) return;

      docEl.style.fontSize = "100px";

      // if(clientWidth>=1024){

      //   docEl.style.fontSize = '100px';

      // }else{

      //   docEl.style.fontSize = 100 * (clientWidth / 1024) + 'px';

      // }
    };

  if (!doc.addEventListener) return;

  win.addEventListener(resizeEvt, recalc, false);

  doc.addEventListener("DOMContentLoaded", recalc, false);
})(document, window);

(function () {
  function getViewPortHeight() {
    return document.documentElement.clientHeight || document.body.clientHeight;
  }

  function setHeight() {
    document.body.style.height = getViewPortHeight() + "px";

    // document.body.style.overflow = 'hidden'
  }

  setHeight();

  $(window).resize(function () {
    //动态监听监听网页窗口变化

    setHeight();
  });
})();

export default {
  name: "App"
};
</script>

<style lang="scss">
@import "assets/styles/resert.scss";

@import "assets/styles/scss/base/fn";

// 下拉选择框字体
.el-input__suffix,
.el-input__suffix,
.el-select-dropdown__item,
.el-select-dropdown__empty {
  font-size: 12px !important;
}

// 面包屑最后一个元素
.el-breadcrumb__item:last-child > .el-breadcrumb__inner {
  font-weight: bolder;
}

// 斑马纹表格颜色

.el-dialog {
  .el-dialog__body {
    height: calc(100% - 110px);

    padding: 0px;

    .el-form-item {
      // margin-bottom: 10px;

      // margin-top: 6px;

      .el-form-item__error {
        padding-top: 2px;
      }
    }

    .el-input__inner {
      height: 28px;
      line-height: 28px;
      font-size: 12px;
      text-align: center;
    }
  }

  .el-dialog__footer {
    text-align: center;

    border-top: 1px solid #efefef;

    padding: 5px;
  }

  .el-dialog__header {
    border-bottom: 1px solid #efefef;

    .el-dialog__title {
      font-size: 14px;

      font-weight: bold;
    }
  }
}

.el-table--striped .el-table__body tr.el-table__row--striped td {
  background: #f5f5f5;
}

/*loading样式*/

.el-loading-mask {
  /*margin-left: 180px;*/

  margin-top: px2rem(38);
}

.el-loading-spinner .el-loading-text {
  margin: 10px 0 !important;

  font-size: 25px !important;
}

.el-loading-mask.is-fullscreen .el-loading-spinner .circular {
  height: 100px !important;

  width: 100px !important;
}

.el-popup-parent--hidden {
  padding-right: 0 !important;
}

#app .el-dialog__header .el-dialog__title {
  font-size: 14px;

  font-weight: bold;
}

#app {
  font-size: 0.16rem;

  height: 100%;

  .el-button.el-button--text:focus,
  .el-button.el-button--text:hover {
    background: transparent;

    border-color: transparent;
  }

  // .el-dialog {

  //   margin: 0 auto;

  //   width: 80%;

  //   height: 94%;

  //   margin-top: 0px !important;

  //   .el-dialog__body {

  //     .el-input__inner {

  //       height: 28px;

  //       line-height: 28px;

  //       // height: auto;

  //       font-size: 12px;

  //     }

  //     .el-form-item {

  //       margin-bottom: 10px;

  //     }

  //   }

  // }

  .el-dialog.is-fullscreen {
    width: 60%;

    height: 90%;
  }

  .el-form--label-left .el-form-item__label {
    font-size: 12px;
  }

  .el-table__body-wrapper {
    height: calc(100% - 32px);

    overflow-y: auto;

    padding-bottom: 2px;
  }

  .el-table thead th {
    padding: 4px 0;
    text-align: center;
  }

  .el-table td,
  .el-table th {
    padding: 0px 0;
    text-align: center;
    .el-button {
      span {
        font-size: 12px;
      }
    }
  }
  // 表格列居左
  .el-table__row .is-left {
    text-align: left;
  }
  // 表格列居右
  .el-table__row .is-right {
    text-align: right;
  }

  .el-dialog__header {
    border-bottom: 1px solid #efefef;

    .el-dialog__title {
      font-size: 14px;
    }
  }

  .el-dialog__footer {
    border-top: 1px solid #efefef;

    padding: 5px;
  }

  // .el-dialog__wrapper {

  //   background: transparent !important;

  //   padding-top: 5%;

  // }

  .allScreen {
    padding-top: 60px;

    .el-dialog {
      width: calc(100% - 220px);

      height: 100%;

      margin-left: 220px;
    }
  }
}

/*设置右边内容区域公共样式以及内容元素背景色为白色*/

.kl-main {
  & > div {
    height: 100%;

    // padding: 10px;

    // border: #eaf4ff 5px solid;

    box-sizing: border-box;

    & > * {
      // background: #fff;
    }

    .main-content {
      height: 100%;

      border: 2px solid #f3f5fb;

      /*设置内容区域公共标题样式*/

      .bread-bottom {
        border-bottom: 1px solid #f3f5fb;
      }

      .tab-title {
        height: 0.4rem;

        line-height: 0.4rem;

        margin: 0;

        background: #fff;

        color: #000;

        border-radius: 6px 6px 0 0;

        padding-left: 20px;

        font-size: 0.16rem;

        font-size: large;

        font-weight: 600;

        border-bottom: 1px solid #f3f5fb;

        i {
          width: 4px;

          background: #c4d600;

          border-radius: 4px;

          height: 18px;

          display: inline-block;

          vertical-align: middle;
        }
      }

      .table-tree {
        float: left;

        overflow: auto;

        /*margin-top: px2rem(40px);*/

        box-sizing: border-box;

        border-right: 1px solid #dfe3e6;

        height: calc(100% - 0.9rem);

        width: px2rem(200);

        padding: px2rem(10px);
      }

      /*面包屑容器公共样式*/

      .bread-contain {
        height: 0.4rem;
      }

      /*面包屑公共样式*/

      .el-breadcrumb {
        box-sizing: border-box;

        float: left;

        height: 0.4rem;

        line-height: 0.4rem;

        // margin-bottom: 10px;

        .bread-active {
          span {
            font-weight: 400;

            cursor: pointer;
          }
        }
      }

      .table-float {
        float: right;

        // margin-right: px2rem(50);

        width: calc(100% - 2.4rem);
      }

      .kl-table {
        height: calc(100% - 1.2rem);

        /*overflow: scroll;*/

        padding: 0 20px;

        /*查询部分公共样式*/

        .el-table .cell {
          line-height: 30px;

          height: 30px;
        }

        // .toolbar {
        //   .demo-form-inline {
        //     padding: 5px 0;

        //     &::after {
        //       content: "\0020";

        //       display: block;

        //       height: 0;

        //       clear: both;
        //     }

        //     position: relative;

        //     .el-form-item {
        //       margin-bottom: 0;

        //       & + .el-form-item {
        //         margin-right: 10px;
        //       }

        //       .el-form-item__content {
        //         .line {
        //           text-align: center;
        //         }

        //         .el-form-item {
        //           margin-right: 0;
        //         }
        //       }
        //     }

        //     & > .el-form-item {
        //       margin: 10px 10px 10px 0;
        //     }

        //     & > .el-form-item:last-child {
        //       margin-right: 0;
        //     }

        //     .button-group {
        //       float: right;
        //     }
        //   }
        // }

        .el-table {
          border: 1px solid #ebeef5;

          .el-table__fixed,
          .el-table__fixed-right {
            box-shadow: none;

            &::before {
              height: 0;
            }
          }

          .el-table__fixed-right {
            /*border-left: 1px solid #ebeef5*/

            .el-button {
              font-size: 12px;
            }
          }
        }

        th,
        td {
          text-align: center;
        }

        th {
          color: #111;

          background: #f3f5fb;
        }

        .el-table--enable-row-transition .el-table__header th:last-child {
          border-right: 0;
        }

        .el-table--enable-row-transition .el-table__body td:last-child {
          border-right: 1px solid #ebeef5;
        }

        .el-table__fixed-right-patch {
          background: rgb(234, 244, 254);
        }

        // rgb(234, 244, 254),#efefef

        /*设置表底部分页对齐方式*/

        .el-pagination {
          text-align: right;

          padding: 8px;
        }

        .el-button--warning.is-plain {
          color: #f5a345;

          background: rgba(245, 163, 69, 0.1);

          border-color: rgba(245, 163, 69, 0.5);
        }

        .el-button--warning.is-plain:hover {
          color: #fff;

          background: #f5a345;

          border-color: #f5a345;
        }
      }
    }
  }
}

body .el-table th.gutter {
  display: table-cell !important;
}

.el-table__body {
  width: 100% !important;
}

.el-input.el-input--suffix,
.el-textarea.el-input--suffix {
  width: 100% !important;
}

.keyword-input {
  width: 210px;
  margin-right: 10px;
  margin-left: 50px;
  margin-top: 10px;
  margin-bottom: 10px;
  .el-input__inner {
    height: 30px;
    line-height: 30px;
  }
  .el-input__icon {
    line-height: 30px;
  }
}

.keyword-bottom {
  display: inline-block;
  height: 40px;
  line-height: 40px;
}
</style>
