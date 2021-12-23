// /admin/product/baseTrademark/remove/{id}
// 删除BaseTrademark

// POST /admin/product/baseTrademark/save
// 新增BaseTrademark

// PUT /admin/product/baseTrademark/update
// 修改BaseTrademark

// GET
import request from '@/utils/request'
export default {
  // 删除BaseTrademark
  remove(id) {
    return request.delete(`/admin/product/baseTrademark/remove/${id}`)
  },

  // 添加和修改都需要传一个新的品牌对象,id不用填
  addOrUpdate(trademark) {
    if (trademark.id) {
      return request.put('/admin/product/baseTrademark/update', trademark)
    } else {
      return request.post('/admin/product/baseTrademark/save', trademark)
    }
  },

  // 获取当前页的数据
  getPageList(page, limit) {
    return request.get(`/admin/product/baseTrademark/${page}/${limit}`)
  },

  // 获取所有品牌数据
  getList() {
    return request.get('/admin/product/baseTrademark/getTrademarkList')
  }
}
