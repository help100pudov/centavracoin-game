<template>
    <div>
        <div class="pl-4 pr-4 pb-2">
            <div class="card p-4 mt-4 mb-4">
                <h3 class="flexCenter">
                    {{ $t("Invite friends") }}
                </h3>
                <div class="text-center fs-14px text-light mt-2 pl-3 pr-3">
                    {{ $t("You can see your friends and your friends' friends. From each friend you invite you get 10%, from his friends - 5%, and from friends of friends - 1%. Share your referral link and increase your income!") }}
                </div>
            </div>

            <div class="flexCenter g-5 m-0">
                <div class="card w-50 text-center p-3">
                    <h4 class="">10%</h4>
                    <hr class="m-2" />
                    <div>{{ $t("My friends") }}</div>
                    <div class="flexCenter mt-1">
                        <i class="bi bi-person fs-18px mr-2"></i>
                        {{ $num(friendsCount) }}
                    </div>
                </div>
                <div class="card w-50 text-center p-3">
                    <h4 class="">5%</h4>
                    <hr class="m-2" />
                    <div>{{ $t("Friends of friends") }}</div>
                    <div class="flexCenter mt-1">
                        <i class="bi bi-person fs-18px mr-2"></i>
                        {{ $num(friendsOfFriendsCount) }}
                    </div>
                </div>
            </div>

            <div class="card p-4 mt-4" style="margin-bottom: 60px;">
                <h3 class="text-center">
                    {{ $t("Your friends") }}
                </h3>
                <div class="text-center fs-14px text-light mt-2 pl-3 pr-3">
                    {{ $t("This section displays statistics about your invitations. Here you see the number of invited friends, friends of your friends and your total earnings from their activity") }}
                </div>
                <div v-if="loading" class="text-center mt-3">{{ $t('Loading...') }}</div>
                <div v-if="errorMsg" class="text-center text-danger mt-3">{{ errorMsg }}</div>
                <div v-if="app.friendsLeaderboard && app.friendsLeaderboard.length">
                  <div class="card p-3 mt-5">
                    <h4 class="">{{ $t('Friends leaderboard') }}</h4>
                    <div
                      class="card p-1 pl-4 pr-4 mt-1 flexBetween friend-row"
                      v-for="(val, idx) in app.friendsLeaderboard"
                      :key="val.id"
                      @click="goToFriend(val.id)"
                      style="cursor:pointer"
                    >
                      <div class="d-flex items-center w-80">
                        <div class="flexCenter">
                          <div><i class="icon x40 br-50" :class="`i-ava${val.ava}`"></i></div>
                          <div class="ml-3">
                            <div class="fs-16px fw-700">{{ val.first.slice(0, 8) }} {{ val.last.charAt(0) }}</div>
                            <div class="d-flex items-center fs-14px">
                              <i class="icon i-centa x16 mr-1"></i>
                              <div>{{ $num(val.centa) }}</div>
                              <span class="ml-2"><i class="icon-copper"></i> {{ val.copper }}</span>
                              <span class="ml-1"><i class="icon-gold"></i> {{ val.gold }}</span>
                              <span class="ml-1"><i class="icon-silver"></i> {{ val.silver }}</span>
                              <span class="ml-1"><i class="icon-iron"></i> {{ val.iron }}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h6 class="">#{{ idx + 1 }}</h6>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-else-if="!loading" class="card text-center p-4 mt-3">{{ $t("You haven't invited anyone yet") }}</div>
            </div>
        </div>

        <div class="footer">
            <div class="flexCenter g-4 mb-2 pl-4 pr-4">
                <div class="w-80"><button @click="sendMessage()" class="btn" style="height:50px">{{ $t("Invite friends") }}</button></div>
                <div class="w-20"><button @click="copyRefLink()" class="btn light p-2" style="height:50px"><i class="bi bi-copy fs-32px text-white"></i></button></div>
            </div>
        </div>
    </div>
</template>

<script>
import { useToast } from 'vue-toastification';

export default {
    name: "invite",
    setup() {
        const toast = useToast();
        return { toast };
    },
    data() {
        return {
            data: "",
            refUrl: "",
            friendsCount: 0,
            friendsOfFriendsCount: 0,
            loading: false,
            errorMsg: ""
        };
    },
    computed: {
        user() {
            return this.$store.state.user;
        },
        app() {
            return this.$store.state.app;
        }
    },
    created() {
        this.refUrl = `https://t.me/centavracoin_bot?start=${btoa(this.user.user)}`;
        this.updateFriendsCount();
    },
    watch: {
        'app.friends': {
            handler: 'updateFriendsCount',
            deep: true
        }
    },
    methods: {
        updateFriendsCount() {
            if (this.app.friends) {
                this.friendsCount = this.app.friends.length;
                this.friendsOfFriendsCount = this.app.friends.reduce((acc, friend) => {
                    return acc + (friend.refAll || 0);
                }, 0);
            }
        },
        async copyRefLink() {
            let refUrl = this.refUrl;
            try {
                if (!navigator.clipboard) {
                    this.toast.error("Clipboard API not available");
                    return;
                }
                await navigator.clipboard.writeText(refUrl);
                this.toast.success("Link copied to clipboard!");
            } catch (error) {
                this.toast.error(`Failed to copy: ${error}`);
                this.logError('copyRefLink', error);
            }
        },
        sendMessage() {
            const message = `Play with me, join the ranks of Centavra!.`;
            const telegramURL = `https://t.me/share/url?url=${encodeURIComponent(this.refUrl)}&text=${encodeURIComponent(message)}`;
            window.open(telegramURL, "_blank");
        },
        goToFriend(id) {
            this.$router.push({ path: `/invitingfriends/${id}` });
        },
        async fetchLeaderboard() {
            this.loading = true;
            this.errorMsg = "";
            try {
                await this.$store.dispatch('fetchFriendsLeaderboard');
                if (!this.app.friendsLeaderboard || !this.app.friendsLeaderboard.length) {
                    this.toast.info(this.$t('No friends found!'));
                } else {
                    this.toast.success(this.$t('Friends leaderboard loaded!'));
                }
            } catch (e) {
                this.errorMsg = this.$t('Failed to load friends leaderboard');
                this.toast.error(this.errorMsg);
                this.logError('fetchLeaderboard', e);
            }
            this.loading = false;
        },
        async logError(action, error) {
            try {
                await fetch('/api/log', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ action, error: error?.message || error })
                });
            } catch (e) {}
        }
    },
    mounted() {
        this.fetchLeaderboard();
    },
};
</script>

<style scoped>
.sort-row { gap: 1rem; }
.sort-btn { background: #222; color: #fff; border: none; border-radius: 6px; padding: 0.3rem 1rem; margin: 0 0.2rem; cursor: pointer; font-size: 1em; }
.sort-btn.active { background: #2563eb; color: #fff; }
.friend-row { cursor: pointer; transition: background 0.2s; }
.friend-row:hover { background: #232b3b; }
.tg-link { color: #2563eb; font-size: 0.95em; }
.friend-meta span { margin-left: 0.5em; }
.icon-copper, .icon-gold, .icon-silver, .icon-iron { margin-right: 0.2em; }
</style>
