setTimeout(() => {
    initOwo()
}, 3000);


function getSaveRoomData(roomList, callback) {
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

function getDateNDaysAgo(n) {
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

function groupHomeListProperties(userID) {
    fetch(`https://admin.booking.com/dml/graphql.json?ses=${getQueryParam('ses')}&lang=en`, {
        "headers": {
            "accept": "*/*",
            "accept-language": "zh;q=0.9,en;q=0.8,q=0.7",
            "apollographql-client-name": "b-mpp-group-extranet-mfe",
            "apollographql-client-version": "GfJLLJVc",
            "cache-control": "no-cache",
            "content-type": "application/json",
            "pragma": "no-cache",
            "priority": "u=1, i",
            "sec-ch-ua": `"Chromium";v="134", "Not:A-Brand";v="24", "Google Chrome";v="134"`,
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": `"Windows"`,
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "x-booking-context-action": "groups_home_index",
            "x-booking-context-action-name": "groups_home_index",
            "x-booking-csrf-token": "undefined",
            "x-booking-dml-cluster": "node",
            "x-booking-et-serialized-state": pageData.etSerializedState,
            "x-booking-pageview-id": pageData.pageviewId,
            "x-booking-site-type-id": "31",
            "x-booking-topic": "capla_browser_b-mpp-group-extranet-mfe"
        },
        "referrer": location.href,
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": `{"operationName":"groupHomeListProperties","variables":{"input":{"accountId":${pageData.partnerIdentity.partnerAccountId},"searchTerm":"","showClosed":true,"sortDirection":"DESC","sortType":"PROPERTY_ID","states":[],"ufis":[-3714241,-3714759,-3717251,-3726257,-3714993,-3730078],"accommodationTypeIds":[],"pagination":{"offset":0,"rowsPerPage":100},"availabilityStatus":"ALL"}},"extensions":{},"query":"query groupHomeListProperties($input: GroupHomeListPropertiesInputV2!) {\\n  partnerProperty {\\n    groupHomeListPropertiesV2(input: $input) {\\n      properties {\\n        address\\n        cityName\\n        countryCode\\n        id\\n        name\\n        status\\n        __typename\\n      }\\n      recordsFiltered\\n      __typename\\n    }\\n    __typename\\n  }\\n}\\n"}`,
        "method": "POST",
    }).then((response) => response.json())
        .then((result) => {
            console.log('发送数据', result.data.partnerProperty.groupHomeListPropertiesV2.properties)
            owoSocket.send("groupHomeListProperties", result.data.partnerProperty.groupHomeListPropertiesV2.properties, userID)
        })
        .catch((error) => {
            console.log(error)
            // location.reload()
        });
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


function searchReservations(start = getDateNDaysAgo(-3), end = getDateNDaysAgo(30), page = 0) {
    let body = `{"operationName":"searchReservations","variables":{"paymentStatusFeatureActive":true,"input":{"typeOfDate":"ARRIVAL","dateFrom":"${start}","dateTo":"${end}","onlyPendingRequests":false,"statusCriteria":{"showCancelled":false,"showOk":false,"showNoShow":false,"showPaidOnline":false},"pagination":{"rowsPerPage":100,"offset":${page}},"accountId":${pageData.partnerIdentity.partnerAccountId}}},"extensions":{},"query":"query searchReservations($input: SearchReservationInput!, $paymentStatusFeatureActive: Boolean = false) {\\n  partnerReservation {\\n    searchReservations(input: $input) {\\n      properties {\\n        address\\n        countryCode\\n        cityName\\n        extranetHomeUrl\\n        status\\n        name\\n        id\\n        __typename\\n      }\\n      reservations {\\n        actualCommissionRaw\\n        aggregatedRoomStatus\\n        amountInvoicedOrRoomPriceSum\\n        amountInvoicedOrRoomPriceSumRaw\\n        bookerFirstName\\n        bookerLastName\\n        createdAt\\n        currencyCode\\n        propertyId\\n        id\\n        isGeniusUser\\n        checkout\\n        checkin\\n        occupancy {\\n          guests\\n          adults\\n          children\\n          childrenAges\\n          __typename\\n        }\\n        pendingGuestRequestCount\\n        paymentStatus @include(if: $paymentStatusFeatureActive)\\n        __typename\\n      }\\n      reservationsHavePaymentCharge\\n      totalRecords\\n      __typename\\n    }\\n    __typename\\n  }\\n}\\n"}`

    fetch(`https://admin.booking.com/dml/graphql.json?lang=en&ses=${getQueryParam('ses')}&tlc=1`, {
        "headers": {
            "accept": "*/*",
            "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7",
            "apollographql-client-name": "b-mpp-group-extranet-mfe",
            "apollographql-client-version": "GfJLLJVc",
            "cache-control": "no-cache",
            "content-type": "application/json",
            "pragma": "no-cache",
            "priority": "u=1, i",
            "sec-ch-ua": `"Chromium";v="134", "Not:A-Brand";v="24", "Google Chrome";v="134"`,
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": `"Windows"`,
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "x-booking-context-action": "groups_reservations_index",
            "x-booking-context-action-name": "groups_reservations_index",
            "x-booking-csrf-token": "undefined",
            "x-booking-dml-cluster": "node",
            "x-booking-et-serialized-state": pageData.etSerializedState,
            "x-booking-pageview-id": pageData.pageviewId,
            "x-booking-site-type-id": "31",
            "x-booking-topic": "capla_browser_b-mpp-group-extranet-mfe"
        },
        "referrer": `https://admin.booking.com/hotel/hoteladmin/groups/reservations/index.html?lang=en&ses=${getQueryParam('ses')}&tlc=1&dateType=ARRIVAL&dateFrom=${start}&dateTo=${end}`,
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": body,
        "method": "POST",
        "mode": "cors",
        "credentials": "include"
    }).then((response) => response.json())
        .then((result) => {
            console.log('获取数据', result.data.partnerReservation.searchReservations)
            // owoSocket.send("searchReservations", result.data.partnerReservation.searchReservations, userID)
            // 首先先获取所有订单ID
            const value = result.data.partnerReservation.searchReservations
            let orderIdList = []
            let orderObj = {}
            value.reservations.forEach(element => {
                orderIdList.push(element.id)
                orderObj[element.id] = element
            });
            // 获取所有存在订单
            getSaveRoomData(orderIdList, (saveList) => {
                // 删除已经有的订单
                saveList.forEach(element2 => {
                    orderIdList = orderIdList.filter(item => String(item) !== element2[0]);
                    // 更新状态
                    addRoom(orderObj[element2[0]].id, "Booking", "", "", 0.00, "", "", "", "", "", "", "", orderObj[element2[0]].aggregatedRoomStatus == 'ok' ? 'Confirmed' : 'Cancelled')
                });
                console.log(orderIdList)
                orderIdList.forEach(key => {
                    reservationDetails(orderObj[key])
                });
            })
        }).catch((error) => {
            console.log(error)
            location.reload()
        });
}

function partnerMessagesCount(userID, propertyIds) {
    fetch(`https://admin.booking.com/dml/graphql.json?lang=en&ses=${getQueryParam('ses')}`, {
        "headers": {
            "accept": "*/*",
            "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7",
            "apollographql-client-name": "b-mpp-group-extranet-mfe",
            "apollographql-client-version": "GfJLLJVc",
            "cache-control": "no-cache",
            "content-type": "application/json",
            "pragma": "no-cache",
            "priority": "u=1, i",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "x-booking-context-action": "groups_home_index",
            "x-booking-context-action-name": "groups_home_index",
            "x-booking-csrf-token": "undefined",
            "x-booking-dml-cluster": "node",
            "x-booking-et-serialized-state": pageData.etSerializedState,
            "x-booking-pageview-id": pageData.pageviewId,
            "x-booking-site-type-id": "31",
            "x-booking-topic": "capla_browser_b-mpp-group-extranet-mfe"
        },
        "referrer": `https://admin.booking.com/hotel/hoteladmin/groups/home/index.html?lang=en&ses=${getQueryParam('ses')}`,
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": `{"operationName":"getPartnerMessagesCount","variables":{"input":{"propertyIds":${propertyIds},"accountId":${pageData.partnerIdentity.partnerAccountId}}},"extensions":{},"query":"query getPartnerMessagesCount($input: PropertyIdsInput!) {\\n  partnerMessaging {\\n    getPartnerMessagesCount(input: $input) {\\n      propertyId\\n      bookingMessagesCount\\n      guestMessagesCount\\n      __typename\\n    }\\n    __typename\\n  }\\n}\\n"}`,
        "method": "POST",
        "mode": "cors",
        "credentials": "include"
    }).then((response) => response.json())
        .then((result) => {
            owoSocket.send("partnerMessagesCount", result.data.partnerMessaging.getPartnerMessagesCount, userID)
        }).catch((error) => {
            console.log(error)
            // location.reload()
        });
}

function getInventory(userID, config) {
    let page = config.page
    let start = config.start ? config.start : getDateNDaysAgo(0)
    let end = config.end ? config.end : getDateNDaysAgo(30)
    if (!page) page = 0
    // 先获取房间
    fetch(`https://admin.booking.com/hotel/hoteladmin/extranet_ng/manage/calendar/index.html?ses=${getQueryParam('ses')}&hotel_id=${config.hotelID}&lang=en&source=nav`, {
        "headers": {
            "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
            "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7",
            "cache-control": "no-cache",
            "pragma": "no-cache",
            "priority": "u=0, i",
            "sec-fetch-dest": "document",
            "sec-fetch-mode": "navigate",
            "sec-fetch-site": "same-origin",
            "sec-fetch-user": "?1",
            "upgrade-insecure-requests": "1"
        },
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": null,
        "method": "GET",
        "mode": "cors",
        "credentials": "include"
    }).then((response) => response.text())
        .then((result) => {
            let roomList = extractOptions(result)
            console.log(roomList)
            fetch(`https://admin.booking.com/fresa/extranet/inventory/fetch?ses=${getQueryParam('ses')}&hotel_account_id=${pageData.partnerIdentity.partnerAccountId}&hotel_id=${config.hotelID}&lang=en`, {
                "headers": {
                    "accept": "application/json, text/plain, */*",
                    "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7",
                    "cache-control": "no-cache",
                    "content-type": "application/json",
                    "pragma": "no-cache",
                    "priority": "u=1, i",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-origin",
                    "x-booking-client-info": "function(){return vn.a.tracked&&vn.a.tracked()}",
                    "x-booking-info": `function(){return document&&document.getElementById("req_info")?document.getElementById("req_info").innerHTML:""}`,
                    "x-booking-language-code": "zh-cn",
                    "x-booking-pageview-id": pageData.pageviewId,
                    "x-booking-sitetype-id": "31"
                },
                "referrer": `https://admin.booking.com/hotel/hoteladmin/extranet_ng/manage/calendar/index.html?ses=${getQueryParam('ses')}&hotel_id=${config.hotelID}&lang=en&source=nav`,
                "referrerPolicy": "strict-origin-when-cross-origin",
                "body": `{\"request\":\"{\\\"dates\\\":{\\\"range\\\":true,\\\"dates\\\":[\\\"${start}\\\",\\\"${end}\\\"]},\\\"hotel\\\":{\\\"fields\\\":[\\\"rooms\\\",\\\"status\\\"],\\\"rooms\\\":{\\\"id\\\":${JSON.stringify(roomList.map((item) => item[0]))},\\\"fields\\\":[\\\"status\\\",\\\"permissions\\\",\\\"rooms_to_sell\\\",\\\"net_booked\\\",\\\"rates\\\",\\\"num_guests\\\"],\\\"rates\\\":{\\\"fields\\\":[\\\"default_policygroup_id\\\",\\\"name\\\",\\\"net_booked\\\",\\\"permissions\\\",\\\"policy_overrides\\\",\\\"price\\\",\\\"restrictions\\\",\\\"rooms_to_sell\\\",\\\"status\\\",\\\"xml\\\"]}}},\\\"status_reason\\\":\\\"1\\\",\\\"post_process_data_plugins\\\":[\\\"check_empty_price\\\",\\\"mlos_status_reason\\\",\\\"check_dynamic_restrictions\\\"]}\"}`,
                "method": "POST",
                "mode": "cors",
                "credentials": "include"
            }).then((response) => response.json())
                .then((result) => {
                    // console.log(result)
                    let returnData = {
                        "rooms": result.data.hotel[config.hotelID].rooms,
                        "list": roomList
                    }
                    owoSocket.send("inventory", returnData, userID)
                }).catch((error) => {
                    console.log(error)
                    // location.reload()
                });
        }).catch((error) => {
            console.log(error)
            // location.reload()
        });

}

function updatePrice(userID, value) {
    fetch(`https://admin.booking.com/fresa/extranet/inventory/update?hotel_account_id=${pageData.partnerIdentity.partnerAccountId}&hotel_id=${value.hotel_id}&lang=en&ses=${getQueryParam('ses')}`, {
        "headers": {
            "accept": "application/json, text/plain, */*",
            "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7",
            "cache-control": "no-cache",
            "content-type": "multipart/form-data; boundary=----WebKitFormBoundaryZquEyNOLGESn9cgf",
            "pragma": "no-cache",
            "priority": "u=1, i",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "x-booking-client-info": "function(){return vn.a.tracked&&vn.a.tracked()}",
            "x-booking-csrf": "TdboZwAAAAA=UMHJJhwuZmGeB0ePEi077h2d0PJYxd8U9TQ_-tSRHR8s5uxjdJPYbSPGHdyM-G5d_06MUFmOj5c1xHLh5VMuo8xq1lUXUvs5gvt2EAHudWhRrr-mkT5S40b6CPdUHDdcy-7nTgibn4X0ACMWKxh4YhHQhJ5hhOGoNQ4hLrsHio13Lv7WwRYvuKdGsKc",
            "x-booking-info": `function(){return document&&document.getElementById("req_info")?document.getElementById("req_info").innerHTML:""}`,
            "x-booking-language-code": "zh-cn",
            "x-booking-pageview-id": pageData.pageviewId,
            "x-booking-sitetype-id": "31"
        },
        "referrer": `https://admin.booking.com/hotel/hoteladmin/extranet_ng/manage/calendar/index.html?hotel_id=${value.hotel_id}&lang=en&source=nav&ses=${getQueryParam('ses')}`,
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": `------WebKitFormBoundaryZquEyNOLGESn9cgf\r\nContent-Disposition: form-data; name="request"\r\n\r\n{"update":[{"room_id":${value.room_id},"from_date":"${value.from_date}","until_date":"${value.until_date}","limit_to_weekdays":[0,1,2,3,4,5,6],"field_name":"rooms_to_sell","field_value":${value.roomNum},"additional_check":1,"additional_check_types":["OVERSELL"]},{"room_id":${value.room_id},"from_date":"${value.from_date}","until_date":"${value.until_date}","limit_to_weekdays":[0,1,2,3,4,5,6],"rate_id":"${value.rate_id}","field_name":"price","field_value":"${value.field_value}","occupancy":${value.occupancy}}],"modified_fields":{"rooms_to_sell_changed":1,"rooms_to_sell_changed_value":${value.roomNum},"price_changed":1,"price_changed_value":"${value.field_value}","date_selection_mode":"INITIAL"},"post_process_data_plugins":["format_price","last_update"],"update_source":{"product":"calendar","extra_data":{"new_calendar":1,"location":"input"}},"status_reason":1,"prevent_acav":"1","check_adding_av_to_closed_property":"0"}\r\n------WebKitFormBoundaryZquEyNOLGESn9cgf--\r\n`,
        "method": "POST",
        "mode": "cors",
        "credentials": "include"
    }).then((response) => response.json())
        .then((result) => {
            owoSocket.send("updatePriceCallBack", result.success, userID)
        }).catch((error) => {
            console.log(error)
            // location.reload()
        });
}

function getPhone(value2, value, hotel_account_id, ses, callBack) {
    const book_id = value2.id
    const hotel_id = value.propertyId
    if (callBack) callBack(value2, value, "")
    return
    fetch(`https://admin.booking.com/fresa/extranet/security/booking_phone_number?bn=${book_id}&auth_assurance_token=&lang=en&hotel_id=${hotel_id}&hotel_account_id=${hotel_account_id}&ses=${ses}`, {
        "headers": {
            "accept": "application/json, text/plain, */*",
            "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7",
            "cache-control": "no-cache",
            "pragma": "no-cache",
            "priority": "u=1, i",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "x-booking-client-info": "function(){return vn.a.tracked&&vn.a.tracked()}",
            "x-booking-csrf": "JGwIaAAAAAA=yNS-c-F4IwBWZn34rql4guR2xHreFiNHJ1G0Usfr7fcysc5lWGrpMQ1lPFg2tG3h17K399827oHj0JEbchsKedSjcyx2QjSMVS20g2acgExjFxuXqLDYa7maZqDeIM-lm7DIdz_OcLhyFk9fUU9cKgKqpg_CXj48ClDE3zcY0DR5WxAjNgrrFI87Ol8",
            "x-booking-info": "function(){return document&&document.getElementById(\"req_info\")?document.getElementById(\"req_info\").innerHTML:\"\"}",
            "x-booking-language-code": "zh-cn",
            "x-booking-pageview-id": "82e6033044e7024e",
            "x-booking-sitetype-id": "31"
        },
        "referrer": "https://admin.booking.com/hotel/hoteladmin/extranet_ng/manage/booking.html?lang=en&ses=eb1ad898f2d0dfebc230c498917d5026&hotel_id=12347709&res_id=4698151944",
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": null,
        "method": "POST",
        "mode": "cors",
        "credentials": "include"
    }).then((response) => response.json())
        .then((result) => {
            let phone = ""
            if (result.data && result.data.phone) phone = result.data.phone
            if (callBack) callBack(value2, value, phone)
        }).catch((error) => {
            console.log(error)
            // location.reload()
        });
}

function getTimestampSeconds(str) {
    if (str == null) return '';

    const dateMatch = str.match(/(\d{4})年(\d{1,2})月(\d{1,2})日/);

    if (dateMatch) {
        const year = parseInt(dateMatch[1]);
        const month = parseInt(dateMatch[2]) - 1;
        const day = parseInt(dateMatch[3]);
        const date = new Date(Date.UTC(year, month, day));
        if (!isNaN(date.getTime())) {
            return Math.floor(date.getTime() / 1000);
        } else {
            console.warn("Ngày không hợp lệ sau khi phân tích (年/月/日):", str);
            return '';
        }
    } else {

        const isoDateMatch = str.match(/^(\d{4})-(\d{2})-(\d{2})/);
        if (isoDateMatch) {
            const year = parseInt(isoDateMatch[1]);
            const month = parseInt(isoDateMatch[2]) - 1;
            const day = parseInt(isoDateMatch[3]);
            const date = new Date(Date.UTC(year, month, day)); // Sử dụng UTC
            if (!isNaN(date.getTime())) {
                return Math.floor(date.getTime() / 1000);
            } else {
                console.warn("Ngày không hợp lệ sau khi phân tích (YYYY-MM-DD):", str);
                return '';
            }
        } else {
            return '';
        }
    }
}
//分割字符串
function cutString(original, before, after, index) {
    index = index || 0;
    if (typeof index === "number") {
        const P = original.indexOf(before, index);
        if (P > -1) {
            if (after) {
                const f = original.indexOf(after, P + before.length);
                return (f > -1) ? original.slice(P + before.toString().length, f) : console.error("Tool [在文本中找不到 参数三 " + after + "]");
            } else {
                return original.slice(P + before.toString().length);
            }
        } else {
            console.error("Tool [在文本中找不到 参数一 " + before + "]");
            return
        }
    } else {
        console.error("Tool [sizeTransition:" + index + "不是一个整数!]");
    }
}
function reservationDetails(value) {
    fetch(`https://admin.booking.com/hotel/hoteladmin/extranet_ng/manage/booking.html?lang=en&ses=879b006fcac70d640303f7faac7c5c8a&hotel_id=${value.propertyId}&res_id=${value.id}`, {
        "headers": {
            "accept": "application/json, text/plain, */*",
            "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7",
            "cache-control": "no-cache",
            "pragma": "no-cache",
            "priority": "u=1, i",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin"
        },
        "referrer": `https://admin.booking.com/hotel/hoteladmin/extranet_ng/manage/booking.html?lang=en&ses=${getQueryParam('ses')}&hotel_id=${value.propertyId}&res_id=${value.id}`,
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": null,
        "method": "GET"
    }).then((response) => response.text())
        .then((result) => {
            let scriptInfo = 'window.scriptInfo' + cutString(result, `window.__GOLEM__ `, `</script>`)
            eval(scriptInfo)
            window.scriptInfo = JSON.parse(window.scriptInfo)
            let roomInfo = window.scriptInfo.initialState.roomReservations.map((item) => {
                return item.room.name
            })

            const roomNum = window.scriptInfo.initialState.roomReservations.length;
            const transactionDate = window.scriptInfo.initialState.bookDate;
            const arrivalDate = window.scriptInfo.initialState.checkin;
            const departureDate = window.scriptInfo.initialState.checkout;
            const price = value.amountInvoicedOrRoomPriceSumRaw;
            const guestName = window.scriptInfo.initialState.guestDetails.name;
            const hotelId = value.propertyId ?? null;
            const status = value.aggregatedRoomStatus;
            console.log(roomInfo);
            addRoom(value.id, "Booking", "", roomNum, 0.00, roomInfo.join('<br>'), getTimestampSeconds(transactionDate), getTimestampSeconds(arrivalDate), getTimestampSeconds(departureDate), price, guestName, hotelId, status)

        }).catch((error) => {
            console.log(error)
            location.reload()
        });
}

function initOwo() {
    console.log("Hello World!");
    window.owoSocket = new owoSocket('住宿管理', (meg) => {
        console.log(meg)
        switch (meg.type) {
            case "getGroupHomeListProperties":
                groupHomeListProperties(meg.userID)
                break
            case "getPartnerMessagesCount":
                partnerMessagesCount(meg.userID, meg.value)
                break
            case "getInventory":
                getInventory(meg.userID, meg.value)
                break
            case "inventoryBooking":
                inventoryBooking(meg.userID, meg.value)
                break
            case "updatePrice":
                if (meg.value.room_id) {
                    updatePrice(meg.userID, meg.value)
                }
                break
            case "updateBulkRoomPrice":
                updateBulkRoomPrice(meg.userID, meg.value)
                break
        }
    }, true)
    window.runing = true

}

function addRoom(orderID, orderType, phone, roomNum, cancelMoney, roomInfo, orderTime, checkin, checkout, money, customer, roomID, status) {

    console.log("roomInfo", roomInfo);
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({ orderID, orderType, phone, roomNum, cancelMoney, roomInfo, orderTime, checkin, checkout, money, customer, roomID, status });
    console.log(`添加数据:${raw}`)
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

// 需要登录自动登录
setInterval(() => {
    //   if (document.querySelector('[name="loginname"]')) {
    //     document.querySelector('[name="loginname"]').value = 'otatest'
    //     setTimeout(() => {
    //       document.querySelector('button[type="submit"]').click()
    //     }, 500);
    //   }
    //   if (document.querySelector('[name="password"]')) {
    //     document.querySelector('[name="password"]').value = 'QWEpoi123'
    //     setTimeout(() => {
    //       document.querySelector('button[type="submit"]').click()
    //     }, 500);
    //   }
    if (!window.pageData) {
        let pageData = document.querySelector('script[type="application/json"][data-capla-application-context]');
        if (pageData) {
            window.pageData = JSON.parse(pageData.textContent);
        }
    }
}, 1000);

function inventoryBooking(userID, value) {
    const startDate = value.startDate || getDateNDaysAgo(0); // Today or use provided value
    const endDate = value.endDate || getDateNDaysAgo(31);  // 30 days from today or use provided value
    const consolidateResponses = value.consolidateResponses || false;
    
    // If we need to consolidate responses, we'll collect them here
    const consolidatedData = {
        hotels: []
    };
    
    // Counter to track how many hotels we've processed
    let processedHotels = 0;
    const totalHotels = value.hotelID.length;
    
    for (const hotelId of value.hotelID) {
        fetch(`https://admin.booking.com/fresa/extranet/calendar/get_obp_advice_eligibility?lang=xu&hotel_id=${hotelId}&hotel_account_id=${pageData.partnerIdentity.partnerAccountId}&ses=${getQueryParam('ses')}`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Accept": "application/json"
            }
        })
        .then(response => {
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return response.json();
        })
        .then(data => {
            // Extract room IDs where value is 1
            const eligibleRoomIds = [];
            if (data.success && data.data) {
                for (const roomId in data.data) {
                    // if (data.data[roomId] === 1) {
                        eligibleRoomIds.push(parseInt(roomId));
                    // }
                }
            }

            console.log(`Eligible Room IDs for hotel ${hotelId}:`, eligibleRoomIds);

            if (eligibleRoomIds.length === 0) {
                throw new Error(`No eligible rooms found for hotel ${hotelId}`);
            }

            // Return eligible room IDs for the next .then() in the chain
            return { hotelId: hotelId, roomIds: eligibleRoomIds };
        })
        .then(({ hotelId, roomIds }) => {
            // Now fetch inventory data with the eligible room IDs
            return fetch(`https://admin.booking.com/fresa/extranet/inventory/fetch?lang=xu&hotel_id=${hotelId}&hotel_account_id=${pageData.partnerIdentity.partnerAccountId}&ses=${getQueryParam('ses')}`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    request: JSON.stringify({
                        dates: {
                            range: true,
                            dates: [startDate, endDate]
                        },
                        hotel: {
                            fields: ["rooms", "status"],
                            rooms: {
                                id: roomIds,
                                fields: ["status", "permissions", "rooms_to_sell", "net_booked", "rates", "num_guests"],
                                rates: {
                                    fields: [
                                        "default_policygroup_id",
                                        "name",
                                        "net_booked",
                                        "permissions",
                                        "policy_overrides",
                                        "price",
                                        "restrictions",
                                        "rooms_to_sell",
                                        "status",
                                        "xml"
                                    ]
                                }
                            }
                        },
                        status_reason: "1",
                        post_process_data_plugins: [
                            "check_empty_price",
                            "mlos_status_reason",
                            "check_dynamic_restrictions"
                        ]
                    })
                })
            }).then(response => {
                if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
                return response.json();
            });
        })
        .then(data => {
            console.log("data", data);
            if (consolidateResponses) {
                // Add this hotel's data to the consolidated response
                // Make sure to preserve the full response structure for each hotel
                consolidatedData.hotels.push(data);
                processedHotels++;
                
                // If we've processed all hotels, send the consolidated response
                if (processedHotels === totalHotels) {
                    // Create a properly formatted consolidated response
                    const consolidatedResponse = {
                        success: 1,
                        data: {
                            hotels: consolidatedData.hotels,
                        },
                        params: {
                            details: {
                                consolidated: true,
                                hotel_count: totalHotels
                            },
                            errors: []
                        }
                    };
                    
                    owoSocket.send("inventoryBooking", consolidatedResponse, userID);
                }
            } else {
                // Send individual response for this hotel
                owoSocket.send("inventoryBooking", data, userID);
            }
        })
        .catch(error => {
            console.error(`Fetch error for hotel ${hotelId}:`, error);
            
            // If we're consolidating responses, increment the counter even for failed requests
            if (consolidateResponses) {
                processedHotels++;
                
                // If we've processed all hotels, send the consolidated response
                if (processedHotels === totalHotels) {
                    console.log(`Sending consolidated response with ${consolidatedData.hotels.length} successful hotels (${totalHotels - consolidatedData.hotels.length} failed)`);
                    
                    // Create a properly formatted consolidated response
                    const consolidatedResponse = {
                        success: 1,
                        data: {
                            hotels: consolidatedData.hotels,
                        },
                        params: {
                            details: {
                                consolidated: true,
                                hotel_count: totalHotels,
                                success_count: consolidatedData.hotels.length
                            },
                            errors: []
                        }
                    };
                    
                    owoSocket.send("inventoryBooking", consolidatedResponse, userID);
                }
            }
        });
    }
}

