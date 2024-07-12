import { reactive } from "vue";
import { getData, getAllUserData } from "@/utils/axios";
import { envtag_getalltag, user_list } from "@/utils/urlset";

export const eventTagStore = reactive({
  firstSrcTag: [] as any[],
  srcTag: [] as any[],
  allTag: [] as any[],
  tag2TypeMap: new Map(),
  tagId2NameMap: new Map(),

  fmtImageTags(data) {
    const tagsMap = new Map();
    data.forEach((ele) => {
      const typeName = this.tag2TypeMap.get(ele.tag_id);
      if (undefined == tagsMap.get(typeName)) {
        const datas: any[] = [];
        datas.push(ele);
        tagsMap.set(typeName, datas);
      } else {
        const value = tagsMap.get(typeName);
        value.push(ele);
      }
    });
    return tagsMap;
  },

  compare(obj1, obj2) {
    const val1 = obj1.type;
    const val2 = obj2.type;
    if (val1 < val2) {
      return -1;
    } else if (val1 > val2) {
      return 1;
    } else {
      return 0;
    }
  },
  compare1(obj1, obj2) {
    const val1 = obj1.names;
    const val2 = obj2.names;
    if (val1 < val2) {
      return -1;
    } else if (val1 > val2) {
      return 1;
    } else {
      return 0;
    }
  },

  randomRgb() {
    const R = Math.floor(Math.random() * 150);
    const G = Math.floor(Math.random() * 150);
    const B = Math.floor(Math.random() * 150);

    return "rgb(" + R + "," + G + "," + B + ")";
  },

  getTagData() {
    if (this.allTag.length > 0) {
      return;
    }

    getData(envtag_getalltag, { id: 0 }, (data: any) => {
      const value = data.data.data;
      value.sort(this.compare);
      value.forEach((item) => {
        item.color = this.randomRgb();
        item.tags.sort(this.compare1);
        item.tags.forEach((tag: any) => {
          this.allTag.push(tag.id);
          this.tag2TypeMap.set(tag.id, item.type);
          this.tagId2NameMap.set(tag.id, tag.names);
        });
      });
      this.srcTag = value;
      this.firstSrcTag = this.srcTag.slice(0, 1);
    });
  },
});

export const userListStore = reactive({
  userOptions: [] as any,
  getData() {
    if (this.userOptions.length > 0) {
      return;
    }
    getAllUserData(
      user_list,
      {
        page: 1,
        page_size: 10,
      },
      (data: any) => {
        this.userOptions = data;
      }
    );
  },
});
