// pages/idxSubpackage/pages/specialDes/specialDes.js
const hostUrl = require('../../../../config').hostUrl
const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        // content: [],
        id: '',//当前特价商品id
        uid: '',//当前用户id
        sid: '',//当前商店id
        oid: '',//行业id
        indexSwiper: 0,//轮播图下标
        isPlay: false,//来控制封面图和视频
        showVideo: false,//来控制封面图和视频
        // isShareModal: false,
        proDes: {},//商品信息
        buyNum: 1,//购买数量
        swiperList: [],//轮播图
        attribute: [],//商品信息（重量、产地、存储）
        cartList: [],//购物车数量
        // argInfos: {},
        // special: 1,
        myLimit: '',//限购数量
        ask: '',//门店下方担保信息
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var that = this;
        that.setData({
            id: options.id,
            oid: app.globalData.oid,
            uid: wx.getStorageSync("uid"),
            sid: wx.getStorageSync("clickId"),
        })
        //购物车数量
        that.getCartList();
        //商品详情
        that.getProductDes();
    },
    onReady() {
        this.videoCtx = wx.createVideoContext('myVd') //根据id绑定
        wx.hideLoading();
    },
    //购物车数量
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
            success: function(res) {
                if (res.data.data.code == 1 && res.data.data.length > 0) {
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
    //商品详情
    getProductDes() {
        var that = this;
        var data = that.data.id + '?sid=' + wx.getStorageSync("clickId");
        wx.request({
            url: hostUrl + '/special/' + data,
            method: "GET",
            data: '',
            success: function(res) {
                that.setData({
                    proDes: res.data.data,
                    swiperList: res.data.data.product_images,
                    attribute: res.data.data.product_attribute,
                })
              console.log(that.data.proDes)
              console.log(that.data.showVideo)
              console.log(that.data.proDes.video)
                that.setData({
                    // content: that.data.proDes.product_content,
                })
                if (res.data.data.video) {
                    that.data.swiperList.unshift(res.data.data.video)
                    that.setData({
                        swiperList: that.data.swiperList,
                    })
                }
            }
        })
        var data2 = that.data.id + '?uid=' + that.data.uid;
        wx.request({
            url: hostUrl + '/special/' + data2,
            method: "GET",
            data: '',
            success: function(res) {
                that.setData({
                    myLimit: res.data.data.buy_num,
                })
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
            success: function(res) {
                if (res.data.code == 1) {
                    that.setData({
                        ask: res.data.data,
                    })
                }
            }
        })
    },

    //轮播图视频
    playVd(e) {
        //隐藏封面图和播放图标
        this.setData({
            showVideo: true, //来控制封面图
            isPlay: true
        })
        this.videoCtx.play();
    },
    //商品主图
    indexSwiperChange(index) {
        var that = this;
        var currentItem = index.detail.current;
        //当前滑动位置大于0，暂停视频并且重新加载封面
        if (currentItem > 0) {
            that.videoCtx.pause();
            that.videoCtx.seek(0);
            that.setData({
                showVideo: false, //来控制封面图
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
        } else {
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
        } else {
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
        if (that.data.buyNum > that.data.myLimit) {
            wx.showToast({
              title: '您最多还可购买' + that.data.myLimit + '件哦~',
              icon: 'none',
            })
        } else {
            that.data.proDes.buyNum = that.data.buyNum
            that.setData({
              proDes: that.data.proDes
            })
            var proArr = [];
            proArr.push(that.data.proDes);
            wx.setStorageSync("proArr", JSON.stringify(proArr));
            var proArr = wx.getStorageSync("proArr");
            wx.navigateTo({
                url: '/pages/cartSubpackage/pages/subOrder/subOrder?type=1',
            })
        }
        }else{
          that.showBuyWarn()
        }
    },

    //立即购买
    buyNow() {
        var that = this;
        if (!app.isLogin()) {
            return;
        };
        if (that.data.storeId != wx.getStorageSync("clickId")) {
            wx.showToast({
                title: '该商品不在当前门店哦！',
                icon: 'none',
            })
        } else {
            var t = that.data.proDetails;
            t.buyNum = that.data.num;
            t.original_price = that.data.proDetails.product_price;
            t.present_price = that.data.proDetails.product_fact_price;
            t.logo = that.data.storeInfo.logo;
            t.name = that.data.storeInfo.name;

            wx.setStorageSync("t", t);
            var arr = []
            arr.push(t)
            var c = JSON.stringify(arr)
            wx.setStorageSync("proArr", c)
            var proArr = wx.getStorageSync("proArr");
            wx.navigateTo({
                url: '/pages/cartSubpackage/pages/subOrder/subOrder?type=1',
            })
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
    onShareAppMessage: function(ops) {
        var that = this
        if (ops.from === 'button') {
            // 来自页面内转发按钮
        }
        return {
          title: that.data.proDes.product_name,
          path: '/pages/idxSubpackage/pages/specialDes/specialDes?id=' + that.data.id,
          success: function(res) {
              // 转发成功
              console.log("转发成功:" + JSON.stringify(res));
          },
        }
    },


})