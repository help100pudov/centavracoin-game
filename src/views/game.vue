<template>
    <div id="app">
        <canvas ref="gameCanvas"></canvas>
        <div id="resources">
            <div class="resource" v-for="(value, type) in resources" :key="type">
                <div :class="'meteor ' + type"></div>
                <div class="resource-info">
                    <div class="resource-amount">{{ value.toFixed(2) }} kg</div>
                    <div class="resource-value">{{ formatResourceValue(type, value) }}</div>
                </div>
            </div>
            <div class="resource health">
                <div class="health-icon">❤️</div>
                <div class="health-info">
                    <div class="health-percent">{{ shipHealthPercent }}%</div>
                    <div class="health-bar">
                        <div class="health-fill" :style="{ width: shipHealthPercent + '%' }"></div>
                    </div>
                </div>
            </div>
            
            <!-- Pity System Display -->
            <div v-if="pitySystem" class="pity-info">
                <div class="pity-title">🎯 Pity System</div>
                <div class="pity-progress">
                    <div class="pity-bar">
                        <div class="pity-fill" :style="{ width: getPityProgress() + '%' }"></div>
                    </div>
                    <div class="pity-text">{{ getPityText() }}</div>
                </div>
            </div>
            
            <!-- Daily Rewards Info -->
            <div v-if="dailyRewards" class="daily-info">
                <div class="daily-title">📅 Daily Rewards</div>
                <div class="daily-progress">
                    <div class="daily-bar">
                        <div class="daily-fill" :style="{ width: getDailyProgress() + '%' }"></div>
                    </div>
                    <div class="daily-text">{{ dailyRewards.total.toFixed(2) }}/50 CENTA</div>
                </div>
            </div>
        </div>
        <div class="back">
            <button @click="$router.push('/')" class="back-btn">{{$t('Back')}}</button>
        </div>
        
        <!-- Кнопка автопилота -->
        <div class="autopilot-controls">
            <button 
                v-if="!autopilotActive"
                @click="showAutopilotModal = true" 
                class="autopilot-btn"
            >
                🚀 Start Autopilot
            </button>
            <button 
                v-else
                @click="stopAutopilot" 
                class="autopilot-btn active"
            >
                🛑 Stop Autopilot
            </button>
            <div v-if="autopilotStatus" class="autopilot-status">
                {{ autopilotStatus }}
                <div v-if="activePlan" class="plan-info">
                    Plan: {{ activePlan.name }} | Bonus: x{{ activePlan.bonus }}
                </div>
            </div>
        </div>

        <!-- Модальное окно выбора плана автопилота -->
        <div v-if="showAutopilotModal" class="autopilot-modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>🚀 AUTOPILOT IS LIVE!</h2>
                    <button @click="showAutopilotModal = false" class="close-btn">×</button>
                </div>
                
                <div class="modal-body">
                    <p class="modal-description">
                        Activate your Centa mining autopilot and earn rewards automatically — no effort, pure gains! 💰⚙️
                    </p>
                    
                    <!-- Компактная сетка: тарифы слева, оплата справа -->
                    <div class="autopilot-layout">
                        <!-- Левая колонка: тарифы -->
                        <div class="plans-column">
                            <h3 class="plans-title">Choose your plan:</h3>
                            <div class="plans-grid">
                                <div 
                                    v-for="plan in autopilotPlans" 
                                    :key="plan.id"
                                    @click="selectPlan(plan)"
                                    :class="['plan-card-compact', { selected: selectedPlan?.id === plan.id }]"
                                >
                                    <div class="plan-header-compact">
                                        <h4>{{ plan.name }}</h4>
                                        <div class="plan-price-compact">{{ plan.price }} TON</div>
                                    </div>
                                    <div class="plan-bonus-compact">x{{ plan.bonus }} Bonus</div>
                                    <div class="plan-duration-compact">{{ plan.duration }}</div>
                                    <div class="plan-popular-compact" v-if="plan.popular">🔥 POPULAR</div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Правая колонка: оплата -->
                        <div class="payment-column">
                            <h3 class="payment-title">Payment & Activation</h3>
                            
                            <!-- Если план не выбран -->
                            <div v-if="!selectedPlan" class="no-plan-selected">
                                <p>👆 Select a plan from the left to continue</p>
                            </div>
                            
                            <!-- Если план выбран -->
                            <div v-else class="plan-selected">
                                <div class="selected-plan-card">
                                    <h4>{{ selectedPlan.name }}</h4>
                                    <div class="plan-details">
                                        <span class="price">{{ selectedPlan.price }} TON</span>
                                        <span class="bonus">x{{ selectedPlan.bonus }} Bonus</span>
                                        <span class="duration">{{ selectedPlan.duration }}</span>
                                    </div>
                                </div>
                                
                                <!-- Подключение кошелька -->
                                <div v-if="!isConnected" class="wallet-section">
                                    <p class="wallet-info">Connect your TON wallet to continue</p>
                                    
                                    <!-- Предупреждение о кошельке -->
                                    <div class="wallet-warning">
                                        <p class="warning-text">⚠️ Important: One TON wallet can only be connected to one Telegram account at a time.</p>
                                        <p class="warning-details">If you're using the same phone with different Telegram accounts, each account needs its own wallet.</p>
                                    </div>
                                    
                                    <button @click="connectWallet" class="connect-wallet-btn-compact">
                                        🔗 Connect TON Wallet
                                    </button>
                                    <button @click="manualWalletInput" class="manual-wallet-btn-compact">
                                        📝 Enter Address Manually
                                    </button>
                                </div>
                                
                                <!-- Кнопка активации -->
                                <div v-else class="activation-section">
                                    <div class="wallet-status-compact">
                                        <span class="status">✅ Wallet Connected</span>
                                        <span class="address">{{ walletAddress.slice(0, 6) }}...{{ walletAddress.slice(-6) }}</span>
                                    </div>
                                    
                                    <button 
                                        @click="activateAutopilot" 
                                        :disabled="processingPayment"
                                        class="activate-btn-compact"
                                    >
                                        {{ processingPayment ? 'Processing...' : `🚀 Activate for ${selectedPlan.price} TON` }}
                                    </button>
                                </div>
                            </div>
                            
                            <!-- Информация о джекпоте -->
                            <div class="jackpot-info">
                                <h4>🎁 Jackpot Chances:</h4>
                                <ul>
                                    <li>Every 10th buyer: x100 Bonus</li>
                                    <li>Every 100th buyer: x500 Bonus</li>
                                    <li>Every 1000th buyer: x1000 Bonus</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="gameOver" id="game-over-screen">
            <h1>{{ $t("Game over") }}!</h1>
            <button @click="restartGame">{{ $t("Start again") }}</button>
        </div>
    </div>
</template>

<script>
import shipImage from "@/assets/images/game/ships/ship.png";
import shipBullet from "@/assets/sound/shipbullet.mp3";
import gold from "@/assets/images/game/resources/gold.png";
import silver from "@/assets/images/game/resources/silver.png";
import iron from "@/assets/images/game/resources/iron.png";
import copper from "@/assets/images/game/resources/copper.png";
import enemy from "@/assets/images/game/ships/enemy.png";
import bullet from "@/assets/images/game/resources/gold.png";
import enemyBullet from "@/assets/images/game/resources/silver.png";
import tgMixin from '@/mixins/tg.js';
import { getTonConnectUI } from '@/tonconnect.js';

