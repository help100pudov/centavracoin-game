<template>
  <div class="inviting-friend-container">
    <button class="back-btn" @click="$router.back()">← Back</button>
    <div class="profile-card">
      <img :src="getAva(friend.ava)" class="avatar" />
      <div class="profile-info">
        <h2>{{ friend.first }} {{ friend.last }}</h2>
        <a :href="tgLink" target="_blank" class="tg-link">@{{ friend.login || friend.chat }}</a>
        <div class="stats-row">
          <span><i class="icon-centa"></i> {{ friend.centa }} CENTA</span>
          <span><i class="icon-copper"></i> {{ friend.copper }}</span>
          <span><i class="icon-gold"></i> {{ friend.gold }}</span>
          <span><i class="icon-silver"></i> {{ friend.silver }}</span>
          <span><i class="icon-iron"></i> {{ friend.iron }}</span>
        </div>
        <div class="meta">
          <span>Joined: {{ friend.created_at | formatDate }}</span>
          <span>Engagement: {{ engagement }}</span>
        </div>
      </div>
    </div>
    <div class="actions">
      <button class="remind-btn" @click="remindFriend" :disabled="reminding">
        {{ reminding ? 'Sending...' : 'Remind to be active' }}
      </button>
      <div v-if="remindMsg" class="remind-msg">{{ remindMsg }}</div>
    </div>
    <div class="activity-log" v-if="friend.activity && friend.activity.length">
      <h3>Recent activity</h3>
      <ul>
        <li v-for="(act, idx) in friend.activity" :key="idx">
          {{ act }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "InvitingFriend",
  data() {
    return {
      friend: {},
      reminding: false,
      remindMsg: "",
    };
  },
  computed: {
    tgLink() {
      return `https://t.me/${this.friend.login || this.friend.chat}`;
    },
    engagement() {
      // Пример: сумма всех ресурсов
      return (
        (this.friend.copper || 0) +
        (this.friend.gold || 0) +
        (this.friend.silver || 0) +
        (this.friend.iron || 0)
      );
    },
  },
  methods: {
    getAva(ava) {
      try {
        return require(`@/assets/ava/ava${ava || 1}.webp`);
      } catch {
        return '';
      }
    },
    async fetchFriend() {
      const { id } = this.$route.params;
      const res = await axios.get(`/api/friend/${id}`);
      this.friend = res.data;
    },
    async remindFriend() {
      this.reminding = true;
      this.remindMsg = "";
      try {
        await axios.post("/api/remind-friend", {
          friendId: this.friend.id,
        });
        this.remindMsg = "Reminder sent!";
      } catch (e) {
        this.remindMsg = "Failed to send reminder.";
      }
      this.reminding = false;
    },
  },
  mounted() {
    this.fetchFriend();
  },
  filters: {
    formatDate(val) {
      if (!val) return "";
      return new Date(val).toLocaleDateString();
    },
  },
};
</script>

<style scoped>
.inviting-friend-container { padding: 1rem; }
.back-btn { margin-bottom: 1rem; }
.profile-card { display: flex; align-items: center; background: #18181b; border-radius: 10px; padding: 1rem; }
.avatar { width: 60px; height: 60px; border-radius: 50%; margin-right: 1rem; }
.profile-info { flex: 1; }
.tg-link { color: #2563eb; margin-left: 0.5rem; }
.stats-row { display: flex; gap: 1rem; margin: 0.5rem 0; }
.meta { color: #aaa; font-size: 0.95em; }
.actions { margin: 1.5rem 0; text-align: center; }
.remind-btn { background: #2563eb; color: #fff; border: none; border-radius: 8px; padding: 0.7rem 2rem; font-size: 1.1em; }
.remind-msg { margin-top: 0.5rem; color: #4caf50; }
.activity-log { margin-top: 2rem; }
.activity-log h3 { margin-bottom: 0.5rem; }
.activity-log ul { list-style: disc; margin-left: 1.5rem; }
@media (max-width: 600px) {
  .profile-card { flex-direction: column; align-items: flex-start; }
  .avatar { margin-bottom: 0.7rem; }
}
</style> 