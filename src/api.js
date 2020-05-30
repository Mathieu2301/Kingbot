const url = 'https://api.usp-3.fr/kingbot';

function rq(method, type, data, callback = () => {}) {
  const xhr = new XMLHttpRequest();
  xhr.open(method, `${url}/?${type}`, true);
  xhr.setRequestHeader('Content-Type', 'application/json');
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

// function sendVote(bot, pet, callback) {
//   const xhr = new XMLHttpRequest();
//   xhr.open('GET', `https://ipapi.co/${ip}/json/`, true);
//   xhr.onreadystatechange = () => {
//     if (xhr.readyState === XMLHttpRequest.DONE) {
//       let response = xhr.responseText;
//       try {
//         response = JSON.parse(response);
//       } catch (e) {
//         callback({ error: true, message: "Can't parse server response" });
//         return;
//       }
//       callback(response);
//     }
//   };
//   xhr.send();
// }

export default function api() {
  return {
    getPets(cb) {
      rq('GET', 'getPlayers', {}, cb);
    },
    getBots(cb) {
      rq('GET', 'getBots', {}, cb);
    },
  };
}