export default {
    mixins: [tgMixin],
    data() {
        return {
            resources: {gold: 0, silver: 0, copper: 0, iron: 0},
            meteors: [],
            meteorTypes: ["gold", "silver", "copper", "iron"],
            enemies: [],
            bullets: [],
            enemyBullets: [],
            ship: {
                x: 0,
                y: 0,
                width: 60,
                height: 60,
                image: null,
                weapon: 1, // Тип оружия (1-10)
                health: 10, // Прочность
            },
            lastShotTime: 0,
            shotInterval: 300,
            canvas: null,
            ctx: null,
            animationFrameId: null,
            selectedShipIndex: 0,
            shipImageWidth: 213,
            shipImageHeight: 256,
            columns: 6,
            rows: 5,
            resourceImageSize: 40,
            meteorFallSpeed: 1,
            enemyHealth: 3,
            enemySpawnInterval: null,
            enemySpawnTimer: null,
            shipHealthPercent: 100,
            gameOver: false,
            images: {
                gold: gold,
                silver: silver,
                iron: iron,
                copper: copper,
                enemy: enemy,
                bullet: bullet,
                enemyBullet: enemyBullet,
            },
            selectedAutopilot: { duration: 9999 },
            autopilotStatus: null,
            user: null,
            walletAddress: null,
            toast: null,
            tonKeeperEnabled: false,
            tonKeeperInitialized: false,
            tonConnectUI: null,
            showAutopilotModal: false,
            autopilotPlans: [
                { 
                    id: 1, 
                    name: '1 Day Plan', 
                    price: process.env.VUE_APP_AUTOPILOT_DAY_PRICE || 0.1, 
                    duration: '1 Day', 
                    bonus: process.env.VUE_APP_AUTOPILOT_DAY_BONUS || 1, 
                    popular: false 
                },
                { 
                    id: 2, 
                    name: '1 Month Plan', 
                    price: process.env.VUE_APP_AUTOPILOT_MONTH_PRICE || 1, 
                    duration: '1 Month', 
                    bonus: process.env.VUE_APP_AUTOPILOT_MONTH_BONUS || 2, 
                    popular: true 
                },
                { 
                    id: 3, 
                    name: 'Until 2026', 
                    price: process.env.VUE_APP_AUTOPILOT_YEAR_PRICE || 2, 
                    duration: 'Until 2026', 
                    bonus: process.env.VUE_APP_AUTOPILOT_YEAR_BONUS || 3, 
                    popular: false 
                },
                { 
                    id: 4, 
                    name: 'Super Autopilot', 
                    price: process.env.VUE_APP_AUTOPILOT_LIFETIME_PRICE || 5, 
                    duration: 'Lifetime', 
                    bonus: process.env.VUE_APP_AUTOPILOT_LIFETIME_BONUS || 5, 
                    popular: false 
                }
            ],
            selectedPlan: null,
            processingPayment: false,
            activePlan: null, // Активный план автопилота
            showManualInputOption: false, // Показывать ли опцию ручного ввода
        };
    },
    mounted() {
        console.log('[GAME] Component mounted, user:', this.user);
        console.log('[GAME] Store state:', this.$store?.state);
        
        // Проверяем переменные окружения для автопилота
        console.log('[GAME] Environment variables check:', {
            hotWallet: process.env.VUE_APP_HOT_WALLET_ADDRESS,
            centaJetton: process.env.VUE_APP_CENTA_JETTON_ADDRESS,
            autopilotBaseCenta: process.env.VUE_APP_AUTOPILOT_BASE_CENTA,
            dayPrice: process.env.VUE_APP_AUTOPILOT_DAY_PRICE,
            monthPrice: process.env.VUE_APP_AUTOPILOT_MONTH_PRICE
        });
        
        // Инициализируем toast для уведомлений
        if (this.$toast) {
            this.toast = this.$toast;
        } else if (this.$toastification) {
            this.toast = this.$toastification;
        }
        
        // Последовательная инициализация (не параллельно)
        this.loadShipImage();
        this.loadResourceImages();
        this.initGame();
        
        // Инициализируем пользователя
        this.initUser();
        
        // Получаем данные пользователя из store
        if (this.$store) {
            this.$store.dispatch('fetchUserData');
        }
        
        // TON Keeper инициализируем сразу
        this.initTonKeeper();
    },
    beforeUnmount() {
        this.cleanupGame();
    },
    methods: {
        async initTonKeeper() {
            try {
                console.log('[GAME] Starting TON Connect initialization...');
                // Проверяем доступность TON Connect
                if (typeof getTonConnectUI === 'function') {
                    this.tonConnectUI = getTonConnectUI();
                    console.log('[GAME] TON Connect UI created:', !!this.tonConnectUI);
                    
                    // Простая инициализация как в top.vue
                    if (this.tonConnectUI && this.tonConnectUI.onStatusChange) {
                        this.tonConnectUI.onStatusChange((wallet) => {
                            console.log('[GAME] TON Connect status changed:', wallet);
                            this.isConnected = !!wallet;
                            this.walletAddress = wallet?.account?.address || '';
                            this.tonKeeperEnabled = !!wallet;
                            this.tonKeeperInitialized = !!wallet;
                            console.log('[GAME] Wallet address set to:', this.walletAddress);
                            console.log('[GAME] TON Connect status:', {
                                isConnected: this.isConnected,
                                walletAddress: this.walletAddress,
                                tonKeeperEnabled: this.tonKeeperEnabled,
                                tonKeeperInitialized: this.tonKeeperInitialized
                            });
                        });
                        console.log('[GAME] TON Connect initialized successfully');
                    } else {
                        console.warn('[GAME] TON Connect UI missing onStatusChange method');
                    }
                } else {
                    console.warn('[GAME] TON Connect not available');
                    this.tonKeeperEnabled = false;
                    this.tonKeeperInitialized = false;
                }
            } catch (error) {
                console.error('[GAME] TON Connect initialization failed:', error);
                this.tonKeeperEnabled = false;
                this.tonKeeperInitialized = false;
                // Показываем ошибку пользователю
                if (this.toast) {
                    this.toast.error('TON Connect initialization error: ' + error.message, { timeout: 5000 });
                }
            }
        },

        // Переключение автопилота
        async toggleAutopilot() {
            if (this.autopilotActive) {
                this.stopAutopilot();
            } else {
                await this.startAutopilot();
            }
        },

        // Запуск автопилота с авторизацией
        async startAutopilot() {
            try {
                this.autopilotStatus = 'Autopilot activated! Running...';
                
                // Запускаем автопилот
                this.autopilotActive = true;
                this.startAutopilotLogic();
                
                console.log('[AUTOPILOT] Started with plan:', this.activePlan);
                
                // Показываем информацию о бонусах
                if (this.activePlan) {
                    this.showBonusInfo();
                }
                
            } catch (error) {
                console.error('[AUTOPILOT] Error starting autopilot:', error);
                this.autopilotStatus = `Error: ${error.message}`;
            }
        },

        // Показ информации о бонусах
        showBonusInfo() {
            const plan = this.activePlan;
            const bonus = plan.bonus;
            
            this.autopilotStatus = `🚀 ${plan.name} Active! x${bonus} Efficiency`;
            
            // Показываем уведомление о бонусах
            if (this.toast) {
                this.toast.success(`🚀 Autopilot activated! x${bonus} efficiency bonus applied!`, { timeout: 5000 });
            }
            
            console.log(`[AUTOPILOT] Plan activated: ${plan.name} with x${bonus} efficiency`);
        },

        // Остановка автопилота
        stopAutopilot() {
            this.autopilotActive = false;
            this.autopilotStatus = 'Autopilot stopped';
            
            if (this.autopilotInterval) {
                clearInterval(this.autopilotInterval);
                this.autopilotInterval = null;
            }
            
            console.log('[AUTOPILOT] Stopped');
        },

        // Логика автопилота (работает в фоне)
        startAutopilotLogic() {
            this.autopilotInterval = setInterval(() => {
                if (this.autopilotActive && this.tonKeeperInitialized) {
                    this.runAutopilotLogic();
                }
            }, 100); // Обновляем каждые 100мс для плавности
        },

        // Основная логика автопилота
        runAutopilotLogic() {
            if (!this.canvas || this.gameOver) return;

            // Применяем бонусы эффективности от активного плана
            const efficiencyBonus = this.activePlan ? this.activePlan.bonus : 1;
            const moveSpeed = 4 * efficiencyBonus; // Увеличиваем скорость движения
            const collectionRadius = 50 + (efficiencyBonus * 10); // Увеличиваем радиус сбора
            const shootInterval = Math.max(100, 300 - (efficiencyBonus * 50)); // Уменьшаем интервал стрельбы

            // 1. Проверяем здоровье корабля
            if (this.ship.health < 3) {
                this.autoHealStrategy();
                return;
            }

            // 2. Приоритет: уклонение от врагов
            if (this.enemies.length > 0) {
                this.autoDodgeEnemies();
            }

            // 3. Приоритет: сбор ценных метеоритов с увеличенным радиусом
            this.autoCollectValuableMeteors(collectionRadius);

            // 4. Автоматическое движение к лучшим целям с увеличенной скоростью
            this.autoMoveToBestTarget(moveSpeed);

            // 5. Автоматическая стрельба с увеличенной частотой
            this.autoShoot(shootInterval);

            // 6. Автоматический сбор близких метеоритов с увеличенным радиусом
            this.autoCollectMeteors(collectionRadius);
        },

        // Стратегия лечения
        autoHealStrategy() {
            // Двигаемся в безопасную зону (нижняя часть экрана)
            const safeZone = this.canvas.height - 150;
            if (this.ship.y > safeZone) {
                this.ship.y = Math.max(safeZone, this.ship.y - 2);
            }
            
            // Уклоняемся от всех угроз
            this.autoDodgeEnemies();
        },

        // Автоматический сбор ценных метеоритов с новой системой наград
        autoCollectValuableMeteors(radius) {
            const resourcePriority = ['gold', 'silver', 'copper', 'iron'];
            
            for (const priority of resourcePriority) {
                const valuableMeteors = this.meteors.filter(m => m.type === priority);
                
                for (const meteor of valuableMeteors) {
                    const distance = Math.sqrt(
                        Math.pow(this.ship.x - meteor.x, 2) + 
                        Math.pow(this.ship.y - meteor.y, 2)
                    );

                    // Если ценный метеорит близко, собираем его
                    if (distance < radius) {
                        // Применяем новую систему наград согласно JSON конфигу
                        const reward = this.calculateReward(meteor, 'autopilot');
                        
                        // Обновляем ресурсы с учетом массы
                        this.resources[meteor.type] += meteor.mass;
                        
                        const index = this.meteors.indexOf(meteor);
                        if (index > -1) {
                            this.meteors.splice(index, 1);
                        }
                        
                        // Обновляем счетчик пользователя
                        if (this.user && meteor.token) {
                            this.user[meteor.type] += meteor.mass;
                        }
                        
                        // Логируем сбор с наградой
                        console.log(`[AUTOPILOT] Collected ${meteor.type} meteor: ${meteor.mass}kg = ${reward} nCENTA`);
                    }
                }
            }
        },

        // Новая система расчета наград согласно JSON конфигу
        calculateReward(meteor, source = 'manual') {
            // Базовый множитель
            let multiplier = 1.0;
            
            // Множитель автопилота (AFK penalty)
            if (source === 'autopilot') {
                multiplier *= 0.6; // Согласно JSON: autopilot multiplier 0.6
            }
            
            // Множитель устройства (device fairness)
            const deviceMultiplier = this.getDeviceMultiplier();
            multiplier *= deviceMultiplier;
            
            // Множитель навыка (hit accuracy)
            const skillMultiplier = this.getSkillMultiplier();
            multiplier *= skillMultiplier;
            
            // Множитель стрика (если есть)
            const streakMultiplier = this.getStreakMultiplier();
            multiplier *= streakMultiplier;
            
            // Применяем daily soft cap и diminishing returns
            const finalReward = this.applyDailyLimits(meteor.value * multiplier);
            
            return Math.round(finalReward);
        },

        // Получение множителя устройства согласно JSON конфигу
        getDeviceMultiplier() {
            // Определяем тип устройства
            const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
            const hasGPU = this.detectGPU();
            
            if (isMobile) {
                return 1.0; // Phone: 1.0x
            } else if (hasGPU) {
                return 1.10; // GPU: 1.10x (capped at 1.10x)
            } else {
                return 1.05; // PC CPU: 1.05x
            }
        },

        // Определение наличия GPU
        detectGPU() {
            try {
                const canvas = document.createElement('canvas');
                const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
                if (gl) {
                    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
                    if (debugInfo) {
                        const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
                        return renderer.toLowerCase().includes('gpu') || 
                               renderer.toLowerCase().includes('radeon') || 
                               renderer.toLowerCase().includes('geforce');
                    }
                }
            } catch (e) {
                console.log('[DEVICE] GPU detection failed:', e);
            }
            return false;
        },

        // Получение множителя навыка (hit accuracy)
        getSkillMultiplier() {
            // Упрощенная система: если игрок активно стреляет, даем бонус
            const now = Date.now();
            const recentShots = this.bullets.filter(b => now - b.timestamp < 5000).length;
            
            if (recentShots > 10) {
                return 1.15; // High activity: 1.15x
            } else if (recentShots > 5) {
                return 1.0;  // Medium activity: 1.0x
            } else {
                return 0.9;  // Low activity: 0.9x
            }
        },

        // Получение множителя стрика
        getStreakMultiplier() {
            if (!this.streakData) {
                this.streakData = { startTime: Date.now(), hours: 0 };
            }
            
            const now = Date.now();
            const hoursPlayed = (now - this.streakData.startTime) / (1000 * 60 * 60);
            
            // Согласно JSON: 0.02 per hour, cap at 1.3
            const streakBonus = Math.min(1.3, 1.0 + (hoursPlayed * 0.02));
            
            return streakBonus;
        },

        // Применение daily soft cap и diminishing returns
        applyDailyLimits(reward) {
            if (!this.dailyRewards) {
                this.dailyRewards = { total: 0, lastReset: Date.now() };
            }
            
            // Сброс daily rewards каждые 24 часа
            const now = Date.now();
            const hoursSinceReset = (now - this.dailyRewards.lastReset) / (1000 * 60 * 60);
            if (hoursSinceReset >= 24) {
                this.dailyRewards.total = 0;
                this.dailyRewards.lastReset = now;
            }
            
            // Daily soft cap: 50 CENTA
            if (this.dailyRewards.total >= 50) {
                return 0; // Достигнут дневной лимит
            }
            
            // Diminishing returns после 30 CENTA
            let finalReward = reward;
            if (this.dailyRewards.total > 30) {
                const overLimit = this.dailyRewards.total - 30;
                const penalty = 0.5; // Согласно JSON: slope 0.5
                finalReward *= Math.pow(penalty, overLimit / 10);
            }
            
            // Обновляем дневной счетчик
            this.dailyRewards.total += finalReward;
            
            return finalReward;
        },

        // Движение к лучшей цели
        autoMoveToBestTarget(speed) {
            if (this.meteors.length === 0) return;

            // Находим лучшую цель (самый ценный и близкий метеорит)
            let bestTarget = null;
            let bestScore = -Infinity;
            const resourceValues = { gold: 4, silver: 3, iron: 2, copper: 1 };

            for (const meteor of this.meteors) {
                const distance = Math.sqrt(
                    Math.pow(this.ship.x - meteor.x, 2) + 
                    Math.pow(this.ship.y - meteor.y, 2)
                );
                
                // Считаем приоритет: ценность / расстояние
                const score = resourceValues[meteor.type] / (distance + 1);
                
                if (score > bestScore) {
                    bestScore = score;
                    bestTarget = meteor;
                }
            }

            if (bestTarget) {
                // Плавно двигаем корабль к лучшей цели
                const targetX = bestTarget.x;
                const currentX = this.ship.x;

                if (Math.abs(targetX - currentX) > 3) {
                    if (targetX > currentX) {
                        this.ship.x = Math.min(targetX, currentX + speed);
                    } else {
                        this.ship.x = Math.max(targetX, currentX - speed);
                    }
                }

                // Ограничиваем движение в пределах canvas
                this.ship.x = Math.max(this.ship.width / 2, Math.min(this.ship.x, this.canvas.width - this.ship.width / 2));
            }
        },

        // Автоматическая стрельба
        autoShoot(interval) {
            if (this.meteors.length === 0) return;

            // Стреляем в ближайший метеорит
            let targetMeteor = null;
            let minDistance = Infinity;

            for (const meteor of this.meteors) {
                const distance = Math.sqrt(
                    Math.pow(this.ship.x - meteor.x, 2) + 
                    Math.pow(this.ship.y - meteor.y, 2)
                );
                if (distance < minDistance) {
                    minDistance = distance;
                    targetMeteor = meteor;
                }
            }

            if (targetMeteor && targetMeteor.y < this.ship.y - 50) {
                // Если метеорит выше корабля, стреляем
                this.createBullet();
            }
        },

        // Автоматический сбор метеоритов с новой системой наград
        autoCollectMeteors(radius) {
            for (let i = this.meteors.length - 1; i >= 0; i--) {
                const meteor = this.meteors[i];
                const distance = Math.sqrt(
                    Math.pow(this.ship.x - meteor.x, 2) + 
                    Math.pow(this.ship.y - meteor.y, 2)
                );

                // Если метеорит близко, собираем его
                if (distance < radius) {
                    // Применяем новую систему наград
                    const reward = this.calculateReward(meteor, 'autopilot');
                    
                    // Обновляем ресурсы с учетом массы
                    this.resources[meteor.type] += meteor.mass;
                    this.meteors.splice(i, 1);
                    
                    // Обновляем счетчик пользователя
                    if (this.user && meteor.token) {
                        this.user[meteor.type] += meteor.mass;
                    }
                    
                    // Логируем сбор
                    console.log(`[AUTOPILOT] Collected ${meteor.type}: ${meteor.mass}kg = ${reward} nCENTA`);
                }
            }
        },

        // Автоматическое уклонение от врагов
        autoDodgeEnemies() {
            for (const enemy of this.enemies) {
                const distance = Math.abs(this.ship.x - enemy.x);
                
                // Если враг близко, уклоняемся
                if (distance < 80) {
                    const dodgeDirection = enemy.x > this.ship.x ? -1 : 1;
                    this.ship.x += dodgeDirection * 5;
                    
                    // Ограничиваем движение
                    this.ship.x = Math.max(this.ship.width / 2, Math.min(this.ship.x, this.canvas.width - this.ship.width / 2));
                }
            }
        },

        // Инициализация пользователя
        async initUser() {
            try {
                console.log('[GAME] Starting user initialization...');
                console.log('[GAME] Store exists:', !!this.$store);
                console.log('[GAME] Store state:', this.$store?.state);
                
                // Получаем пользователя из Vuex store как в других компонентах
                if (this.$store && this.$store.state.user) {
                    this.user = this.$store.state.user;
                    console.log('[GAME] User from store:', this.user);
                } else {
                    console.log('[GAME] No user in store, trying Telegram...');
                    // Если пользователя нет в store, пытаемся получить из Telegram
                    if (typeof this.getTelegramUser === 'function') {
                        const tgUser = this.getTelegramUser();
                        console.log('[GAME] Telegram user:', tgUser);
                        if (tgUser) {
                            // Создаем базового пользователя на основе Telegram данных
                            this.user = {
                                id: tgUser.id,
                                chat: tgUser.id, // Согласно архитектуре - поле chat (Telegram ID)
                                user: tgUser.id, // Дублируем для совместимости
                                first: tgUser.first_name || 'User',
                                last: tgUser.last_name || '',
                                gold: 0,
                                silver: 0,
                                copper: 0,
                                iron: 0,
                                wallet_address: null
                            };
                            console.log('[GAME] Created user from Telegram:', this.user);
                        } else {
                            console.log('[GAME] No Telegram user found');
                        }
                    } else {
                        console.log('[GAME] getTelegramUser function not available');
                    }
                }
                
                // Если все еще нет пользователя, создаем базового для тестирования
                if (!this.user) {
                    console.log('[GAME] Creating default test user...');
                    this.user = {
                        id: 1,
                        chat: 'test_user', // Согласно архитектуре - поле chat
                        user: 'test_user', // Дублируем для совместимости
                        first: 'Test',
                        last: 'User',
                        gold: 0,
                        silver: 0,
                        copper: 0,
                        iron: 0,
                        wallet_address: null
                    };
                    console.log('[GAME] Created default test user');
                }
                
                console.log('[GAME] Final user state:', this.user);
                console.log('[GAME] User chat field:', this.user.chat);
                console.log('[GAME] User user field:', this.user.user);
                console.log('[GAME] User id field:', this.user.id);
                
            } catch (error) {
                console.error('[GAME] Error initializing user:', error);
                // Создаем базового пользователя при ошибке
                this.user = {
                    id: 1,
                    chat: 'error_user', // Согласно архитектуре - поле chat
                    user: 'error_user', // Дублируем для совместимости
                    first: 'Error',
                    last: 'User',
                    gold: 0,
                    silver: 0,
                    copper: 0,
                    iron: 0,
                    wallet_address: null
                };
            }
        },
        async createToken(key) {
            try {
                return await this.$post("/game", {act: "token", key});
            } catch (error) {
                console.error('Error creating token:', error);
                return null;
            }
        },
        async checkToken(key) {
            try {
                return await this.$post("/game", {act: "check", key});
            } catch (error) {
                console.error('Error checking token:', error);
                return null;
            }
        },
        initGame() {
            this.canvas = this.$refs.gameCanvas;
            if (this.canvas) {
                this.ctx = this.canvas.getContext("2d");
                if (this.ctx) {
                    this.resizeCanvas();
                    this.ship.x = this.canvas.width / 2;
                    this.ship.y = this.canvas.height - 100;

                    this.startEnemySpawnTimer();

                    window.addEventListener("resize", this.resizeCanvas);
                    this.canvas.addEventListener("mousemove", this.moveShip);
                    this.canvas.addEventListener("touchmove", this.moveShipTouch);

                    this.gameLoop = this.gameLoop.bind(this);
                    this.animationFrameId = requestAnimationFrame(this.gameLoop);
                } else {
                    console.error("Не удалось получить контекст canvas");
                }
            } else {
                console.error("Canvas элемент не найден");
            }
        },
        cleanupGame() {
            window.removeEventListener("resize", this.resizeCanvas);
            if (this.canvas) {
                this.canvas.removeEventListener("mousemove", this.moveShip);
                this.canvas.removeEventListener("touchmove", this.moveShipTouch);
            }
            cancelAnimationFrame(this.animationFrameId);
            this.stopEnemySpawnTimer();
        },
        restartGame() {
            this.cleanupGame();
            this.resources = {gold: 0, silver: 0, copper: 0, iron: 0};
            this.meteors = [];
            this.enemies = [];
            this.bullets = [];
            this.enemyBullets = [];
            this.ship.health = 10;
            this.shipHealthPercent = 100;
            this.gameOver = false;
            this.initGame();
        },
        resizeCanvas() {
            if (this.canvas) {
                this.canvas.width = Math.min(window.innerWidth, 500);
                this.canvas.height = window.innerHeight;
            }
        },
        moveShip(event) {
            if (this.canvas) {
                this.ship.x = event.clientX;
                this.ship.x = Math.max(this.ship.width / 2, Math.min(this.ship.x, this.canvas.width - this.ship.width / 2));
            }
        },
        moveShipTouch(event) {
            if (this.canvas) {
                const touch = event.touches[0];
                this.ship.x = touch.clientX;
                this.ship.x = Math.max(this.ship.width / 2, Math.min(this.ship.x, this.canvas.width - this.ship.width / 2));
            }
        },
        // Новая система спавна метеоритов с AI_Universal_Resource_Matrix
        async createMeteor() {
            if (this.canvas) {
                try {
                    // Используем новую систему распределения спавна
                    const meteorType = this.calculateMeteorSpawn();
                    let token = await this.createToken(meteorType);
                    
                    if (token) {
                        // Создаем метеорит с реалистичным yield согласно JSON конфигу
                        const yieldData = this.calculateMeteorYield(meteorType);
                        const meteor = new Meteor(
                            Math.random() * this.canvas.width,
                            -50,
                            meteorType,
                            this.canvas.width,
                            yieldData.health,
                            token,
                            yieldData.mass // Добавляем массу металла
                        );
                        this.meteors.push(meteor);
                        
                        // Обновляем счетчик pity системы
                        this.updatePitySystem(meteorType);
                        
                        console.log(`[METEOR] Spawned ${meteorType} with ${yieldData.mass}kg mass`);
                    }
                } catch (error) {
                    console.error('Error creating meteor:', error);
                    // Fallback: создаем стальной метеорит (самый частый)
                    const meteor = new Meteor(
                        Math.random() * this.canvas.width,
                        -50,
                        'iron',
                        this.canvas.width,
                        3,
                        null,
                        10 // 10kg iron как fallback
                    );
                    this.meteors.push(meteor);
                }
            }
        },

        // Расчет типа метеорита согласно AI_Universal_Resource_Matrix
        calculateMeteorSpawn() {
            // Данные из JSON конфига
            const metalData = {
                gold: { spawn_weight: 1, price_usd: 108190, rarity: 'ultra_rare' },
                silver: { spawn_weight: 10, price_usd: 1253, rarity: 'rare' },
                copper: { spawn_weight: 200, price_usd: 9.812, rarity: 'common' },
                iron: { spawn_weight: 1000, price_usd: 0.438, rarity: 'very_common' }
            };

            // Проверяем pity систему
            if (this.shouldForceRareDrop()) {
                return this.selectRareMetal();
            }

            // Применяем формулу inverse price power law
            const beta = 0.9; // Параметр из JSON
            let totalWeight = 0;
            const weights = {};

            // Вычисляем веса для каждого металла
            for (const [metal, data] of Object.entries(metalData)) {
                const weight = data.spawn_weight / Math.pow(data.price_usd, beta);
                weights[metal] = weight;
                totalWeight += weight;
            }

            // Нормализуем веса
            const normalizedWeights = {};
            for (const [metal, weight] of Object.entries(weights)) {
                normalizedWeights[metal] = weight / totalWeight;
            }

            // Выбираем металл на основе весов
            const random = Math.random();
            let cumulativeWeight = 0;
            
            for (const [metal, weight] of Object.entries(normalizedWeights)) {
                cumulativeWeight += weight;
                if (random <= cumulativeWeight) {
                    return metal;
                }
            }

            // Fallback на сталь
            return 'iron';
        },

        // Расчет yield метеорита согласно JSON конфигу
        calculateMeteorYield(metalType) {
            const yieldParams = {
                gold: { mu: 2.0, sigma: 0.6, min: 0.01, max: 5 },
                silver: { mu: 3.0, sigma: 0.7, min: 0.05, max: 20 },
                copper: { mu: 5.0, sigma: 0.9, min: 1, max: 300 },
                iron: { mu: 6.0, sigma: 1.0, min: 5, max: 1000 }
            };

            const params = yieldParams[metalType];
            
            // Генерируем log-normal distribution
            const u = Math.random();
            const v = Math.random();
            const z = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
            const logNormalValue = Math.exp(params.mu + params.sigma * z);
            
            // Ограничиваем значения min/max
            const mass = Math.max(params.min, Math.min(params.max, logNormalValue));
            
            // Здоровье метеорита зависит от массы
            const health = Math.max(1, Math.floor(mass / 10) + 1);

            return { mass: Math.round(mass * 100) / 100, health };
        },

        // Pity система для гарантированного редкого дропа
        updatePitySystem(metalType) {
            if (!this.pitySystem) {
                this.pitySystem = {
                    spawnCount: 0,
                    lastRareDrop: 0,
                    windowEvents: 200
                };
            }

            this.pitySystem.spawnCount++;

            // Если выпал редкий металл, сбрасываем счетчик
            if (metalType === 'gold' || metalType === 'silver') {
                this.pitySystem.lastRareDrop = this.pitySystem.spawnCount;
                console.log(`[PITY] Rare metal ${metalType} dropped, resetting pity counter`);
            }

            // Проверяем, нужно ли принудительно выдать редкий металл
            if (this.pitySystem.spawnCount - this.pitySystem.lastRareDrop >= this.pitySystem.windowEvents) {
                console.log(`[PITY] Pity system triggered after ${this.pitySystem.windowEvents} spawns`);
            }
        },

        // Проверка, нужно ли принудительно выдать редкий металл
        shouldForceRareDrop() {
            if (!this.pitySystem) return false;
            
            const spawnsSinceLastRare = this.pitySystem.spawnCount - this.pitySystem.lastRareDrop;
            return spawnsSinceLastRare >= this.pitySystem.windowEvents;
        },

        // Выбор редкого металла для pity системы
        selectRareMetal() {
            // 70% шанс на серебро, 30% на золото (согласно JSON конфигу)
            return Math.random() < 0.7 ? 'silver' : 'gold';
        },

        // Форматирование стоимости ресурса в читаемом виде
        formatResourceValue(type, mass) {
            const prices = {
                gold: 108190000000,    // 108,190 nCENTA per kg
                silver: 1253000000,    // 1,253 nCENTA per kg
                copper: 9812000,       // 9.812 nCENTA per kg
                iron: 438000          // 0.438 nCENTA per kg
            };

            const totalValue = mass * (prices[type] || prices.iron);
            
            if (totalValue >= 1e9) {
                return `${(totalValue / 1e9).toFixed(2)} CENTA`;
            } else if (totalValue >= 1e6) {
                return `${(totalValue / 1e6).toFixed(2)} mCENTA`;
            } else if (totalValue >= 1e3) {
                return `${(totalValue / 1e3).toFixed(2)} μCENTA`;
            } else {
                return `${totalValue.toFixed(0)} nCENTA`;
            }
        },

        // Получение прогресса pity системы
        getPityProgress() {
            if (!this.pitySystem) return 0;
            
            const progress = ((this.pitySystem.spawnCount - this.pitySystem.lastRareDrop) / this.pitySystem.windowEvents) * 100;
            return Math.min(100, Math.max(0, progress));
        },

        // Получение текста pity системы
        getPityText() {
            if (!this.pitySystem) return '';
            
            const spawnsSinceLastRare = this.pitySystem.spawnCount - this.pitySystem.lastRareDrop;
            const remaining = this.pitySystem.windowEvents - spawnsSinceLastRare;
            
            if (remaining <= 0) {
                return 'Rare drop guaranteed!';
            } else if (remaining <= 20) {
                return `${remaining} spawns until rare drop`;
            } else {
                return `${remaining} spawns until pity`;
            }
        },

        // Получение прогресса daily rewards
        getDailyProgress() {
            if (!this.dailyRewards) return 0;
            return (this.dailyRewards.total / 50) * 100;
        },
        createEnemy() {
            if (this.canvas) {
                const enemyType = Math.floor(Math.random() * 5) + 1; // 5 типов врагов
                const enemy = new Enemy(Math.random() * this.canvas.width, -50, this.enemyHealth, enemyType, this.canvas.width);
                this.enemies.push(enemy);
            }
        },
        createBullet() {
            if (Date.now() - this.lastShotTime > this.shotInterval && this.canvas) {
                let bulletCount = 1;
                let bulletDamage = 1;

                if (this.ship.weapon >= 4 && this.ship.weapon <= 6) {
                    bulletCount = 2;
                    bulletDamage = 2;
                } else if (this.ship.weapon >= 7 && this.ship.weapon <= 10) {
                    bulletCount = 3;
                    bulletDamage = 3;
                }

                for (let i = 0; i < bulletCount; i++) {
                    this.playShipBullet();
                    this.bullets.push({
                        x: this.ship.x + (i - (bulletCount - 1) / 2) * 10,
                        y: this.ship.y,
                        damage: bulletDamage,
                        timestamp: Date.now() // Добавляем timestamp для системы навыков
                    });
                }
                this.lastShotTime = Date.now();
            }
        },
        gameLoop() {
            if (!this.ctx || !this.canvas || this.gameOver) return;

            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            if (Math.random() < 0.02) {
                this.createMeteor();
            }
            if (Math.random() < 0.0005) {
                this.createEnemy();
            }

            this.createBullet();

            // Обновление и отрисовка метеоров (ресурсов)
            for (let i = this.meteors.length - 1; i >= 0; i--) {
                const meteor = this.meteors[i];
                meteor.update(this.meteorFallSpeed);

                // Получаем индекс типа метеорита
                const meteorTypeIndex = this.meteorTypes.indexOf(meteor.type);

                // Получаем изображение метеорита из массива images
                const meteorImage = Object.values(this.images)[meteorTypeIndex];

                meteor.draw(this.ctx, meteorImage);

                // Проверка столкновения с кораблем
                if (this.checkCollision(this.ship, meteor)) {
                    // Применяем новую систему наград
                    const reward = this.calculateReward(meteor, 'manual');
                    
                    // Обновляем ресурсы с учетом массы
                    this.resources[meteor.type] += meteor.mass;
                    this.meteors.splice(i, 1);
                    
                    // Логируем сбор
                    console.log(`[COLLECTION] Collected ${meteor.type}: ${meteor.mass}kg = ${reward} nCENTA`);
                }

                // Проверка столкновения пуль с метеорами
                for (let j = this.bullets.length - 1; j >= 0; j--) {
                    const bullet = this.bullets[j];
                    if (this.checkCollision(meteor, bullet)) {
                        meteor.takeDamage(bullet.damage);
                        this.bullets.splice(j, 1);
                        if (meteor.health <= 0) {
                            // Применяем новую систему наград
                            const reward = this.calculateReward(meteor, 'manual');
                            
                            // Обновляем ресурсы с учетом массы
                            this.resources[meteor.type] += meteor.mass;
                            this.meteors.splice(i, 1);
                            this.checkToken(meteor.token);
                            
                            // ЗАЩИТА: проверяем что this.user существует перед обращением
                            if (this.user && meteor.token) {
                                this.user[meteor.type] += meteor.mass;
                            }
                            
                            // Логируем уничтожение
                            console.log(`[DESTRUCTION] Destroyed ${meteor.type}: ${meteor.mass}kg = ${reward} nCENTA`);
                            break;
                        }
                    }
                }
            }

            // Обновление и отрисовка врагов
            for (let i = this.enemies.length - 1; i >= 0; i--) {
                const enemy = this.enemies[i];
                enemy.update();
                enemy.draw(this.ctx, this.images.enemy);

                // Стрельба врагов
                const enemyBullet = enemy.shoot(this.ship.x, this.ship.y);
                if (enemyBullet) {
                    this.enemyBullets.push(enemyBullet);
                }

                // Проверка столкновения пуль с врагами
                for (let j = this.bullets.length - 1; j >= 0; j--) {
                    const bullet = this.bullets[j];
                    if (this.checkCollision(enemy, bullet)) {
                        enemy.takeDamage(bullet.damage);
                        this.bullets.splice(j, 1);
                        if (enemy.health <= 0) {
                            this.enemies.splice(i, 1);
                            break;
                        }
                    }
                }
            }

            // Обновление и отрисовка пуль
            for (let i = this.bullets.length - 1; i >= 0; i--) {
                const bullet = this.bullets[i];
                bullet.y -= 5;
                if (bullet.y < 0) {
                    this.bullets.splice(i, 1);
                } else {
                    this.ctx.drawImage(this.images.bullet, bullet.x - 5, bullet.y - 10, 10, 20);
                }
            }

            // Обновление и отрисовка вражеских пуль
            for (let i = this.enemyBullets.length - 1; i >= 0; i--) {
                const bullet = this.enemyBullets[i]; // Получаем вражескую пулю

                bullet.x += bullet.dx;
                bullet.y += bullet.dy;

                if (bullet.y > this.canvas.height || bullet.x < 0 || bullet.x > this.canvas.width) {
                    this.enemyBullets.splice(i, 1);
                } else {
                    this.ctx.drawImage(this.images.bullet, bullet.x - 5, bullet.y - 10, 10, 20);
                }

                // Проверка столкновения вражеских пуль с кораблем
                if (this.checkCollision(this.ship, bullet)) {
                    this.ship.health -= 1;
                    this.shipHealthPercent = (this.ship.health / 10) * 100;
                    this.enemyBullets.splice(i, 1);
                    if (this.ship.health <= 0) {
                        console.log("Корабль уничтожен!");
                        this.stopEnemySpawnTimer();
                        cancelAnimationFrame(this.animationFrameId);
                        this.gameOver = true;
                    }
                }

                // Проверка столкновения вражеских пуль с пулями корабля
                for (let j = this.bullets.length - 1; j >= 0; j--) {
                    const playerBullet = this.bullets[j];
                    if (this.checkCollision(bullet, playerBullet)) {
                        this.enemyBullets.splice(i, 1);
                        this.bullets.splice(j, 1);
                        break;
                    }
                }
            }

            // Рисуем корабль
            if (this.ship.image) {
                const column = this.selectedShipIndex % this.columns;
                const row = Math.floor(this.selectedShipIndex / this.columns);

                const xOffset = column * this.shipImageWidth;
                const yOffset = row * this.shipImageHeight;

                this.ctx.drawImage(this.ship.image, xOffset, yOffset, this.shipImageWidth, this.shipImageHeight, this.ship.x - this.ship.width / 2, this.ship.y, this.ship.width, this.ship.height);
            }

            this.animationFrameId = requestAnimationFrame(this.gameLoop);
        },

        checkCollision(obj1, obj2) {
            return obj1.x + obj1.width / 2 > obj2.x - (obj2.width || 10) / 2 && obj1.x - obj1.width / 2 < obj2.x + (obj2.width || 10) / 2 && obj1.y + obj1.height / 2 > obj2.y - (obj2.height || 20) / 2 && obj1.y - obj1.height / 2 < obj2.y + (obj2.height || 20) / 2;
        },

        startEnemySpawnTimer() {
            this.enemySpawnInterval = Math.floor(Math.random() * 6000) + 5000; // 5-10 секунд
            this.enemySpawnTimer = setInterval(this.createEnemy, this.enemySpawnInterval);
        },
        stopEnemySpawnTimer() {
            clearInterval(this.enemySpawnTimer);
        },

        loadShipImage() {
            const img = new Image();
            img.src = shipImage;
            img.onload = () => {
                this.ship.image = img;
            };
        },

        loadResourceImages() {
            for (const [key, src] of Object.entries(this.images)) {
                this.images[key] = new Image();
                this.images[key].src = src;
            }
        },

        playShipBullet() {
            const audio = new Audio(shipBullet);
            audio.volume = 0.05;
            audio.play().catch();
        },

        async handleAutopilot() {
            if (this.selectedAutopilot.duration === 9999) product = 'autopilot_until2026';
            let chat = this.user?.chat;
            if (!chat && typeof this.getTelegramUser === 'function') {
                const tgUser = this.getTelegramUser();
                chat = tgUser?.id;
            }
            console.log('user:', this.user);
            console.log('chat:', chat);
            console.log('getTelegramUser:', typeof this.getTelegramUser === 'function' ? this.getTelegramUser() : null);
            let userAddress = this.walletAddress || this.user?.wallet_address;
            if (!chat) {
                this.autopilotStatus = 'User is not authorized (no chat id)';
                this.toast.error('User is not authorized (no chat id)', { timeout: 4000 });
                return;
            }
        },

        selectPlan(plan) {
            this.selectedPlan = plan;
            this.showAutopilotModal = true;
        },

        async activateAutopilot() {
            if (!this.selectedPlan || this.processingPayment) return;

            // Проверяем что кошелек подключен
            if (!this.tonKeeperEnabled || !this.walletAddress) {
                this.toast.error('Please connect your TON wallet first!', { timeout: 5000 });
                return;
            }

            this.processingPayment = true;
            this.autopilotStatus = 'Processing payment...';

            try {
                console.log('[AUTOPILOT] Starting autopilot activation:', {
                    plan: this.selectedPlan,
                    walletAddress: this.walletAddress,
                    user: this.user
                });

                // 1. Проверяем и сохраняем адрес кошелька (согласно архитектуре)
                if (!this.user?.wallet_address) {
                    console.log('[AUTOPILOT] Saving wallet address...');
                    await this.saveWalletAddress();
                }

                // 2. Инициируем платеж через TonConnect
                console.log('[AUTOPILOT] Initiating payment...');
                const paymentResult = await this.initiatePayment();
                
                if (paymentResult.success) {
                    console.log('[AUTOPILOT] Payment initiated, verifying...');
                    
                    // 3. Отправляем данные на backend для верификации
                    const verificationResult = await this.verifyPayment(paymentResult);
                    
                    if (verificationResult.success) {
                        console.log('[AUTOPILOT] Payment verified, activating autopilot...');
                        
                        // 4. Активируем автопилот после успешной верификации
                        this.activateAutopilotPlan();
                        this.autopilotStatus = `Plan activated: ${this.selectedPlan.name}`;
                        this.toast.success(`Autopilot activated! x${this.selectedPlan.bonus} efficiency bonus!`, { timeout: 5000 });
                        this.showAutopilotModal = false;
                        this.selectedPlan = null;
                        
                        console.log('[AUTOPILOT] Autopilot activated successfully!');
                    } else {
                        throw new Error(verificationResult.error || 'Payment verification failed');
                    }
                } else {
                    throw new Error(paymentResult.error || 'Payment failed');
                }

            } catch (error) {
                console.error('[AUTOPILOT] Error activating autopilot:', error);
                this.autopilotStatus = `Error: ${error.message}`;
                this.toast.error(`Failed to activate autopilot: ${error.message}`, { timeout: 5000 });
            } finally {
                this.processingPayment = false;
            }
        },

        // Сохранение адреса кошелька (согласно архитектуре)
        async saveWalletAddress() {
            try {
                console.log('[AUTOPILOT] === saveWalletAddress START ===');
                console.log('[AUTOPILOT] this.user:', this.user);
                console.log('[AUTOPILOT] this.user type:', typeof this.user);
                console.log('[AUTOPILOT] this.user.chat:', this.user?.chat);
                console.log('[AUTOPILOT] this.user.user:', this.user?.user);
                console.log('[AUTOPILOT] this.user.id:', this.user?.id);
                console.log('[AUTOPILOT] this.walletAddress:', this.walletAddress);
                console.log('[AUTOPILOT] Store state:', this.$store?.state);
                console.log('[AUTOPILOT] Store user:', this.$store?.state?.user);
                
                // Проверяем что у нас есть адрес кошелька
                if (!this.walletAddress) {
                    throw new Error('Wallet address not available. Please connect your TON wallet first.');
                }

                // Проверяем что у нас есть Telegram ID пользователя
                const telegramId = this.user?.chat || this.user?.user || this.user?.id; // Согласно архитектуре - поле chat
                console.log('[AUTOPILOT] Extracted telegramId:', telegramId);
                console.log('[AUTOPILOT] telegramId type:', typeof telegramId);
                
                if (!telegramId) {
                    console.log('[AUTOPILOT] No telegramId found, trying to get from Telegram...');
                    
                    // Попробуем получить из Telegram
                    if (typeof this.getTelegramUser === 'function') {
                        const tgUser = this.getTelegramUser();
                        console.log('[AUTOPILOT] Telegram user:', tgUser);
                        if (tgUser?.id) {
                            console.log('[AUTOPILOT] Using Telegram ID:', tgUser.id);
                            // Обновляем пользователя
                            this.user = {
                                ...this.user,
                                chat: tgUser.id,
                                user: tgUser.id,
                                id: tgUser.id
                            };
                            console.log('[AUTOPILOT] Updated user object:', this.user);
                        }
                    }
                    
                    // Проверяем еще раз
                    const finalTelegramId = this.user?.chat || this.user?.user || this.user?.id;
                    if (!finalTelegramId) {
                        throw new Error('Telegram ID not found. Please authorize through Telegram WebApp.');
                    }
                    console.log('[AUTOPILOT] Final telegramId:', finalTelegramId);
                }

                // Дополнительная проверка принадлежности кошелька
                console.log('[AUTOPILOT] Verifying wallet ownership before saving...');
                const ownershipCheck = await this.$post('/api/check-wallet-owner', {
                    walletAddress: this.walletAddress,
                    telegramId: telegramId
                });
                
                console.log('[AUTOPILOT] Ownership check result:', ownershipCheck);
                
                if (!ownershipCheck.success) {
                    throw new Error('Failed to verify wallet ownership');
                }
                
                if (!ownershipCheck.isOwner) {
                    throw new Error(`This wallet is already connected to another Telegram account (${ownershipCheck.currentOwner?.name || 'Unknown user'}). Please use a different wallet or contact support.`);
                }

                console.log('[AUTOPILOT] User object:', this.user);
                console.log('[AUTOPILOT] Store user:', this.$store?.state?.user);
                console.log('[AUTOPILOT] Telegram ID found:', telegramId);
                console.log('[AUTOPILOT] Wallet address:', this.walletAddress);
                console.log('[AUTOPILOT] Saving wallet address:', {
                    telegramId,
                    walletAddress: this.walletAddress,
                    userChat: this.user?.chat,
                    userUser: this.user?.user,
                    userId: this.user?.id
                });

                const requestData = {
                    telegramId: telegramId,
                    walletAddress: this.walletAddress
                };
                
                console.log('[AUTOPILOT] Request data to API:', requestData);

                const response = await this.$post('/api/save-wallet-address', requestData);

                console.log('[AUTOPILOT] API Response:', response);

                if (response.success) {
                    // Обновляем пользователя в store
                    if (this.$store && this.$store.state.user) {
                        this.$store.state.user.wallet_address = this.walletAddress;
                    }
                    this.user.wallet_address = this.walletAddress;
                    console.log('[AUTOPILOT] Wallet address saved successfully:', this.walletAddress);
                    
                    // Показываем успешное уведомление
                    if (this.toast) {
                        this.toast.success('Wallet address saved successfully!', { timeout: 3000 });
                    }
                } else {
                    throw new Error(response.error || 'Failed to save wallet address');
                }
            } catch (error) {
                console.error('[AUTOPILOT] Error saving wallet address:', error);
                
                // Показываем ошибку пользователю
                if (this.toast) {
                    this.toast.error('Failed to save wallet address: ' + error.message, { timeout: 5000 });
                }
                
                throw error;
            } finally {
                console.log('[AUTOPILOT] === saveWalletAddress END ===');
            }
        },

        // Инициация платежа через TonConnect
        async initiatePayment() {
            try {
                if (!this.tonConnectUI) {
                    throw new Error('TON Connect not available');
                }

                // Получаем адрес получателя из переменных окружения
                const recipientAddress = process.env.VUE_APP_HOT_WALLET_ADDRESS;
                if (!recipientAddress) {
                    throw new Error('HOT wallet address not configured');
                }
                
                console.log('[AUTOPILOT] Initiating payment:', {
                    recipientAddress,
                    amount: this.selectedPlan.price,
                    plan: this.selectedPlan.name
                });
                
                // Отправляем TON
                const transaction = await this.tonConnectUI.sendTransaction({
                    validUntil: Math.floor(Date.now() / 1000) + 600, // 10 минут
                    messages: [
                        {
                            address: recipientAddress,
                            amount: (this.selectedPlan.price * 1000000000).toString(), // TON в наноТОН
                            comment: `Autopilot: ${this.selectedPlan.name}`
                        }
                    ]
                });

                // Получаем txid (согласно архитектуре)
                const txid = transaction?.transaction?.id || transaction?.txid || transaction?.hash;
                
                if (!txid || txid.length !== 64) {
                    throw new Error('Invalid transaction ID received');
                }

                console.log('[AUTOPILOT] Payment initiated, txid:', txid);
                
                return {
                    success: true,
                    txid: txid,
                    amount: this.selectedPlan.price,
                    userAddress: this.walletAddress
                };

            } catch (error) {
                console.error('[AUTOPILOT] Payment initiation error:', error);
                return {
                    success: false,
                    error: error.message
                };
            }
        },

        // Верификация платежа через backend (согласно архитектуре)
        async verifyPayment(paymentData) {
            try {
                console.log('[AUTOPILOT] Verifying payment:', paymentData);
                
                const requestData = {
                    txHash: paymentData.txid,
                    userAddress: paymentData.userAddress,
                    amount: paymentData.amount,
                    product: `autopilot_${this.selectedPlan.id}`,
                    centaAmount: this.calculateCentaAmount(),
                    telegramId: this.user?.chat || this.user?.user || this.user?.id // Согласно архитектуре - поле chat
                };
                
                console.log('[AUTOPILOT] Verification request data:', requestData);
                
                const response = await this.$post('/api/verify-ton-payment', requestData);

                console.log('[AUTOPILOT] Verification response:', response);

                if (response.success) {
                    console.log('[AUTOPILOT] Payment verified successfully');
                    return { success: true };
                } else {
                    console.error('[AUTOPILOT] Payment verification failed:', response.error);
                    return { success: false, error: response.error || 'Verification failed' };
                }

            } catch (error) {
                console.error('[AUTOPILOT] Payment verification error:', error);
                return { success: false, error: error.message };
            }
        },

        // Расчет количества CENTA для автопилота
        calculateCentaAmount() {
            const baseAmount = process.env.VUE_APP_AUTOPILOT_BASE_CENTA || 100; // Базовое количество CENTA из env
            const planMultiplier = this.selectedPlan.bonus;
            const totalAmount = baseAmount * planMultiplier;
            
            console.log('[AUTOPILOT] CENTA calculation:', {
                baseAmount,
                planMultiplier,
                totalAmount,
                plan: this.selectedPlan.name
            });
            
            return totalAmount;
        },

        // Активация плана автопилота
        activateAutopilotPlan() {
            // Сохраняем активный план
            this.activePlan = this.selectedPlan;
            
            // Запускаем автопилот
            this.autopilotActive = true;
            this.startAutopilotLogic();
            
            console.log('[AUTOPILOT] Plan activated:', this.selectedPlan);
        },

        // Подключение TON кошелька (как в top.vue)
        async connectWallet() {
            console.log('[AUTOPILOT] Starting wallet connection...');
            console.log('[AUTOPILOT] TON Connect UI available:', !!this.tonConnectUI);
            console.log('[AUTOPILOT] Current user:', this.user);
            console.log('[AUTOPILOT] Environment check:', {
                hotWallet: process.env.VUE_APP_HOT_WALLET_ADDRESS,
                centaJetton: process.env.VUE_APP_CENTA_JETTON_ADDRESS
            });
            
            if (!this.tonConnectUI) {
                this.toast.error('TON Connect not available. Please refresh the page or try again later.', { timeout: 5000 });
                return;
            }
            
            try {
                console.log('[AUTOPILOT] Calling tonConnectUI.connectWallet()...');
                await this.tonConnectUI.connectWallet();
                console.log('[AUTOPILOT] Wallet connected successfully!');
                console.log('[AUTOPILOT] Current wallet address:', this.walletAddress);
                console.log('[AUTOPILOT] TON Connect status:', {
                    isConnected: this.isConnected,
                    walletAddress: this.walletAddress,
                    tonKeeperEnabled: this.tonKeeperEnabled,
                    tonKeeperInitialized: this.tonKeeperInitialized
                });
                
                // Проверяем, не используется ли этот адрес другим пользователем
                if (this.walletAddress) {
                    await this.checkWalletOwnership();
                }
                
                this.toast.success('Wallet connected successfully!', { timeout: 3000 });
                
            } catch (error) {
                console.error('[AUTOPILOT] Wallet connection error:', error);
                this.toast.error('Failed to connect wallet: ' + error.message, { timeout: 5000 });
            }
        },

        // Проверка принадлежности кошелька текущему пользователю
        async checkWalletOwnership() {
            try {
                console.log('[AUTOPILOT] Checking wallet ownership...');
                console.log('[AUTOPILOT] Current wallet address:', this.walletAddress);
                console.log('[AUTOPILOT] Current user:', this.user);
                
                if (!this.walletAddress || !this.user?.chat) {
                    console.log('[AUTOPILOT] Missing wallet address or user ID');
                    return;
                }
                
                // Проверяем в базе данных, кому принадлежит этот адрес
                const response = await this.$post('/api/check-wallet-owner', {
                    walletAddress: this.walletAddress,
                    telegramId: this.user.chat
                });
                
                console.log('[AUTOPILOT] Wallet ownership check response:', response);
                
                if (response.success) {
                    if (response.isOwner) {
                        console.log('[AUTOPILOT] Wallet belongs to current user');
                        this.toast.success('Wallet verified as yours!', { timeout: 3000 });
                    } else {
                        console.log('[AUTOPILOT] Wallet belongs to another user');
                        this.toast.warning('This wallet is already connected to another Telegram account. Please use a different wallet or contact support.', { timeout: 8000 });
                        
                        // Сбрасываем подключение
                        this.walletAddress = null;
                        this.isConnected = false;
                        this.tonKeeperEnabled = false;
                        this.tonKeeperInitialized = false;
                        
                        return;
                    }
                } else {
                    console.log('[AUTOPILOT] Wallet ownership check failed:', response.error);
                    // Если проверка не удалась, все равно позволяем продолжить
                    this.toast.info('Wallet connected, but ownership verification failed. Proceed with caution.', { timeout: 5000 });
                }
                
            } catch (error) {
                console.error('[AUTOPILOT] Error checking wallet ownership:', error);
                // При ошибке проверки все равно позволяем продолжить
                this.toast.info('Wallet connected, but ownership verification failed. Proceed with caution.', { timeout: 5000 });
            }
        },

        // Fallback метод для ручного ввода адреса кошелька
        manualWalletInput() {
            const address = prompt('Please enter your TON wallet address:');
            if (address && address.length > 10) {
                this.walletAddress = address;
                this.tonKeeperEnabled = true;
                this.tonKeeperInitialized = true;
                this.toast.success('Wallet address set manually!', { timeout: 3000 });
                console.log('[AUTOPILOT] Manual wallet address set:', address);
            }
        },
    },
};

