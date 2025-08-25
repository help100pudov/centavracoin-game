# 🎮 CentavraCoin Game - Technical Documentation

## 📋 **Table of Contents**

- [Game Overview](#game-overview)
- [Core Mechanics](#core-mechanics)
- [Resource System](#resource-system)
- [Autopilot System](#autopilot-system)
- [Technical Architecture](#technical-architecture)
- [API Integration](#api-integration)
- [Development Guide](#development-guide)

## 🎯 **Game Overview**

CentavraCoin Game is a space shooter with resource mining mechanics built on Vue.js 3 and TON blockchain. Players control a spaceship, destroy asteroids to collect metals, and can activate autopilot for automated gameplay.

### **Key Features**

- **Space Shooter Gameplay** - Classic arcade-style combat
- **Resource Mining** - Collect gold, silver, copper, and steel from asteroids
- **Autopilot System** - Automated gameplay with different efficiency plans
- **TON Integration** - Blockchain-based payments and rewards
- **Telegram WebApp** - Seamless authentication and social features

## 🎮 **Core Mechanics**

### **Ship Control**

- **Movement**: Mouse/touch control with smooth following
- **Weapon System**: 10 weapon levels with increasing firepower
- **Health System**: 10 HP with visual health bar
- **Collision Detection**: Circular hitboxes for precise gameplay

### **Combat System**

- **Player Bullets**: Automatic firing with configurable intervals
- **Enemy AI**: 5 enemy types with patrol and shooting behavior
- **Damage System**: Weapon-based damage calculation
- **Enemy Spawning**: Dynamic spawn intervals (5-10 seconds)

### **Resource Collection**

- **Asteroid Types**: 4 metal types with different rarities
- **Collection Methods**: Direct collision or bullet destruction
- **Token System**: Each asteroid has unique blockchain token
- **Real-time Updates**: Resources update immediately on collection

## 💎 **Resource System**

### **Metal Types & Rarity**

| Metal  | Symbol | Rarity      | Spawn Weight | Price (nCENTA/kg) | Color   |
| ------ | ------ | ----------- | ------------ | ----------------- | ------- |
| Gold   | Au     | Ultra Rare  | 1            | 108,190,000,000   | #FFD700 |
| Silver | Ag     | Rare        | 10           | 1,253,000,000     | #C0C0C0 |
| Copper | Cu     | Common      | 200          | 9,812,000         | #B87333 |
| Steel  | Fe\*   | Very Common | 1000         | 438,000           | #A19D94 |

### **Spawn Distribution Algorithm**

```javascript
// Inverse Price Power Law Formula
p_i = w_i / (price_usd_i ^ β) / Sum_j(w_j / (price_usd_j ^ β))

// Where:
// w_i = spawn_weight_base for metal i
// price_usd_i = USD price per kg for metal i
// β = 0.9 (balanced distribution parameter)
```

### **Asteroid Yield System**

Each asteroid provides realistic metal yields using log-normal distribution:

```javascript
const yieldParams = {
  gold: { mu: 2.0, sigma: 0.6, min: 0.01, max: 5 },
  silver: { mu: 3.0, sigma: 0.7, min: 0.05, max: 20 },
  copper: { mu: 5.0, sigma: 0.9, min: 1, max: 300 },
  steel: { mu: 6.0, sigma: 1.0, min: 5, max: 1000 },
}
```

### **Pity System**

- **Window**: Every 200 spawn events
- **Guarantee**: At least one gold or silver drop
- **Progressive**: Chances increase with each failed attempt

## 🤖 **Autopilot System**

### **Plans & Pricing**

| Plan       | Duration | Price (TON) | Bonus | Popular |
| ---------- | -------- | ----------- | ----- | ------- |
| 1 Day      | 24 hours | 0.1         | 1x    | No      |
| 1 Month    | 30 days  | 1.0         | 2x    | **Yes** |
| Until 2026 | ~1 year  | 2.0         | 3x    | No      |
| Super      | Lifetime | 5.0         | 5x    | No      |

### **Autopilot Features**

- **Energy Management**: Battery guard (20%), thermal protection (44°C)
- **Daily Limits**: Maximum 6 hours per day
- **Route Optimization**: Avoids PvP zones, prefers rich fields
- **AFK Penalty**: 0.6x multiplier for automated farming

### **AI Behavior**

```javascript
const autopilotLogic = {
  priority1: 'Dodge enemies and threats',
  priority2: 'Collect valuable meteors',
  priority3: 'Move to best targets',
  priority4: 'Auto-shoot at meteors',
  priority5: 'Collect nearby resources',
}
```

## 🏗️ **Technical Architecture**

### **Frontend Stack**

- **Framework**: Vue.js 3.x with Composition API
- **Build Tool**: Vite for fast development
- **State Management**: Vuex store
- **Styling**: Scoped CSS with responsive design

### **Game Engine**

- **Canvas**: HTML5 Canvas for rendering
- **Game Loop**: RequestAnimationFrame for 60 FPS
- **Physics**: Custom collision detection system
- **Audio**: Web Audio API for sound effects

### **Blockchain Integration**

- **Wallet**: TON Connect for wallet management
- **Transactions**: TON blockchain for payments
- **Tokens**: Jetton standard for CENTA tokens
- **Verification**: Backend API for payment verification

## 🔌 **API Integration**

### **Required Endpoints**

#### **Game Session Management**

```http
POST /game
{
  "act": "token",
  "key": "metal_type"
}

POST /game
{
  "act": "check",
  "key": "token_id"
}
```

#### **Wallet Management**

```http
POST /api/save-wallet-address
{
  "telegramId": "user_id",
  "walletAddress": "TON_wallet_address"
}

POST /api/check-wallet-owner
{
  "walletAddress": "TON_wallet_address",
  "telegramId": "user_id"
}
```

#### **Payment Verification**

```http
POST /api/verify-ton-payment
{
  "txHash": "transaction_hash",
  "userAddress": "sender_address",
  "amount": "TON_amount",
  "product": "autopilot_plan_id",
  "centaAmount": "CENTA_reward",
  "telegramId": "user_id"
}
```

### **Environment Variables**

```bash
# TON Blockchain
VUE_APP_TON_NETWORK=mainnet
VUE_APP_HOT_WALLET_ADDRESS=your_hot_wallet_address
VUE_APP_CENTA_JETTON_ADDRESS=your_jetton_address

# Autopilot Configuration
VUE_APP_AUTOPILOT_BASE_CENTA=100
VUE_APP_AUTOPILOT_DAY_PRICE=0.1
VUE_APP_AUTOPILOT_MONTH_PRICE=1.0
VUE_APP_AUTOPILOT_YEAR_PRICE=2.0
VUE_APP_AUTOPILOT_LIFETIME_PRICE=5.0
```

## 🚀 **Development Guide**

### **Setup Development Environment**

```bash
# Clone repository
git clone https://github.com/help100pudov/centavracoin-game.git
cd centavracoin-game

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### **File Structure**

```
src/
├── views/
│   └── game.vue          # Main game component
├── components/            # Reusable UI components
├── store/                # Vuex state management
├── mixins/               # Shared functionality
├── assets/               # Images, sounds, fonts
└── utils/                # Helper functions
```

### **Key Components**

#### **Game.vue**

- Main game logic and rendering
- Canvas management and game loop
- Resource collection and combat
- Autopilot system integration

#### **Meteor Class**

- Asteroid behavior and physics
- Resource type and value
- Collision detection
- Token management

#### **Enemy Class**

- Enemy AI and movement
- Shooting patterns
- Health and damage system
- Spawn management

### **Adding New Features**

#### **New Metal Type**

1. Add to `meteorTypes` array
2. Update `spawn_distribution` weights
3. Add image asset
4. Update resource display

#### **New Autopilot Plan**

1. Add to `autopilotPlans` array
2. Update pricing and bonuses
3. Add UI elements
4. Update payment logic

#### **New Game Mode**

1. Create new component
2. Add routing
3. Update navigation
4. Integrate with store

## 🧪 **Testing**

### **Unit Tests**

```bash
# Run tests
npm run test

# Test coverage
npm run test:coverage
```

### **Manual Testing Checklist**

- [ ] Ship movement and controls
- [ ] Asteroid spawning and collection
- [ ] Combat system (bullets, enemies)
- [ ] Resource counting and display
- [ ] Autopilot activation and behavior
- [ ] Wallet connection and payments
- [ ] Responsive design on mobile
- [ ] Performance optimization

### **Performance Metrics**

- **Target FPS**: 60 FPS
- **Memory Usage**: < 100MB
- **Load Time**: < 3 seconds
- **Responsiveness**: < 16ms input lag

## 🔒 **Security Considerations**

### **Anti-Cheat Measures**

- **Biometric Motion**: Natural player behavior detection
- **Input Entropy**: Randomness verification
- **Hardware Fingerprinting**: Multi-account prevention
- **Rate Limiting**: API call restrictions

### **Data Protection**

- **Telegram OAuth**: Secure authentication
- **Wallet Verification**: Ownership confirmation
- **Transaction Validation**: Backend verification
- **Session Management**: Secure token handling

## 📱 **Mobile Optimization**

### **Touch Controls**

- Touch event handling for ship movement
- Responsive UI elements
- Mobile-friendly button sizes
- Gesture support for autopilot

### **Performance**

- Canvas scaling for different screen sizes
- Asset optimization for mobile devices
- Battery usage optimization
- Memory management for long sessions

## 🔄 **Deployment**

### **Production Build**

```bash
# Build optimized version
npm run build

# Deploy to server
npm run deploy
```

### **Environment Setup**

1. Configure environment variables
2. Set up TON wallet addresses
3. Configure API endpoints
4. Set up monitoring and logging

### **Monitoring**

- Game performance metrics
- User engagement analytics
- Error tracking and reporting
- Resource usage monitoring

## 📚 **Resources**

### **Documentation**

- [Vue.js 3 Guide](https://vuejs.org/guide/)
- [TON Documentation](https://ton.org/docs/)
- [Telegram WebApp API](https://core.telegram.org/bots/webapps)
- [HTML5 Canvas Tutorial](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)

### **Community**

- [Telegram Group](https://t.me/centavracoin)
- [Discord Server](https://discord.gg/centavracoin)
- [GitHub Issues](https://github.com/help100pudov/centavracoin-game/issues)

---

**Last Updated**: January 2025  
**Version**: 1.0.0  
**Maintainer**: CentavraCoin Development Team
