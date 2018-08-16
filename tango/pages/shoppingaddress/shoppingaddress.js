// pages/shoppingaddress/shoppingaddress.js
import { ERR_OK, base_url } from '../../utils/config'
import { showLoading, hideLoading, showToast, listAddress } from '../../utils/api'
const app = getApp().globalData
Page({

  /**
   * 页面的初始数据
   */
  data: {
    exists: true,
    addresslist: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    console.log('onload')
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
    this.findaddress()
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
  //添加地址按钮
  _add_address: function () {
    wx.navigateTo ({
      url: "/pages/Addsite/Addsite?modify&id",
    })
  },
  //修改地址按钮
  modify_button: function (e) {
    var id = e.currentTarget.id;
    wx.navigateTo({
      url: "/pages/Addsite/Addsite?modify=1&name=" + this.data.addresslist[id].name + "&province=" + this.data.addresslist[id].province + "&city=" + this.data.addresslist[id].city + "&area=" + this.data.addresslist[id].area + "&addressDetails=" + this.data.addresslist[id].addressDetails + "&phoneNum=" + this.data.addresslist[id].phoneNum + "&id=" + this.data.addresslist[id].id + "&defaultAddress=" + this.data.addresslist[id].defaultAddress,
    })
  },
  //显示用户地址
  findaddress: function () {
    console.log("所有地址")
    wx.request({
      url: base_url + '/tg/wx/user/listAddress',
      header: {
        'content-type': 'application/json',
      },
      method: 'POST',
      data: {
        "pageIndex": 0,
        "pageSize": 10000,
        "userOpenId": app.userInfo.user.userOpenId,
      },
      success: res => {
        console.log(res);
        if (res.data.code == ERR_OK) {
          this.setData({
            addresslist: res.data.dataList,
            exists: true
          })
        } else {
          this.setData({
            exists: false,
          })
        }
      },
      fail: function (res) {
        console.log(res);
      }
    })
  }
})