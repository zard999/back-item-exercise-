import request from '@/utils/request'
/**
 * /admin/product/baseSaleAttrList
getBaseSaleAttrList 获取销售属性
 * /admin/product/getSpuById/{spuId}
获取spu基本信息
 * /admin/product/saveSpuInfo
saveSpuInfo

POST /admin/product/updateSpuInfo
更改spu信息

GET /admin/product/{page}/{limit}
index

/admin/product/deleteSpu/{spuId}
deleteSpu
 */
export default {
  // 获取销属性
  getSaleAttr() {
    return request.get('/admin/product/baseSaleAttrList')
  },

  // 获取spu基本信息
  getSpuInfo(spuId) {
    return request.get(`/admin/product/getSpuById/${spuId}`)
  },

  // 添加或修改spu
  addOrUpdate(spuInfo) {
    return request({
      url: `/admin/product/${spuInfo.id ? 'update' : 'save'}SpuInfo`,
      method: 'post',
      data: spuInfo
    })
  },

  // 删除
  remove(spuId) {
    return request.delete(`/admin/product/deleteSpu/${spuId}`)
  },

  // 获取分页列表
  getPageList(page, limit, category3Id) {
    return request({
      url: `/admin/product/${page}/${limit}`,
      method: 'get',
      params: { category3Id }
    })
  }
}
