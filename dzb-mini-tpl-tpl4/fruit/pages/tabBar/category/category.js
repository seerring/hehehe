// pages/tabBar/category/category.js
const hostUrl = require('../../../config').hostUrl
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // curIndex: 27,
        curIndex: 0,//当前选项卡的id
        curIndexSort:0,//当前排序
        loadingHidden: false,//加载中
        tabList: [],//--左边导航列表
        proList: {
            mainImages: '../../../images/typeBanner.jpg',
            goodslist: []
        },//--右边商品
        tabId: '',//当前选项卡的下标
        paged: 1,//当前右侧商品页数
        banner:'',//右侧商品banner图

      tabListSort: [
        {
          name: '综合',
          // sort: false,
          id: 4
        },
        {
          name: '销量',
          // sort: false,
          id: 1

        },
        {
          name: '最新',
          // sort: false,
          id: 2
        },
        {
          name: '价格',
          // sort: false,
          id: 3
        },
      ],//搜索分类

      sysbutton: {}, // 购物车抛物线  右侧胶囊按钮
      homeTitle: app.globalData.appName, //App应用名称
      hide_good_box: true, // 购物车抛物线
      bus_x: 0, //加入购物车x向距离
      bus_y: 0, //加入购物车y向距离
      cartNum: '', //购物车商品数量

      inputVal: '',//搜索的内容
      isShow:true,//是否展示
    },
    //选项卡
    tabFun(e) {
        var that = this;
        var oid = wx.getStorageSync('oid');
        var clickId = wx.getStorageSync("clickId");  //关注店铺ID
        var curIndex = e.currentTarget.dataset.id;
      // var curIndex = e.currentTarget.dataset.index;
        var index = e.currentTarget.dataset.index;
      var initProList = {
        mainImages: '../../../images/typeBanner.jpg',
        goodslist: []
      }
      if (curIndex == that.data.curIndex){
          that.setData({
            proList: initProList,
            curIndex: curIndex,
            paged: 1,
            tabId: index,
            loadingHidden: false,
            isShow: !that.data.isShow,
          })
        }else{
          that.setData({
            proList: initProList,
            curIndex: curIndex,
            paged: 1,
            tabId: index,
            loadingHidden: false,
            isShow: true,
          })
        }
        
      wx.setStorageSync('curIndex', e)
        // that.getSelectCategory(oid, curIndex);
        wx.request({
          url: hostUrl + '/products',
          data: {
            oid: oid,
            cid: curIndex,
            sid: clickId,
            paged: that.data.paged,
          },
          success: function (res) {
            that.setData({
              goodList:[]
            })
            var res = res.data;
            if (res.code == 1) {
              var paged = that.data.paged + 1;
              that.setData({
                paged: paged,
                proList: {
                  mainImages: '../../../images/typeBanner.jpg',
                  goodslist: res.data,
                },
                loadingHidden: true,
              })
                var a = {
                  currentTarget: {
                    dataset: {
                      index: 0
                    }
                  }
                }
              that.tabFunSort(a)
            }
          },
          complete() {
            that.setData({ loadingHidden: true })
          }
        })
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onLoad: function () {
        var that = this;
        wx.hideLoading();
        that.setData({
            loadingHidden: false,
            paged: 1,
            proList: {
              mainImages: '../../../images/typeBanner.jpg',
              goodslist: []
            }
        })
        var uid = wx.getStorageSync('uid');
        var oid = wx.getStorageSync('oid');
        that.getCategory(oid);
        // var a = {
        //   currentTarget: {
        //     dataset: {
        //       curIndex: 200,
        //       index: 0
        //     }
        //   }
        // }
        // that.tabFun(a)
        that.getBanner()


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
    },
    onShow:function(){
      
    },
    //获取右侧商品banner图
    getBanner() {
      var that = this;
      var data = {
        oid: app.globalData.oid,
      }
      wx.request({
        url: hostUrl + '/windowimg',
        method: "GET",
        data: data,
        success: function (res) {
          if (res.data.code == 1) {
            that.setData({
              banner: res.data.data,
            })
          }
        }
      })
    },
    //添加分类列表
    getCategory: function (oid) {
        var that = this;
        wx.request({
            url: hostUrl + '/procategory',
            data: {
                oid: wx.getStorageSync('oid'),
                // oid: oid,
            },
            success: function (res) {
                var res = res.data;
                if (res.code == 1) {
                    that.setData({
                        tabList: res.data,
                        curIndex: res.data[0].id,
                        tabId:0
                    })
                  console.log(that.data.tabList)
                  // var m = that.data.tabList.slice();
                  // m.unshift("全部")
                  // console.log(m)
                  // that.setData({
                  //   tabList: m,
                  // })
                  console.log(that.data.tabList)
                  var curIndexs = wx.getStorageSync('curIndex');
                  if (curIndexs) {
                    that.setData({
                      curIndex: curIndexs.currentTarget.dataset.id
                    })
                    that.getSelectCategory(oid, that.data.curIndex);
                  }else{
                    that.getSelectCategory(oid, res.data[0].id);
                  }
                  // console.log('测试缓存curIndex====' + wx.getStorageSync('curIndex'))
                  // console.log('测试curIndex==='+that.data.curIndex)
                }
            },
            complete: function (res) {
                that.setData({
                    loadingHidden: true
                })
            }
        })
    },
    getSelectCategory: function(oid,cid){
        var that = this;
        var clickId = wx.getStorageSync("clickId");  //关注店铺ID
        //获取第一栏商品列表
        console.log(111111111111111111111111111111111111)
        wx.request({
            url: hostUrl + '/products',
            data: {
                oid: wx.getStorageSync('oid'),
                // oid: oid,
                cid: cid,
                sid: clickId, //店铺ID
                paged: that.data.paged,
            },
            success: function (res) {
                console.log("商品列表", res.data);
                var res = res.data;
                if (res.code == 1) {
                    // that.setData({
                    //     proList: {
                    //         mainImages: '../../../images/typeBanner.jpg',
                    //         goodslist: res.data,
                    //     }
                    // })
                  var goodList = that.data.proList.goodslist;
                  var arr = res.data;
                  if (arr) {
                    arr.forEach(item => {
                      goodList.push(item);
                    })
                  }
                  var paged = that.data.paged + 1;
                  that.setData({
                    paged: paged,
                    // goodShop: goodList,
                    proList: {
                      mainImages: '../../../images/typeBanner.jpg',
                      goodslist: goodList,
                    },                
                    loadingHidden: true,
                  })
                }else{
                  if(cid != 199){
                    return
                  }else{
                    that.addgetSelectCategory(oid, cid);
                  }
                  
                }
            },
            complete: function (res) {
                that.setData({
                    loadingHidden: true
                })
            }
        })
    },
    /* 下一个分类 */
    addgetSelectCategory: function (oid, cid){
      console.log('执行addgetSelectCategory方法')
      var that = this;
      var clickId = wx.getStorageSync("clickId");  //关注店铺ID
      var tabId = that.data.tabId;
      var t = that.data.tabList;  //分类列表
      var listlength = t.length;
      tabId += 1; // 进入下一个分类
      if (tabId < listlength) {
        console.log('进来了');
        var tabIndex = t[tabId].id
        console.log(tabIndex);
        that.setData({
          curIndex: tabIndex,
          paged: 1,
          tabId: tabId
        })

        wx.request({
          url: hostUrl + '/products',
          data: {
            oid: oid,
            cid: tabIndex,
            sid: clickId, //店铺ID
            paged: that.data.paged,
          },
          success: function (res) {
            var res = res.data;
            if (res.code == 1) {
              var goodList = that.data.proList.goodslist;
              var arr = res.data;
              if (arr) {
                arr.forEach(item => {
                  goodList.push(item);
                })
              }
              var paged = that.data.paged + 1;
              that.setData({
                paged: paged,
                // goodShop: goodList,
                proList: {
                  mainImages: '../../../images/typeBanner.jpg',
                  goodslist: goodList,
                },
                loadingHidden: true,
              })
            }
            else {
              that.setData({
                loadingHidden: true,
              })
            }
          }
        })
      }
    },

  //搜索后查看相应类型
  tabFunSort: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var tabList = that.data.tabList;
    // tabList[index].sort = !tabList[index].sort;
    // var so = tabList[index].sort;
    var type = e.currentTarget.dataset.index;
    var cid = that.data.curIndex;
    // var value = that.data.inputVal;
    that.setData({
      curIndexSort: index,
      paged: 1,
      loadingHidden: false,
      tabList: tabList,
      proList: []
    })
    console.log(that.data.curIndexSort)
    // 点击搜索后的搜索列表
    that.clickSearch(cid, type);
  },
  // 点击搜索后的搜索列表
  clickSearch: function(cid, by) {
    var that = this;
    // wx.setStorageSync('sort', sort);
    wx.setStorageSync('order', by);
    console.log(by)
    var paged = that.data.paged;
    var proList = that.data.proList;
    var uid = wx.getStorageSync('uid');
    var oid = wx.getStorageSync('oid');
    var sid = wx.getStorageSync('clickId');
    wx.request({
      url: hostUrl + '/products',
      data: {
        'oid': oid,
        'paged': paged,
        'uid': uid,
        'sort': false,
        'by': by,
        'type': '',
        'sid': sid,
         'cid': cid,
        'cid': cid,
      },
      method: 'GET',
      success: function (result) {
        var res = result.data;
        console.log(res)
        if (res.code == 1) {
          var datas = res.data;
          // for (var i = 0; i < datas.length; i++) {
          //   proList.push(datas[i]);
          // }
          that.setData({
            proList: {
              mainImages: '../../../images/typeBanner.jpg',
              goodslist: res.data,
            },  
            searchResult: "true"
          })
          

          paged++;
          that.setData({
            paged: paged
          })

        } else {
          that.setData({
            isempty: true,//显示底线
            // proList: proList,
            searchResult: "true"
          })
        }
      },
      complete: function () {
        that.setData({
          loadingHidden: true
        })
      }
    })

  },
  //查看商品细节
  toDetail(e){
    //console.log(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: '../../idxSubpackage/pages/proDetails/proDetails?id='+e.currentTarget.dataset.id,
    })
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
    var goodShop = that.data.proList.goodslist;
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
  bindscroll: function () {
      var that = this;
      that.setData({
        loadingHidden: false,
      });
      console.log("触底方法")
      var oid = wx.getStorageSync('oid');
      var cid = that.data.curIndex;
      that.getSelectCategory(oid,cid);
    },

})