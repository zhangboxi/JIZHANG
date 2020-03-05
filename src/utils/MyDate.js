class MyDate extends Date {
  constructor(time = new Date()) {
    super(time);
  }
  //将字符串转成时间，返回MyDate，mydate.String2Date('2015-03-05 17:59:00')
  String2Date(ds) {
    let date = ds.substring(0, 19);
    date = date.replace(/-/g, "/");
    let timestamp = new MyDate(date);
    return timestamp;
  }
  //格式化时间,返回Date mydate.Format('yyyy-MM-dd HH:mm:ss')或mydate.Format('yyyy-MM-dd')
  Format(fmt = "yyyy-MM-dd HH:mm:ss") {
    let o = {
      "M+": this.getMonth() + 1,
      "d+": this.getDate(),
      "H+": this.getHours(),
      "m+": this.getMinutes(),
      "s+": this.getSeconds(),
      "S+": this.getMilliseconds()
    };
    //因为date.getFullYear()出来的结果是number类型的,所以为了让结果变成字符串型，下面有两种方法：
    if (/(y+)/.test(fmt)) {
      //第一种：利用字符串连接符“+”给date.getFullYear()+""，加一个空字符串便可以将number类型转换成字符串。
      fmt = fmt.replace(
        RegExp.$1,
        (this.getFullYear() + "").substr(4 - RegExp.$1.length)
      );
    }
    for (let k in o) {
      if (new RegExp("(" + k + ")").test(fmt)) {
        //第二种：使用String()类型进行强制数据类型转换String(date.getFullYear())，这种更容易理解。
        fmt = fmt.replace(
          RegExp.$1,
          RegExp.$1.length == 1
            ? o[k]
            : ("00" + o[k]).substr(String(o[k]).length)
        );
      }
    }
    return fmt;
  }
  //字符串计算时间，返回字符串，mydate.StringCalcDate('month', 2,'2015-03-05 17:59:00'),不传最后一个参数，为当前时间
  StringCalcDate(
    type,
    value,
    bascdateString = new MyDate().Format("yyyy-MM-dd HH:mm:ss")
  ) {
    if (arguments.length < 2) {
      throw "StringCalcDate方法，传入参数错误";
    }
    let fmt = "yyyy-MM-dd HH:mm:ss";
    if (bascdateString.length < 18) {
      fmt = "yyyy-MM-dd";
    }

    let date = this.String2Date(bascdateString);
    switch (type) {
      case "year":
        date.setFullYear(date.getFullYear() + value);
        break;
      case "month":
        date.setMonth(date.getMonth() + value);
        break;
      case "day":
        date.setDate(date.getDate() + value);
        break;
      default:
        return null;
    }

    return date.Format(fmt);
  }
}
export default MyDate;
