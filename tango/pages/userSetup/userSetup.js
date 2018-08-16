// pages/userSetup/userSetup.js

import { showToast, showLoading, hideLoading, sendQrCode, bindPhone, updateUserInfo } from '../../utils/api'
import { ERR_OK } from '../../utils/config'

const app = getApp().globalData
let userName = undefined
let phoneNumber = undefined
let Code = undefined
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userName: '',
    already: false,
    isFixed: false,
    area: ['省份', '城市', '区县'],
    sexArr: ['性别', '男', '女'],
    sexIndex: 0,
    canSendQrCode: true,
    second: 60,
    phoneNumber: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 集中到变量
    this.setData({
      userName: app.userInfo.user.userName != null ? app.userInfo.user.userName : app.selfInfo.nickName,
      area: app.userInfo.user.userCity.indexOf('-') == -1 ? ['省份', '城市', '区县'] : app.userInfo.user.userCity.split('-'),
      sexIndex: app.userInfo.user.userSex != null ? app.userInfo.user.userSex == 1 ? 1 : 2 : app.selfInfo.gender == 1 ? 1 : 2,
      phoneNumber: app.userInfo.user.userTelephone != null ? app.userInfo.user.userTelephone : false
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // },
  // 获取用户输入姓名
  bindUserName: function (e) {
    this.setData({
      userName: e.detail.value
    })
  },
  // 点击选择地区
  getArea: function (e) {
    this.setData({
      area: e.detail.value
    })
  },
  // 选择性别
  selectSex: function (e) {
    this.setData({
      sexIndex: e.detail.value
    })
  },
  // 点击绑定手机号
  bindPhoneNumber: function () {
    if(this.data.already) {
      return
    } else {
      this.setData({
        isFixed: true
      })
    }
  },
  // 取消绑定手机号
  reduceBindPhone: function () {
    this.setData({
      isFixed: false
    })
  },
  // 获取用户输入手机号码
  getUserPhone: function (e) {
    phoneNumber = e.detail.value
  },
  // 获取用户输入验证码
  bindQrCode: function (e) {
    Code = e.detail.value
  },
  // 手机号码的正则表达式验证
  isPoneAvailable: function (str) {
    var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
    if (!myreg.test(str)) {
      return false;
    } else {
      return true;
    }
  },
  // 发送验证码
  sendCode: function () {
    // 如果60秒以前发送过 就不能再次发送
    if (!this.data.canSendQrCode) {
      return
    }
    // 如果手机号输入正确
    if (this.isPoneAvailable(phoneNumber)) {
      sendQrCode({
        phoneNumbers: phoneNumber
      })
        .then(res => {
          this.setData({
            canSendQrCode: false
          })
          this.interval = setInterval(() => {
            this.setData({
              second: (this.data.second - 1)
            })
            if (this.data.second == 0) {
              this.setData({
                canSendQrCode: true,
                second: 60
              })
              clearInterval(this.interval)
            }
          }, 1000)
          // 如果发送成功则按钮颜色变化 并且不能点击
        })
        .catch(err => {
          console.log(err)
        })
    } else {
      showToast('输入手机号有误')
    }
  },
  // 绑定手机号码
  confirmPhone: function () {
    if (!this.isPoneAvailable(phoneNumber)) {
      showToast('手机号输入有误')
    } else if (Code.length < 6) {
      showToast('验证码输入有误')
    } else {
      bindPhone({
        userOpenId: app.userInfo.token,
        code: Code,
        userTelephone: phoneNumber
      })
        .then(res => {
          // console.log(res)
          if (res.data.code == ERR_OK) {
            this.setData({
              phoneNumber: phoneNumber,
              isFixed: false,
              already: true
            })
          } else {
            showToast(res.data.message)
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  // 更新用户信息
  updateUserInfo: function () {
    if (!this.data.userName || this.trim(this.data.userName).length < 2) {
      showToast('用户昵称位数不得小于2')
    } else if (this.data.area[0] == '省份') {
      showToast('请选择地区')
    } else if (this.data.sexIndex == 0) {
      showToast('请选择用户性别')
    } else if (!this.data.phoneNumber) {
      showToast('请绑定手机号码')
    } else {
      updateUserInfo({
        userName: this.data.userName,
        userOpenId: app.userInfo.token,
        userCity: this.forArea(this.data.area),
        userSex: this.data.sexIndex,
        id: app.userInfo.user.id,
        userTelephone: this.data.phoneNumber
      })
      .then(res => {
        // console.log(res)
        if (res.data.code == ERR_OK) {
          showLoading()
          setTimeout(() => {
            hideLoading()
            wx.reLaunch({
              url: '/pages/userCenter/userCenter',
            })
          }, 500)
        } else {
          showToast('昵称已存在！')
        }
      })
      .catch(err => {
        console.log(err)
      })
    }
  },
  // 遍历用户地址变成字符串
  forArea: function (arr) {
    let str = '';
    for(var i = 0;i<arr.length;i++) {
      str = str + (i == arr.length-1 ? arr[i] : arr[i] + '-')
    }
    return str
  },
  // 去除空格方法
  trim: function(str){
    return str.replace(/(^\s*)|(\s*$)/g, "");
  }
})