setTimeout(() => {
    initOwo()
}, 3000);
console.log("Hello Trip")
window.wsLoginCB = function () {
  // 页面不对就跳转
  if (location.href == 'https://ebooking.ctrip.com/home/oversea') {
    getInventory(localStorage.getItem('userID'), JSON.parse(localStorage.getItem('config')))
    setTimeout(() => {
      location.href = 'https://ebooking.ctrip.com/home/group?microJump=true&hotelId=' + localStorage.getItem('hotelId')
    }, 3000)
  }
}

function getDateNDaysAgo (n) {
  const date = new Date();
  date.setDate(date.getDate() + n); // 获取 N 天前的日期

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // 月份从 0 开始，所以要 +1
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}


function extractOptions(htmlString) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, "text/html");

    const options = [...doc.querySelectorAll("select#room-selector-control option")];

    return options
        .map(option => {
            const value = option.value.trim();
            const text = option.textContent.trim();
            return value ? [Number(value), text] : null;
        })
        .filter(Boolean);
}


function getPhone (hotel, orderId, callBack) {
  fetch("https://ebooking.ctrip.com/restapi/soa2/27204/getOrderContactNumber?_fxpcqlniredt=09031123310042671481&x-traceID=09031123310042671481-1745837894278-827375", {
    "headers": {
      "accept": "*/*",
      "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7",
      "content-type": "application/json",
      "cookieorigin": "https://ebooking.ctrip.com",
      "priority": "u=1, i",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin"
    },
    "referrer": "https://ebooking.ctrip.com/ebkorderv3/group?microJump=true",
    "referrerPolicy": "strict-origin-when-cross-origin",
    "body": JSON.stringify({"reqHead":{"host":"ebooking.ctrip.com","locale":"zh-CN","release":"","client":{"deviceType":"PC","os":"Windows","osVersion":"Windows 10","clientId":"09031123310042671481","screenWidth":1536,"screenHeight":1024,"isIn":{"ie":false,"chrome":true,"chrome49":false,"wechat":false,"firefox":false,"ios":false,"android":false},"isModernBrowser":true,"browser":"Chrome","browserVersion":"135","platform":"","technology":""},"ubt":{"pageid":"10650101018","pvid":4,"sid":2,"vid":"1743603360814.f429JYPQVSss","fp":"B3579A-54F327-677299","rmsToken":"fp=B3579A-54F327-677299&vid=1743603360814.f429JYPQVSss&pageId=10650071865&r=dba284b329a643e4bc98543da539cd1e&ip=undefined&rg=b4&kpData=0_0_0&kpControl=0_0_0-0_0_0&kpEmp=0_0_0_0_0_0_0_0_0_0-0_0_0_0_0_0_0_0_0_0-0_0_0_0_0_0_0_0_0_0&screen=1536x1024&tz=+9.5&blang=zh-CN&oslang=zh-CN&ua=Mozilla%2F5.0%20(Windows%20NT%2010.0%3B%20Win64%3B%20x64)%20AppleWebKit%2F537.36%20(KHTML%2C%20like%20Gecko)%20Chrome%2F135.0.0.0%20Safari%2F537.36&d=ebooking.ctrip.com&v=25&kpg=0_0_0_0_0_0_0_0_0_0&adblock=F&cck=F"},"gps":{"coord":"","lat":"","lng":"","cid":0,"cnm":""},"protocal":"https:"},"callSource":"PC","orderId":orderId,"sourceType":"Ebooking","hotel":hotel,"header":{"platform":"WEB"},"head":{"cid":"09031123310042671481","ctok":"","cver":"1.0","lang":"01","sid":"8888","syscode":"09","auth":"","xsid":"","extension":[]}}),
    "method": "POST",
    "mode": "cors",
    "credentials": "include"
  }).then((response) => response.json())
  .then((result) => {
    if (callBack) callBack(result.orderContactInfo.clientPhone)
  }).catch((error) => {
    console.log(error)
    // location.reload()
  });
}
  

