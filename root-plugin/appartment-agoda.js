setTimeout(() => {
    initOwo()
}, 3000);


console.log('agoda')
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


function searchReservations(userID, config) {
    let page = config.page
    let start = config.start ? config.start : getDateNDaysAgo(0)
    let end = config.end ? config.end : getDateNDaysAgo(30)
    if (!page) page = 0
    fetch("https://ycs.agoda.com/mldc/en-us/api/reporting/MultiPropertyBooking/bookings", {
        "headers": {
            "accept": "application/json, text/plain, */*",
            "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7",
            "cache-control": "no-cache",
            "content-type": "application/json-patch+json",
            "pragma": "no-cache",
            "request-id": "|a56b5f1e1c7c47c6822ece7f75132b69.770c9cf9e5e742c8",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "traceparent": "00-a56b5f1e1c7c47c6822ece7f75132b69-770c9cf9e5e742c8-01"
        },
        "referrer": "https://ycs.agoda.com/mldc/en-us/app/reporting/booking/multiproperty",
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": JSON.stringify({ "guestName": "", "stayDatePeriod": { "from": start, "to": end } }),
        "method": "POST",
        "mode": "cors",
        "credentials": "include"
    }).then((response) => response.json())
        .then((result) => {
            console.log('发送数据', result)
            owoSocket.send("searchReservations3", result, userID)
        }).catch((error) => {
            console.log(error)
            // location.reload()
        });
}

function getInventory(userID, config) {
    // Fetch Agoda Hotel data
    // if (config.AgodaHotelID) {
    //     fetch(`https://ycs.agoda.com/en-us/${config.AgodaHotelID}/kipp/api/AvailabilityRatesApi/Search?`, {
    //         "headers": {
    //             "accept": "application/json",
    //             "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7",
    //             "cache-control": "no-cache",
    //             "content-type": "application/json",
    //             "pragma": "no-cache",
    //             "request-id": "|990351525dbd4d8dafe7d9a57c2f3900.49530c5f841744a4",
    //             "sec-fetch-dest": "empty",
    //             "sec-fetch-mode": "cors",
    //             "sec-fetch-site": "same-origin",
    //             "traceparent": "00-990351525dbd4d8dafe7d9a57c2f3900-49530c5f841744a4-01"
    //         },
    //         "referrer": `https://ycs.agoda.com/en-us/kipp/app/ratesallotments/calendar/${config.AgodaHotelID}`,
    //         "referrerPolicy": "strict-origin-when-cross-origin",
    //         "body": JSON.stringify({ "language": "en-us", "hotelId": config.AgodaHotelID, "RoomTypeId": 0, "StartDate": config.start, "EndDate": config.end }),
    //         "method": "POST",
    //         "mode": "cors",
    //         "credentials": "include"
    //     }).then((response) => response.json())
    //         .then((result) => {
    //             console.log('发送数据 Agoda Hotel', result)
    //             owoSocket.send("inventoryAgodaHotel", result.Data, userID)
    //         }).catch((error) => {
    //             console.log(error)
    //             // location.reload()
    //         });
    // }

    // // Fetch Agoda Homes UPC data if available
    // if (config.AgodaHomesUpcID) {
    //     fetch(`https://ycs.agoda.com/homes/en-us/api/v2/calendar/availability?p=${config.AgodaHomesUpcID}`, {
    //         "headers": {
    //             "accept": "application/json",
    //             "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7",
    //             "cache-control": "no-cache",
    //             "content-type": "application/json",
    //             "pragma": "no-cache",
    //             "sec-fetch-dest": "empty",
    //             "sec-fetch-mode": "cors",
    //             "sec-fetch-site": "same-origin"
    //         },
    //         "referrer": "https://ycs.agoda.com/homes/en-us/HostManage/",
    //         "referrerPolicy": "strict-origin-when-cross-origin",
    //         "body": JSON.stringify({ "startDate": config.start, "endDate": config.end }),
    //         "method": "POST",
    //         "mode": "cors",
    //         "credentials": "include"
    //     }).then((response) => response.json())
    //         .then((result) => {
    //             console.log('发送数据 Agoda Homes', result)
    //             result.AgodaHomesID = config.AgodaHomesUpcID;
    //             owoSocket.send("inventoryAgodaHomes", result, userID)
    //         }).catch((error) => {
    //             console.log(error)
    //             // location.reload()
    //         });
    // }
}

