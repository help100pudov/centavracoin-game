<template>
    <div class="">
        <div class="flexCenter mt-8">
            <div class="centa-display-container" style="top: 15%">
                <div class="centa-main-display">
                    <i class="icon i-centa x34"></i>
                    <div class="centa-amount">{{ formatCenta(user?.centa || 0) }}</div>
                </div>
                
                <!-- Показ металлов -->
                <div class="metals-display" v-if="showMetals">
                    <div class="metals-title">Mining Resources:</div>
                    <div class="metals-grid">
                        <div class="metal-item gold" @click="showMetalInfo('Gold')">
                            <span class="metal-icon">🟡</span>
                            <span class="metal-name">Gold:</span>
                            <span class="metal-amount">{{ user?.gold || 0 }}</span>
                            <div class="metal-info-hint">Нажмите для информации</div>
                        </div>
                        <div class="metal-item silver" @click="showMetalInfo('Silver')">
                            <span class="metal-icon">⚪</span>
                            <span class="metal-name">Silver:</span>
                            <span class="metal-amount">{{ user?.silver || 0 }}</span>
                            <div class="metal-info-hint">Нажмите для информации</div>
                        </div>
                        <div class="metal-item iron" @click="showMetalInfo('Iron')">
                            <span class="metal-icon">🔘</span>
                            <span class="metal-name">Iron:</span>
                            <span class="metal-amount">{{ user?.iron || 0 }}</span>
                            <div class="metal-info-hint">Нажмите для информации</div>
                        </div>
                        <div class="metal-item copper" @click="showMetalInfo('Copper')">
                            <span class="metal-icon">🟠</span>
                            <span class="metal-name">Copper:</span>
                            <span class="metal-amount">{{ user?.copper || 0 }}</span>
                            <div class="metal-info-hint">Нажмите для информации</div>
                        </div>
                    </div>
                </div>
                
                <div class="buttons-container mt-2">
                    <div class="btn-info fon">
                        <div class="btn-info main">
                            <div class="flexCenter g-1">
                                <div class="centa-number">20 992 004</div>
                                <div class="centa-icon"><i class="icon i-centa x16" style="vertical-align: text-top"></i></div>
                            </div>
                            <div class="line 1px w-80 mt-1 mb-1 m-auto"></div>
                            <div class="fs-12px text-light everything-text">{{ $t("Everything can be found") }}</div>
                        </div>
                    </div>
                    <div class="action-buttons">
                        <button @click="showProjectInfo = true" class="btn search-btn project-btn">
                            <i class="bi bi-info-circle"></i> {{ $t("Project Info") }}
                        </button>
                        <button @click="calculateCentaFromMetals" class="btn search-btn calculate-btn">
                            <i class="bi bi-calculator"></i> {{ $t("Calculate") }}
                        </button>
                    </div>
                </div>
                
                <!-- Результат расчета -->
                <div class="calculation-result" v-if="calculatedCenta !== null">
                    <div class="result-title">Calculated CENTA:</div>
                    <div class="result-amount">{{ formatPreciseCenta(calculatedCenta) }}</div>
                    <div class="result-formula">
                        Formula: {{ calculationFormula }}
                    </div>
                    
                    <!-- Metal Breakdown -->
                    <div class="metal-breakdown">
                        <h4>📊 Metal Breakdown</h4>
                        <div class="metal-grid">
                            <div v-for="(amount, metal) in user.metals" :key="metal" 
                                 v-if="amount > 0" class="metal-item">
                                <div class="metal-icon">
                                    <img :src="getMetalIcon(metal)" :alt="metal" class="metal-img">
                                </div>
                                <div class="metal-info">
                                    <div class="metal-name">{{ formatMetalName(metal) }}</div>
                                    <div class="metal-amount">{{ amount.toFixed(2) }} kg</div>
                                    <div class="metal-value">{{ formatMetalValue(metal, amount) }}</div>
                                </div>
                                <div class="metal-contribution">
                                    <div class="contribution-label">Contribution</div>
                                    <div class="contribution-value">{{ getMetalContribution(metal, amount).toFixed(2) }} CENTA</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Project Information Modal -->
                <div class="project-info-modal" v-if="showProjectInfo">
                    <div class="modal-overlay" @click="showProjectInfo = false"></div>
                    <div class="modal-content">
                        <div class="modal-header">
                            <h2>🚀 CentavraCoin - The Future of Mining</h2>
                            <div class="language-switcher">
                                <button @click="currentLanguage = 'en'" :class="{ active: currentLanguage === 'en' }">EN</button>
                                <button @click="currentLanguage = 'ru'" :class="{ active: currentLanguage === 'ru' }">RU</button>
                            </div>
                            <button @click="showProjectInfo = false" class="close-btn">×</button>
                        </div>
                        
                        <div class="modal-body">
                            <!-- Why Better Than Bitcoin -->
                            <div class="info-section">
                                <h3 v-if="currentLanguage === 'en'">⚡ Why CENTA is Better Than Bitcoin</h3>
                                <h3 v-else>⚡ Почему CENTA лучше Биткоина</h3>
                                
                                <div class="comparison-grid">
                                    <div class="comparison-item">
                                        <div class="comparison-title">Bitcoin</div>
                                        <div class="comparison-desc" v-if="currentLanguage === 'en'">Just random hashing</div>
                                        <div class="comparison-desc" v-else>Просто случайное хеширование</div>
                                    </div>
                                    <div class="comparison-item better">
                                        <div class="comparison-title">CENTA</div>
                                        <div class="comparison-desc" v-if="currentLanguage === 'en'">Useful AI computations</div>
                                        <div class="comparison-desc" v-else>Полезные AI вычисления</div>
                                    </div>
                                </div>
                                
                                <ul class="benefits-list">
                                    <li v-if="currentLanguage === 'en'">
                                        🎯 <strong>Proof of Useful Work (PoUW)</strong> - Real AI inference instead of random hashing
                                    </li>
                                    <li v-else>
                                        🎯 <strong>Proof of Useful Work (PoUW)</strong> - Реальные AI вычисления вместо случайного хеширования
                                    </li>
                                    
                                    <li v-if="currentLanguage === 'en'">
                                        💰 <strong>Game Economy</strong> - Mining tied to real metal prices and gaming
                                    </li>
                                    <li v-else>
                                        💰 <strong>Игровая экономика</strong> - Майнинг привязан к реальным ценам металлов и играм
                                    </li>
                                    
                                    <li v-if="currentLanguage === 'en'">
                                        ⚖️ <strong>Fair Distribution</strong> - Device fairness and anti-cheat protection
                                    </li>
                                    <li v-else>
                                        ⚖️ <strong>Справедливое распределение</strong> - Честность устройств и защита от читеров
                                    </li>
                                    
                                    <li v-if="currentLanguage === 'en'">
                                        🔗 <strong>Simple Pricing</strong> - 1 CENTA = 1 USDT, micro-prices in nCENTA
                                    </li>
                                    <li v-else>
                                        🔗 <strong>Простое ценообразование</strong> - 1 CENTA = 1 USDT, микроцены в nCENTA
                                    </li>
                                </ul>
                            </div>
                            
                            <!-- Tokenomics -->
                            <div class="info-section">
                                <h3 v-if="currentLanguage === 'en'">💎 CENTA Tokenomics</h3>
                                <h3 v-else>💎 Токеномика CENTA</h3>
                                
                                <div class="tokenomics-grid">
                                    <div class="tokenomics-item">
                                        <div class="tokenomics-value">21,000,000</div>
                                        <div class="tokenomics-label" v-if="currentLanguage === 'en'">Total Supply</div>
                                        <div class="tokenomics-label" v-else>Общее предложение</div>
                                    </div>
                                    <div class="tokenomics-item">
                                        <div class="tokenomics-value">9</div>
                                        <div class="tokenomics-label" v-if="currentLanguage === 'en'">Decimal Places</div>
                                        <div class="tokenomics-label" v-else>Знаки после запятой</div>
                                    </div>
                                    <div class="tokenomics-item">
                                        <div class="tokenomics-value">1 USDT</div>
                                        <div class="tokenomics-label" v-if="currentLanguage === 'en'">Price Peg</div>
                                        <div class="tokenomics-label" v-else>Привязка цены</div>
                                    </div>
                                </div>
                                
                                <div class="emission-schedule">
                                    <h4 v-if="currentLanguage === 'en'">📈 Emission Schedule (Like Bitcoin)</h4>
                                    <h4 v-else>📈 График эмиссии (Как у Биткоина)</h4>
                                    
                                    <p v-if="currentLanguage === 'en'">
                                        Fast initial mining, long tail distribution over 30+ years. 
                                        First 15 years: ~70% mined, remaining 30% over next 100+ years.
                                    </p>
                                    <p v-else>
                                        Быстрый начальный майнинг, длинное распределение хвоста более 30+ лет. 
                                        Первые 15 лет: ~70% добыто, оставшиеся 30% в течение следующих 100+ лет.
                                    </p>
                                </div>
                            </div>
                            
                            <!-- Mining System -->
                            <div class="info-section">
                                <h3>⛏️ Advanced Mining System</h3>
                                <div class="mining-features">
                                    <div class="feature-item">
                                        <span class="feature-icon">🤖</span>
                                        <div class="feature-content">
                                            <div class="feature-title">AI-Powered Mining</div>
                                            <div class="feature-desc">ML inference microbatches, matrix multiplication validation</div>
                                        </div>
                                    </div>
                                    <div class="feature-item">
                                        <span class="feature-icon">🎮</span>
                                        <div class="feature-content">
                                            <div class="feature-title">Gaming Integration</div>
                                            <div class="feature-desc">Space mining game with real metal prices</div>
                                        </div>
                                    </div>
                                    <div class="feature-item">
                                        <span class="feature-icon">🔒</span>
                                        <div class="feature-content">
                                            <div class="feature-title">Anti-Cheat Protection</div>
                                            <div class="feature-desc">Biometric motion, hardware fingerprinting, multi-account detection</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Metal Economics -->
                            <div class="info-section">
                                <h3>🏆 Metal Mining Economics</h3>
                                <div class="metals-table">
                                    <div class="metals-header">
                                        <div class="metal-col">Metal</div>
                                        <div class="metal-col">Rarity</div>
                                        <div class="metal-col">Price (nCENTA/kg)</div>
                                        <div class="metal-col">Yield Range</div>
                                    </div>
                                    <div class="metal-row gold">
                                        <div class="metal-col">Gold (Au)</div>
                                        <div class="metal-col">Ultra Rare</div>
                                        <div class="metal-col">108,190,000,000</div>
                                        <div class="metal-col">0.01-5 kg</div>
                                    </div>
                                    <div class="metal-row silver">
                                        <div class="metal-col">Silver (Ag)</div>
                                        <div class="metal-col">Rare</div>
                                        <div class="metal-col">1,253,000,000</div>
                                        <div class="metal-col">0.05-20 kg</div>
                                    </div>
                                    <div class="metal-row copper">
                                        <div class="metal-col">Copper (Cu)</div>
                                        <div class="metal-col">Common</div>
                                        <div class="metal-col">9,812,000</div>
                                        <div class="metal-col">1-300 kg</div>
                                    </div>
                                    <div class="metal-row steel">
                                        <div class="metal-col">Steel (Fe*)</div>
                                        <div class="metal-col">Very Common</div>
                                        <div class="metal-col">438,000</div>
                                        <div class="metal-col">5-1000 kg</div>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Advanced Game Mechanics -->
                            <div class="info-section">
                                <h3 v-if="currentLanguage === 'en'">🎮 Advanced Game Mechanics</h3>
                                <h3 v-else>🎮 Продвинутая игровая механика</h3>
                                
                                <div class="mechanics-info">
                                    <div class="mechanics-item">
                                        <div class="mechanics-icon">🧠</div>
                                        <div class="mechanics-content">
                                            <div class="mechanics-title" v-if="currentLanguage === 'en'">AI-Powered Mining</div>
                                            <div class="mechanics-title" v-else>AI-майнинг</div>
                                            <div class="mechanics-desc" v-if="currentLanguage === 'en'">
                                                ML inference microbatches, matrix multiplication validation, 
                                                small ZK-SNARK proofs for real computational work
                                            </div>
                                            <div class="mechanics-desc" v-else>
                                                ML инференс микробатчами, валидация матричного умножения, 
                                                малые ZK-SNARK доказательства для реальной вычислительной работы
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div class="mechanics-item">
                                        <div class="mechanics-icon">⚖️</div>
                                        <div class="mechanics-content">
                                            <div class="mechanics-title" v-if="currentLanguage === 'en'">Device Fairness</div>
                                            <div class="mechanics-title" v-else>Честность устройств</div>
                                            <div class="mechanics-desc" v-if="currentLanguage === 'en'">
                                                Phone: 1.0x, PC CPU: 1.05x, GPU: 1.10x (capped). 
                                                Anti-cheat with biometric motion detection
                                            </div>
                                            <div class="mechanics-desc" v-else>
                                                Телефон: 1.0x, ПК CPU: 1.05x, GPU: 1.10x (ограничено). 
                                                Анти-чит с биометрическим детектором движения
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div class="mechanics-item">
                                        <div class="mechanics-icon">🎯</div>
                                        <div class="mechanics-content">
                                            <div class="mechanics-title" v-if="currentLanguage === 'en'">Dynamic Spawn System</div>
                                            <div class="mechanics-title" v-else>Динамическая система спавна</div>
                                            <div class="mechanics-desc" v-if="currentLanguage === 'en'">
                                                Inverse price power law: p_i = w_i / (price_usd_i ^ 0.9). 
                                                Pity system every 200 events, daily caps on rare metals
                                            </div>
                                            <div class="mechanics-desc" v-else>
                                                Обратный степенной закон цен: p_i = w_i / (price_usd_i ^ 0.9). 
                                                Система pity каждые 200 событий, дневные лимиты на редкие металлы
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Investment Thesis -->
                            <div class="info-section">
                                <h3 v-if="currentLanguage === 'en'">📊 Investment Thesis</h3>
                                <h3 v-else>📊 Инвестиционный тезис</h3>
                                
                                <div class="thesis-points">
                                    <div class="thesis-item">
                                        <div class="thesis-number">1</div>
                                        <div class="thesis-content">
                                            <div class="thesis-title" v-if="currentLanguage === 'en'">Sustainable Tokenomics</div>
                                            <div class="thesis-title" v-else>Устойчивая токеномика</div>
                                            <div class="thesis-desc" v-if="currentLanguage === 'en'">
                                                Like ether.fi - PoUW with real utility, not just speculation. 
                                                21M supply like Bitcoin, but with real economic value
                                            </div>
                                            <div class="thesis-desc" v-else>
                                                Как ether.fi - PoUW с реальной полезностью, а не спекуляцией. 
                                                21M предложение как у Биткоина, но с реальной экономической ценностью
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div class="thesis-item">
                                        <div class="thesis-number">2</div>
                                        <div class="thesis-content">
                                            <div class="thesis-title" v-if="currentLanguage === 'en'">Mass Adoption Ready</div>
                                            <div class="thesis-title" v-else>Готов к массовому внедрению</div>
                                            <div class="thesis-desc" v-if="currentLanguage === 'en'">
                                                Telegram WebApp, mobile-first, billions of potential users. 
                                                Built for 7+ billion people with scalable infrastructure
                                            </div>
                                            <div class="thesis-desc" v-else>
                                                Telegram WebApp, мобильный-первый, миллиарды потенциальных пользователей. 
                                                Построено для 7+ миллиардов людей с масштабируемой инфраструктурой
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div class="thesis-item">
                                        <div class="thesis-number">3</div>
                                        <div class="thesis-content">
                                            <div class="thesis-title" v-if="currentLanguage === 'en'">Real Market Integration</div>
                                            <div class="thesis-title" v-else>Реальная рыночная интеграция</div>
                                            <div class="thesis-desc" v-if="currentLanguage === 'en'">
                                                Metal prices from oracles, dynamic spawn rates based on player count. 
                                                Real computational work creates real economic value
                                            </div>
                                            <div class="thesis-desc" v-else>
                                                Цены металлов от оракулов, динамические ставки спавна на основе количества игроков. 
                                                Реальная вычислительная работа создает реальную экономическую ценность
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Future Vision -->
                        <div class="info-section">
                            <h3 v-if="currentLanguage === 'en'">🔮 Future Vision: 15 Years Ahead</h3>
                            <h3 v-else>🔮 Видение будущего: 15 лет вперед</h3>
                            
                            <div class="future-vision">
                                <div class="vision-item">
                                    <div class="vision-icon">🌍</div>
                                    <div class="vision-content">
                                        <div class="vision-title" v-if="currentLanguage === 'en'">Global Scale</div>
                                        <div class="vision-title" v-else>Глобальный масштаб</div>
                                        <div class="vision-desc" v-if="currentLanguage === 'en'">
                                            Designed for 7+ billion people. Current: 327 players, 
                                            Target: 1 billion+ active users by 2040. 
                                            Scalable infrastructure handles exponential growth
                                        </div>
                                        <div class="vision-desc" v-else>
                                            Спроектировано для 7+ миллиардов людей. Сейчас: 327 игроков, 
                                            Цель: 1 миллиард+ активных пользователей к 2040 году. 
                                            Масштабируемая инфраструктура справляется с экспоненциальным ростом
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="vision-item">
                                    <div class="vision-icon">📈</div>
                                    <div class="vision-content">
                                        <div class="vision-title" v-if="currentLanguage === 'en'">Economic Evolution</div>
                                        <div class="vision-title" v-else>Экономическая эволюция</div>
                                        <div class="vision-desc" v-if="currentLanguage === 'en'">
                                            Mining difficulty increases with player count. 
                                            Gold becomes ultra-rare, silver becomes rare. 
                                            Dynamic spawn rates maintain economic balance
                                        </div>
                                        <div class="vision-desc" v-else>
                                            Сложность майнинга растет с количеством игроков. 
                                            Золото становится ультра-редким, серебро - редким. 
                                            Динамические ставки спавна поддерживают экономический баланс
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="vision-item">
                                    <div class="vision-icon">🤖</div>
                                    <div class="vision-content">
                                        <div class="vision-title" v-if="currentLanguage === 'en'">AI Integration</div>
                                        <div class="vision-title" v-else>AI интеграция</div>
                                        <div class="vision-desc" v-if="currentLanguage === 'en'">
                                            Player devices contribute to global AI training. 
                                            Real computational work creates real value. 
                                            Proof of Useful Work replaces wasteful mining
                                        </div>
                                        <div class="vision-desc" v-else>
                                            Устройства игроков вносят вклад в глобальное AI обучение. 
                                            Реальная вычислительная работа создает реальную ценность. 
                                            Proof of Useful Work заменяет расточительный майнинг
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="modal-footer">
                            <button @click="showProjectInfo = false" class="btn-primary">
                                <span v-if="currentLanguage === 'en'">Got it!</span>
                                <span v-else>Понятно!</span>
                            </button>
                        </div>
                    </div>
                </div>
                
                <!-- Advanced Shop & Autopilot Store -->
                <div class="advanced-shop-section">
                    <h3 class="shop-title">🚀 {{ $t("Advanced Mining Store") }}</h3>
                    <p class="shop-description">{{ $t("Enhance your mining experience with cutting-edge technology and knowledge") }}</p>
                    
                    <!-- Autopilot Plans -->
                    <div class="shop-category">
                        <h4 class="category-title">🤖 {{ $t("Autopilot Plans") }}</h4>
                        <div class="autopilot-grid">
                            <div v-for="plan in autopilotPlans" :key="plan.id" class="plan-card">
                                <div class="plan-header">
                                    <h5>{{ plan.name }}</h5>
                                    <div class="plan-price">{{ plan.price }} TON</div>
                                </div>
                                <div class="plan-bonus">x{{ plan.bonus }} Efficiency</div>
                                <div class="plan-duration">{{ plan.duration }}</div>
                                <label class="plan-checkbox">
                                    <input 
                                        type="checkbox" 
                                        v-model="plan.selected"
                                        @change="updateCart"
                                    >
                                    <span class="checkmark"></span>
                                    {{ $t("Add to Cart") }}
                                </label>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Advanced Technologies -->
                    <div class="shop-category">
                        <h4 class="category-title">🔬 {{ $t("Advanced Technologies") }}</h4>
                        <div class="tech-grid">
                            <div v-for="tech in advancedTechnologies" :key="tech.id" class="tech-card">
                                <div class="tech-icon">{{ tech.icon }}</div>
                                <div class="tech-content">
                                    <h5 class="tech-name">{{ tech.name }}</h5>
                                    <p class="tech-description">{{ tech.description }}</p>
                                    <div class="tech-formula" v-if="tech.formula">{{ tech.formula }}</div>
                                    <div class="tech-benefits">
                                        <span v-for="benefit in tech.benefits" :key="benefit" class="benefit-tag">
                                            {{ benefit }}
                                        </span>
                                    </div>
                                </div>
                                <div class="tech-price">{{ tech.price }} TON</div>
                                <label class="tech-checkbox">
                                    <input 
                                        type="checkbox" 
                                        v-model="tech.selected"
                                        @change="updateCart"
                                    >
                                    <span class="checkmark"></span>
                                </label>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Knowledge Packages -->
                    <div class="shop-category">
                        <h4 class="category-title">📚 {{ $t("Knowledge Packages") }}</h4>
                        <div class="knowledge-grid">
                            <div v-for="knowledge in knowledgePackages" :key="knowledge.id" class="knowledge-card">
                                <div class="knowledge-icon">{{ knowledge.icon }}</div>
                                <div class="knowledge-content">
                                    <h5 class="knowledge-name">{{ knowledge.name }}</h5>
                                    <p class="knowledge-description">{{ knowledge.description }}</p>
                                    <div class="knowledge-topics">
                                        <span v-for="topic in knowledge.topics" :key="topic" class="topic-tag">
                                            {{ topic }}
                                        </span>
                                    </div>
                                </div>
                                <div class="knowledge-price">{{ knowledge.price }} TON</div>
                                <label class="knowledge-checkbox">
                                    <input 
                                        type="checkbox" 
                                        v-model="knowledge.selected"
                                        @change="updateCart"
                                    >
                                    <span class="checkmark"></span>
                                </label>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Special Space Products -->
                    <div class="shop-category">
                        <h4 class="category-title">🚀 {{ $t("Special Space Products") }}</h4>
                        <div class="space-products-grid">
                            <div v-for="product in spaceProducts" :key="product.id" class="space-product-card">
                                <div class="product-icon">{{ product.icon }}</div>
                                <div class="product-content">
                                    <h5 class="product-name">{{ product.name }}</h5>
                                    <p class="product-description">{{ product.description }}</p>
                                    <div class="product-formula" v-if="product.formula">
                                        <strong>Formula:</strong> {{ product.formula }}
                                    </div>
                                    <div class="product-properties" v-if="product.properties">
                                        <strong>Properties:</strong>
                                        <div class="properties-list">
                                            <span v-for="prop in product.properties" :key="prop" class="property-tag">
                                                {{ prop }}
                                            </span>
                                        </div>
                                    </div>
                                    <div class="product-applications" v-if="product.applications">
                                        <strong>Applications:</strong>
                                        <div class="applications-list">
                                            <span v-for="app in product.applications" :key="app" class="application-tag">
                                                {{ app }}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div class="product-price">{{ product.price }} TON</div>
                                <label class="product-checkbox">
                                    <input 
                                        type="checkbox" 
                                        v-model="product.selected"
                                        @change="updateCart"
                                    >
                                    <span class="checkmark"></span>
                                    <span class="add-to-cart-text">Добавить в корзину</span>
                                </label>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Shopping Cart -->
                    <div class="shopping-cart" v-if="cartItems.length > 0">
                        <h4 class="cart-title">🛒 {{ $t("Your Cart") }}</h4>
                        <div class="cart-items">
                            <div v-for="item in cartItems" :key="item.id" class="cart-item">
                                <div class="cart-item-info">
                                    <span class="cart-item-name">{{ item.name }}</span>
                                    <span class="cart-item-price">{{ item.price }} TON</span>
                                </div>
                                <button @click="removeFromCart(item)" class="remove-btn">×</button>
                            </div>
                        </div>
                        <div class="cart-total">
                            <span>Total: {{ cartTotal }} TON</span>
                        </div>
                        <div class="cart-actions">
                            <button @click="clearCart" class="clear-cart-btn">{{ $t("Clear Cart") }}</button>
                            <button @click="showPaymentModal = true" class="buy-now-btn">{{ $t("Buy Now") }}</button>
                        </div>
                    </div>
                </div>
                
                <!-- Payment Modal -->
                <div v-if="showPaymentModal" class="payment-modal">
                    <div class="modal-overlay" @click="showPaymentModal = false"></div>
                    <div class="modal-content">
                        <div class="modal-header">
                            <h2>💳 {{ $t("Complete Purchase") }}</h2>
                            <button @click="showPaymentModal = false" class="close-btn">×</button>
                        </div>
                        
                        <div class="modal-body">
                            <div class="order-summary">
                                <h4>{{ $t("Order Summary") }}</h4>
                                <div class="order-items">
                                    <div v-for="item in cartItems" :key="item.id" class="order-item">
                                        <span>{{ item.name }}</span>
                                        <span>{{ item.price }} TON</span>
                                    </div>
                                </div>
                                <div class="order-total">
                                    <strong>Total: {{ cartTotal }} TON</strong>
                                </div>
                            </div>
                            
                            <div class="payment-methods">
                                <h4>{{ $t("Payment Methods") }}</h4>
                                <div class="payment-options">
                                    <button @click="connectWallet" class="wallet-btn">
                                        🔗 {{ $t("Connect TON Wallet") }}
                                    </button>
                                    <button @click="manualWalletInput" class="manual-btn">
                                        📝 {{ $t("Enter Address Manually") }}
                                    </button>
                                </div>
                                
                                <div v-if="isConnected" class="wallet-status">
                                    <span class="status-success">✅ {{ $t("Wallet Connected") }}</span>
                                    <span class="wallet-address">{{ walletAddress.slice(0, 6) }}...{{ walletAddress.slice(-6) }}</span>
                                </div>
                            </div>
                            
                            <div class="payment-actions">
                                <button 
                                    @click="processPayment" 
                                    :disabled="!isConnected || processingPayment"
                                    class="pay-btn"
                                >
                                    {{ processingPayment ? 'Processing...' : `${$t("Pay")} ${cartTotal} TON` }}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Модальное окно с информацией о металлах -->
        <MetalInfoModal 
            :is-visible="showMetalInfoModal"
            :metal-info="selectedMetal"
            @close="showMetalInfoModal = false"
        />

        <!-- Улучшенная корзина -->
        <div class="cart-container">
            <EnhancedCart 
                :cart-items="cartItems"
                :cart-total="cartTotal"
                @remove-from-cart="handleRemoveFromCart"
                @clear-cart="handleClearCart"
                @proceed-to-checkout="handleProceedToCheckout"
            />
        </div>

        <div class="flexCenter mt-8">
            <div class="ship-container">
                <div class="ship" :style="shipStyle"></div>
            </div>
        </div>

        <div class="footer">
            <div class="w-60 m-auto pb-4">
                <router-link to="/game" class="btn play"><i class="bi bi-controller fs-24px mr-1"></i> {{$t('Play')}} </router-link>
            </div>
        </div>
    </div>