function getInventory(userID, config) {
  localStorage.setItem('userID', userID)
  localStorage.setItem('config', JSON.stringify(config))
  changeHotel(config.ebooking, () => {
    fetch("https://ebooking.ctrip.com/restapi/soa2/30535/queryRoomTypeInfoV2?_fxpcqlniredt=09031166419920922804&x-traceID=09031166419920922804-1743992214878-6340447", {
      "headers": {
        "accept": "*/*",
        "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7",
        "cache-control": "no-cache",
        "content-type": "application/json",
        "cookieorigin": "https://ebooking.ctrip.com",
        "pragma": "no-cache",
        "priority": "u=1, i",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin"
      },
      "referrer": "https://ebooking.ctrip.com/calendar/rateplan?microJump=true",
      "referrerPolicy": "strict-origin-when-cross-origin",
      "body": JSON.stringify({"reqHead":{"host":"ebooking.ctrip.com","locale":"zh-CN","release":"","client":{"deviceType":"PC","os":"Windows","osVersion":"Windows 10","clientId":"09031166419920922804","screenWidth":2560,"screenHeight":1440,"isIn":{"ie":false,"chrome":true,"chrome49":false,"wechat":false,"firefox":false,"ios":false,"android":false},"isModernBrowser":true,"browser":"Chrome","browserVersion":"134","platform":"","technology":""},"ubt":{"pageid":"10650070579","pvid":11,"sid":15,"vid":"1743478305596.44d2fEcbYiDb","fp":"89D79A-13BFCB-5BE74C","rmsToken":"fp=&vid=1743478305596.44d2fEcbYiDb&pageId=10650071865&r=daeac2c3640d4a26a141a3292956e29c&ip=undefined&rg=b4&kpData=0_0_0&kpControl=0_0_0-0_0_0&kpEmp=0_0_0_0_0_0_0_0_0_0-0_0_0_0_0_0_0_0_0_0-0_0_0_0_0_0_0_0_0_0&screen=2560x1440&tz=+8&blang=zh-CN&oslang=zh-CN&ua=Mozilla%2F5.0%20(Windows%20NT%2010.0%3B%20Win64%3B%20x64)%20AppleWebKit%2F537.36%20(KHTML%2C%20like%20Gecko)%20Chrome%2F134.0.0.0%20Safari%2F537.36&d=ebooking.ctrip.com&v=25&kpg=0_0_0_0_0_0_0_0_0_0&adblock=F&cck=F"},"gps":{"coord":"","lat":"","lng":"","cid":0,"cnm":""},"protocal":"https:"},"hotelId":config.ebooking,"cipher":{},"_hotelId":config.ebooking,"head":{"cid":"09031166419920922804","ctok":"","cver":"1.0","lang":"01","sid":"8888","syscode":"09","auth":"","xsid":"","extension":[]}}),
      "method": "POST",
      "mode": "cors",
      "credentials": "include"
    }).then((response) => response.json())
    .then((result) => {
      console.log('发送数据', result)
      owoSocket.send("inventoryCtrip", result, userID)
    }).catch((error) => {
      console.log(error)
      // location.reload()
    });
  })
  
}

function changeHotel (hotelId, callBack) {

  if (localStorage.getItem('hotelId') != hotelId) {
    localStorage.setItem('hotelId', hotelId)
    document.querySelector('.he-trip-ui-input').value = hotelId
    document.querySelector('.he-trip-ui-btn').click()
    setTimeout(() => {
      document.querySelector('.he-trip-ui-table-tbody .he-trip-ui-btn').click()
      setTimeout(() => {
        callBack()
      }, 1000);
    }, 1000);
  } else {
    callBack()
  }
}



