<template>
    <div class="enhanced-cart">
        <!-- Кнопка корзины с счетчиком -->
        <div class="cart-button" @click="toggleCart" :class="{ 'cart-open': isCartOpen }">
            <div class="cart-icon">
                🛒
                <span v-if="cartItems.length > 0" class="cart-count">{{ cartItems.length }}</span>
            </div>
            <div class="cart-total-price">{{ formatPrice(cartTotal) }}</div>
        </div>

        <!-- Выпадающая корзина -->
        <div v-if="isCartOpen" class="cart-dropdown">
            <div class="cart-header">
                <h3>🛒 Корзина покупок</h3>
                <button @click="toggleCart" class="close-cart-btn">×</button>
            </div>

            <!-- Список товаров -->
            <div class="cart-items-container">
                <div v-if="cartItems.length === 0" class="empty-cart">
                    <div class="empty-cart-icon">📦</div>
                    <p>Корзина пуста</p>
                    <p class="empty-cart-hint">Добавьте товары из магазина</p>
                </div>

                <transition-group name="cart-item" tag="div" class="cart-items">
                    <div v-for="item in cartItems" :key="item.id" class="cart-item">
                        <div class="item-info">
                            <div class="item-name">{{ item.name }}</div>
                            <div class="item-type">{{ getItemTypeText(item.type) }}</div>
                        </div>
                        <div class="item-price">{{ formatPrice(item.price) }}</div>
                        <button @click="removeFromCart(item)" class="remove-item-btn" 
                                :title="`Удалить ${item.name}`">
                            ×
                        </button>
                    </div>
                </transition-group>
            </div>

            <!-- Итого и действия -->
            <div v-if="cartItems.length > 0" class="cart-footer">
                <div class="cart-total">
                    <span class="total-label">Итого:</span>
                    <span class="total-amount">{{ formatPrice(cartTotal) }}</span>
                </div>
                
                <div class="cart-actions">
                    <button @click="clearCart" class="clear-cart-btn">
                        🗑️ Очистить
                    </button>
                    <button @click="proceedToCheckout" class="checkout-btn">
                        💳 Оформить заказ
                    </button>
                </div>
            </div>
        </div>

        <!-- Анимация добавления в корзину -->
        <div v-for="animation in addAnimations" :key="animation.id" 
             class="add-to-cart-animation"
             :style="animation.style">
            <div class="animation-icon">✅</div>
            <div class="animation-text">Добавлено!</div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'EnhancedCart',
    props: {
        cartItems: {
            type: Array,
            default: () => []
        },
        cartTotal: {
            type: Number,
            default: 0
        }
    },
    data() {
        return {
            isCartOpen: false,
            addAnimations: [],
            animationCounter: 0
        };
    },
    methods: {
        toggleCart() {
            this.isCartOpen = !this.isCartOpen;
        },

        removeFromCart(item) {
            this.$emit('remove-from-cart', item);
            this.showRemoveAnimation(item);
        },

        clearCart() {
            this.$emit('clear-cart');
            this.showClearAnimation();
        },

        proceedToCheckout() {
            this.$emit('proceed-to-checkout');
            this.isCartOpen = false;
        },

        formatPrice(price) {
            if (price >= 1000) {
                return (price / 1000).toFixed(1) + 'K TON';
            }
            return price.toFixed(2) + ' TON';
        },

        getItemTypeText(type) {
            const typeMap = {
                'autopilot': '🤖 Автопилот',
                'technology': '🔬 Технология',
                'knowledge': '📚 Знания',
                'space_product': '🚀 Космический продукт'
            };
            return typeMap[type] || type;
        },

        showAddAnimation(item) {
            const animationId = ++this.animationCounter;
            const animation = {
                id: animationId,
                style: {
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%) scale(0)',
                    opacity: 0
                }
            };

            this.addAnimations.push(animation);

            // Анимация появления
            setTimeout(() => {
                animation.style = {
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%) scale(1)',
                    opacity: 1
                };
            }, 50);

            // Анимация исчезновения
            setTimeout(() => {
                animation.style = {
                    left: '50%',
                    top: '20%',
                    transform: 'translate(-50%, -50%) scale(0.8)',
                    opacity: 0
                };
            }, 1000);

            // Удаление анимации
            setTimeout(() => {
                this.addAnimations = this.addAnimations.filter(a => a.id !== animationId);
            }, 1500);
        },

        showRemoveAnimation(item) {
            // Анимация удаления через CSS transition
        },

        showClearAnimation() {
            // Анимация очистки корзины
            this.isCartOpen = false;
            setTimeout(() => {
                this.isCartOpen = true;
            }, 100);
        }
    },

    watch: {
        cartItems: {
            handler(newItems, oldItems) {
                // Если добавили новый товар, показываем анимацию
                if (newItems.length > oldItems.length) {
                    const newItem = newItems.find(item => 
                        !oldItems.find(oldItem => oldItem.id === item.id)
                    );
                    if (newItem) {
                        this.showAddAnimation(newItem);
                    }
                }
            },
            deep: true
        }
    }
};
</script>

<style scoped>
.enhanced-cart {
    position: relative;
    z-index: 1000;
}

.cart-button {
    display: flex;
    align-items: center;
    gap: 10px;
    background: linear-gradient(135deg, #4CAF50, #45a049);
    color: white;
    padding: 12px 20px;
    border-radius: 25px;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3);
    border: none;
    font-size: 16px;
    font-weight: bold;
}

.cart-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(76, 175, 80, 0.4);
}

.cart-button:active {
    transform: translateY(0);
}

.cart-icon {
    position: relative;
    font-size: 20px;
}

