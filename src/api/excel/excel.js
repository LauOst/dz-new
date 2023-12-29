import request from '@/utils/request/request'

// 产品管理
export function downloadProduct(query) {
  return request({
    responseType: 'blob',
    headers: {
      'Accept': 'application/octet-stream'
    },
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/exp/product/manage',
    method: 'get',
    params: query
  })
}
// 产品检测
export function downloadProductText(query) {
  return request({
    responseType: 'blob',
    headers: {
      'Accept': 'application/octet-stream'
    },
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/exp/product/manage/detection',
    method: 'get',
    params: query
  })
}

// 刀具配置
export function downloadToolConfig(query) {
  return request({
    responseType: 'blob',
    headers: {
      'Accept': 'application/octet-stream'
    },
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/exp/tool/information/getToolConfigureList',
    method: 'get',
    params: query
  })
}

// 刀具信息
export function downloadToolMsg(query) {
  return request({
    responseType: 'blob',
    headers: {
      'Accept': 'application/octet-stream'
    },
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/exp/tool/information/tool/information/data',
    method: 'get',
    params: query
  })
}

// 刀具管理
export function downloadToolManage(query) {
  return request({
    responseType: 'blob',
    headers: {
      'Accept': 'application/octet-stream'
    },
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/exp/tool/information/tool/management',
    method: 'get',
    params: query
  })
}

// 机器人历史数据表
export function downloadRobotHca(query) {
  return request({
    responseType: 'blob',
    headers: {
      'Accept': 'application/octet-stream'
    },
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/exp/robot/historical/data',
    method: 'get',
    params: query
  })
}

// 机器人停机数据报表
export function downloadRobotShut(query) {
  return request({
    responseType: 'blob',
    headers: {
      'Accept': 'application/octet-stream'
    },
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/exp/robot/shutdown/data',
    method: 'get',
    params: query
  })
}

// 机床历史数据
export function downloadMachHca(query) {
  return request({
    responseType: 'blob',
    headers: {
      'Accept': 'application/octet-stream'
    },
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/exp/machine/tool/historical/data',
    method: 'get',
    params: query
  })
}

// 机床停机数据
export function downloadMachShut(query) {
  return request({
    responseType: 'blob',
    headers: {
      'Accept': 'application/octet-stream'
    },
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/exp/machine/tool/shutdown/data',
    method: 'get',
    params: query
  })
}

// 工位管理
export function downloadStation(query) {
  return request({
    responseType: 'blob',
    headers: {
      'Accept': 'application/octet-stream'
    },
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/exp/reportwork/station',
    method: 'get',
    params: query
  })
}

// 工序管理
export function downloadProcedure(query) {
  return request({
    responseType: 'blob',
    headers: {
      'Accept': 'application/octet-stream'
    },
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/exp/reportwork/working/procedure',
    method: 'get',
    params: query
  })
}

// 分页查询TCP指令列表
export function downloadTcp(query) {
  return request({
    responseType: 'blob',
    headers: {
      'Accept': 'application/octet-stream'
    },
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/reportwork/tcp',
    method: 'get',
    params: query
  })
}

// 分页查询TCP指令Item值列表导出
export function downloadTcpItem(query) {
  return request({
    responseType: 'blob',
    headers: {
      'Accept': 'application/octet-stream'
    },
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/reportwork/tcp/item',
    method: 'get',
    params: query
  })
}

// 角色列表
export function downloadRole(query) {
  return request({
    responseType: 'blob',
    headers: {
      'Accept': 'application/octet-stream'
    },
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/reportwork/role',
    method: 'get',
    params: query
  })
}

// 用户管理导出
export function downloadUser(query) {
  return request({
    responseType: 'blob',
    headers: {
      'Accept': 'application/octet-stream'
    },
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/reportwork/user',
    method: 'get',
    params: query
  })
}