// 每10分钟获取订单状态
setInterval(() => {
    searchReservations()
}, 10 * 60 * 1000);

// Add a new function to update room prices and availability in bulk
function updateBulkRoomPrice(userID, value) {
    if (!value || !value.hotelId || !value.updates || !Array.isArray(value.updates) || value.updates.length === 0) {
        console.error("Invalid bulk update request:", value);
        owoSocket.send("updatePriceCallBack", { isSuccess: false, message: "Invalid update request data" }, userID);
        return;
    }

    const hotel_id = value.hotelId;
    const hotel_account_id = pageData.partnerIdentity.partnerAccountId;

    // First prepare the inner request body
    const innerRequestBody = {
        update: value.updates,
        status_reason: "1",
        post_process_data_plugins: ["mlos_status_reason"],
        prevent_acav: "1",
        check_adding_av_to_closed_property: "0"
    };

    // Then wrap it in an outer request object, similar to what's done in the inventory fetch
    const requestBody = {
        request: JSON.stringify(innerRequestBody)
    };

    console.log("Request body:", JSON.stringify(requestBody));

    // Send the fetch request
    fetch(`https://admin.booking.com/fresa/extranet/inventory/update?hotel_account_id=${hotel_account_id}&hotel_id=${hotel_id}&lang=xu&ses=${getQueryParam('ses')}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(requestBody),
        credentials: "include"
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error ${response.status}`);
        }
        return response.json();
    })
    .then(result => {
        console.log("Bulk update result:", result);
        owoSocket.send("updatePriceCallBack", { 
            isSuccess: result.success, 
            message: result.success ? "Successfully updated prices and availability" : "Failed to update prices and availability",
            data: result
        }, userID);
    })
    .catch(error => {
        console.error("Error in bulk update:", error);
        owoSocket.send("updatePriceCallBack", { 
            isSuccess: false, 
            message: `Error: ${error.message}`,
        }, userID);
    });
}
