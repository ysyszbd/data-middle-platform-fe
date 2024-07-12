// 镜像管理--镜像管理
export const images = {
  label_title: "镜像管理",
  list_columns: [
    "id",
    "name",
    "describe",
    "repository_id",
    "images_url",
    "project_id",
    "project_name",
    "dockerfile",
    "entrypoint",
    "gitpath",
    "modified",
    "creator",
  ],
  label_columns: {
    project_id: "项目ID",
    project_name: "项目名称",
    id: "ID",
    repository_id: "仓库ID",
  },
  show_columns: [
    "id",
    "project_id",
    "name",
    "describe",
    "repository_id",
    "entrypoint",
    "dockerfile",
    "gitpath",
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
      name: "repository_id",

      label: "仓库",
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
      description: "镜像名称全称，例如ubuntu:20.04",
      validators: [
        { type: "Length", min: null, max: 500 },
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
      description: "",
      validators: [
        { type: "Length", min: null, max: 1000 },
        { type: "DataRequired" },
      ],

      values: null,
      type: "String",
      required: true,

      default: "",

      "ui-type": "input",
    },
    {
      name: "dockerfile",

      label: "Dockerfile",
      description: "镜像的构建Dockerfile全部内容",
      validators: [{ type: "Length", min: null, max: null }],

      values: null,
      type: "String",
      required: true,

      default: "",

      "ui-type": "textArea",
    },
    {
      name: "gitpath",

      label: "git地址",
      description: "",
      validators: [{ type: "Length", min: null, max: 200 }],

      values: null,
      type: "String",
      required: false,

      default: "",

      "ui-type": "input",
    },
  ],
  add_columns: [
    {
      name: "repository_id",

      label: "仓库",
      description: "",
      validators: [{ type: "DataRequired" }],
      count: 3,
      values: [],
      type: "Related",
      required: false,

      default: "",

      "ui-type": "select",
    },
    {
      name: "name",

      label: "名称",
      description: "镜像名称全称，例如ubuntu:20.04",
      validators: [
        { type: "Length", min: null, max: 500 },
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
      description: "",
      validators: [
        { type: "Length", min: null, max: 1000 },
        { type: "DataRequired" },
      ],

      values: null,
      type: "String",
      required: true,

      default: "",

      "ui-type": "input",
    },
    {
      name: "dockerfile",

      label: "Dockerfile",
      description: "镜像的构建Dockerfile全部内容",
      validators: [{ type: "Length", min: null, max: null }],

      values: null,
      type: "String",
      required: false,

      default: "",

      "ui-type": "textArea",
    },
    {
      name: "gitpath",

      label: "git地址",
      description: "",
      validators: [{ type: "Length", min: null, max: 200 }],

      values: null,
      type: "String",
      required: false,

      default: "",

      "ui-type": "input",
    },
  ],
  cols_width: {
    name: {
      type: "ellip2",
      width: 160,
    },
    describe: {
      type: "ellip2",
      width: 240,
    },
    repository_id: {
      type: "ellip2",
      width: 80,
    },
    project_id: {
      type: "ellip2",
      width: 80,
    },
    images_url: {
      type: "ellip2",
      width: 180,
    },
    project_name: {
      type: "ellip2",
      width: 180,
    },
    dockerfile: {
      type: "ellip2",
      width: 180,
    },
    entrypoint: {
      type: "ellip2",
      width: 180,
    },
    gitpath: {
      type: "ellip2",
      width: 180,
    },
    modified: {
      type: "ellip2",
      width: 100,
    },
    creator: {
      type: "ellip2",
      width: 100,
    },
  },
};
export default images;