// 分页查询字典类型导出
export function downloadDict(query) {
  return request({
    responseType: 'blob',
    headers: {
      'Accept': 'application/octet-stream'
    },
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/reportwork',
    method: 'get',
    params: query
  })
}

// 站点列表导出
export function downloadDepart(query) {
  return request({
    responseType: 'blob',
    headers: {
      'Accept': 'application/octet-stream'
    },
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/reportwork/depart',
    method: 'get',
    params: query
  })
}

// 设备列表
export function downloadEquipment(query) {
  return request({
    responseType: 'blob',
    headers: {
      'Accept': 'application/octet-stream'
    },
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/equipment/reportwork',
    method: 'get',
    params: query
  })
}

// 生产计划设置
export function downloadPlanDly(query) {
  return request({
    responseType: 'blob',
    headers: {
      'Accept': 'application/octet-stream'
    },
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/line/pan/excel/dayPlan',
    method: 'get',
    params: query
  })
}

// 生产计划记录
export function downloadPlanHca(query) {
  return request({
    responseType: 'blob',
    headers: {
      'Accept': 'application/octet-stream'
    },
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/line/pan/excel/dayPlanData',
    method: 'get',
    params: query
  })
}

// 设备明细
export function downloadEquipmentDetails(query) {
  return request({
    responseType: 'blob',
    headers: {
      'Accept': 'application/octet-stream'
    },
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    // url: '/line/pan/excel/equipment/data/details',
    url: '/api/excel/equipment/data/download',
    method: 'get',
    params: query
  })
}

// 产品明细
export function downloadProductDetails(query) {
  return request({
    responseType: 'blob',
    headers: {
      'Accept': 'application/octet-stream'
    },
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/line/pan/excel/product/data/details',
    method: 'get',
    params: query
  })
}

// 运行日志
export function downloadFunc(query) {
  return request({
    responseType: 'blob',
    headers: {
      'Accept': 'application/octet-stream'
    },
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/log/reportwork',
    method: 'get',
    params: query
  })
}

// 通信日志
export function downloadCommunication(query) {
  return request({
    responseType: 'blob',
    headers: {
      'Accept': 'application/octet-stream'
    },
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/excel/log/communication/download',
    method: 'get',
    params: query
  })
}

// 指令日志
export function downloadCommunicationTcp(query) {
  return request({
    responseType: 'blob',
    headers: {
      'Accept': 'application/octet-stream'
    },
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/log/reportwork/communication/tcp/log',
    method: 'get',
    params: query
  })
}

// 操作日志
export function downloadOperation(query) {
  return request({
    responseType: 'blob',
    headers: {
      'Accept': 'application/octet-stream'
    },
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/log/reportwork/log',
    method: 'get',
    params: query
  })
}

// 登录日志
export function downloadLogin(query) {
  return request({
    responseType: 'blob',
    headers: {
      'Accept': 'application/octet-stream'
    },
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/log/reportwork/log/login',
    method: 'get',
    params: query
  })
}

// 订单管理
export function downloadOrder(query) {
  return request({
    responseType: 'blob',
    headers: {
      'Accept': 'application/octet-stream'
    },
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/exp/order',
    method: 'get',
    params: query
  })
}

// 产线管理
export function downloadLine(query) {
  return request({
    responseType: 'blob',
    headers: {
      'Accept': 'application/octet-stream'
    },
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/line/excel',
    method: 'get',
    params: query
  })
}

// 导出生产报工
export function downloadReportWork(query) {
  return request({
    responseType: 'blob',
    headers: {
      'Accept': 'application/octet-stream'
    },
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/exp/reportwork/upWork',
    method: 'get',
    params: query
  })
}
// 导出三一设备管理
export function downloaddzDataDevice(query) {
  return request({
    responseType: 'blob',
    headers: {
      'Accept': 'application/octet-stream'
    },
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/collection/dzDataDevice/excel',
    method: 'get',
    params: query
  })
}