</template>

<script>
import shipImage from "../assets/images/game/ships/ship.png";
import MetalInfoModal from '../components/MetalInfoModal.vue';
import EnhancedCart from '../components/EnhancedCart.vue';

export default {
    components: {
        MetalInfoModal,
        EnhancedCart
    },
    data() {
        return {
            shipImage, // Путь к спрайту
            shipImageWidth: 213 * 0.5, // Оригинальная ширина корабля
            shipImageHeight: 256 * 0.5, // Оригинальная высота корабля
            columns: 6, // Количество колонок в спрайте
            selectedShipIndex: 0, // Выбираем первый корабль
            targetWidth: 120, // Желаемая ширина корабля
            showMetals: false, // Показывать ли металлы
            showProjectInfo: false, // Показывать ли информацию о проекте
            calculatedCenta: null, // Результат расчета
            calculationFormula: '', // Формула расчета
            autopilotPlans: [
                { id: 1, name: 'Basic Autopilot', price: 100, bonus: 1.2, duration: '1 hour', selected: false },
                { id: 2, name: 'Advanced Autopilot', price: 500, bonus: 1.5, duration: '4 hours', selected: false },
                { id: 3, name: 'Pro Autopilot', price: 1000, bonus: 2.0, duration: '12 hours', selected: false },
            ],
            advancedTechnologies: [
                { id: 1, name: 'AI Neural Network', description: 'Enhances mining efficiency and accuracy', formula: 'Efficiency = 1 + (0.1 * Neural Network Level)', benefits: ['Increased Mining Speed', 'Better Resource Discovery'] },
                { id: 2, name: 'Quantum Computing Module', description: 'Enables advanced quantum algorithms for mining', formula: 'Efficiency = 1 + (0.2 * Quantum Level)', benefits: ['Ultra-Fast Processing', 'Advanced AI Capabilities'] },
                { id: 3, name: 'Anti-Gravity Drive', description: 'Reduces energy consumption and increases mining speed', formula: 'Efficiency = 1 + (0.15 * Anti-Gravity Level)', benefits: ['Energy Efficiency', 'Increased Mining Speed'] },
            ],
            knowledgePackages: [
                { id: 1, name: 'Beginner Guide to Mining', description: 'Everything you need to know about starting your mining journey', topics: ['Introduction', 'Getting Started', 'Basic Concepts'] },
                { id: 2, name: 'Advanced Mining Techniques', description: 'Strategies for maximizing your mining output and efficiency', topics: ['Optimization', 'Advanced Strategies', 'Troubleshooting'] },
                { id: 3, name: 'TON Blockchain Overview', description: 'Understanding the TON blockchain and its role in CentavraCoin', topics: ['TON Basics', 'Blockchain Technology', 'TON Foundation'] },
            ],
            spaceProducts: [
                {
                    id: 1,
                    name: 'AI Neural Network Module',
                    description: 'Advanced AI neural network for enhanced mining efficiency and resource discovery',
                    icon: '🧠',
                    formula: 'Efficiency = 1 + (0.15 * AI_Level) + (0.1 * Neural_Complexity)',
                    properties: ['Self-learning', 'Adaptive', 'High Performance'],
                    applications: ['Mining Optimization', 'Resource Prediction', 'AI Mining'],
                    price: 1500
                },
                {
                    id: 2,
                    name: 'Quantum Computing Core',
                    description: 'Quantum computing module enabling ultra-fast processing and advanced algorithms',
                    icon: '⚛️',
                    formula: 'Processing_Speed = 2^(Quantum_Bits) * Base_Speed',
                    properties: ['Quantum Entanglement', 'Superposition', 'Entanglement'],
                    applications: ['Complex Calculations', 'AI Training', 'Quantum Mining'],
                    price: 3000
                },
                {
                    id: 3,
                    name: 'Anti-Gravity Drive System',
                    description: 'Advanced propulsion system reducing energy consumption and increasing mining speed',
                    icon: '🚀',
                    formula: 'Energy_Efficiency = 1 / (1 + Gravity_Field_Strength)',
                    properties: ['Zero Gravity', 'Energy Efficient', 'High Speed'],
                    applications: ['Space Mining', 'Resource Transport', 'Exploration'],
                    price: 2500
                },
                {
                    id: 4,
                    name: 'Graphene-MXene Composite',
                    description: 'Ultra-strong and conductive material for advanced mining equipment',
                    icon: '🔬',
                    formula: 'Strength = Graphene_Strength * 0.7 + MXene_Strength * 0.3',
                    properties: ['Superconductive', 'Ultra-strong', 'Lightweight'],
                    applications: ['Mining Tools', 'Energy Storage', 'Equipment'],
                    price: 2000
                },
                {
                    id: 5,
                    name: 'Liquid Metal AI Structures',
                    description: 'Programmable liquid metal structures for adaptive mining robotics',
                    icon: '🌊',
                    formula: 'Adaptability = Liquid_Flow_Rate * AI_Control_Level',
                    properties: ['Morphing', 'Self-repairing', 'Adaptive'],
                    applications: ['Mining Robots', 'Adaptive Tools', 'Self-repair'],
                    price: 1800
                },
                {
                    id: 6,
                    name: 'Helium-3 Fusion Reactor',
                    description: 'Clean fusion power source for sustainable mining operations',
                    icon: '☢️',
                    formula: 'Power_Output = He3_Density * Fusion_Efficiency * Reactor_Size',
                    properties: ['Clean Energy', 'High Efficiency', 'Sustainable'],
                    applications: ['Power Generation', 'Space Mining', 'Clean Energy'],
                    price: 5000
                }
            ],
            cartItems: [],
            cartTotal: 0,
            showPaymentModal: false,
            isConnected: false,
            walletAddress: '',
            processingPayment: false,
            showMetalInfoModal: false,
            selectedMetal: null,
            metalsData: [],
            gameSettings: {},
            isDatabaseConnected: false,
            currentLanguage: 'en', // По умолчанию английский
        };
    },
    computed: {
        shipStyle() {
            const column = this.selectedShipIndex % this.columns;
            const row = Math.floor(this.selectedShipIndex / this.columns);

            const scaleFactor = this.targetWidth / this.shipImageWidth; // Коэффициент масштабирования
            const targetHeight = this.shipImageHeight * scaleFactor; // Высчитываем новую высоту

            return {
                backgroundImage: `url(${this.shipImage})`,
                backgroundPosition: `-${column * this.shipImageWidth}px -${row * this.shipImageHeight}px`,
                backgroundSize: `${this.columns * this.shipImageWidth}px auto`,
                width: `${this.targetWidth}px`,
                height: `${targetHeight}px`,
            };
        },
        
        // Получение данных пользователя из store
        user() {
            return this.$store.state.user || {
                gold: 0,
                silver: 0,
                copper: 0,
                iron: 0
            };
        }
    },
    methods: {
        // Форматирование больших чисел с разделением тысяч
        formatCenta(amount) {
            if (amount === null || amount === undefined) return '0';
            
            // Преобразуем в число и убираем десятичные знаки если они есть
            const num = Math.floor(Number(amount));
            
            // Проверяем на NaN
            if (isNaN(num)) return '0';
            
            // Для очень больших чисел используем сокращенную запись
            if (num >= 1000000000) {
                return (num / 1000000000).toFixed(1) + 'B';
            } else if (num >= 1000000) {
                return (num / 1000000).toFixed(1) + 'M';
            } else if (num >= 1000) {
                return (num / 1000).toFixed(1) + 'K';
            }
            
            // Для обычных чисел используем разделение тысяч
            return num.toLocaleString('en-US', {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            });
        },
        
        // Форматирование точного количества CENTA для очень маленьких чисел
        formatPreciseCenta(amount) {
            if (amount === null || amount === undefined || amount === 0) return '0';
            
            const num = Number(amount);
            if (isNaN(num)) return '0';
            
            // Для очень маленьких чисел показываем полную точность
            if (num < 0.000001) {
                return num.toFixed(20).replace(/\.?0+$/, ''); // Убираем лишние нули в конце
            }
            
            // Для обычных чисел используем стандартное форматирование
            if (num < 1) {
                return num.toFixed(6).replace(/\.?0+$/, '');
            }
            
            return num.toFixed(2);
        },
        
        // Расчет CENTA на основе металлов согласно токеномике
        calculateCentaFromMetals() {
            try {
                // Получаем данные из store или localStorage
                const userData = this.$store.state.user || JSON.parse(localStorage.getItem('userData') || '{}');
                
                const metals = {
                    gold: userData.gold || 0,
                    silver: userData.silver || 0,
                    iron: userData.iron || 0,
                    copper: userData.copper || 0
                };
                
                console.log('[CENTA] Calculating from metals:', metals);
                
                // Токеномика CENTA согласно AI_Universal_Resource_Matrix
                const rates = {
                    gold: 108190,      // 1 Gold = 108,190 CENTA per kg
                    silver: 1253,       // 1 Silver = 1,253 CENTA per kg
                    iron: 0.438,        // 1 Iron = 0.438 CENTA per kg
                    copper: 9.812       // 1 Copper = 9.812 CENTA per kg
                };
                
                console.log('[CENTA] Using rates:', rates);
                
                // Расчет CENTA
                let totalCenta = 0;
                let formula = [];
                let metalContributions = {};
                
                Object.keys(metals).forEach(metal => {
                    const amount = metals[metal];
                    const rate = rates[metal];
                    const centaFromMetal = amount * rate;
                    totalCenta += centaFromMetal;
                    
                    metalContributions[metal] = {
                        amount: amount,
                        rate: rate,
                        centa: centaFromMetal
                    };
                    
                    if (amount > 0) {
                        // Форматируем формулу для лучшей читаемости
                        const centaFormatted = centaFromMetal < 0.01 ? centaFromMetal.toFixed(6) : centaFromMetal.toFixed(2);
                        formula.push(`${amount} kg × ${rate} CENTA/kg = ${centaFormatted} CENTA`);
                    }
                });
                
                // Формируем формулу для отображения
                this.calculationFormula = formula.length > 0 ? formula.join(' + ') : 'No metals found';
                
                // Сохраняем результат
                this.calculatedCenta = totalCenta;
                
                // Показываем металлы
                this.showMetals = true;
                
                // Обновляем store с результатами
                this.$store.commit('setCalculatedCenta', totalCenta);
                
                console.log('[CENTA] Calculation result:', {
                    metals,
                    rates,
                    metalContributions,
                    totalCenta,
                    formula: this.calculationFormula
                });
                
                // Показываем уведомление
                if (this.$toast) {
                    this.$toast.success(`CENTA calculated: ${this.formatPreciseCenta(totalCenta)}`, { timeout: 5000 });
                }
                
            } catch (error) {
                console.error('[CENTA] Error calculating CENTA:', error);
                this.calculatedCenta = null;
                this.calculationFormula = 'Calculation error';
                
                if (this.$toast) {
                    this.$toast.error('Error calculating CENTA: ' + error.message, { timeout: 5000 });
                }
            }
        },
        
        // Получение иконки металла
        getMetalIcon(metal) {
            const icons = {
                gold: '/src/assets/images/game/metals/gold.png',
                silver: '/src/assets/images/game/metals/silver.png',
                copper: '/src/assets/images/game/metals/copper.png',
                steel: '/src/assets/images/game/metals/steel.png'
            };
            return icons[metal] || icons.steel;
        },
        
        // Форматирование названия металла
        formatMetalName(metal) {
            const names = {
                gold: 'Gold (Au)',
                silver: 'Silver (Ag)',
                copper: 'Copper (Cu)',
                steel: 'Steel (Fe*)'
            };
            return names[metal] || metal;
        },
        
        // Форматирование стоимости металла в nCENTA
        formatMetalValue(metal, amount) {
            const prices = {
                gold: 108190000000,    // 108,190 nCENTA per kg
                silver: 1253000000,    // 1,253 nCENTA per kg
                copper: 9812000,       // 9.812 nCENTA per kg
                steel: 438000          // 0.438 nCENTA per kg
            };
            const price = prices[metal] || prices.steel;
            const totalNcenta = amount * price;
            
            if (totalNcenta >= 1000000000) {
                return (totalNcenta / 1000000000).toFixed(3) + ' nCENTA';
            } else if (totalNcenta >= 1000000) {
                return (totalNcenta / 1000000).toFixed(3) + ' nCENTA';
            } else if (totalNcenta >= 1000) {
                return (totalNcenta / 1000).toFixed(3) + ' nCENTA';
            } else {
                return totalNcenta.toFixed(0) + ' nCENTA';
            }
        },
        
        // Расчет вклада металла в CENTA
        getMetalContribution(metal, amount) {
            const prices = {
                gold: 108190,    // 108.190 CENTA per kg
                silver: 1253,    // 1.253 CENTA per kg
                copper: 9.812,   // 9.812 CENTA per kg
                iron: 0.438     // 0.438 CENTA per kg
            };
            const price = prices[metal] || prices.iron;
            return amount * price;
        },

        updateCart() {
            // Обновляем корзину на основе выбранных элементов
            this.cartItems = [];
            
            // Добавляем выбранные планы автопилота
            this.autopilotPlans.forEach(plan => {
                if (plan.selected) {
                    this.cartItems.push({
                        id: `autopilot_${plan.id}`,
                        name: plan.name,
                        price: plan.price,
                        type: 'autopilot'
                    });
                }
            });
            
            // Добавляем выбранные технологии
            this.advancedTechnologies.forEach(tech => {
                if (tech.selected) {
                    this.cartItems.push({
                        id: `tech_${tech.id}`,
                        name: tech.name,
                        price: tech.price,
                        type: 'technology'
                    });
                }
            });
            
            // Добавляем выбранные пакеты знаний
            this.knowledgePackages.forEach(knowledge => {
                if (knowledge.selected) {
                    this.cartItems.push({
                        id: `knowledge_${knowledge.id}`,
                        name: knowledge.name,
                        price: knowledge.price,
                        type: 'knowledge'
                    });
                }
            });
            
            // Добавляем выбранные космические продукты
            this.spaceProducts.forEach(product => {
                if (product.selected) {
                    this.cartItems.push({
                        id: `space_${product.id}`,
                        name: product.name,
                        price: product.price,
                        type: 'space_product'
                    });
                }
            });
            
            // Обновляем общую стоимость
            this.cartTotal = this.cartItems.reduce((sum, item) => sum + item.price, 0);
        },

        removeFromCart(item) {
            const index = this.cartItems.findIndex(cartItem => cartItem.id === item.id);
            if (index !== -1) {
                this.cartItems.splice(index, 1);
                this.updateCart();
            }
        },

        clearCart() {
            this.cartItems = [];
            this.updateCart();
        },

        async connectWallet() {
            try {
                // Здесь должна быть реальная интеграция с TON Connect
                // Пока что симулируем подключение
                this.isConnected = true;
                this.walletAddress = 'EQD4FPq-PRDieyQKkizFTRtSDyucUIqrj0v_zXJmqaDp6_0t';
                this.showToast('TON Wallet connected successfully!', 'success');
                
                // Сохраняем адрес в localStorage для демонстрации
                localStorage.setItem('walletAddress', this.walletAddress);
                
            } catch (error) {
                console.error('Error connecting wallet:', error);
                this.showToast('Failed to connect wallet: ' + error.message, 'error');
            }
        },

        manualWalletInput() {
            const address = prompt('Please enter your TON wallet address:');
            if (address && address.length > 10) {
                this.isConnected = true;
                this.walletAddress = address;
                this.showToast('Wallet address set manually!', 'success');
                
                // Сохраняем адрес в localStorage
                localStorage.setItem('walletAddress', address);
            } else if (address !== null) {
                this.showToast('Invalid wallet address. Please try again.', 'error');
            }
        },

        showToast(message, type = 'info') {
            if (this.$toast) {
                this.$toast[type](message, { timeout: 5000 });
            }
        },

        async processPayment() {
            if (!this.isConnected || !this.walletAddress) {
                this.showToast('Please connect your wallet first!', 'error');
                return;
            }
            
            this.processingPayment = true;
            
            try {
                // Здесь должна быть реальная интеграция с TON Connect для отправки транзакции
                // Пока что симулируем процесс платежа
                
                // Показываем прогресс
                this.showToast('Processing payment...', 'info');
                
                // Симулируем задержку сети
                await new Promise(resolve => setTimeout(resolve, 3000));
                
                // Успешный платеж
                this.showToast(`Payment of ${this.cartTotal} TON successful!`, 'success');
                
                // Очищаем корзину и закрываем модальное окно
                this.clearCart();
                this.showPaymentModal = false;
                
                // Сохраняем покупки в localStorage для демонстрации
                const purchases = JSON.parse(localStorage.getItem('purchases') || '[]');
                purchases.push({
                    date: new Date().toISOString(),
                    items: this.cartItems,
                    total: this.cartTotal,
                    walletAddress: this.walletAddress
                });
                localStorage.setItem('purchases', JSON.stringify(purchases));
                
                // Обновляем статус пользователя (можно интегрировать с backend)
                this.showToast('Your mining efficiency has been upgraded!', 'success');
                
            } catch (error) {
                console.error('Payment error:', error);
                this.showToast('Payment failed: ' + error.message, 'error');
            } finally {
                this.processingPayment = false;
            }
        },
        
        // Загрузка данных пользователя из базы данных
        async loadUserData() {
            try {
                // Здесь должна быть реальная интеграция с backend API
                // Пока что используем localStorage для демонстрации
                const savedUserData = localStorage.getItem('userData');
                if (savedUserData) {
                    const userData = JSON.parse(savedUserData);
                    // Обновляем store с данными пользователя
                    this.$store.commit('setUserData', userData);
                } else {
                    // Если данных нет, создаем демо-данные
                    const demoUserData = {
                        centa: 1250.75,
                        gold: 2.5,
                        silver: 15.8,
                        copper: 45.2,
                        iron: 120.5
                    };
                    localStorage.setItem('userData', JSON.stringify(demoUserData));
                    this.$store.commit('setUserData', demoUserData);
                }
            } catch (error) {
                console.error('Error loading user data:', error);
                this.showToast('Failed to load user data', 'error');
            }
        },

        // Показать информацию о металле
        showMetalInfo(metalName) {
            const metal = this.metalsData.find(m => m.metal_name === metalName);
            if (metal) {
                this.selectedMetal = metal;
                this.showMetalInfoModal = true;
            } else {
                this.showToast(`Информация о ${metalName} не найдена`, 'error');
            }
        },

        // Загрузка данных о металлах из базы
        async loadMetalsData() {
            try {
                // В реальном приложении здесь будет вызов API
                // Пока используем демо-данные
                this.metalsData = [
                    {
                        metal_name: 'Gold',
                        symbol: 'Au',
                        usd_per_kg: 108190,
                        centa_per_kg: 108190,
                        ncenta_per_kg: 108190000000,
                        spawn_weight: 1,
                        rarity: 'ultra_rare',
                        min_yield_kg: 0.01,
                        max_yield_kg: 5.0,
                        description: 'Ultra-rare precious metal with highest value in the game. Gold asteroids are extremely rare but provide the highest CENTA rewards.',
                        properties: ['ultra_reflective', 'corrosion_resistant', 'superconductive'],
                        applications: ['space_optics', 'AI_contacts', 'thermal_shields']
                    },
                    {
                        metal_name: 'Silver',
                        symbol: 'Ag',
                        usd_per_kg: 1253,
                        centa_per_kg: 1253,
                        ncenta_per_kg: 1253000000,
                        spawn_weight: 10,
                        rarity: 'rare',
                        min_yield_kg: 0.05,
                        max_yield_kg: 20.0,
                        description: 'Rare precious metal with high conductivity. Silver asteroids appear occasionally and provide significant CENTA rewards.',
                        properties: ['hydrogen_absorption', 'catalyst', 'high_conductivity'],
                        applications: ['fuel_cells', 'autonomous_power_units', 'electronics']
                    },
                    {
                        metal_name: 'Copper',
                        symbol: 'Cu',
                        usd_per_kg: 9.812,
                        centa_per_kg: 9.812,
                        ncenta_per_kg: 9812000,
                        spawn_weight: 200,
                        rarity: 'common',
                        min_yield_kg: 1.0,
                        max_yield_kg: 300.0,
                        description: 'Common metal with good conductivity. Copper asteroids appear regularly and provide stable CENTA income.',
                        properties: ['conductive', 'malleable', 'corrosion_resistant'],
                        applications: ['electrical_wiring', 'electronics', 'construction']
                    },
                    {
                        metal_name: 'Iron',
                        symbol: 'Fe',
                        usd_per_kg: 0.438,
                        centa_per_kg: 0.438,
                        ncenta_per_kg: 438000,
                        spawn_weight: 1000,
                        rarity: 'very_common',
                        min_yield_kg: 5.0,
                        max_yield_kg: 1000.0,
                        description: 'Very common structural metal. Iron asteroids appear frequently and provide basic CENTA rewards for beginners.',
                        properties: ['magnetic', 'strong', 'abundant'],
                        applications: ['construction', 'machinery', 'tools']
                    }
                ];
            } catch (error) {
                console.error('Error loading metals data:', error);
                this.showToast('Failed to load metals data', 'error');
            }
        },

        // Загрузка настроек игры
        async loadGameSettings() {
            try {
                // В реальном приложении здесь будет вызов API
                this.gameSettings = {
                    gold_spawn_config: {
                        phases: {
                            onboarding: { min_players: 0, max_players: 2000, drops_per_player_per_year: 4.0 },
                            growth: { min_players: 2001, max_players: 50000, drops_per_player_per_year: 1.5 },
                            mature: { min_players: 50001, max_players: 1000000000, drops_per_player_per_year: 0.5 }
                        },
                        pity_system: { enabled: true, no_drop_window_spawns: 50, guarantee_multiplier: 10 },
                        safety_limits: { min_drop_chance: 0.00001, max_drop_chance: 0.5, global_gold_drops_per_day_max: 500 }
                    },
                    centa_tokenomics: {
                        total_supply: 21000000,
                        divisibility: 9,
                        pricing: { quote_token: 'USDT', assumptions: { USDT_per_TON: 3, USDT_per_CENTA: 1 } }
                    }
                };
            } catch (error) {
                console.error('Error loading game settings:', error);
            }
        },

        // Обработка событий корзины
        handleRemoveFromCart(item) {
            this.removeFromCart(item);
        },

        handleClearCart() {
            this.clearCart();
        },

        handleProceedToCheckout() {
            this.showPaymentModal = true;
        }
    },
    mounted() {
        this.$store.dispatch('fetchUserData');
        this.loadUserData(); // Загружаем данные пользователя
        this.loadMetalsData(); // Загружаем данные о металлах
        this.loadGameSettings(); // Загружаем настройки игры
        
        // Проверяем сохраненный адрес кошелька
        const savedWalletAddress = localStorage.getItem('walletAddress');
        if (savedWalletAddress) {
            this.walletAddress = savedWalletAddress;
            this.isConnected = true;
        }
    },
};
</script>

