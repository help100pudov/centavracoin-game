<template>
  <div class="nk-sidebar" :class="{'has-apps-sidebar': meta,'nk-sidebar-active': show}">
      <div class="nk-sidebar-inner" style="overflow: auto;height: calc(100vh - 66px);">
            <ul class="nk-menu nk-menu-md">
                <li class="nk-menu-heading">
                    <h6 class="overline-title text-primary-alt">{{ $t('Admin Panel') }}</h6>
                </li>
                <li class="nk-menu-item">
                    <router-link to="/panel" class="nk-menu-link">
                        <span class="nk-menu-icon"><em class="icon ni ni-dashboard"></em></span>
                        <span class="nk-menu-text">{{ $t('Dashboard') }}</span>
                    </router-link>
                </li>
                <li class="nk-menu-item has-sub" :class="sub.s2">
                    <a @click="subMenu(2)" class="nk-menu-link nk-menu-toggle">
                        <span class="nk-menu-icon"><em class="icon ni ni-users"></em></span>
                        <span class="nk-menu-text">{{ $t('Users') }}</span>
                    </a>
                    <ul class="nk-menu-sub">
                        <li class="nk-menu-item">
                            <router-link to="/panel/users" class="nk-menu-link">
                            <span class="nk-menu-icon"><em class="icon ni ni-book"></em></span>
                            <span class="nk-menu-text">{{ $t('Users') }}</span></router-link>
                        </li>
                        <li class="nk-menu-item">
                            <router-link to="/panel/quests" class="nk-menu-link">
                            <span class="nk-menu-icon"><em class="icon ni ni-book"></em></span>
                            <span class="nk-menu-text">{{ $t('Quests') }}</span></router-link>
                        </li>
                        <li class="nk-menu-item">
                            <router-link to="/panel/traffic" class="nk-menu-link">
                            <span class="nk-menu-icon"><em class="icon ni ni-book"></em></span>
                            <span class="nk-menu-text">{{ $t('Traffic') }}</span></router-link>
                        </li>
                    </ul>
                </li>
                <li class="nk-menu-item has-sub">
                    <router-link to="/panel/news" class="nk-menu-link nk-menu-toggle">
                        <span class="nk-menu-icon"><em class="icon ni ni-users"></em></span>
                        <span class="nk-menu-text">{{ $t('News') }}</span>
                    </router-link>
                </li>
                <li class="nk-menu-item has-sub" :class="sub.s1">
                    <a @click="subMenu(1)" class="nk-menu-link nk-menu-toggle">
                        <span class="nk-menu-icon"><em class="icon ni ni-cart"></em></span>
                        <span class="nk-menu-text">{{ $t('Matket NFT') }}</span>
                    </a>
                    <ul class="nk-menu-sub">
                        <li class="nk-menu-item">
                            <router-link to="/panel/category" class="nk-menu-link">
                            <span class="nk-menu-icon"><em class="icon ni ni-book"></em></span>
                            <span class="nk-menu-text">{{ $t('Category') }}</span></router-link>
                        </li>
                        <li class="nk-menu-item">
                            <router-link to="/panel/collections" class="nk-menu-link">
                            <span class="nk-menu-icon"><em class="icon ni ni-book"></em></span>
                            <span class="nk-menu-text">{{ $t('Collections') }}</span></router-link>
                        </li>
                        <li class="nk-menu-item">
                            <router-link to="/panel/games" class="nk-menu-link">
                            <span class="nk-menu-icon"><em class="icon ni ni-book"></em></span>
                            <span class="nk-menu-text">{{ $t('Games') }}</span></router-link>
                        </li>
                        <li class="nk-menu-item">
                            <router-link to="/panel/tags" class="nk-menu-link">
                            <span class="nk-menu-icon"><em class="icon ni ni-book"></em></span>
                            <span class="nk-menu-text">{{ $t('Tags') }}</span></router-link>
                        </li>
                    </ul>
                </li>
                <li class="nk-menu-item has-sub" :class="sub.s3">
                    <a @click="subMenu(3)" class="nk-menu-link nk-menu-toggle">
                        <span class="nk-menu-icon"><em class="icon ni ni-package"></em></span>
                        <span class="nk-menu-text">{{ $t('Aplication') }}</span>
                    </a>
                    <ul class="nk-menu-sub">
                        <li class="nk-menu-item">
                            <router-link to="/panel/slider" class="nk-menu-link">
                            <span class="nk-menu-icon"><em class="icon ni ni-book"></em></span>
                            <span class="nk-menu-text">{{ $t('Slider') }}</span></router-link>
                        </li>
                        <li class="nk-menu-item">
                            <router-link to="/panel/events" class="nk-menu-link">
                            <span class="nk-menu-icon"><em class="icon ni ni-book"></em></span>
                            <span class="nk-menu-text">{{ $t('Modal events') }}</span></router-link>
                        </li>
                        <li class="nk-menu-item">
                            <router-link to="/panel/about" class="nk-menu-link">
                            <span class="nk-menu-icon"><em class="icon ni ni-book"></em></span>
                            <span class="nk-menu-text">{{ $t('About') }}</span></router-link>
                        </li>
                        <li class="nk-menu-item">
                            <router-link to="/panel/privacy" class="nk-menu-link">
                            <span class="nk-menu-icon"><em class="icon ni ni-book"></em></span>
                            <span class="nk-menu-text">{{ $t('Privacy') }}</span></router-link>
                        </li>
                    </ul>
                </li>
                
            </ul>
      </div>
  </div>
</template>

<script>
export default {
  name: 'panelMenu',
  props: {
    meta: {
      type: String,
    },
    show: {
      type: String,
    }
  },
  data() {
    return {
      sub: { s1: '', s2: '', s3: '', s4: '', s5: '', s6: '' }
    };
  },
  methods: {
    subMenu(id){
      this.sub['s' + id] = this.sub['s' + id]=='active' ? '' : 'active';
    }
  }
};
</script>
