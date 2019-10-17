// pages/idxSubpackage/pages/newDaily/newDaily.js
const hostUrl = require('../../../../config').hostUrl
Page({

    /**
     * 页面的初始数据
     */
    data: {
        searchResult: 'null',
        paged: 1,
        inputVal: '',
        hotList: [],
        hisList: [],
        curIndex: 0,
        isSort: false,
        isempty: false,
        proList: [],
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
        ],


    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this;
        that.setData({ loadingHidden: true })
        var sname = options.sname;
        console.log(sname);
        that.setData({
            inputVal: sname,
        })
        console.log(that.data.inputVal)
        var uid = wx.getStorageSync('uid');
        var oid = wx.getStorageSync('oid');
        //历史&热门搜索页
        if (sname) {
            console.log('2222');
            that.searchResult(sname);
            wx.setStorageSync('sname', sname);
            that.setData({ newDaliy: 'ok' });
        } else {
            console.log('3333' + "--" + oid);
            that.getNewdPro(oid, 'false', 0);
            that.setData({ prostatus: 'ok' });
            console.log(that.data.proList);
        }

    },
    //页面加载函数m
    onShow: function () {
        var that = this;
        that.setData({
            loadingHidden: false
        })
        var oid = wx.getStorageSync('oid');
        //that.getSearchList(oid);
    },

    //获取商品列表-推荐
    getNewdPro: function (oid, sort, by) {
        var that = this;
        var paged = that.data.paged;
        var proList = that.data.proList;
        wx.setStorageSync('sort', sort);
        wx.setStorageSync('order', by);
        wx.request({
            url: hostUrl + '/product',
            data: {
                'oid': oid,
                'type': 4,
                'paged': paged,
                'sort': sort,
                'by': by
            },
            method: 'GET',
            success: function (result) {
                console.log(result.data);
                var res = result.data;
                if (res.code == 1) {
                    var datas = res.data;
                    for (var i = 0; i < datas.length; i++) {
                        proList.push(datas[i]);
                    }
                    that.setData({ proList: proList })
                    paged++;
                    that.setData({ paged: paged })
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
    //获取热门&历史数据
    getSearchList: function (oid) {
        var that = this;
        wx.request({
            url: hostUrl + '/search',
            data: {
                'oid': oid,
                'type': 1,
                'uid': wx.getStorageSync('uid')
            },
            method: 'GET',
            success: function (result) {
                console.log(result.data);
                console.log('===========');
                var res = result.data;
                console.log(res);
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
        console.log('11111')
        var that = this;
        wx.request({
            url: hostUrl + '/search/1',
            data: {
                uid: wx.getStorageSync('uid'),
            },
            method: 'DELETE',
            success: function (result) {
                var res = result.data;
                if (res.code == 1) {
                    //清空数据
                    console.log('--------------');
                    that.setData({
                        hisList: [],
                    })
                }
            },
        })
    },

    //获取搜索框内容
    bindInputVal: function (e) {
        console.log(e);
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
            that.clickSearch(value);
        }
    },
    clickSearch: function (sname, sort, by) {
        var that = this;
        wx.setStorageSync('sort', sort);
        wx.setStorageSync('order', by);
        var paged = that.data.paged;
        var proList = that.data.proList;
        wx.request({
            url: hostUrl + '/search',
            data: {
                'oid': wx.getStorageSync('oid'),
                'paged': paged,
                'uid': wx.getStorageSync('uid'),
                'search': sname,
                'sort': sort,
                'by': by
            },
            method: 'POST',
            success: function (result) {
                var res = result.data;
                console.log(res);
                if (res.code == 1) {
                    console.log('-------+++');
                    var datas = res.data;
                    console.log(datas);
                    for (var i = 0; i < datas.length; i++) {
                        proList.push(datas[i]);
                    }
                    that.setData({
                        proList: proList,
                        prostatus: "ok",
                        newDaliy: 'false'
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
            newDaliy: 'ok',
            prostatus: 'false',
        })
    },
    //查看相应类型
    tabFun: function (e) {
        var that = this;
        var index = e.currentTarget.dataset.index;
        var tabList = that.data.tabList;
        tabList[index].sort = !tabList[index].sort;
        var so = tabList[index].sort;
        var type = tabList[index].id;
        var value = that.data.inputVal;
        var oid = wx.getStorageSync('oid');
        that.setData({
            curIndex: index,
            paged: 1,
            loadingHidden: false,
            tabList: tabList,
            proList: []
        })
        that.getNewdPro(oid, so, type);
        //that.clickSearch(value, so, type);
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

        this.setData({
            loadingHidden: false
        });

        //var clicksname = wx.getStorageSync('sname');

        var sort = wx.getStorageSync('sort');
        var order = wx.getStorageSync('order');


        if (!sort)  { sort = 'false'; }
        if (!order) { order = 1; }

        this.getNewdPro(oid, sort, order);
    }

})
