// pages/index/index.js
const MD5 = require('../md5/md5.js');
Page({
 
  data:{
    progress1_txt:'xxx',
    progress2_txt: 'xxx天',
    progress3_txt: 'xxx元',
    progress4_txt: '1888xxxx4367',
  },




  wxpay: function () {
    var that = this
    //登陆获取code
    that.getOpenId()
   
  },

  getOpenId: function () {
    var that = this
        //统一支付签名
    var appid = 'wxbfaece0f33ca6f74';//appid  
        var body = 'xinquanhui';//商户名
        var mch_id = '1284987701';//商户号  
        var nonce_str = that.randomString();//随机字符串，不长于32位。  
        var notify_url = ' ';//通知地址
        var out_trade_no = that.createTimeStamp();
        var spbill_create_ip = '49.140.124.166';//ip
        // var total_fee = parseInt(that.data.wxPayMoney) * 100;
        var total_fee = 1;
        
        var trade_type = "JSAPI";
        var key = 'aaaaaaaaaaaaaaaaaaaa111111111111';
        var unifiedPayment = 'appid=' + appid + '&body=' + body + '&mch_id=' + mch_id + '&nonce_str=' + nonce_str + '&notify_url=' + notify_url + '&openid=' + wx.getStorageSync('openid')+ '&out_trade_no=' + out_trade_no + '&spbill_create_ip=' + spbill_create_ip + '&total_fee=' + total_fee + '&trade_type=' + trade_type + '&key=' + key
        console.log(unifiedPayment);
        var sign = MD5.MD5(unifiedPayment).toUpperCase()
        console.log(sign)

        //封装统一支付xml参数
        var formData = "<xml>"
        formData += "<appid><![CDATA[" + appid + "]]></appid>"
        formData += "<body><![CDATA[" + body + "]]></body>"
        formData += "<mch_id><![CDATA[" + mch_id + "]]></mch_id>"
        formData += "<nonce_str><![CDATA[" + nonce_str + "]]></nonce_str>"
        formData += "<notify_url><![CDATA[" + notify_url + "]]></notify_url>"
    formData += "<openid><![CDATA[" + wx.getStorageSync('openid') + "]]></openid>"
        formData += "<out_trade_no><![CDATA[" + out_trade_no + "]]></out_trade_no>"
        formData += "<spbill_create_ip><![CDATA[" + spbill_create_ip + "]]></spbill_create_ip>"
        formData += "<total_fee><![CDATA[" + total_fee + "]]></total_fee>"
        formData += "<trade_type><![CDATA[" + trade_type + "]]></trade_type>"
        formData += "<sign>" + sign + "</sign>"
        formData += "</xml>"
        console.log(formData);
        //统一支付
        wx.request({
          url: 'https://zdcd.online/api/zhifu.php',
          method: 'GET',
          head: 'application/x-www-form-urlencoded',
          data:{
            formData: formData,
          },
          success: function (res) {
            console.log(res.data)

            var result_code = that.getXMLNodeValue('result_code', res.data.toString("utf-8"))
            console.log(result_code);
            var resultCode = result_code.split('[')[2].split(']')[0]
            if (resultCode == 'FAIL') {
              var err_code_des = that.getXMLNodeValue('err_code_des', res.data.toString("utf-8"))
              var errDes = err_code_des.split('[')[2].split(']')[0]
              wx.navigateBack({
                delta: 1, // 回退前 delta(默认为1) 页面
                success: function (res) {
                  wx.showToast({
                    title: errDes,
                    icon: 'success',
                    duration: 2000
                  })
                },

              })
            } else {
              //发起支付
              var prepay_id = that.getXMLNodeValue('prepay_id', res.data.toString("utf-8"))
             
              var tmp = prepay_id.split('[')
              var tmp1 = tmp[2].split(']')
              //签名  
              var key = 'aaaaaaaaaaaaaaaaaaaa111111111111';
              var appId = 'wxbfaece0f33ca6f74';
              var timeStamp = that.createTimeStamp();
              var nonceStr = that.randomString();
              var stringSignTemp = "appId=wxbfaece0f33ca6f74&nonceStr=" + nonceStr + "&package=prepay_id=" + tmp1[0] + "&signType=MD5&timeStamp=" + timeStamp + "&key=aaaaaaaaaaaaaaaaaaaa111111111111";
              console.log(stringSignTemp);
              var sign = MD5.MD5(stringSignTemp).toUpperCase()
              console.log(sign)
              var param = { "timeStamp": timeStamp, "package": 'prepay_id=' + tmp1[0], "paySign": sign, "signType": "MD5", "nonceStr": nonceStr }
              that.pay(param)
            }



          },

        })

  },
  /* 随机数 */
  randomString: function () {
    var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
    var maxPos = chars.length;
    var pwd = '';
    for (var i = 0; i < 32; i++) {
      pwd += chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
  },
  /* 获取prepay_id */
  getXMLNodeValue: function (node_name, xml) {
    var tmp = xml.split("<" + node_name + ">")
    var _tmp = tmp[1].split("</" + node_name + ">")
    return _tmp[0]
  },

  /* 时间戳产生函数   */
  createTimeStamp: function () {
    return parseInt(new Date().getTime() / 1000) + ''
  },
  /* 支付   */
  pay: function (param) {
    console.log(param)
    console.log(wx.getStorageSync('zhifutime'));
    wx.requestPayment({
      timeStamp: param.timeStamp,
      nonceStr: param.nonceStr,
      package: param.package,
      signType: param.signType,
      paySign: param.paySign,
      success: function (res) {
        // success
        console.log(res)
        wx.request({
          url: 'https://zdcd.online/api/db.php',
          data: {
            action: 'pay',
            time: wx.getStorageSync('zhifutime'),
            unionId: wx.getStorageSync('unionid'),
          },
          method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
          success: function (res) {
          }
        })
        wx.navigateBack({
          delta: 1, // 回退前 delta(默认为1) 页面
          success: function (res) {
            wx.showToast({
              title: '支付成功',
              icon: 'success',
              duration: 2000
            })

          },
          fail: function () {
            // fail
          },
          complete: function () {
            // complete
          }
        })
      },
      fail: function (res) {
        // fail
        console.log(res);
        console.log("支付失败")
      },
      complete: function () {
        // complete
        console.log("pay complete")
      }
    })
  },
  zhifu:function(e)
  {
      let that=this;
      that.wxpay();
  },
  
  

})