// pages/itergralAddSpeed/itergralAddSpeed.js
const app = getApp().globalData;
import { showToast, getItergralAddSpeed } from '../../utils/api'
let pageNum = 1;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    noMessage: true,
    speedList: []
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
    pageNum = 1
    this._getAddSpeedList()
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
  // 获取积分加速列表
  _getAddSpeedList: function () {
    console.log(pageNum)
    getItergralAddSpeed({
      userOpenId: app.userInfo.token,
      pageIndex: pageNum,
      pageSize: 10
    })
    .then(res => {
      console.log(res)
      let list = res.data.dataList;
      if (list.length == 0 && pageNum == 1) {
        this.setData({
          noMessage: true
        })
      } else if (list.length == 0){
        showToast('到底了')
      } else {
        this.setData({
          noMessage: false,
          speedList: this.data.speedList.concat(list)
        })
      }
    })
    .catch(err => {
      console.log(err)
    })
  },
  _setAddList: function (list) {
    console.log(list)
  },
  upper: function () {
    pageNum++
    this._getAddSpeedList()
  }
})