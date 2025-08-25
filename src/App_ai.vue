<template>
    <div class="">
        <div class="container">
            <div v-if="app.auth && load">
                <div>
                    <toastr />
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
            app: {
                auth: false // Start with auth false
            }
        };
    },
    async mounted() {
        try {
            // Check if Telegram Web App is available
            if (window.Telegram?.WebApp) {
                window.Telegram.WebApp.ready();
                window.Telegram.WebApp.expand();
                console.log('Telegram Web App initialized:', window.Telegram.WebApp.initData);
            } else {
                console.warn('Running outside Telegram Web App');
            }

            // Start loading images
            await this.preloadImages();
            
            // Set load to true after images are loaded
            this.load = true;
        } catch (error) {
            console.error('Error during initialization:', error);
            this.$toast('Error during initialization: ' + error.message, { type: 'error' });
            // Still set load to true to show content
            this.load = true;
        }
    },
    methods: {
        async preloadImages() {
            try {
                const images = import.meta.glob("@/assets/**/*.{png,jpeg,jpg,svg,webp,gif,bmp,tiff}");
                const imagePaths = Object.keys(images);
                const totalImages = imagePaths.length;
                let loadedImages = 0;

                if (totalImages === 0) {
                    console.warn('No images found to preload');
                    return;
                }

                const loadPromises = imagePaths.map(async (imagePath) => {
                    try {
                        const imageModule = await images[imagePath]();
                        const img = new Image();
                        img.src = imageModule.default;
                        
                        return new Promise((resolve, reject) => {
                            const timeout = setTimeout(() => {
                                console.warn(`Image load timeout: ${imagePath}`);
                                loadedImages++;
                                this.progress = Math.round((loadedImages / totalImages) * 100);
                                resolve();
                            }, 5000); // 5 second timeout

                            img.onload = () => {
                                clearTimeout(timeout);
                                loadedImages++;
                                this.progress = Math.round((loadedImages / totalImages) * 100);
                                resolve();
                            };
                            img.onerror = () => {
                                clearTimeout(timeout);
                                console.error(`Failed to load image: ${imagePath}`);
                                loadedImages++;
                                this.progress = Math.round((loadedImages / totalImages) * 100);
                                resolve(); // Resolve even on error
                            };
                        });
                    } catch (error) {
                        console.error(`Error loading image ${imagePath}:`, error);
                        loadedImages++;
                        this.progress = Math.round((loadedImages / totalImages) * 100);
                    }
                });

                await Promise.all(loadPromises);
            } catch (error) {
                console.error('Error in preloadImages:', error);
                throw error;
            }
        }
    }
};
</script>

<style scoped>
.container {
    position: relative;
}

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
    transition: width 0.3s ease;
}

.container {
    display: block;
}

.modal-backdrop.fade {
    z-index: 1050;
}
</style>
