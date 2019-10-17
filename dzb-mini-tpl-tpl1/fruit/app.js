const hostUrl = require('./config').hostUrl
var utils = require('./utils/util')

App({
    onLaunch: function () {
        // 登录
        wx.login({
            success: res => {
                // 发送 res.code 到后台换取 openId, sessionKey, unionId
            }
        })
        // 获取用户信息
        wx.getSetting({
            success: res => {
                if (res.authSetting['scope.userInfo']) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                    wx.getUserInfo({
                        success: res => {
                            // 可以将 res 发送给后台解码出 unionId
                            this.globalData.userInfo = res.userInfo
                          console.log('getUserInfo===',res)

                            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                            // 所以此处加入 callback 以防止这种情况
                            if (this.userInfoReadyCallback) {
                                this.userInfoReadyCallback(res)
                            }
                        }
                    })
                }
            }
        })
        wx.getSystemInfo({
            success: (res) => {
                this.globalData.statusBarHeight = res.statusBarHeight
                wx.setStorageSync('systemInfo', res)
                var ww = res.windowWidth;
                var hh = res.windowHeight;
                this.globalData.ww = ww;
                this.globalData.hh = hh;
            }
        })

      // let that = this;
      // wx.getSystemInfo({// 获取页面的有关信息
      //   success: function (res) {
      //     wx.setStorageSync('systemInfo', res)
      //     var ww = res.windowWidth;
      //     var hh = res.windowHeight;
      //     that.globalData.ww = ww;
      //     that.globalData.hh = hh;
      //   }
      // });

      // console.log("全局onLaunch options==" + JSON.stringify(options))
      // let q = decodeURIComponent(options.scene)
      // if (q) {
      //   console.log("全局onLaunch onload url=" + q)
      //   if (q.shop_type == 1) {
      //     wx.navigateTo({
      //       url: '../../idxSubpackage/pages/proDetails/proDetails?id=' + q.id,
      //     })
      //   } else if (q.shop_type == 2) {
      //     wx.navigateTo({
      //       url: '../../idxSubpackage/pages/proDetails/proDetails?id=' + q.id,
      //     })
      //   }
      //   console.log("全局onLaunch onload 参数 flag=" + utils.getQueryString(q, 'flag'))
      // }

    },
    //获取openid
    getUser: function (uid,callback) {
        var that = this;
        wx.request({
            url: hostUrl + '/user/' + uid,
            data: {},
            method:'GET',
            success: function (result) {
                console.log(result);//传入成功code值返回过来
                var res = result.data;
                callback && callback(res);
            }
        })
    },
    //跳转登录页面
    jumpLoginPage() {
        setTimeout(function () {
            wx.navigateTo({
                url: '/pages/common/pages/login/login',
            })
        }, 500);
    },
    //判断是否登录
    isLogin(callback){
        var userid = wx.getStorageSync("uid");
        console.log("获取用户ID:",userid);
        if (!userid){
            // wx.showToast({
            //     title: '您还未登录哦！',
            //     icon: 'none',
            // })
            console.log("未登录");
            // this.jumpLoginPage();
          this.showAddCartWarn()
            return false;
        }else{
            return true;   
        }
    },
  //提示
  showAddCartWarn() {
    var that = this;
    wx.showModal({
      title: '温馨提示',
      content: '您还未登录，请先进行登录！',
      showCancel: true,
      confirmColor: "#1ccfcf",
      cancelColor: "#666",
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

    globalData: {
        userInfo: null,
        oid: '',
        appName: "鲜果动"
    }, 


  bezier: function (pots, amount) {
    // 购物车动画特效算法
    var pot;
    var lines;
    var ret = [];
    var points;
    for (var i = 0; i <= amount; i++) {
      points = pots.slice(0);
      lines = [];
      while (pot = points.shift()) {
        if (points.length) {
          lines.push(pointLine([pot, points[0]], i / amount));
        } else if (lines.length > 1) {
          points = lines;
          lines = [];
        } else {
          break;
        }
      }
      ret.push(lines[0]);
    }
    function pointLine(points, rate) {
      var pointA, pointB, pointDistance, xDistance, yDistance, tan, radian, tmpPointDistance;
      var ret = [];
      console.log('laile');
      pointA = points[0];//点击
      pointB = points[1];//中间
      xDistance = pointB.x - pointA.x;
      yDistance = pointB.y - pointA.y;
      pointDistance = Math.pow(Math.pow(xDistance, 2) + Math.pow(yDistance, 2), 1 / 2);
      tan = yDistance / xDistance;
      radian = Math.atan(tan);
      tmpPointDistance = pointDistance * rate;
      ret = {
        x: pointA.x + tmpPointDistance * Math.cos(radian),
        y: pointA.y + tmpPointDistance * Math.sin(radian)
      };
      return ret;
    }
    return {
      'bezier_points': ret
    };
  }


})