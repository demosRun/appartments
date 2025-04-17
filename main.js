function creatPage(totalRecords, pageSize) {
    const nowPage = getQueryParam('page') ? parseInt(getQueryParam('page')) : 1
    // 生成页码
    const pageNum = Math.ceil(totalRecords / pageSize)
    let pageHtmlStr = ``
    if (nowPage > 1) {
      pageHtmlStr += `<li class="page-item">
    <a class="page-link" href=".${location.pathname}?propertyId=${window.propertyId.value}&start=${window.startDate.value}&end=${window.endDate.value}&page=${nowPage - 1}" aria-label="Previous">
      <span class="material-symbols-rounded">
        keyboard_arrow_left
      </span>
    </a>
  </li>`
    }
    for (let index = 0; index < pageNum; index++) {
      if (index > nowPage - 10 && index < nowPage + 10) {
        if (index + 1 == nowPage) {
          pageHtmlStr += `<li class="page-item"><a class="page-link active" href=".${location.pathname}?propertyId=${window.propertyId.value}&start=${window.startDate.value}&end=${window.endDate.value}&page=${index + 1}">${index + 1}</a></li>`
        } else {
          pageHtmlStr += `<li class="page-item"><a class="page-link" href=".${location.pathname}?propertyId=${window.propertyId.value}&start=${window.startDate.value}&end=${window.endDate.value}&page=${index + 1}">${index + 1}</a></li>`
        }
      }
      
      
    }
    if (nowPage < pageNum) {
      pageHtmlStr += `<li class="page-item">
    <a class="page-link" href=".${location.pathname}?propertyId=${window.propertyId.value}&start=${window.startDate.value}&end=${window.endDate.value}&page=${pageNum}" aria-label="Next">
      <span class="material-symbols-rounded">
        keyboard_arrow_right
      </span>
    </a>
  </li>`
    }
    document.querySelector('.pagination').innerHTML = pageHtmlStr
}