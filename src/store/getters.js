const getters = {
  token: state => state.user.token,
  realName: state => state.user.realName,
  NowServerDate: state => state.window.NowServerDate,
}
export default getters
