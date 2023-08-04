type StringDateMathes = Array<number>;

/**
 @description
 * 인자로 전달받은 일시를 다양한 포맷으로 변환하는 클래스
 */
class DateTimeFormatter {
  date: Date | undefined = undefined;
  enMonths: Array<[string, string]> = [
    ["January", "Jan."],
    ["February", "Feb."],
    ["March", "Mar."],
    ["April", "Apr."],
    ["May", "May."],
    ["June", "Jun."],
    ["July", "Jul."],
    ["August", "Aug."],
    ["September", "Sep."],
    ["October", "Oct."],
    ["November", "Nov."],
    ["December", "Dec."],
  ];
  enDays: Array<[string, string]> = [
    ["Sunday", "Sun."],
    ["Monday", "Mon."],
    ["Tuesday", "Tue."],
    ["Wednesday", "Wed."],
    ["Thursday", "Thu."],
    ["Friday", "Fri."],
    ["Saturday", "Sat."],
  ];
  koDays: Array<[string, string]> = [
    ["일요일", "일"],
    ["월요일", "월"],
    ["화요일", "화"],
    ["수요일", "수"],
    ["목요일", "목"],
    ["금요일", "금"],
    ["토요일", "토"],
  ];

  /**
   * DateTimeFormatter 클래스의 생성자.
   * @constructor
   * @param {string | number | Date} date -  UNIX 타임스탬프 혹은 Date 객체, 연월일[시분초] 순으로 작성된 string.
   */
  constructor(date: string | number | Date) {
    try {
      let dt: Date = new Date();

      if (typeof date === "string") {
        const dtArr = date.match(/[0-9]{1,}/g)?.map((el) => parseInt(el));
        const pm = date.match(/pm|오후/gi);
        const isPm = (pm && pm.length > 0) || false;

        if (!this.isStringDateMatches(dtArr)) {
          throw new Error("date 형식 에러");
        } else {
          const dateTimeStr = `${dtArr[0]
            .toString()
            .padStart(4, "20")}-${dtArr[1]
            .toString()
            .padStart(2, "0")}-${dtArr[2].toString().padStart(2, "0")}T${
            dtArr[3]
              ? (dtArr[3] + (isPm ? 12 : 0))?.toString().padStart(2, "0")
              : "00"
          }:${dtArr[4]?.toString().padStart(2, "0") || "00"}:${
            dtArr[5]?.toString().padStart(2, "0") || "00"
          }`;
          dt = new Date(Date.parse(dateTimeStr));
        }
      } else {
        dt = typeof date === "number" ? new Date(date) : date;
      }

      this.date = dt;
    } catch (error) {
      console.error(error);
    }
  }

  private isStringDateMatches = (arr: any): arr is StringDateMathes =>
    Array.isArray(arr) &&
    arr.length >= 3 &&
    arr.every((el) => typeof el === "number") &&
    arr[1] > 0 &&
    arr[1] <= 12 &&
    arr[2] > 0 &&
    arr[2] <= 31;

  /**
   *
   * @returns this.date의 UNIX 타임스탬프 반환.
   */
  public unixTimestamp() {
    return this.date;
  }
  /**
   *
   * @returns this.date 연도의 모든 자리 반환.
   */
  public Y() {
    return this.date ? this.date.getFullYear().toString() : undefined;
  }

  /**
   *
   * @returns this.date 연도의 뒤 두 자리만 반환.
   */
  public y() {
    return this.date ? this.Y()?.slice(2) : undefined;
  }

  /**
   *
   * @returns this.date 월의 기본 표기 반환.
   */
  public m() {
    return this.date ? (this.date.getMonth() + 1).toString() : undefined;
  }

  /**
   *
   * @returns this.date 월의 길이가 항상 2가 되도록 빈 자리에 0을 넣어 반환.
   */
  public M() {
    return this.date ? this.m()?.padStart(2, "0") : undefined;
  }

  /**
   *
   * @returns this.date 월의 영어 표기의 축약형 반환.
   */
  public mEn() {
    return this.date ? this.enMonths[this.date?.getMonth()][1] : undefined;
  }

  /**
   *
   * @returns this.date 월의 영어 표기 반환.
   */
  public mEnFull() {
    return this.date ? this.enMonths[this.date?.getMonth()][0] : undefined;
  }

  /**
   *
   * @returns this.date 일의 기본 표기 반환.
   */
  public d() {
    return this.date ? this.date.getDate().toString() : undefined;
  }

  /**
   *
   * @returns this.date 일의 길이가 항상 2가 되도록 빈 자리에 0을 넣어 반환.
   */
  public D() {
    return this.date ? this.d()?.padStart(2, "0") : undefined;
  }

  /**
   *
   * @returns this.date 요일의 영어 표기의 축약형 반환.
   */
  public dayEn() {
    return this.date ? this.enDays[this.date.getDay()][1] : undefined;
  }

  /**
   *
   * @returns this.date 요일의 영어 표기 반환.
   */
  public dayEnFull() {
    return this.date ? this.enDays[this.date.getDay()][0] : undefined;
  }

