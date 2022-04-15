import request from "@/utils/request"
const VEHICLE_BRAND_URL = "/pcp/basedata/api/v1/vehiclebatteryinfo"
export function queryVehicleBrand (params) {
  return request({
    url: VEHICLE_BRAND_URL + "/queryvehiclebrand",
    method: "get",
    params
  })
}