// 导出小车投料管理
export function downloadAgvFeed(query) {
  return request({
    responseType: 'blob',
    headers: {
      'Accept': 'application/octet-stream'
    },
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/Mom/Agv/excelWork',
    method: 'get',
    params: query
  })
}

// 导出小车投料管理
export function downloadInspection(query) {
  return request({
    responseType: 'blob',
    headers: {
      'Accept': 'application/octet-stream'
    },
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/equipment/reportwork/inspectionRecord',
    method: 'get',
    params: query
  })
}

// 导出设备故障台账
export function downloadFault(query) {
  return request({
    responseType: 'blob',
    headers: {
      'Accept': 'application/octet-stream'
    },
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/equipment/reportwork/fault',
    method: 'get',
    params: query
  })
}

// 导出设备保养记录
export function downloadMaintain(query) {
  return request({
    responseType: 'blob',
    headers: {
      'Accept': 'application/octet-stream'
    },
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/equipment/reportwork/maintain',
    method: 'get',
    params: query
  })
}

// 导出OP10&Op20
export function downloadRraceRough(data) {
  return request({
    responseType: 'blob',
    headers: {
      'Accept': 'application/octet-stream'
    },
    url: '/traceRough/export',
    requestBaseUrl: 'TRACE',
    method: 'post',
    data: data
  })
}

// 导出OP30&Op40
export function downloadTraceMill(data) {
  return request({
    responseType: 'blob',
    headers: {
      'Accept': 'application/octet-stream'
    },
    url: '/traceMill/export',
    requestBaseUrl: 'TRACE',
    method: 'post',
    data: data
  })
}

// 导出OP50
export function downloadFineFirst(data) {
  return request({
    responseType: 'blob',
    headers: {
      'Accept': 'application/octet-stream'
    },
    url: '/traceFineFirst/export',
    requestBaseUrl: 'TRACE',
    method: 'post',
    data: data
  })
}

// 导出OP60
export function downloadFineSecond(data) {
  return request({
    responseType: 'blob',
    headers: {
      'Accept': 'application/octet-stream'
    },
    url: '/traceFineSecond/export',
    requestBaseUrl: 'TRACE',
    method: 'post',
    data: data
  })
}

// 导出OP70
export function downloadPcd(data) {
  return request({
    responseType: 'blob',
    headers: {
      'Accept': 'application/octet-stream'
    },
    url: '/tracePcd/export',
    requestBaseUrl: 'TRACE',
    method: 'post',
    data: data
  })
}

// 告警日志
export function downloadAlarm(query) {
  return request({
    responseType: 'blob',
    headers: {
      'Accept': 'application/octet-stream'
    },
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/excel/equipments/warn/log/download',
    method: 'get',
    params: query
  })
}

// 其他日志
export function downloadOther(query) {
  return request({
    responseType: 'blob',
    headers: {
      'Accept': 'application/octet-stream'
    },
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/dzics/inside/log/inside/log/download',
    requestBaseUrl: 'MOM',
    method: 'get',
    params: query
  })
}

// DNC
export function downloadDnc(query) {
  return request({
    responseType: 'blob',
    headers: {
      'Accept': 'application/octet-stream'
    },
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/mom/log/DNC/log/download',
    requestBaseUrl: 'MOM',
    method: 'get',
    params: query
  })
}

// 导出OP70
export function downloadPointCode(data) {
  return request({
    responseType: 'blob',
    headers: {
      'Accept': 'application/octet-stream'
    },
    url: '/traceLoad/export',
    requestBaseUrl: 'TRACE',
    method: 'post',
    data: data
  })
}

// 导出追溯
export function downloadTraceProduct(data) {
  return request({
    responseType: 'blob',
    headers: {
      'Accept': 'application/octet-stream'
    },
    url: '/api/trace/workingFlow/export',
    method: 'post',
    data: data
  })
}

// 导出设备产量明细