<style scoped>
.ship {
    background-repeat: no-repeat;
    display: block;
}

/* Стили для отображения CENTA */
.centa-display-container {
    text-align: center;
    min-width: 300px; /* Минимальная ширина для больших чисел */
    max-width: 90vw; /* Максимальная ширина на мобильных */
}

.centa-main-display {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: nowrap; /* Предотвращаем перенос */
    gap: 8px;
    margin-bottom: 16px;
}

.centa-amount {
    font-size: 40px;
    font-weight: bold;
    color: #ffffff;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
    white-space: nowrap; /* Предотвращаем перенос цифр */
    overflow: visible; /* Показываем все цифры */
    min-width: fit-content; /* Минимальная ширина по содержимому */
    padding-left: 8px;
}

/* Адаптивность для мобильных устройств */
@media (max-width: 768px) {
    .centa-display-container {
        min-width: 250px;
        max-width: 95vw;
    }
    
    .centa-amount {
        font-size: 32px; /* Уменьшаем шрифт на мобильных */
    }
    
    .centa-main-display {
        gap: 6px;
    }
    
    .metals-grid {
        grid-template-columns: 1fr;
        gap: 8px;
    }
    
    .result-amount {
        font-size: 18px;
        word-break: break-all;
    }
    
    .metal-breakdown {
        padding: 16px;
        margin-top: 20px;
    }
    
    .metal-item {
        flex-direction: column;
        text-align: center;
        gap: 12px;
        padding: 12px;
    }
    
    .metal-contribution {
        text-align: center;
    }
    
    .metal-grid {
        gap: 12px;
    }
}