function queryRoomTypeDetail (userID, config) {
  fetch("https://ebooking.ctrip.com/restapi/soa2/30535/queryRoomTypeDetail?_fxpcqlniredt=09031166419920922804&x-traceID=09031166419920922804-1743995287531-8942475", {
    "headers": {
      "accept": "*/*",
      "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7",
      "cache-control": "no-cache",
      "content-type": "application/json",
      "cookieorigin": "https://ebooking.ctrip.com",
      "pragma": "no-cache",
      "priority": "u=1, i",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin"
    },
    "referrer": "https://ebooking.ctrip.com/calendar/monthly/rateplan",
    "referrerPolicy": "strict-origin-when-cross-origin",
    "body": JSON.stringify({"reqHead":{"host":"ebooking.ctrip.com","locale":"zh-CN","release":"","client":{"deviceType":"PC","os":"Windows","osVersion":"Windows 10","clientId":"09031166419920922804","screenWidth":2560,"screenHeight":1440,"isIn":{"ie":false,"chrome":true,"chrome49":false,"wechat":false,"firefox":false,"ios":false,"android":false},"isModernBrowser":true,"browser":"Chrome","browserVersion":"134","platform":"","technology":""},"ubt":{"pageid":"10650070581","pvid":39,"sid":15,"vid":"1743478305596.44d2fEcbYiDb","fp":"89D79A-13BFCB-5BE74C","rmsToken":"fp=&vid=1743478305596.44d2fEcbYiDb&pageId=10650071865&r=daeac2c3640d4a26a141a3292956e29c&ip=undefined&rg=b4&kpData=0_0_0&kpControl=0_0_0-0_0_0&kpEmp=0_0_0_0_0_0_0_0_0_0-0_0_0_0_0_0_0_0_0_0-0_0_0_0_0_0_0_0_0_0&screen=2560x1440&tz=+8&blang=zh-CN&oslang=zh-CN&ua=Mozilla%2F5.0%20(Windows%20NT%2010.0%3B%20Win64%3B%20x64)%20AppleWebKit%2F537.36%20(KHTML%2C%20like%20Gecko)%20Chrome%2F134.0.0.0%20Safari%2F537.36&d=ebooking.ctrip.com&v=25&kpg=0_0_0_0_0_0_0_0_0_0&adblock=F&cck=F"},"gps":{"coord":"","lat":"","lng":"","cid":0,"cnm":""},"protocal":"https:"},"hotelId":config.ebooking,"roomTypeId":config.roomTypeId,"month":config.start,"products":[{"productId":config.productId,"resourceType":"B2C","rateModel":2}],"isEnabledPriceBeforeTax":false,"cipher":config.cipher,"_hotelId":config.ebooking,"head":{"cid":"09031166419920922804","ctok":"","cver":"1.0","lang":"01","sid":"8888","syscode":"09","auth":"","xsid":"","extension":[]}}),
    "method": "POST",
    "mode": "cors",
    "credentials": "include"
  }).then((response) => response.json())
  .then((result) => {
    console.log('发送数据', result)
    owoSocket.send("queryRoomTypeDetailCtrip", {
      "roomTypeId": config.roomTypeId,
      rangData: result.rangData
    }, userID)
  }).catch((error) => {
    console.log(error)
    // location.reload()
  });
  
}

function updatePrice(userID, config) {
  fetch("https://ebooking.ctrip.com/restapi/soa2/30535/setRoomInventoryInfo?_fxpcqlniredt=09031166419920922804&x-traceID=09031166419920922804-1744129787482-846717", {
    "headers": {
      "accept": "*/*",
      "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7",
      "cache-control": "no-cache",
      "content-type": "application/json",
      "cookieorigin": "https://ebooking.ctrip.com",
      "pragma": "no-cache",
      "priority": "u=1, i",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin"
    },
    "referrer": "https://ebooking.ctrip.com/calendar/monthly/rateplan",
    "referrerPolicy": "strict-origin-when-cross-origin",
    "body": JSON.stringify({"reqHead":{"host":"ebooking.ctrip.com","locale":"zh-CN","release":"","client":{"deviceType":"PC","os":"Windows","osVersion":"Windows 10","clientId":"09031166419920922804","screenWidth":2560,"screenHeight":1440,"isIn":{"ie":false,"chrome":true,"chrome49":false,"wechat":false,"firefox":false,"ios":false,"android":false},"isModernBrowser":true,"browser":"Chrome","browserVersion":"134","platform":"","technology":""},"ubt":{"pageid":"10650070581","pvid":12,"sid":22,"vid":"1743478305596.44d2fEcbYiDb","fp":"89D79A-13BFCB-5BE74C","rmsToken":"fp=89D79A-13BFCB-5BE74C&vid=1743478305596.44d2fEcbYiDb&pageId=10650070579&r=daeac2c3640d4a26a141a3292956e29c&ip=undefined&rg=b4&kpData=0_0_0&kpControl=0_0_0-0_0_0&kpEmp=0_0_0_0_0_0_0_0_0_0-0_0_0_0_0_0_0_0_0_0-0_0_0_0_0_0_0_0_0_0&screen=2560x1440&tz=+8&blang=zh-CN&oslang=zh-CN&ua=Mozilla%2F5.0%20(Windows%20NT%2010.0%3B%20Win64%3B%20x64)%20AppleWebKit%2F537.36%20(KHTML%2C%20like%20Gecko)%20Chrome%2F134.0.0.0%20Safari%2F537.36&d=ebooking.ctrip.com&v=25&kpg=0_0_0_0_0_0_0_0_0_0&adblock=F&cck=F"},"gps":{"coord":"","lat":"","lng":"","cid":0,"cnm":""},"protocal":"https:"},"hotelId":config.ctripID,"basicRoomQuantityEditInfoList":[{"hotelId": config.ctripID,"basicRoomId": config.basicRoomId,"startDate": config.from_date,"endDate": config.until_date,"weekDayIndex": "1111111","canUsedQuantity": config.roomNum,"canOverFlow": -1}],"roomInventoryEditInfoList":[],"roomPriceEditInfoList":[{"hotelId":config.ctripID,"roomId":config.room_id_ctrip,"startDate":config.from_date,"endDate":config.until_date,"weekDayIndex":"1111111","person":config.person,"price":config.field_value}],"roomStayLimitEditInfoList":[],"cipher":config.cipher,"_hotelId":config.ctripID,"head":{"cid":"09031166419920922804","ctok":"","cver":"1.0","lang":"01","sid":"8888","syscode":"09","auth":"","xsid":"","extension":[]}}),
    "method": "POST",
    "mode": "cors",
    "credentials": "include"
  });
}

