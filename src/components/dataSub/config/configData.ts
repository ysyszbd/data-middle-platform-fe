import project_group from "./project_group";
import argo_workflow_template from "./argo_workflow_template";
import argo_workflow_instance from "./argo_workflow_instance";
import construct from "./construct";
import images from "./images";
import repository from "./repository";
import cron from "./cron";
import offline from "./offline";
import model_manager from "./model_manager";
import notebook_group from "./notebook_group";
export const page_infos = {
  "1": {
    cron,
    offline,
    repository,
    construct,
    images,
    job_template_group: project_group,
    model_group: project_group,
    org_group: project_group,
    argo: argo_workflow_template,
    model_manager,
    notebook: notebook_group,
  },
  "2": {
    argo: argo_workflow_instance,
  },
};

export const menu_data = {
  // 定时处理
  cron: {
    menu: ["任务列表"],
    // menu: ["任务列表", "任务日志", "运行实例"],
    add_btn: [],
    menu_btn: [["Del"]],
    page_title: ["定时处理", "定时处理-运行日志", "定时处理-运行实例"],
    table_btns: [
      [
        {
          btn_type: "warning",
          btn_key: "list",
          btn_text: "列表",
        },
        {
          btn_type: "primary",
          btn_key: "enter",
          btn_text: "进入",
        },
        {
          btn_type: "danger",
          btn_key: "del",
          btn_text: "删除",
        },
      ],
      [],
    ],
  },
  // 离线处理
  offline: {
    menu: ["任务列表"],
    // menu: ["任务列表", "任务日志"],
    add_btn: [],
    menu_btn: [["Del"]],
    page_title: ["离线处理", "离线处理-运行日志", "离线处理-运行实例"],
    table_btns: [
      [
        {
          btn_type: "primary",
          btn_key: "enter",
          btn_text: "进入",
        },
        {
          btn_type: "danger",
          btn_key: "del",
          btn_text: "删除",
        },
      ],
      [],
    ],
  },
  // 实时处理
  realtime: {
    menu: ["任务列表"],
    // menu: ["任务列表", "任务日志"],
    add_btn: ["添加任务流"],
    menu_btn: [["Del"]],
    page_title: ["实时处理", "实时处理-运行日志", "实时处理-运行实例"],
    table_btns: [
      [
        {
          btn_type: "warning",
          btn_key: "",
          btn_text: "激活",
          btn_value: "",
        },
        {
          btn_type: "danger",
          btn_key: "stop",
          btn_text: "停止",
          btn_value: "",
        },
        {
          btn_type: "primary",
          btn_key: "detail",
          btn_text: "详情",
        },
        {
          btn_type: "primary",
          btn_key: "update",
          btn_text: "修改",
        },
        {
          btn_type: "danger",
          btn_key: "del",
          btn_text: "删除",
        },
      ],
      [],
    ],
  },
  // Argo
  argo: {
    menu: ["任务模板", "任务流"],
    add_btn: ["添加任务模板", "添加任务流"],
    page_title: ["任务", "任务流"],
    menu_btn: [["Del"]],
    table_btns: [
      [
        // {
        //   btn_type: "primary",
        //   btn_key: "enter",
        //   btn_text: "进入",
        // },
        {
          btn_type: "primary",
          btn_key: "detail",
          btn_text: "详情",
        },
        {
          btn_type: "primary",
          btn_key: "update",
          btn_text: "修改",
        },
        // {
        //   btn_type: "success",
        //   btn_key: "run",
        //   btn_text: "运行",
        // },
        {
          btn_type: "warning",
          btn_key: "clear",
          btn_text: "clear",
        },
        {
          btn_type: "info",
          btn_key: "debug",
          btn_text: "debug",
        },
        // {
        //   btn_type: "primary",
        //   btn_key: "log",
        //   btn_text: "日志",
        // },
        {
          btn_type: "danger",
          btn_key: "del",
          btn_text: "删除",
        },
      ],
      [
        {
          btn_type: "primary",
          btn_key: "enter",
          btn_text: "进入",
        },
        {
          btn_type: "primary",
          btn_key: "detail",
          btn_text: "详情",
        },
        {
          btn_type: "primary",
          btn_key: "update",
          btn_text: "修改",
        },
        {
          btn_type: "danger",
          btn_key: "del",
          btn_text: "删除",
        },
        {
          btn_type: "success",
          btn_key: "",
          btn_text: "执行按钮",
          show_type: "dropdown",
          btn_arr: [
            {
              btn_type: "primary",
              btn_key: "cron",
              btn_text: "定时",
            },
            {
              btn_type: "primary",
              btn_key: "offline",
              btn_text: "离线",
            },
          ],
        },
      ],
    ],
  },
  // 镜像仓库
  repository: {
    menu: ["仓库 列表"],
    add_btn: ["添加仓库"],
    page_title: ["镜像仓库"],
    menu_btn: [["Del"]],
    table_btns: [
      [
        {
          btn_type: "primary",
          btn_key: "detail",
          btn_text: "详情",
        },
        {
          btn_type: "primary",
          btn_key: "update",
          btn_text: "修改",
        },
        {
          btn_type: "danger",
          btn_key: "del",
          btn_text: "删除",
        },
      ],
    ],
  },
  // 镜像构建
  construct: {
    menu: ["docker 列表"],
    add_btn: ["添加docker"],
    page_title: ["镜像构建"],
    menu_btn: [["Del"]],
    table_btns: [
      [
        {
          btn_type: "primary",
          btn_key: "detail",
          btn_text: "详情",
        },
        {
          btn_type: "primary",
          btn_key: "update",
          btn_text: "修改",
        },
        {
          btn_type: "danger",
          btn_key: "del",
          btn_text: "删除",
        },
      ],
    ],
  },
  // 镜像管理
  images: {
    menu: ["镜像 列表"],
    add_btn: ["添加镜像"],
    page_title: ["镜像管理"],
    menu_btn: [["Del"]],
    table_btns: [
      [
        {
          btn_type: "primary",
          btn_key: "detail",
          btn_text: "详情",
        },
        {
          btn_type: "primary",
          btn_key: "update",
          btn_text: "修改",
        },
        {
          btn_type: "danger",
          btn_key: "del",
          btn_text: "删除",
        },
      ],
    ],
  },
  // 模板分类
  job_template_group: {
    menu: ["模板分类"],
    add_btn: ["添加模板分类"],
    page_title: ["模板分类"],
    menu_btn: [["Del"]],
    table_btns: [
      [
        {
          btn_type: "primary",
          btn_key: "detail",
          btn_text: "详情",
        },
        {
          btn_type: "primary",
          btn_key: "update",
          btn_text: "修改",
        },
        {
          btn_type: "danger",
          btn_key: "del",
          btn_text: "删除",
        },
      ],
    ],
  },
  // 模型分组
  model_group: {
    menu: ["模型分组"],
    add_btn: ["添加模型分组"],
    page_title: ["模型分组"],
    menu_btn: [["Del"]],
    table_btns: [
      [
        {
          btn_type: "primary",
          btn_key: "detail",
          btn_text: "详情",
        },
        {
          btn_type: "primary",
          btn_key: "update",
          btn_text: "修改",
        },
        {
          btn_type: "danger",
          btn_key: "del",
          btn_text: "删除",
        },
      ],
    ],
  },
  // 项目分组
  org_group: {
    menu: ["项目分组"],
    add_btn: ["添加项目分组"],
    page_title: ["项目分组"],
    menu_btn: [["Del"]],
    table_btns: [
      [
        {
          btn_type: "primary",
          btn_key: "detail",
          btn_text: "详情",
        },
        {
          btn_type: "primary",
          btn_key: "update",
          btn_text: "修改",
        },
        {
          btn_type: "danger",
          btn_key: "del",
          btn_text: "删除",
        },
      ],
    ],
  },
  // 模型管理
  model_manager: {
    menu: ["模型管理"],
    add_btn: ["添加模型"],
    page_title: ["模型管理"],
    menu_btn: [["Del"]],
    table_btns: [
      [
        {
          btn_type: "primary",
          btn_key: "detail",
          btn_text: "详情",
        },
        {
          btn_type: "primary",
          btn_key: "update",
          btn_text: "修改",
        },
        {
          btn_type: "danger",
          btn_key: "del",
          btn_text: "删除",
        },
      ],
    ],
  },

  // notebook
  notebook: {
    menu: ["notebook"],
    add_btn: ["添加notebook"],
    page_title: ["notebook"],
    menu_btn: [["Del", "Stop"]],
    table_btns: [
      [
        {
          btn_type: "primary",
          btn_key: "enter",
          btn_text: "进入",
        },
        {
          btn_type: "primary",
          btn_key: "update",
          btn_text: "修改",
        },
        {
          btn_type: "warning",
          btn_key: "stop",
          btn_text: "stop",
        },
        {
          btn_type: "info",
          btn_key: "reset",
          btn_text: "reset",
        },
        {
          btn_type: "danger",
          btn_key: "del",
          btn_text: "删除",
        },
      ],
    ],
  },
};

export const mapping_relation_data = {
  org_group: "org",
  model_group: "model",
  job_template_group: "job-template",
  cron: "cron",
  offline: "offline",
  realtime: "realtime",
};
