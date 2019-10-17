// pages/mySubpackage/pages/myCenter/myCenter.js
const hostUrl = require('../../../../config').hostUrl


Page({

     /**
      * 页面的初始数据
      */
     data: {
          isdefavatar:true,//默认头像是否显示
          isShowModal:false,//点击头像出来的底部弹窗
          animationData:{},//动画效果
          defavatar: '../../images/defHead.png',//默认头像
          newavatar:'',//上传的最新头像
          name:'',//昵称
          sex:'',//性别
          mobile:'',//手机号
          stringImg:'',//头像路径
     },

     /**
      * 生命周期函数--监听页面加载
      */
     onLoad: function (options) {
       var that = this;
       var uid = wx.getStorageSync('uid');
       if (uid) {
         //获取当前用户信息
          that.getUser(uid);
         console.log(`"性别获取完成，获取的性别是"${that.data.sex}`)
        } else {
         wx.reLaunch({
           url: '/pages/common/pages/login/login?oid=' + oid
         })
        }
     },
     onHide:function(){
       var that = this;
       that.setData({
         sex:null
       })
     },
      //获取当前用户信息
     getUser: function (uid) {
        var that = this;
        var oid = wx.getStorageSync('oid');
        wx.request({
          url: hostUrl + '/user/' + uid,
          data: {},
          method: 'GET',
          success: function (result) {
            var res = result.data;
            if (res.code == 1) {
              that.setData({
                name: res.data.nickname,
                defavatar: res.data.avatar,
                stringImg:res.data.avatar,
                sex: res.data.gender,
                mobile: res.data.mobile,
              })
              console.log(that.data.defavatar)
              // if (that.data.defavatar){
              //   that.setData({
              //     isdefavatar:false
              //   })
              // }
            }
            else {

              wx.showToast({
                icon: 'none',
                title: res.msg,
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

     //头像上传方式
     uploadWay:function(){
          var that = this;
          // 创建一个动画实例
          var animation = wx.createAnimation({
               // 动画持续时间
               duration:500,
               // 定义动画效果，当前是匀速
               timingFunction: "linear",
               delay:0,
          })
          // 将该变量赋值给当前动画
          that.animation = animation;
          // 先在y轴偏移，然后用step()完成一个动画
          animation.translateY(200).step();
          // 用setData改变当前动画
          that.setData({
               // 通过export()方法导出数据
               animationData: animation.export(),
               // 改变view里面的Wx：if
               isShowModal: true,
          })
          // 设置setTimeout来改变y轴偏移量，实现有感觉的滑动
          setTimeout(function () {
               animation.translateY(0).step();
               that.setData({
                    animationData: animation.export()
               })
          }, 200)
     },
     //上传头像
     cameraUpload:function(){
          var that = this;
          wx.chooseImage({
               count:1,
               sizeType: ['original','compressed'],
               sourceType: ['camera'],
               success: function(res) {
                    var avatar = res.tempFilePaths[0];
                    that.setData({
                         newavatar: avatar,
                         isShowModal:false,
                         isdefavatar:false,
                    })

                    wx.uploadFile({
                      url: hostUrl + "/xcxavatar",
                      filePath: avatar,
                      name: 'avatar',
                      formData: {
                        'user': 'test'
                      },
                      success(res) {
                        var data = res.data;
                        that.setData({
                          newavatar: data
                        })
                        var stringImg = that.data.newavatar.toString()
                        that.setData({
                          stringImg: stringImg,
                        })
                      }
                    })

               },
          })
     },
     //从手机相册选择
     photoUpload:function(){
          var that = this;
          wx.chooseImage({
               count: 1,
               sizeType: ['original', 'compressed'],
               sourceType: ['album'],
               success: function (res) {
                    var avatar = res.tempFilePaths[0];
                    that.setData({
                         defavatar: avatar,
                         isShowModal: false,
                    })
                 console.log(that.data.isdefavatar)
                    console.log("从手机相册选择头像")
                    wx.uploadFile({
                      url: hostUrl + "/xcxavatar",
                      filePath: avatar,
                      name: 'avatar',
                      formData: {
                        'user': 'test'
                      },
                      success(res) {
                        var data = res.data;
                        that.setData({
                          newavatar: data
                        })
                        console.log(that.data.defavatar)
                        var stringImg = that.data.defavatar.toString()
                        that.setData({
                          stringImg: stringImg,
                        })
                      }
                    })

               },
          })
     },
     //关闭弹窗
     cancleModal:function(){
          var that = this;
          var animation = wx.createAnimation({
               duration: 1000,
               timingFunction: 'linear'
          })
          that.animation = animation
          animation.translateY(300).step()
          that.setData({
               animationData: animation.export()

          })
          setTimeout(function () {
               animation.translateY(0).step()
               that.setData({
                    animationData: animation.export(),
                    isShowModal: false
               })
          }, 500)
     },
     //昵称
     nameVal:function(e){
          var that = this;
          var name = e.detail.value;
          that.setData({
               name: name,
          })
     },
     //性别
     radioChange:function(e){
          var that = this;
          var sex = e.detail.value;
          that.setData({
               sex: sex,
          })
     },
     //保存
     saveBtn:function(){
          var that = this;
          if (!that.data.newavatar && !that.data.defavatar){
               wx.showToast({
                    icon:'none',
                    title: '请上传头像！',
               })
          }
          else if(!that.data.name){
               wx.showToast({
                    icon: 'none',
                    title: '请填写昵称！',
               })
          }
          else{
            var params = wx.getStorageSync("uid") + '?gender=' + that.data.sex + '&nickname=' + that.data.name + '&avatar=' + that.data.stringImg
            console.log(params)
            wx.request({
              url: hostUrl + '/user/' + params,
              data: '',
              method: 'PUT',
              success: function (result) {
                var res = result.data;
                if (res.code == 1) {
                  wx.showToast({
                    title: res.msg,
                    icon: 'none',
                  })
                  setTimeout(()=>{
                    wx.switchTab({
                      url:"/pages/tabBar/my/my",
                    })
                  },1000)

                } else {
                  wx.showToast({
                    title: res.msg,
                    icon: 'none',
                  })
                }
              },
              complete: function () {
                that.setData({
                  loadingHidden: true
                })
              }
            })

          }
     }

})