function initOwo () {
    window.owoSocket = new owoSocket('住宿管理', (meg) => {
        console.log(meg)
        switch (meg.type) {
          case 'getInventory':
            getInventory(meg.userID, meg.value)
            break
          case "queryRoomTypeDetail":
            queryRoomTypeDetail(meg.userID, meg.value)
            break
          case "updatePrice":
            if (meg.value.room_id_ctrip) updatePrice(meg.userID, meg.value)
            break
        }
    }, true)
    window.runing = true
    
}

function addRoom (orderID, orderType, phone, roomNum, cancelMoney, roomInfo, orderTime, checkin, checkout, money, customer, roomID, status) {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({orderID, orderType, phone, roomNum, cancelMoney, roomInfo, orderTime, checkin, checkout, money, customer,  roomID, status});

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow"
  };

  fetch("https://1256763111-f2tvymu35g.ap-beijing.tencentscf.com/addRoom", requestOptions)
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.error(error));
}

function getPhone (hotel, orderId, callBack) {
  fetch("https://ebooking.ctrip.com/restapi/soa2/27204/getOrderContactNumber?_fxpcqlniredt=09031123310042671481&x-traceID=09031123310042671481-1745837894278-827375", {
    "headers": {
      "accept": "*/*",
      "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7",
      "content-type": "application/json",
      "cookieorigin": "https://ebooking.ctrip.com",
      "priority": "u=1, i",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin"
    },
    "referrer": "https://ebooking.ctrip.com/ebkorderv3/group?microJump=true",
    "referrerPolicy": "strict-origin-when-cross-origin",
    "body": JSON.stringify({"reqHead":{"host":"ebooking.ctrip.com","locale":"zh-CN","release":"","client":{"deviceType":"PC","os":"Windows","osVersion":"Windows 10","clientId":"09031123310042671481","screenWidth":1536,"screenHeight":1024,"isIn":{"ie":false,"chrome":true,"chrome49":false,"wechat":false,"firefox":false,"ios":false,"android":false},"isModernBrowser":true,"browser":"Chrome","browserVersion":"135","platform":"","technology":""},"ubt":{"pageid":"10650101018","pvid":4,"sid":2,"vid":"1743603360814.f429JYPQVSss","fp":"B3579A-54F327-677299","rmsToken":"fp=B3579A-54F327-677299&vid=1743603360814.f429JYPQVSss&pageId=10650071865&r=dba284b329a643e4bc98543da539cd1e&ip=undefined&rg=b4&kpData=0_0_0&kpControl=0_0_0-0_0_0&kpEmp=0_0_0_0_0_0_0_0_0_0-0_0_0_0_0_0_0_0_0_0-0_0_0_0_0_0_0_0_0_0&screen=1536x1024&tz=+9.5&blang=zh-CN&oslang=zh-CN&ua=Mozilla%2F5.0%20(Windows%20NT%2010.0%3B%20Win64%3B%20x64)%20AppleWebKit%2F537.36%20(KHTML%2C%20like%20Gecko)%20Chrome%2F135.0.0.0%20Safari%2F537.36&d=ebooking.ctrip.com&v=25&kpg=0_0_0_0_0_0_0_0_0_0&adblock=F&cck=F"},"gps":{"coord":"","lat":"","lng":"","cid":0,"cnm":""},"protocal":"https:"},"callSource":"PC","orderId":orderId,"sourceType":"Ebooking","hotel":hotel,"header":{"platform":"WEB"},"head":{"cid":"09031123310042671481","ctok":"","cver":"1.0","lang":"01","sid":"8888","syscode":"09","auth":"","xsid":"","extension":[]}}),
    "method": "POST",
    "mode": "cors",
    "credentials": "include"
  }).then((response) => response.json())
  .then((result) => {
    if (callBack) callBack(result.orderContactInfo.clientPhone)
  }).catch((error) => {
    console.log(error)
    // location.reload()
  });
}

