const getters = {
  token: state => state.user.token,
  realName: state => state.user.realName,
  userId: state => state.user.id,
  NowServerDate: state => state.window.NowServerDate,
  fromPC: state => state.window.fromPC,
}
export default getters
