// pages/idxSubpackage//pages/groupDetails/groupDetails.js
const hostUrl = require('../../../../config').hostUrl
const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
      id: '',//当前商品id
      uid: '',//当前用户uid
      oid: '',//行业id
      sid: '',//当前门店id

      indexSwiper: 0,//当前图片下标
      isPlay: false,//控制封面图
      showVideo: false,//控制视频
      buyNum: 1,//购买数量
      proDes: {},//商品信息
      attribute: [],//商品信息（重量、产地、存储）
      timeObj: {},//倒计时
      cartList: [],//购物车列表
      swiperList: [],//轮播图
      avatarList: [],//参团人头像列表
      progress: [],//拼团流程图列表
      groupNum: '',//还差几人成团
      // special: 2,
      ask: ''//门店下方担保信息
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this;
        that.setData({
          id: options.id,
          oid: app.globalData.oid,
          uid: wx.getStorageSync("uid"),
          sid: wx.getStorageSync("clickId"),
          progress: [
            { img: '../../images/progress1.png', name: '参与拼团' },
            { img: '../../images/progress2.png', name: '邀请好友' },
            { img: '../../images/progress3.png', name: '拼团成功' },
            { img: '../../images/progress4.png', name: '消息提醒' },
            { img: '../../images/progress5.png', name: '自提成功' },
          ]
        }) 
        that.getProductDes() 
        that.getCartList()
    },
    /**
   * 生命周期函数--监听页面显示
   */
  // onShow: function (options) {
  //     var that = this;
  //     that.setData({
  //       // id: options.id,
  //       oid: app.globalData.oid,
  //       uid: wx.getStorageSync("uid"),
  //       sid: wx.getStorageSync("clickId"),
  //       progress: [
  //         { img: '../../images/progress1.png', name: '参与拼团' },
  //         { img: '../../images/progress2.png', name: '邀请好友' },
  //         { img: '../../images/progress3.png', name: '拼团成功' },
  //         { img: '../../images/progress4.png', name: '消息提醒' },
  //         { img: '../../images/progress5.png', name: '自提成功' },
  //       ]
  //     })
  //     that.getProductDes()
  //     that.getCartList()
  //   },
    onReady() {
        this.videoCtx = wx.createVideoContext('myVd')  //根据id绑定
        wx.hideLoading();
    },
     //商品详情
    getProductDes() {
      var that = this;
      if (that.data.uid) {
        var data = that.data.id + '?sid=' + that.data.sid + '&uid=' + that.data.uid;
      }
      else {
        var data = that.data.id + '?sid=' + that.data.sid;
      }
      wx.request({
        url: hostUrl + '/groupbuy/' + data,
        method: "GET",
        data: '',
        success: function (res) {
          var res = res.data
          if (res.code == 1) {
            that.setData({
              proDes: res.data,
              swiperList: res.data.product_images,
              attribute: res.data.product_attribute,
            })
            console.log(that.data.proDes)
            if ((res.data.video) && (res.data.video != 'https://admin.dylm.kissneck.com/uploads/')) {
              that.data.swiperList.unshift(res.data.video)
              that.setData({
                swiperList: that.data.swiperList,
              })
            }
            if (res.data.avatar) {
              that.setData({
                avatarList: res.data.avatar,
              })
            } else {
              that.setData({
                avatarList: [],
              })
            }
            that.setData({
              groupNum: res.data.quorum - that.data.avatarList.length,
            })
            //倒计时
            that.getGroupTime();
          }
        }
      })
      let data3 = {
        oid: that.data.oid,
        type: 4,
      }
      wx.request({
        url: hostUrl + '/options',
        method: "GET",
        data: data3,
        success: function (res) {
          that.setData({
            ask: res.data.data,
          })
        }
      })
    },
    //购物车
    getCartList() {
      var that = this;
      var data = {
        uid: that.data.uid,
        oid: that.data.oid,
      }
      wx.request({
        url: hostUrl + '/storecart',
        method: "GET",
        data: data,
        success: function (res) {
          if (res.data.code == 1 && res.data.data.length >0){
            res.data.data.forEach(item => {
              if (item.shopid == that.data.sid) {
                that.setData({
                  cartList: item.list,
                })
              }
            })
          }
          
        }
      })
    },
    //倒计时
    getGroupTime() {
      let that = this;

      var formatDateTime = function (date) {
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        m = m < 10 ? ('0' + m) : m;
        var d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        var h = date.getHours();
        h = h < 10 ? ('0' + h) : h;
        var minute = date.getMinutes();
        minute = minute < 10 ? ('0' + minute) : minute;
        var second = date.getSeconds();
        return y + '/' + m + '/' + d + ' ' + h + ':' + minute + ':' + second;
      }

      let end_time = that.data.proDes.endTime;
      end_time = end_time.replace(/\-/g, "/");
      let now_time = new Date();
      now_time = formatDateTime(now_time);
      let endTime = new Date(end_time).getTime();
      let nowTime = new Date(now_time).getTime();
      let total_micro_second = endTime - nowTime;
      that.setData({
        timeObj: that.dateFormat(total_micro_second)
      })
      // that.timeObj = that.dateFormat(total_micro_second);
      setTimeout(function () {
        //倒计时
        that.getGroupTime();
      }, 1000)
    },
    //处理倒计时
    dateFormat: function (micro_second) {
      //总秒数
      let second = Math.floor(micro_second / 1000);
      //天数
      let day = Math.floor(second / 3600 / 24);
      //小时
      let hour = Math.floor(second / 3600 % 24);
      let hourStr = hour.toString();
      if (hourStr.length === 1) {
        hourStr = '0' + hourStr;
      }
      //分钟
      let min = Math.floor(second / 60 % 60);
      let minStr = min.toString();
      if (minStr.length === 1) {
        minStr = '0' + minStr;
      }
      //秒
      let sec = Math.floor(second % 60);
      let secStr = sec.toString();
      if (secStr.length === 1) {
        secStr = '0' + secStr;
      }
      let timeObj = {};  //声明一下
      timeObj.hourStr = parseInt(hourStr) + day*24;
      // timeObj.hourStr = hourStr;
      timeObj.minStr = minStr;
      timeObj.secStr = secStr;
      timeObj.countDown = second;
      return timeObj;
    },

    //轮播图视频
    playVd(e) {
        //隐藏封面图和播放图标
        this.setData({
            showVideo: true,   //来控制封面图
            isPlay: true
        })
        this.videoCtx.play();
    },
    //商品主图
    indexSwiperChange(index) {
        var that = this;
        var currentItem = index.detail.current;
        //当前滑动位置大于0，暂停视频并且重新加载封面
        if (currentItem > 0){
            that.videoCtx.pause();
            that.videoCtx.seek(0);
            that.setData({
                showVideo: false,   //来控制封面图
                isPlay: false
            })
        }
        that.setData({
            indexSwiper: currentItem
        })

    },
    //减少
    reduce() {
        var that = this;
      if (that.data.buyNum == 1) {
            that.setData({
              buyNum: 1,
            })
        }
        else {
        var proNum = that.data.buyNum;
            that.setData({
              buyNum: --proNum,
            })
        }
    },
    //增加
    add() {
        var that = this;
        if (that.data.buyNum < that.data.proDes.buy_num) {
          var proNum = that.data.buyNum;
          that.setData({
            buyNum: ++proNum,
          })
        }
        else {
          wx.showToast({
            title: '每人限购' + that.data.buyNum + '份!',
            icon: 'none',
          })
        }
    },

    //立即购买
    payMent() {
      var that = this;
      if(that.data.uid){
        that.data.proDes.buyNum = that.data.buyNum
        that.setData({
          proDes: that.data.proDes
        })
        var proArr = [];
        proArr.push(that.data.proDes);
        wx.setStorageSync("proArr", JSON.stringify(proArr));
        var proArr = wx.getStorageSync("proArr");
        wx.navigateTo({
          url: '/pages/cartSubpackage/pages/groupOrder/groupOrder',
        })
      
      }else {
        that.showBuyWarn()
      }
       
      
    },
  //登录购买提示
  showBuyWarn() {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '您还未登录，请登录后再进行购买！',
      showCancel: true,
      confirmColor: "#1ccfcf",
      cancelColor: "#1ccfcf",
      success(res) {
        if (res.confirm) {
          setTimeout(function () {
            wx.navigateTo({
              url: '/pages/common/pages/login/login',
            })
          }, 500);
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
    //分享按钮函数
    onShareAppMessage: function (ops) {
        var that = this
        if (ops.from === 'button') {
            // 来自页面内转发按钮
        }
        return {
          title: that.data.proDes.product_name,
          path: '/pages/idxSubpackage/pages/groupDetails/groupDetails?id=' + that.data.id,
            success: function (res) {
                // 转发成功
                console.log("转发成功:" + JSON.stringify(res));
            },
        }
    },


})