// 推理服务--模型管理
export const model_manager = {
  label_title: "模型",
  list_columns: [
    "id",
    "name",
    "version",
    "describe",
    "path",
    "download_url",
    "project",
    "pipeline_id",
    "run_id",
    "run_time",
    "framework",
    "metrics",
    "md5",
    "api_type",
  ],
  label_columns: {
    path: "模型文件",
    pipeline_id: "任务流id",
    framework: "算法框架",
  },
  show_columns: [
    "id",
    "name",
    "version",
    "describe",
    "path",
    "download_url",
    "project_id",
    "pipeline_id",
    "run_id",
    "run_time",
    "framework",
    "metrics",
    "md5",
    "api_type",
    "created_by",
    "updated_by",
    "created_at",
    "updated_at",
    "deleted_at",
  ],
  edit_fieldsets: null,
  add_fieldsets: null,
  edit_columns: [
    {
      name: "project",

      label: "项目组",
      description: "",
      validators: [{ type: "DataRequired" }],

      values: null,
      type: "Related",
      required: false,

      default: "",

      "ui-type": "select",
    },
    {
      name: "name",

      label: "名称",
      description: "模型名(a-z0-9-字符组成，最长54个字符)",
      validators: [
        { type: "DataRequired" },
        { type: "Regexp", regex: "^[a-z0-9-]*$" },
        { type: "Length", min: 1, max: 54 },
      ],

      values: null,
      type: "String",
      required: false,

      default: "",

      "ui-type": "input",
    },
    {
      name: "version",

      label: "版本",
      description: "模型版本",
      validators: [{ type: "DataRequired" }],

      values: null,
      type: "String",
      required: false,

      default: "v2023.05.18.1",

      "ui-type": "input",
    },
    {
      name: "describe",

      label: "描述",
      description: "模型描述",
      validators: [{ type: "DataRequired" }],

      values: null,
      type: "String",
      required: false,

      default: "",

      "ui-type": "input",
    },
    {
      name: "path",

      label: "模型文件",
      description:
        "\n            tfserving：仅支持tf save_model方式的模型目录, /mnt/xx/../saved_model/<br>\n            torch-server：torch-model-archiver编译后的mar模型文件地址, /mnt/xx/../xx.mar或torch script保存的模型<br>\n            onnxruntime：onnx模型文件的地址, /mnt/xx/../xx.onnx<br>\n            tensorrt:模型文件地址, /mnt/xx/../xx.plan<br>\n            ",
      validators: [{ type: "DataRequired" }],

      values: null,
      type: "String",
      required: false,

      default: "/mnt/admin/xx/saved_model/",

      "ui-type": "input",
    },
    {
      name: "framework",

      label: "算法框架",
      description: "选项xgb、tf、pytorch、onnx、tensorrt等",
      validators: [{ type: "DataRequired" }],

      values: null,
      type: "Select",
      required: false,

      default: "",

      "ui-type": "select",
    },
    {
      name: "run_id",

      label: "kfp运行id",
      description: "pipeline 训练的run id",
      validators: [
        { type: "DataRequired" },
        { type: "Length", min: null, max: 100 },
      ],

      values: null,
      type: "String",
      required: false,

      default: "random_run_id_3eb107eade854a73bf4d9b8134ffad02",

      "ui-type": "input",
    },
    {
      name: "run_time",

      label: "kfp运行时间",
      description: "pipeline 训练的 运行时间",
      validators: [{ type: "Length", min: null, max: 100 }],

      values: null,
      type: "String",
      required: false,

      default: "2023.05.18 18:30:17",

      "ui-type": "input",
    },
    {
      name: "metrics",

      label: "指标",
      description: "",
      validators: [{ type: "Length", min: null, max: null }],

      values: null,
      type: "Text",
      required: false,

      default: "",

      "ui-type": "textArea",
    },
    {
      name: "md5",

      label: "md5",
      description: "",
      validators: [{ type: "Length", min: null, max: 200 }],

      values: null,
      type: "String",
      required: false,

      default: "",

      "ui-type": "input",
    },
    {
      name: "api_type",

      label: "推理框架",
      description: "推理框架类型",
      validators: [{ type: "DataRequired" }],

      values: null,
      type: "Select",
      required: false,

      default: "",

      "ui-type": "select",
    },
    {
      name: "pipeline_id",

      label: "任务流id",
      description: "任务流的id，0表示非任务流产生模型",
      validators: [],

      values: null,
      type: "String",
      required: false,

      default: "0",

      "ui-type": "input",
    },
    {
      name: "md5",

      label: "MD5",
      description: "",
      validators: null,

      values: null,
      type: "",
      required: false,

      default: "",

      "ui-type": "",
    },
    {
      name: "api_type",

      label: "推理框架",
      description: "",
      validators: null,

      values: null,
      type: "",
      required: false,

      default: "",

      "ui-type": "",
    },
  ],
  add_columns: [
    {
      name: "project",

      label: "项目组",
      description: "",
      validators: [{ type: "DataRequired" }],

      values: null,
      type: "Related",
      required: true,

      default: "",

      "ui-type": "select",
    },
    {
      name: "name",

      label: "名称",
      description: "模型名(a-z0-9-字符组成，最长54个字符)",
      validators: [
        { type: "DataRequired" },
        { type: "Regexp", regex: "^[a-z0-9-]*$" },
        { type: "Length", min: 1, max: 54 },
      ],

      values: null,
      type: "String",
      required: true,

      default: "",

      "ui-type": "input",
    },
    {
      name: "version",

      label: "版本",
      description: "模型版本",
      validators: [{ type: "DataRequired" }],

      values: null,
      type: "String",
      required: true,

      default: "v2023.05.18.1",

      "ui-type": "input",
    },
    {
      name: "describe",

      label: "描述",
      description: "模型描述",
      validators: [{ type: "DataRequired" }],

      values: null,
      type: "String",
      required: false,

      default: "",

      "ui-type": "input",
    },
    {
      name: "path",

      label: "模型文件",
      description:
        "\n            tfserving：仅支持tf save_model方式的模型目录, /mnt/xx/../saved_model/<br>\n            torch-server：torch-model-archiver编译后的mar模型文件地址, /mnt/xx/../xx.mar或torch script保存的模型<br>\n            onnxruntime：onnx模型文件的地址, /mnt/xx/../xx.onnx<br>\n            tensorrt:模型文件地址, /mnt/xx/../xx.plan<br>\n            ",
      validators: [{ type: "DataRequired" }],

      values: null,
      type: "String",
      required: true,

      default: "/mnt/admin/xx/saved_model/",

      "ui-type": "input",
    },
    {
      name: "framework",

      label: "算法框架",
      description: "选项xgb、tf、pytorch、onnx、tensorrt等",
      validators: [{ type: "DataRequired" }],

      values: null,
      type: "Select",
      required: true,

      default: "",

      "ui-type": "select",
    },
    {
      name: "run_id",

      label: "kfp运行ID",
      description: "pipeline 训练的run id",
      validators: [
        { type: "Length", min: null, max: 100 },
        { type: "DataRequired" },
      ],

      values: null,
      type: "String",
      required: true,

      default: "random_run_id_ee377cd955274382b31342b223bf3195",

      "ui-type": "input",
    },
    {
      name: "pipeline_id",

      label: "任务流ID",
      description: "任务流的id，0表示非任务流产生模型",
      validators: [],

      values: null,
      type: "String",
      required: false,

      default: "",

      "ui-type": "input",
    },
    {
      name: "run_time",

      label: "kfp运行时间",
      description: "pipeline 训练的 运行时间",
      validators: [{ type: "Length", min: null, max: 100 }],

      values: null,
      type: "String",
      required: false,

      default: "2023.05.18 18:30:18",

      "ui-type": "input",
    },
    {
      name: "metrics",

      label: "指标",
      description: "",
      validators: [{ type: "Length", min: null, max: null }],

      values: null,
      type: "Text",
      required: false,

      default: "{}",

      "ui-type": "textArea",
    },
    {
      name: "md5",

      label: "MD5",
      description: "",
      validators: [{ type: "Length", min: null, max: 200 }],

      values: null,
      type: "String",
      required: false,

      default: "",

      "ui-type": "input",
    },
    {
      name: "api_type",

      label: "推理框架",
      description: "推理框架类型",
      validators: [{ type: "DataRequired" }],

      values: null,
      type: "Select",
      required: true,

      default: "",

      "ui-type": "select",
    },
  ],
  cols_width: {
    api_type: {
      type: "ellip2",
      width: 100,
    },
    created_at: {
      type: "ellip2",
      width: 100,
    },
    created_by: {
      type: "ellip2",
      width: 100,
    },
    deleted_at: {
      type: "ellip2",
      width: 100,
    },
    describe: {
      type: "ellip2",
      width: 100,
    },
    download_url: {
      type: "ellip2",
      width: 100,
    },
    framework: {
      type: "ellip2",
      width: 100,
    },
    id: {
      type: "ellip2",
      width: 100,
    },
    md5: {
      type: "ellip2",
      width: 100,
    },
    metrics: {
      type: "ellip2",
      width: 100,
    },
    name: {
      type: "ellip2",
      width: 100,
    },
    path: {
      type: "ellip2",
      width: 100,
    },
    pipeline_id: {
      type: "ellip2",
      width: 100,
    },
    project_id: {
      type: "ellip2",
      width: 100,
    },
    run_id: {
      type: "ellip2",
      width: 100,
    },
    run_time: {
      type: "ellip2",
      width: 130,
    },
    updated_at: {
      type: "ellip2",
      width: 100,
    },
    updated_by: {
      type: "ellip2",
      width: 100,
    },
    version: {
      type: "ellip2",
      width: 100,
    },
  },
};
export default model_manager;