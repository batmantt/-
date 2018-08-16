//index.js
//获取应用实例
import { isGetUserInfo, login } from '../../utils/login'
import { ERR_OK } from '../../utils/config'
import {showLoading, hideLoading} from '../../utils/api'
const app = getApp().globalData

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  onLoad: function (res) {
    getApp().globalData.s_openid = res.openid
    showLoading()
    // 用户是否同意读取其身份信息
    isGetUserInfo()
    .then(res => {
      if (res == ERR_OK) {
        // 如果授权就获取其信息保存在selfInfo里面
        wx.getUserInfo({
          success: function (res) {
            // 微信自带的用户信息
            app.selfInfo = res.userInfo
            console.log("去登陆。。。。")
            nextStep()
          }
        })
        // 已经获取到信息的标志
      } else {
        // 暂时留在本页面
      }
    })
    .catch(err => {
      hideLoading()
      console.log(err)
    })
  },

  //登陆Tango
  getUserInfo: function(e) {
    // 如果用户同意授权，是可以获得到userInfo的
    if (e.detail.userInfo) {
      showLoading()
      app.selfInfo = e.detail.userInfo
      console.log(app)
      nextStep()
    }
  }
})
// 用户同意之后下一步
function nextStep() {
  app.isGetUserInfo = true
  // 先登陆 再跳转
  login()
  .then(res => {
    hideLoading()
    if (res == ERR_OK) {
      wx.reLaunch({
        url: '../check-ins/check-ins',
      })
    } else {
      showToast('登录失败')
    }
  })
  .catch(err => {
    console.log(err)
  })
}
