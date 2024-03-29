import req from '@/utils/req'

export function fetchModelForm(params) {
  return req({
    url: 'ModelForm/listAll',
    method: 'get',
    params
  })
}
