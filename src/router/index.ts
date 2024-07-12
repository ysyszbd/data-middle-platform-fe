// 直接包起来
import { markRaw } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import {
  DataBoard,
  DataAnalysis,
  List,
  Link,
  Reading,
  Files,
  Folder,
  Document,
  AddLocation,
  Timer,
  View,
  EditPen,
  User,
  UserFilled,
  Coin,
  Menu,
  House,
  Tickets,
  SetUp,
  Paperclip,
  Filter,
  HelpFilled,
  CopyDocument,
  Operation,
  Box,
  PriceTag,
  Loading,
  Wallet,
  PieChart,
  MessageBox,
  DocumentAdd,
  FolderChecked,
  Cpu
} from "@element-plus/icons-vue";

import { useStateStore } from "@/stores/state";

export const constantRoutes = [
  {
    path: "/",
    name: "main",
    component: () => import("../views/MainView.vue")
  },
  {
    path: "/data",
    name: "data",
    meta: { title: "数据管理平台" },
    component: () => import("../views/DataManagementView.vue"),
    redirect: "/data/statistics",
    children: [
      {
        path: "/data/statistics",
        component: () => import("../views/subview/data/DataStatisticsView.vue"),
        meta: { title: "统计看板", icon: markRaw(DataAnalysis) }
      },
      {
        path: "/data/data-raw",
        component: () => import("../views/subview/data/DataRawView.vue"),
        meta: { title: "原始数据", icon: markRaw(Folder) }
        // redirect: "/data/data-raw/total-data",
        // children: [
        //   {
        //     path: "/data/data-raw/total-data",
        //     name: "total",
        //     component: () =>
        //       import("../views/subview/data/sub/dataraw/TotalDataView.vue"),
        //     meta: { title: "全部数据", icon: markRaw(Folder) }
        //   },
        //   {
        //     path: "/data/data-raw/label-train",
        //     name: "labeltrain",
        //     component: () =>
        //       import("../views/subview/data/sub/dataraw/LabelTrainView.vue"),
        //     meta: { title: "标注训练", icon: markRaw(Timer) }
        //   },
        //   {
        //     path: "/data/data-raw/test-data",
        //     component: () =>
        //       import("../views/subview/data/sub/dataraw/TestDataView.vue"),
        //     meta: { title: "测试数据", icon: markRaw(HelpFilled) }
        //   },
        //   {
        //     path: "/data/data-raw/customer-data",
        //     component: () =>
        //       import("../views/subview/data/sub/dataraw/CustomerDataView.vue"),
        //     meta: { title: "客户数据", icon: markRaw(Paperclip) }
        //   }
        // ]
      },
      {
        path: "/data/data-set",
        component: () => import("../views/subview/data/DataSetView.vue"),
        meta: { title: "数据集", icon: markRaw(Files) },
        redirect: "/data/data-set/label-train",
        children: [
          {
            path: "/data/data-set/label-train",
            component: () =>
              import("../views/subview/data/sub/dataset/LabelTrainView.vue"),
            meta: { title: "标注训练", icon: markRaw(Timer) }
          },
          {
            path: "/data/data-set/software-test",
            component: () =>
              import("../views/subview/data/sub/dataset/SoftwareTestView.vue"),
            meta: { title: "软件测试", icon: markRaw(HelpFilled) }
          }
        ]
      },
      {
        path: "/data/data-source",
        component: () => import("../views/subview/data/DataSourceView.vue"),
        meta: { title: "数据源", icon: markRaw(Reading) }
      },
      {
        path: "/data/data-process",
        component: () => import("../views/subview/data/DataSetView.vue"),
        meta: { title: "任务调度", icon: markRaw(Operation) },
        redirect: "/data/data-process/scheduled_task",
        children: [
          {
            path: "/data/data-process/scheduled_task",
            component: () =>
              import("../views/subview/data/sub/dataConfig/dataConfigPage.vue"),
            name: "cron",
            meta: { title: "定时处理", icon: markRaw(Timer) }
          },
          {
            path: "/data/data-process/batch_task",
            component: () =>
              import("../views/subview/data/sub/dataConfig/dataConfigPage.vue"),
            name: "offline",
            meta: { title: "离线处理", icon: markRaw(HelpFilled) }
          }
          // {
          //   path: "/data/data-process/stream_task",
          //   component: () =>
          //     import("../views/subview/data/sub/dataConfig/dataConfigPage.vue"),
          //   name: "realtime",
          //   meta: { title: "实时处理", icon: markRaw(Loading) },
          // },
        ]
      },
      {
        path: "/data/image-management",
        component: () => import("../views/subview/data/DataSetView.vue"),
        meta: { title: "镜像管理", icon: markRaw(CopyDocument) },
        redirect: "/data/image-management/docker_repository",
        children: [
          {
            path: "/data/image-management/docker_repository",
            component: () =>
              import("../views/subview/data/sub/dataConfig/dataConfigPage.vue"),
            name: "repository",
            meta: { title: "镜像仓库", icon: markRaw(Wallet) }
          },
          {
            path: "/data/image-management/docker",
            component: () =>
              import("../views/subview/data/sub/dataConfig/dataConfigPage.vue"),
            name: "construct",
            meta: { title: "镜像构建", icon: markRaw(HelpFilled) }
          },
          {
            path: "/data/image-management/template_images",
            component: () =>
              import("../views/subview/data/sub/dataConfig/dataConfigPage.vue"),
            name: "images",
            meta: { title: "镜像管理", icon: markRaw(Document) }
          }
        ]
      },
      {
        path: "/data/project_group",
        component: () => import("../views/subview/data/DataSetView.vue"),
        meta: { title: "项目组", icon: markRaw(Box) },
        redirect: "/data/project_group/job_template_group",
        children: [
          {
            path: "/data/project_group/org_group",
            component: () =>
              import("../views/subview/data/sub/dataConfig/dataConfigPage.vue"),
            name: "org_group",
            meta: { title: "项目分组", icon: markRaw(MessageBox) }
          },
          {
            path: "/data/project_group/job_template_group",
            component: () =>
              import("../views/subview/data/sub/dataConfig/dataConfigPage.vue"),
            name: "job_template_group",
            meta: { title: "模板分类", icon: markRaw(PieChart) }
          },
          {
            path: "/data/project_group/model_group",
            component: () =>
              import("../views/subview/data/sub/dataConfig/dataConfigPage.vue"),
            name: "model_group",
            meta: { title: "模型分组", icon: markRaw(DocumentAdd) }
          }
        ]
      },
      // {
      //   path: "/data/train_template",
      //   component: () => import("../views/subview/data/DataSetView.vue"),
      //   meta: { title: "模板开发", icon: markRaw(Filter) },
      //   redirect: "/data/train_template/job_template",
      //   children: [
      //     {
      //       path: "/data/train_template/job_template",
      //       component: () =>
      //         import(
      //           "../views/subview/data/sub/dataConfigPage/dataConfigList.vue"
      //         ),
      //       name: "job_template",
      //       meta: { title: "任务模板", icon: markRaw(Timer) },
      //     },
      //   ],
      // },
      {
        path: "/data/service_inferenceservice",
        component: () => import("../views/subview/data/DataSetView.vue"),
        meta: { title: "推理服务", icon: markRaw(PriceTag) },
        redirect: "/data/service_inferenceservice/model_manager",
        children: [
          {
            path: "/data/service_inferenceservice/model_manager",
            component: () =>
              import("../views/subview/data/sub/dataConfig/dataConfigPage.vue"),
            name: "model_manager",
            meta: { title: "模型管理", icon: markRaw(FolderChecked) }
          }
          // 暂时不加
          // {
          //   path: "/data/service_inferenceservice/inferenceservice_manager",
          //   component: () =>
          //     import(
          //       "../views/subview/data/sub/dataConfigPage/dataConfigList.vue"
          //     ),
          //   name: "inferenceservice_manager",
          //   meta: { title: "服务上线", icon: markRaw(Timer) },
          // },
        ]
      },
      {
        path: "/data/train_template",
        component: () => import("../views/subview/data/DataSetView.vue"),
        meta: { title: "任务开发", icon: markRaw(Filter) },
        redirect: "/data/train_template/argo",
        children: [
          {
            path: "/data/train_template/argo",
            component: () =>
              import("../views/subview/data/sub/dataConfig/dataConfigPage.vue"),
            name: "argo",
            meta: { title: "Argo", icon: markRaw(Cpu) }
          }
        ]
      },
      {
        path: "/data/code_development",
        component: () => import("../views/subview/data/DataSetView.vue"),
        meta: { title: "代码开发", icon: markRaw(Filter) },
        redirect: "/data/code_development/notebook",
        children: [
          {
            path: "/data/code_development/notebook",
            component: () =>
              import("../views/subview/data/sub/dataConfig/dataConfigPage.vue"),
            name: "notebook",
            meta: { title: "notebook", icon: markRaw(Cpu) }
          }
        ]
      }
      // {
      //   path: "/data/video-data",
      //   component: () => import("../views/subview/data/VideoDataView.vue"),
      //   meta: { title: "视频数据管理", icon: markRaw(VideoCamera) },
      // },
      // {
      //   path: "/data/image-data",
      //   component: () => import("../views/subview/data/ImageDataView.vue"),
      //   meta: { title: "图片数据管理", icon: markRaw(Picture) },
      // },
      // {
      //   path: "/data/mark-data",
      //   component: () => import("../views/subview/data/MarkDataView.vue"),
      //   meta: { title: "标注数据管理", icon: markRaw(EditPen) },
      // },
      // {
      //   path: "/data/driving-data",
      //   component: () => import("../views/subview/data/DrivingDataView.vue"),
      //   meta: { title: "行车数据管理", icon: markRaw(List) },
      // },
      // {
      //   path: "/data/parking-data",
      //   component: () => import("../views/subview/data/ParkingDataView.vue"),
      //   meta: { title: "泊车数据管理", icon: markRaw(Document) },
      // },
    ]
  },
  {
    path: "/collect",
    name: "collect",
    meta: { title: "采集平台" },
    component: () => import("../views/CollectView.vue"),
    redirect: "/collect/board",
    children: [
      {
        path: "/collect/board",
        component: () =>
          import("../views/subview/collect/CollectBoardView.vue"),
        meta: { title: "平台看板", icon: markRaw(DataBoard) }
      },
      // {
      //   path: "/collect/collect-task",
      //   component: () => import("../views/subview/collect/CollectTaskView.vue"),
      //   meta: { title: "采集任务管理", icon: markRaw(Cpu) },
      //   redirect: "/collect/collect-task/list",
      //   children: [
      //     {
      //       path: "/collect/collect-task/list",
      //       component: () =>
      //         import("../views/subview/collect/sub/TaskShow.vue"),
      //       meta: { title: "采集任务列表" },
      //     },
      //     {
      //       name: "collect-task-details",
      //       path: "/collect/collect-task/details/:id",
      //       component: () =>
      //         import("../views/subview/collect/sub/TaskDetails.vue"),
      //       meta: { title: "采集任务详情" },
      //     },
      //   ],
      // },
      // {
      //   path: "/collect/data-management",
      //   component: () =>
      //     import("../views/subview/collect/DataManagementView.vue"),
      //   meta: { title: "任务数据管理", icon: markRaw(DataLine) },
      //   redirect: "/collect/data-management/list",
      //   children: [
      //     {
      //       path: "/collect/data-management/list",
      //       component: () =>
      //         import("../views/subview/collect/sub/SearchData.vue"),
      //       meta: { title: "任务数据列表" },
      //     },
      //     {
      //       name: "data-management-details",
      //       path: "/collect/data-management/details/:id",
      //       component: () =>
      //         import("../views/subview/collect/sub/DataDetails.vue"),
      //       meta: { title: "任务数据详情" },
      //     },
      //   ],
      // },
      {
        path: "/collect/timeline",
        component: () =>
          import("../views/subview/collect/TimelineTaskView.vue"),
        meta: { title: "标注任务管理", icon: markRaw(Timer) },
        redirect: "/collect/timeline/list",
        children: [
          {
            path: "/collect/timeline/list",
            component: () =>
              import("../views/subview/collect/sub/TimeLineTaskShow.vue"),
            meta: { title: "标注任务列表" }
          }
          // {
          //   name: "timeline-task-details",
          //   path: "/collect/timeline/details",
          //   component: () =>
          //     import("../views/subview/mark/MarkResultsView.vue"),
          //   // component: () =>
          //   //   import("../views/subview/collect/sub/TimeLineTaskDetails.vue"),
          //   meta: { title: "标注任务详情" },
          // },
        ]
      },
      // {
      //   path: "/collect/data-statistical",
      //   component: () =>
      //     import("../views/subview/collect/DataStatisticsView.vue"),
      //   meta: { title: "任务数据统计", icon: markRaw(DataAnalysis) },
      // },
      {
        path: "/collect/vehicle-management",
        component: () =>
          import("../views/subview/collect/VehicleManagementView.vue"),
        meta: { title: "车辆管理", icon: markRaw(List) }
      },
      {
        path: "/collect/sensor-management",
        component: () =>
          import("../views/subview/collect/SensorManagementView.vue"),
        meta: { title: "传感器管理", icon: markRaw(Link) }
      }
    ]
  },
  {
    path: "/mark",
    name: "mark",
    meta: { title: "标注平台" },
    component: () => import("../views/MarkView.vue"),
    redirect: "/mark/board",
    children: [
      {
        path: "/mark/board",
        component: () => import("../views/subview/mark/MarkBoardView.vue"),
        meta: { title: "平台看板", icon: markRaw(DataBoard) }
      },
      {
        path: "/mark/pick-figure",
        component: () => import("../views/subview/mark/PickFigureTaskView.vue"),
        meta: { title: "挑图任务管理", icon: markRaw(EditPen) }
      },
      // {
      //   path: "/mark/tagging-task",
      //   component: () => import("../views/subview/mark/TaggingTaskView.vue"),
      //   meta: { title: "图片标注任务管理", icon: markRaw(Flag) },
      // },
      {
        path: "/mark/timeline",
        component: () => import("../views/subview/mark/AnnotationTaskView.vue"),
        meta: { title: "标注任务", icon: markRaw(Timer) }
      },
      // {
      //   name: "mark-detailed",
      //   path: "/mark/detailed",
      //   component: () =>
      //     import("../views/subview/mark/DetailedLabelingView.vue"),
      //   meta: { title: "详细标注", icon: markRaw(View) },
      // },
      {
        path: "/mark/data",
        component: () => import("../views/subview/mark/TaggingDataView.vue"),
        meta: { title: "标注数据管理", icon: markRaw(DataAnalysis) }
      },
      // {
      //   path: "/mark/statistics",
      //   component: () =>
      //     import("../views/subview/mark/TaggingStatisticsView.vue"),
      //   meta: { title: "标注数据统计", icon: markRaw(DataLine) },
      // },
      {
        path: "/mark/label",
        component: () =>
          import("../views/subview/mark/LabelManagementView.vue"),
        meta: { title: "标签管理", icon: markRaw(AddLocation) }
      }
    ]
  },
  {
    path: "/permissions",
    name: "permissions",
    meta: { title: "权限管理平台" },
    component: () => import("../views/PermissionsManagementView.vue"),
    redirect: "/permissions/user",
    children: [
      {
        path: "/permissions/user",
        component: () =>
          import("../views/subview/permissions/UserManagementView.vue"),
        meta: { title: "用户管理", icon: markRaw(User) }
      },
      {
        path: "/permissions/role",
        component: () =>
          import("../views/subview/permissions/RoleManagementView.vue"),
        meta: { title: "角色管理", icon: markRaw(UserFilled) }
      },
      {
        path: "/permissions/menu",
        component: () =>
          import("../views/subview/permissions/MenuManagementView.vue"),
        meta: { title: "菜单管理", icon: markRaw(Menu) }
      },
      {
        path: "/permissions/department",
        component: () =>
          import("../views/subview/permissions/DepartmentManagementView.vue"),
        meta: { title: "部门管理", icon: markRaw(House) }
      },
      {
        path: "/permissions/api",
        component: () =>
          import(
            "../views/subview/permissions/APIPermissionManagementView.vue"
          ),
        meta: { title: "API权限管理", icon: markRaw(Coin) }
      },
      {
        path: "/permissions/login",
        component: () =>
          import("../views/subview/permissions/LoginlogView.vue"),
        meta: { title: "登录日志", icon: markRaw(Document) }
      },
      {
        path: "/permissions/dictionary",
        component: () =>
          import("../views/subview/permissions/DictionaryManagementView.vue"),
        meta: { title: "字典管理", icon: markRaw(Tickets) }
      },
      {
        path: "/permissions/fileRole",
        component: () =>
          import("../views/subview/permissions/FileRoleManagementView.vue"),
        meta: { title: "文件权限管理", icon: markRaw(Tickets) }
      },
      {
        path: "/permissions/configuration",
        component: () =>
          import("../views/subview/permissions/SystemConfigurationView.vue"),
        meta: { title: "系统配置", icon: markRaw(SetUp) }
      }
    ]
  },
  {
    path: "/question",
    name: "question",
    meta: { title: "问题收集平台" },
    component: () => import("../views/dataView.vue"),
    redirect: "/question/collect",
    children: [
      {
        path: "/question/collect",
        component: () =>
          import("../views/subview/data-statistics/dataStatisticsView.vue"),
        meta: { title: "数据展示", icon: markRaw(User) }
      }
    ]
  },
  {
    path: "/login",
    name: "login",
    component: () => import("../views/LoginView.vue")
  },
  {
    name: "taskDetail",
    path: "/data/data-process/task-detail",
    component: () =>
      import("../views/subview/data/sub/dataConfig/taskDetail.vue"),
    meta: { title: "任务流详情", icon: markRaw(List) }
  },
  {
    name: "taskIframe",
    path: "/data/data-process/task-iframe",
    component: () =>
      import("../views/subview/data/sub/dataConfig/taskIframe.vue"),
    meta: { title: "任务详情", icon: markRaw(List) }
  },
  {
    name: "timeline-task-details",
    path: "/collect/timeline/details",
    component: () => import("../views/subview/mark/MarkResultsView.vue"),
    // component: () =>
    //   import("../views/subview/collect/sub/TimeLineTaskDetails.vue"),
    meta: { title: "标注任务详情" }
  },
  {
    path: "/:pathMatch(.*)*",
    name: "/404",
    component: () => import("../views/NotFoundView.vue")
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: constantRoutes
});

router.beforeEach((to, from, next) => {
  const store = useStateStore();
  if (store.getUser || to.path === "/login") {
    next();
  } else {
    next("/login");
    store.setEmpty();
  }
});
export default router;
