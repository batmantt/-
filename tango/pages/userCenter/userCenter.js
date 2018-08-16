// pages/userCenter/userCenter.js
import { isGetUserInfo, login } from '../../utils/login'
import { ERR_OK } from '../../utils/config'
import { showLoading, hideLoading, showToast } from '../../utils/api'
const app = getApp().globalData

Page({

  /**
   * 页面的初始数据
   */
  data: {
    app_userInfo: null,
    isCustomer: false,
    headImg: '',
    userName: '',
    myItergral: 0,           //我的积分
    myItergralSpeed: 1        // 我的积分加速
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (res) {
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
    if (getApp().globalData.userInfo) {
      login().then(res => {
        this.getItergralInfo()
        this.setData({
          isCustomer: app.userInfo.role == '推广员' ? true : false
        })
      })
    }
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
  // 显示我的积分和积分加速
  getItergralInfo: function () {
    //console.log(app.userInfo.user.userName)
    this.setData({
      userName: app.userInfo.user.userName != null ? app.userInfo.user.userName : app.selfInfo.nickName,
      myItergral: app.userInfo.user.userIntegral != null ? app.userInfo.user.userIntegral : 0,
      myItergralSpeed: app.userInfo.user.userIntegralSpeed != null ? app.userInfo.user.userIntegralSpeed : 1,
      headImg: app.selfInfo.avatarUrl == '' ? 'https://tango.heeyhome.com/upload/images/headimg.jpg' : app.selfInfo.avatarUrl
    })
  },
  // 查看积分明细
  getItergralList: function () {
    wx.navigateTo({
      url: '/pages/integralList/integralList',
    })
  },
  // 查看积分加速
  getItergralAddSpeed: function () {
    wx.navigateTo({
      url: '/pages/itergralAddSpeed/itergralAddSpeed',
    })
  },
  // 查看系统消息
  getSystemNews: function () {
    wx.navigateTo({
      url: '/pages/systemNews/systemNews',
    })
  },
  // 账户设置
  userSet: function () {
    wx.navigateTo({
      url: '/pages/userSetup/userSetup',
    })
  },
  //收获地址
  shippingAddress: function () {
    wx.navigateTo({
      url: '/pages/shoppingaddress/shoppingaddress',
    })
  },
  // 积分商城
  goItergralMall: function () {
    wx.navigateTo({
      url: '/pages/integralMall/integralMall',
    })
  },
  // 查看我的二维码
  getMyQrCode: function () {
    // wx.navigateTo({
    //   url: '/pages/qrcode/qrcode',
    // })
    showToast("功能暂未开放")
  },
  // 关于tango
  aboutMenu: function () {
    wx.reLaunch({
      url: '/pages/purchase/purchase',
    })
  },
  // 用户同意之后下一步
  nextStep: function () {
    app.isGetUserInfo = true
    // 先登陆 再跳转
    login()
      .then(res => {
        hideLoading()
        if (res == ERR_OK) {
          this.getItergralInfo()
          showToast("登陆成功")
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