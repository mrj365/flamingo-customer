import * as moment from 'moment';
export class DateUtil {

static convertTimeFrom24hTo12h(time: string): string {
    let convertedTime: string;

    let hours = time.substr(0, 2);

    let convertedHours = ((+hours + 11) % 12 + 1);

    let suffix = +time.substr(0, 2) < 12 ? 'am' : 'pm';
  
    return convertedHours + '' + time.substring(2, 5) + suffix;

  }

  static dateToDayOfMonth(unformattedDate: string): string {
    return moment(unformattedDate, 'YYYY-MM-DD').format('D');
  }

  static dateMonth(unformattedDate: string) {
    return moment(unformattedDate, 'YYYY-MM-DD').format('MMMM');
  }

  static format24HTimeTo12MeridieumTime(unformattedTime: string) {
    return moment(unformattedTime, 'HH:mm').format('hh:mma');
  }

  static getCheckoutDateFormatted(unformattedDate: string) {
    return moment(unformattedDate).format('dddd, MMMM Do, YYYY h:mma');
  }

  static getCheckoutDateFormattedSm(unformattedDate: string) {
    return moment(unformattedDate).format('ddd, MMM Do h:mma');
  }

  static formattedDateToIso(formattedDate: string, format: string) {
    return moment(formattedDate, format).format('YYYY-MM-DDTHH:mm:ss');
  }

}