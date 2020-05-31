import moment from 'moment';
import defineFR from './moment-fr';

defineFR(moment);

export default {
  fromNow: (date) => moment.unix(date / 1000).fromNow(),
  formatStatus: (msg) => msg.replace(/_/g, ' '),
  capitalize: (val) => val.charAt(0).toUpperCase() + val.slice(1),
  // fromNow: (date) => Math.round((Date.now() - new Date(date).getTime() - 7207000)),
  // fromNow: (date) => Math.round((Date.now() - new Date(date).getTime() )),
  // hours: (val) => Math.round(val / 360) / 10,
};