.cart-count {
    position: absolute;
    top: -8px;
    right: -8px;
    background: #FF6B6B;
    color: white;
    font-size: 12px;
    font-weight: bold;
    padding: 2px 6px;
    border-radius: 10px;
    min-width: 18px;
    text-align: center;
    animation: bounce 0.6s ease-in-out;
}

.cart-total-price {
    font-size: 14px;
    opacity: 0.9;
}

.cart-dropdown {
    position: absolute;
    top: 100%;
    right: 0;
    width: 350px;
    max-width: 90vw;
    background: linear-gradient(135deg, #1a1a1a, #2d2d2d);
    border-radius: 15px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    border: 1px solid #333;
    margin-top: 10px;
    animation: slideDown 0.3s ease-out;
    z-index: 1001;
}

.cart-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.cart-header h3 {
    margin: 0;
    color: #4CAF50;
    font-size: 18px;
}

.close-cart-btn {
    background: rgba(255, 255, 255, 0.1);
    border: none;
    color: white;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    cursor: pointer;
    font-size: 18px;
    transition: all 0.3s ease;
}

.close-cart-btn:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.1);
}

.cart-items-container {
    max-height: 300px;
    overflow-y: auto;
    padding: 20px;
}

.empty-cart {
    text-align: center;
    padding: 40px 20px;
    color: #ccc;
}

.empty-cart-icon {
    font-size: 48px;
    margin-bottom: 15px;
    opacity: 0.5;
}

.empty-cart-hint {
    font-size: 14px;
    opacity: 0.7;
    margin-top: 10px;
}

.cart-items {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.cart-item {
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 15px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 10px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    transition: all 0.3s ease;
}

.cart-item:hover {
    background: rgba(255, 255, 255, 0.08);
    transform: translateX(5px);
}

.item-info {
    flex: 1;
    min-width: 0;
}

.item-name {
    color: white;
    font-weight: bold;
    font-size: 14px;
    margin-bottom: 5px;
    word-wrap: break-word;
}

.item-type {
    color: #4CAF50;
    font-size: 12px;
    opacity: 0.8;
}

.item-price {
    color: #FFD700;
    font-weight: bold;
    font-size: 16px;
    white-space: nowrap;
}

.remove-item-btn {
    background: rgba(255, 107, 107, 0.2);
    border: none;
    color: #FF6B6B;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    cursor: pointer;
    font-size: 18px;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
}

.remove-item-btn:hover {
    background: rgba(255, 107, 107, 0.3);
    transform: scale(1.1);
}

.cart-footer {
    padding: 20px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.2);
    border-radius: 0 0 15px 15px;
}

.cart-total {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding: 15px;
    background: rgba(76, 175, 80, 0.1);
    border-radius: 10px;
    border: 1px solid rgba(76, 175, 80, 0.3);
}

.total-label {
    color: #ccc;
    font-size: 16px;
}

.total-amount {
    color: #4CAF50;
    font-size: 20px;
    font-weight: bold;
}

.cart-actions {
    display: flex;
    gap: 10px;
}

.clear-cart-btn, .checkout-btn {
    flex: 1;
    padding: 12px 20px;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
}

.clear-cart-btn {
    background: rgba(255, 107, 107, 0.2);
    color: #FF6B6B;
    border: 1px solid rgba(255, 107, 107, 0.3);
}

.clear-cart-btn:hover {
    background: rgba(255, 107, 107, 0.3);
    transform: translateY(-2px);
}

.checkout-btn {
    background: linear-gradient(135deg, #4CAF50, #45a049);
    color: white;
}

.checkout-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(76, 175, 80, 0.4);
}

/* Анимации */
.add-to-cart-animation {
    position: fixed;
    pointer-events: none;
    z-index: 10000;
    transition: all 0.5s ease-out;
}

.animation-icon {
    font-size: 32px;
    text-align: center;
    margin-bottom: 5px;
}

.animation-text {
    color: #4CAF50;
    font-weight: bold;
    font-size: 14px;
    text-align: center;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
}

/* Анимации для элементов корзины */
.cart-item-enter-active, .cart-item-leave-active {
    transition: all 0.3s ease;
}

.cart-item-enter-from {
    opacity: 0;
    transform: translateX(-30px);
}

.cart-item-leave-to {
    opacity: 0;
    transform: translateX(30px);
}

.cart-item-move {
    transition: transform 0.3s ease;
}

/* Анимации появления/исчезновения */
@keyframes slideDown {
    from {
        opacity: 0;
        transform: translateY(-20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes bounce {
    0%, 20%, 50%, 80%, 100% {
        transform: scale(1);
    }
    40% {
        transform: scale(1.2);
    }
    60% {
        transform: scale(1.1);
    }
}

/* Адаптивность для мобильных устройств */
@media (max-width: 768px) {
    .cart-dropdown {
        width: 90vw;
        right: -45vw;
        margin-top: 15px;
    }
    
    .cart-button {
        padding: 10px 16px;
        font-size: 14px;
    }
    
    .cart-total-price {
        font-size: 12px;
    }
    
    .cart-header {
        padding: 15px;
    }
    
    .cart-header h3 {
        font-size: 16px;
    }
    
    .cart-items-container {
        padding: 15px;
        max-height: 250px;
    }
    
    .cart-item {
        padding: 12px;
        gap: 10px;
    }
    
    .item-name {
        font-size: 13px;
    }
    
    .item-price {
        font-size: 14px;
    }
    
    .cart-footer {
        padding: 15px;
    }
    
    .cart-actions {
        flex-direction: column;
        gap: 8px;
    }
    
    .clear-cart-btn, .checkout-btn {
        padding: 10px 16px;
        font-size: 13px;
    }
}
</style>
