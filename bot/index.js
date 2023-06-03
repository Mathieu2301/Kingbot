const { spawn } = require('child_process');
const rq = require('request');
const md5 = require('./md5.js');

function sendRequest(account, pet, cb) {
  // spawn(
  //   'cmd.exe',
  //   ['/c', 'sample.bat', account.token, account.fg, pet.key_participant, pet.sig],
  // ).stdout.on('data', (body) => {
  spawn(
    'bash',
    ['sample.sh', account.token, account.fg, pet.key_participant, pet.sig],
  ).stdout.on('data', (body) => {
    body = body.toString();
    try {
      body = JSON.parse(body);
    } catch (error) {
      console.error(new Error('Can\'t parse server response'));
    }

    if (!body.success) {
      cb({ success: false, message: body.message });
      return;
    }

    cb({ success: true, message:`"${account.name}" voted for "${pet.name}" !` });
  });
}

function sendCodeToEmail(email, cb) {
  rq.post('https://www.kingpet.fr/api/v3/a/Connection/AuthWithCode/', {
    headers: {
      'Content-Type': 'application/json'
    },
    json: {
      action: 'UnauthSendCode',
      value: email,
      countryCode: null,
      type: 'email',
      redirect_uri: '/',
      child_tmp: null
    }
  }, (err, _, rs) => {
    if (err) console.error(err);
    else cb(rs);
  });
}

function getSessionToken(sig, code, cb) {
  rq.post('https://www.kingpet.fr/api/v3/a/Connection/AuthWithCode/', {
    headers: { 'Content-Type': 'application/json' },
    json: {
      action: 'UnauthValidateCode',
      code,
      sig,
      type: 'email'
    }
  }, (err, _, rs) => {
    if (err) console.error(err);
    else cb(rs);
  });
}

function setName(email, sig, firstname, lastname, cb) {
  rq.post(`https://www.kingpet.fr/api/v3/a/Connection/AuthWithCode/`, {
    headers: { 'Content-Type': 'application/json' },
    json: {
      action: 'Unauth',
      phone: false,
      email, sig, firstname, lastname,
    }
  }, (err, _, rs) => {
    if (err) return console.error('[Request error]:', err);
    try { if (typeof rs !== 'object') rs = JSON.parse(rs) } catch(e) { return console.error('Can\'t parse server response', rs) }
    cb(rs.data);
  });
}

function connect(id_user, token, cb) {
  rq.post(`https://www.kingpet.fr/api/v3/a/Connection/`, {
    headers: {
      'Content-Type': 'application/json',
      authorization: `Basic ${token}`
    },
    json: {
      id_user,
      tz_offset: -2,
      from_ad: false,
      wp_uuid: false
    }
  }, (err, _, rs) => {
    if (err) return console.error('[Request error]:', err);
    try { if (typeof rs !== 'object') rs = JSON.parse(rs) } catch(e) { return console.error('Can\'t parse server response', rs) }
    cb(rs.data);
  });
}

function getEmailsDomains(cb) {
  rq.get(`https://api4.temp-mail.org/request/domains/format/json`, (err, _, rs) => {
    if (err) return console.error('[Request error]:', err);
    try { if (typeof rs !== 'object') rs = JSON.parse(rs) } catch(e) { return console.error('Can\'t parse server response', rs) }
    cb(rs);
  });
}

function getRandomName(cb) {
  rq.get(`https://fr.fakenamegenerator.com/gen-random-fr-fr.php`, (err, _, rs) => {
    if (err) return console.error('[Request error]:', err);
    if (!rs.includes('<h3>')) return console.error('Can\'t parse page');
    let email = rs.split('<h3>')[1].split('</h3>')[0];
    let list = email.split(' ');
    getEmailsDomains((domains) => {
      email = (email.replace(/\ /g, '.') + domains[Math.floor(Math.random() * (domains.length - 1))]).toLowerCase();
      cb(list[0], list[1], email);
    });
  });
}

function fetchCode(email, cb) {
  const emailHash = md5(email);
  rq.get(`https://api4.temp-mail.org/request/mail/id/${emailHash}/format/json`, (err, _, rs) => {
    if (err) return console.error('[Request error]:', err);
    try { rs = JSON.parse(rs) } catch(e) { return console.error('Can\'t parse server response', rs) }
    if (!rs || rs.error || typeof rs !== 'object') return setTimeout(() => fetchCode(email, cb), 1000);
    let code = false;
    rs.forEach((email) => {
      if (!email.mail_subject.includes('KingPet : Confirmez')) return;
      if (!email.mail_text.includes('vérification est')) return;
      code = email.mail_text.split(' est')[1].slice(0, 4);
    });

    if (!code) return setTimeout(() => fetchCode(email, cb), 1000);
    else cb(code);
  });
}

