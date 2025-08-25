<template>
    <div v-if="isVisible" class="metal-info-modal">
        <div class="modal-overlay" @click="closeModal"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h2>{{ metalInfo.name }} ({{ metalInfo.symbol }})</h2>
                <button @click="closeModal" class="close-btn">×</button>
            </div>
            
            <div class="modal-body">
                <!-- Основная информация -->
                <div class="info-section">
                    <h3>💰 Ценовая информация</h3>
                    <div class="price-grid">
                        <div class="price-item">
                            <div class="price-label">Цена за кг (USD)</div>
                            <div class="price-value usd">${{ formatNumber(metalInfo.usd_per_kg) }}</div>
                        </div>
                        <div class="price-item">
                            <div class="price-label">Цена за кг (CENTA)</div>
                            <div class="price-value centa">{{ formatNumber(metalInfo.centa_per_kg) }} CENTA</div>
                        </div>
                        <div class="price-item">
                            <div class="price-label">Цена за кг (nCENTA)</div>
                            <div class="price-value ncenta">{{ formatNumber(metalInfo.ncenta_per_kg) }} nCENTA</div>
                        </div>
                    </div>
                </div>

                <!-- Редкость и спавн -->
                <div class="info-section">
                    <h3>🎯 Редкость и появление</h3>
                    <div class="rarity-grid">
                        <div class="rarity-item">
                            <div class="rarity-label">Редкость</div>
                            <div class="rarity-value rarity-{{ metalInfo.rarity }}">
                                {{ getRarityText(metalInfo.rarity) }}
                            </div>
                        </div>
                        <div class="rarity-item">
                            <div class="rarity-label">Вес спавна</div>
                            <div class="rarity-value">{{ metalInfo.spawn_weight }}</div>
                        </div>
                        <div class="rarity-item">
                            <div class="rarity-label">Вероятность появления</div>
                            <div class="rarity-value">{{ calculateSpawnChance() }}%</div>
                        </div>
                    </div>
                </div>

                <!-- Выход при добыче -->
                <div class="info-section">
                    <h3>⛏️ Выход при добыче</h3>
                    <div class="yield-grid">
                        <div class="yield-item">
                            <div class="yield-label">Минимальный выход</div>
                            <div class="yield-value">{{ formatNumber(metalInfo.min_yield_kg) }} кг</div>
                        </div>
                        <div class="yield-item">
                            <div class="yield-label">Максимальный выход</div>
                            <div class="yield-value">{{ formatNumber(metalInfo.max_yield_kg) }} кг</div>
                        </div>
                        <div class="yield-item">
                            <div class="yield-label">Средний выход</div>
                            <div class="yield-value">{{ formatNumber((metalInfo.min_yield_kg + metalInfo.max_yield_kg) / 2) }} кг</div>
                        </div>
                    </div>
                </div>

                <!-- Описание -->
                <div class="info-section">
                    <h3>📝 Описание</h3>
                    <p class="description">{{ metalInfo.description }}</p>
                </div>

                <!-- Свойства -->
                <div v-if="metalInfo.properties && metalInfo.properties.length > 0" class="info-section">
                    <h3>🔬 Свойства</h3>
                    <div class="properties-list">
                        <span v-for="property in metalInfo.properties" :key="property" class="property-tag">
                            {{ property }}
                        </span>
                    </div>
                </div>

                <!-- Применение -->
                <div v-if="metalInfo.applications && metalInfo.applications.length > 0" class="info-section">
                    <h3>🚀 Применение</h3>
                    <div class="applications-list">
                        <span v-for="application in metalInfo.applications" :key="application" class="application-tag">
                            {{ application }}
                        </span>
                    </div>
                </div>

                <!-- Механика добычи -->
                <div class="info-section">
                    <h3>🎮 Механика добычи</h3>
                    <div class="mechanics-info">
                        <div class="mechanics-item">
                            <div class="mechanics-icon">🎯</div>
                            <div class="mechanics-content">
                                <div class="mechanics-title">Сложность добычи</div>
                                <div class="mechanics-desc">{{ getDifficultyText() }}</div>
                            </div>
                        </div>
                        <div class="mechanics-item">
                            <div class="mechanics-icon">⏰</div>
                            <div class="mechanics-content">
                                <div class="mechanics-title">Частота появления</div>
                                <div class="mechanics-desc">{{ getFrequencyText() }}</div>
                            </div>
                        </div>
                        <div class="mechanics-item">
                            <div class="mechanics-icon">💎</div>
                            <div class="mechanics-content">
                                <div class="mechanics-title">Ценность в игре</div>
                                <div class="mechanics-desc">{{ getValueText() }}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Стратегия -->
                <div class="info-section">
                    <h3>📊 Стратегия добычи</h3>
                    <div class="strategy-content">
                        <p>{{ getStrategyText() }}</p>
                        <div class="strategy-tips">
                            <h4>💡 Советы:</h4>
                            <ul>
                                <li v-for="tip in getStrategyTips()" :key="tip">{{ tip }}</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'MetalInfoModal',
    props: {
        isVisible: {
            type: Boolean,
            default: false
        },
        metalInfo: {
            type: Object,
            required: true
        }
    },
    methods: {
        closeModal() {
            this.$emit('close');
        },
        
        formatNumber(num) {
            if (num >= 1000000) {
                return (num / 1000000).toFixed(2) + 'M';
            } else if (num >= 1000) {
                return (num / 1000).toFixed(2) + 'K';
            } else if (num < 1) {
                return num.toFixed(6);
            } else {
                return num.toFixed(2);
            }
        },
        
        getRarityText(rarity) {
            const rarityMap = {
                'ultra_rare': 'Ультра редкий',
                'rare': 'Редкий',
                'common': 'Обычный',
                'very_common': 'Очень обычный'
            };
            return rarityMap[rarity] || rarity;
        },
        
        calculateSpawnChance() {
            // Простая формула для демонстрации
            const totalWeight = 1311; // Сумма всех весов
            const chance = (this.metalInfo.spawn_weight / totalWeight) * 100;
            return chance.toFixed(2);
        },
        
        getDifficultyText() {
            const difficultyMap = {
                'ultra_rare': 'Очень высокая - требует много времени и удачи',
                'rare': 'Высокая - нужно быть терпеливым',
                'common': 'Средняя - можно найти регулярно',
                'very_common': 'Низкая - встречается часто'
            };
            return difficultyMap[this.metalInfo.rarity] || 'Неизвестно';
        },
        
        getFrequencyText() {
            const frequencyMap = {
                'ultra_rare': 'Очень редко (раз в несколько дней)',
                'rare': 'Редко (несколько раз в день)',
                'common': 'Регулярно (каждый час)',
                'very_common': 'Часто (каждые несколько минут)'
            };
            return frequencyMap[this.metalInfo.rarity] || 'Неизвестно';
        },
        
        getValueText() {
            const valueMap = {
                'ultra_rare': 'Максимальная - основной источник CENTA',
                'rare': 'Высокая - значительный вклад в баланс',
                'common': 'Средняя - стабильный доход',
                'very_common': 'Низкая - базовая валюта'
            };
            return valueMap[this.metalInfo.rarity] || 'Неизвестно';
        },
        
        getStrategyText() {
            const strategyMap = {
                'ultra_rare': 'Фокусируйтесь на поиске золотых астероидов. Используйте автопилот для увеличения шансов. Помните, что золото появляется очень редко, но дает максимальную награду.',
                'rare': 'Балансируйте между серебром и другими металлами. Серебро появляется реже меди, но дает хорошую награду. Идеально для среднесрочной стратегии.',
                'common': 'Медь - ваш основной источник дохода. Появляется регулярно и дает стабильную прибыль. Отлично подходит для начинающих игроков.',
                'very_common': 'Железо - базовая валюта игры. Появляется очень часто, но дает небольшую награду. Используйте для ежедневных нужд и обучения.'
            };
            return strategyMap[this.metalInfo.rarity] || 'Стратегия не определена';
        },
        
        getStrategyTips() {
            const tipsMap = {
                'ultra_rare': [
                    'Играйте регулярно для увеличения шансов',
                    'Используйте автопилот для автоматического поиска',
                    'Фокусируйтесь на редких зонах астероидов',
                    'Не расстраивайтесь, если долго не находите'
                ],
                'rare': [
                    'Изучите паттерны появления серебра',
                    'Используйте бонусы эффективности',
                    'Играйте в пиковые часы активности',
                    'Сохраняйте серебро для важных покупок'
                ],
                'common': [
                    'Медь - ваш надежный источник дохода',
                    'Играйте регулярно для стабильного заработка',
                    'Используйте для покупки базовых улучшений',
                    'Отлично подходит для новичков'
                ],
                'very_common': [
                    'Железо идеально для ежедневных нужд',
                    'Не накапливайте слишком много',
                    'Используйте для базовых улучшений',
                    'Хорошо для понимания механики игры'
                ]
            };
            return tipsMap[this.metalInfo.rarity] || ['Изучите игру и найдите свою стратегию'];
        }
    }
};
</script>

