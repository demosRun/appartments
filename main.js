function creatPage(totalRecords, pageSize) {
    const nowPage = getQueryParam('page') ? parseInt(getQueryParam('page')) : 1
    // 生成页码
    const pageNum = Math.ceil(totalRecords / pageSize)
    let pageHtmlStr = ``
    if (nowPage > 1) {
      pageHtmlStr += `<li class="page-item">
    <a class="page-link" href="${location.pathname}?propertyId=${window.propertyId.value}&start=${window.startDate.value}&end=${window.endDate.value}&page=${nowPage - 1}" aria-label="Previous">
      <span class="material-symbols-rounded">
        keyboard_arrow_left
      </span>
    </a>
  </li>`
    }
    for (let index = 0; index < pageNum; index++) {
      if (index > nowPage - 10 && index < nowPage + 10) {
        if (index + 1 == nowPage) {
          pageHtmlStr += `<li class="page-item"><a class="page-link active" href="${location.pathname}?propertyId=${window.propertyId.value}&start=${window.startDate.value}&end=${window.endDate.value}&page=${index + 1}">${index + 1}</a></li>`
        } else {
          pageHtmlStr += `<li class="page-item"><a class="page-link" href="${location.pathname}?propertyId=${window.propertyId.value}&start=${window.startDate.value}&end=${window.endDate.value}&page=${index + 1}">${index + 1}</a></li>`
        }
      }
      
      
    }
    if (nowPage < pageNum) {
      pageHtmlStr += `<li class="page-item">
    <a class="page-link" href="${location.pathname}?propertyId=${window.propertyId.value}&start=${window.startDate.value}&end=${window.endDate.value}&page=${pageNum}" aria-label="Next">
      <span class="material-symbols-rounded">
        keyboard_arrow_right
      </span>
    </a>
  </li>`
    }
    document.querySelector('.pagination').innerHTML = pageHtmlStr
}

function addRoom (orderID, orderType, phone, roomNum, cancelMoney, roomInfo, orderTime, checkin, checkout, money, customer, roomID, status, account) {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({orderID, orderType, phone, roomNum, cancelMoney, roomInfo, orderTime, checkin, checkout, money, customer,  roomID, status, account});

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
