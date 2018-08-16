// pages/myorder/myorder.js
import { listTradeRecord } from '../../utils/api'
const app = getApp().globalData;
var pageNum = 1
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList: [],
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
    this._listTradeRecord()
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
  _listTradeRecord: function () {
    console.log(app.userInfo.token)
    listTradeRecord({
      userOpenId :app.userInfo.token,
      pageIndex: pageNum,
      pageSize:1000
    })
      .then(res => {
        console.log(res)
        this.setData({
          dataList: res.data.dataList
        })
      })
      .catch(err => {
        console.log(err)
      })
  },
})