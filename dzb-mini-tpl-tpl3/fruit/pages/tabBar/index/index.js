// pages/tabBar/index/index.js
const accountInfo = wx.getAccountInfoSync()
var appid = accountInfo.miniProgram.appId // 小程序 appId
const hostUrl = require('../../../config').hostUrl
const app = getApp()
Page({
  data: {
    productContentList: [{
        title: "非洲大芒果特价来袭",
        price1: "12.25",
        price2: "18.9"
      },
      {
        title: "非洲大芒果特价来袭",
        price1: "12.25",
        price2: "18.9"
      },
      {
        title: "非洲大芒果特价来袭",
        price1: "12.25",
        price2: "18.9"
      },
      {
        title: "非洲大芒果特价来袭",
        price1: "12.25",
        price2: "18.9"
      },
    ],
    uid: '', //当前用户uid
    oid: '', //行业id
    swiperList: [], ////获取首页轮播图列表
    BambooList: [], //店长推荐
    shopwindowList: [], //banner下面的橱窗信息
    loadingHidden: false, //加载中
    isShowMsg: false, //消息通知红点
    isShowModal: false, //优惠券弹窗
    couponDetail: '', //获取优惠券列表
    couponPrice: '', //优惠价格
    curIndex: 0, //精品好物当前选中tab
    lat: '', //纬度
    lng: '', //经度
    clickId: '', //当前选择的门店ID
    tabId: '', //精品好物当前选中tab的id
    isCheck: '',
    wLenth: '100%',
    currentIndex: 0, //轮播图的index
    wLenth2: '100%', //精品好物tab宽度
    paged: 1, //当前精品好物页数
    statusBarHeight: app.globalData.statusBarHeight,
    sysbutton: {}, // 购物车抛物线  右侧胶囊按钮
    homeTitle: app.globalData.appName, //App应用名称
    hide_good_box: true, // 购物车抛物线
    bus_x: 0, //加入购物车x向距离
    bus_y: 0, //加入购物车y向距离
    cartNum: '', //购物车商品数量
    tabbarList: [{
        "title": "首页",
        "iconPath": "images/footer/index.png",
        "selectedIconPath": "images/footer/index_active.png"
      },
      {
        "title": "分类",
        "iconPath": "images/footer/category.png",
        "selectedIconPath": "images/footer/category_a.png"
      },
      {
        "title": "来拼",
        "iconPath": "images/footer/group.png",
        "selectedIconPath": "images/footer/group_active.png"
      },
      {
        "title": "购物车",
        "iconPath": "images/footer/cart.png",
        "selectedIconPath": "images/footer/cart_active.png"
      },
      {
        "title": "我的",
        "iconPath": "images/footer/user.png",
        "selectedIconPath": "images/footer/user_active.png"
      }
    ]
  },
  onLoad: function(options) {
    var that = this;
    console.log(options)
    // if (options.sence.shop_type){
    //   if (options.sence.shop_type == 1) {
    //     wx.navigateTo({
    //       url: '../../idxSubpackage/pages/proDetails/proDetails?id=' + options.sence.id,
    //     })
    //   } else if (options.sence.shop_type == 2) {
    //     wx.navigateTo({
    //       url: '../../idxSubpackage/pages/proDetails/proDetails?id=' + options.sence.id,
    //     })
    //   }
    // }else {
    //   return
    // }

    that.getMiniinfo(options); //获取商家小程序信息
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
    wx.setStorageSync('oid', that.data.oid); //存储商家ID    
    that.getMsg(); //获取消息数量
    that.getPosition();
    that.getUser();
    if (options.changeStore == 1) {
      that.getUser();
    }
  },
  getMiniinfo(options) {
    var that = this;
    wx.request({
      url: hostUrl + '/common',
      data: {
        'attr': appid,
        'action': 'miniinfo'
      },
      method: 'GET',
      success: function(result) {
        console.log("Appid内容", appid);
        console.log(result.data);
        console.log("获取小程序appid");
        var res = result.data;
        if (res.code == '1' && res.data != '0') {


          app.globalData.oid = res.data;
          app.globalData.appName = res.mininame
          that.setData({
              oid: res.data, //商家ID
              homeTitle: res.mininame
          })
          wx.setStorageSync('oid', res.data); //存储商家ID  

          //测试开始

          // app.globalData.oid = 15;
          // app.globalData.appName = res.mininame
          // that.setData({
          //   oid: 15, //商家ID
          //   homeTitle: res.mininame
          // })
          // wx.setStorageSync('oid', 15); //存储商家ID  


          //测试结束


          that.getMsg(); //获取消息数量
          that.getPosition();
          that.getUser();
          if (options.changeStore == 1) {
            that.getUser();
          }
        } else {
          wx.showModal({
            title: '提示',
            content: '商家未绑定小程序，暂不可使用',
            confirmColor: '#ff5400',
            showCancel: true,
            success(res) {
              if (res.confirm) {
                wx.clearStorageSync();
                wx.navigateBack({
                  delta: 2
                })
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        }
      }
    })
  },
  onShow() {
    wx.hideLoading();
    console.log("onshow，初始化数据，获取数据")
    this.data.cartNum = null;
    this.getCart();
    this.getMsg();
    this.getUser()
    wx.removeStorageSync('curIndex')

    this.gettabbarList()
    console.log(this.data.tabbarList)

  },
  //获取底部tabbar图标和文字
  gettabbarList() {
    var that = this;
    console.log("获取底部tabbar")
    wx.request({
      url: hostUrl + '/tab',
      method: 'GET',
      data: {
        oid: that.data.oid,
      },
      success: function(res) {
        var res = res.data;
        console.log(res)
        if (res.code == 1) {
          that.setData({
            tabbarList: res.data
          })
          console.log(that.data.tabbarList)
          for (let i = 0; i < that.data.tabbarList.length; i++) {
            wx.setTabBarItem({
              index: i,
              text: that.data.tabbarList[i].title,
              iconPath: that.data.tabbarList[i].iconPath,
              selectedIconPath: that.data.tabbarList[i].selectedIconPath
            })
            console.log(i)
          }
        }
      }
    })
  },
  onHide() {
    console.log("主页被隐藏，初始化购物车数据")
    this.data.cartNum = null;
  },
  //跳转消息页面
  jumpUserMsg() {
    if (!app.isLogin()) {
      return;
    }; //检测是否登录
    wx.navigateTo({
      url: '../../idxSubpackage/pages/userMessage/userMessage',
    })
  },
  //分享按钮函数
  onShareAppMessage: function(ops) {
    var that = this
    if (ops.from === 'button') {
      // 来自页面内转发按钮
    }
    return {
      title: '分享了一个小程序',
      path: 'pages/tabBar/index/index',
      success: function(res) {
        // 转发成功
        console.log("转发成功:" + JSON.stringify(res));
      },
    }
  },

  //获取消息数量
  getMsg() {
    var that = this;
    var userid = wx.getStorageSync("uid");
    var businessid = that.data.oid;
    if (!userid) {
      return;
    } //未登录直接跳出
    wx.request({
      url: hostUrl + '/storemessages',
      data: {
        uid: userid,
        oid: businessid,
      },
      success: function(res) {
        var res = res.data;
        if (res.code == 1) {
          if (res.data) {
            that.setData({
              isShowMsg: res.data.message_count
            })
          }
        }
      }
    })
  },
  //获取用户信息
  getUser() {
    var that = this;
    var userid = wx.getStorageSync("uid");
    var longitude = wx.getStorageSync("lng"); //经度
    var latitude = wx.getStorageSync("lat"); //纬度
    var myLocate = wx.getStorageSync("myLocate"); //当前位置名称缩写
    var clickId = wx.getStorageSync("clickId"); //关注店铺ID
    //判断是否有用户信息
    if (userid) {
      that.setData({
        uid: userid
      })
    }

    console.log("用户ID", userid);

    //判断是否有位置信息等缓存
    if (longitude) {
      that.setData({
        lng: longitude, //114.35049967448  wx.getStorageSync("lng")
        lat: latitude, //30.513586697049  wx.getStorageSync("lat")
        clickId: clickId, //4 //wx.getStorageSync("clickId")
        myLocate: myLocate, //南国 //wx.getStorageSync("myLocate")
      })
      that.setData({
        myLocate: that.data.myLocate.substring(0, 2),
      })
    }
    if (clickId) {
      that.setData({
        clickId: clickId,
      })
    }
    setTimeout(() => {
      that.getDetail()
      that.getProducts()
      that.getTypes()
      that.shopwindow();
      that.getCoupon();
    }, 500);
  },
  //获取定位信息
  getPosition() {
    var that = this;
    //权限设定
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userLocation']) {
          wx.authorize({
            scope: 'scope.userLocation',
            success() {
              that.getUserLocation();
            },
            fail() {
              wx.showModal({
                title: '授权提示',
                content: '需获取当前位置，来为您检索附近门店',
                confirmColor: '#1ccfcf',
                confirmText: "去设置",
                showCancel: false,
                success(res) {
                  wx.openSetting({
                    success(res) {
                      var userauth = res.authSetting;
                      if (userauth['scope.userLocation']) {
                        wx.showToast({
                          title: '授权成功，正在为您加载...',
                          icon: 'none',
                        })
                        that.getUserLocation();
                      } else {
                        wx.showModal({
                          title: '授权取消',
                          content: '之后可点击左上角图标重新定位授权',
                          confirmColor: '#1ccfcf',
                          confirmText: "重新授权",
                          cancelText: '关闭',
                          success(res) {
                            if (res.confirm) {
                              that.getPosition();
                            } else if (res.cancel) {
                              wx.showToast({
                                title: '授权失败，为您展示默认门店',
                                icon: 'none',
                              })
                              setTimeout(() => {
                                that.setData({
                                  loadingHidden: false
                                })
                                wx.request({
                                  url: hostUrl + '/randsid',
                                  data: {
                                    oid: that.data.oid,
                                  },
                                  success: function(res) {
                                    var res = res.data;
                                    that.setData({
                                      clickId: res.data.id, //默认门店ID
                                    })
                                    wx.setStorageSync("clickId", that.data.clickId);
                                    that.getDetail()
                                    that.getProducts()
                                    that.getTypes()
                                    that.shopwindow();
                                  }
                                })
                              }, 800);
                            }
                          }
                        })
                      }
                    }
                  })
                }
              })
            }
          })
        } else {
          console.log("已授权");
          that.getUserLocation();
        }
      }
    })
  },
  //获取当前用户位置
  getUserLocation() {
    var that = this;
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        that.setData({
          lat: res.latitude,
          lng: res.longitude,
        })
        console.log("手动授权成功获取门店坐标：", res);
        that.changeLat(); //坐标转换位置信息
      }
    })
  },

  //跳转重新定位页面
  jumpUserLocation() {
    wx.navigateTo({
      url: '../../idxSubpackage/pages/mgLocation/mgLocation',
    })
  },

  //经纬度转换GPS坐标
  changeLat() {
    var that = this;
    var m = that.data.lng + ',' + that.data.lat;
    wx.request({
      url: hostUrl + '/location',
      method: 'GET',
      data: {
        type: 3,
        returnlat: m,
      },
      success: function(res) {
        var res = res.data;
        if (res.code == 1) {
          that.setData({
            lng: res.data[0],
            lat: res.data[1],
          })
          wx.setStorageSync("lng", that.data.lng);
          wx.setStorageSync("lat", that.data.lat);
        }
        that.getLct(); //获取位置信息
        that.getStores(); //获取门店信息
      }
    })
  },
  //获取位置信息
  getLct() {
    var that = this;
    wx.request({
      url: hostUrl + '/location',
      method: 'GET',
      data: {
        lon: that.data.lng,
        lat: that.data.lat,
      },
      success: function(res) {
        var res = res.data;
        //判断如果有区域内容则显示区域名称反之街道
        if (res.data.area != false) {
          wx.setStorageSync("myLocate", res.data.area.substring(0, 2));
          that.setData({
            myLocate: res.data.area.substring(0, 2),
          })
        } else {
          wx.setStorageSync("myLocate", res.data.standby.substring(0, 2));
          that.setData({
            myLocate: res.data.standby.substring(0, 2),
          })
        }

      }
    })
  },
  //获取门店列表
  getStores() {
    var that = this
    var m = that.data.lng + ',' + that.data.lat;
    wx.request({
      url: hostUrl + '/store',
      data: {
        oid: that.data.oid,
        uid: that.data.uid,
        origin: m,
      },
      success: function(res) {
        var res = res.data;
        if (res.code == 1) {
          var s = res.data;
          for (let i = 0; i < s.length; i++) {
            if (that.data.clickId) {
              //与默认门店进行对比
              if (s[i].id == that.data.clickId) {
                that.setData({
                  myStore: s[i],
                  location: s[i].location,
                  storeLogo: s[i].logo,
                })
              }
            } else if (s[i].isCheck == 1) { ////判断是否有关注的门店
              that.setData({
                myStore: s[i],
                location: s[i].location,
                clickId: s[i].id,
                storeLogo: s[i].logo,
              })
              wx.setStorageSync('clickId', that.data.clickId);
            }
          }
          if (!that.data.myStore) {
            that.setData({
              myStore: s[0],
              location: s[0].location,
              clickId: s[0].id,
              storeLogo: s[0].logo,
            })
            wx.setStorageSync('clickId', that.data.clickId);
          }
          that.shopwindow();
          that.getProducts();
          that.getTypes();
          that.getUser();
        }
      }
    })
  },
  //获取门店详情
  getDetail() {
    var that = this;
    var clickId = that.data.clickId;
    wx.request({
      url: hostUrl + '/store/' + clickId,
      data: {},
      success: function(res) {
        var res = res.data;
        if (res.code == 1) {
          that.setData({
            myStore: res.data,
            location: res.data.address,
            storeLogo: res.data.logo,
          })
          wx.setStorageSync('shopInfo', JSON.stringify(res.data));
          setTimeout(() => {
            wx.hideLoading();
          }, 500)
        }
      }
    })
  },
  //获取首页商品店长推荐和轮播图列表
  getProducts() {
    var that = this;
    //轮播图
    wx.request({
      url: hostUrl + '/products',
      data: {
        oid: that.data.oid,
        type: -7,
        sid: that.data.clickId,
      },
      success: function(res) {
        var res = res.data;
        if (res.code == 1) {
          that.setData({
            swiperList: res.data,
          })
        }
      }
    })

    //店长推荐
    wx.request({
      url: hostUrl + '/products',
      data: {
        oid: that.data.oid,
        type: -6,
        sid: that.data.clickId,
      },
      success: function(res) {
        var res = res.data;
        if (res.code == 1) {
          that.setData({
            BambooList: res.data,
            wLenth: (res.data.length * 180) + ((res.data.length - 1) * 20) + 'rpx',
          })
        }
      }
    })
  },
  //点击banner图跳转详情页
  clickBanner(e) {
    var that = this;
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../../idxSubpackage/pages/proDetails/proDetails?id=' + id,
    })
  },
  //轮播图切换
  handleChange: function(e) {
    this.setData({
      currentIndex: e.detail.current
    })
  },
  //获取首页商品分类列表
  getTypes() {
    var that = this;
    wx.request({
      url: hostUrl + '/procategory',
      data: {
        oid: that.data.oid,
      },
      success: function(res) {
        var res = res.data;
        if (res.data.length > 0) {
          that.setData({
            loadingHidden: true,
            tab_list: res.data,
            tabId: res.data[0].id,
            wLenth2: (res.data.length * 120) + ((res.data.length - 1) * 30) + 60 + 'rpx',
          })
        } else {
          wx.showToast({
            title: '内容显示不完整',
            icon: 'none',
          })
          that.setData({
            loadingHidden: true
          })
        }
      },
      complete: function(res) {
        //获取第一栏商品列表
        wx.request({
          url: hostUrl + '/products',
          data: {
            oid: that.data.oid,
            cid: that.data.tabId,
            sid: that.data.clickId,
            paged: that.data.paged,
          },
          success: function(res) {
            var res = res.data;
            if (res.code == 1) {
              var paged = that.data.paged + 1;
              that.setData({
                paged: paged,
                goodShop: res.data,
                loadingHidden: true
              })
            }
          }
        })
      },
    })
  },
  //点击精品好物的tab栏
  tabFun(e) {
    var that = this;
    that.setData({
      loadingHidden: false,
      paged: 1,
      // goodShop: [],
    })
    var index = e.currentTarget.dataset.index;
    var t = that.data.tab_list;
    that.setData({
      curIndex: index,
      tabId: t[index].id,
    })
    // that.goodShopList();
    wx.request({
      url: hostUrl + '/products',
      data: {
        oid: that.data.oid,
        cid: that.data.tabId,
        sid: that.data.clickId,
        paged: that.data.paged,
      },
      success: function(res) {
        var res = res.data;
        if (res.code == 1) {
          var paged = that.data.paged + 1;
          that.setData({
            paged: paged,
            goodShop: res.data
          })
        }
      },
      complete() {
        that.setData({
          loadingHidden: true
        })
      }
    })
  },
  //商品列表
  goodShopList() {
    var that = this;
    wx.request({
      url: hostUrl + '/products',
      data: {
        oid: that.data.oid,
        cid: that.data.tabId,
        sid: that.data.clickId,
        paged: that.data.paged,
      },
      success: function(res) {
        var rest = res.data;
        if (rest.code == 1) {
          var goodList = that.data.goodShop;
          var arr = rest.data;
          if (arr) {
            arr.forEach(item => {
              goodList.push(item);
            })
          }
          var paged = that.data.paged + 1;
          that.setData({
            paged: paged,
            goodShop: goodList,
            loadingHidden: true,
          })
        } else {
          that.addgoodShopList();
        }
      }
    })
  },

  //滚动加载更多商品列表
  addgoodShopList() {
    var that = this;
    var tabIndex = that.data.curIndex;
    var t = that.data.tab_list; //分类列表
    var listlength = t.length;
    tabIndex += 1; // 进入下一个分类
    if (tabIndex < listlength) {
      var tabId = t[tabIndex].id
      that.setData({
        curIndex: tabIndex,
        paged: 1,
        tabId: tabId
      })
      wx.request({
        url: hostUrl + '/products',
        data: {
          oid: that.data.oid,
          cid: that.data.tabId,
          sid: that.data.clickId,
          paged: that.data.paged,
        },
        success: function(res) {
          var rest = res.data;
          if (rest.code == 1) {
            var goodList = that.data.goodShop;
            var arr = rest.data;
            if (arr) {
              arr.forEach(item => {
                goodList.push(item);
              })
            }
            var paged = that.data.paged + 1;
            that.setData({
              paged: paged,
              goodShop: goodList,
              loadingHidden: true,
            })
          } else {
            that.setData({
              loadingHidden: true,
            })
          }
        }
      })
    } else {
      that.setData({
        loadingHidden: true
      })
    }
  },
  //加入购物车
  addCart(e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var goodShop = that.data.goodShop;
    if (!app.isLogin()) { //检测是否登录
      return
    } else {
      wx.request({
        url: hostUrl + '/storecart',
        method: "POST",
        data: {
          uid: that.data.uid,
          pid: that.data.goodShop[index].id,
          shopid: that.data.clickId,
          num: 1,
          oid: that.data.oid,
          shop_type: 1,
        },
        success: function(res) {
          var res = res.data;
          console.log(res)
          if (res.code == 1) {
            if (that.data.cartNum == 0) {
              that.empty = 1
            }
            wx.showToast({
              title: '加入购物车成功！',
              icon: 'none',
            })

            that.getCart();
          } else {
            wx.showToast({
              title: '加入购物车失败！',
              icon: 'none',
            })
          }
        }
      })
    };
  },


  //获取购物车信息
  getCart() {
    var that = this;
    var userid = that.data.uid;
    if (!userid) {
      return;
    } //未登录直接跳出
    wx.request({
      url: hostUrl + '/storecart',
      data: {
        uid: that.data.uid,
        oid: that.data.oid,
      },
      success: function(res) {
        var res = res.data;

        if (res.code == 1) {
          var a = res.data;
          for (let i = 0; i < a.length; i++) {
            if (a[i].shopid == that.data.clickId) {
              let cartList = a[i];
              let goodList = a[i].list;
              that.setData({
                cartNum: goodList.length,
              })

              var cartNum = that.data.cartNum;
              console.log(`"当前购物车数量是"${cartNum}`)
              var carNumstr = cartNum.toString();
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
  // watch:{
  //   cartNum:{
  //     handler(){
  //       this.getCart();
  //     }
  //   }
  // },
  //橱窗信息
  shopwindow() {
    var that = this;
    wx.request({
      url: hostUrl + '/shopwindow',
      data: {
        oid: that.data.oid,
      },
      success: function(res) {
        var res = res.data;
        that.setData({
          shopwindowList: res.data,
        })
      }
    })
  },
  //切换门店跳转页面
  changeSt() {
    var that = this;
    wx.navigateTo({
      url: '../../idxSubpackage/pages/changeStore/changeStore',
    })
  },
  //获取优惠券列表
  getCoupon() {
    var that = this;
    wx.request({
      url: hostUrl + '/storercoupon',
      data: {
        uid: that.data.uid,
        oid: that.data.oid,
        isCheck: that.data.isCheck,
      },
      success: function(res) {
        // console.log("优惠劵内容：：", res, that.data.isCheck);
        var res = res.data;
        if (res.code == 1) {
          if (res.data) {
            that.setData({
              couponDetail: res.data,
              couponPrice: res.data.coupon_price,
            })
            setTimeout(() => {
              that.setData({
                isShowModal: true
              })
            }, 500)
          }
        }
      }
    })
  },
  // 关闭优惠券弹窗
  closeModal() {
    var that = this;
    that.setData({
      isShowModal: false,
    })
    if (that.data.couponDetail.oid) {
      wx.request({
        url: hostUrl + '/storercoupon',
        method: "POST",
        data: {
          id: that.data.couponDetail.id,
          uid: that.data.uid,
          oid: that.data.oid,
          receive_type: 1,
        },
        success: function(res) {}
      })
    }

  },
  //立即领取
  getNow() {
    var that = this;
    that.setData({
      isShowModal: false,
    })
    if (that.data.couponDetail.oid) {
      wx.request({
        url: hostUrl + '/storercoupon',
        method: "POST",
        data: {
          id: that.data.couponDetail.id,
          uid: that.data.uid,
          oid: that.data.oid,
          receive_type: '',
        },
        success: function(res) {
          var res = res.data;
          if (res.code == 1) {
            wx.showToast({
              title: '领取成功！',
              icon: 'none',
            })
          }
        }
      })
    }
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var that = this;
    that.setData({
      loadingHidden: false,
    });
    that.goodShopList();
  },

  // 点击添加商品到购物车抛物线
  // 加入购物车
  touchOnGoods: function(e) {
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

    // console.log(topPoint);
    // var linePos = app.bezier([this.busPos, topPoint, this.finger], 30);
    // var linePos = app.bezier([this.finger, topPoint, this.busPos], 30);

    // console.log(linePos);
    this.startAnimation(linePos);

    this.addCart(e);

  },
  startAnimation: function(linePos) {
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
    this.timer = setInterval(function() {
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


})