export function downloadEeuipmentProNumDetails(data) {
  return request({
    responseType: 'blob',
    headers: {
      'Accept': 'application/octet-stream'
    },
    url: '/output/equipmentProNumDetails/export',
    method: 'post',
    data: data
  })
}

// 导出工位追溯
export function downloadStationTraceability(data) {
  return request({
    responseType: 'blob',
    headers: {
      'Accept': 'application/octet-stream'
    },
    url: '/StationTraceability/export',
    requestBaseUrl: 'JINGJI',
    method: 'post',
    data: data
  })
}

// 来料记录
export function downloadIncomingRecord(query) {
  return request({
    responseType: 'blob',
    headers: {
      'Accept': 'application/octet-stream'
    },
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/excel/dzIncomingRecord',
    requestBaseUrl: 'SHANTIAN',
    method: 'get',
    params: query
  })
}

// 出入库记录
export function downloadEntryAndExitRecord(query) {
  return request({
    responseType: 'blob',
    headers: {
      'Accept': 'application/octet-stream'
    },
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/excel/Access/record',
    requestBaseUrl: 'SHANTIAN',
    method: 'get',
    params: query
  })
}

// 装箱记录
export function downloadPackingRecord(query) {
  return request({
    responseType: 'blob',
    headers: {
      'Accept': 'application/octet-stream'
    },
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/excel/packing',
    requestBaseUrl: 'SHANTIAN',
    method: 'get',
    params: query
  })
}

// 装箱二维码
export function downloadPackingQrCode(query) {
  return request({
    responseType: 'blob',
    headers: {
      'Accept': 'application/octet-stream'
    },
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/excel/getScanCode/XT',
    requestBaseUrl: 'SHANTIAN',
    method: 'get',
    params: query
  })
}

// 泡沫板二维码
export function downloadfoamBoardQrCode(query) {
  return request({
    responseType: 'blob',
    headers: {
      'Accept': 'application/octet-stream'
    },
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/excel/getScanCode/PMB',
    requestBaseUrl: 'SHANTIAN',
    method: 'get',
    params: query
  })
}

// 工件追溯
export function downloadWorkpieceTraceability(query) {
  return request({
    responseType: 'blob',
    headers: {
      'Accept': 'application/octet-stream'
    },
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/excel/retrospect',
    requestBaseUrl: 'SHANTIAN',
    method: 'get',
    params: query
  })
}

// 博大导出清洗机故障列表
export function downloadCleaningMachine(data) {
  return request({
    responseType: 'blob',
    headers: {
      'Accept': 'application/octet-stream'
    },
    url: '/CleaningMachineFailureRate/export',
    requestBaseUrl: 'BODA',
    method: 'post',
    data: data
  })
}

// 精技导出总成追溯
export function downloadStationTrace(data) {
  return request({
    responseType: 'blob',
    headers: {
      'Accept': 'application/octet-stream'
    },
    url: '/StationTraceability/export',
    requestBaseUrl: 'JINGJI',
    method: 'post',
    data: data
  })
}

// 华培导出检测记录
export function downloadfoamhuapeiDete(query) {
  return request({
    responseType: 'blob',
    headers: {
      'Accept': 'application/octet-stream'
    },
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/pieceData/excel',
    requestBaseUrl: 'HUAPEI',
    method: 'get',
    params: query
  })
}

// 设备状态日志
export function downloadEquipmentOperationLog(data) {
  return request({
    responseType: 'blob',
    headers: {
      'Accept': 'application/octet-stream'
    },
    url: '/TimeAnalysis/export',
    // requestBaseUrl: 'PERSON',
    method: 'post',
    data: data
  })
}

// 刀具管理
export function downloadMarkRecord(query) {
  return request({
    responseType: 'blob',
    headers: {
      'Accept': 'application/octet-stream'
    },
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/excel/packing',
    requestBaseUrl: 'HL',
    method: 'get',
    params: query
  })
}
