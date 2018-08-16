// pages/qrcode/qrcode.js
import { ERR_OK, base_url } from '../../utils/config'
import { showLoading, hideLoading, showToast, listAddress } from '../../utils/api'
const app = getApp().globalData
Page({

  /**
   * 页面的初始数据
   */
  data: {
    back_list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.find_all_back()
    console.log("我的二维码")
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
  onShareAppMessage: function () {

  },
  //申请按钮
  to_apply: function (e) {
    console.log(e.currentTarget.id)
    wx.navigateTo({
      url: '/pages/apply_code/apply_code?back_name=' + this.data.back_list[e.currentTarget.id].cardName
    })
  },
  //展示银行信息
  find_all_back: function () {
    wx.request({
      url: base_url + '/tg/wx/user/listBank',
      header: {
        'content-type': 'application/json',
      },
      method: 'POST',
      data: {},
      success: res => {
        console.log(res);
        if (res.data.code == ERR_OK) {
          this.setData({
            back_list: res.data.dataList,
          })
        }
      },
      fail: function (res) {
        console.log(res);
      }
    })
  }
})