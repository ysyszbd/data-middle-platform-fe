import { mapping_relation_data } from "@/components/dataSub/config/configData";
import { useStateStore } from "@/stores/state";
import { formatDate } from "@/utils/util";
import {
  getTemplateSelect,
  getProjectSelect,
  getRepositorySelect,
  getImagesSelect,
  getScheduleSelect,
} from "@/axios/taskAPIs";
const store = useStateStore();

// 处理cube表单规则
export function handleRules(item) {
  // console.log(item, "item");

  const obj: { [key: string]: any } = {};
  const sign = item?.validators.findIndex((val) => {
    return val.type === "DataRequired";
  });
  if (sign >= 0) {
    obj.required = item.required;
    obj.trigger = "change";
    const resRegIndex = item.validators.findIndex((val) => {
      return val.type === "Regexp";
    });
    obj.validator = (rule: any, value: any, callback: any) => {
      if (!value) {
        return callback(new Error(`请输入${item.label}！`));
      } else {
        if (item.name === "dag_json") {
          if (typeof value == "string") {
            try {
              if (typeof JSON.parse(value) == "object") {
                callback();
              }
            } catch (e) {
              callback(new Error("请按输入json格式！"));
            }
          }
        }
        if (resRegIndex >= 0) {
          const reg = new RegExp(item.validators[resRegIndex].regex);
          if (!reg.test(value)) {
            callback(new Error("请按正确的规则输入"));
          } else {
            callback();
          }
        } else {
          callback();
        }
      }
    };
    return obj;
  }
}
// 返回cube规则的最大最小长度值
export function handleLength(val) {
  if (!val || !val.length) {
    return {
      min: null,
      max: null,
    };
  }
  const lenIndex = val.findIndex((val) => {
    return val.type === "Length";
  });
  if (lenIndex >= 0) {
    return {
      min: val[lenIndex].min,
      max: val[lenIndex].max,
    };
  } else {
    return {
      min: null,
      max: null,
    };
  }
}

/**
 * @description: 在二维数组中找对应元素下标
 * @param {*} arr   二维数组
 * @param {*} sign  ZA
 * @param {*} key   要匹配的参数值
 * @return {*}
 */
export function getIndex(arr, sign, key) {
  const _i = arr.findIndex((ele) => {
    return ele[sign] === key;
  });
  return {
    i: _i,
  };
}

/**
 * @description: 处理各页面的默认值
 * @param {*} Keyword  页面关键字
 * @return {*}  不同页面需要的数据
 */
export function handleDefault(Keyword) {
  if (mapping_relation_data[Keyword]) {
    return mapping_relation_data[Keyword];
  }
  if (Keyword === "repository") {
    return `${store.getUser}-hubsecret`;
  }
  if (Keyword === "construct") {
    return `ccr.ccs.tencentyun.com/cube-studio/${store.getUser}:${formatDate(
      new Date(),
      "."
    )}.1`;
  }
}
export async function getSelect(key, Keyword) {
  console.log(key, Keyword, "key, Keyword");
  const select_obj = {
    template_id: Keyword === "cron" ? getScheduleSelect : getTemplateSelect,
    project: getProjectSelect,
    project_id: getProjectSelect,
    images_id: getImagesSelect,
    repository_id: getRepositorySelect,
  };
  if (!select_obj[key]) return;
  let params: any = {
    types: ["selector", "relation"],
    relations: [
      Keyword !== "cron" ? `${key}-org` : "argo_workflow_template",
    ],
    keyword: key === "project" || key === "project_id" ? "org" : null,
  };

  const res = await select_obj[key](params);
  if (Keyword === "cron") {
    return res.list.relation.argo_workflow_template.selector;
  } else {
    return res.list.selector;
  }
}
