import { err } from "cron-validate/lib/result";

/*
 * @LastEditTime: 2023-08-14 14:27:22
 * @Description:
 */
export function handleCron(data) {
  const cron_arr = data.split(" ");
  console.log(cron_arr, "data----handleCron");
  if (cron_arr.length !== 5) return "输入不符合要求！";
  // [分，时，日，月，年]
}

export function isValidCronFormat(cronExpression) {
  // 使用正则表达式验证 Cron 表达式
  const cronPattern =
    /^(\*|\d{1,2}) (\*|\d{1,2}) (\*|\d{1,2}) (\*|\d{1,2}) (\*|\d{1,4})$/;

  if (!cronPattern.test(cronExpression)) {
    return false;
  }

  // 进一步验证字段的范围
  const fields = cronExpression.split(" ");
  const minute = parseInt(fields[0]);
  const hour = parseInt(fields[1]);
  const day = parseInt(fields[2]);
  const month = parseInt(fields[3]);
  const year = parseInt(fields[4]);

  // 验证分、时、日、月和年字段的范围
  if (
    minute < 0 ||
    minute > 59 ||
    hour < 0 ||
    hour > 23 ||
    day < 1 ||
    day > 31 ||
    month < 1 ||
    month > 12 ||
    year < 1 ||
    year > 9999
  ) {
    return false;
  }

  return true;
}
