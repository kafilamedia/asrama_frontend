
import { ChangeEvent } from 'react';
import { getInputReadableDate } from './../../utils/DateUtil';
export default class Filter {
  static resetFieldsFilter = (f: Filter): Filter => {
    for (const key in f.fieldsFilter) {
      if (key.endsWith('=d')) {
        f.fieldsFilter[key] = getInputReadableDate(new Date());
      } else {
        f.fieldsFilter[key] = '';
      }
    }
    return f;
  }
  static withLimit = (arg0: number): Filter => {
    const f = new Filter();
    f.limit = arg0;
    return f;
  }
  limit?: number = 5;
  page?: number = 0;
  orderType?: string;
  orderBy?: string;
  contains?: boolean;
  exacts?: boolean;
  module?: string;
  fieldsFilter: Record<string, any> = {};
  maxValue?: number;
  availabilityCheck?: boolean;


  public static queryString = (filter?: Filter) => {
    if (!filter) return '';
    let q: string[] = [];
    if (filter.page && filter.page >= 0) {
      q.push(`page=${filter.page}`);
    }
    if (filter.limit && filter.limit >= 0) {
      q.push(`limit=${filter.limit}`);
    }
    if (filter.orderBy) {
      q.push(`order=${filter.orderBy}`);
    }
    if (filter.orderType && (filter.orderType === 'asc' || filter.orderType === 'desc')) {
      q.push(`orderDesc=${filter.orderType === 'desc' ? 'true' : 'false'}`);
    }
    if (filter.fieldsFilter)
      for (const key in filter.fieldsFilter) {
        if (Object.prototype.hasOwnProperty.call(filter.fieldsFilter, key)) {
          const element = filter.fieldsFilter[key];
          q.push(`filter=${encodeURIComponent(key)}:${encodeURIComponent(element)}`);
        }
      }
    return '?' + q.join('&');
  }
  public static updatePeriodFilter = (filter: Filter, e: ChangeEvent<HTMLInputElement | HTMLSelectElement>, field: 'time<=d' | 'time>=d') => {
    const val = parseInt(e.target.value);
    if (isNaN(val)) {
      return;
    }
    const periodFilter = new Date(filter.fieldsFilter[field]);
    switch (e.target.name) {
      case 'day':
        periodFilter.setDate(val);
        break;
      case 'month':
        periodFilter.setMonth(val);
        break;
      case 'year':
        periodFilter.setFullYear(val);
        break;
      default:
        return;
    }
    filter.fieldsFilter[field] = getInputReadableDate(periodFilter);
  }
}