@media (max-width: 480px) {
    .centa-amount {
        font-size: 28px; /* Еще меньше на очень маленьких экранах */
    }
    
    .centa-display-container {
        min-width: 200px;
    }
    
    .metals-grid {
        gap: 6px;
    }
    
    .result-amount {
        font-size: 16px;
    }
}

/* Стили для отображения металлов */
.metals-display {
    background: rgba(0, 0, 0, 0.7);
    border-radius: 12px;
    padding: 16px;
    margin: 16px 0;
    border: 1px solid #333;
}

.metals-title {
    color: #fff;
    font-size: 18px;
    font-weight: bold;
    text-align: center;
    margin-bottom: 12px;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
}

.metals-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
}

.metal-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.2);
}

.metal-icon {
    font-size: 16px;
}

.metal-name {
    color: #ccc;
    font-size: 14px;
    font-weight: bold;
    min-width: 60px;
}

.metal-amount {
    color: #fff;
    font-size: 16px;
    font-weight: bold;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
}

/* Стили для кнопки Search */
.search-btn {
    background: linear-gradient(135deg, #4CAF50, #45a049);
    border: none;
    color: white;
    padding: 12px 24px;
    border-radius: 8px;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.search-btn:hover {
    background: linear-gradient(135deg, #45a049, #4CAF50);
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.4);
}

.search-btn:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

/* Стили для результатов расчета */
.calculation-result {
    background: linear-gradient(135deg, rgba(76, 175, 80, 0.2), rgba(69, 160, 73, 0.2));
    border: 2px solid #4CAF50;
    border-radius: 12px;
    padding: 20px;
    margin: 20px 0;
    text-align: center;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
}

.result-title {
    color: #4CAF50;
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 12px;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
}

.result-amount {
    color: #fff;
    font-size: 18px;
    font-weight: bold;
    font-family: 'Courier New', monospace;
    background: rgba(0, 0, 0, 0.5);
    padding: 8px 12px;
    border-radius: 8px;
    margin: 12px 0;
    word-break: break-all;
    word-wrap: break-word;
    max-width: 100%;
    overflow-wrap: break-word;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
    border: 1px solid #4CAF50;
}

.result-formula {
    color: #ccc;
    font-size: 14px;
    font-family: 'Courier New', monospace;
    background: rgba(0, 0, 0, 0.3);
    padding: 8px 12px;
    border-radius: 6px;
    margin-top: 12px;
    word-break: break-all;
    line-height: 1.4;
}

/* Project Info Modal Styles */
.project-info-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1000;
    display: flex;
    justify-content: center;
    align-items: center;
}

.modal-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(5px);
}

