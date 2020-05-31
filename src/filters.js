import moment from 'moment';
import defineFR from './moment-fr';

defineFR(moment);

export default {
  fromNow: (date) => moment.unix(date / 1000).fromNow(),
  formatStatus: (msg) => msg.replace(/_/g, ' '),
  capitalize: (val) => val.charAt(0).toUpperCase() + val.slice(1),
};
