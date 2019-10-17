// pages/mySubpackage/pages/comments/comments.js
const hostUrl = require('../../../../config').hostUrl
Page({

    /**
     * 页面的初始数据
     */
    data: {
        imgLists: [],
        list1: [
            {image: '/pages/common/images/icon-yellow.png'},
            {image: '/pages/common/images/icon-yellow.png'},
            {image: '/pages/common/images/icon-yellow.png'},
            {image: '/pages/common/images/icon-yellow.png'},
            {image: '/pages/common/images/icon-yellow.png'},
        ],
        list2: [
            {image: '/pages/common/images/icon-gray.png'},
            {image: '/pages/common/images/icon-gray.png'},
            {image: '/pages/common/images/icon-gray.png'},
            {image: '/pages/common/images/icon-gray.png'},
            {image: '/pages/common/images/icon-gray.png'},
        ],
        list3: [
            {image: '/pages/common/images/icon-gray.png'},
            {image: '/pages/common/images/icon-gray.png'},
            {image: '/pages/common/images/icon-gray.png'},
            {image: '/pages/common/images/icon-gray.png'},
            {image: '/pages/common/images/icon-gray.png'},
        ],
        logicscore: 0,
        servicescore: 0,
        promatch: 5,
        orderid: 0,
        pid:0,
        orderinfo: [],
        attr1:'',
        attr2: '',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var that = this;
        var orderid = options.orderid;
        var pid     = options.pid;
        var image   = options.image;
        var attr1   = options.attr1;
        var attr2   = options.attr2;
        that.setData({
            orderid: orderid,
            pid: pid,
            image: image,
            loadingHidden:true
        })
    },
    //添加评论图
    addImg: function() {
        var that = this;
        var uid = wx.getStorageSync('uid');
        var oid = wx.getStorageSync('oid');
        wx.chooseImage({
            count: 3,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success: function(res) {
                var imgLists = res.tempFilePaths;
                var img = imgLists[0];

                if (that.data.imgLists.length + imgLists.length < 4) {
                    for (var i = 0; i < imgLists.length; i++) {
                        that.data.imgLists.push(imgLists[i])
                    }
                    that.setData({
                        imgLists: that.data.imgLists,
                    })
                } else {
                    for (var i = 0; i < 4 - that.data.imgLists.length; i++) {
                        that.data.imgLists.push(imgLists[i])
                    }
                    that.setData({
                        imgLists: that.data.imgLists,
                    })
                }
            },
        })
    },

    //删除图片
    clickDel: function(e) {
        var that     = this;
        var index    = e.currentTarget.dataset.index;
        var imgLists = that.data.imgLists;
        imgLists.splice(index, 1);
        that.setData({
            imgLists: imgLists,
        })

    },
    //商品相符
    productComm: function(e) {
        var that      = this;
        var index     = e.currentTarget.dataset.index;
        var orderinfo = that.data.orderinfo;
        var list_s = that.data.list1;
        for (var i = 0; i < list_s.length; i++) {
            if (index >= i) {
                list_s[i].image = '/pages/common/images/icon-yellow.png';
            } else {
                list_s[i].image = '/pages/common/images/icon-gray.png';
            }
        }

        that.setData({
            promatch: index + 1,
            list1: list_s,
        })
    },
    //物流服务
    logistics: function(e) {
        var that = this;
        var index = e.currentTarget.dataset.index;
        console.log(index)
        var list2 = that.data.list2;
        console.log(list2.length)
        for (var i = 0; i < list2.length; i++) {
            if (index >= i) {
                list2[i].image = '/pages/common/images/icon-yellow.png';
            } else {
                list2[i].image = '/pages/common/images/icon-gray.png';
            }
        }
        that.setData({
            logicscore: index + 1,
            list2: list2,
        })
    },
    //服务态度
    attitude: function(e) {
        var that = this;
        var index = e.currentTarget.dataset.index;
        console.log(index)
        var list3 = that.data.list3;
        console.log(list3.length)
        for (var i = 0; i < list3.length; i++) {
            if (index >= i) {
                list3[i].image = '/pages/common/images/icon-yellow.png';
            } else {
                list3[i].image = '/pages/common/images/icon-gray.png';
            }
        }
        that.setData({
            servicescore: index + 1,
            list3: list3,
        })
    },
    bindFormSubmit(e) {
        var that = this;
        var imgLists = that.data.imgLists;
        var servicescore = that.data.servicescore;
        var logicscore = that.data.logicscore;
        var promatch = that.data.promatch;
        var orderid = that.data.orderid;
        var proid = that.data.pid;
        var attr1 = that.data.attr1;
        var attr2 = that.data.attr2;
        var uid = wx.getStorageSync('uid');
        var oid = wx.getStorageSync('oid');

        var note = e.detail.value.comment_content;
        if (note.length <= 0) {
            wx.showToast({
                title: '评价内容需要填写哟!',
                icon: 'none'
            })
        } else if (logicscore <= 0) {
            wx.showToast({
                title: '给物流服务打个分吧！',
                icon: 'none'
            })
        } else if (servicescore <= 0) {
            wx.showToast({
                title: '给服务态度打个分吧!',
                icon: 'none'
            })
        } else {

            that.setData({
                loadingHidden: false
            })

            console.log(imgLists);
            console.log("图片信息");
            wx.request({
                url: hostUrl + '/comment',
                data: {
                    'oid': oid,
                    'uid': uid,
                    'proid': proid,
                    'promatch': promatch,
                    'note': note,
                    'servicescore': servicescore,
                    'logicscore': logicscore,
                    'orderid': orderid,
                    'attr1': attr1,
                    'attr2': attr2,
                    'type': 1,
                },
                method: 'POST',
                success: function(result) {
                    console.log(result.data);
                    var res = result.data;
                    if (res.code == 1) {
                        if (imgLists.length > 0) {
                            
                            //进行图片上传操作
                            for (var i = 0; i < imgLists.length; i++) {
                                that.setData({ loadingHidden: false })
                                wx.uploadFile({
                                    url: hostUrl + '/comment',
                                    filePath: imgLists[i],
                                    name: 'commentimg',
                                    formData: {
                                        uid: uid,
                                        oid: oid,
                                        cid: res.data,
                                        type: 2,
                                    },
                                    success: function (res) {
                                        that.setData({
                                            loadingHidden: true
                                        })
                                    },
                                    complete: function () {}
                                })
                            }

                        }

                        that.setData({
                            loadingHidden: true
                        })
                        wx.showToast({
                            icon: 'none',
                            title: res.msg
                        })

                        wx.redirectTo({
                            url: '/pages/mySubpackage/pages/order/order?name=待评价'
                        })

                    } else {
                        wx.showToast({
                            icon: 'none',
                            title: res.msg
                        })
                    }
                },
                complete: function() {}
            })

        }
    }
})