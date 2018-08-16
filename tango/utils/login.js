// 登录
import { userLogin } from './api'
import { ERR_OK } from './config'
const app = getApp().globalData


function login() {
  let selfInfo = app.selfInfo
  // 登录
  return new Promise((resolve, reject) => {
    wx.login({
      success: res => {
        var id = wx.getStorage({
          key: 'showOpenId',
          success: function (res) { },
        })
        userLogin({
          appId: 'wx5af7ff61e91b9f37',
          jsCode: res.code,
          userCity: selfInfo.city,
          userHeadUrl: selfInfo.avatarUrl,
          userName: selfInfo.nickName,
          userOpenId: getApp().globalData.s_openid
        }).then(res => {
          if (res.data.code == ERR_OK) {
            // 登录之后把获取到的用户信息放到全局
            app.userInfo = res.data.data
            console.log(app.userInfo)
            resolve(200)
          } else {
            reject(400)
          }
        }).catch(err => {
          console.log(res.code)
          console.log(err)
        })
      },
      fail: function () {
        console.log('fail')
      }
    })
  })
}
// 用户是否同意读取其身份信息
function isGetUserInfo() {
  return new Promise((resolve, reject) => {
    wx.getSetting({
      success: res => {
        // 说明已经允许获取用户信息
        if (res.authSetting['scope.userInfo']) {
          // 同意
          resolve(200)
          console.log("用户同意读取其身份信息")
        } else {
          // 不同意
          reject(400)
          console.log("用户 ***不 同意读取其身份信息")
        }
      },
      fail: err => {
        reject(err)
      }
    })
  })
}

function openSetting() {
  wx.openSetting({
    success: res => {
      // console.log(res)
    }
  })
}

export { login, isGetUserInfo, openSetting }