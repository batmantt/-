// pages/sign/sign.js
import { login, isGetUserInfo, openSetting } from '../../utils/login'
import { showLoading, hideLoading, showToast, userSignList, userSign, userShare } from '../../utils/api'
import { ERR_OK } from '../../utils/config'
import { addDateInfo } from '../../utils/calendar'
const app = getApp().globalData;
let startY = undefined;
const today = new Date().getDate();
// 动画数据
let animation = wx.createAnimation({
  timingFunction: 'ease-in-out',
  duration: 500
})
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sign_day: [{ isSign: "ture" }, { isSign: "flase" }, { isSign: "flase" }, { isSign: "flase" }, { isSign: "flase" }, { isSign: "flase" }, { isSign: "flase"}],
    signList: [],
    animationData: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 系统自带的用户信息放在app.selfInfo里面
    this._userSignList()
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
    return {
      success: function (res) {
        userShare({
          userOpenId: app.userInfo.token
        })
          .then(res => {
            if (res.data.code == ERR_OK) {
              showToast('分享成功')
            }
          })
          .catch(err => {
            console.log(err)
          })
      },
      fail: function (err) {
        console.log(err.errMsg)
      },
      title: 'Tango小程序签到~~',
      path: 'pages/index/index',
      imageUrl:'../../images/share_20180606111950.jpg',
    }
  },
  // 用户签到列表
  _userSignList: function () {
    // console.log(app)
    userSignList({
      userOpenId: app.userInfo.token
    })
      .then(res => {
        if (res.data.code == ERR_OK) {
          // 给每一个日期映射多个参数
          this.setData({
            signList: addDateInfo(res.data.dataList)
          })
          console.log("+++++++++++++++++")
          console.log(this.data.signList)
        }
      })
      .catch(err => {
        console.log(err)
      })
      .then(() => {
        hideLoading()
      })
  },
  // 用户点击签到
  // 现在没有把补签的接口做进去，如果以后要做的话，就去判断是当前这一周，而且是是今天之前就可以了
  qianDao: function (e) {
    const dayInfo = e.detail;
    if (!dayInfo.isThisWeek) {
      return false
    } else if (dayInfo.day > today) {
      return false
    } else if (dayInfo.day == today) {
      userSign({
        userOpenId: app.userInfo.token
      })
        .then(res => {
          console.log("----------------------------------------------")
          console.log(res)
          if (res.data.code != ERR_OK) {
            showToast(res.data.message)
          } else {
            showToast(res.data.message)
            // 签到成功之后更新一下用户信息
            login().then(res => {
              this._userSignList()
            })
          }
        })  
        .catch(err => {
          console.log(err)
        })
    }
  },
  // 暂时不要这个功能
  tapstart: function (e) {
    // startY = e.touches[0].clientY
  },
  // 用户下拉，暂时不用了
  tapmove: function (e) {
    // if (e.touches[0].pageY - startY > 3) {
    //   animation.height(100).step()
    //   this.setData({
    //     animationData: animation.export() 
    //   })
    // } else {
    //   // 如果已经打开上面的，并且高度小于初始点击点120就隐藏
    //   animation.height(0).step()
    //   this.setData({
    //     animationData: animation.export()
    //   })
    // }
  }
})