function dateToTimestamp (str) {
  // const str = "2025-04-23 01:40:18";

  // 将字符串中的空格替换成 T，使其成为 ISO 标准格式
  const isoStr = str.replace(" ", "T");

  // 创建 Date 对象
  const date = new Date(isoStr);

  // 获取秒时间戳
  const timestamp = Math.floor(date.getTime() / 1000);

  return timestamp
}

function getReservationDetails2(config) {
  fetch("https://ebooking.ctrip.com/restapi/soa2/27204/getOrderDetail?_fxpcqlniredt=09031166419920922804&x-traceID=09031166419920922804-1743810267996-3051394", {
    "headers": {
      "accept": "*/*",
      "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7",
      "cache-control": "no-cache",
      "content-type": "application/json; charset=UTF-8",
      "cookieorigin": "https://ebooking.ctrip.com",
      "pragma": "no-cache",
      "priority": "u=1, i",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "spidertoken": "1001-common-k9BrTHWA0yNBWSzwTBEbqJ68Ws3jmAJ3HJoOjpPJkGjUAJaTY3GiSqIMQv8OvG7wl9E3aRcGwfMv5aEMPyN7Y0UvQLyUFwm6JtbjFlwmARhcI9pe0swQY18RqGyT6rF4Rkly3qEM0iptjhZRtaW8LYUPwaLy78vTkyp7WM7y0NjkQroYptxaZy01INSJ3gxnUISYlv1vmUi4OR09ybXELmiDbE9Ly34jT7iXBWQAJlOJQXvD8whZIQgE3NEPHyS0YSsvlHw3LwQoJ0lK5leT9JfLJbhWgZjXFwDYQLJMfy0dr5By0fyabi7QwmhEUMYkAEpPWn4e7kiagwaPJcZJm9eFpEBAR5Zjo4W7OeAFELqwAHJ7FW0neX7WQ7Rg7iX6i38J6FWdMR5fvsljNzEDnwMkJBHjldYformYB5IUORzAWkFYoHEbPYDTwNzjlaytGYOkw6XYBLwc3RzYX0rsNyqteF4YLhEQE4AWnpiLYb5ecoxZOwsXv5TeQAYA7ilmYUGI3kIXhyAYbFimMR4AKtOehQEkXj18WotwtSEbkWzY4qeQkik4IpPraFKnQekfEG6WztILAKDE3YNUK1Zjf4WXtYZgJfAwQlWXoentRh0EG9EblWPPKp9J54IcY1fRMljPdwn3Yq6Jo4wSTWZLempR6gibQv7qY4ojpsIB0"
    },
    "referrer": "https://ebooking.ctrip.com/ebkorderv3/group?microJump=true",
    "referrerPolicy": "strict-origin-when-cross-origin",
    "body": JSON.stringify({"reqHead":{"host":"ebooking.ctrip.com","locale":"zh-CN","release":"","client":{"deviceType":"PC","os":"Windows","osVersion":"Windows 10","clientId":"09031166419920922804","screenWidth":2560,"screenHeight":1440,"isIn":{"ie":false,"chrome":true,"chrome49":false,"wechat":false,"firefox":false,"ios":false,"android":false},"isModernBrowser":true,"browser":"Chrome","browserVersion":"134","platform":"","technology":""},"ubt":{"pageid":"10650101018","pvid":4,"sid":9,"vid":"1743478305596.44d2fEcbYiDb","fp":"89D79A-13BFCB-5BE74C","rmsToken":"fp=89D79A-13BFCB-5BE74C&vid=1743478305596.44d2fEcbYiDb&pageId=10650071865&r=daeac2c3640d4a26a141a3292956e29c&ip=undefined&rg=b4&kpData=0_0_0&kpControl=0_0_0-0_0_0&kpEmp=0_0_0_0_0_0_0_0_0_0-0_0_0_0_0_0_0_0_0_0-0_0_0_0_0_0_0_0_0_0&screen=2560x1440&tz=+8&blang=zh-CN&oslang=zh-CN&ua=Mozilla%2F5.0%20(Windows%20NT%2010.0%3B%20Win64%3B%20x64)%20AppleWebKit%2F537.36%20(KHTML%2C%20like%20Gecko)%20Chrome%2F134.0.0.0%20Safari%2F537.36&d=ebooking.ctrip.com&v=25&kpg=0_0_0_0_0_0_0_0_0_0&adblock=F&cck=F"},"gps":{"coord":"","lat":"","lng":"","cid":0,"cnm":""},"protocal":"https:"},"hotel":config.hotel,"orderId":config.orderId,"formID":config.formId,"orderSource":"Ebooking","sourceType":"EBK","timeZone":8,"header":{"platform":"WEB"}}),
    "method": "POST",
    "mode": "cors",
    "credentials": "include"
  }).then((response) => response.json())
  .then((result) => {
    getPhone(config.hotel, config.orderId, (phone)=> {

      let penaltyAmount = result.detail.cancelApplyInfo ? result.detail.cancelApplyInfo.penaltyAmount : '0.00'
      if (penaltyAmount == '免费取消') {
        penaltyAmount = '0.00'
      }
      addRoom(result.detail.orderID, "携程", phone, result.detail.quantity, penaltyAmount, result.detail.roomName, dateToTimestamp(result.detail.orderDate), dateToTimestamp(result.detail.arrivalDateRange.start), dateToTimestamp(result.detail.departureDateRange.end), result.detail.amount, result.detail.clientName.split(',').join('<br>'), result.detail.roomID, result.detail.orderStatusType)
    })
    
  }).catch((error) => {
    console.log(error)
    // location.reload()
  });
}

