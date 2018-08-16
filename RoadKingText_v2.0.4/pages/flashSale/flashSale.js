var util = require('../../utils/util.js');
//获取应用实例
const app = getApp()
var day;
var shopping_index;
var total;
var body_color;
var title;
Page({
  data: {
    title: '路劲又一城周末秒杀活动',
    day,
    userInfo: null,
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    flashSale_info: {},
    shopping_index: null,
    imageinfo: null,
    model: null,
    version: null,
    platform: null,
    viewHeight:0
  },

  // 分享（标题）设置
  // ************************************************************
  onShareAppMessage: function() {
    return {
      title: this.data.title,
      desc: this.data.title,
      path: '/pages/flashSale/flashSale'
    }
  },
  // 图片自适应
  imageLoad: function(e) {
    var width = e.detail.width, //获取图片真实宽度
       height = e.detail.height,
        ratio = width/height; //图片的真实宽高比例
    var viewWidth = 750, //设置图片显示宽度，左右留有16rpx边距
      viewHeight = 750 / ratio/2; //计算的高度值
    console.log(viewHeight)
    // var image = this.data.images;
    // //将图片的datadata-index作为image对象的key,然后存储图片的宽高值
    // image[e.target.dataset.index] = {
    //   width: viewWidth,
    //   height: viewHeight
    // }
    this.setData({
      viewHeight: viewHeight
    })
  },
  // 查找所有商品
  // ************************************************************
  find_all_goods: function() {
    wx.request({
      url: 'https://yyc.tango007.com/yyc/Commodity/CommodityList',
      data: {
        x: '',
        y: ''
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: res => {
        console.log(res.data.list)
        this.setData({
          flashSale_info: res.data,
        })
      }
    })
  },

  // 下拉刷新页面
  // ************************************************************
  onPullDownRefresh: function() {
    wx.showLoading()
    wx.stopPullDownRefresh();
    var that = this;
    that.find_all_goods();
    wx.hideLoading()
  },

  // 页面加载
  // ************************************************************
  onLoad: function() {
    var that = this;
    that.find_all_goods()
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
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

  // 用户登录
  // ************************************************************
  getUserInfo: function(e) {
    if (e.detail.userInfo) {
      app.globalData.userInfo = e.detail.userInfo
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      })
    } else {
      console.log("用户拒绝开放权限")
    }
  },

  // 抢购判断
  // ************************************************************
  Immediate_buy: function(e) {
    wx.getSystemInfo({
      success: res => {
        this.setData({
          model: res.model,
          version: res.version,
          platform: res.platform
        })
      }
    })
    // wx.showLoading()
    this.setData({
      shopping_index: e.target.id
    })
    console.log(this.data.shopping_index)
    var good_id = this.data.flashSale_info.list[this.data.shopping_index].commodityNumber
    console.log(good_id)
    wx.request({
      url: 'https://yyc.tango007.com/yyc/Commodity/Commodityexposer',
      data: {
        "commodityNumber": good_id
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: res => {
        console.log(res);
        if (res.data.success) {
          if (res.data.data.md5) {
            console.log("有md5")
            var _md5 = res.data.data.md5;
            console.log("---_md5------" + _md5)
            var name = wx.getStorageSync("openId")
            console.log("name" + name)
            wx.request({
              url: 'https://yyc.tango007.com/yyc/Commodity/Commodityexecute',
              data: {
                "md5": _md5,
                "wechatOpenid": name,
                "commodityNumber": good_id,
                "wechatNicekname": this.data.userInfo.nickName,
                "wechatGender": this.data.userInfo.gender,
                "wechatLanguage": this.data.userInfo.language,
                "wechatCountry": this.data.userInfo.country,
                "wechatProvince": this.data.userInfo.province,
                "wechatCity": this.data.userInfo.city,
                "wechatModel": this.data.model,
                "wechatVersion": this.data.version,
                "wechatPhone": this.data.platform,
              },
              method: 'POST',
              header: {
                "Content-Type": "application/x-www-form-urlencoded"
              },
              success: res => {
                console.log("+++++++++++++_md5+++++++++++" + _md5)
                console.log(res);
                console.log(res.data.data.stateInfo)
                if (res.data.data.stateInfo == "秒杀成功") {
                  wx.switchTab({
                    url: '../mine/mine',
                  })
                }
                wx.showModal({
                  title: '提示',
                  content: res.data.data.stateInfo,
                  success: function(res) {
                    if (res.confirm) {
                      console.log('用户点击确定')
                    } else if (res.cancel) {
                      console.log('用户点击取消')
                    }
                  }
                })
              },
              fail: res => {
                console.log(res);
              },
              complete: function() {}
            })
          } else {
            wx.showModal({
              title: '提示',
              content: '抢购时间不符合',
              success: function(res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
            })
          }
        } else {
          console.log("000000000000")
        }
      },
      fail: res => {
        console.log(res);
      },
      complete: function() {}
    })
  },
})
// *****************************2018.5.28_wzb*******************************