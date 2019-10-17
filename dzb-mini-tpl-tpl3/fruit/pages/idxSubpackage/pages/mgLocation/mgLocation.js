const hostUrl = require('../../../../config').hostUrl
const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        phone: '', //手机号码
        code: '', //短信验证码
        password: '', //密码
        r_password: '', //确认密码
        uid: '',//当前用户id

        myPlace: '',//当前地址
        regeo: '',//更改当前位置
        area: '',//更改当前位置
        lng: '',//经度
        lat: '',//纬度
        list: [],//附近地址列表
        // location: [],
        // myAddress: [],
        detail: '',//详细地址
        region: '',//选择地址
        oid:'',//行业id
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this
        that.setData({
            lng: wx.getStorageSync("lng"),
            lat: wx.getStorageSync("lat"),
            oid: app.globalData.oid,
            uid: wx.getStorageSync("uid")
        });
        that.getLct();
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
            success: function (res) {
                var res = res.data;
                if (res.code == 1) {
                    that.setData({
                        regeo: res.data.regeo,
                        area: res.data.area,
                        list: res.data.nearregeo,
                    });
                    if (wx.getStorageSync("myLocate")) {
                        that.setData({
                            myPlace: wx.getStorageSync("myLocate"),
                        });
                    }
                    else {
                        that.setData({
                            myPlace: that.data.area,
                        });
                        wx.setStorageSync("myLocate", that.data.myPlace)
                    }
                }
            },
            complete(){
                that.setData({
                    loadingHidden: true
                })
                wx.hideLoading();
            }
        })
    },
    //重新定位
    locateAgain() {
        this.getPosition();
        wx.showLoading({
            title: '定位中....',
        })
    },
    //获取定位信息
    getPosition() {
        var that = this;
        wx.getSetting({
            success(res) {
                if (!res.authSetting['scope.userLocation']) {
                    wx.openSetting({
                        success(res) {
                            var userauth = res.authSetting;
                            if (userauth['scope.userLocation']) {
                                console.log("手动授权成功");
                                wx.showToast({
                                    title: '授权成功，正在定位中...',
                                    icon: 'none',
                                })
                                that.getUserLocation();
                            } else {
                                wx.showToast({
                                    title: '授权取消',
                                    icon: 'none',
                                })
                            }
                        }
                    })
                }else{
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
                wx.clearStorage("myLocate")
                that.changeLat(); //坐标转换位置信息
            },
            fail: function (res) {
                wx.request({
                    url: hostUrl + '/randsid',
                    data: {
                        oid: that.data.oid,
                    },
                    success: function (res) {
                        var res = res.data;
                        setTimeout(() => {
                            wx.hideLoading();
                            wx.showToast({
                                title: '定位失败!',
                                icon: 'none',
                            })
                        }, 500);
                    }
                })
            }
        })
    },
    //获取随机门店信息
    getRandStore(){
        var that = this;
        wx.request({
            url: hostUrl + '/randsid',
            data: {
                oid: that.data.oid,
            },
            success: function (res) {
                var res = res.data;
                setTimeout(() => {
                    wx.hideLoading();
                    wx.showToast({
                        title: '定位失败!',
                        icon: 'none',
                    })
                }, 500);
            }
        })
    },
    //经纬度转换
    changeLat() {
        var that = this;
        console.log("坐标信息",that.data.lng, that.data.lat);
        var m = that.data.lng + ',' + that.data.lat;
        wx.request({
            url: hostUrl + '/location',
            method: 'GET',
            data: {
                type: 3,
                returnlat: m,
            },
            success: function (res) {
                var res = res.data;
                if (res.code == 1) {
                    that.setData({
                        lng: res.data[0],
                        lat: res.data[1],
                    })
                    wx.setStorageSync("lng", that.data.lng);
                    wx.setStorageSync("lat", that.data.lat);
                    that.getLct()
                }
                else {
                    wx.showToast({
                        title: '经纬度转换失败！',
                        icon: 'none',
                    })
                }
            }
        })
    },
    //当前选择的省市区
    bindRegionChange: function (e) {
        console.log('picker发送选择改变，携带值为', e.detail.value)
        var arr = e.detail.value;
        var arr1 = arr[0];
        var arr2 = arr[1];
        var arr3 = arr[2];
        var region = arr1 + ' ' + arr2 + ' ' + arr3;
        this.setData({
            region: region,
        })
    },

    //填写的具体地址
    inputValue(e) {
        this.setData({
            detail: e.detail.value
        })
    },

    //更改当前位置
    changePlace(index) {
        var that = this
        var l = that.data.list
        var index = index.target.dataset.index
        var pos = that.data.regeo + that.data.area + l[index]
        console.log(pos)
        wx.request({
            url: hostUrl + '/location',
            method: 'GET',
            data: {
                type: 1,
                pos: pos,
            },
            success: function (res) {
                console.log(res);
                var res = res.data;
                if (res.code == 1) {
                    that.setData({
                        lng: res.data[0],
                        lat: res.data[1],
                    })
                    wx.setStorageSync("lng", that.data.lng);
                    wx.setStorageSync("lat", that.data.lat);
                    wx.setStorageSync("myLocate", l[index]);
                    wx.switchTab({
                        url: '../../../tabBar/index/index?name=' + l[index],
                    })
                    console.log(l[index])
                }
            }
        })
    },
    //确认切换
    confirmCg() {
        var that = this;
        var a = that.data.region
        // a = a.join('')
        var b = a + that.data.detail
        var url_str = 'https://restapi.amap.com/v3/geocode/geo';
        console.log("地址获取：",b)
        if (that.data.detail) {
            wx.setStorageSync("myLocate", that.data.detail);
            wx.request({
                url: url_str,
                method: 'GET',
                data: {
                    key: "a74c378cd0b53e0ea9d6b7db9312306d",
                    address: b,
                },
                success: function (res) {
                    console.log("地图获取",res.data);
                    var r = res.data;
                    if (r.status == 1 && r.count > 0){
                        wx.showToast({
                            icon: 'success',
                            title: "地址切换成功",
                        })
                        var info  = r.geocodes[0].location;
                        var datas = info.split(',');
                        that.setData({
                            lng: datas[0],
                            lat: datas[1],
                        })
                        wx.setStorageSync("lng", datas[0]);
                        wx.setStorageSync("lat", datas[1]);
                        wx.switchTab({
                            url: '../../../tabBar/index/index?changeStore=1'
                        })
                    }else{
                        wx.showToast({
                            icon: 'none',
                            title: "地址切换失败",
                        })
                    }
                }
            })
        }else{
            wx.showToast({
                icon: 'none',
                title: "地址信息不完整",
            })
        }
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },
  /**
  * 生命周期函数--监听页面隐藏
  */
  onHide: function () {
    var that = this
    wx.setStorageSync("uid", that.data.uid)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    var that = this
    wx.setStorageSync("uid", that.data.uid)
  },
})