function getSaveRoomData (roomList, callback) {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    "orderID": roomList.join(',')
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow"
  };

  fetch("https://1256763111-f2tvymu35g.ap-beijing.tencentscf.com/selectRoom", requestOptions)
    .then((response) => response.json())
    .then((result) => {
      callback(result)
    })
    .catch((error) => console.error(error));
}

function searchReservations(start, end, page) {
  page = page ? page : 0
  start = start? start : getDateNDaysAgo(0)
  end = end ? end : getDateNDaysAgo(30)
  fetch(`https://ebooking.ctrip.com/restapi/soa2/27204/queryOrderList?_fxpcqlniredt=09031166419920922804&x-traceID=09031166419920922804-1743647043511-9841194`, {
    "headers": {
    "accept": "*/*",
    "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7",
    "cache-control": "no-cache",
    "content-type": "application/json; charset=UTF-8",
    "cookieorigin": "https://ebooking.ctrip.com",
    "pragma": "no-cache",
    "priority": "u=1, i",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "spidertoken": "1001-common-mXTIcgIQDJmGjoHj67iZNiQ7wHpiFMEdoW01jcLYBXWU1v5beqlEPFYOMwatjknibtwQ8wcmEPbwQ9JBSynPjnqw73xQoRnqyDXJnoWT9io9yDpIcXYGYqaxpMKccKH9R7gyXqEa3ipqw6QWNniOtE6zvNHYhPEbOw0fJdkrpNYXGwcYt7RlSYDBI8ENAvslymYqzR9Gi1nrU9RlcytBED7iXgEGHy9Zja5iXGWdUJzHJnlvLgw6ZIOfEPLEz7y1LYHnvL4w61wmtJFBKM0elsJLkJo5YSBy7dyhY49I3FIzoYd6ylAy6cvL4yOnj9TJ4XYZaigsetORdQYAUyS8joceMaEsXi4Ay95vM6eHBjAOEHUi8Xy6geqOw4GyNawt7EqhvP8RGbJ6OYDhW3HjUlv03JFtiQ4v5peaYOyBhWmfrN1YsQEGZY6mwoajg1y4SYFbwAtwfLrQtR1YbFEfpr3dvnpY9aEt4J3lJM5e6Y8vNGR30jMgv4qemsYFNinSYFGIktJZBrGYAAKoav8wANeXkET7jopWz3xn0yDQJzYnByBZwTwncrLbKA7e05EN3WGqYf3jSLW8YD7E4ne00KX7YzgJZqwX3WXmelqRF8EZzE1QWh1ynJBnWTYfXezTi6DrkAYp3J06wF5WAce0aRZsiXovskYU0jsGvf4"
  },
  "referrer": "https://ebooking.ctrip.com/ebkorderv3?microJump=true",
  "referrerPolicy": "strict-origin-when-cross-origin",
    "body": JSON.stringify({"reqHead":{"host":"ebooking.ctrip.com","locale":"zh-CN","release":"","client":{"deviceType":"PC","os":"Windows","osVersion":"Windows 10","clientId":"09031166419920922804","screenWidth":2560,"screenHeight":1440,"isIn":{"ie":false,"chrome":true,"chrome49":false,"wechat":false,"firefox":false,"ios":false,"android":false},"isModernBrowser":true,"browser":"Chrome","browserVersion":"134","platform":"","technology":""},"ubt":{"pageid":"10650101018","pvid":4,"sid":5,"vid":"1743478305596.44d2fEcbYiDb","fp":"89D79A-13BFCB-5BE74C","rmsToken":"fp=89D79A-13BFCB-5BE74C&vid=1743478305596.44d2fEcbYiDb&pageId=10650071865&r=daeac2c3640d4a26a141a3292956e29c&ip=undefined&rg=b4&kpData=0_0_0&kpControl=0_0_0-0_0_0&kpEmp=0_0_0_0_0_0_0_0_0_0-0_0_0_0_0_0_0_0_0_0-0_0_0_0_0_0_0_0_0_0&screen=2560x1440&tz=+8&blang=zh-CN&oslang=zh-CN&ua=Mozilla%2F5.0%20(Windows%20NT%2010.0%3B%20Win64%3B%20x64)%20AppleWebKit%2F537.36%20(KHTML%2C%20like%20Gecko)%20Chrome%2F134.0.0.0%20Safari%2F537.36&d=ebooking.ctrip.com&v=25&kpg=0_0_0_0_0_0_0_0_0_0&adblock=F&cck=F"},"gps":{"coord":"","lat":"","lng":"","cid":0,"cnm":""},"protocal":"https:"},"timeZone":8,"isHotelCompany":true,"orderQueryCondition":{"keyword":"","queryDateType":"ArrivalDate","dateEnd":end,"dateStart":start,"queryOrderStatuses":[],"isShowExtraInfo":true,"pageInfo":{"pageIndex":page,"orderBy":"Arrival","sort":"Asc"}},"header":{"platform":"WEB"}}),
    "method": "POST",
    "mode": "cors",
    "credentials": "include"
  }).then((response) => response.json())
  .then((result) => {
    // 首先先获取所有订单ID
    let orderIdList = []
    let orderObj = {}
    result.orderList.forEach(element => {
      orderIdList.push(element.orderId)
      orderObj[element.orderId] = element
    });
    // 获取所有存在订单
    getSaveRoomData(orderIdList, (saveList)=> {
      // 删除已经有的订单
      saveList.forEach(element2 => {
        orderIdList = orderIdList.filter(item => item !== element2[0]);
      });
      console.log(orderIdList)
      orderIdList.forEach(key => {
        getReservationDetails2(orderObj[key])
      });
    })
    
    // 获取剩余的详细信息
  }).catch((error) => {
    console.log(error)
    // location.reload()
  });
}

// 每隔十分钟自动获取
setInterval(() => {
  searchReservations()
}, 10 * 60 * 1000);