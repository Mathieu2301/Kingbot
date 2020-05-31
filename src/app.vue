<template>
  <div id="app">
    <div class="header">Kingbot</div>

    <loading v-show="tab=='loading'"></loading>
    <div class="container" v-show="tab=='default'">

      <div class="inline notfull">
        <div>Status</div>
        <div v-if="connected">{{ ip }}</div>
        <div v-else>Déconnecté</div>
      </div>

      <div class="inline notfull">
        <div>Dernier vote</div>
        <div v-if="lastVoteTime == 0">Jamais</div>
        <div v-else>{{ lastVoteTime | fromNow }}</div>
      </div>

      <div class="inline notfull">
        <div>Bots disponibles</div>
        <div>{{ Object.keys(availablesBots).length }}</div>
      </div>

      <div class="inline notfull">
        <div>Votes effectués</div>
        <div>{{ results_nbr }}</div>
      </div>

      <div class="pets">
        <select v-model="selectedPet">
          <option
            v-for="(pet, i) in pets"
            :value="i"
            :key="pet.name"
          >{{ pet.name }}</option>
        </select>

        <div class="button separator"
          :class="{
            disabled: processing || Object.keys(availablesBots).length === 0,
            pending,
          }"
          @click="vote"
        >{{ (!pending ? 'Vote' : 'En attente') }}</div>
      </div>

      <div class="inline" v-for="(nbr, name) in results" :key="name">
        <div>{{ name | formatStatus | capitalize }}</div>
        <div>{{ nbr }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import filters from '@/filters';
import loading from '@/loading';

export default {
  name: 'Kingbot',
  filters,
  components: { loading },

  data() {
    return {
      tab: 'loading',
      processing: false,
      connected: null,
      ip: 'Connecté',
      pending: false,

      lastBotVote: JSON.parse(localStorage.getItem('lastBotVote')) || {},
      lastVoteTime: localStorage.getItem('lastVoteTime'),
      selectedPet: localStorage.getItem('selectedPet') || 0,

      pets: [],
      bots: {},

      availablesBots: {},
      results: {},
      results_nbr: 0,
    };
  },

  methods: {
    vote() {
      if (!this.connected) {
        this.pending = true;
        return;
      }
      if (this.processing || Object.keys(this.availablesBots).length === 0) return;

      this.pending = false;

      this.results = {};
      this.results_nbr = 0;
      this.processing = true;
      const botsNbr = Object.keys(this.availablesBots).length;

      Object.keys(this.availablesBots).forEach((botId) => {
        this.api.sendVote(this.availablesBots[botId], this.pets[this.selectedPet], (rs) => {
          if (rs.network_error) {
            this.upResult('Erreur réseau');
            return;
          }
          let { status } = rs;

          if (rs.success) {
            status = 'Done !';
            this.lastBotVote[botId] = Date.now();
            delete this.availablesBots[botId];
          }
          this.upResult(status);
          console.log(rs);
        });
      });

      const checkInterval = setInterval(() => {
        if (this.results_nbr >= botsNbr) {
          this.processing = false;
          localStorage.setItem('lastBotVote', JSON.stringify(this.lastBotVote));
          clearInterval(checkInterval);
        }
      }, 100);
      this.lastVoteTime = Date.now();
      localStorage.setItem('lastVoteTime', this.lastVoteTime);
    },

    upResult(rsText) {
      if (!this.results[rsText]) this.results[rsText] = 1;
      else this.results[rsText] += 1;
      this.results_nbr += 1;
    },

    tick() {
      if (!this.bots) return;
      console.log('Tick !');
      const now = Date.now();
      Object.keys(this.bots).forEach((botId) => {
        if (!this.lastBotVote[botId] || this.lastBotVote[botId] + 600000 < now) {
          this.availablesBots[botId] = this.bots[botId];
        } else {
          delete this.availablesBots[botId];
        }
      });
      this.$forceUpdate();
    },

    updateConnection() {
      this.connected = (navigator.connection.rtt !== 0 || navigator.connection.downlink !== 10);
      if (this.connected) {
        this.api.getIp((ip) => {
          this.ip = ip;
          if (this.pending) this.vote();
        });
      }
    },
  },

  mounted() {
    if (!this.lastBotVote) this.lastBotVote = {};
    if (!this.lastVoteTime) this.lastVoteTime = 0;
    this.api.getPets(({ pets }) => {
      this.pets = pets;
      this.api.getBots(({ bots }) => {
        this.bots = bots;
        this.tab = 'default';
      });
    });
    setInterval(this.tick, 1000);

    this.updateConnection();
    navigator.connection.onchange = this.updateConnection;
  },

  watch: {
    selectedPet() {
      localStorage.setItem('selectedPet', this.selectedPet);
    },
  },
};
</script>

<style>
:root {
  --bg: #1c2735;
  --text: #EEE;
  --color1: #293a48;
  --color2: #364e61;
  --color3: #41637b;
  --button: #00b176;
  --blue: #7452c7;
  --red: #c75252;
  --grey: #a7a7a7;
}

::-webkit-scrollbar { display: none }

body {
  margin: 0;
  background-color: var(--bg);
  color: var(--text);
}

body * {
  transition-duration: 100ms;
  box-sizing: border-box;
}

#app {
  font-family: Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  margin-bottom: 80px;
}

.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  -webkit-app-region: drag;
  line-height: 50px;
  font-size: 25px;
  text-align: left;
  padding-left: 22px;
  background-color: var(--color2);
  box-shadow: 3px 3px 8px #0000002e;
  opacity: 0.8;
  user-select: none;
  z-index: 100;
}

.container {
  display: flex;
  flex-direction: column;
  margin: 70px auto 0 auto;
  max-width: 1000px;
}

.notfull { margin: 0 15px }

/* Style */

select {
  color: var(--text);
  font-size: 17px;
  background-color: var(--color2);
  opacity: .9;
  margin-bottom: 2px;
  margin: 0 15px;
  border: solid 13px var(--color2);
  width: calc(100% - 30px);
}

.pets { margin: 5px 0 }

.button {
  background-color: var(--button);
  line-height: 50px;
  font-size: 19px;
  border-radius: 5px;
  margin: 5px 15px;
  cursor: pointer;
}

.button.pending {
  background-color: var(--blue);
}

.inline {
  display: flex;
  justify-content: space-between;
  background-color: var(--color2);
  opacity: .9;
  padding: 10px 20px;
  margin-bottom: 2px;
}

.disabled {
  background-color: var(--grey);
  cursor: not-allowed;
}

.messages {
  background-color: #2d4252;
  height: 400px;
  padding: 10px;
  overflow-y: scroll;
}

.messages > * {
  text-align: left;
  margin: 5px 3px;
  overflow-x: hidden;
  line-break: anywhere;
}

.bg_red { background-color: var(--red) !important }
.bg_select { background-color: var(--button) !important }
.bg_select2 { background-color: var(--color3) !important }

.clickable { cursor: pointer }

</style>