<style scoped>
.metal-info-modal {
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
    margin-bottom: 30px;
}

.info-section h3 {
    color: #4CAF50;
    font-size: 20px;
    margin-bottom: 20px;
    border-bottom: 2px solid #4CAF50;
    padding-bottom: 10px;
}

.price-grid, .rarity-grid, .yield-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
    margin-bottom: 20px;
}

.price-item, .rarity-item, .yield-item {
    background: rgba(255, 255, 255, 0.1);
    padding: 20px;
    border-radius: 12px;
    text-align: center;
    border: 1px solid rgba(255, 255, 255, 0.2);
}

.price-label, .rarity-label, .yield-label {
    color: #ccc;
    font-size: 14px;
    margin-bottom: 8px;
}

.price-value, .rarity-value, .yield-value {
    font-size: 18px;
    font-weight: bold;
    color: #fff;
}

.price-value.usd { color: #FFD700; }
.price-value.centa { color: #4CAF50; }
.price-value.ncenta { color: #FF6B6B; }

.rarity-ultra_rare { color: #FFD700; }
.rarity-rare { color: #C0C0C0; }
.rarity-common { color: #B87333; }
.rarity-very_common { color: #A19D94; }

.description {
    color: #ccc;
    font-size: 16px;
    line-height: 1.6;
    margin: 0;
}

.properties-list, .applications-list {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}

.property-tag, .application-tag {
    background: rgba(76, 175, 80, 0.2);
    color: #4CAF50;
    padding: 8px 16px;
    border-radius: 20px;
    border: 1px solid rgba(76, 175, 80, 0.3);
    font-size: 14px;
}

.mechanics-info {
    display: grid;
    gap: 20px;
}

.mechanics-item {
    display: flex;
    gap: 16px;
    background: rgba(255, 255, 255, 0.05);
    padding: 20px;
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.mechanics-icon {
    font-size: 24px;
    min-width: 40px;
}

.mechanics-title {
    font-size: 16px;
    font-weight: bold;
    color: #4CAF50;
    margin-bottom: 8px;
}

.mechanics-desc {
    color: #ccc;
    font-size: 14px;
    line-height: 1.5;
}

.strategy-content p {
    color: #ccc;
    font-size: 16px;
    line-height: 1.6;
    margin-bottom: 20px;
}

.strategy-tips h4 {
    color: #4CAF50;
    font-size: 18px;
    margin-bottom: 15px;
}

.strategy-tips ul {
    color: #ccc;
    font-size: 14px;
    line-height: 1.6;
    padding-left: 20px;
}

.strategy-tips li {
    margin-bottom: 8px;
}

/* Адаптивность для мобильных устройств */
@media (max-width: 768px) {
    .modal-content {
        max-width: 98vw;
        width: 98vw;
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
    
    .price-grid, .rarity-grid, .yield-grid {
        grid-template-columns: 1fr;
        gap: 15px;
    }
    
    .price-item, .rarity-item, .yield-item {
        padding: 15px;
    }
    
    .mechanics-item {
        flex-direction: column;
        text-align: center;
        gap: 10px;
    }
}
</style>