function getReservationDetails(userID, config) {
    fetch(`https://ycs.agoda.com/mldc/en-us/api/reporting/Booking/details/${config.propertyId}/bookingDetails?bookingToken=${config.bookingToken}&isMultiPropertyBooking=false`, {
        "headers": {
            "accept": "application/json, text/plain, */*",
            "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7",
            "request-id": "|aa0e76117ab340e3b7886ad7468fc4eb.1059bc25b498401a",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "traceparent": "00-aa0e76117ab340e3b7886ad7468fc4eb-1059bc25b498401a-01"
        },
        "referrer": "https://ycs.agoda.com/mldc/en-us/app/reporting/booking/multiproperty?startDate=01-11-2024&endDate=20-04-2025",
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": null,
        "method": "GET",
        "mode": "cors",
        "credentials": "include"
    }).then((response) => response.json())
        .then((result) => {
            console.log('发送数据', result)
            owoSocket.send("reservationDetails3", result, userID)
        }).catch((error) => {
            console.log(error)
            // location.reload()
        });
}

function updatePrice(userID, config) {
    fetch(`https://ycs.agoda.com/en-us/${config.AgodaHotelID}/kipp/api/AvailabilityRatesApi/Save?`, {
        "headers": {
            "accept": "application/json",
            "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7",
            "content-type": "application/json",
            "request-id": "|328d4ae5767c438b89c8076d7b03bec9.25a64b90d5d44242",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "traceparent": "00-328d4ae5767c438b89c8076d7b03bec9-25a64b90d5d44242-01"
        },
        "referrer": `https://ycs.agoda.com/en-us/kipp/app/ratesallotments/calendar/${config.AgodaHotelID}`,
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": JSON.stringify({ "HotelID": config.AgodaHotelID, "RoomTypeID": config.RoomTypeID, "IsNHA": false, "StartDateStr": config.from_date, "EndDateStr": config.from_date, "IsBasic": true, "DaysOfWeek": null, "EndDate": null, "RoomAllotmentList": [{ "RoomTypeID": config.RoomTypeID, "Regular": config.roomNum, "Closeout": 0, "CloseoutArrival": 2, "CloseoutDeparture": 2, "Guaranteed": -1, "LogMessages": null, "AllotmentAuditLogs": [{ "PreviousLog": { "Date": config.from_date, "RoomTypeID": config.RoomTypeID, "Regular": 1, "RegularUsed": 0, "Guaranteed": 0, "GuaranteedUsed": 0, "Closeout": 0, "CloseoutArrival": 0, "CloseoutDeparture": 0 }, "CurrentLog": { "Date": config.from_date, "RoomTypeID": config.RoomTypeID, "Regular": config.roomNum, "RegularUsed": 0, "Guaranteed": 0, "GuaranteedUsed": 0, "Closeout": 0, "CloseoutArrival": 0, "CloseoutDeparture": 0 } }] }], "RoomRateList": [{ "RoomTypeID": config.RoomTypeID, "RateCategoryID": config.RateCategoryID, "OccupancyRate": config.field_value, "OccupancyRateOri": config.field_value, "Closeout": 0, "HasLinked": false, "LinkedRateCategoryID": 0, "SingleRate": -1, "DoubleRate": -1, "FullRate": -1, "ExtraBedRate": -1, "MinStay": -2, "MaxStay": -2, "MinNightsStayThrough": -2, "MaxNightsStayThrough": -2, "IsPriceChanged": true, "DeviationType": "F", "DefaultDeviation": 0, "DiscountByOccupancy": { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0, "6": 0 }, "RateAuditLogs": [{ "PreviousLog": { "Date": config.from_date, "RoomTypeID": config.RoomTypeID, "RateCategoryID": config.RateCategoryID, "FullRate": config.field_value, "Closeout": 0, "BasePrice": config.field_value }, "CurrentLog": { "Date": config.from_date, "RoomTypeID": config.RoomTypeID, "RateCategoryID": config.RateCategoryID, "FullRate": config.field_value, "Closeout": 0, "BasePrice": config.field_value } }] }], "StartDate": null }),
        "method": "POST",
        "mode": "cors",
        "credentials": "include"
    });
}

