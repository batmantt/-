// pages/rules-of-sign/rules-of-sign.js
import { isGetUserInfo, login } from '../../utils/login'
import { showLoading, hideLoading, showToast, userShare } from '../../utils/api'
import { ERR_OK, base_url } from '../../utils/config'
const app = getApp().globalData;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    app_userInfo: null,
    retcardnumber: 0,
    invitenumber: 0,
    cardused: 0,
    totalcard: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (getApp().globalData.userInfo) {
      this._retroative_card_Status()
    }
    console.log("onload")
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
    this.setData({
      app_userInfo: getApp().globalData.userInfo
    })
    showLoading()
    // 用户是否同意读取其身份信息
    isGetUserInfo()
      .then(res => {
        if (res == ERR_OK) {
          // 如果授权就获取其信息保存在selfInfo里面
          wx.getUserInfo({
            success: res => {
              // 微信自带的用户信息
              app.selfInfo = res.userInfo
              console.log("去登陆。。。。")
              this.nextStep()
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
  // 下拉刷新回调接口
  onPullDownRefresh: function () {
    showToast("刷新成功！")
    if (getApp().globalData.userInfo) {
      this._retroative_card_Status()
    }
    wx.stopPullDownRefresh();
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    console.log("执行页面分享")
    return {
      success: res => {
        showToast('分享成功')
        console.log("分享成功")
      },
      fail: function (err) {
        console.log(err.errMsg)
      },
      title: 'Tango小程序签到~~',
      path: 'pages/check-ins/check-ins?openid=' + app.userInfo.user.userOpenId,
      imageUrl: 'https://tango.heeyhome.com/upload/images/share_20180606111950.jpg',
    }
  },
  //补签卡信息
  _retroative_card_Status: function () {
    console.log("执行查询补签卡信息")
    wx.request({
      url: base_url + "/tg/wx/sign/retroativeStatus",
      method: 'POST',
      data: {
        "userOpenId": app.userInfo.token,
      },
      header: { 'content-type': 'application/json' },
      success: res => {
        console.log(res)
        this.setData({
          retcardnumber: res.data.data.retroactiveCardNumber,
          invitenumber: res.data.data.invitatieNumber,
          cardused: res.data.data.usedNumber,
          totalcard: res.data.data.invitatieNumber
        })
        // wx.hideLoading()
      },
      fail: function (err) {
        console.log(res)
        // wx.hideLoading()
      }
    })
  },
  //登陆Tango
  getUserInfo: function (e) {
    // 如果用户同意授权，是可以获得到userInfo的
    if (e.detail.userInfo) {
      showLoading()
      app.selfInfo = e.detail.userInfo
      console.log(app)
      this.nextStep()
    }
  },
  // 用户同意之后下一步
  nextStep: function () {
    app.isGetUserInfo = true
    // 先登陆 再跳转
    login()
      .then(res => {
        hideLoading()
        if (res == ERR_OK) {
          this._retroative_card_Status()
          // showToast("登陆成功")
          console.log("登陆成功##############")
          console.log(app)
          this.setData({
            app_userInfo: getApp().globalData.userInfo
          })
        } else {
          showToast('登录失败')
        }
        this.setData({
          isCustomer: app.userInfo.role == '推广员' ? true : false
        })
      })
      .catch(err => {
        console.log(err)
      })
  }
})