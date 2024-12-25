import request from '@/utils/req'

const RequestURL = "/wipCrystalGrowthOut";

export function addMockStep(data) {
  return request({
    url: RequestURL + "/addMockStep",
    method: "post",
    data,
  });
}
