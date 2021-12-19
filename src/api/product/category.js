import request from '@/utils/request'
/**
 * /admin/product/getCategory1
getCategory1

GET /admin/product/getCategory2/{category1Id}
getCategory2

GET /admin/product/getCategory3/{category2Id}
getCategory3
 */
export default {
  getCategory1() {
    return request.get('/admin/product/getCategory1')
  },
  getCategory2(category1Id) {
    return request.get(`/admin/product/getCategory2/${category1Id}`)
  },
  getCategory3(category2Id) {
    return request.get(`/admin/product/getCategory3/${category2Id}`)
  }
}
