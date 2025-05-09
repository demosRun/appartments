setTimeout(() => {
    initOwo()
}, 3000);



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

function getInventory(userID, config) {
  fetch(`https://ycs.agoda.com/en-us/${config.AgodaHotelID}/kipp/api/AvailabilityRatesApi/Search?`, {
    "headers": {
      "accept": "application/json", "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7", "cache-control": "no-cache", "content-type": "application/json", "pragma": "no-cache", "request-id": "|990351525dbd4d8dafe7d9a57c2f3900.49530c5f841744a4", "sec-fetch-dest": "empty", "sec-fetch-mode": "cors", "sec-fetch-site": "same-origin", "traceparent": "00-990351525dbd4d8dafe7d9a57c2f3900-49530c5f841744a4-01"
    }, "referrer": `https://ycs.agoda.com/en-us/kipp/app/ratesallotments/calendar/${config.AgodaHotelID}`, "referrerPolicy": "strict-origin-when-cross-origin", "body": JSON.stringify({ "language": "en-us", "hotelId": config.AgodaHotelID, "RoomTypeId": 0, "StartDate": config.start, "EndDate": config.end }), "method": "POST", "mode": "cors", "credentials": "include"
  }).then((response) => response.json())
  .then((result) => {
    console.log('发送数据', result)
    owoSocket.send("inventoryAgodaHotel", result.Data, userID)
  }).catch((error) => {
    console.log(error)
    // location.reload()
  });
}


function updatePrice(userID, config) {
  fetch(`https://apps.expediapartnercentral.com/lodging/ratesandinventory/updateInventoryRatesAndRestrictions-React.json?htid=${config.ExpediapHtid}`, {
  "headers": {
      "accept": "*/*", "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7", "content-type": "application/json", "priority": "u=1, i", "sec-fetch-dest": "empty", "sec-fetch-mode": "cors", "sec-fetch-site": "same-origin"
    }, "referrer": `https://apps.expediapartnercentral.com/lodging/roomsandrates/ratesAndAvail.html?htid=${config.ExpediapHtid}`, "referrerPolicy": "strict-origin-when-cross-origin", "body": JSON.stringify({ "updates": [{ "roomTypeId": config.roomID, "date": config.from_date, "inventory": config.roomNum, "type": "inventory", "isValid": true, "roomTypeName": config.roomTypeName, "inventoryType": "Additional" }, { "ratePlanId": config.ExpediapID, "date": config.from_date, "occupancy": 1, "rate": config.field_value, "type": "rate", "isValid": true }] }), "method": "POST", "mode": "cors", "credentials": "include"
});
}

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


function getDateDiff(date1, date2) {
    const d1 = new Date(date1);
    const d2 = new Date(date2);

    const diffTime = Math.abs(d2 - d1); // 差值（毫秒）
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)); // 转为天数
    return diffDays;
  }

