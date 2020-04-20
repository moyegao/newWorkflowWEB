import axios from 'axios'
import { Loading } from 'element-ui';
const METHOD = {
  GET:'get',
  POST:'post'
}

axios.interceptors.request.use(
  config => {
		let n = window.location.hash.indexOf('?')
		if(n !== -1){
			config.headers.url = window.location.hash.substring(0,n)
		}else{
			config.headers.url = window.location.hash
    }
    return config
  },
  err => {
    return Promise.reject(err)
  })

// http response 服务器响应拦截器，这里拦截401错误，并重新跳入登页重新获取token
axios.interceptors.response.use(
  response => {
    return response;
  },
  err => {
    if (err && err.response) {
      switch (err.response.status) {
        case 400:
          err.message = '请求错误'
          vm.$message({
            showClose: true,
            message: '请求错误！',
            type: 'error'
          });
          break
          
        case 401:
          err.message = '未授权，请登录'
          vm.$message({
            showClose: true,
            message: '未授权，请登录！',
            type: 'error'
          });
          break

        case 403:
          err.message = '拒绝访问'
          vm.$message({
            showClose: true,
            message: '拒绝访问！',
            type: 'error'
          });
          break

        case 404:
          err.message = `请求地址出错: ${err.response.config.url}`
          vm.$message({
            showClose: true,
            message: `请求地址出错: ${err.response.config.url}`,
            type: 'error'
          });
          break

        case 408:
          err.message = '请求超时';
          vm.$message({
            showClose: true,
            message: `请求超时`,
            type: 'error'
          });
          break

        case 500:
          err.message = '服务器内部错误'
          vm.$message({
            showClose: true,
            message: `服务器内部错误`,
            type: 'error'
          });
          break

        case 501:
          err.message = '服务未实现'
          vm.$message({
            showClose: true,
            message: `服务未实现`,
            type: 'error'
          });
          break

        case 502:
          err.message = '网关错误'
          vm.$message({
            showClose: true,
            message: `网关错误`,
            type: 'error'
          });
          break

        case 503:
          err.message = '服务不可用'
          vm.$message({
            showClose: true,
            message: `服务不可用`,
            type: 'error'
          });
          break

        case 504:
          err.message = '网关超时'
          vm.$message({
            showClose: true,
            message: `网关超时`,
            type: 'error'
          });
          break

        case 505:
          err.message = 'HTTP版本不受支持'
          vm.$message({
            showClose: true,
            message: `HTTP版本不受支持`,
            type: 'error'
          });
          break

        default:
          err.message = '未知错误'
          vm.$message({
            showClose: true,
            message: '未知错误'+err,
            type: 'error'
          });
      }
    }
    return Promise.reject(err)
  });
export default {
  fetch(myConfig) {
    // return
    var loading = Loading.service({
      lock: true,
      text: '加载中......',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.3)'
    })
    let defaultConfig = {
      // apiUrl:'interface.api',
      method:METHOD.POST,
      params:null,
      isJson:true,
      needErrorCallback:true,
    }
    myConfig = Object.assign({}, defaultConfig, myConfig)
    // 登录接口不需要传token
    // if (myConfig.apiUrl != '/login.htm') {
    //   myConfig.params.token = localStorage.getItem('token');
    // }
    
    // myConfig.params.token = 'krrjdev123';
    // myConfig.params.sysType = "002"
    axios.defaults.baseURL = $baseUrl

    let RequestObj = {
      url:myConfig.params.busicode,
      // +'?'+Math.floor(Math.random()*100000)
      method:myConfig.method,
      timeout: 60000,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'token': localStorage.getItem('token')
      },
      withCredentials: true
    };

    // 删除无用入参busicode
    delete myConfig.params.busicode

    // 数据格式处理
    if (myConfig.method === METHOD.GET) {
      RequestObj.params = myConfig.params;
    } else if (myConfig.method === METHOD.POST) {
      if (myConfig.isJson) {
        // json格式
        RequestObj.headers['Content-Type'] = 'application/json;charset=UTF-8'
        
        // 入参不需要data对象包住入参
        myConfig.params = myConfig.params.data
        // 登录接口不需要传token
        if (RequestObj.url != '/login.htm') {
          // post请求讲token带进入参对象
          // myConfig.params.token = localStorage.getItem('token')
          // RequestObj.headers['token'] = localStorage.getItem('token')
        }
        
        
        RequestObj.data = myConfig.params
      } else {
        // 默认表单格式
        RequestObj.params = myConfig.params
      }
    }
    let n = window.location.host.search(':')
    let str = window.location.host + ""
    let host = str.slice(0, n)
    
    
    if (host === '127.0.0.1')
      host = 'localhost'
    return new Promise((resolve ,reject)=>{
      axios(RequestObj).then(res=>{
        loading.close();
        if(res.status===200){
          if (res.data.code === 10000) {
            let curl = $baseUrl;
            if(!curl.startsWith("http")){
              let loc = window.location.href;
              loc = loc.substring(0,loc.indexOf("/#",8));
              curl = loc+curl; //这是服务器端的地址
            }
            // 登录过期跳转地址
            // window.location.href = '/';
          }
          if(res.data.code != 0){
            vm.$notify({
              title: '错误',
              message:res.data.description,
              type: 'error'
            })
            
            if(myConfig.needErrorCallback){
              reject(res.data);
            }
            
          }else{
            resolve(res.data.data);
          }
          
        }
      },err=>{
        loading.close();
        if(myConfig.needErrorCallback){
          reject(err)
        }
      }).catch(error=>{
        loading.close();
        if (myConfig.needErrorCallback){
          reject(error)
        }
      })
    })
  }
}
