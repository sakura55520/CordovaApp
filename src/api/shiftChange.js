import request from '@/utils/req'

const RequestURL = '/shiftChangeManage'

/*
* 查询
* */
export function fetchData(params) {
  return request({
    url: RequestURL + '/listByPage',
    method: 'get',
    params
  })
}

/*
* 查询详情
* */
export function fetchDetail(id) {
  return request({
    url: RequestURL + '/' + id,
    method: 'get',
  })
}

/**
 * 新增一条数据
 */
export function createData(data) {
  return request({
    url: RequestURL + '/create',
    method: 'post',
    data
  })
}

/**
 * 修改一条数据
 */
export function editData(data) {
  return request({
    url: RequestURL + '/update',
    method: 'post',
    data
  })
}

/**
 * 删除一条数据
 */
export function deleteData(params) {
  return request({
    url: RequestURL + '/delete',
    method: 'post',
    params
  })
}
