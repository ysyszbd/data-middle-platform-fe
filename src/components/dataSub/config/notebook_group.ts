// notebook
export const notebook_group = {
  label_title: "dmp_project",
  list_columns: [
    "id",
    "name",
    "describe",
    "ide_type",
    "status",
    "resource_cpu",
    "resource_gpu",
    "resource_memory",
  ],
  label_columns: {},
  show_columns: [
    "id",
    "name",
    "describe",
    "ide_type",
    "status",
    "resource_cpu",
    "resource_gpu",
    "resource_memory",
    "images",
    "namespace",
    "node_selector",
    "volume_mount",
  ],
  edit_fieldsets: null,
  add_fieldsets: null,
  edit_columns: [
    {
      name: "project_id",
      remember: false,
      label: "项目组",
      description: "部署项目组",
      validators: [{ type: "DataRequired" }],
      count: 0,
      values: null,
      type: "Related",
      required: true,
      unique: false,
      default: "",
      choices: null,
      widget: "",
      "ui-type": "select",
    },
    {
      name: "name",
      remember: false,
      label: "名称",
      description: "英文名(小写字母、数字、-组成)，以字母字符开头，以字母数字字符结尾（例如“my name”或“abc-123”，最长50个字符",
      validators: [
        { max: 50, min: null, type: "Length" },
        { type: "Regexp", regex: "[a-z]([-a-z0-9]*[a-z0-9])?" },
        { type: "DataRequired" },
      ],
      count: 0,
      values: null,
      type: "",
      required: true,
      unique: false,
      default: "",
      choices: null,
      widget: "",
      "ui-type": "input",
    },
    {
      name: "describe",
      remember: true,
      label: "描述",
      description: "中文描述",
      validators: [
        { max: 500, min: null, type: "Length" },
        { type: "DataRequired" },
      ],
      count: 0,
      values: null,
      type: "",
      required: true,
      unique: false,
      default: "",
      choices: null,
      widget: "",
      "ui-type": "input",
    },
    {
      name: "volume_mount",
      label: "挂载目录",
      description: "使用该模板的task，会在添加时，自动添加该挂载。",
      validators: [{ type: "Length", min: null, max: 400 }],
      values: null,
      type: "String",
      required: false,
      default: "",
      "ui-type": "yh_volume_mount",
      yh_template: {
        name: "",
        source: "",
        target: "",
        type: "album-pvc",
        read_only: true,
      },
      yh_data_type: "arr_obj",
      // "ui-type": "file_input",
    },
    {
      name: "images",
      remember: false,
      label: "镜像",
      description: "notebook基础环境镜像，如果显示不准确，请删除新建notebook",
      validators: [{ type: "DataRequired" }],
      count: 0,
      values: [
        {
          id: "ccr.ccs.tencentyun.com/cube-studio/notebook:vscode-ubuntu-cpu-base",
          value:
            "ccr.ccs.tencentyun.com/cube-studio/notebook:vscode-ubuntu-cpu-base",
        },
        {
          id: "ccr.ccs.tencentyun.com/cube-studio/notebook:vscode-ubuntu-gpu-base",
          value:
            "ccr.ccs.tencentyun.com/cube-studio/notebook:vscode-ubuntu-gpu-base",
        },
        {
          id: "ccr.ccs.tencentyun.com/cube-studio/notebook:jupyter-ubuntu-cpu-base",
          value:
            "ccr.ccs.tencentyun.com/cube-studio/notebook:jupyter-ubuntu-cpu-base",
        },
        {
          id: "ccr.ccs.tencentyun.com/cube-studio/notebook:jupyter-ubuntu-gpu-base",
          value:
            "ccr.ccs.tencentyun.com/cube-studio/notebook:jupyter-ubuntu-gpu-base",
        },
        {
          id: "ccr.ccs.tencentyun.com/cube-studio/notebook:jupyter-ubuntu-bigdata",
          value:
            "ccr.ccs.tencentyun.com/cube-studio/notebook:jupyter-ubuntu-bigdata",
        },
        {
          id: "ccr.ccs.tencentyun.com/cube-studio/notebook:jupyter-ubuntu-machinelearning",
          value:
            "ccr.ccs.tencentyun.com/cube-studio/notebook:jupyter-ubuntu-machinelearning",
        },
        {
          id: "ccr.ccs.tencentyun.com/cube-studio/notebook:jupyter-ubuntu-deeplearning",
          value:
            "ccr.ccs.tencentyun.com/cube-studio/notebook:jupyter-ubuntu-deeplearning",
        },
      ],
      type: "Related",
      required: true,
      unique: false,
      default: "",
      choices: null,
      widget: "",
      "ui-type": "select",
    },
    {
      name: "resource_memory",
      remember: true,
      label: "内存申请",
      description: "内存的资源使用限制，示例：1G，20G",
      validators: [
        { type: "Regexp", regex: "^[0-9][0-9]*$" },
        { type: "Length", min: 0, max: 200 },
        { type: "DataRequired" },
      ],
      count: 0,
      values: null,
      type: "Int",
      required: true,
      unique: false,
      default: "0",
      choices: null,
      widget: "",
      // "ui-type": "input",
      "ui-type": "yh_input",
      yh_in_type: "number",
      yh_out_type: "string",
    },
    {
      name: "resource_cpu",
      remember: true,
      label: "cpu申请",
      description: "cpu的资源使用限制(单位：核)，示例：2",
      validators: [
        { type: "Regexp", regex: "^[0-9][0-9]*$" },
        { type: "Length", min: 0, max: 200 },
        { type: "DataRequired" },
      ],
      count: 0,
      values: null,
      type: "",
      required: true,
      unique: false,
      default: "0",
      choices: null,
      widget: "Int",
      // "ui-type": "input",
      "ui-type": "yh_input",
      yh_in_type: "number",
      yh_out_type: "string",
    },
    {
      name: "resource_gpu",
      remember: true,
      label: "gpu申请",
      description:
        "gpu的资源使用限gpu的资源使用限制(单位卡)，示例:1，2，训练任务每个容器独占整卡。申请具体的卡型号，可以类似 1(V100),目前支持T4/V100/A100/VGPU",
      validators: [
        { type: "Regexp", regex: "^[0-9][0-9]*$" },
        { type: "Length", min: 0, max: 200 },
      ],
      count: 0,
      values: null,
      type: "Int",
      required: false,
      unique: false,
      default: "0",
      choices: null,
      widget: "",
      // "ui-type": "input",
      "ui-type": "yh_input",
      yh_in_type: "number",
      yh_out_type: "string",
    },
  ],
  add_columns: [
    {
      name: "project_id",
      remember: false,
      label: "项目组",
      description: "部署项目组",
      validators: [{ type: "DataRequired" }],
      count: 0,
      values: null,
      type: "Related",
      required: true,
      unique: false,
      default: "",
      choices: null,
      widget: "",
      "ui-type": "select",
    },
    {
      name: "name",
      remember: false,
      label: "名称",
      description: "英文名(小写字母、数字、-组成)，以字母字符开头，以字母数字字符结尾（例如“my name”或“abc-123”，最长50个字符",
      validators: [
        { type: "Regexp", regex: "^[a-z]([-a-z0-9]*[a-z0-9])?" },
        { type: "DataRequired" },
        { max: 50, min: null, type: "Length" },
      ],
      count: 0,
      values: null,
      type: "",
      required: true,
      unique: false,
      default: "",
      choices: null,
      widget: "",
      "ui-type": "input",
    },
    {
      name: "describe",
      remember: true,
      label: "描述",
      description: "中文描述",
      validators: [
        { max: 500, min: null, type: "Length" },
        { type: "DataRequired" },
      ],
      count: 0,
      values: null,
      type: "",
      required: true,
      unique: false,
      default: "",
      choices: null,
      widget: "",
      "ui-type": "input",
    },
    {
      name: "volume_mount",
      label: "挂载目录",
      description: "使用该模板的task，会在添加时，自动添加该挂载。",
      validators: [{ type: "Length", min: null, max: 400 }],
      values: null,
      type: "String",
      required: false,
      default: "",
      "ui-type": "yh_volume_mount",
      yh_template: {
        name: "",
        source: "",
        target: "",
        type: "album-pvc",
        read_only: true,
      },
      yh_data_type: "arr_obj",
      // "ui-type": "file_input",
    },
    {
      name: "images",
      remember: false,
      label: "镜像",
      description: "notebook基础环境镜像，如果显示不准确，请删除新建notebook",
      validators: [{ type: "DataRequired" }],
      count: 0,
      values: [
        {
          id: "ccr.ccs.tencentyun.com/cube-studio/notebook:vscode-ubuntu-cpu-base",
          value:
            "ccr.ccs.tencentyun.com/cube-studio/notebook:vscode-ubuntu-cpu-base",
        },
        {
          id: "ccr.ccs.tencentyun.com/cube-studio/notebook:vscode-ubuntu-gpu-base",
          value:
            "ccr.ccs.tencentyun.com/cube-studio/notebook:vscode-ubuntu-gpu-base",
        },
        {
          id: "ccr.ccs.tencentyun.com/cube-studio/notebook:jupyter-ubuntu-cpu-base",
          value:
            "ccr.ccs.tencentyun.com/cube-studio/notebook:jupyter-ubuntu-cpu-base",
        },
        {
          id: "ccr.ccs.tencentyun.com/cube-studio/notebook:jupyter-ubuntu-gpu-base",
          value:
            "ccr.ccs.tencentyun.com/cube-studio/notebook:jupyter-ubuntu-gpu-base",
        },
        {
          id: "ccr.ccs.tencentyun.com/cube-studio/notebook:jupyter-ubuntu-bigdata",
          value:
            "ccr.ccs.tencentyun.com/cube-studio/notebook:jupyter-ubuntu-bigdata",
        },
        {
          id: "ccr.ccs.tencentyun.com/cube-studio/notebook:jupyter-ubuntu-machinelearning",
          value:
            "ccr.ccs.tencentyun.com/cube-studio/notebook:jupyter-ubuntu-machinelearning",
        },
        {
          id: "ccr.ccs.tencentyun.com/cube-studio/notebook:jupyter-ubuntu-deeplearning",
          value:
            "ccr.ccs.tencentyun.com/cube-studio/notebook:jupyter-ubuntu-deeplearning",
        },
      ],
      type: "Related",
      required: true,
      unique: false,
      default: "",
      choices: null,
      widget: "",
      "ui-type": "select",
    },
    {
      name: "resource_memory",
      remember: true,
      label: "内存申请",
      description: "内存的资源使用限制，示例：1G，20G",
      validators: [
        { type: "Regexp", regex: "^[0-9][0-9]*$" },
        { type: "Length", min: 0, max: 200 },
        { type: "DataRequired" },
      ],
      count: 0,
      values: null,
      type: "Int",
      required: true,
      unique: false,
      default: "0",
      choices: null,
      widget: "",
      // "ui-type": "input",
      "ui-type": "yh_input",
      yh_in_type: "number",
      yh_out_type: "string",
    },
    {
      name: "resource_cpu",
      remember: true,
      label: "cpu申请",
      description: "cpu的资源使用限制(单位：核)，示例：2",
      validators: [
        { type: "Regexp", regex: "^[0-9][0-9]*$" },
        { type: "Length", min: 0, max: 200 },
        { type: "DataRequired" },
      ],
      count: 0,
      values: null,
      type: "Int",
      required: true,
      unique: false,
      default: "0",
      choices: null,
      widget: "",
      // "ui-type": "input",
      "ui-type": "yh_input",
      yh_in_type: "number",
      yh_out_type: "string",
    },
    {
      name: "resource_gpu",
      remember: true,
      label: "gpu申请",
      description:
        "gpu的资源使用限gpu的资源使用限制(单位卡)，示例:1，2，训练任务每个容器独占整卡。申请具体的卡型号，可以类似 1(V100),目前支持T4/V100/A100/VGPU",
      validators: [
        { type: "Regexp", regex: "^[0-9][0-9]*$" },
        { type: "Length", min: 0, max: 200 },
      ],
      count: 0,
      values: null,
      type: "Int",
      required: false,
      unique: false,
      default: "0",
      choices: null,
      widget: "",
      // "ui-type": "input",
      "ui-type": "yh_input",
      yh_in_type: "number",
      yh_out_type: "string",
    },
  ],
  cols_width: {
    describe: {
      type: "ellip2",
      width: 200,
    },
    expand: {
      type: "ellip2",
      width: 280,
    },
  },
};
export default notebook_group;