
import { format, parse, parseISO  } from 'date-fns';


export const parseDate = (date) => {
  return parse(date, "yyyy-MM-dd HH:mm", new Date())
}

export const formatDate = (date) => {
    return format(date, "yyyy-MM-dd HH:mm")
}

export const saveDateToDB = (date) =>{
  return format(date, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx")
}

export const getDateFromDB = (date) => {
  return format(parseISO(date), "yyyy-MM-dd HH:mm")
}

