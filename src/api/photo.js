/* eslint-disable */
import {getToken} from '@/utils/auth'
import { showLoading, closeLoading } from '@/utils/showOrHideLoading'
export function upload(imageURI) {
  var uploadUrl = process.env.BASE_API_FILEHOST + '/file/uploadImage'
  return new Promise((resolve, reject) => {
    var ft = new FileTransfer()
    showLoading()
    ft.upload(imageURI, encodeURI(uploadUrl), function (r) {
      resolve( JSON.parse(r.response))
      closeLoading()
    }, function (err) {
      closeLoading()
      reject(err)
    }, {
      headers: {
        token: getToken()
      }
    })
  })
}