class Meteor {
    constructor(x, y, type, canvasWidth, health, token, mass = 1) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.width = 30;
        this.height = 30;
        this.canvasWidth = canvasWidth;
        this.health = health;
        this.token = token;
        this.mass = mass; // Масса металла в кг
        this.value = this.calculateValue(); // Стоимость в nCENTA
    }

    // Расчет стоимости металла согласно JSON конфигу
    calculateValue() {
        const prices = {
            gold: 108190000000,    // 108,190 nCENTA per kg
            silver: 1253000000,    // 1,253 nCENTA per kg
            copper: 9812000,       // 9.812 nCENTA per kg
            iron: 438000          // 0.438 nCENTA per kg
        };

        const basePrice = prices[this.type] || prices.iron;
        return Math.round(this.mass * basePrice);
    }

    update(speed) {
        this.y += speed;
    }

    draw(ctx, resourceImage) {
        if (resourceImage) {
            ctx.drawImage(resourceImage, this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
        }
    }

    takeDamage(amount) {
        this.health -= amount;
    }
}

class Enemy {
    constructor(x, y, health, enemyType, canvasWidth) {
        this.x = x;
        this.y = y;
        this.width = 30;
        this.height = 30;
        this.health = health;
        this.enemyType = enemyType;
        this.canvasWidth = canvasWidth;
        this.targetX = Math.random() * canvasWidth; // Целевая координата X
        this.speed = 1; // Скорость движения
        this.shootInterval = Math.floor(Math.random() * 2000) + 1000; // Интервал стрельбы (1-3 секунды)
        this.lastShotTime = 0;
    }

