export const getWorklist = () => {
  return {
    roughList: [
      { label: 'OP10机床编号', value: 'cncNo10' },
      { label: 'OP10开始加工时间', value: 'startTime10' },
      { label: 'OP10加工时长', value: 'processTime10' },
      { label: 'OP10左加工程序号', value: 'programCode10L' },
      { label: 'OP10右加工程序号', value: 'programCode10R' },
      { label: 'OP20开始加工时间', value: 'startTime20' },
      { label: 'OP20加工时长', value: 'processTime20' },
      { label: 'OP20左加工程序号', value: 'programCode20L' },
      { label: 'OP20右加工程序号', value: 'programCode20R' },
      { label: '中心孔直径检测数据', value: 'centreHole' },
      { label: '合格情况', value: 'qualified' },
      { label: '产线负责人', value: 'director' },
      { label: '产品型号和规则', value: 'productCode' }
    ],
    millList: [
      { label: 'OP30机床编号', value: 'cncNo30' },
      { label: 'OP30开始加工时间', value: 'startTime30' },
      { label: 'OP30加工时长', value: 'processTime30' },
      { label: 'OP30加工程序号', value: 'programCode30' },
      { label: 'OP40开始加工时间', value: 'startTime40' },
      { label: 'OP40加工时长', value: 'processTime40' },
      { label: 'OP40加工程序号', value: 'programCode40' },
      // { label: '中心孔直径检测数据', value: 'centreHole' },
      { label: '产线负责人', value: 'director' },
      { label: '产品型号和规则', value: 'productCode' }
    ],
    fineFirstList: [
      { label: 'OP50机床编号', value: 'cncNo' },
      { label: 'OP50开始加工时间', value: 'startTime' },
      { label: 'OP50加工时长', value: 'processTime' },
      { label: 'OP50加工程序号', value: 'programCode' },
      { label: '中心孔直径检测数据', value: 'centreHole' },
      { label: '产线负责人', value: 'director' },
      { label: '产品型号和规则', value: 'productCode' }
    ],
    fineSecondList: [
      { label: 'OP60机床编号', value: 'cncNo' },
      { label: 'OP60开始加工时间', value: 'startTime' },
      { label: 'OP60加工时长', value: 'processTime' },
      { label: 'OP60加工程序号', value: 'programCode' },
      // { label: '中心孔直径检测数据', value: 'centreHole' },
      { label: '产线负责人', value: 'director' },
      { label: '产品型号和规则', value: 'productCode' }
    ],
    pcdList: [
      { label: 'OP70机床编号', value: 'cncNo' },
      { label: 'OP70开始加工时间', value: 'startTime' },
      { label: 'OP70加工时长', value: 'processTime' },
      { label: 'OP70加工程序号', value: 'programCode' },
      // { label: '中心孔直径检测数据', value: 'centreHole' },
      { label: '产线负责人', value: 'director' },
      { label: '产品型号和规则', value: 'productCode' }
    ]
  }
}