function getP(roomAndRatePlanSummaryModel, activeRoomInformation, htid, startDate, endDate, userID) {
    const ratePlanBasicInfoMap = {}
    for (const key in activeRoomInformation) {
        if (Object.prototype.hasOwnProperty.call(activeRoomInformation, key)) {
            const element = activeRoomInformation[key];
            element.ratePlanInformationModels.forEach(element2 => {
                ratePlanBasicInfoMap[element2.ratePlanId] = {
          "ratePlanName": element2.ratePlanName, "ratePlanCodes": [
                        "RateCode"
          ], "ratePlanType": element2.ratePlanType, "pricingSubModel": element2.pricingSubModel, "associatedRoomTypeId": element2.associatedRoomTypeId, "associatedRoomTypeName": element2.associatedRoomTypeName, "isOpaque": element2.isOpaque
                }
            });
        }
    }
    fetch(`https://apps.expediapartnercentral.com/lodging/roomsandrates/ratesAndAvailGetModel-React.json?htid=${htid}`, {
        "headers": {
      "accept": "*/*", "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7", "content-type": "application/json", "priority": "u=1, i", "sec-fetch-dest": "empty", "sec-fetch-mode": "cors", "sec-fetch-site": "same-origin"
    }, "referrer": `https://apps.expediapartnercentral.com/lodging/roomsandrates/ratesAndAvail.html?htid=${htid}`, "referrerPolicy": "strict-origin-when-cross-origin", "body": JSON.stringify({ "startDate": startDate, "numberOfDays": getDateDiff(startDate, endDate), "ratePlanIds": roomAndRatePlanSummaryModel.ratePlanIds, "roomTypeIds": roomAndRatePlanSummaryModel.roomTypeIds, "isFilterOutComplexRates": false, "rateTiers": null, "roomAndRatePlanSummaryModel": { "maxOccupancyForAllRoomTypeIds": 6, "roomTypeIds": roomAndRatePlanSummaryModel.roomTypeIds, "connectedRoomTypeIds": [], "nonConnectedRoomTypeIds": roomAndRatePlanSummaryModel.roomTypeIds, "lengthOfStayPricingRoomTypeIds": [], "dayOfArrivalPricingRoomTypeIds": [], "iCalConnectedRoomTypeIds": [], "ratePlanIds": roomAndRatePlanSummaryModel.ratePlanIds, "linkedChildRatePlanIds": roomAndRatePlanSummaryModel.linkedChildRatePlanIds, "standaloneRatePlanIds": roomAndRatePlanSummaryModel.standaloneRatePlanIds, "packageRatePlanIds": roomAndRatePlanSummaryModel.packageRatePlanIds, "corporateRatePlanIds": [], "wholesaleRatePlanIds": [], "wholesalePackageRatePlanIds": [], "opaqueRatePlanIds": [], "ratePlanAdvancePurchaseMap": roomAndRatePlanSummaryModel.ratePlanAdvancePurchaseMap, "roomTypeSummary": roomAndRatePlanSummaryModel.roomTypeSummary, "unknownPricingRoomTypeIds": roomAndRatePlanSummaryModel.roomTypeIds, "hasConnectedRoomTypeIds": false, "hasNonConnectedRoomTypeIds": true, "hasLengthOfStayPricingSubModels": false, "hasDayOfArrivalPricingSubModels": false, "hasStandaloneRatePlanIds": true, "hasPackageRatePlanIds": true, "hasCorporateRatePlanIds": false, "hasWholesaleRatePlanIds": false, "hasWholesalePackageRatePlanIds": false, "hasOpaqueRatePlanIds": false, "hasUnknownPricingSubModels": true }, "ratePlanBasicInfoMap": ratePlanBasicInfoMap, "currencyCode": "VND", "rateUIPreferences": { "selectedLOS": 1, "selectedOBP": 1, "isShowAllOBPLevelsEnabled": false } }), "method": "POST", "mode": "cors", "credentials": "include"
      }).then((response) => response.json())
        .then((result) => {
            result.roomTypeSummary = roomAndRatePlanSummaryModel.roomTypeSummary
            owoSocket.send("inventoryExpedia", result, userID)
        })
        .catch((error) => console.error(error));
}

function getInventory(userID, value) {
    fetch(`https://apps.expediapartnercentral.com/lodging/roomsandrates/ratesAndAvail.html?htid=${value.ExpediaID}`, {
        "headers": {
      "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7", "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7", "cache-control": "max-age=0", "priority": "u=0, i", "sec-fetch-dest": "document", "sec-fetch-mode": "navigate", "sec-fetch-site": "same-origin", "sec-fetch-user": "?1", "upgrade-insecure-requests": "1"
    }, "referrer": `https://apps.expediapartnercentral.com/lodging/roomsandrates/hub.html?htid=${value.ExpediaID}`, "referrerPolicy": "strict-origin-when-cross-origin", "body": null, "method": "GET", "mode": "cors", "credentials": "include"
    }).then((response) => response.text())
    .then((result) => {
        let infoData = cutString(result, "instance.data = ", ';')
        infoData = JSON.parse(infoData)
        console.log(infoData)
        getP(infoData.roomAndRatePlanSummaryModel, infoData.activeRoomInformation, value.ExpediaID, value.start, value.end, userID)
    })
    .catch((error) => console.error(error));
}

function initOwo() {
    window.owoSocket = new owoSocket('住宿管理', (meg) => {
        console.log(meg)
        switch (meg.type) {
          case "getInventory":
            getInventory(meg.userID, meg.value)
            break
          case "updatePrice":
            if (meg.value.ExpediapHtid) updatePrice(meg.userID, meg.value)
            break
          case "getRatePlans":
            fetchRatePlans(meg.userID, meg.value)
            break
          case "updateExpediaRoomAndRate":
            updateExpediaRoomAndRate(meg.userID, meg.value)
            break
        }
    }, true)
    window.runing = true
    
}