    update() {
        // Движение к целевой координате X
        if (Math.abs(this.x - this.targetX) > 1) {
            this.x += (this.targetX - this.x) * 0.01 * this.speed;
        } else {
            this.targetX = Math.random() * this.canvasWidth; // Новая целевая координата
        }

        // Ограничение по Y
        this.y = Math.min(this.y + 1, 100); // Враг не уходит ниже 100 по Y
        this.y = Math.max(this.y, 0); // Враг не уходит выше 0 по Y
    }

    draw(ctx, enemy) {
        if (enemy) {
            ctx.drawImage(enemy, this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
        }
    }

    takeDamage(amount) {
        this.health -= amount;
    }

    shoot(shipX, shipY) {
        const now = Date.now();
        if (now - this.lastShotTime > this.shootInterval) {
            this.lastShotTime = now;
            const dx = shipX - this.x;
            const dy = shipY - this.y;
            const angle = Math.atan2(dy, dx);
            return {
                x: this.x,
                y: this.y + this.height / 2,
                width: 10,
                height: 20,
                dx: Math.cos(angle) * 3, // Скорость по X
                dy: Math.sin(angle) * 3, // Скорость по Y
            };
        }
        return null; // Если не стреляет
    }
}
</script>

<style scoped>
#app {
    width: 100%;
    height: 100vh;
    overflow: hidden;
    background: #000000;
    position: absolute;
    top: 0;
    z-index: 999999999;
}

