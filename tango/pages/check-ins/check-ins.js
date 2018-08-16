// pages/check-ins/check-ins.js
import { login, isGetUserInfo, openSetting } from '../../utils/login'
import { showLoading, hideLoading, showToast, userSignList, userSign, userShare, getSixRecords, signStatus, retroactive, retroativeStatus } from '../../utils/api'
import { ERR_OK, base_url } from '../../utils/config'
const app = getApp().globalData;
let startY = undefined;
const today = new Date().getDate();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    receive: true,
    seven_day_sign: false,
    app_userInfo: null,
    no_addcard: true,
    addsign_isFixed: false,
    retcardnumber: 0,
    nosignday: 0,
    s_day: 0,
    signed: false,
    rollback00: false,
    rollback01: false,
    rollback02: false,
    rollback03: false,
    rollback04: false,
    rollback05: false,
    flipped: false,
    sign_day: [0, 0, 0, 0, 0, 0, 0],
    signReward: [],
    isFixed: false,
    click_id: '',
    sixrecordslist: [],
    signed_7: false
  },

  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function (res) {
    this.setData({
      app_userInfo: getApp().globalData.userInfo
    })
    //接受分享页面传参openid
    getApp().globalData.s_openid = res.openid
    showLoading()
    // 用户是否同意读取其身份信息
    isGetUserInfo()
      .then(res => {
        if (res == ERR_OK) {
          // 如果授权就获取其信息保存在selfInfo里面
          wx.getUserInfo({
            success: res => {
              // 微信自带的用户信息
              app.selfInfo = res.userInfo
              console.log("去登陆。。。。")
              this.nextStep()
            }
          })
          // 已经获取到信息的标志
        } else {
          // 暂时留在本页面
        }
      })
      .catch(err => {
        hideLoading()
        console.log(err)
      })

    var that = this;
    //取出六条随机积分奖励
    wx.getStorage({
      key: 'sixrecordslist',
      success: function (res) {
        console.log("getStorage_sixrecordslist")
        console.log(res.data)
        that.setData({
          signReward: res.data
        })
      }
    })
    //取出选择的牌 编号
    wx.getStorage({
      key: 'select_id',
      success: res => {
        console.log("getStorage_select_id")
        console.log(res.data)
        that.setData({
          click_id: res.data
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log("onShow")
    console.log("onShow")
    if (getApp().globalData.userInfo) {
      //获取用户签到列表
      this._userSignList()
      //获取补签卡信息
      this._retroative_card_Status()
    }
    this.setData({
      app_userInfo: getApp().globalData.userInfo
    })
  },
  //登陆Tango
  getUserInfo: function (e) {
    // 如果用户同意授权，是可以获得到userInfo的
    if (e.detail.userInfo) {
      showLoading()
      app.selfInfo = e.detail.userInfo
      console.log(app)
      this.nextStep()
    }
  },
  // 文章连接跳转
  article: function () {
    wx.navigateTo({
      url: '../article/article'
    })
  },

  // 签到天数数组转换
  transform: function () {
    console.log("执行签到天数转换")
    for (var i = 0; i < this.data.s_day; i++) {
      this.data.sign_day[i] = 1;
    }
    this.setData({
      sign_day: this.data.sign_day
    })
  },
  rules_of_sign: function () {
    wx.navigateTo({
      url: '../rules-of-sign/rules-of-sign',
    })
  },
  //页面分享
  onShareAppMessage: function () {
    console.log("执行页面分享")
    return {
      success: res => {
        this.setData({
          isFixed: false,
          addsign_isFixed: false
        })
        showToast('分享成功')
        console.log("分享成功")
      },
      fail: function (err) {
        console.log(err.errMsg)
      },
      title: 'Tango小程序签到~~',
      path: 'pages/check-ins/check-ins?openid=' + app.userInfo.user.userOpenId,
      imageUrl: 'https://tango.heeyhome.com/upload/images/share_20180606111950.jpg',
    }
  },

  //签到
  qianDao: function (e) {
    wx.setStorage({
      key: 'signed_7',
      data: 'false',
    })
    console.log("执行签到")
    userSign({
      userOpenId: app.userInfo.token,
      signRewardId: this.data.signReward[this.data.click_id].id
    })
      .then(res => {
        if (res.data.code == ERR_OK) {
          this.setData({
            signed: true,
          })
          // 签到成功之后更新一下用户信息
          this._userSignList()
          this._retroative_card_Status()
        } else {
          showToast(res.data.message)
        }
      })
      .catch(err => {
        console.log(err)
      })
  },
  //第七天 签到
  qianDao_7: function (e) {
    console.log("----------------------第七天------------------------------")
    userSign({
      userOpenId: app.userInfo.token,
      sevenDay: 7
    })
      .then(res => {
        if (res.data.code == ERR_OK) {
          // this.sevendaysign()
          this.setData({
            signed: true,
            signed_7: true,
            seven_day_sign: true,
          })
          wx.setStorage({
            key: 'signed_7',
            data: 'true',
            success: function (res) {
              console.log(res)
            }
          })
          this._userSignList()
          this._retroative_card_Status()
        } else {
          showToast(res.data.message)
        }
      })
      .catch(err => {
        console.log(err)
      })
  },
  //获取签到列表
  _userSignList: function () {
    console.log("执行获取签到列表")
    userSignList({
      userOpenId: app.userInfo.token,
    })
      .then(res => {
        console.log("获取签到列表")
        console.log(res)
        if (res.data.code == ERR_OK) {
          this.setData({
            // 签到天数
            s_day: res.data.data.daysNumber,
            // 签到状态
            nosignday: res.data.data.days,
          })
          if (res.data.data.daysNumber != 0) {
            if (res.data.data.days == 0) {
              console.log("初始判断 今日已签到")
              this.setData({
                signed: true,
              })
            }
          }
        } else {
          console.log(res)
        }
        this.transform()
      })
      .catch(err => {
        console.log(err)
      })
  },
  //补签卡信息
  _retroative_card_Status: function () {
    console.log("执行查询补签卡信息")
    wx.request({
      url: base_url + "/tg/wx/sign/retroativeStatus",
      method: 'POST',
      data: {
        "userOpenId": app.userInfo.token,
      },
      header: { 'content-type': 'application/json' },
      success: res => {
        console.log("补签卡信息")
        console.log(res)
        this.setData({
          retcardnumber: res.data.data.retroactiveCardNumber,
        })
      },
      fail: function (err) {
        console.log(res)
      }
    })
  },
  //补签接口
  retcard_btn: function () {
    wx.setStorage({
      key: 'signed_7',
      data: 'false',
    })
    console.log("执行补签")
    wx.request({
      url: base_url + "/tg/wx/sign/retroactive",
      method: 'POST',
      data: {
        "userOpenId": app.userInfo.token,
      },
      header: { 'content-type': 'application/json' },
      success: res => {
        if (res.data.code == ERR_OK) {
          showToast('补签成功')
          this.sign_btn()
        }
        this._userSignList()
        this._retroative_card_Status()
      },
      fail: function (err) {
        console.log(res)
      }
    })
    this.setData({
      addsign_isFixed: false,
    })
  },

  //重新开始签到按钮
  restart: function () {
    this.setData({
      addsign_isFixed: false,
      isFixed: true,
      signed: false,
      rollback00: false,
      rollback01: false,
      rollback02: false,
      rollback03: false,
      rollback04: false,
      rollback05: false,
      flipped: false,
    })
    this._getSixRecords()
  },
  //签到赚积分 按钮
  sign_btn: function () {
    this.show_tick()
    for (var i = 0; i < 7; i++) {
      this.data.sign_day[i] = 0;
    }
    this.setData({
      sign_day: this.data.sign_day
    })
    wx.showLoading({
      title: '加载中...'
    })
    this._userSignList()
    this._retroative_card_Status()
    setTimeout(this.judge_sig, 300)
  },

  // 判断签到
  judge_sig: function () {
    if (this.data.s_day == 6) {
      if (this.data.nosignday == 0) {
        hideLoading()
        console.log("今日已签到")
        this.setData({
          signed: true,
          flipped: true,
          isFixed: true,
        })
      } else {
        console.log("第七天签到")
        this.qianDao_7()
        wx.hideLoading()
      }
    } else if (this.data.s_day == 7) {
      wx.getStorage({
        key: 'receive',
        success: res => {
          this.setData({
            receive: res.data
          })
        }
      })
      wx.getStorage({
        key: 'signed_7',
        success: res => {
          console.log(res.data)
          if (res.data == "true") {
            hideLoading()
            // this.sevendaysign()
            this.setData({
              seven_day_sign: true
            })
          } else {
            showToast("补签成功!")
          }
        }
      })
    } else if (this.data.s_day == 0) {
      hideLoading()
      console.log("今天没有签到过！！~")
      this.setData({
        isFixed: true,
        signed: false,
        flipped: false,
        rollback00: false,
        rollback01: false,
        rollback02: false,
        rollback03: false,
        rollback04: false,
        rollback05: false,
      })
      this._getSixRecords()
    } else {
      if (this.data.nosignday == 0) {
        hideLoading()
        console.log("今日已签到")
        this.setData({
          signed: true,
          flipped: true,
          isFixed: true,
        })
      } else if (this.data.nosignday == 1) {
        hideLoading()
        console.log("今天没有签到过！")
        this.setData({
          isFixed: true,
          signed: false,
          flipped: false,
          rollback00: false,
          rollback01: false,
          rollback02: false,
          rollback03: false,
          rollback04: false,
          rollback05: false,
        })
        this._getSixRecords()
      } else {
        hideLoading()
        console.log("需要使用补签卡")
        if (this.data.retcardnumber >= this.data.nosignday - 1) {
          this.setData({
            no_addcard: false,
          })
        }
        this.setData({
          addsign_isFixed: true,
        })
      }
    }
  },

  // 弹出框 确定按钮
  confirm_btn: function () {
    if (this.data.rollback00 == true || this.data.rollback01 == true || this.data.rollback02 == true || this.data.rollback03 == true || this.data.rollback04 == true || this.data.rollback05 == true) {
      this.setData({
        isFixed: false,
      })
      if (this.data.signed == true) {
        this.show_tick()
      } else {
        flipped: false,
          console.log("this.qianDao")
        this.qianDao(),
          console.log("this._userSignList")
        for (var i = 0; i < 7; i++) {
          this.data.sign_day[i] = 0;
        }
        this.setData({
          sign_day: this.data.sign_day
        })
        setTimeout(this.transform, 500)
      }
    } else {
      showToast("请选择一张卡片")
    }
  },
  //显示对勾
  show_tick: function () {
    var n = parseInt(this.data.click_id)
    switch (n) {
      case 0:
        this.setData({
          rollback00: true,
        })
        break;
      case 1:
        this.setData({
          rollback01: true,
        })
        break;
      case 2:
        this.setData({
          rollback02: true,
        })
        break;
      case 3:
        this.setData({
          rollback03: true,
        })
        break;
      case 4:
        this.setData({
          rollback04: true,
        })
        break;
      case 5:
        this.setData({
          rollback05: true,
        })
        break;
      default:
    }
  },
  //随机获取签到奖励
  _getSixRecords: function () {
    if (this.data.signed == false) {
      getSixRecords({
      }).then(res => {
        console.log(res)
        if (res.data.code == ERR_OK) {
          wx.setStorage({
            key: 'sixrecordslist',
            data: res.data.dataList,
            success: function (res) {
              console.log(res)
            }
          })
          this.setData({
            signReward: res.data.dataList
          })
        }
      })
        .catch(err => {
          console.log(err)
        })
    } else {
      console.log("随机数据不变")
    }

  },
  //选择随机反转一张卡片
  select00: function (e) {
    console.log(e.target.id)
    this.setData({
      flipped: true,
      rollback00: true,
      click_id: 0,
    })
    wx.setStorage({
      key: 'select_id',
      data: '0',
      success: function (res) {
        console.log(res)
      }
    })
    this.qianDao()
  },
  select01: function (e) {
    console.log(e.target.id)
    this.setData({
      flipped: true,
      rollback01: true,
      click_id: 1,
    })
    wx.setStorage({
      key: 'select_id',
      data: '1',
      success: function (res) {
        console.log(res)
      }
    })
    this.qianDao()
  },
  select02: function (e) {
    console.log(e.target.id)
    this.setData({
      flipped: true,
      rollback02: true,
      click_id: 2,
    })
    wx.setStorage({
      key: 'select_id',
      data: '2',
      success: function (res) {
        console.log(res)
      }
    })
    this.qianDao()
  },
  select03: function (e) {
    console.log(e.target.id)
    this.setData({
      flipped: true,
      rollback03: true,
      click_id: 3,
    })
    wx.setStorage({
      key: 'select_id',
      data: '3',
      success: function (res) {
        console.log(res)
      }
    })
    this.qianDao()
  },
  select04: function (e) {
    console.log(e.target.id)
    this.setData({
      flipped: true,
      rollback04: true,
      click_id: 4,
    })
    wx.setStorage({
      key: 'select_id',
      data: '4',
      success: function (res) {
        console.log(res)
      }
    })
    this.qianDao()
  },
  select05: function (e) {
    console.log(e.target.id)
    this.setData({
      flipped: true,
      rollback05: true,
      click_id: 5,
    })
    wx.setStorage({
      key: 'select_id',
      data: '5',
      success: function (res) {
        console.log(res)
      }
    })
    this.qianDao()
  },
  // 用户同意之后下一步
  nextStep: function () {
    app.isGetUserInfo = true
    // 先登陆 再跳转
    login()
      .then(res => {
        hideLoading()
        if (res == ERR_OK) {
          showToast("登陆成功")
          console.log("登陆成功##############")
          console.log(app)
          this.setData({
            app_userInfo: getApp().globalData.userInfo
          })
          //获取用户签到列表
          this._userSignList()
          //获取补签卡信息
          this._retroative_card_Status()
        } else {
          showToast('登录失败')
        }
      })
      .catch(err => {
        console.log(err)
      })
  },
  //关闭签到成功页
  close_btn: function () {
    this.setData({
      isFixed: false
    })
  },
  //七天奖励弹框 点击领取
  Noclaim: function () {
    this.setData({
      seven_day_sign: false
    })
    wx.setStorage({
      key: 'receive',
      data: '',
    })
  },
  //七天奖励弹框 已领取
  Alreadyreceived: function () {
    this.setData({
      seven_day_sign: false
    })
  }
})