function updatePrice2(userID, config) {
    fetch(`https://ycs.agoda.com/homes/en-us/api/v2/calendar/multiocc?p=${config.AgodaHomesID}`, {
        "headers": {
            "accept": "application/json",
            "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7",
            "cache-control": "no-cache",
            "content-type": "application/json",
            "pragma": "no-cache",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "traceparent": "00-f6c669ed496a4a7685c84e00cdbd21b6-491bc6bc5f6a40e4-01"
        },
        "referrer": "https://ycs.agoda.com/homes/en-us/HostManage/",
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": JSON.stringify({ "daysOfWeek": getWeekday(config.from_date), "isAvailable": true, "dateRange": { "startDate": config.from_date, "endDate": config.until_date }, "rates": { "basePrice": config.field_value }, "maxOccupency": 2, "occupancyThreshold": 1, "extraGuestCost": 0 }),
        "method": "POST",
        "mode": "cors",
        "credentials": "include"
    });
}


function searchReservations2(userID, config) {
    let page = config.page
    let start = config.start ? config.start : getDateNDaysAgo(0)
    let end = config.end ? config.end : getDateNDaysAgo(30)
    if (!page) page = 0
    fetch(`https://ycs.agoda.com/homes/en-us/api/v2/reservation?page=${page + 1}&pageSize=20&unPagedTotalBucket1=0&unPagedTotalBucket2=0&unPagedTotalBucket3=0`, {
        "headers": {
            "accept": "application/json, text/plain, */*",
            "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7",
            "cache-control": "no-cache",
            "content-type": "application/json-patch+json",
            "pragma": "no-cache",
            "request-id": "|a56b5f1e1c7c47c6822ece7f75132b69.770c9cf9e5e742c8",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "traceparent": "00-505afa4926024bb7aecccba3a4232cbe-9a1c8d42efa04951-01"
        },
        "referrer": "https://ycs.agoda.com/homes/en-us/HostManage/",
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": null,
        "method": "GET",
        "mode": "cors",
        "credentials": "include"
    }).then((response) => response.json())
        .then((result) => {
            owoSocket.send("searchReservations4", result, userID)
        }).catch((error) => {
            console.log(error)
            // location.reload()
        });
}

function getReservationDetails2(userID, config) {
    fetch(`https://ycs.agoda.com/mldc/en-us/api/reporting/Booking/details/${config.propertyId}/bookingDetails?bookingToken=${config.bookingToken}&isMultiPropertyBooking=false`, {
        "headers": {
            "accept": "application/json, text/plain, */*",
            "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7",
            "request-id": "|aa0e76117ab340e3b7886ad7468fc4eb.1059bc25b498401a",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "traceparent": "00-aa0e76117ab340e3b7886ad7468fc4eb-1059bc25b498401a-01"
        },
        "referrer": "https://ycs.agoda.com/mldc/en-us/app/reporting/booking/multiproperty?startDate=01-11-2024&endDate=20-04-2025",
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": null,
        "method": "GET",
        "mode": "cors",
        "credentials": "include"
    }).then((response) => response.json())
        .then((result) => {
            owoSocket.send("reservationDetails3", result, userID)
        }).catch((error) => {
            console.log(error)
            // location.reload()
        });
}

