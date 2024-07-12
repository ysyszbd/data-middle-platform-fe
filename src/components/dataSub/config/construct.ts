// 镜像管理--镜像构建
export const construct = {
  label_title: "镜像构造",
  list_columns: [
    "id",
    "describe",
    "base_image",
    "target_image",
    "expand",
    "project_id",
    "created_by",
    "updated_by",
  ],
  label_columns: {
    updated_by: "修改者",
  },
  show_columns: [
    "id",
    "describe",
    "base_image",
    "target_image",
    "consecutive_build",
    "expand",
    "last_image",
    "need_gpu",
    "project_id",
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
      required: true,

      default: "",

      "ui-type": "select",
    },
    {
      name: "describe",

      label: "描述",
      description: "目标镜像描述",
      validators: [{ type: "DataRequired" }],

      values: null,
      type: "String",
      required: false,

      default: "",

      "ui-type": "input",
    },
    {
      name: "base_image",

      label: "基础镜像",
      description:
        '基础镜像和构建方法可参考：<a href="https://github.com/tencentmusic/cube-studio/tree/master/images">点击打开</a>',
      validators: [{ type: "DataRequired" }],

      values: null,
      type: "String",
      required: false,

      default: "",

      "ui-type": "input",
    },
    {
      name: "target_image",

      label: "目标镜像",
      description: "ccr.ccs.tencentyun.com/cube-studio/XXX:yyyy.mm.dd.1",
      validators: [{ type: "DataRequired" }],

      values: null,
      type: "String",
      required: false,

      default: "",

      "ui-type": "input",
    },
    {
      name: "need_gpu",

      label: "需要gpu",
      description: "",
      validators: null,

      values: [
        { id: true, value: "yes" },
        { id: false, value: "no" },
      ],
      type: "Boolean",
      required: false,

      default: false,

      "ui-type": "radio",
    },
    {
      name: "consecutive_build",

      label: "连续构建",
      description: "",
      validators: [],

      values: [
        { id: true, value: "yes" },
        { id: false, value: "no" },
      ],
      type: "Boolean",
      required: false,

      default: true,

      "ui-type": "radio",
    },
    {
      name: "last_image",

      label: "扩展",
      description: "扩展字段",
      validators: [{ type: "Length", min: null, max: 65536 }],

      values: null,
      type: "String",
      required: false,

      default:
        '{\n    "volume_mount": "kubeflow-user-workspace(pvc):/mnt",\n    "resource_memory": "8G",\n    "resource_cpu": "4"\n}',

      "ui-type": "textArea",
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
      name: "describe",

      label: "描述",
      description: "目标镜像描述",
      validators: [{ type: "DataRequired" }],

      values: null,
      type: "String",
      required: true,

      default: "",

      "ui-type": "input",
    },
    {
      name: "base_image",

      label: "基础镜像",
      description:
        '基础镜像和构建方法可参考：<a href="https://github.com/tencentmusic/cube-studio/tree/master/images">点击打开</a>',
      validators: [{ type: "DataRequired" }],

      values: null,
      type: "String",
      required: true,

      default: "",

      "ui-type": "input",
    },
    {
      name: "target_image",

      label: "目标镜像",
      description:
        "目标镜像名，将直接推送到目标仓库，需在镜像仓库中配置了相应仓库的账号密码",
      validators: [{ type: "DataRequired" }],

      values: null,
      type: "String",
      required: true,

      default: "",

      "ui-type": "input",
    },
    {
      name: "need_gpu",

      label: "需要GPU",
      description: "",
      validators: [],

      values: [
        { id: true, value: "yes" },
        { id: false, value: "no" },
      ],
      type: "Boolean",
      required: false,

      default: false,

      "ui-type": "radio",
    },
    {
      name: "consecutive_build",

      label: "连续构建",
      description: "",
      validators: null,

      values: [
        { id: true, value: "yes" },

        { id: false, value: "no" },
      ],
      type: "Boolean",
      required: false,

      default: true,

      "ui-type": "radio",
    },
    {
      name: "expand",

      label: "扩展",
      description: "扩展字段",
      validators: [{ type: "Length", min: null, max: 65536 }],

      values: null,
      type: "String",
      required: false,

      default:
        '{\n    "volume_mount": "kubeflow-user-workspace(pvc):/mnt",\n    "resource_memory": "8G",\n    "resource_cpu": "4"\n}',

      "ui-type": "textArea",
    },
  ],
  cols_width: {
    base_image: {
      type: "ellip2",
      width: 120,
    },
    expand: {
      type: "ellip2",
      width: 380,
    },
  },
};
export default construct;