import request from '@/utils/request'

/**
 * /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}
attrInfoList

DELETE /admin/product/deleteAttr/{attrId}
deleteAttr

GET /admin/product/getAttrValueList/{attrId}
getAttrValueList

POST /admin/product/saveAttrInfo
 */
export default {
  // 获取属性
  getList(category1Id, category2Id, category3Id) {
    return request.get(
      `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`
    )
  },

  // 添加或修改属性
  arrOrUpdate(attr) {
    return request.post('/admin/product/saveAttrInfo', attr)
  },

  // 删除属性
  remove(attrId) {
    return request.delete(`/admin/product/deleteAttr/${attrId}`)
  }
}