function pushAccount(account) {
  rq.post('https://api.usp-3.fr/kingbot/?pushBot', {
    headers: {'Content-Type': 'text/html'},
    formData: account,
  }, (err, _, rs) => {
    if (err) return console.error('[Request error]:', err);
    console.log(rs);
  });
}

const newAccount = () => {
  console.log('Getting random name');
  getRandomName((firstname, lastname, email) => {
    sendCodeToEmail(email, (rs1) => {
      console.log('Fetching Code from email :', email)
      fetchCode(email, (code) => {
        console.log('Getting sessionToken from SIG and Code :', code);
        getSessionToken(rs1.data.sig, code, (rs2) => {
          console.log('Setting random name', firstname, lastname);
          setName(email, rs2.data.sig, firstname, lastname, (account) => {
            console.log('Connecting', account.id_user)
            connect(account.id_user, account.token, ({ user }) => {
              pushAccount({
                id: user.id_user,
                name: `${firstname} ${lastname}`,
                email: user.email,
                token: user.token,
              });
            })
          });
        });
      });
    });
  });
}

// newAccount();
setInterval(newAccount, 5000);

function updateTokens() {
  rq.get('https://api.usp-3.fr/kingbot/?getBots', (err, _, rs) => {
    if (err) return console.error('[Request error]:', err);
    try { rs = JSON.parse(rs) } catch(e) { return console.error('Can\'t parse server response', rs) }
    Object.keys(rs.bots).forEach((bot_id) => {
      connect(bot_id, rs.bots[bot_id].token, ({ user }) => {
        if (user.token === rs.bots[bot_id].token) return console.log(`Token of ${bot_id} is the same`);
        pushAccount({
          id: user.id_user,
          name: user.username,
          email: user.email,
          token: user.token,
        });
      })
    });
  })
}

// updateTokens();

const tr = require('tor-request');

let bots = {};
const bots_votes_times = {};

function loadBots(cb = () => {}) {
  rq.get('https://api.usp-3.fr/kingbot/?getBots', (err, _, rs) => {
    if (err) return console.error('[Request error]:', err);
    try { bots = JSON.parse(rs).bots } catch(e) { return console.error('Can\'t parse server response', rs) }
    console.log('Bots list updated !');
    cb();
  });
}

setInterval(loadBots, 60000);

function voteForRandom(pet, specifyBotId = false) {
  const bot_id = specifyBotId || Object.keys(bots)[Math.floor(Math.random() * Object.keys(bots).length)];
  const bot = bots[bot_id];

  if (bots_votes_times[bot_id] && Date.now() - bots_votes_times[bot_id] < 600000) return;

  sendRequest(bot, pet, (result) => {
    console[result.success ? 'info' : 'error'](bot_id, result.message);
    if (result.success) bots_votes_times[bot_id] = Date.now();
    if (result.message.includes('rafraîchir')) connect(true, bot.token, ({ user }) => {
      if (user.token === bot.token) return;
      pushAccount({
        id: user.id_user,
        name: user.username,
        email: user.email,
        token: user.token,
      });
      // voteForRandom(pet, bot_id);
    });
    if (result.message.includes('connexion internet')) tr.newTorSession((err) => {
      if (err) console.error(err);
      else voteForRandom(pet, bot_id);
    });
  });
}

const pets = [
  {
    name: 'Miaki',
    key_participant: '5898001881190156-412',
    sig: 'fd363177063b99fa3c4d',
    fg: 'undefined',
  },
  {
    name: 'Lixy',
    key_participant: '5898001775418554-412',
    sig: 'a69a9b5d7351466dd5de',
    fg: 'undefined',
  },
  {
    name: 'Neige et Grisounette',
    key_participant: '5913021880444948-414',
    sig: '3b51e63645d7644fa29f',
    fg: 'undefined',
  }
];

let i = 0;
loadBots(() => setInterval(() => {
  let botid = Object.keys(bots)[i++];
  if (!botid) i = 0;
  botid = Object.keys(bots)[i];

  voteForRandom(pets[Math.floor(Math.random() * (pets.length - 1))], botid);
}, 400));

setInterval(() => {}, 20000);
