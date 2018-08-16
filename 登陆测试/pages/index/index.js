//index.js
//获取应用实例
const app = getApp()
var usre_latitude
var user_longitude
Page({
  data: {
    dataList: null,
  },
  onLoad: function () {
    // wx.chooseLocation({
    //   success: res => {
    //     console.log(res, "location")
    //     console.log(res.name)
    //     console.log(res.latitude)
    //     console.log(res.longitude)
    //   },
    //   fail: function () {
    //     // fail
    //   },
    //   complete: function () {
    //     // complete
    //   }
    // })
    this.getuser_lacation()
    
  },
  _get_shop_location: function () {
    console.log("获取商户信息")
    wx.request({
      url: 'http://192.168.43.244:8888/tg/wx/store/listShopByComm',
      header: {
        'content-type': 'application/json',
      },
      method: 'POST',
      data: {
      },
      success: res => {
        console.log("+++++++++++++++++++++++++++++++")
        console.log(res)
        this.setData({
          dataList: res.data.dataList
        })
        this.location_formdate(res.data.dataList)
      },
      fail: function (res) {
        console.log(res);
      }
    })
  },
  // 距离转换
  location_formdate: function (list) {
    console.log("执行距离转换")
    list.forEach((item, index) => {
      // 经度
      var shop_Longitude = item.shopLongitude
      // 纬度
      var shop_Latitude = item.shopLatitude
      var dis = this.distance(shop_Latitude, shop_Longitude, usre_latitude, user_longitude)
      console.log(dis)
      item.distance = dis
    })
  },
  // 获取用户位置
  getuser_lacation: function () {
    console.log("执行获取用户经纬度")
    wx.getLocation({
      type: 'wgs84',
      success: res => {
        usre_latitude = res.latitude
        user_longitude = res.longitude
        console.log(usre_latitude, user_longitude)
        this._get_shop_location()
      }
    })
  },
  // 计算距离
  distance: function (la1, lo1, la2, lo2) {
    console.log(la1, lo1, la2, lo2)
    console.log("执行计算距离")
    var La1 = la1 * Math.PI / 180.0;
    var La2 = la2 * Math.PI / 180.0;
    var La3 = La1 - La2;
    var Lb3 = lo1 * Math.PI / 180.0 - lo2 * Math.PI / 180.0;
    var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(La3 / 2), 2) + Math.cos(La1) * Math.cos(La2) * Math.pow(Math.sin(Lb3 / 2), 2)));
    s = s * 6378.137;//地球半径
    s = Math.round(s * 10000) / 10000;
    console.log("计算结果：")
    return s
  },
})