.modal-content {
    position: relative;
    background: linear-gradient(135deg, #1a1a1a, #2d2d2d);
    border-radius: 20px;
    padding: 0;
    max-width: 95vw;
    width: 95vw;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
    border: 1px solid #333;
}

.modal-header {
    background: linear-gradient(135deg, #4CAF50, #45a049);
    color: white;
    padding: 20px 30px;
    border-radius: 20px 20px 0 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.modal-header h2 {
    margin: 0;
    font-size: 24px;
    font-weight: bold;
}

.language-switcher {
    display: flex;
    gap: 10px;
}

.language-switcher button {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.3);
    color: white;
    padding: 8px 16px;
    border-radius: 20px;
    cursor: pointer;
    font-size: 14px;
    font-weight: bold;
    transition: all 0.3s ease;
}

.language-switcher button:hover {
    background: rgba(255, 255, 255, 0.2);
}

.language-switcher button.active {
    background: #4CAF50;
    border-color: #4CAF50;
    color: white;
}

.close-btn {
    background: rgba(255, 255, 255, 0.2);
    border: none;
    color: white;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    font-size: 20px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.close-btn:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.1);
}

.modal-body {
    padding: 30px;
    color: white;
}

.info-section {
    margin-bottom: 40px;
}

.info-section h3 {
    color: #4CAF50;
    font-size: 20px;
    margin-bottom: 20px;
    border-bottom: 2px solid #4CAF50;
    padding-bottom: 10px;
}

.comparison-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-bottom: 20px;
}

