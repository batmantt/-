// pages/searchAddress/searchAddress.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cityList: ["上海市", "常熟市", "无锡市", "太仓市"],
    flag: 0,
    nearbyAddressList: ["SM广场", "SM广场"],
    city: "苏州",
    searchAddress: [{}, {}, {}], //输入框搜索结果
    inputValue: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  // 选择城市
  changeCityBtn: function() {
    let that = this
    that.setData({
      flag: 1
    })
    console.log(that.data.flag)
  },
  chooseOneCity(e) {
    let that = this
    that.setData({
      city: that.data.cityList[e.target.id],
      flag: 0
    })
    console.log(that.data.flag)
  },
  //光标获取焦点
  focus() {
    let that = this
    that.setData({
      flag: 2
    })
  },
  //关闭输入搜索页面
  close() {
    console.log(this.data.inputValue)
    this.setData({
      inputValue: "",
      flag: 0
    })
  },
  bindinput(e){
    console.log(e.detail.value)
    this.setData({
      inputValue: e.detail.value
    })
  }
})