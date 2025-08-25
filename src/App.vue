<template>
    <div class="">
        <div class="container">
            <div v-if="app.auth && load">
                <div>
                    <Toaster />
                    <Navbar />
                </div>
                <div>
                    <router-view />
                </div>
                <Sidebar />
            </div>
            <div v-else class="loading-screen">
                <div class="fon-home"></div>
                <div class="lobby-home"></div>
                <div class="lobby-heros"></div>

                <div class="progress-block">
                    <div class="w-80">
                        <div class="fs-14px">Loading {{ progress }}%</div>
                        <div class="progress-bar mt-4">
                            <div class="progress" :style="{width: progress + '%'}"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal-backdrop fade" id="modalBackdrop"></div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            progress: 0,
            load: false,
        };
    },
    mounted() {
        this.checkAppVersion();
        this.preloadImages();
    },
    methods: {
        async checkAppVersion() {
            try {
                const res = await fetch('/version.json', { cache: 'no-store' });
                const data = await res.json();
                const currentVersion = data.version;
                const localVersion = localStorage.getItem('app_version');
                
                if (!localVersion) {
                    localStorage.setItem('app_version', currentVersion);
                    return;
                }
                
                if (localVersion !== currentVersion) {
                    localStorage.setItem('app_version', currentVersion);
                    // Добавить подтверждение перед перезагрузкой
                    if (confirm('Доступно обновление. Перезагрузить приложение?')) {
                        location.reload(true);
                    }
                }
            } catch (e) {
                console.warn('Version check failed:', e);
            }
        },
        async preloadImages() {
            try {
                const images = import.meta.glob("@/assets/**/*.{png,jpeg,jpg,svg,webp,gif,bmp,tiff}");
                const imagePaths = Object.keys(images);
                const totalImages = imagePaths.length;
                let loadedImages = 0;

                if (totalImages === 0) {
                    console.warn('No images found to preload');
                    this.load = true;
                    return;
                }

                for (const imagePath of imagePaths) {
                    try {
                        const imageModule = await images[imagePath]();
                        const img = new Image();
                        img.src = imageModule.default;
                        
                        img.onload = img.onerror = () => {
                            loadedImages++;
                            this.progress = Math.round((loadedImages / totalImages) * 100);
                            if (loadedImages === totalImages) {
                                this.load = true;
                            }
                        };
                    } catch (error) {
                        console.error(`Error loading image ${imagePath}:`, error);
                        loadedImages++;
                        this.progress = Math.round((loadedImages / totalImages) * 100);
                        if (loadedImages === totalImages) {
                            this.load = true;
                        }
                    }
                }
            } catch (error) {
                console.error('Error in preloadImages:', error);
                // Set load to true even if there's an error to prevent app from hanging
                this.load = true;
            }
        },
    },
};
</script>

<style scoped>
.container {position: relative;}
.loading-screen {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: -40px;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    color: white;
    text-align: center;
    font-size: 2rem;
    transition: opacity 0.5s ease;
}

.progress-block {
    position: absolute;
    width: 100%;
    display: flex;
    justify-content: center;
    bottom: 20%;
    z-index: 1;
}

.progress-bar {
    height: 9px;
    background-color: #6d6d6d85;
    border-radius: 50px;
}
.progress-bar > .progress {
    height: 8px;
    background-color: #32bfe2;
}

.container {
    display: block;
}

.modal-backdrop.fade {
    z-index: 1050;
}
</style>