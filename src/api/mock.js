import request from '@/utils/requestMock'

export const getData = () => {
  return request.get('/data')
}
