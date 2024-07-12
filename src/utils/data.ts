export interface ApiInfo {
  id: number;
  path: string;
  method: string;
  group: string;
  remarks: string;
}

export interface DeptInfo {
  id: number;
  parent_id?: number;
  status: string;
  name: string;
  order?: number;
  hasChildren?: boolean;
  children?: DeptInfo[];
}

export interface RoleInfo {
  id: number;
  name: string;
  remark: string;
  status: string;
}

export interface UserInfo {
  id: number;
  avatar: string;
  email: string;
  mobile: string;
  nick_name: string;
  role_id: number;
  role_name: string;
  password: string;
  checkPass?: string;
  salt: string;
  status: string;
  user_name: string;
}

export interface MenuInfo {
  id: number;
  icon: string;
  name: string;
  parent_id: number;
  sort: number;
  type: number;
  url: string;
}

export interface FileRoleInfo {
  id: number;
  name: string;
  parent_id: number;
}
export interface LoginInfo {
  id: number;
  ip: string;
  status: string;
  time: number;
  user_id: number;
  user_name: string;
}

export interface DictionaryInfo {
  acronym: string;
  code: string;
  encode: string;
  id: number;
  name: string;
  short_code: string;
  short_name: string;
  type_code: string;
}

export interface SystemInfo {
  group: string;
  id: number;
  key: string;
  name: string;
  remarks: string;
  sort: number;
  status: string;
  type: string;
  value: string;
}

export interface VehicleInfo {
  id: number;
  plate: string;
  brand: string;
  no: string;
  status: string;
  remarks: string;
}

export interface SensorInfo {
  name: string;
  position: string;
  no: string;
  type: string;
  model: string;
  remarks: string;
}

export interface AnnotationTask {
  source_id: number;
  album_id: number;
  handler: number;
  type?: [];
  status: string;
  remarks: string;
}

export interface CollectTask {
  parent_id: number;
  name: string;
  remarks: string;
  car_plate: string;
  place: string;
  handler: number;
  start_time: string;
  end_time: string;
  start_mile: string;
  end_mile: string;
  status: string;
}

export interface PhotoAlbum {
  creator: number;
  id: number;
  name: string;
  parent_id: number;
  remarks: string;
  type: string;
  bOn?: boolean;
}

export interface VideoData {
  car_plate: string;
  create_at?: string;
  end_time: number;
  id: number;
  start_time: number;
  thumbnail: string;
  update_at?: string;
}

export interface ImageData {
  create_at?: string;
  id: number;
  save_time: number;
  thumbnail: string;
  timestamp: number;
  update_at?: string;
}

export interface TagData {
  id: number;
  type: string;
  name: string;
}

export interface CollectInfo {
  car: string; //车型
  vin: string; //车辆VIN
  date: string; //日期
  location: string; //地点
  platform: string; //平台
  use: string; //用途
  function: string; //功能
  software: string; //采集软件
}

export interface SelfTag {
  id: number;
  data: string;
}

export interface TagInfo {
  tags: []; // 场景标签
  custom_tag: []; //自定义标签
  self_tag?: SelfTag[]; //私有标签
  data_tag?: []; //数据标签
  event_tag: []; //事件标签
}

export interface AnnotationResult {
  type: string; //类型
  amount: number; //数量
}

export interface DataSetInfo {
  sources?: string; //导入源
  targets?: string; //导入地址
  info: CollectInfo; //采集信息
  label: TagInfo; //标签
}

export const info_platform = [
  {
    value: "TDA",
    label: "TDA"
  },
  {
    value: "ORIN",
    label: "ORIN"
  }
];

export const info_function = [
  {
    value: "行车",
    label: "行车"
  },
  {
    value: "泊车",
    label: "泊车"
  }
];

export const info_software = [
  {
    value: "CarInfo",
    label: "CarInfo"
  },
  {
    value: "CanOe",
    label: "CanOe"
  },
  {
    value: "DSpace",
    label: "DSpace"
  },
  {
    value: "DeweSoft",
    label: "DeweSoft"
  }
];

export const info_user = [
  {
    value: "labeltrain",
    label: "标注训练"
  },
  {
    value: "softwaretest",
    label: "软件测试"
  }
];

// export const info_user = [
//   {
//     value: "训练",
//     label: "训练",
//   },
//   {
//     value: "路试",
//     label: "路试",
//     children: [
//       {
//         value: "全功能路试",
//         label: "全功能路试",
//       },
//     ],
//   },
//   {
//     value: "测试",
//     label: "测试",
//     children: [
//       {
//         value: "ADAS功能测试问题数据",
//         label: "ADAS功能测试问题数据",
//       },
//       {
//         value: "传感器测试数据",
//         label: "传感器测试数据",
//       },
//       {
//         value: "执行器测试数据",
//         label: "执行器测试数据",
//       },
//     ],
//   },
//   {
//     value: "标定文件",
//     label: "标定文件",
//   },
// ];

export const workToolList = [
  {
    key: "tool0",
    value: "车辆标记"
  },
  // {
  //   key: "tool1",
  //   value: "物体标记",
  // },
  {
    key: "tool12",
    value: "物体标记2"
  },
  {
    key: "tool2",
    value: "车位标记"
  },
  {
    key: "tool3",
    value: "人脸/车牌"
  },
  {
    key: "laneline",
    value: "车道线"
  },
  {
    key: "typeLine",
    value: "线段分割"
  },
  {
    key: "envLabel",
    value: "场景标签"
  }
];

export const typeOptions = [
  {
    label: "摄像头",
    options: [
      {
        value: "前视",
        label: "前视"
      },
      {
        value: "侧视",
        label: "侧视"
      }
    ]
  },
  {
    label: "激光雷达",
    options: [
      {
        value: "前",
        label: "前"
      },
      {
        value: "后",
        label: "后"
      }
    ]
  }
];

export const carOptions = [
  {
    label: "京A11111",
    value: "京A11111"
  },
  {
    label: "京A22222",
    value: "京A22222"
  }
];

export const tableHeaderOptions = [
  {
    value: "basic.name",
    label: "名称",
    disabled: true
  },
  {
    value: "basic.type",
    label: "类型",
    disabled: true
  },
  {
    value: "id",
    label: "ID"
  },
  {
    value: "basic.album_id",
    label: "父文件夹"
  }
];
