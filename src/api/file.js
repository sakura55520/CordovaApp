import req from '@/utils/req'

export function uploadImage(data) {
  return req({
    url: '/file/uploadImage',
    method: 'post',
    data
  })
}
