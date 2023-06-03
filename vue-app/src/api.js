const url = (
  process.env.NODE_ENV !== 'development'
    ? 'https://kingbot.apis.usp-3.fr'
    : 'http://localhost:3000'
);

function rq(method, type, data, callback = () => {}) {
  const xhr = new XMLHttpRequest();
  xhr.open(method, `${url}/?${type}`, true);
  xhr.onreadystatechange = () => {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      let response = xhr.responseText;
      try {
        response = JSON.parse(response);
      } catch (e) {
        callback({ error: true, message: 'Can\'t parse server response' });
        return;
      }
      callback(response);
    }
  };
  xhr.send(JSON.stringify({
    ...data,
  }));
}

export default function api() {
  return {
    getPets(cb) {
      rq('GET', 'getPets', {}, cb);
    },

    getBots(cb) {
      rq('GET', 'getBots', {}, cb);
    },

    sendVote(bot, pet, cb) {
      const http = new XMLHttpRequest();
      http.open('POST', 'https://www.kingpet.fr/api/v3/a/Votes/', true);
      http.setRequestHeader('authorization', `Basic ${bot.token}`);
      http.setRequestHeader('content-type', 'text/plain;charset=UTF-8');

      http.onreadystatechange = () => {
        if (http.readyState === http.DONE) {
          cb(JSON.parse(http.responseText));
        }
      };

      http.onerror = () => {
        cb({ network_error: true });
      };

      http.send(JSON.stringify({
        key_participant: pet.key_participant,
        sig: pet.sig,
        fg: 'undefined',
      }));
    },

    getIp(cb) {
      const http = new XMLHttpRequest();
      http.open('GET', 'https://api.ipify.org/', true);

      http.onreadystatechange = () => {
        if (http.readyState === http.DONE) cb(http.responseText);
      };

      http.send();
    },
  };
}
