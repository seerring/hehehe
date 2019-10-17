// pages/idxSubpackage/pages/searchPage/searchPage.js
const hostUrl = require('../../../../config').hostUrl
const app = getApp()
Page({
    /**
     * 页面的初始数据
     */
    data: {
        searchResult: 'null',//是否显示搜索商品列表
        paged: 1,
        inputVal: '',//搜索的内容
        hotList: [],//热门搜索
        hisList: [],//历史搜索
        curIndex: 0,//搜索后当前选中tab
        isSort: false,//选中样式
        isempty: false,//显示底线
        ishis: false,//是否显示历史搜索
        proList: [],//搜索商品列表
        tabList: [
            {
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
        ],//搜索分类
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this;
        var sname = '';
        // var sname = options.sname
        that.setData({
            inputVal: sname,
        })
        var oid = wx.getStorageSync('oid');
        var uid = wx.getStorageSync('uid');
        //如果用户未登录则不显示历史搜索
        if(uid){
            that.setData({
                ishis:true
            })
        }
        //历史&热门搜索页
        if (sname) {
            that.searchResult(sname);
            wx.setStorageSync('sname', sname);
        }

        //获取搜索热门和历史
        that.getSearchList(oid,uid);
    },

    // onShow: function () {
    //     var that = this;
    //     that.setData({
    //         loadingHidden: false
    //     })
    //     var oid = wx.getStorageSync('oid');
    //     that.getSearchList(oid);
    // },

    //获取热门&历史数据
    getSearchList: function (oid,uid) {
        var that = this;
        var sid = wx.getStorageSync('clickId');
        wx.request({
          url: hostUrl + '/storesearch',
            data: {
                'oid': oid,
                'uid': uid,
                'type': 1,
                'sid': sid

            },
            method: 'GET',
            success: function (result) {
                var res = result.data;
                if (res.code == 1) {
                    that.setData({
                        hisList: res.data['his'],
                        hotList: res.data['hot']
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

    //清除历史搜索
    clearhisbtn: function (e) {
        var that = this;
        var uid = wx.getStorageSync('uid');
        wx.request({
          url: hostUrl + '/storesearch/'+ uid,
            method: 'DELETE',
            success: function (result) {
                var res = result.data;
                if (res.code == 1) {
                    //清空数据
                    that.setData({
                        hisList: [],
                    })
                }
            },
        })
    },

    // 点击历史搜索和热门搜索关键词触发搜索
    quickSearch: function(e){
      var that = this;
      var inputVal = e.currentTarget.dataset.sname;
      var hisListtem = that.data.hisList;
      var flag = true;
      //去重查询是否历史记录里面已经有了该关键词
      for (var i = 0; i < hisListtem.length;i++){
        if (hisListtem[i].sname == inputVal){
          flag = false;
          break;
        }
      }

      if(flag){
          var par = {
            sname: inputVal
          }
          hisListtem.push(par);  //没有重复的关键词时就推入数组

        }

      that.setData({
        paged: 1,
        inputVal: inputVal,
        loadingHidden: false,
        proList: [],
        hisList: hisListtem,
      })

      // that.hisList = inputVal;
      wx.setStorageSync('sname', inputVal);
      // 点击搜索后的搜索列表
      that.clickSearch(inputVal,false,1);

    },

    //加入购物车
    addCart(e) {
      var that = this;
      var index = e.currentTarget.dataset.index;
      var goodShop = that.data.proList;
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
            // that.getCart();
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

    //获取搜索框内容
    bindInputVal: function (e) {
        var that = this;
        var inputVal = e.detail.value;
        that.setData({
            inputVal: inputVal,
        })
    },
    //搜索结果
    searchResult: function () {
        var that = this;
        var value = that.data.inputVal;
        if (!value) {
            wx.showToast({
                icon: 'none',
                title: '请输入关键字！',
            })
        } else {
            that.setData({
                paged: 1,
                loadingHidden: false,
                proList: [],
            })
            //不为空,获取数据
            wx.setStorageSync('sname', value);
            // 点击搜索后的搜索列表
            that.clickSearch(value,false,1);
        }
    },
    // 点击搜索后的搜索列表
    clickSearch: function (sname, sort, by) {
        var that = this;
        wx.setStorageSync('sort', sort);
        wx.setStorageSync('order', by);
        var paged = that.data.paged;
        var proList = that.data.proList;
        var uid = wx.getStorageSync('uid');
        var oid = wx.getStorageSync('oid');
        var sid = wx.getStorageSync('clickId');
        wx.request({
            url: hostUrl + '/storesearch',
            data: {
                'oid': oid,
                'paged': paged,
                'uid': uid,
                'search': sname,
                'sort': sort,
                'by': by,
                'type': 2,
                'sid': sid
            },
            method: 'GET',
            success: function (result) {
                var res = result.data;
                if (res.code == 1) {
                    var datas = res.data;
                    for (var i = 0; i < datas.length; i++) {
                        proList.push(datas[i]);
                    }
                    that.setData({
                        proList: proList,
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

    //获得焦点
    focusFun: function (e) {
        var that = this;
        that.setData({
            searchResult: 'null',
        })
    },
    //搜索后查看相应类型
    tabFun: function (e) {
        var that = this;
        var index = e.currentTarget.dataset.index;
        var tabList = that.data.tabList;
        tabList[index].sort = !tabList[index].sort;
        var so = tabList[index].sort;
        var type = tabList[index].id;
        var value = that.data.inputVal;
        that.setData({
            curIndex: index,
            paged: 1,
            loadingHidden: false,
            tabList: tabList,
            proList: []
        })
        // 点击搜索后的搜索列表
        that.clickSearch(value, so, type);
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

        this.setData({
            loadingHidden: false
        });

        var clicksname = wx.getStorageSync('sname');
        var sort = wx.getStorageSync('sort');
        var order = wx.getStorageSync('order');
        if (!sort) {
            sort = 'false';
        }
        if (!order) {
            order = 1;
        }
        if (clicksname) {
          // 点击搜索后的搜索列表
            this.clickSearch(clicksname, sort, order);
        }
    }
})