function getAvailabilityHub(userID, config) {
    config.AgodaHotelID.forEach(element => {
        const sleepTime = Math.random() * 800 + 200; // Random between 200-1000ms
        setTimeout(() => {
            fetch(`https://ycs.agoda.com/mldc/en-us/api/ari/AvailabilityCenterApi/GetAvailabilityHubViewModel/${element}?startDate=${config.start.split('-').reverse().join('-')}&endDate=${config.end.split('-').reverse().join('-')}&startDate=${config.start}&endDate=${config.end}`, {
                method: "GET",
                credentials: "include",
            }).then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
                .then(data => {
                    owoSocket.send("availabilityHubViewModel", data, userID)
                })
                .catch(error => {
                    console.error("Error fetching data:", error);
                })
        }, sleepTime)
    })
}

function updatePriceAgoda(userID, config) {
    
    // Use pre-formatted dates if provided, otherwise format them
    const startDateFormatted = config.startDateFormatted || 
        (config.dateFrom ? config.dateFrom.split('-').reverse().join('-') : 
        (config.startDate ? config.startDate : ''));
        
    const endDateFormatted = config.endDateFormatted || 
        (config.dateTo ? config.dateTo.split('-').reverse().join('-') : 
        (config.endDate ? config.endDate : ''));
    
    const url = `https://ycs.agoda.com/mldc/en-us/api/ari/AvailabilityCenterApi/UpdateRate/${config.hotelId}?startDate=${startDateFormatted}&endDate=${endDateFormatted}`;
    
    const dmcId = config.dmcId;
    
    // Format the dates for ISO format (YYYY-MM-DD) for the payload
    // Convert DD-MM-YYYY to YYYY-MM-DD
    const formatDateForPayload = (dateStr) => {
        // If it already has T00:00:00, just return it
        if (dateStr.includes('T00:00:00')) return dateStr;
        
        // If it's in DD-MM-YYYY format, convert to YYYY-MM-DD
        if (dateStr.match(/^\d{2}-\d{2}-\d{4}$/)) {
            const parts = dateStr.split('-');
            return `${parts[2]}-${parts[1]}-${parts[0]}`;
        }
        
        // Return as is, assuming it's already in the right format
        return dateStr;
    };
    
    const startDateForPayload = formatDateForPayload(startDateFormatted);
    const endDateForPayload = formatDateForPayload(endDateFormatted);
    
    const payload = {
        dmcId: dmcId,
        roomTypeId: config.roomTypeId,
        ratePlanId: config.ratePlanId,
        basePrice: config.basePrice || config.price,
        startDate: startDateForPayload,
        endDate: endDateForPayload,
        request: {} // Add the required empty request field
    };
    
    
    return fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            "Accept": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(payload)
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(errorData => {
                throw new Error(`HTTP error! Status: ${response.status}, Details: ${JSON.stringify(errorData)}`);
            });
        }
        return response.json();
    })
    .then(data => {
        if (userID && !config.expectAvailabilityUpdate) {
            owoSocket.send("updatePriceCallBack", data, userID);
        }
        return data;
    })
    .catch(error => {
        if (userID && !config.expectAvailabilityUpdate) {
            owoSocket.send("updatePriceCallBack", { isSuccess: false, message: error.message }, userID);
        }
        throw error;
    });
}

