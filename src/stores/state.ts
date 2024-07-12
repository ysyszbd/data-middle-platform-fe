/*
 * @Author: yinshunyu
 * @Date: 2023-01-13 10:16:17
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-07-18 13:48:11
 * @FilePath: \DataClient\src\stores\state.ts
 * @Description:
 *
 */
import { defineStore } from "pinia";
import CookieTool from "@/utils/cookie";

export const useStateStore = defineStore({
  id: "user",
  state: () => ({
    user: "",
    userId: "",
    userRoleIds: "",
    token: "",
    menus: "",
    albumBreadcrumb: [],
    timeLineTaskId: 0,
    drawTaskData: {
      album_id: -1,
      task_id: -1,
      role: "",
      work_order_id: "0"
    },
    markTaskType: [],
    settingObjects: [], // 当前工具集数据
    drawDomRefresh: 0, // dom元素是否需要更新 0：不需要更新；1：需要全部更新；2：只更新部分
    drawGroupRefresh: 0,
    imageMarkId: 0,
    nowContentType: "typeLine", // 当前操作的工具集
    drawNowGroupsIndex: -2, // 当前操作的组下标
    drawGroupsLines: [], // 当前选中组的lines
    drawBrushData: [0, 0], // 车道线画笔数据
    operationShape: "", // 当前操作的图形类型
    drawTLBrushData: {
      type: "",
      color: "",
      covered: 0
    },
    shortcutKeyData: {
      Control: false,
      a: false,
      A: false,
      g: false,
      G: false,
      x: false,
      X: false
    }, // 快捷键
    transformData: {
      right: {
        offsetX: 0,
        offsetY: 0
      },
      left: {
        offsetX: 0,
        offsetY: 0
      },
      group: {
        offsetX: 0,
        offsetY: 0
      }
    },
    horizonNum: 0,
    taskItemIndex: -1, // 任务上一次的实例对象index
    taskMove: {
      // 用来记录标注任务的控制面板是否被移动过，已移动过则不受影响，未移动过则应保证切换的唯一性
      group: false,
      left: false,
      right: false,
      work: false,
    },
  }),
  getters: {
    getTaskMove(): any {
      return this.taskMove;
    },
    getTaskItemIndex(): number {
      return this.taskItemIndex;
    },
    getOperationShape(): string {
      return this.operationShape;
    },
    getHorizonNum(): number {
      return this.horizonNum;
    },
    getDrawTLBrushData(): any {
      return this.drawTLBrushData;
    },
    getDrawTaskData(): any {
      return this.drawTaskData;
    },
    getTransformData(): any {
      return this.transformData;
    },
    getDrawGroupsLines(): any {
      return this.drawGroupsLines;
    },
    getNowDrawGroupsIndex(): number {
      return this.drawNowGroupsIndex;
    },
    getShortcutKey(): any {
      return this.shortcutKeyData;
    },
    getDrawBrushData(): number[] {
      return this.drawBrushData;
    },
    getNowContentType(): string {
      return this.nowContentType;
    },
    getDrawDomRefresh(): number {
      return this.drawDomRefresh;
    },
    getUser(): string {
      return this.user;
    },
    getUserId(): number {
      return Number(this.userId);
    },
    getUserRoleIds(): string {
      return this.userRoleIds;
    },
    getToken(): string {
      return this.token;
    },
    getMenu(): string {
      return this.menus;
    },
    getAlbumBreadcrumb(): any[] {
      return this.albumBreadcrumb;
    },
    getTimeLineTaskId(): any {
      // console.log(this.timeLineTaskId);
      // console.log(CookieTool.getCookie("TimeLineTaskId"));
      return this.timeLineTaskId || CookieTool.getCookie("TimeLineTaskId");
    },
    getImageMarkId(): any {
      // console.log(this.timeLineTaskId);
      // console.log(CookieTool.getCookie("TimeLineTaskId"));
      return this.imageMarkId || CookieTool.getCookie("ImageMarkId");
    },
    getMarkTaskType(): any {
      return this.markTaskType;
    },
    getSettingObjects(): any {
      return this.settingObjects;
    }
  },
  actions: {
    setTaskMove(sign, val) {
      this.taskMove[sign] = val;
    },
    setTaskItemIndex(num) {
      this.taskItemIndex = num;
    },
    setOperationShape(str) {
      this.operationShape = str;
    },
    setHorizonNum(num) {
      this.horizonNum = num;
    },
    setDrawTLBrushData(data) {
      this.drawTLBrushData = {
        ...this.drawTLBrushData,
        ...data
      };
    },
    setDrawTaskData(data) {
      this.drawTaskData = data;
    },
    setTransformData(data, sign) {
      this.transformData[sign] = data;
    },
    setDrawGroupsLines(lines: any) {
      this.drawGroupsLines = lines;
    },
    setNowDrawGroupsIndex(index: number) {
      this.drawNowGroupsIndex = index;
    },
    setShortcutKey(str: string, sign = ""): void {
      console.log(str, "str", sign);

      if (sign === "clear") {
        Object.keys(this.shortcutKeyData).forEach((key) => {
          this.shortcutKeyData[key] = false;
        });
      } else if (sign === "input") {
        if (
          this.shortcutKeyData[str] === undefined ||
          this.shortcutKeyData[str]
        )
          return;
        this.shortcutKeyData[str] = true;
      }
    },
    setDrawBrushData(data: number[]): void {
      this.drawBrushData = data;
    },
    setNowContentType(str: string): void {
      this.nowContentType = str;
    },
    setDrawDomRefresh(sign: number): void {
      this.drawDomRefresh = sign;
    },
    setUser(username: string): void {
      this.user = username;
    },
    setUserId(userId: number): void {
      this.userId = String(userId);
    },
    setUserRoleIds(userRoleIds: string): void {
      this.userRoleIds = userRoleIds;
    },
    setToken(token: string): void {
      this.token = token;
    },
    setMenu(menus: string): void {
      this.menus = menus;
    },
    setAlbumBreadcrumb(albumBreadcrumb): void {
      this.albumBreadcrumb = albumBreadcrumb;
    },
    setTimeLineTaskId(timeLineTaskId): void {
      this.timeLineTaskId = timeLineTaskId;
      CookieTool.setCookie("TimeLineTaskId", timeLineTaskId, 30);
    },
    setImageMarkId(imageMarkId): void {
      this.imageMarkId = imageMarkId;
      CookieTool.setCookie("ImageMarkId", imageMarkId, 30);
    },
    setEmpty() {
      this.user = "";
      this.userId = "";
      this.token = "";
      this.menus = "";
      this.albumBreadcrumb = [];
    },
    setMarkTaskType(arr) {
      this.markTaskType = arr;
    },
    setSettingObjects(arr: any) {
      this.settingObjects = arr;
    }
  },
  // 开启持久化
  persist: {
    enabled: true, // 启用
    strategies: [
      // storage 可选localStorage或sessionStorage
      // paths 给指定数据持久化
      {
        key: "yihanguser"
        // storage: sessionStorage,
        // paths: ["user", "userId", "token", "menus"],
      }
    ]
  }
});