  /**
   *
   * @returns this.date 요일의 한글 표기의 축약형 반환.
   */
  public dayKo() {
    return this.date ? this.koDays[this.date.getDay()][1] : undefined;
  }

  /**
   *
   * @returns this.date  요일의 한글 표기 반환.
   */
  public dayKoFull() {
    return this.date ? this.koDays[this.date.getDay()][0] : undefined;
  }

  /**
   *
   * @returns this.date 12시간제 시간 기본 표기 반환.
   */
  public hour12() {
    const h = this.date?.getHours();
    return h
      ? h <= 12
        ? "오전 " + h.toString()
        : "오후 " + (h - 12).toString()
      : undefined;
  }

  /**
   *
   * @returns this.date 12시간제 시간의 길이가 항상 2가 되도록 빈 자리에 0을 넣어 반환.
   */
  public HOUR12() {
    const h = this.date?.getHours();
    return h
      ? h <= 12
        ? "오전 " + h.toString().padStart(2, "0")
        : "오후 " + (h - 12).toString().padStart(2, "0")
      : undefined;
  }

  /**
   *
   * @returns this.date 24시간제 시간 기본 표기 반환.
   */
  public hour24() {
    return this.date ? this.date.getHours().toString() : undefined;
  }

  /**
   *
   * @returns this.date 24시간제 시간의 길이가 항상 2가 되도록 빈 자리에 0을 넣어 반환.
   */
  public HOUR24() {
    return this.date ? this.hour24()?.padStart(2, "0") : undefined;
  }

  /**
   *
   * @returns this.date 분의 기본 표기 반환.
   */
  public minutes() {
    return this.date ? this.date.getMinutes().toString() : undefined;
  }

  /**
   *
   * @returns this.date 분의 길이가 항상 2가 되도록 빈 자리에 0을 넣어 반환.
   */
  public MINUTES() {
    return this.date ? this.minutes()?.padStart(2, "0") : undefined;
  }

  /**
   *
   * @returns this.date 초의 기본 표기 반환.
   */
  public seconds() {
    return this.date ? this.date.getSeconds().toString() : undefined;
  }

  /**
   *
   * @returns this.date 초의 길이가 항상 2가 되도록 빈 자리에 0을 넣어 반환.
   */
  public SECONDS() {
    return this.date ? this.seconds()?.padStart(2, "0") : undefined;
  }

  /**
   * @param {string} format 반환될 datetime의 형식. 각 연월일시분초에 해당하는 포맷을 자리표시자로 사용해 전달.
   * @returns {string} 포맷에 맞게 datetime 반환.
   *
   * ex: "Y년 M월 D일 dayKo HOUR24:MINUTES:SECONDS"
   *
   * ------
   *
   * 사용되는 자리표시자는 다음과 같다.
   *
   * 자리표시자를 메소드명으로 호출하여 해당 부분만 반환받을 수도 있다.
   *
   * /Y/ : 연도의 모든 자리 표기.
   *
   * /y/ : 연도의 뒤 두 자리만 표기.
   *
   * /m/ : 월의 기본 표기.
   *
   * /M/ : 월의 길이가 항상 2가 되도록 빈 자리에 0을 넣어 표기.
   *
   * /mEnFull/ : 월의 영어 표기 표기.
   *
   * /mEn/ : 월의 영어 표기의 축약형 표기.
   *
   * /d/ : 일의 기본 표기.
   *
   * /D/ : 일의 길이가 항상 2가 되도록 빈 자리에 0을 넣어 표기.
   *
   * /dayEnFull/ : 요일의 영어 표기 표기.
   *
   * /dayEn/ : 요일의 영어 표기의 축약형 표기.
   *
   * /dayKoFull/ : 요일의 한글 표기 표기.
   *
   * /dayKo/ : 요일의 한글 표기의 축약형 표기.
   *
   * /hour12/ : 12시간제 시간 기본 표기.
   *
   * /HOUR12/ : 12시간제 시간의 길이가 항상 2가 되도록 빈 자리에 0을 넣어 표기.
   *
   * /hou24/ : 24시간제 시간 기본 표기.
   *
   * /HOUR24/ : 24시간제 시간의 길이가 항상 2가 되도록 빈 자리에 0을 넣어 표기.
   *
   * /minutes/ : 분의 기본 표기.
   *
   * /MINUTES/ : 분의 길이가 항상 2가 되도록 빈 자리에 0을 넣어 표기.
   *
   * /seconds/ : 초의 기본 표기.
   *
   * /SECONDS/ : 초의 길이가 항상 2가 되도록 빈 자리에 0을 넣어 표기.
   * */
  public formatting(format: string): string {
    if (!this.date) return "";

    let formatted = format;

    const regexp = new RegExp(
      /\/(hour12|hour24|minutes|seconds|mEnFull|mEn|dayEnFull|dayEn|dayKoFull|dayKo|y|m|d)\//,
      "gi"
    );
    const formats = format.match(regexp);

    formats?.forEach((el) => {
      const regexp = new RegExp(`${el}`, "g");
      formatted = formatted.replace(
        regexp,
        (this[el.slice(1, -1) as keyof DateTimeFormatter] as Function)()
      );
    });

    return formatted;
  }
}

export default DateTimeFormatter;
