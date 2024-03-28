const getters = {
  token: state => state.user.token,
  realName: state => state.user.realName,
  userId: state => state.user.id,
  NowServerDate: state => state.window.NowServerDate,
}
export default getters
