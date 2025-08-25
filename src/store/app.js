import data from "./data";
export default {
  state: {
    data: data,
    user: {
      token: "",
      progress: 0,
    },
    top: {},
    auth: false,
    modal: false,
  },
  mutations: {
    SET_RUN(state, newData) {
      if (newData.user) {
        state.auth = true;
      }
    },
    UPDATE_DATA(state, payload) {
      Object.keys(payload).forEach((key) => {
        state[key] = payload[key];
      });
    },
    UPDATE_USER(state, payload) {
      if (!state.auth) state.auth = true;
      Object.keys(payload).forEach((key) => {
        state.user[key] = payload[key];
      });
    },
  },
  actions: {
    async run({ commit }, newData) {
      commit("SET_RUN", newData);
      commit("UPDATE_DATA", newData);
    },
    async updateUser({ commit }, newData) {
      commit("UPDATE_USER", newData);
    },
    async update({ commit }, newData) {
      commit("UPDATE_DATA", newData);
    },
    async fetchUserData({ commit }) {
      try {
        const resp = await fetch('/api/auth?t=' + Date.now(), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-cache' },
          body: JSON.stringify({})
        });
        const data = await resp.json();
        if (data && data.user) {
          commit('UPDATE_USER', data.user);
          if (data.top) {
            commit('UPDATE_DATA', { top: data.top });
          }
        }
      } catch (e) {
        console.error('Ошибка обновления данных пользователя:', e);
      }
    }
  },
  getters: {
    user(state) {
      return state.user;
    },
    app(state) {
      return state;
    },
  },
};