function updateAvailabilityAgoda(userID, config) {
    
    // Use pre-formatted dates if provided, otherwise format them
    const startDateFormatted = config.startDateFormatted || 
        (config.dateFrom ? config.dateFrom.split('-').reverse().join('-') : 
        (config.startDate ? config.startDate : ''));
        
    const endDateFormatted = config.endDateFormatted || 
        (config.dateTo ? config.dateTo.split('-').reverse().join('-') : 
        (config.endDate ? config.endDate : ''));
    
    if (!startDateFormatted || !endDateFormatted) {
        const error = new Error("Missing or invalid date format in request");
        if (userID) {
            owoSocket.send("updatePriceCallBack", { isSuccess: false, message: error.message }, userID);
        }
        throw error;
    }

    const url = `https://ycs.agoda.com/mldc/en-us/api/ari/AvailabilityCenterApi/UpdateAvailabilities/${config.hotelId}?startDate=${startDateFormatted}&endDate=${endDateFormatted}`;

    // Format the dates for ISO format (YYYY-MM-DD) for the payload
    // Convert DD-MM-YYYY to YYYY-MM-DD
    const formatDateForPayload = (dateStr) => {
        // If it already has T00:00:00, just return it
        if (dateStr.includes('T00:00:00')) return dateStr;
        
        // If it's in DD-MM-YYYY format, convert to YYYY-MM-DD
        if (dateStr.match(/^\d{2}-\d{2}-\d{4}$/)) {
            const parts = dateStr.split('-');
            return `${parts[2]}-${parts[1]}-${parts[0]}`;
        }
        
        // Return as is, assuming it's already in the right format
        return dateStr;
    };
    
    const startDateForPayload = formatDateForPayload(startDateFormatted);
    const endDateForPayload = formatDateForPayload(endDateFormatted);

    const payload = {
        roomId: config.roomId || config.roomTypeId,
        totalAvailability: config.totalAvailability || config.roomsToSell,
        startDate: startDateForPayload,
        endDate: endDateForPayload,
        daysOfWeek: null,
        perDayAvailability: null,
        request: {} // Add the required empty request field
    };
    

    return fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            "Accept": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload)
    }).then(response => {
        if (!response.ok) {
            return response.json().then(errorData => {
                throw new Error(`HTTP error! Status: ${response.status}, Details: ${JSON.stringify(errorData)}`);
            });
        }
        return response.json();
    }).then(data => {
            if (userID) {   
                owoSocket.send("updatePriceCallBack", data, userID);
            }
            return data;
        })
        .catch(error => {
            if (userID) {
                owoSocket.send("updatePriceCallBack", { isSuccess: false, message: error.message }, userID);
            }
            throw error;
        });
}

// New function to handle both price and availability updates
function updateAgodaRateAndAvailability(userID, value) {
    
    // Extract the price and availability configs from the incoming request
    const priceConfig = value.priceConfig;
    const availabilityConfig = value.availabilityConfig;

    // First update the price
    return updatePriceAgoda(userID, { ...priceConfig, expectAvailabilityUpdate: true })
        .then(() => {
            // Then update the availability
            return updateAvailabilityAgoda(userID, availabilityConfig);
        })
        .catch(error => {
            console.error("❌ Combined update error:", error);
            if (userID) {
                owoSocket.send("updatePriceCallBack", { isSuccess: false, message: error.message }, userID);
            }
            throw error;
        });
}

function initOwo() {
    window.owoSocket = new owoSocket('住宿管理', (meg) => {
        console.log(meg)
        switch (meg.type) {
            case "getSearchReservations3":
                searchReservations(meg.userID, meg.value)
                break
            case "getReservationDetails3":
                getReservationDetails(meg.userID, meg.value)
                break
            case "getSearchReservations4":
                if (location.href.includes('https://ycs.agoda.com/homes')) searchReservations2(meg.userID, meg.value)
                break
            case "getReservationDetails4":
                if (location.href.includes('https://ycs.agoda.com/homes')) getReservationDetails2(meg.userID, meg.value)
                break
            case "getInventory":
                getInventory(meg.userID, meg.value)
                break
            case "getInventoryAgodaHotel":
                getAvailabilityHub(meg.userID, meg.value)
                break
            case "updatePrice":
                if (meg.value.AgodaHomesID) updatePrice2(meg.userID, meg.value)
                if (meg.value.AgodaHotelID) updatePrice(meg.userID, meg.value)
                break
            case "updatePriceAgoda":
                updatePriceAgoda(meg.userID, meg.value)
                break
            case "updateAvailabilityAgoda":
                updateAvailabilityAgoda(meg.userID, meg.value)
                break
            case "updateAgodaRateAndAvailability":
                updateAgodaRateAndAvailability(meg.userID, meg.value)
                break
        }
    }, true)
    window.runing = true
}