const roomList = [109211009, 109209948, 109115710, 108994639, 113467411, 113467558, 113467782, 109211639, 109210901, 109116103, 108901935, 108900508, 113714219, 109211776, 110727237, 108361841, 109210974, 110768603, 108994095, 108900555, 113467500, 109115308, 109211507, 113467289, 109115456, 108995069, 113714585, 108995060, 108755655, 110766325, 113714125, 109211581, 109211390, 110767178, 109211328, 110378400, 109115248, 108994636, 108900418, 108994799, 113467381, 110762123, 113714455, 110761816, 109210703, 113714545, 108901394, 113714152, 108995068, 109210800, 113467177, 110766892, 110378351, 109114858, 109211177, 113714315, 113715326, 108901576, 109210846, 110768416, 108995073, 113714597, 113714277, 113714375, 110761443, 113714432, 113715254, 113715190, 109211103, 108901631, 113713955, 108901502, 109115403, 110767730, 108994800, 109115474, 108994339, 109211739, 109115385, 109211053, 108901481, 113467333, 109211459, 108756140]

function addRoom(orderID, orderType, phone, roomNum, cancelMoney, roomInfo, orderTime, checkin, checkout, money, customer, roomID, status) {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({ orderID, orderType, phone, roomNum, cancelMoney, roomInfo, orderTime, checkin, checkout, money, customer, roomID, status });
  console.log(raw)
  const requestOptions = {
    method: "POST", headers: myHeaders, body: raw, redirect: "follow"
  };

  fetch("https://1256763111-f2tvymu35g.ap-beijing.tencentscf.com/addRoom", requestOptions)
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.error(error));
}

function timestampInSeconds(dateStr) {
  return Math.floor(new Date(dateStr).getTime() / 1000);
}

