import request from '@/utils/req'

// 在制品查询站点
export function getCurrentWipStorageData(processingOrderCode) {
  return Promise.resolve({
    "code": 200,
    "message": null,
    "data": [
      {
        "processUuid": "xgc2fjqdui",
        "isNeedsDevice": false,
        "deviceCode": null,
        "wipStorageCode": "ZJ",
        "wipStorageName": "长晶",
        "wipStorageStatus": 1,
        "operationType": 2,
        "operationData": "/growthOperate",
        "fromData": {
          "id": null,
          "userCreate": null,
          "gmtCreate": null,
          "userUpdate": null,
          "gmtUpdate": null,
          "steps": {
            "拆炉": [
              {
                "id": null,
                "userCreate": "qiukeren",
                "gmtCreate": null,
                "userUpdate": null,
                "gmtUpdate": null,
                "taskId": 356,
                "goodQty": 0,
                "totalQty": 0,
                "scrapQty": 0,
                "checks": [],
                "techs": [
                  {
                    "id": 8000,
                    "userCreate": "qiukeren",
                    "gmtCreate": "2024-04-16 16:40:08",
                    "userUpdate": "qiukeren",
                    "gmtUpdate": "2024-04-20 11:01:57",
                    "taskId": 356,
                    "extKey": "坩埚上圈编号（扫码）",
                    "extValue": "scan",
                    "processOrderCode": "D3716P00041",
                    "canEdit": true,
                    "isEapParameter": false
                  },
                  {
                    "id": 8001,
                    "userCreate": "qiukeren",
                    "gmtCreate": "2024-04-16 16:40:08",
                    "userUpdate": "qiukeren",
                    "gmtUpdate": "2024-04-20 11:01:57",
                    "taskId": 356,
                    "extKey": "坩埚上圈编号",
                    "extValue": "1111",
                    "processOrderCode": "D3716P00041",
                    "canEdit": true,
                    "isEapParameter": false
                  },
                  {
                    "id": 8002,
                    "userCreate": "qiukeren",
                    "gmtCreate": "2024-04-16 16:40:08",
                    "userUpdate": "qiukeren",
                    "gmtUpdate": "2024-04-20 11:01:57",
                    "taskId": 356,
                    "extKey": "坩埚上圈已使用寿命/额定寿命",
                    "extValue": "12/12",
                    "processOrderCode": "D3716P00041",
                    "canEdit": true,
                    "isEapParameter": false
                  }
                ],
                "errors": [
                  {
                    "id": 137,
                    "userCreate": null,
                    "gmtCreate": null,
                    "userUpdate": null,
                    "gmtUpdate": null,
                    "wipStorageId": 9921,
                    "processId": 202,
                    "processCode": "ZJ",
                    "processName": "长晶",
                    "processUuid": "xgc2fjqdui",
                    "processOrderCode": "D3716P00041",
                    "taskId": 356,
                    "errorMessage": "放肩失败"
                  }
                ],
                "exts": [],
                "files": null,
                "userOperate2": null,
                "transMap": {}
              }
            ],
            "留档文档": [
              {
                "id": null,
                "userCreate": "qiukeren",
                "gmtCreate": null,
                "userUpdate": null,
                "gmtUpdate": null,
                "taskId": 355,
                "goodQty": 0,
                "totalQty": 0,
                "scrapQty": 0,
                "checks": [],
                "techs": [],
                "errors": [],
                "exts": [],
                "files": [],
                "userOperate2": null,
                "transMap": {}
              }
            ]
          },
          "deviceCode": "D37",
          "wipStorageId": 9921,
          "processId": 202,
          "processCode": "ZJ",
          "processName": "长晶",
          "processUuid": "xgc2fjqdui",
          "processOrderCode": "D3716P00041",
          "totalQty": 2,
          "goodQty": 2,
          "scrapQty": null,
          "photo": null,
          "transMap": {}
        },
        "skipStatus": 0
      }
    ]
  })
  return request({
    url: '/wipStorage/getCurrentWipStorageData?processingOrderCode='+processingOrderCode,
    method: 'get'
  })
}
