// 镜像管理--镜像仓库
export const repository = {
  label_title: "仓库管理",
  list_columns: [
    "id",
    "name",
    "server",
    "user",
    "password",
    "hubsecret",
    "modified",
    "creator",
  ],
  label_columns: {
    server: "域名",
    hubsecret: "k8s hubsecret",
  },
  show_columns: [
    "id",
    "name",
    "server",
    "user",
    "password",
    "hubsecret",
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
      name: "name",

      label: "名称",
      description: "仓库名称",
      validators: [
        { type: "Length", min: null, max: 200 },
        { type: "DataRequired" },
      ],

      values: null,
      type: "String",
      required: true,

      default: "",

      "ui-type": "input",
    },
    {
      name: "server",

      label: "域名",
      description: "镜像仓库服务地址",
      validators: [
        { type: "Length", min: null, max: 200 },
        { type: "DataRequired" },
      ],

      values: null,
      type: "String",
      required: true,

      default: "harbor.oa.com",

      "ui-type": "input",
    },
    {
      name: "user",

      label: "用户名",
      description: "镜像仓库的用户名",
      validators: [
        { type: "Length", min: null, max: 100 },
        { type: "DataRequired" },
      ],

      values: null,
      type: "String",
      required: true,

      default: "",

      "ui-type": "input",
    },
    {
      name: "password",

      label: "密码",
      description: "镜像仓库的链接密码",
      validators: [
        { type: "Length", min: null, max: 100 },
        { type: "DataRequired" },
      ],

      values: null,
      type: "String",
      required: true,

      default: "",

      "ui-type": "input",
    },
    {
      name: "hubsecret",

      label: "k8s hubsecret",
      description: "在k8s中创建的hub secret",
      validators: [
        { type: "Length", min: 1, max: 54 },
        { type: "Regexp", regex: "^[a-z][a-z0-9\\-]*[a-z0-9]$" },
        { type: "DataRequired" },
      ],

      values: null,
      type: "String",
      required: false,

      default: "-hubsecret",

      "ui-type": "input",
    },
  ],
  add_columns: [
    {
      name: "name",

      label: "名称",
      description: "",
      validators: [
        { type: "Length", min: null, max: 200 },
        { type: "DataRequired" },
      ],

      values: null,
      type: "String",
      required: true,

      default: "",

      "ui-type": "",
    },
    {
      name: "server",

      label: "域名",
      description: "镜像仓库服务地址",
      validators: [
        { type: "Length", min: null, max: 200 },
        { type: "DataRequired" },
      ],

      values: null,
      type: "String",
      required: true,

      default: "harbor.oa.com",

      "ui-type": "input",
    },
    {
      name: "user",

      label: "用户名",
      description: "镜像仓库的用户名",
      validators: [
        { type: "Length", min: null, max: 100 },
        { type: "DataRequired" },
      ],

      values: null,
      type: "String",
      required: true,

      default: "",

      "ui-type": "input",
    },
    {
      name: "password",

      label: "密码",
      description: "镜像仓库的链接密码",
      validators: [
        { type: "Length", min: null, max: 100 },
        { type: "DataRequired" },
      ],

      values: null,
      type: "String",
      required: true,

      default: "",

      "ui-type": "input",
    },
    {
      name: "hubsecret",

      label: "k8s hubsecret",
      description: "在k8s中创建的hub secret",
      validators: [
        { type: "Regexp", regex: "^[a-z][a-z0-9-]*[a-z0-9]$" },
        { type: "Length", min: 1, max: 45 },
        { type: "DataRequired" },
      ],

      values: null,
      type: "String",
      required: true,

      default: "",

      "ui-type": "input",
    },
  ],
  cols_width: {
    server: {
      type: "ellip2",
      width: 180,
    },
    id: {
      type: "ellip2",
      width: 80,
    },
    name: {
      type: "ellip2",
      width: 150,
    },
  },
};
export default repository;