.comparison-item {
    background: rgba(255, 255, 255, 0.1);
    padding: 20px;
    border-radius: 12px;
    text-align: center;
    border: 1px solid rgba(255, 255, 255, 0.2);
}

.comparison-item.better {
    background: linear-gradient(135deg, rgba(76, 175, 80, 0.2), rgba(69, 160, 73, 0.2));
    border-color: #4CAF50;
}

.comparison-title {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 8px;
}

.comparison-desc {
    color: #ccc;
    font-size: 14px;
}

.benefits-list {
    list-style: none;
    padding: 0;
}

.benefits-list li {
    background: rgba(255, 255, 255, 0.05);
    padding: 12px 16px;
    margin-bottom: 8px;
    border-radius: 8px;
    border-left: 4px solid #4CAF50;
}

.tokenomics-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    margin-bottom: 20px;
}

.tokenomics-item {
    background: rgba(255, 255, 255, 0.1);
    padding: 20px;
    border-radius: 12px;
    text-align: center;
    border: 1px solid rgba(255, 255, 255, 0.2);
}

.tokenomics-value {
    font-size: 24px;
    font-weight: bold;
    color: #4CAF50;
    margin-bottom: 8px;
}

.tokenomics-label {
    color: #ccc;
    font-size: 14px;
}

.emission-schedule {
    background: rgba(76, 175, 80, 0.1);
    padding: 20px;
    border-radius: 12px;
    border: 1px solid rgba(76, 175, 80, 0.3);
}

.emission-schedule h4 {
    color: #4CAF50;
    margin-bottom: 10px;
}

.emission-schedule p {
    color: #ccc;
    margin: 0;
}

.mining-features {
    display: grid;
    gap: 20px;
}

.feature-item {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    background: rgba(255, 255, 255, 0.05);
    padding: 20px;
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.feature-icon {
    font-size: 24px;
    min-width: 40px;
}

.feature-title {
    font-size: 16px;
    font-weight: bold;
    color: #4CAF50;
    margin-bottom: 8px;
}

.feature-desc {
    color: #ccc;
    font-size: 14px;
    line-height: 1.5;
}

.metals-table {
    background: rgba(0, 0, 0, 0.3);
    border-radius: 12px;
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, 0.2);
}

.metals-header {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    background: rgba(76, 175, 80, 0.2);
    padding: 16px;
    font-weight: bold;
    color: #4CAF50;
}

.metal-row {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    padding: 16px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    transition: background 0.3s ease;
}

.metal-row:hover {
    background: rgba(255, 255, 255, 0.05);
}

.metal-row.gold {
    border-left: 4px solid #FFD700;
}

.metal-row.silver {
    border-left: 4px solid #C0C0C0;
}

.metal-row.copper {
    border-left: 4px solid #B87333;
}

.metal-row.steel {
    border-left: 4px solid #A19D94;
}

.metal-col {
    padding: 8px;
    text-align: center;
    color: #fff;
}

.thesis-points {
    display: grid;
    gap: 20px;
}

