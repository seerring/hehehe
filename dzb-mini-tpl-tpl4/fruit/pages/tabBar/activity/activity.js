// pages/tabBar/activity/activity.js
const hostUrl = require('../../../config').hostUrl
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isSelect: true, //当前tab选中样式
    sid: '', //当前选择的门店ID
    // footer: { first: "", second: "active", third: "", fourth: "" },
    curIndex: 0, //当前tab下标
    topBg:'', //页面头部的背景图片
    storeName: '', //商店名称
    storeAddress: '', //商店地址
    logo: '', //商店头像
    list1: [], //限量特价
    list2: [], //限时拼团
    distance:"",//获得距离
    sysbutton: {}, // 购物车抛物线  右侧胶囊按钮
    homeTitle: app.globalData.appName, //App应用名称
    hide_good_box: true, // 购物车抛物线
    bus_x: 0, //加入购物车x向距离
    bus_y: 0, //加入购物车y向距离
    cartNum: '', //购物车商品数量
  },

  getParams() {
    var that = this;
    that.setData({
      sid: wx.getStorageSync("clickId")
    })
    var data = {
      sid: that.data.sid,
    }
    wx.request({
      url: hostUrl + '/special',
      method: 'GET',
      data: data,
      success: function(res) {
        var res = res.data;
        if (res.code == 1) {
          that.setData({
            storeName: res.data.name,
            storeAddress: res.data.address,
            logo: res.data.logo
          })
        } else {}
      }
    })
    if (wx.getStorageSync("orderIndex")) {
      that.setData({
        index01:wx.getStorageSync("orderIndex")
      })
      var a = {
        currentTarget: {
          dataset: {
            index: that.data.index01
          }
        }
      }
      that.changeTab(a);
    } else {
      var a = {
        currentTarget: {
          dataset: {
            index: 0
          }
        }
      }
      that.changeTab(a);
    }
  },

  //点击tab变换
  changeTab(index) {
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    var index = index.currentTarget.dataset.index
    that.setData({
      curIndex: index
    })
    that.getProList(index);
    if (index == 0) {
      that.setData({
        isSelect: true,
      })
    } else {
      that.setData({
        isSelect: false,
      })
    }
    wx.hideLoading();
  },
  //获取内容
  getProList(index) {
    var that = this;
    var data = {
      sid: that.data.sid,
    }
    if (index == 0) {
      wx.request({
        url: hostUrl + '/special',
        method: 'GET',
        data: data,
        success: function(res) {
          var res = res.data;
          if (res.code == 1) {
            that.setData({
              list1: res.data.list,
            })
          } else {}
        }
      })
    } else if (index == 1) {
      wx.request({
        url: hostUrl + '/groupbuy',
        method: 'GET',
        data: data,
        success: function(res) {
          var res = res.data;
          if (res.code == 1) {
            that.setData({
              list2: res.data.list,
            })
            for (var i = 0; i < that.data.list2.length; i++) {
              that.data.list2[i].timeObj = {}
            }
            that.setData({
              list2: that.data.list2,
            })
            that.getGroupTime();
          } else {
            that.setData({
              list2: [],
            })
          }
        }
      })
    }
    setTimeout(() => {
      wx.setStorageSync('orderIndex', index); //存储商家ID
    }, 500)
  },
  //当前时间距截止时间的总秒数
  getGroupTime() {
    let that = this;
    let list1 = that.data.list2;
    var formatDateTime = function(date) {
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
    };
    for (let i = 0; i < list1.length; i++) {
      let end_time = list1[i].endTime;
      end_time = end_time.replace(/\-/g, "/");
      let now_time = new Date();
      now_time = formatDateTime(now_time);
      let endTime = new Date(end_time).getTime();
      let nowTime = new Date(now_time).getTime();
      let total_micro_second = endTime - nowTime;
      if (that.data.list2[i].timeObj.countDown <= 0 && that.data.list2[i].timeObj.countDown) {
        continue;
      } else {
        that.data.list2[i].timeObj = that.dateFormat(total_micro_second);
        that.setData({
          list2: that.data.list2,
        })
      }
    }
    setTimeout(function() {
      that.getGroupTime();
    }, 1000)
  },
  // 处理时间
  dateFormat: function(micro_second) {
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
    let timeObj = {}; //声明一下\

    timeObj.hourStr = parseInt(hourStr) + day * 24;
    // timeObj.hourStr = hourStr;
    timeObj.minStr = minStr;
    timeObj.secStr = secStr;
    timeObj.countDown = second;
    return timeObj;
    console.log(timeObj)
  },
  //跳转拼团详情
  togroupDetails(e) {
    var that = this;
    var tid = e.currentTarget.dataset.index.id
    wx.navigateTo({
      url: '/pages/idxSubpackage/pages/groupDetails/groupDetails?sid=' + that.data.sid + "&id=" + tid
    })
  },
  getUser() {
    var that = this;
    var userid = wx.getStorageSync("uid");
    //判断是否有用户信息
    if (userid) {
      that.setData({
        uid: userid
      })
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onLoad: function () {
    //从缓存中获取头部的图片地址和距离
    var distance = wx.getStorageSync("distance");
    this.setData({
      distance: distance,
    })
    console.log(distance)
    //console.log(this.data.distance)
    // console.log("acitivity on show!")
    var that = this;
    that.getParams();
    wx.removeStorageSync('curIndex')
    var a = {
      currentTarget: {
        dataset: {
          index: that.data.curIndex
        }
      }
    }
    that.changeTab(a);
    var uid = wx.getStorageSync('uid');
    var oid = wx.getStorageSync('oid');
    //that.getCategory(oid);

    //  购物车抛物线  
    var _windowHeight = wx.getSystemInfoSync().windowHeight;
    var _windowWidth = wx.getSystemInfoSync().windowWidth;
    // 目标终点元素 - 购物车的位置坐标
    this.busPos = {};
    this.busPos['x'] = 265; // x坐标暂写死，自己可根据UI来修改
    this.busPos['y'] = _windowHeight - 10; // y坐标，也可以根据自己需要来修改
    // 购物车抛物线
    that.setData({
      oid: app.globalData.oid, //商家ID
      sysbutton: wx.getMenuButtonBoundingClientRect() //右侧胶囊按钮
    })

    that.getTopBg();
  },

  //获取门店背景图
  getTopBg() {
    var that = this;
    var params = wx.getStorageSync("clickId");
    wx.request({
      url: hostUrl + '/store/' + params,
      method: "GET",
      data: '',
      success: function (res) {
        if (res.data.code == 1) {
          console.log("+++++++++", res.data.data.img[0])
          that.setData({
            topBg: res.data.data.img[0],
          })
        }
      }

    })
  },
  onShow: function () {
    this.getCart();
  },


  // 加入购物车
  touchOnGoods: function (e) {
    // 如果good_box正在运动，不能重复点击
    if (!this.data.hide_good_box) return;
    this.finger = {};
    var topPoint = {};
    // console.log(e);
    // console.log(this.busPos);
    //点击点的坐标
    this.finger['x'] = e.touches["0"].clientX;
    this.finger['y'] = e.touches["0"].clientY;

    //控制点的y值定在低的点的上方150处
    if (this.finger['y'] < this.busPos['y']) {
      topPoint['y'] = this.finger['y'] - 150;
    } else {
      topPoint['y'] = this.busPos['y'] - 150;
    }

    //控制点的x值在点击点和购物车之间
    if (this.finger['x'] > this.busPos['x']) {
      topPoint['x'] = (this.finger['x'] - this.busPos['x']) / 2 + this.busPos['x'];
      var linePos = app.bezier([this.busPos, topPoint, this.finger], 30);

    } else {
      topPoint['x'] = (this.busPos['x'] - this.finger['x']) / 2 + this.finger['x'];
      var linePos = app.bezier([this.finger, topPoint, this.busPos], 20); // 倒序
      var newline = linePos['bezier_points'].reverse();
      linePos['bezier_points'] = newline;


    }
    this.startAnimation(linePos);
    this.addCart(e);
  },
  startAnimation: function (linePos) {
    var index = 0,
      that = this,
      bezier_points = linePos['bezier_points'];

    // console.log(bezier_points);
    this.setData({
      hide_good_box: false,
      bus_x: that.finger['x'],
      bus_y: that.finger['y']
    })
    index = bezier_points.length;
    this.timer = setInterval(function () {
      index--;
      // 设置球的位置
      that.setData({
        bus_x: bezier_points[index]['x'],
        bus_y: bezier_points[index]['y']
      })
      // 到最后一个点的时候，开始购物车的一系列变化，并清除定时器，隐藏小球
      if (index < 1) {
        clearInterval(that.timer);
        that.setData({
          hide_good_box: true
        })
      }
    }, 20);
  },
  //加入购物车
  addCart(e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var goodShop = that.data.list1;
    console.log(goodShop[index].id)
    var oid = wx.getStorageSync('oid');
    var uid = wx.getStorageSync('uid');
    var sid = wx.getStorageSync('clickId');

    if (!app.isLogin()) { return; }; //检测是否登录
    wx.request({
      url: hostUrl + '/storecart',
      method: "POST",
      data: {
        uid: uid,
        pid: goodShop[index].id,
        shopid: sid,
        num: 1,
        oid: oid,
        shop_type: 1,
      },
      success: function (res) {
        var res = res.data;
        if (res.code == 1) {
          if (that.cartNum == 0) {
            that.empty = 1
          }
          wx.showToast({
            title: '加入购物车成功！',
            icon: 'none',
          })
          that.getCart();
        }
        else {
          wx.showToast({
            title: '加入购物车失败！',
            icon: 'none',
          })
        }
      }
    })
  },
  //获取购物车信息
  getCart() {
    var that = this;
    var userid = wx.getStorageSync('uid');
    if (!userid) {
      return;
    } //未登录直接跳出
    wx.request({
      url: hostUrl + '/storecart',
      data: {
        uid: wx.getStorageSync('uid'),
        oid: wx.getStorageSync('oid'),
      },
      success: function (res) {
        var res = res.data;

        if (res.code == 1) {
          var a = res.data;
          var clickId = wx.getStorageSync("clickId");
          for (let i = 0; i < a.length; i++) {
            if (a[i].shopid == clickId) {
              let cartList = a[i];
              let goodList = a[i].list;
              that.setData({
                cartNum: goodList.length,
              })

              var cartNum = that.data.cartNum;
              console.log(`"当前购物车数量是"${cartNum}`)
              var carNumstr = cartNum.toString();
              console.log(carNumstr)
              wx.setTabBarBadge({
                index: 3,
                text: carNumstr // 购物车数量
              })
            }
          }
        }
      }
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var that = this
    wx.showLoading({
      title: '加载中',
    })
    setTimeout(() => {
      wx.hideLoading();
    }, 500)
  }
})