function getOrder(propertyId, startDate, endDate) {
  fetch("https://api.expediapartnercentral.com/supply/experience/gateway/graphql", {
    "headers": {
      "accept": "*/*", "accept-language": "zh-CN", "client-name": "pc-reservations-web", "content-type": "application/json",
    }, "referrer": "https://apps.expediapartnercentral.com/", "referrerPolicy": "strict-origin-when-cross-origin", "body": JSON.stringify({
      "query": `query getReservationsBySearchCriteria {reservationSearchV2(input: {propertyId: ${propertyId}, booked: true, externalBookingItemId: null, canceled: true, confirmationNumber: null, confirmed: true, startDate: "${startDate}", endDate: "${endDate}", dateType: "checkIn", evc: false, expediaCollect: true, timezoneOffset: "+07:00", firstName: null, hotelCollect: true, isSpecialRequest: false, isVIPBooking: false, lastName: null, reconciled: false, readyToReconcile: false, returnBookingItemIDsOnly: false, searchParam: null, unconfirmed: true searchForCancelWaiversOnly: false }) { reservationItems{ reservationItemId reservationInfo {reservationTpid propertyId startDate endDate createDateTime brandDisplayName newReservationItemId country reservationAttributes {businessModel bookingStatus fraudCancelled fraudReleased stayStatus eligibleForECNoShowAndCancel strongCustomerAuthentication invoiced eligibleForCancelPolicyException supplierOperatingModel} specialRequestDetails accessibilityRequestDetails product {productTypeId unitName bedTypeName propertyVipStatus} customerArrivalTime {arrival}readyToReconcile epsBooking } customer {id guestName phoneNumber email emailAlias country} loyaltyInfo {loyaltyStatus vipAmenities} confirmationInfo {productConfirmationCode} conversationsInfo {conversationsSupported id unreadMessageCount conversationStatus cpcePartnerId}totalAmounts {totalAmountForPartners {value currencyCode}totalCommissionAmount {value currencyCode}totalReservationAmount {value currencyCode}propertyBookingTotal {value currencyCode}totalReservationAmountInPartnerCurrency {value currencyCode}}reservationActions {requestToCancel {reason actionSupported actionUnsupportedBehavior {hide disable}}changeStayDates {reason actionSupported}requestRelocation {reason actionSupported}actionAttributes {highFence}reconciliationActions {markAsNoShow {reason actionSupported actionUnsupportedBehavior {hide disable openVa}virtualAgentParameters {intentName taxonomyId}}undoMarkNoShow {reason actionSupported actionUnsupportedBehavior {hide disable}}changeCancellationFee {reason actionSupported actionUnsupportedBehavior {hide disable}}resetCancellationFee {reason actionSupported actionUnsupportedBehavior {hide disable}}markAsCancellation {reason actionSupported actionUnsupportedBehavior {hide disable}}undoMarkAsCancellation {reason actionSupported actionUnsupportedBehavior {hide disable}}changeReservationAmountsOrDates {reason actionSupported actionUnsupportedBehavior {hide disable}}resetReservationAmountsOrDates {reason actionSupported actionUnsupportedBehavior {hide disable}}}}reconciliationInfo {reconciliationDateTime reconciliationType reconciliationStartDate reconciliationEndDate}depositInfo {depositText depositSchedules {depositDueDate dueAmountCurrencyCode dueAmountValue }}paymentInfo {evcCardDetailsExist expediaVirtualCardResourceId creditCardDetails { viewable viewCountLimit viewCountLeft viewCount hideCvvFromDisplay valid prevalidateCardOptIn cardValidationViewable inViewingWindow viewableWindow viewableOnDate viewableUntilDate validationInfo {validationStatus validationType validationDate validationBy hasGuestProvidedNewCC newCreditCardReceivedDate is24HoursFromLastValidation } }}billingInfo {invoiceNumber }cancellationInfo {cancelDateTime cancellationPolicy {priceCurrencyCode costCurrencyCode policyType cancellationPenalties {penaltyCost penaltyPrice penaltyPerStayFee penaltyTime penaltyInterval penaltyStartHour penaltyEndHour }nonrefundableDatesList}}compensationDetails {reservationWaiverType reservationFeeAmounts {propertyWaivedFeeLineItem {costCurrency costAmount }}}creditCardRecaptureDetails {validationStatus validationTime paymentPlanId recapturePending recaptureHoursPending} searchWaiverRequest {serviceRequestId type typeDetails state orderNumber partnerId createdDate srConversationId lastUpdatedDate notes {text author {firstName lastName }}}} numOfCancelWaivers}}`, "variables": {}
    }), "method": "POST", "mode": "cors", "credentials": "include"
  }).then((response) => response.json())
  .then((result) => {
    if (result.data.reservationSearchV2.reservationItems) {
      result.data.reservationSearchV2.reservationItems.forEach(element => {
        addRoom(element.reservationItemId, "expedia", element.customer.phoneNumber, 1, 0, element.reservationInfo.product.unitName, timestampInSeconds(element.reservationInfo.createDateTime), timestampInSeconds(element.reservationInfo.startDate), timestampInSeconds(element.reservationInfo.endDate), element.totalAmounts.propertyBookingTotal.value, element.customer.guestName, element.reservationInfo.propertyId, element.reservationInfo.reservationAttributes.bookingStatus)
      });
    } else {
      console.log(result.data)
    }
    
  })
  .catch((error) => console.error(error));
}

