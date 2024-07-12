// 任务调度--定时处理
const cron = {
  label_title: "定时处理",
  list_columns: [
    "id",
    "name",
    "type",
    "template_id",
    "created_at",
    "updated_at",
  ],
  label_columns: {
    created_at: "创建时间",
    updated_at: "修改时间",
    type: "任务类型",
    process_type: "执行类型",
    template_id: "模板ID",
    instance_id: "实例ID",
    cron: "任务Cron表达式",
    cron_start_time: "定时任务开始时间",
  },
  show_columns: [
    "id",
    "name",
    "type",
    "status",
    "process_type",
    "template_id",
    "instance_id",
    "cron",
    "cron_start_time",
    "max_active_runs",
    "expired_limit",
  ],
  edit_fieldsets: [
    {
      expanded: true,
      group: "第一步",
      fields: [
        "name",
        "type",
        "process_type",
        "template_id",
        "cron",
        "cron_start_time",
        "max_active_runs",
        "expired_limit",
      ],
    },
    {
      expanded: true,
      group: "第二步",
      fields: [
        "namespace",
        "global_env",
        "node_selector",
        "image_pull_policy",
        "parallelism",
        "parameter",
        "task_name",
        "schedule_type",
      ],
    },
    {
      expanded: true,
      group: "第三步",
      fields: [
        "name",
        "accounts",
        "args",
        "entrypoint",
        "env",
        "expand",
        "node_selector",
        "resource_cpu",
        "resource_gpu",
        "resource_memory",
        "version",
        "volume_mount",
        "work_dir",
      ],
    },
  ],
  add_fieldsets: [
    {
      expanded: true,
      group: "第一步",
      fields: [
        "name",
        "type",
        "process_type",
        "template_id",
        "cron",
        "cron_start_time",
        "max_active_runs",
        "expired_limit",
      ],
    },
    {
      expanded: true,
      group: "第二步",
      fields: [
        "namespace",
        "global_env",
        "node_selector",
        "image_pull_policy",
        "parallelism",
        "parameter",
        "task_name",
        "schedule_type",
      ],
      // task_name【未知--等文档】 和 schedule_type【任务类型】需要手动填入
    },
    {
      expanded: true,
      group: "第三步",
      fields: [
        "accounts",
        "args",
        "describe",
        "entrypoint",
        "env",
        "expand",
        "name",
        "node_selector",
        "resource_cpu",
        "resource_gpu",
        "resource_memory",
        "version",
        "volume_mount",
        "work_dir",
      ],
    },
  ],
  edit_columns: [
    {
      name: "expired_limit",

      label: "失效限制",
      description: "",
      validators: [
        { type: "Length", min: 1, max: 32 },
        { type: "DataRequired" },
      ],

      values: null,
      type: "Int",
      required: false,

      default: "",

      "ui-type": "input",
    },
    {
      name: "max_active_runs",

      label: "最大激活运行数",
      description: "",
      validators: [
        { type: "Length", min: 1, max: 32 },
        { type: "DataRequired" },
      ],

      values: null,
      type: "Int",
      required: false,

      default: "",

      "ui-type": "input",
    },
    {
      name: "id",

      label: "ID",
      description: "",
      validators: [{ type: "DataRequired" }],

      values: null,
      type: "String",
      disabled: true,
      required: false,

      default: "",

      "ui-type": "input",
    },
    {
      name: "name",

      label: "任务名称",
      description: "英文名(小写字母、数字、- 组成)，最长50个字符",
      validators: [
        { type: "Regexp", regex: "^[a-z][a-z0-9-]*[a-z0-9]$" },
        { type: "Length", min: 1, max: 54 },
        { type: "DataRequired" },
      ],

      values: null,
      type: "String",
      required: true,

      default: "",

      "ui-type": "input",
    },
    {
      name: "type",

      label: "任务类型",
      description: "",
      validators: [],

      values: null,
      type: "String",
      disabled: true,
      required: false,

      default: "",

      "ui-type": "input",
    },
    {
      name: "process_type",

      label: "执行类型",
      description: "",
      validators: [{ type: "DataRequired" }],

      values: [
        {
          id: "argoWorkflow",
          value: "argoWorkflow",
        },
        {
          id: "job",
          value: "job",
        },
      ],
      type: "String",
      // disabled: true,
      required: true,

      default: "argoWorkflow",

      "ui-type": "select",
    },
    {
      name: "describe",

      label: "任务描述",
      description: "中文描述",
      validators: [{ type: "DataRequired" }],

      values: null,
      type: "String",
      required: true,

      default: "",

      "ui-type": "input",
    },
    {
      name: "template_id",

      label: "模板",
      description: "",
      validators: [{ type: "DataRequired" }],

      values: null,
      type: "Select",
      required: true,

      default: "",

      "ui-type": "select",
    },
    {
      name: "cron",

      label: "任务Cron表达式",
      description: "",
      validators: [{ type: "DataRequired" }],

      values: null,
      type: "String",
      required: false,

      default: "",

      "ui-type": "input",
    },
    {
      name: "cron_start_time",

      label: "定时任务开始时间",
      description: "格式：yyyy-mm-dd hh-mm-ss  例子：2006-01-02 15:04:05",
      validators: [{ type: "DataRequired" }],

      values: null,
      type: "String",
      required: false,

      default: "2006-01-02 15:04:05",

      "ui-type": "input",
    },
    {
      name: "max_active_runs",

      label: "最大激活运行数",
      description: "",
      validators: [{ type: "DataRequired" }],

      values: null,
      type: "String",
      required: false,

      default: "",

      "ui-type": "input",
    },
    {
      name: "namespace",

      label: "命名空间",
      description: "",
      validators: [{ type: "DataRequired" }],

      visabled: true,
      ralues: null,
      type: "String",
      required: false,

      default: "",

      "ui-type": "input",
    },
    {
      name: "global_env",

      label: "全局环境变量",
      description: "",
      validators: [
        { type: "DataRequired" },
        { type: "Length", min: null, max: 54545 },
      ],

      ralues: null,
      type: "String",
      required: false,

      default: "",

      "ui-type": "textArea",
    },
    {
      name: "node_selector",

      label: "节点选择",
      description: "",
      validators: [
        { type: "DataRequired" },
        { type: "Length", min: null, max: 54545 },
      ],

      ralues: null,
      type: "String",
      dequired: false,
      required: false,
      default: "",

      "ui-type": "input",
    },
    {
      name: "image_pull_policy",

      label: "镜像拉取策略",
      description: "",
      validators: [
        { type: "DataRequired" },
        { type: "Length", min: null, max: 54545 },
      ],

      ralues: null,
      type: "String",
      disabled: true,
      required: false,

      default: "",

      "ui-type": "input",
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
    {
      name: "expand",

      label: "扩展",
      description: "",
      validators: [
        { type: "DataRequired" },
        { type: "Length", min: null, max: 65536 },
      ],

      ralues: null,
      type: "String",
      required: false,

      default: "",

      "ui-type": "textArea",
    },
    {
      name: "parameter",

      label: "扩展参数",
      description: "",
      validators: [{ type: "Length", min: null, max: 65536 }],
      values: "",

      ralues: null,
      type: "Text",
      required: true,

      default: "",

      "ui-type": "textArea",
    },
    {
      name: "task_name",

      label: "task_name",
      description: "",
      validators: [[{ type: "Length", min: null, max: 65536 }]],

      values: null,
      type: "String",
      required: false,

      default: "{}",

      "ui-type": "input",
    },
    {
      name: "schedule_type",

      label: "任务类型",
      description: "",
      validators: [[{ type: "Length", min: null, max: 65536 }]],

      values: null,
      type: "String",
      disabled: true,
      required: false,

      default: "{}",

      "ui-type": "input",
    },
    {
      name: "accounts",

      label: "K8s账号",
      description:
        "k8s的ServiceAccount，在此类任务运行时会自动挂载此账号，多用于模板用于k8s pod/cr时使用",
      validators: null,

      values: null,
      type: "String",
      required: false,

      default: "",

      "ui-type": "input",
    },
    {
      name: "args",

      label: "启动参数",
      description:
        'json格式，此类task使用时需要填写的参数，示例：<br><pre><code>{\n    "group1":{               # 参数分组，仅做web显示使用\n       "--attr1":{           # 参数名\n        "type":"str",        # int,str,text,bool,enum,float,multiple,date,datetime,file,dict,list,json\n        "item_type": "",     # 在type为enum,multiple,list时每个子参数的类型\n        "label":"参数1",      # 中文名\n        "require":1,         # 是否必须\n        "choice":[],         # type为enum/multiple时，可选值\n        "range":"$min,$max", # 最小最大取值，在int,float时使用，包含$min，但是不包含$max\n        "default":"",        # 默认值\n        "placeholder":"",    # 输入提示内容\n        "describe":"这里是这个参数的描述和备注",\n        "editable":1,        # 是否可修改\n        "condition":"",      # 显示的条件\n        "sub_args": {        # 如果type是dict或者list对应下面的参数\n        }\n      },\n      "attr2":{\n       ...\n      }\n    },\n    "group2":{\n    }\n}</code></pre>',
      validators: [{ type: "DataRequired" }],

      values: null,
      type: "String",
      required: false,

      default:
        '{\n    "参数分组1": {\n        "--attr1": {\n            "type": "str",\n            "label": "参数1",\n            "default": "value1",\n            "describe": "这里是这个参数的描述和备注"\n        }\n    }\n}',

      "ui-type": "textArea",
    },
    {
      name: "entrypoint",

      label: "启动命令",
      description:
        "镜像的入口命令，直接写成单行字符串，例如python xx.py，无需添加[]",
      validators: [{ type: "Length", min: null, max: 200 }],

      values: null,
      type: "String",
      required: false,

      default: "",

      "ui-type": "input",
    },
    {
      name: "env",

      label: "环境变量",
      description:
        "使用模板的task自动添加的环境变量，支持模板变量。<br>书写格式:每行一个环境变量env_key=env_value",
      validators: [{ type: "Length", min: null, max: null }],

      values: null,
      type: "String",
      required: false,

      default: "",

      "ui-type": "textArea",
    },
    {
      name: "resource_cpu",

      label: "cpu申请",
      description: "",
      validators: [{ type: "Length", min: null, max: null }],

      values: null,
      type: "String",
      required: false,

      default: "",

      "ui-type": "input",
    },
    {
      name: "resource_gpu",

      label: "gpu申请",
      description: "",
      validators: [{ type: "Length", min: null, max: null }],

      values: null,
      type: "String",
      required: false,

      default: "",

      "ui-type": "input",
    },
    {
      name: "resource_memory",

      label: "内存申请",
      description: "",
      validators: [{ type: "Length", min: null, max: null }],

      values: null,
      type: "String",
      required: false,

      default: "",

      "ui-type": "input",
    },
    {
      name: "version",

      label: "版本",
      description: "",
      validators: [{ type: "Length", min: null, max: null }],

      values: null,
      type: "String",
      required: false,

      default: "",

      "ui-type": "input",
    },
    {
      name: "volume_mount",

      label: "挂载目录",
      description:
        "使用该模板的task，会在添加时，自动添加该挂载。<br>外部挂载，格式示例:$pvc_name1(pvc):/$container_path1,$hostpath1(hostpath):/$container_path2,4G(memory):/dev/shm,注意pvc会自动挂载对应目录下的个人rtx子目录",
      validators: [{ type: "Length", min: null, max: 400 }],

      values: null,
      type: "String",
      required: false,

      default: "",

      "ui-type": "input",
    },
    {
      name: "work_dir",

      label: "工作目录",
      description: "工作目录，不填写将直接使用镜像默认的工作目录",
      validators: [{ type: "Length", min: null, max: 400 }],

      values: null,
      type: "String",
      required: false,

      default: "",

      "ui-type": "input",
    },
  ],
  add_columns: [
    {
      name: "describe",

      label: "任务描述",
      description: "中文描述",
      validators: [{ type: "DataRequired" }],

      values: null,
      type: "String",
      required: true,

      default: "",

      "ui-type": "input",
    },
    {
      name: "expired_limit",

      label: "失效限制",
      description: "",
      validators: [
        { type: "Length", min: 1, max: 32 },
        { type: "DataRequired" },
      ],

      values: null,
      type: "Int",
      required: false,

      default: "",

      "ui-type": "input",
    },
    {
      name: "max_active_runs",

      label: "最大激活运行数",
      description: "",
      validators: [
        { type: "Length", min: 1, max: 32 },
        { type: "DataRequired" },
      ],

      values: null,
      type: "Int",
      required: false,

      default: "",

      "ui-type": "input",
    },
    {
      name: "id",

      label: "ID",
      description: "",
      validators: [{ type: "DataRequired" }],

      values: null,
      type: "String",
      disabled: true,
      required: false,

      default: "",

      "ui-type": "input",
    },
    {
      name: "name",

      label: "任务名称",
      description: "英文名(小写字母、数字、- 组成)，最长50个字符",
      validators: [
        { type: "Regexp", regex: "^[a-z][a-z0-9-]*[a-z0-9]$" },
        { type: "Length", min: 1, max: 54 },
        { type: "DataRequired" },
      ],

      values: null,
      type: "String",
      required: true,

      default: "",

      "ui-type": "input",
    },
    {
      name: "type",

      label: "任务类型",
      description: "",
      validators: [],

      values: null,
      type: "String",
      disabled: true,
      required: false,

      default: "",

      "ui-type": "input",
    },
    {
      name: "process_type",

      label: "执行类型",
      description: "",
      validators: [{ type: "DataRequired" }],

      values: [
        {
          id: "argoWorkflow",
          value: "argoWorkflow",
        },
        {
          id: "job",
          value: "job",
        },
      ],
      type: "String",
      // disabled: true,
      required: true,

      default: "argoWorkflow",

      "ui-type": "select",
    },
    {
      name: "template_id",

      label: "模板",
      description: "",
      validators: [{ type: "DataRequired" }],

      values: null,
      type: "Select",
      required: true,

      default: "",

      "ui-type": "select",
    },
    {
      name: "cron",

      label: "任务Cron表达式",
      description: "",
      validators: [{ type: "DataRequired" }],

      values: null,
      type: "String",
      required: false,

      default: "",

      "ui-type": "input",
    },
    {
      name: "cron_start_time",

      label: "定时任务开始时间",
      description: "格式：yyyy-mm-dd hh-mm-ss  例子：2006-01-02 15:04:05",
      validators: [{ type: "DataRequired" }],

      values: null,
      type: "String",
      required: false,

      default: "2006-01-02 15:04:05",

      "ui-type": "input",
    },
    {
      name: "max_active_runs",

      label: "最大激活运行数",
      description: "",
      validators: [{ type: "DataRequired" }],

      values: null,
      type: "String",
      required: false,

      default: "",

      "ui-type": "input",
    },
    {
      name: "namespace",

      label: "命名空间",
      description: "",
      validators: [{ type: "DataRequired" }],

      visabled: true,
      ralues: null,
      type: "String",
      required: false,

      default: "",

      "ui-type": "input",
    },
    {
      name: "global_env",

      label: "全局环境变量",
      description: "",
      validators: [
        { type: "DataRequired" },
        { type: "Length", min: null, max: 54545 },
      ],

      ralues: null,
      type: "String",
      required: false,

      default: "",

      "ui-type": "textArea",
    },
    {
      name: "node_selector",

      label: "节点选择",
      description: "",
      validators: [
        { type: "DataRequired" },
        { type: "Length", min: null, max: 54545 },
      ],

      ralues: null,
      type: "String",
      dequired: false,
      required: false,
      default: "",

      "ui-type": "input",
    },
    {
      name: "image_pull_policy",

      label: "镜像拉取策略",
      description: "",
      validators: [
        { type: "DataRequired" },
        { type: "Length", min: null, max: 54545 },
      ],

      ralues: null,
      type: "String",
      disabled: true,
      required: false,

      default: "",

      "ui-type": "input",
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
    {
      name: "expand",

      label: "扩展",
      description: "",
      validators: [
        { type: "DataRequired" },
        { type: "Length", min: null, max: 65536 },
      ],

      ralues: null,
      type: "String",
      required: false,

      default: "",

      "ui-type": "textArea",
    },
    {
      name: "parameter",

      label: "扩展参数",
      description: "",
      validators: [{ type: "Length", min: null, max: 65536 }],
      values: "",

      ralues: null,
      type: "Text",
      required: true,

      default: "",

      "ui-type": "textArea",
    },
    {
      name: "task_name",

      label: "task_name",
      description: "",
      validators: [[{ type: "Length", min: null, max: 65536 }]],

      values: null,
      type: "String",
      required: false,

      default: "{}",

      "ui-type": "input",
    },
    {
      name: "schedule_type",

      label: "任务类型",
      description: "",
      validators: [[{ type: "Length", min: null, max: 65536 }]],

      values: null,
      type: "String",
      disabled: true,
      required: false,

      default: "{}",

      "ui-type": "input",
    },
    {
      name: "accounts",

      label: "K8s账号",
      description:
        "k8s的ServiceAccount，在此类任务运行时会自动挂载此账号，多用于模板用于k8s pod/cr时使用",
      validators: null,

      values: null,
      type: "String",
      required: false,

      default: "",

      "ui-type": "input",
    },
    {
      name: "args",

      label: "启动参数",
      description:
        'json格式，此类task使用时需要填写的参数，示例：<br><pre><code>{\n    "group1":{               # 参数分组，仅做web显示使用\n       "--attr1":{           # 参数名\n        "type":"str",        # int,str,text,bool,enum,float,multiple,date,datetime,file,dict,list,json\n        "item_type": "",     # 在type为enum,multiple,list时每个子参数的类型\n        "label":"参数1",      # 中文名\n        "require":1,         # 是否必须\n        "choice":[],         # type为enum/multiple时，可选值\n        "range":"$min,$max", # 最小最大取值，在int,float时使用，包含$min，但是不包含$max\n        "default":"",        # 默认值\n        "placeholder":"",    # 输入提示内容\n        "describe":"这里是这个参数的描述和备注",\n        "editable":1,        # 是否可修改\n        "condition":"",      # 显示的条件\n        "sub_args": {        # 如果type是dict或者list对应下面的参数\n        }\n      },\n      "attr2":{\n       ...\n      }\n    },\n    "group2":{\n    }\n}</code></pre>',
      validators: [{ type: "DataRequired" }],

      values: null,
      type: "String",
      required: false,

      default:
        '{\n    "参数分组1": {\n        "--attr1": {\n            "type": "str",\n            "label": "参数1",\n            "default": "value1",\n            "describe": "这里是这个参数的描述和备注"\n        }\n    }\n}',

      "ui-type": "textArea",
    },
    {
      name: "entrypoint",

      label: "启动命令",
      description:
        "镜像的入口命令，直接写成单行字符串，例如python xx.py，无需添加[]",
      validators: [{ type: "Length", min: null, max: 200 }],

      values: null,
      type: "String",
      required: false,

      default: "",

      "ui-type": "input",
    },
    {
      name: "env",

      label: "环境变量",
      description:
        "使用模板的task自动添加的环境变量，支持模板变量。<br>书写格式:每行一个环境变量env_key=env_value",
      validators: [{ type: "Length", min: null, max: null }],

      values: null,
      type: "String",
      required: false,

      default: "",

      "ui-type": "textArea",
    },
    {
      name: "resource_cpu",

      label: "cpu申请",
      description: "",
      validators: [{ type: "Length", min: null, max: null }],

      values: null,
      type: "String",
      required: false,

      default: "",

      "ui-type": "input",
    },
    {
      name: "resource_gpu",

      label: "gpu申请",
      description: "",
      validators: [{ type: "Length", min: null, max: null }],

      values: null,
      type: "String",
      required: false,

      default: "",

      "ui-type": "input",
    },
    {
      name: "resource_memory",

      label: "内存申请",
      description: "",
      validators: [{ type: "Length", min: null, max: null }],

      values: null,
      type: "String",
      required: false,

      default: "",

      "ui-type": "input",
    },
    {
      name: "version",

      label: "版本",
      description: "",
      validators: [{ type: "Length", min: null, max: null }],

      values: null,
      type: "String",
      required: false,

      default: "",

      "ui-type": "input",
    },
    {
      name: "volume_mount",

      label: "挂载目录",
      description:
        "使用该模板的task，会在添加时，自动添加该挂载。<br>外部挂载，格式示例:$pvc_name1(pvc):/$container_path1,$hostpath1(hostpath):/$container_path2,4G(memory):/dev/shm,注意pvc会自动挂载对应目录下的个人rtx子目录",
      validators: [{ type: "Length", min: null, max: 400 }],

      values: null,
      type: "String",
      required: false,

      default: "",

      "ui-type": "input",
    },
    {
      name: "work_dir",

      label: "工作目录",
      description: "工作目录，不填写将直接使用镜像默认的工作目录",
      validators: [{ type: "Length", min: null, max: 400 }],

      values: null,
      type: "String",
      required: false,

      default: "",

      "ui-type": "input",
    },
  ],
  cols_width: {
  },
};
export default cron;