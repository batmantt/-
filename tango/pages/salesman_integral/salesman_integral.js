// pages/integralList/integralList.js
const app = getApp().globalData;
import { showToast, listGmv } from '../../utils/api'
import { base_url } from '../../utils/config'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    itergralList: [],
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
    this._getlistGmv()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({
      itergralList: []
    })
    console.log("onHide")
    console.log(this.data.itergralList)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.setData({
      itergralList: []
    })
    console.log("onUnload")
    console.log(this.data.itergralList)
  },


  // 获得积分明细列表
  _getlistGmv: function () {
    wx.request({
      url: base_url+'/tg/wx/integral/listGmv',
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
        var date01_List = this._formdate01(res.data.dataList)
        this.setData({
          itergralList: res.data.dataList
        })
        console.log("this.data.itergralList")
        console.log(this.data.itergralList)
      },
      fail: function (res) {
        console.log(res);
      }
    })
  },
  //日期格式转换
  _formdate01: function (list) {
    list.forEach((item, index) => {
      var d = new Date(item.gmvTime);
      var s = new Date(item.exchangeTime);
      var dformat = [d.getFullYear().toString().substr(2, 2),this.p(d.getMonth() + 1), this.p(d.getDate())].join('-');
      var dformat1 = [s.getFullYear().toString().substr(2, 2),this.p(s.getMonth() + 1), this.p(s.getDate())].join('-');
      item.newDate = dformat;
      item.newDate1 = dformat1
    })
  },
  //日期补位
  p: function (s) {
    return s < 10 ? '0' + s : s;
  }
})