function getDateOneDayAgo(num) {
  const now = new Date();
  now.setDate(now.getDate() + num);

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0'); // 月份从0开始，需要+1
  const day = String(now.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function fetchRatePlans(userID, value) {
  // First fetch room types to get room details
  fetch(`https://apps.expediapartnercentral.com/lodging/prodcreation/api/roomTypes?htid=${value.ExpediaID}&epc_tab_id=b579cf63-7342-401a-9f35-94446bc2fc96`, {
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
    .then(roomTypeData => {
      console.log("Expedia room types response:", roomTypeData);

      // Create a map of room type IDs to room names for easy lookup
      const roomNameMap = {};
      if (roomTypeData.successful && roomTypeData.value && roomTypeData.value.length > 0) {
        roomTypeData.value.forEach(room => {
          roomNameMap[room.roomTypeID] = room.roomTypeName;
        });
      }

      // Now proceed with the original fetch for rate plans
      fetch(`https://apps.expediapartnercentral.com/lodging/prodcreation/api/ratePlans?htid=${value.ExpediaID}&epc_tab_id=86b51798-7ca6-445e-b0e1-e6e1ef59d3bc`, {
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
          console.log("Expedia rate plans response:", data);

          if (data.successful && data.value && data.value.length > 0) {
            // Extract needed data from the response
            const ratePlanIds = data.value.filter(plan => plan.activeStatus === "Active").map(plan => plan.ratePlanID);
            const roomTypeIds = [...new Set(data.value.filter(plan => plan.activeStatus === "Active").map(plan => plan.roomTypeID))];

            // Create roomTypeSummary from the data with proper room names from the first fetch
            const roomTypeSummary = roomTypeIds.map(roomTypeId => {
              const roomPlans = data.value.filter(plan => plan.roomTypeID === roomTypeId);
              const firstPlan = roomPlans[0];
              return {
                name: roomNameMap[roomTypeId] || firstPlan.roomTypeContentID, // Use the room name from first fetch if available
                roomTypeId: roomTypeId,
                roomTypeCode: "RoomCode",
                ratePlanIds: roomPlans.map(plan => plan.ratePlanID)
              };
            });

            // Create ratePlanBasicInfoMap with enhanced room names
            const ratePlanBasicInfoMap = {};
            data.value.forEach(plan => {
              if (plan.activeStatus === "Active") {
                ratePlanBasicInfoMap[plan.ratePlanID] = {
                  ratePlanName: plan.ratePlanName,
                  ratePlanCodes: [plan.expediaCollectNotificationCode],
                  ratePlanType: plan.ratePlanType,
                  pricingSubModel: "UNKNOWN",
                  associatedRoomTypeId: plan.roomTypeID,
                  associatedRoomTypeName: roomNameMap[plan.roomTypeID] || plan.roomTypeContentID, // Enhanced with actual room name
                  isOpaque: plan.isOpaque || false
                };
              }
            });

            // Determine which rate plans are of which type
            const standaloneRatePlanIds = data.value.filter(plan => plan.activeStatus === "Active" && plan.ratePlanType === "Standalone").map(plan => plan.ratePlanID);
            const packageRatePlanIds = data.value.filter(plan => plan.activeStatus === "Active" && plan.ratePlanType === "Package").map(plan => plan.ratePlanID);

            // Get the start date and number of days from the value object or use defaults
            const startDate = value.start || getDateOneDayAgo(1);
            const endDate = value.end || getDateOneDayAgo(31);
            const numberOfDays = getDateDiff(startDate, endDate);

            // Make the second request for rates and availability
            fetch(`https://apps.expediapartnercentral.com/lodging/roomsandrates/ratesAndAvailGetModel-React.json?htid=${value.ExpediaID}&isInitialLoad=true`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
              },
              credentials: "include",
              body: JSON.stringify({
                startDate: startDate,
                numberOfDays: numberOfDays,
                ratePlanIds: ratePlanIds,
                roomTypeIds: roomTypeIds,
                isFilterOutComplexRates: false,
                rateTiers: null,
                roomAndRatePlanSummaryModel: {
                  maxOccupancyForAllRoomTypeIds: Math.max(...data.value.map(plan => plan.baseOccupancy)),
                  roomTypeIds: roomTypeIds,
                  connectedRoomTypeIds: [],
                  nonConnectedRoomTypeIds: roomTypeIds,
                  lengthOfStayPricingRoomTypeIds: [],
                  dayOfArrivalPricingRoomTypeIds: [],
                  iCalConnectedRoomTypeIds: [],
                  ratePlanIds: ratePlanIds,
                  linkedChildRatePlanIds: ratePlanIds,
                  standaloneRatePlanIds: standaloneRatePlanIds,
                  packageRatePlanIds: packageRatePlanIds,
                  corporateRatePlanIds: [],
                  wholesaleRatePlanIds: [],
                  wholesalePackageRatePlanIds: [],
                  opaqueRatePlanIds: [],
                  roomTypeSummary: roomTypeSummary,
                  unknownPricingRoomTypeIds: roomTypeIds,
                  hasConnectedRoomTypeIds: false,
                  hasNonConnectedRoomTypeIds: true,
                  hasLengthOfStayPricingSubModels: false,
                  hasDayOfArrivalPricingSubModels: false,
                  hasStandaloneRatePlanIds: standaloneRatePlanIds.length > 0,
                  hasPackageRatePlanIds: packageRatePlanIds.length > 0,
                  hasCorporateRatePlanIds: false,
                  hasWholesaleRatePlanIds: false,
                  hasWholesalePackageRatePlanIds: false,
                  hasOpaqueRatePlanIds: false,
                  hasUnknownPricingSubModels: true
                },
                ratePlanBasicInfoMap: ratePlanBasicInfoMap,
                currencyCode: "VND",
                rateUIPreferences: {
                  selectedLOS: 1,
                  selectedOBP: 1,
                  isShowAllOBPLevelsEnabled: false
                }
              })
            })
              .then(response => response.json())
              .then(ratesData => {
                console.log("Rates & Availability:", ratesData);
                if (userID) {
                  owoSocket.send("ratesAndAvailabilityExpedia", ratesData, userID);
                }
              })
              .catch(error => {
                console.error("Rates fetch error:", error);
              });
          }

          if (userID) {
            // owoSocket.send("ratePlansExpedia", data, userID);
          }
        })
        .catch(error => {
          console.error("Rate plans fetch error:", error);
        });
    })
    .catch(error => {
      console.error("Room types fetch error:", error);

      // Fallback to original logic if room types fetch fails
      fetch(`https://apps.expediapartnercentral.com/lodging/prodcreation/api/ratePlans?htid=${value.ExpediaID}&epc_tab_id=86b51798-7ca6-445e-b0e1-e6e1ef59d3bc`, {
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
      console.log("Expedia rate plans response:", data);
      
      if (data.successful && data.value && data.value.length > 0) {
        // Extract needed data from the response
        const ratePlanIds = data.value.filter(plan => plan.activeStatus === "Active").map(plan => plan.ratePlanID);
        const roomTypeIds = [...new Set(data.value.filter(plan => plan.activeStatus === "Active").map(plan => plan.roomTypeID))];
        
        // Create roomTypeSummary from the data
        const roomTypeSummary = roomTypeIds.map(roomTypeId => {
          const roomPlans = data.value.filter(plan => plan.roomTypeID === roomTypeId);
          const firstPlan = roomPlans[0];
          return {
            name: firstPlan.roomTypeContentID,
            roomTypeId: roomTypeId,
            roomTypeCode: "RoomCode",
            ratePlanIds: roomPlans.map(plan => plan.ratePlanID)
          };
        });
        
        // Create ratePlanBasicInfoMap
        const ratePlanBasicInfoMap = {};
        data.value.forEach(plan => {
          if (plan.activeStatus === "Active") {
            ratePlanBasicInfoMap[plan.ratePlanID] = {
              ratePlanName: plan.ratePlanName,
              ratePlanCodes: [plan.expediaCollectNotificationCode],
              ratePlanType: plan.ratePlanType,
              pricingSubModel: "UNKNOWN",
              associatedRoomTypeId: plan.roomTypeID,
              associatedRoomTypeName: plan.roomTypeContentID,
              isOpaque: plan.isOpaque || false
            };
          }
        });
        
        // Determine which rate plans are of which type
        const standaloneRatePlanIds = data.value.filter(plan => plan.activeStatus === "Active" && plan.ratePlanType === "Standalone").map(plan => plan.ratePlanID);
        const packageRatePlanIds = data.value.filter(plan => plan.activeStatus === "Active" && plan.ratePlanType === "Package").map(plan => plan.ratePlanID);
        
        // Get the start date and number of days from the value object or use defaults
        const startDate = value.start || getDateOneDayAgo(1);
        const endDate = value.end || getDateOneDayAgo(31);
        const numberOfDays = getDateDiff(startDate, endDate);
        
        // Make the second request for rates and availability
        fetch(`https://apps.expediapartnercentral.com/lodging/roomsandrates/ratesAndAvailGetModel-React.json?htid=${value.ExpediaID}&isInitialLoad=true`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          credentials: "include",
          body: JSON.stringify({
            startDate: startDate,
            numberOfDays: numberOfDays,
            ratePlanIds: ratePlanIds,
            roomTypeIds: roomTypeIds,
            isFilterOutComplexRates: false,
            rateTiers: null,
            roomAndRatePlanSummaryModel: {
              maxOccupancyForAllRoomTypeIds: Math.max(...data.value.map(plan => plan.baseOccupancy)),
              roomTypeIds: roomTypeIds,
              connectedRoomTypeIds: [],
              nonConnectedRoomTypeIds: roomTypeIds,
              lengthOfStayPricingRoomTypeIds: [],
              dayOfArrivalPricingRoomTypeIds: [],
              iCalConnectedRoomTypeIds: [],
              ratePlanIds: ratePlanIds,
              linkedChildRatePlanIds: ratePlanIds,
              standaloneRatePlanIds: standaloneRatePlanIds,
              packageRatePlanIds: packageRatePlanIds,
              corporateRatePlanIds: [],
              wholesaleRatePlanIds: [],
              wholesalePackageRatePlanIds: [],
              opaqueRatePlanIds: [],
              roomTypeSummary: roomTypeSummary,
              unknownPricingRoomTypeIds: roomTypeIds,
              hasConnectedRoomTypeIds: false,
              hasNonConnectedRoomTypeIds: true,
              hasLengthOfStayPricingSubModels: false,
              hasDayOfArrivalPricingSubModels: false,
              hasStandaloneRatePlanIds: standaloneRatePlanIds.length > 0,
              hasPackageRatePlanIds: packageRatePlanIds.length > 0,
              hasCorporateRatePlanIds: false,
              hasWholesaleRatePlanIds: false,
              hasWholesalePackageRatePlanIds: false,
              hasOpaqueRatePlanIds: false,
              hasUnknownPricingSubModels: true
            },
            ratePlanBasicInfoMap: ratePlanBasicInfoMap,
            currencyCode: "VND",
            rateUIPreferences: {
              selectedLOS: 1,
              selectedOBP: 1,
              isShowAllOBPLevelsEnabled: false
            }
          })
        })
        .then(response => response.json())
        .then(ratesData => {
          console.log("Rates & Availability:", ratesData);
          if (userID) {
            owoSocket.send("ratesAndAvailabilityExpedia", ratesData, userID);
          }
        })
        .catch(error => {
          console.error("Rates fetch error:", error);
        });
      }
      
      if (userID) {
            // owoSocket.send("ratePlansExpedia", data, userID);
      }
    })
    .catch(error => {
      console.error("Fetch error:", error);
        });
    });
}

// 每隔20分钟自动获取所有订单
setInterval(() => {
  console.log('开始获取新数据!')
  for (let index = 0; index < roomList.length; index++) {
    const element = roomList[index];
    setTimeout(() => {
      getOrder(element, getDateOneDayAgo(-5), getDateOneDayAgo(90))
    }, 3000 * index);
  }
}, 20 * 60 * 1000);

// New function to update both room inventory and rates at the same time
function updateExpediaRoomAndRate(userID, config) {
  console.log("Updating Expedia room and rate with config:", config);
  
  // First update room inventory
  fetch(`https://apps.expediapartnercentral.com/lodging/roomsandrates/properties/${config.ExpediaID}/room-types/inventories?htid=${config.ExpediaID}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "credentials": "include"
    },
    credentials: "include",
    body: JSON.stringify({
      startDate: config.startDate,
      endDate: config.endDate,
      blackoutDates: [],
      availability: [
        {
          availability: config.roomNum.toString(),
          roomTypeId: parseInt(config.roomID), // Use the actual roomID from the inventory.json (e.g., 325697395)
          roomTypeName: config.roomTypeName
        }
      ]
    })
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`Inventory update HTTP error! Status: ${response.status}`);
    }
    return response.json();
  })
  .then(inventoryData => {
    console.log("Inventory update successful:", inventoryData);
    
    // After successful inventory update, update the rate
    return fetch(`https://apps.expediapartnercentral.com/lodging/roomsandrates/properties/${config.ExpediaID}/room-types/rates-and-restrictions?htid=${config.ExpediaID}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "credentials": "include"
      },
      credentials: "include",
      body: JSON.stringify({
        startDate: config.startDate,
        endDate: config.endDate,
        blackoutDates: [],
        ratePlanIds: [parseInt(config.ratePlanID)],
        roomTypeRatePlanNameDetails: [
          {
            roomTypeName: config.roomTypeName,
            roomTypeId: parseInt(config.roomID), // Use the actual roomID from the inventory.json (e.g., 325697395)
            ratePlanName: config.ratePlanName,
            ratePlanCode: null,
            ratePlanId: parseInt(config.ratePlanID)
          }
        ],
        ratesAndRestrictionsDetails: [
          {
            rates: [
              {
                amount: config.price.toString()
              }
            ],
            daysOfWeek: []
          }
        ]
      })
    });
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`Rate update HTTP error! Status: ${response.status}`);
    }
    return response.json();
  })
  .then(rateData => {
    console.log("Rate update successful:", rateData);
    if (userID) {
      owoSocket.send("updatePriceCallBack", { isSuccess: true, message: "Cập nhật số lượng phòng và giá thành công!" }, userID);
    }
  })
  .catch(error => {
    console.error("Update error:", error);
    if (userID) {
      owoSocket.send("updatePriceCallBack", { isSuccess: false, message: `Lỗi cập nhật: ${error.message}` }, userID);
    }
  });
}


