// pages/idxSubpackage/pages/proDetails/proDetails.js
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
        cartNum: '',//购物车里面的数量
        storeId: '',//当前门店id
        indexSwiper: 0,//当前图片下标
        isPlay: false,//播放图标
        showVideo: false,//播放地址
        num: 1,//数量
        proDetails: {},//商品详情信息
        product_images: [],//轮播图
        swiperList: [],//轮播图（含视频地址）
        attribute: [],//商品信息（重量、产地、存储）
        content: [],//产品详情图片
        storeInfo: [],//当前商店信息
        ask: '',//门店下方担保信息
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this;
        that.getUser()
        that.setData({
            id: options.id,
            oid: app.globalData.oid,
        })
        that.getGood()
        that.getCart()
    },
    onReady() {
        this.videoCtx = wx.createVideoContext('myVd')  //根据id绑定
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
    //获取用户信息
    getUser() {
        var that = this;
        that.setData({
            uid: wx.getStorageSync("uid"),
            oid: that.data.oid,
        })
    },
    //获取商品详情
    getGood() {
        var that = this;
        var params = that.data.id
        wx.request({
            url: hostUrl + '/products/' + params,
            method: "GET",
            data: {},
            success: function (res) {
                if (res.data.code == 1) {
                    that.setData({
                        proDetails: res.data.data,
                        product_images: res.data.data.product_images,
                        swiperList: res.data.data.product_images,
                        attribute: res.data.data.product_attribute,
                        content: res.data.data.product_mini_content,
                        storeId: res.data.data.sid,
                    })
                  console.log(that.data.proDetails)
                  console.log(that.data.showVideo)
                  console.log(that.data.proDetails.video)
                    if (res.data.data.video) {
                        that.data.swiperList.unshift(res.data.data.video)
                    }
                    that.setData({
                      swiperList: that.data.swiperList,
                      product_images: that.data.product_images
                    })
                    that.getDetail()
                }
            },
            complete(){
                that.setData({
                    loadingHidden: true
                })
            }
        })
    },
    //获取当前门店
    getDetail() {
        var that = this;
        var params = that.data.storeId
        wx.request({
            url: hostUrl + '/store/' + params,
            method: "GET",
            data: '',
            success: function (res) {
                if (res.data.code == 1) {
                    that.setData({
                        storeInfo: res.data.data,
                    })
                }
            }
        })
        wx.request({
            url: hostUrl + '/options',
            method: "GET",
            data: {
                oid: that.data.oid,
                type: 4,
            },
            success: function (res) {
                if (res.data.code == 1) {
                    that.setData({
                        ask: res.data.data,
                    })
                }
            }
        })
    },
    //减少
    reduce() {
        var that = this;
        if (that.data.num == 1) {
            that.setData({
                num: 1,
            })
        }
        else {
            var proNum = that.data.num;
            that.setData({
                num: --proNum,
            })
        }
    },
    //增加
    add() {
        var that = this;
        var proNum = that.data.num;
        var limit = that.data.proDetails.product_stock;
        if (proNum < limit){
          that.setData({
              num: ++proNum,
          })
        }else{
          wx.showToast({
            title: '超出商品库存！',
            icon:'none',
          })
        }
    },

    //获取购物车信息
    getCart() {
        var that = this;
        wx.request({
            url: hostUrl + '/storecart',
            method: "GET",
            data: {
                uid: that.data.uid,
                // uid:822,
                oid: that.data.oid
            },
            success: function (res) {
                if (res.data.code == 1) {
                    var a = res.data.data
                    for (let i = 0; i < a.length; i++) {
                        if (a[i].shopid == that.data.storeId) {
                            let cartList = a[i]
                            let goodList = a[i].list
                            that.setData({
                                cartNum: goodList.length,
                            })
                        }
                    }
                }
            }
        })
    },
    //加入购物车
    addCart() {
        var that = this;
        if (!app.isLogin()) {
          return
        }else{
          if (that.data.storeId != wx.getStorageSync("clickId")) {
            wx.showToast({
              title: '该商品不在当前门店哦！',
              icon: 'none',
            })
            // wx.showModal({
            //     title: '',
            //     content: '您所在门店【新鲜水果热卖场】不存在该商品，是否切换门店？',
            //     confirmColor: '#1ccfcf',
            //     confirmText:"切换",
            //     success(res) {
            //         if (res.confirm) {
            //             wx.navigateTo({
            //                 url: '/pages/mySubpackage/pages/bindMobile/bindMobile?oid=' + oid
            //             })
            //         } else if (res.cancel) {
            //             wx.reLaunch({
            //                 url: '/pages/tabBar/index/index?oid=' + oid,
            //             })
            //         }
            //     }
            // })
          } else {
            wx.request({
              url: hostUrl + '/storecart',
              method: "POST",
              data: {
                uid: that.data.uid,
                pid: that.data.id,
                oid: that.data.oid,
                shopid: that.data.storeId,
                num: that.data.num,
                shop_type: 1,
              },
              success: function (res) {
                wx.showToast({
                  title: '加入购物车成功！',
                  icon: 'none',
                })
                that.getCart()
              }
            })
          }
        };
        
    },


    //立即购买
    buyNow() {
        var that = this;
        if (!app.isLogin()) { 
          return
        }else{
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
            //return; 
            wx.setStorageSync("t", t);
            var arr = []
            arr.push(t)
            var c = JSON.stringify(arr)
            wx.setStorageSync("proArr", c)
            var proArr = wx.getStorageSync("proArr");
            wx.navigateTo({
              url: '/pages/cartSubpackage/pages/subOrder/subOrder?type=2',
            })
          }
        };
    },
    //分享按钮函数
    onShareAppMessage: function (ops) {
        var that = this
        if (ops.from === 'button') {
            // 来自页面内转发按钮
            var id = ops.target.dataset.id
        }
        return {
            title: that.data.proDetails.product_name,
            path: '/pages/idxSubpackage/pages/proDetails/proDetails?id=' + id,
            success: function (res) {
                // 转发成功
                console.log("转发成功:" + JSON.stringify(res));
            },
        }
    },


})