canvas {
    display: block;
}

.back {
    position: absolute;
    top: 20px;
    right: 15px;
    z-index: 100;
}

.back-btn {
    padding: 10px 20px;
    font-size: 16px;
    background-color: #2196F3; /* Blue */
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    text-decoration: none;
    display: inline-block;
}

.back-btn:hover {
    background-color: #1976D2; /* Darker Blue */
}

#resources {
    position: absolute;
    top: 10px;
    left: 10px;
    font-size: 20px;
    color: white;
    font-family: sans-serif;
    text-shadow: 1px 1px 2px black;
    z-index: 100;
}

#ship-health {
    position: absolute;
    top: 10px;
    left: 10px;
    font-size: 20px;
    color: white;
    font-family: sans-serif;
    text-shadow: 1px 1px 2px black;
    z-index: 100;
}
.resource {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
    font-size: 14px;
    background: rgba(0, 0, 0, 0.7);
    padding: 8px;
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.resource-info {
    margin-left: 8px;
    flex: 1;
}

.resource-amount {
    font-weight: bold;
    color: white;
    margin-bottom: 2px;
}

.resource-value {
    font-size: 12px;
    color: #4CAF50;
    font-family: monospace;
}

.resource.health {
    background: rgba(244, 67, 54, 0.2);
    border-color: rgba(244, 67, 54, 0.5);
}

.health-icon {
    font-size: 16px;
    margin-right: 8px;
}

.health-info {
    flex: 1;
}

.health-percent {
    font-weight: bold;
    color: white;
    margin-bottom: 4px;
}

.health-bar {
    width: 100%;
    height: 6px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 3px;
    overflow: hidden;
}

.health-fill {
    height: 100%;
    background: linear-gradient(90deg, #f44336, #ff9800, #4caf50);
    transition: width 0.3s ease;
}

.pity-info, .daily-info {
    background: rgba(0, 0, 0, 0.8);
    padding: 10px;
    border-radius: 8px;
    border: 1px solid rgba(255, 193, 7, 0.3);
    margin-top: 10px;
}

.pity-title, .daily-title {
    font-weight: bold;
    color: #ffc107;
    margin-bottom: 6px;
    font-size: 12px;
}

.pity-progress, .daily-progress {
    display: flex;
    align-items: center;
    gap: 8px;
}

.pity-bar, .daily-bar {
    flex: 1;
    height: 4px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 2px;
    overflow: hidden;
}

.pity-fill {
    height: 100%;
    background: linear-gradient(90deg, #ffc107, #ff9800);
    transition: width 0.3s ease;
}

.daily-fill {
    height: 100%;
    background: linear-gradient(90deg, #4caf50, #8bc34a);
    transition: width 0.3s ease;
}

.pity-text, .daily-text {
    font-size: 11px;
    color: #ccc;
    white-space: nowrap;
}

.meteor {
    width: 15px;
    height: 15px;
    border-radius: 50%;
    margin-right: 6px;
}

.meteor.gold {
    background-color: gold;
}

.meteor.silver {
    background-color: silver;
}

.meteor.iron {
    background-color: #A19D94;
}

.meteor.copper {
    background-color: orange;
}

#game-over-screen {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: rgba(0, 0, 0, 0.8);
    padding: 20px;
    border-radius: 10px;
    color: white;
    text-align: center;
    z-index: 101;
}

#game-over-screen button {
    padding: 10px 20px;
    background-color: #4caf50;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

/* Styles for Autopilot Controls */
.autopilot-controls {
    position: absolute;
    top: 80px; /* Под кнопкой Back */
    right: 15px; /* Справа как Back */
    z-index: 100;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 10px;
}

.autopilot-btn {
    padding: 10px 20px;
    font-size: 16px;
    background-color: #4CAF50; /* Green */
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.autopilot-btn:hover:not(:disabled) {
    background-color: #45a049; /* Darker Green */
}

.autopilot-btn:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
    color: #888888;
}

.autopilot-btn.active {
    background-color: #f44336; /* Red */
}

.autopilot-btn.active:hover:not(:disabled) {
    background-color: #da190b; /* Darker Red */
}

.autopilot-status {
    padding: 10px;
    background-color: #333333;
    color: white;
    border-radius: 8px;
    font-size: 14px;
    border: 1px solid #555555;
    white-space: nowrap;
}

.plan-info {
    margin-top: 5px;
    font-size: 12px;
    color: #4CAF50;
    font-weight: bold;
    border-top: 1px solid #555;
    padding-top: 5px;
}

/* Styles for Autopilot Modal */
.autopilot-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-content {
    background-color: #2c2c2c;
    padding: 30px;
    border-radius: 15px;
    width: 90%;
    max-width: 800px;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    position: relative;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 15px;
    border-bottom: 1px solid #444;
}

.modal-header h2 {
    margin: 0;
    color: #fff;
    font-size: 28px;
}

.close-btn {
    background-color: #f44336;
    color: white;
    border: none;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    font-size: 24px;
    font-weight: bold;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: background-color 0.3s ease;
}

.close-btn:hover {
    background-color: #d32f2f;
}

.modal-body {
    color: #fff;
    font-size: 18px;
    line-height: 1.6;
    margin-bottom: 25px;
    padding-bottom: 20px;
    border-bottom: 1px solid #444;
}

.modal-description {
    color: #ccc;
    margin-bottom: 20px;
}

.autopilot-layout {
    display: flex;
    gap: 20px;
}

/* Адаптивность для мобильных устройств */
@media (max-width: 768px) {
    .autopilot-layout {
        flex-direction: column;
        gap: 15px;
    }
    
    .plans-grid {
        grid-template-columns: 1fr;
        gap: 10px;
    }
    
    .modal-content {
        padding: 20px;
        width: 95%;
    }
    
    .plans-title, .payment-title {
        font-size: 18px;
    }
}

.plans-column, .payment-column {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.plans-title, .payment-title {
    color: #fff;
    font-size: 20px;
    margin-bottom: 10px;
}

.plans-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 15px;
}

.plan-card-compact {
    background-color: #3a3a3a;
    border: 1px solid #555;
    border-radius: 10px;
    padding: 15px;
    cursor: pointer;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    text-align: center;
    color: #fff;
}

.plan-card-compact:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.plan-card-compact.selected {
    border: 2px solid #4CAF50;
    box-shadow: 0 5px 15px rgba(76, 175, 80, 0.3);
}

.plan-header-compact {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
}

.plan-header-compact h4 {
    margin: 0 0 3px 0;
    font-size: 18px;
    color: #fff;
}

.plan-price-compact {
    font-size: 20px;
    font-weight: bold;
    color: #4CAF50;
}

.plan-bonus-compact {
    font-size: 14px;
    color: #ff9800;
    margin-bottom: 8px;
}

.plan-duration-compact {
    font-size: 13px;
    color: #888;
    margin-bottom: 10px;
}

.plan-popular-compact {
    background-color: #4CAF50;
    color: white;
    padding: 6px 10px;
    border-radius: 15px;
    font-size: 13px;
    font-weight: bold;
    display: inline-block;
}

.no-plan-selected {
    text-align: center;
    padding: 20px;
    background-color: #333;
    border-radius: 10px;
    color: #ccc;
    font-size: 16px;
}

.plan-selected {
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid #444;
}

.selected-plan-card {
    background-color: #333;
    border: 1px solid #555;
    border-radius: 10px;
    padding: 15px;
    color: #fff;
    margin-bottom: 15px;
}

.selected-plan-card h4 {
    margin: 0 0 5px 0;
    font-size: 18px;
    color: #fff;
}

.plan-details {
    font-size: 14px;
    color: #ccc;
    margin-bottom: 10px;
}

.price, .bonus, .duration {
    display: block;
    margin-bottom: 3px;
}

.price {
    font-weight: bold;
    color: #4CAF50;
}

.bonus {
    color: #ff9800;
    font-weight: bold;
}

.duration {
    color: #888;
}

.wallet-section {
    text-align: center;
    padding: 20px;
    background-color: #333;
    border-radius: 10px;
    margin-bottom: 20px;
}

.wallet-info {
    color: #ccc;
    margin-bottom: 15px;
    font-size: 16px;
}

.wallet-warning {
    background-color: #f44336; /* Red */
    color: white;
    padding: 10px 15px;
    border-radius: 8px;
    margin-bottom: 15px;
    font-size: 14px;
    line-height: 1.4;
}

.warning-text {
    font-weight: bold;
    margin-bottom: 5px;
}

.warning-details {
    font-size: 12px;
    color: #ffeb3b; /* Yellow */
}

.connect-wallet-btn-compact {
    background-color: #1f2937;
    color: #ffffff;
    font-weight: bold;
    padding: 12px 24px;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 16px;
}

.connect-wallet-btn-compact:hover {
    background-color: #374151;
    transform: translateY(-2px);
}

.manual-wallet-btn-compact {
    background-color: #6c757d;
    color: #ffffff;
    font-weight: bold;
    padding: 12px 24px;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 16px;
    margin-top: 10px;
}

.manual-wallet-btn-compact:hover {
    background-color: #5a6268;
    transform: translateY(-2px);
}

.activation-section {
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid #444;
}

.wallet-status-compact {
    color: #4CAF50;
    font-weight: bold;
    margin-bottom: 10px;
}

.address {
    color: #888;
    font-family: monospace;
    font-size: 14px;
}

.activate-btn-compact {
    width: 100%;
    padding: 15px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 10px;
    font-size: 18px;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.3s ease;
    display: flex;
    justify-content: center;
    align-items: center;
}

.activate-btn-compact:hover:not(:disabled) {
    background-color: #45a049;
}

.activate-btn-compact:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
    color: #888888;
}

.jackpot-info {
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid #444;
    color: #ccc;
    font-size: 16px;
}

.jackpot-info h4 {
    margin-top: 0;
    margin-bottom: 10px;
    color: #fff;
}

.jackpot-info ul {
    list-style: none;
    padding: 0;
    margin-bottom: 15px;
}

.jackpot-info li {
    margin-bottom: 5px;
    color: #ff9800;
    font-weight: bold;
}

.jackpot-info p {
    font-size: 14px;
    color: #888;
}
</style>
