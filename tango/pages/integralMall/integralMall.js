// pages/integralMall/integralMall.js
import { showItergralMall, exchangeGoods, userMessage, showLoading, hideLoading, showToast } from '../../utils/api'
const app = getApp().globalData;
let pageNum = 1
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList: [],
    userIntegralSales: 0,
    confirm_address: false
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
    pageNum = 1;
    this.getGoodsList()
    this.userMessage()
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
  // 查看我的订单
  seeMyOrder: function () {
    wx.navigateTo({
      url: '/pages/myorder/myorder',
    })
  },
  // 查看我的订单
  salesman_integral: function () {
    wx.navigateTo({
      url: '/pages/salesman_integral/salesman_integral',
    })
  },
  // 展示所有商品
  getGoodsList: function (options) {
    var that = this;
    showItergralMall({
      pageIndex: pageNum,
      pageSize: 10
    })
      .then(res => {
        that.setData({
          dataList: res.data.dataList
        })
      })
      .catch(err => {
        console.log(err)
      })
  },
  //兑换商品——wzb
  click_tab: function (e) {
    var id = this.data.dataList[e.target.id].id;
    if (!this.data.confirm_address) {
      wx.showModal({
        title: '提示',
        content: '请确认默认收货地址',
        showCancel: true,
        cancelText: '已确认',
        cancelColor: '',
        confirmText: '去查看',
        confirmColor: '',
        success: res => {
          if (res.confirm) {
            this.setData({
              confirm_address: true
            })
            wx.navigateTo({
              url: '/pages/shoppingaddress/shoppingaddress',
            })
          } else if (res.cancel) {
            this.setData({
              confirm_address: true
            })
            this.Exc_goods(id)
          }
        }
      })
    } else {
      this.Exc_goods(id)
    }
  },
  Exc_goods: function (id) {
    console.log(app.userInfo.token)
    exchangeGoods({
      openId: app.userInfo.token,
      trGoodsId: id
    })
      .then(res => {
        console.log(res.data.message)
        hideLoading()
        showToast(res.data.message)
        this.userMessage()
      })
      .catch(err => {
        console.log(err)
        hideLoading()
        showToast('兑换失败')
        this.userMessage()
      })
  },
  //查询用户信息
  userMessage: function () {
    // console.log(app.userInfo.token)
    userMessage({
      userOpenId: app.userInfo.token,
    })
      .then(res => {
        console.log("-----------")
        console.log(res)
        this.setData({
          userIntegralSales: res.data.data.userIntegralSales
        })
      })
      .catch(err => {
        console.log(err)
      })
  },
  // 上拉加载
  upper: function () {
    pageNum++;
    this.upper_getGoodsList()
  },
  upper_getGoodsList: function () {
    var that = this;
    showItergralMall({
      pageIndex: pageNum,
      pageSize: 10
    })
      .then(res => {
        that.setData({
          dataList: that.data.dataList.concat(res.data.dataList),
        })
        console.log(that.data.dataList)
      })
      .catch(err => {
        console.log(err)
      })
  },
  //下拉刷新
  refesh: function () {
    pageNum = 1;
    this.getGoodsList()
    console.log("下拉刷新")
  }
})