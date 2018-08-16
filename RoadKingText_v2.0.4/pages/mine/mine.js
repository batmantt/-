//获取应用实例
const app = getApp()
var id;
var shopping_info;
var ex_Number;
var body_color;
Page({
  data: {
    id,
    userInfo: null,
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    shopping_info: {},
    shopping_index: null,
    hidden: true,
    nocancel: false,
    userPwd: "",
    searchinput: '',
    ex_Number,
    imageinfo:null,
  },
  exchange: function (e) {
    this.setData({
      shopping_index: e.target.id
    })
    var exchangeNumber = this.data.shopping_info[this.data.shopping_index].redemptionCode
    console.log("exchangeNumber" + exchangeNumber)
    this.setData({
      ex_Number: exchangeNumber,
      searchinput: '',
      userPwd: "",
      hidden: false
    });
  },
  passWdInput: function (e) {
    this.setData({
      userPwd: e.detail.value
    })
    console.log("passWdInput" + e.detail.value)
  },
  cancel: function () {
    this.setData({
      hidden: true
    });
  },
  confirm: function () {
    if (this.data.ex_Number == this.data.userPwd) {
      var name = wx.getStorageSync("openId")
      var goodsId = this.data.shopping_info[this.data.shopping_index].commodityNumber
      wx.request({
        url: 'https://yyc.tango007.com/yyc/Orders/updateOrderReceice',
        data: {
          "commodityNumber": goodsId,
          "wechatOpenid": name
        },
        method: 'POST',
        header: { "Content-Type": "application/x-www-form-urlencoded" },
        success: res => {
          var that = this;
          that.find_pay()
          wx.showModal({
            title: '提示',
            content: '兑换成功',
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定')
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        }
      })
      var that = this;
      that.find_pay()
    } else {
      wx.showModal({
        title: '提示',
        content: '兑换码错误请重试',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
    this.setData({
      hidden: true
    });
  },
  onPullDownRefresh: function () {
    wx.showLoading()
    if (app.globalData.userInfo) {
      var that = this;
      that.find_pay()
    } else {
      wx.showModal({
        title: '提示',
        content: '请完成先登录',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
            wx.switchTab({
              url: '../mine/mine',
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
    wx.stopPullDownRefresh();
    wx.hideLoading()
    this.setData({
      id: wx.getStorageSync("sigId")
    })
  },
  onShow: function () {
    if (wx.getStorageSync("openId")) {
      if (app.globalData.userInfo) {
        var that = this;
        that.find_pay()
        console.log("wx.getStorageSync('openId')------>" + wx.getStorageSync("openId"))
      }
    } else {
      console.log("没有获取openId")
    }
    //显示图片
    wx.request({
      url: 'https://yyc.tango007.com/yyc/Image/ImageList',
      data: {
        x: '',
        y: ''
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: res => {
        console.log(res)
        this.setData({
          imageinfo: res.data.list
        })
      }
    })
  },
  onLoad: function () {
    this.setData({
      id: wx.getStorageSync("sigId")
    })
    if (app.globalData.userInfo) {
      var that = this;
      that.find_pay()
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  find_pay: function () {
    var name = wx.getStorageSync("openId")
    wx.request({
      url: 'https://yyc.tango007.com/yyc/Orders/queryByIdOrders',
      data: {
        "wechatOpenid": name,
      },
      method: 'POST',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      success: res => {
        console.log(res.data)
        this.setData({
          shopping_info: res.data.list
        })
      }
    }),
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
  },
  payoff: function (e) {
    var that = this;
    that.find_pay()
    this.setData({
      shopping_index: e.target.id
    })
    wx.showLoading()
    var that = this;
    wx.login({
      success: function (res) {
        that.getOpenId(res.code);
      }
    });
  },
  //获取openid
  getOpenId: function (code) {
    var that = this;
    wx.request({
      url: 'https://yyc.tango007.com/yyc/We/code?code=' + code,
      method: 'GET',
      header: {
        'content-type': 'application/json' // 默认值
      },
      data: {
        x: '',
        y: ''
      },
      success: function (res) {
        var openId = res.data.openid.openid;
        console.log('获取openid==' + openId)
        that.xiadan(openId);
      }
    })
  },
  //下单
  xiadan: function (openId) {
    var shopping_seckillId = this.data.shopping_info[this.data.shopping_index].commodityNumber
    var shopping_name = this.data.shopping_info[this.data.shopping_index].commodity.commodityName
    var shopping_price = this.data.shopping_info[this.data.shopping_index].commodity.commoditySpecialPrice
    console.log(typeof (shopping_seckillId) + typeof (shopping_name) + typeof (shopping_price))
    console.log(shopping_seckillId + shopping_name + typeof shopping_price)
    var that = this;
    wx.request({
      url: 'https://yyc.tango007.com/yyc/We/Xiadan?openid=' + openId + '&ip=192.168.3.142&seckillid=' + shopping_seckillId + '&name=' + shopping_name + '&price=' + shopping_price,
      method: 'GET',
      header: {
        'content-type': 'application/json' // 默认值
      },
      data: {
        x: '',
        y: ''
      },
      success: function (res) {
        console.log("888888888888888888888------------"+shopping_seckillId);
        var prepay_id = res.data.req_id;
        console.log("统一下单返回 prepay_id==" + prepay_id);
        that.sign(prepay_id);
      }
    })
  },
  //签名
  sign: function (prepay_id) {
    var that = this;
    wx.request({
      url: 'https://yyc.tango007.com/yyc/We/repayid?repay_id=' +
      prepay_id,
      method: 'GET',
      header: {
        'content-type': 'application/json' // 默认值
      },
      data: {
        x: '',
        y: ''
      },
      success: function (res) {
        console.log(res.data.js)
        that.requestPayment(res.data.js);
      }
    })
  },
  //申请支付
  requestPayment: function (obj) {
    wx.hideLoading()
    wx.requestPayment({
      'timeStamp': obj.timeStamp,
      'nonceStr': obj.nonceStr,
      'package': obj.package,
      'signType': obj.signType,
      'paySign': obj.paySign,
      'success': function (res) {
      },
      'fail': function (res) {
        console.log(res)
      }
    })
  },
  getUserInfo: function (e) {
    if (e.detail.userInfo) {
      app.globalData.userInfo = e.detail.userInfo
      var that = this;
      that.find_pay()
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      })
    } else {
      console.log("用户拒绝开放权限")
    }
  },
})