.thesis-item {
    display: flex;
    gap: 20px;
    background: rgba(255, 255, 255, 0.05);
    padding: 20px;
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.thesis-number {
    background: #4CAF50;
    color: white;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 18px;
    flex-shrink: 0;
}

.thesis-title {
    font-size: 16px;
    font-weight: bold;
    color: #4CAF50;
    margin-bottom: 8px;
}

.thesis-desc {
    color: #ccc;
    font-size: 14px;
    line-height: 1.5;
}

.mechanics-info {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.mechanics-item {
    display: flex;
    gap: 15px;
    background: rgba(255, 255, 255, 0.05);
    padding: 20px;
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.mechanics-icon {
    font-size: 24px;
    min-width: 40px;
    text-align: center;
}

.mechanics-content {
    flex: 1;
}

.mechanics-title {
    color: #4CAF50;
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 8px;
}

.mechanics-desc {
    color: #ccc;
    font-size: 14px;
    line-height: 1.5;
}

.future-vision {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.vision-item {
    display: flex;
    gap: 15px;
    background: rgba(255, 255, 255, 0.05);
    padding: 20px;
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.vision-icon {
    font-size: 24px;
    min-width: 40px;
    text-align: center;
}

.vision-content {
    flex: 1;
}

.vision-title {
    color: #4CAF50;
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 8px;
}

.vision-desc {
    color: #ccc;
    font-size: 14px;
    line-height: 1.5;
}

.modal-footer {
    padding: 20px 30px;
    text-align: center;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.btn-primary {
    background: linear-gradient(135deg, #4CAF50, #45a049);
    border: none;
    color: white;
    padding: 12px 24px;
    border-radius: 8px;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
}

.btn-primary:hover {
    background: linear-gradient(135deg, #45a049, #4CAF50);
    transform: translateY(-2px);
}

/* Metal Breakdown Styles */
.metal-breakdown {
    margin-top: 24px;
    padding: 20px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.metal-breakdown h4 {
    color: #4CAF50;
    font-size: 18px;
    margin-bottom: 16px;
    text-align: center;
}

.metal-grid {
    display: grid;
    gap: 16px;
}

.metal-item {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px;
    background: rgba(255, 255, 255, 0.08);
    border-radius: 10px;
    border: 1px solid rgba(255, 255, 255, 0.15);
    transition: all 0.3s ease;
}

.metal-item:hover {
    background: rgba(255, 255, 255, 0.12);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.metal-icon {
    flex-shrink: 0;
}

.metal-img {
    width: 40px;
    height: 40px;
    border-radius: 8px;
    object-fit: cover;
}

.metal-info {
    flex: 1;
    min-width: 0;
}

.metal-name {
    font-weight: bold;
    color: #4CAF50;
    font-size: 16px;
    margin-bottom: 4px;
}

.metal-amount {
    color: #fff;
    font-size: 14px;
    margin-bottom: 2px;
}

.metal-value {
    color: #ccc;
    font-size: 12px;
    font-family: 'Courier New', monospace;
}

.metal-contribution {
    text-align: right;
    flex-shrink: 0;
}

.contribution-label {
    color: #ccc;
    font-size: 12px;
    margin-bottom: 4px;
}

.contribution-value {
    color: #4CAF50;
    font-weight: bold;
    font-size: 16px;
}

/* Advanced Shop Styles */
.advanced-shop-section {
    margin-top: 40px;
    padding: 20px;
    background: rgba(0, 0, 0, 0.7);
    border-radius: 12px;
    border: 1px solid #333;
}

.shop-title {
    color: #fff;
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 15px;
    text-align: center;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
}

.shop-description {
    color: #ccc;
    font-size: 14px;
    margin-bottom: 20px;
    text-align: center;
}

.shop-category {
    margin-bottom: 30px;
}

.category-title {
    color: #4CAF50;
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 15px;
    border-bottom: 2px solid #4CAF50;
    padding-bottom: 10px;
}

.plan-card, .tech-card, .knowledge-card {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 15px 20px;
    background: rgba(255, 255, 255, 0.08);
    border-radius: 10px;
    border: 1px solid rgba(255, 255, 255, 0.15);
    margin-bottom: 10px;
    transition: all 0.3s ease;
}

.plan-card:hover, .tech-card:hover, .knowledge-card:hover {
    background: rgba(255, 255, 255, 0.12);
    transform: translateY(-3px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
}

.plan-header, .tech-content, .knowledge-content {
    flex: 1;
    margin-right: 15px;
}

.plan-price, .tech-price, .knowledge-price {
    font-size: 18px;
    font-weight: bold;
    color: #4CAF50;
    min-width: 100px;
    text-align: right;
}

.plan-bonus, .tech-formula {
    color: #ccc;
    font-size: 14px;
    margin-top: 5px;
}

.plan-duration {
    color: #ccc;
    font-size: 12px;
    margin-top: 5px;
}

.tech-icon, .knowledge-icon {
    font-size: 28px;
    color: #4CAF50;
    min-width: 40px;
}

.tech-name, .knowledge-name {
    font-size: 16px;
    font-weight: bold;
    color: #fff;
    margin-bottom: 5px;
}

.tech-description, .knowledge-description {
    color: #ccc;
    font-size: 13px;
    line-height: 1.4;
    margin-bottom: 10px;
}

.tech-formula {
    background: rgba(0, 0, 0, 0.3);
    padding: 8px 12px;
    border-radius: 6px;
    font-family: 'Courier New', monospace;
    font-size: 14px;
    color: #4CAF50;
    margin-top: 5px;
}

.tech-benefits, .knowledge-topics {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 10px;
}

.benefit-tag, .topic-tag {
    background: rgba(76, 175, 80, 0.2);
    padding: 6px 12px;
    border-radius: 8px;
    border: 1px solid rgba(76, 175, 80, 0.3);
    font-size: 12px;
    color: #4CAF50;
    font-weight: bold;
}

.shopping-cart {
    margin-top: 30px;
    padding: 20px;
    background: rgba(0, 0, 0, 0.7);
    border-radius: 12px;
    border: 1px solid #333;
}

.cart-title {
    color: #fff;
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 15px;
    text-align: center;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
}

.cart-items {
    max-height: 200px;
    overflow-y: auto;
    margin-bottom: 15px;
}

.cart-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
    border-bottom: 1px dashed rgba(255, 255, 255, 0.1);
}

.cart-item:last-child {
    border-bottom: none;
}

.cart-item-info {
    display: flex;
    align-items: center;
    gap: 15px;
}

.cart-item-name {
    font-size: 15px;
    color: #fff;
    font-weight: bold;
}

.cart-item-price {
    font-size: 15px;
    color: #4CAF50;
    font-weight: bold;
}

.remove-btn {
    background: rgba(255, 255, 255, 0.1);
    border: none;
    color: #fff;
    padding: 8px 12px;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 18px;
}

.remove-btn:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.1);
}

.cart-total {
    text-align: right;
    font-size: 18px;
    font-weight: bold;
    color: #fff;
    margin-bottom: 15px;
    padding-right: 10px;
}

.cart-actions {
    display: flex;
    justify-content: space-between;
    gap: 10px;
}

.clear-cart-btn, .buy-now-btn {
    flex: 1;
    background: linear-gradient(135deg, #4CAF50, #45a049);
    border: none;
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.clear-cart-btn:hover, .buy-now-btn:hover {
    background: linear-gradient(135deg, #45a049, #4CAF50);
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.4);
}

.clear-cart-btn:active, .buy-now-btn:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.payment-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1000;
    display: flex;
    justify-content: center;
    align-items: center;
}

.payment-modal .modal-content {
    max-width: 500px;
    max-height: 600px;
    padding: 30px;
    background: linear-gradient(135deg, #1a1a1a, #2d2d2d);
    border-radius: 20px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
    border: 1px solid #333;
}

.payment-modal .modal-header {
    background: linear-gradient(135deg, #4CAF50, #45a049);
    color: white;
    padding: 20px 30px;
    border-radius: 20px 20px 0 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.payment-modal .modal-header h2 {
    margin: 0;
    font-size: 24px;
    font-weight: bold;
}

.payment-modal .modal-body {
    padding: 0;
    color: white;
}

.order-summary {
    margin-bottom: 20px;
    padding: 20px;
    background: rgba(0, 0, 0, 0.3);
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.order-summary h4 {
    color: #4CAF50;
    font-size: 18px;
    margin-bottom: 15px;
    border-bottom: 2px solid #4CAF50;
    padding-bottom: 10px;
}

.order-items {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    font-size: 15px;
    color: #fff;
}

.order-item:last-child {
    margin-bottom: 0;
}

.order-total {
    text-align: right;
    font-size: 20px;
    font-weight: bold;
    color: #4CAF50;
    margin-top: 15px;
    padding-right: 10px;
}

.payment-methods {
    margin-bottom: 20px;
    padding: 20px;
    background: rgba(0, 0, 0, 0.3);
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.payment-methods h4 {
    color: #4CAF50;
    font-size: 18px;
    margin-bottom: 15px;
    border-bottom: 2px solid #4CAF50;
    padding-bottom: 10px;
}

.payment-options {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.wallet-btn, .manual-btn {
    background: linear-gradient(135deg, #4CAF50, #45a049);
    border: none;
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.wallet-btn:hover, .manual-btn:hover {
    background: linear-gradient(135deg, #45a049, #4CAF50);
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.4);
}

.wallet-btn:active, .manual-btn:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.wallet-status {
    margin-top: 15px;
    padding: 10px 15px;
    background: rgba(76, 175, 80, 0.1);
    border-radius: 8px;
    border: 1px solid rgba(76, 175, 80, 0.3);
    display: flex;
    align-items: center;
    gap: 10px;
    color: #4CAF50;
    font-size: 14px;
    font-weight: bold;
}

.status-success {
    color: #4CAF50;
}

.wallet-address {
    color: #ccc;
    font-family: 'Courier New', monospace;
    font-size: 13px;
}

.payment-actions {
    margin-top: 20px;
    text-align: center;
}

.pay-btn {
    background: linear-gradient(135deg, #4CAF50, #45a049);
    border: none;
    color: white;
    padding: 12px 24px;
    border-radius: 8px;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.pay-btn:hover {
    background: linear-gradient(135deg, #45a049, #4CAF50);
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.4);
}

.pay-btn:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.pay-btn:disabled {
    background: #ccc;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
}

/* Checkbox Styles */
.plan-checkbox, .tech-checkbox, .knowledge-checkbox {
    display: flex;
    align-items: center;
    cursor: pointer;
    font-size: 14px;
    color: #4CAF50;
    font-weight: bold;
    margin-top: 10px;
}

.plan-checkbox input, .tech-checkbox input, .knowledge-checkbox input {
    display: none;
}

.checkmark {
    width: 20px;
    height: 20px;
    background: rgba(255, 255, 255, 0.1);
    border: 2px solid #4CAF50;
    border-radius: 4px;
    margin-right: 8px;
    position: relative;
    transition: all 0.3s ease;
}

.plan-checkbox:hover .checkmark,
.tech-checkbox:hover .checkmark,
.knowledge-checkbox:hover .checkmark {
    background: rgba(76, 175, 80, 0.2);
    border-color: #45a049;
}

.plan-checkbox input:checked + .checkmark,
.tech-checkbox input:checked + .checkmark,
.knowledge-checkbox input:checked + .checkmark {
    background: #4CAF50;
    border-color: #45a049;
}

.plan-checkbox input:checked + .checkmark::after,
.tech-checkbox input:checked + .checkmark::after,
.knowledge-checkbox input:checked + .checkmark::after {
    content: '✓';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: white;
    font-size: 14px;
    font-weight: bold;
}

/* Responsive Design */
@media (max-width: 768px) {
    .modal-content {
        max-width: 95vw;
        max-height: 95vh;
    }
    
    .modal-header {
        padding: 15px 20px;
    }
    
    .modal-header h2 {
        font-size: 20px;
    }
    
    .modal-body {
        padding: 20px;
    }
    
    .comparison-grid {
        grid-template-columns: 1fr;
        gap: 15px;
    }
    
    .tokenomics-grid {
        grid-template-columns: 1fr;
        gap: 15px;
    }
    
    .metals-header,
    .metal-row {
        grid-template-columns: 1fr 1fr;
    }
    
    .metals-header .metal-col:nth-child(3),
    .metals-header .metal-col:nth-child(4),
    .metal-row .metal-col:nth-child(3),
    .metal-row .metal-col:nth-child(4) {
        display: none;
    }

    .advanced-shop-section {
        padding: 15px;
    }

    .shop-title {
        font-size: 18px;
    }

    .shop-description {
        font-size: 13px;
    }

    .category-title {
        font-size: 16px;
    }

    .plan-card, .tech-card, .knowledge-card {
        flex-direction: column;
        align-items: flex-start;
        padding: 15px;
    }

    .plan-header, .tech-content, .knowledge-content {
        width: 100%;
        margin-right: 0;
        margin-bottom: 10px;
    }

    .plan-price, .tech-price, .knowledge-price {
        text-align: left;
        width: 100%;
        margin-top: 5px;
    }

    .plan-bonus, .tech-formula, .knowledge-description {
        font-size: 13px;
    }

    .plan-duration {
        font-size: 12px;
    }

    .tech-icon, .knowledge-icon {
        font-size: 24px;
    }

    .tech-name, .knowledge-name {
        font-size: 15px;
    }

    .cart-items {
        max-height: 150px;
    }

    .cart-item {
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
        padding-bottom: 10px;
    }

    .cart-item-info {
        width: 100%;
        justify-content: space-between;
    }

    .cart-item-name {
        font-size: 14px;
    }

    .cart-item-price {
        font-size: 14px;
    }

    .remove-btn {
        padding: 8px 15px;
        font-size: 16px;
    }

    .cart-total {
        font-size: 16px;
    }

    .cart-actions {
        flex-direction: column;
        gap: 10px;
    }

    .clear-cart-btn, .buy-now-btn {
        width: 100%;
    }

    .payment-modal .modal-content {
        max-width: 95vw;
        max-height: 95vh;
        padding: 20px;
    }

    .payment-modal .modal-header {
        padding: 15px 20px;
    }

    .payment-modal .modal-header h2 {
        font-size: 20px;
    }

    .payment-modal .modal-body {
        padding: 0;
    }

    .order-summary {
        padding: 15px;
    }

    .order-summary h4 {
        font-size: 16px;
    }

    .order-items {
        font-size: 14px;
    }

    .order-total {
        font-size: 18px;
    }

    .payment-methods {
        padding: 15px;
    }

    .payment-methods h4 {
        font-size: 16px;
    }

    .payment-options {
        flex-direction: row;
        justify-content: space-around;
        gap: 10px;
    }

    .wallet-btn, .manual-btn {
        flex: none;
        width: 45%;
        padding: 10px 15px;
    }

    .wallet-status {
        flex-direction: column;
        align-items: flex-start;
        gap: 5px;
        padding: 10px 15px;
    }

    .wallet-address {
        font-size: 12px;
    }

    .payment-actions {
        margin-top: 15px;
    }

         .pay-btn {
         padding: 10px 20px;
         font-size: 15px;
     }
     
     .plan-checkbox, .tech-checkbox, .knowledge-checkbox {
         font-size: 13px;
     }
     
     .checkmark {
         width: 18px;
         height: 18px;
     }
     
     /* Дополнительные адаптивные стили */
     .calculation-result {
         padding: 15px;
         margin: 10px;
     }
     
     .result-title {
         font-size: 16px;
     }
     
     .result-amount {
         font-size: 14px;
         padding: 6px 10px;
     }
     
     .result-formula {
         font-size: 12px;
         padding: 6px 10px;
     }
     
     .metal-breakdown h4 {
         font-size: 14px;
     }
     
     .metal-grid {
         grid-template-columns: 1fr;
         gap: 10px;
     }
     
     .metal-item {
         padding: 10px;
     }
     
     .tech-grid, .knowledge-grid {
         grid-template-columns: 1fr;
         gap: 15px;
     }
     
     .tech-card, .knowledge-card {
         padding: 15px;
     }
     
     .tech-name, .knowledge-name {
         font-size: 14px;
     }
     
     .tech-description, .knowledge-description {
         font-size: 12px;
     }
     
     .tech-formula {
         font-size: 11px;
         padding: 5px 8px;
     }
     
     .benefit-tag, .topic-tag {
         font-size: 10px;
         padding: 3px 6px;
     }
     
     /* Space Products Styles */
     .space-products-grid {
         display: grid;
         grid-template-columns: 1fr;
         gap: 20px;
         margin-top: 20px;
     }
     
     .space-product-card {
         background: linear-gradient(135deg, #1a1a1a, #2d2d2d);
         border: 1px solid #333;
         border-radius: 15px;
         padding: 20px;
         display: flex;
         align-items: flex-start;
         gap: 15px;
         position: relative;
         transition: all 0.3s ease;
     }
     
     .space-product-card:hover {
         transform: translateY(-2px);
         box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
         border-color: #4CAF50;
     }
     
     .product-icon {
         font-size: 32px;
         flex-shrink: 0;
     }
     
     .product-content {
         flex: 1;
         min-width: 0;
     }
     
     .product-name {
         color: #4CAF50;
         font-size: 18px;
         font-weight: bold;
         margin: 0 0 8px 0;
         word-wrap: break-word;
     }
     
     .product-description {
         color: #ccc;
         font-size: 14px;
         line-height: 1.4;
         margin: 0 0 12px 0;
         word-wrap: break-word;
     }
     
     .product-formula {
         background: rgba(0, 0, 0, 0.3);
         padding: 8px 12px;
         border-radius: 8px;
         margin: 8px 0;
         font-family: 'Courier New', monospace;
         font-size: 12px;
         color: #4CAF50;
         word-wrap: break-word;
         overflow-wrap: break-word;
     }
     
     .product-properties, .product-applications {
         margin: 8px 0;
     }
     
     .product-properties strong, .product-applications strong {
         color: #4CAF50;
         font-size: 12px;
         display: block;
         margin-bottom: 5px;
     }
     
     .properties-list, .applications-list {
         display: flex;
         flex-wrap: wrap;
         gap: 5px;
     }
     
     .property-tag, .application-tag {
         background: rgba(76, 175, 80, 0.2);
         color: #4CAF50;
         padding: 3px 8px;
         border-radius: 12px;
         font-size: 10px;
         border: 1px solid rgba(76, 175, 80, 0.3);
         word-wrap: break-word;
     }
     
     .product-price {
         color: #FFD700;
         font-size: 18px;
         font-weight: bold;
         flex-shrink: 0;
         margin-left: 10px;
     }
     
     .product-checkbox {
         position: absolute;
         top: 15px;
         right: 15px;
         cursor: pointer;
     }
     
     .product-checkbox input[type="checkbox"] {
         display: none;
     }
     
     .product-checkbox .checkmark {
         width: 20px;
         height: 20px;
         background: rgba(0, 0, 0, 0.5);
         border: 2px solid #333;
         border-radius: 4px;
         display: flex;
         align-items: center;
         justify-content: center;
         transition: all 0.3s ease;
     }
     
     .product-checkbox input[type="checkbox"]:checked + .checkmark {
         background: #4CAF50;
         border-color: #4CAF50;
     }
     
     .product-checkbox input[type="checkbox"]:checked + .checkmark::after {
         content: '✓';
         color: white;
         font-size: 14px;
         font-weight: bold;
     }
     
     .add-to-cart-text {
         color: #4CAF50;
         font-size: 12px;
         margin-left: 8px;
         font-weight: bold;
     }
     
     /* Исправление ширины для Everything can be found */
     .centa-number {
         font-size: 14px;
         word-wrap: break-word;
         max-width: 100%;
         overflow-wrap: break-word;
     }
     
     .centa-icon {
         flex-shrink: 0;
     }
     
     .everything-text {
         word-wrap: break-word;
         max-width: 100%;
         overflow-wrap: break-word;
         text-align: center;
     }
     
     .btn-info.main {
         max-width: 100%;
         overflow-wrap: break-word;
         word-wrap: break-word;
     }
     
     /* Дополнительные стили для мобильных устройств */
     .flexCenter.g-2 {
         flex-wrap: wrap;
         gap: 10px;
     }
     
     .btn.search-btn {
         font-size: 12px;
         padding: 8px 12px;
         white-space: nowrap;
     }
     
     .calculation-result {
         max-width: 100%;
         overflow-wrap: break-word;
         word-wrap: break-word;
     }
     
     .metal-breakdown {
         max-width: 100%;
     }
     
     .metal-grid {
         max-width: 100%;
         overflow-wrap: break-word;
     }

     /* Стили для подсказок о металлах */
     .metal-info-hint {
         color: #4CAF50;
         font-size: 10px;
         text-align: center;
         margin-top: 5px;
         opacity: 0.7;
         cursor: pointer;
     }

     .metal-item {
         cursor: pointer;
         transition: all 0.3s ease;
     }

     .metal-item:hover {
         transform: translateY(-2px);
         box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
         border-color: #4CAF50;
     }

     /* Контейнер корзины */
     .cart-container {
         position: fixed;
         top: 120px;
         right: 20px;
         z-index: 1000;
     }

     /* Стили для контейнера кнопок */
     .buttons-container {
         display: flex;
         flex-direction: column;
         gap: 15px;
         align-items: center;
         width: 100%;
     }

     .action-buttons {
         display: flex;
         gap: 15px;
         width: 100%;
         justify-content: center;
     }

     .project-btn, .calculate-btn {
         flex: 1;
         max-width: 200px;
         min-width: 150px;
     }

     /* Адаптивность для мобильных устройств */
     @media (max-width: 768px) {
         .cart-container {
             position: fixed;
             top: 80px;
             right: 10px;
         }
         
         .action-buttons {
             flex-direction: column;
             gap: 10px;
         }
         
         .project-btn, .calculate-btn {
             max-width: 100%;
             min-width: auto;
         }
     }
}
</style>