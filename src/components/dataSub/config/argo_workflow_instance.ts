// argo--任务流
const argo_workflow_instance = {
  label_title: "Argo任务流模板",
  list_columns: ["id", "name", "describe", "created_by", "created_at"],
  label_columns: {
    created_by: "创建者",
    created_at: "创建时间",
    updated_at: "修改时间",
    updated_by: "修改者",
  },
  show_columns: [
    "id",
    "name",
    "describe",
    "dag_json",
    "namespace",
    "version_id",
    "node_selector",
    "image_pull_policy",
    "parallelism",
    "parameter",
    "created_at",
    "updated_at",
  ],
  edit_fieldsets: null,
  add_fieldsets: null,
  edit_columns: [
    {
      name: "name",

      label: "名称",
      description: "英文名(小写字母、数字、- 组成)，最长50个字符",
      validators: [
        { type: "Regexp", regex: "^[a-z][a-z0-9-]*[a-z0-9]$" },
        { type: "DataRequired" },
      ],

      values: null,
      type: "String",
      required: true,

      default: "",

      "ui-type": "input",
    },
    {
      name: "describe",

      label: "描述",
      description: "模板的描述",
      validators: [{ type: "DataRequired" }],

      values: null,
      type: "String",
      required: true,

      default: "",

      "ui-type": "input",
    },
    // {
    //   name: "dag_json",
    //
    //   label: "流向图",
    //   description: "请确保输入的为json格式！",
    //   validators: [
    //     { type: "DataRequired" },
    //     { type: "Length", min: null, max: 65536 },
    //   ],
    //
    //   values: null,
    //   type: "String",
    //   required: false,
    //
    //   default: "",
    //
    //
    //   "ui-type": "textArea",
    // },
    // {
    //   name: "namespace",
    //
    //   label: "命名空间",
    //   description: "",
    //   validators: [{ type: "DataRequired" }],
    //
    //   values: null,
    //   type: "String",
    //   required: false,
    //
    //   default: "",
    //
    //
    //   "ui-type": "input",
    // },
    // {
    //   name: "version_id",
    //
    //   label: "版本",
    //   description: "",
    //   validators: [
    //     { type: "DataRequired" },
    //     { type: "Length", min: null, max: 100 },
    //   ],
    //
    //   values: null,
    //   type: "String",
    //   required: false,
    //
    //   default: "",
    //
    //
    //   "ui-type": "input",
    // },
    // {
    //   name: "node_selector",
    //
    //   label: "节点选择",
    //   description: "",
    //   validators: [
    //     { type: "DataRequired" },
    //     { type: "Length", min: null, max: 54545 },
    //   ],
    //
    //   ralues: null,
    //   type: "String",
    //   dequired: false,
    //   required: false,
    //   default: "",
    //
    //
    //   "ui-type": "input",
    // },
    {
      name: "image_pull_policy",

      label: "镜像拉取策略",
      description: "",
      validators: [{ type: "DataRequired" }],
      values: [
        { id: "Always", value: "Always" },
        { id: "IfNotPresent", value: "IfNotPresent" },
      ],
      ralues: null,
      type: "String",
      required: true,
      default: "",
      "ui-type": "radio",
    },
    {
      name: "parallelism",

      label: "任务并行数",
      description: "",
      validators: [
        { type: "DataRequired" },
        { type: "Length", min: null, max: null },
      ],

      ralues: null,
      type: "Int",
      required: true,

      default: "",

      "ui-type": "input",
    },
    // {
    //   name: "parameter",
    //
    //   label: "扩展参数",
    //   description: "",
    //   validators: [{ type: "Length", min: null, max: 65536 }],
    //   values: "",
    //
    //   ralues: null,
    //   type: "Text",
    //   required: true,
    //
    //   default: "",
    //
    //
    //   "ui-type": "textArea",
    // },
  ],
  add_columns: [
    {
      name: "name",

      label: "名称",
      description: "英文名(小写字母、数字、- 组成)，最长50个字符",
      validators: [
        { type: "Regexp", regex: "^[a-z][a-z0-9-]*[a-z0-9]$" },
        { type: "DataRequired" },
      ],

      values: null,
      type: "String",
      required: true,

      default: "",

      "ui-type": "input",
    },
    {
      name: "describe",

      label: "描述",
      description: "模板的描述",
      validators: [{ type: "DataRequired" }],

      values: null,
      type: "String",
      required: true,

      default: "",

      "ui-type": "input",
    },
    // {
    //   name: "dag_json",
    //
    //   label: "流向图",
    //   description: "请确保输入的为json格式！",
    //   validators: [
    //     { type: "DataRequired" },
    //     { type: "Length", min: 1, max: 65536 },
    //   ],
    //
    //   values: null,
    //   type: "String",
    //   required: false,
    //
    //   default: "",
    //
    //
    //   "ui-type": "textArea",
    // },
    // {
    //   name: "namespace",
    //
    //   label: "命名空间",
    //   description: "",
    //   validators: [{ type: "DataRequired" }],
    //
    //   values: null,
    //   type: "String",
    //   required: false,
    //
    //   default: "",
    //
    //
    //   "ui-type": "input",
    // },
    // {
    //   name: "version_id",
    //
    //   label: "版本",
    //   description: "",
    //   validators: [
    //     { type: "DataRequired" },
    //     { type: "Length", min: null, max: 100 },
    //   ],
    //
    //   values: null,
    //   type: "String",
    //   required: false,
    //
    //   default: "",
    //
    //
    //   "ui-type": "input",
    // },
    // {
    //   name: "node_selector",
    //
    //   label: "节点选择",
    //   description: "",
    //   validators: [
    //     { type: "DataRequired" },
    //     { type: "Length", min: null, max: 54545 },
    //   ],
    //
    //   ralues: null,
    //   type: "String",
    //   dequired: false,
    //   required: false,
    //   default: "",
    //
    //
    //   "ui-type": "input",
    // },
    {
      name: "image_pull_policy",

      label: "镜像拉取策略",
      description: "",
      validators: [{ type: "DataRequired" }],
      values: [
        { id: "Always", value: "Always" },
        { id: "IfNotPresent", value: "IfNotPresent" },
      ],

      ralues: null,
      type: "String",
      required: true,

      default: "",

      "ui-type": "radio",
    },
    {
      name: "parallelism",

      label: "任务并行数",
      description: "",
      validators: [
        { type: "DataRequired" },
        { type: "Length", min: null, max: null },
      ],

      ralues: null,
      type: "Int",
      required: true,

      default: "",

      "ui-type": "input",
    },
  ],
  cols_width: {
    describe: {
      type: "ellip2",
      width: null,
    },
    global_env: {
      type: "ellip2",
      width: 200,
    },
    cron_time: {
      type: "ellip2",
      width: 200,
    },
    image_pull_policy: {
      type: "ellip2",
      width: 150,
    },
    parallelism: {
      type: "ellip2",
      width: 150,
    },
    updated_at: {
      type: "ellip2",
      width: 180,
    },
    created_at: {
      type: "ellip2",
      width: 180,
    },
  },
};
export default argo_workflow_instance;