// pages/idxSubpackage/pages/newDaily/newDaily.js
const hostUrl = require('../../../../config').hostUrl
const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        paged: 1,
        curIndex: 0,//当前选中tab的下标
        isempty: false,//是否显示底线
        proList: [],//当前商品列表
        proList1: [],//当前选中tab的商品列表
        tabList: [{
            name: '综合',
            sort: false,
            id: 4
        },
        {
            name: '销量',
            sort: false,
            id: 1

        },
        {
            name: '最新',
            sort: false,
            id: 2
        },
        {
            name: '价格',
            sort: false,
            id: 3
        },
        ],//头部tab分类
        type_id:0,//跳转传过来的id
        id:'',
        uid: '',//当前用户id
        oid: '',//行业id
        storeId: '',//门店id
        isLoadMore: false,//加载更多，当前不需要
        isPrice: true,//上下排序变换
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this;
        var type_id = options.id; //橱窗类型首页1，2，3，4
      console.log(type_id)
        wx.setNavigationBarTitle({
            title: options.name
        })
        that.setData({
          uid: wx.getStorageSync('uid'),
          oid: app.globalData.oid,
          id: type_id,
          storeId: wx.getStorageSync("clickId"),
          loadingHidden: false
        })
        that.setData({ loadingHidden: true, type_id: type_id })
        // that.getNewdPro()
      var a = {
        currentTarget: {
          dataset: {
            index: that.data.curIndex,
            paged: that.data.paged
          }
        }
      }
      that.tabFun(a);
    },
    //页面加载函数m
    onShow: function () {
        var that = this;
        that.setData({
            loadingHidden: true
        })
        var type_id = that.data.type_id;
    },
    onHide: function () {
      var that = this;
      that.setData({
        loadingHidden: true
      })
    },

    //加入购物车
    addCart(e) {
      var that = this;
      var index = e.currentTarget.dataset.index;
      var proList = that.data.proList1;
      if (!app.isLogin()) { return; }; //检测是否登录
      wx.request({
        url: hostUrl + '/storecart',
        method: "POST",
        data: {
          uid: wx.getStorageSync("uid"),
          pid: proList[index].id,
          shopid: wx.getStorageSync("clickId"),
          num: 1,
          oid: app.globalData.oid,
          shop_type: 1,
        },
        success: function (res) {
          console.log(res);
          var res = res.data;
          if (res.code == 1) {
            if (that.cartNum == 0) {
              that.empty = 1
            }
            wx.showToast({
              title: '加入购物车成功！',
              icon: 'none',
            })
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
    //获取商品列表-推荐
    getNewdPro: function () {
        var that    = this;
        wx.request({
            url: hostUrl + '/products',
            data: {
                oid: that.data.oid,
                type: that.data.type_id,
                sid: that.data.storeId,
                paged: that.data.paged,
                by: that.data.curIndex+1
            },
            method: 'GET',
            success: function (result) {
                console.log('获取商品列表：',result.data);
                var res = result.data;
                if (res.code == 1) {
                    var datas = res.data;
                    // for (var i = 0; i < datas.length; i++) {
                    //     that.data.proList.push(datas[i]);
                    // }
                    that.setData({ proList: datas })
                    that.setData({ proList1: that.data.proList })
                    // that.data.paged++;
                    // that.setData({ paged: that.data.paged })
                } else {
                    that.setData({
                        isempty: true //显示底线
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

    //查看相应类型
    tabFun(e) {
      var that = this;
      wx.showLoading({
        title: '加载中...',
      })
      var index = e.currentTarget.dataset.index;
      var paged = e.currentTarget.dataset.paged;
      //切换tab栏的请求
      if (that.data.curIndex != index) {
        that.setData({
          paged: 1,
          proList1:[]
        })
      }
      else {
        if (paged) {
          that.setData({
            paged: paged,
          })
        }
        else {
          that.setData({
            paged: 1,
            proList1: [],
            isPrice: !that.data.isPrice
          })
        }
      }
      that.setData({
        curIndex: index,
      })
      if (that.data.curIndex) {
        var params = {
          oid: that.data.oid,
          type: that.data.type_id,
          sid: that.data.storeId,
          by: index + 1,
          sort: that.data.isPrice,
          paged: that.data.paged,
        }
      }
      else {
        var params = {
          oid: that.data.oid,
          type: that.data.type_id,
          sid: that.data.storeId,
          by: index + 1,
          paged: that.data.paged,
        }
      }
      wx.request({
        url: hostUrl + '/products',
        data: params,
        method: 'GET',
        success: function (result) {
          console.log('获取商品列表：', result.data);
          var res = result.data;
          if (res.code == 1 && res.data != '') {
            var arr = res.data;
            for (var i = 0; i < arr.length; i++) {
                that.data.proList1.push(arr[i]);
            }
            that.setData({ proList1: that.data.proList1 })
            if (that.data.paged == 1 && arr.length < 5) {
              that.setData({
                isLoadMore: false,
                scrollWatch:false
              })
            }
            else {
              that.setData({
                isLoadMore: true,
                scrollWatch: true
              })
            }
            // that.paged++
            that.data.paged++;
            that.setData({ paged: that.data.paged })
          } else {
            that.setData({
              isLoadMore: false,
              scrollWatch: false
            })
          }
        },
        complete: function () {
          that.setData({
            loadingHidden: true
          })
        }
      })
      setTimeout(() => {
        wx.hideLoading();
      }, 500);
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
      var that = this 
        // this.setData({
        //     loadingHidden: false
        // });
        // setTimeout(() => {
        //   this.setData({
        //     loadingHidden: true
        //   });
        // }, 500);
        // var oid        = wx.getStorageSync('oid');
        // var sort       = wx.getStorageSync('sort');
        // var order      = wx.getStorageSync('order');
        // var ccid       = wx.getStorageSync('ccid');

        var a = {
          currentTarget: {
            dataset: {
              index: that.data.curIndex,
              paged:that.data.paged
            }
          }
        }
        that.tabFun(a);

        // if (!sort) {
        //     sort = 'false';
        // }
        // if (!order) {
        //     order = 1;
        // }
        // if(ccid == 0){
        //     this.getNewdPro(oid, sort, order);
        // }else{
        //     // this.getChildCatlist(oid, ccid, sort, order);
        // }
    }

})
