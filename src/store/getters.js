const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token, // token信息
  sub: state => state.user.sub, // 账号
  avatar: state => state.user.avatar, // 头像
  name: state => state.user.name, // 名称
  roles: state => state.user.roles, // 权限
  sysConfig: state => state.user.sysConfig, // 公司
  useOrgCode: state => state.user.useOrgCode, // 公司
  sidebarRouters: state => state.permission.sidebarRouters, // 侧边栏
  permissions: state => state.user.permissions, // 权限
  userIdentity: state => state.user.userIdentity, // 用户身份
  departName: state => state.user.departName, // 用户所属站点
  departId: state => state.user.departId, // 用户所属站点
  affiliationDepartId: state => state.user.affiliationDepartId, // 用户所属站点
  imgUploadAction: state => state.user.imgUploadAction, // 用户所属站点
  orderList: state => state.public.orderList, // 用户所属站
  startTimes: state => state.public.startTimes, // 开始时间
  endTimes: state => state.public.endTimes, // 结束时间
  permission_routes: state => state.permission.routes,
  totalList: state => state.navbar.totalList
}
export default getters
