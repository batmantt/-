// pages/integralList/integralList.js
const app = getApp().globalData;
import { showToast, getItergralList } from '../../utils/api'
let pageNum = 1;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    itergralList: [],
    noMessage: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("onLoad")
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log("onReady")
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    pageNum = 1;
    this._getItergralList()
    console.log("onShow")
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
  // 获得积分明细列表
  _getItergralList: function () {
    // console.log(pageNum)
    getItergralList({
      userOpenId: app.userInfo.token,
      pageIndex: pageNum,
      pageSize: 10
    })
      .then(res => {
        // console.log(res)
        if (res.data.dataList.length == 0 && pageNum == 1) {
          this.setData({
            noMessage: true
          })
        } else if (res.data.dataList.length == 0) {
          showToast('到底了')
        } else {
          // 先去添加+-号
          let newList = this._forIterGralList(res.data.dataList)
          let date01_List = this._formdate01(res.data.dataList)
          this.setData({
            itergralList: this.data.itergralList.concat(newList)
          })
        }
      })
      .catch(err => {
        console.log(err)
      })
  },
  //日期格式转换
  _formdate01: function (list) {
    list.forEach((item, index) => {
      var d = new Date(item.createdAt);
      var dformat = [d.getMonth() + 1, this.p(d.getDate())].join('-');
      var dformat01 = [this.p(d.getHours()), this.p(d.getMinutes())].join(':');
      item.newDate = dformat
      item.newDate01 = dformat01
    })
  },
  //日期补位
  p: function (s) {
    return s < 10 ? '0' + s : s;
  },
  // 遍历数据列表，添加参数
  _forIterGralList: function (list) {
    list.forEach((item, index) => {
      item.isAdd = ('' + item.integralValue).charAt(0) == '-' ? false : true
    })
    return list
  },
  // 触底加载更多数据
  upper: function () {
    pageNum++
    this._getItergralList()
  }
})