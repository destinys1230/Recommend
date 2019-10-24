Page({

    data: {
      canIUse: wx.canIUse('button.open-type.getUserInfo'),
      display:"",
        open: false,
        // mark 是指原点x轴坐标
        mark: 0,
        // newmark 是指移动的最新点的x轴坐标 
        newmark: 0,
        istoright: true,
        isshouquan:0,
    },

    // 点击左上角小图标事件
    tap_ch: function(e) {
        if (this.data.open) {
            this.setData({
                open: false
            });
        } else {
            this.setData({
                open: true
            });
        }
    },

    tap_start: function(e) {
        // touchstart事件
        // 把手指触摸屏幕的那一个点的 x 轴坐标赋值给 mark 和 newmark
        this.data.mark = this.data.newmark = e.touches[0].pageX;
    },

    tap_drag: function(e) {
        // touchmove事件
        this.data.newmark = e.touches[0].pageX;
       
        // 手指从左向右移动
        if (this.data.mark < this.data.newmark) {
            this.istoright = true;
        }
        
        // 手指从右向左移动
        if (this.data.mark > this.data.newmark) {
            this.istoright = false;
        }
        this.data.mark = this.data.newmark;
    },

    tap_end: function(e) {
        // touchend事件
        this.data.mark = 0;
        this.data.newmark = 0;
        // 通过改变 opne 的值，让主页加上滑动的样式
        if (this.istoright) {
            this.setData({
                open: true
            });
        } else {
            this.setData({
                open: false
            });
        }
    },
    jumpPage:function(e)
    {
      var type = e.currentTarget.dataset.type
      console.log(type)
      console.log('../index/index?type=' + type)
      wx.navigateTo({
        url: '../index/index?type='+type,
      })
    },
    wenzhang: function () {
    wx.navigateTo({
      url: '../article-list/article-list',
    })
    },
    shangcheng:function(){
      wx.navigateToMiniProgram({
        appId: 'wxbf0f3486db308b93', // 要跳转的小程序的appid
        path: 'pages/index/index', // 跳转的目标页面
        extarData: {
          open: 'auth'
        },
        success(res) {
          // 打开成功  
        }
      }) 
    },
    jumpdingdan:function() 
    {
      wx.navigateTo({
        url: '../dingdan/dingdan',
      })
    },
    jumpshouchang:function() {
      wx.navigateTo({
        url: '../lishi/lishi',
      })
    },
    shouquan:function(){
      let that=this;
      wx.getSetting({
        success: res => {
          console.log(res.authSetting);
          if (res.authSetting['scope.userInfo']) {
            this.setData({
              display: "none",
              isshouquan:1
            })
            wx.login({
              success: function (res) {
                var code = res.code;//登录凭证
                wx.request({
                  url: 'https://zdcd.online/api/login.php',
                  data: {
                    code: code
                  },
                  method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                  success: function (res) {
                    console.log(res.data);
                    var openId = res.data.openid;
                    var sessionId = res.data.session_key;
                    //console.log(sessionId);
                    wx.setStorageSync('sessionId', sessionId);
                    wx.setStorageSync('openid', openId);
                    
                    wx.getUserInfo({
                      success: function (res) {
                        console.log({
                        encryptedData: res.encryptedData, 
                        iv: res.iv,
                        sessionID: wx.getStorageSync('sessionId')})
                       //3.请求自己的服务器，解密用户信息 获取unionId等加密信息
                        wx.request({
                          url: 'https://zdcd.online/api/decrypt.php',//自己的服务接口地址
                          method: 'GET',
                          data: {
                            encryptedData: res.encryptedData,
                            iv: res.iv,
                            sessionID: wx.getStorageSync('sessionId') },
                          success: function (res) {
                            console.log(res);
                            //console.log(res.data.unionId);
                            wx.setStorageSync('unionid', res.data.unionId);
                          },
                        })
                      },
                      fail: function () {
                        console.log('获取用户信息失败')
                      }
                    })
                  }
                })
              }
            })
          }
          else {
            this.setData({
              display: "block"
            })
            that.shouquan();
          }
        }
      })
    },
    onLoad:function(){
      let that=this;
      
      var path = wx.getStorageSync('image_cache')
      console.log("path:");
      console.log(path);
      console.log(path != null);
      console.log(path != "");
      console.log(!path);
      if (path != null&&path!="" ) {
        console.log('path====', path)
       
      } else {
        wx.getSavedFileList({
          success(res) {
            console.log(res);
            if (res.fileList.length > 0) {
              wx.removeSavedFile({
                filePath: res.fileList[0].filePath,
                complete(res) {
                  console.log(res)
                  wx.downloadFile({
                    url: 'https://zdcd.online/imgs/motion.gif',
                    success: function (res) {
                      console.log(res);
                      if (res.statusCode === 200) {
                        console.log('图片下载成功' + res.tempFilePath)
                        // 第二步: 使用小程序的文件系统，通过小程序的api获取到全局唯一的文件管理器
                        wx.saveFile({
                          tempFilePath: res.tempFilePath,
                          success(res) {
                            wx.setStorageSync('image_cache', res.savedFilePath)
                            console.log('path', wx.getStorageSync('image_cache'));
                          },
                          fail(res) {
                            console.log('图片缓存失败', res.errMsg);
                          }
                        })
                      } else {
                        console.log('响应失败', res.statusCode)
                      }
                    }
                  })
                }
              })
            }
            else
            {
              wx.downloadFile({
                url: 'https://zdcd.online/imgs/motion.gif',
                success: function (res) {
                  console.log(res);
                  if (res.statusCode === 200) {
                    console.log('图片下载成功' + res.tempFilePath)
                    // 第二步: 使用小程序的文件系统，通过小程序的api获取到全局唯一的文件管理器
                    wx.saveFile({
                      tempFilePath: res.tempFilePath,
                      success(res) {
                        wx.setStorageSync('image_cache', res.savedFilePath)
                        console.log('path', wx.getStorageSync('image_cache'));
                      },
                      fail(res) {
                        console.log('图片缓存失败', res.errMsg);
                      }
                    })
                  } else {
                    console.log('响应失败', res.statusCode)
                  }
                }
              })
            }
          }
        })
        
    }
    that.shouquan();
   
  
        // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
        
 
      
 
      
 
    }

 


})