# 🪙 CentavraCoin Game - Web3 GameFi Revolution

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Vue.js](https://img.shields.io/badge/Vue.js-3.x-4FC08D.svg)](https://vuejs.org/)
[![TON](https://img.shields.io/badge/TON-Blockchain-0088CC.svg)](https://ton.org/)
[![Telegram](https://img.shields.io/badge/Telegram-MiniApp-26A5E4.svg)](https://core.telegram.org/bots/webapps)

> **The First Telegram Mini App with Real Economic Value & Sustainable Tokenomics**

## 🚀 **Project Overview**

CentavraCoin Game is a revolutionary Web3 GameFi application built on Telegram's platform, combining **play-to-earn mechanics** with **sustainable tokenomics** inspired by successful DeFi protocols. Our mission is to democratize access to blockchain gaming while creating real economic value for users.

### 🎯 **Key Features**

- **🚁 Autopilot Mining System** - Automated resource collection with strategic gameplay
- **💎 21 Million Total Supply** - Scarcity-driven economics like Bitcoin
- **🔒 Telegram WebApp Security** - Built-in authentication and secure transactions
- **🌐 Multi-language Support** - 40+ languages for global accessibility
- **⚡ TON Blockchain** - Fast, scalable, and cost-effective transactions

## 🏗️ **Architecture & Technology**

### **Frontend Stack**

```bash
├── Vue.js 3.x          # Progressive JavaScript framework
├── Vite                # Next-generation build tool
├── Vuex                # State management
├── Vue Router          # Client-side routing
└── Vue I18n            # Internationalization
```

### **Blockchain Integration**

```bash
├── TON Blockchain      # High-performance blockchain
├── TonConnect          # Wallet integration
├── Jetton Standard     # Token implementation
└── Smart Contracts     # Automated game logic
```

### **Security Features**

- **Telegram WebApp Authentication** - No additional passwords needed
- **TON Wallet Integration** - Secure transaction signing
- **Rate Limiting** - Protection against abuse
- **Input Validation** - XSS and injection prevention

## 🎮 **Game Mechanics**

### **Autopilot Mining System**

The core innovation of CentavraCoin Game is the **Autopilot Mining System**, which represents a paradigm shift in GameFi:

#### **Why Autopilot?**

1. **Accessibility** - Users can earn while sleeping or working
2. **Strategic Depth** - Multiple autopilot plans with different efficiency bonuses
3. **Economic Balance** - Prevents inflation through controlled mining rates
4. **User Retention** - Continuous engagement without constant attention

#### **Autopilot Plans**

```javascript
const autopilotPlans = [
  { name: '1 Day Plan', price: 0.1, bonus: 1x, duration: '24h' },
  { name: '1 Month Plan', price: 1.0, bonus: 2x, duration: '30d' },
  { name: 'Until 2026', price: 2.0, bonus: 3x, duration: 'Lifetime' },
  { name: 'Super Autopilot', price: 5.0, bonus: 5x, duration: 'Lifetime' }
];
```

### **Resource Mining System**

Players mine four types of metals, each with different values and strategic importance:

#### **Metal Mining Economics**

```javascript
const metalPrices = {
  gold: 108190, // 108,190 nCENTA per kg (0.00010819 CENTA)
  silver: 1253, // 1,253 nCENTA per kg (0.000001253 CENTA)
  copper: 9.812, // 9.812 nCENTA per kg (0.000000009812 CENTA)
  steel: 0.438, // 0.438 nCENTA per kg (0.000000000438 CENTA)
}

// Price in CENTA (1 CENTA = 1 USDT)
const centaPrices = {
  gold: 0.00010819, // 1 kg Gold = 0.00010819 CENTA
  silver: 0.000001253, // 1 kg Silver = 0.000001253 CENTA
  copper: 0.000000009812, // 1 kg Copper = 0.000000009812 CENTA
  steel: 0.000000000438, // 1 kg Steel = 0.000000000438 CENTA
}
```

#### **Metal Types & Spawn Distribution**

##### **Gold (Au) - Most Valuable**

- **Price**: 108,190 nCENTA per kg (0.00010819 CENTA)
- **Spawn Weight**: 1 (rare)
- **Yield Range**: 0.01 - 5 kg per asteroid
- **Strategy**: Focus mining for maximum returns

##### **Silver (Ag) - High Value**

- **Price**: 1,253 nCENTA per kg (0.000001253 CENTA)
- **Spawn Weight**: 10 (uncommon)
- **Yield Range**: 0.05 - 20 kg per asteroid
- **Strategy**: Balanced mining approach

##### **Copper (Cu) - Medium Value**

- **Price**: 9.812 nCENTA per kg (0.000000009812 CENTA)
- **Spawn Weight**: 200 (common)
- **Yield Range**: 1 - 300 kg per asteroid
- **Strategy**: Reliable income source

##### **Steel (Fe\*) - Base Value**

- **Price**: 0.438 nCENTA per kg (0.000000000438 CENTA)
- **Spawn Weight**: 1000 (very common)
- **Yield Range**: 5 - 1000 kg per asteroid
- **Strategy**: Foundation for beginners

#### **Asteroid Yield System**

Each asteroid provides realistic metal yields:

- **Gold**: 0.01 - 5 kg (log-normal distribution)
- **Silver**: 0.05 - 20 kg (log-normal distribution)
- **Copper**: 1 - 300 kg (log-normal distribution)
- **Steel**: 5 - 1000 kg (log-normal distribution)

**Reward Formula**: `reward_centa = yield_kg × price_centa_per_kg × reward_multiplier(player_state)`

#### **Why Such Precise Pricing?**

1. **Real Market Prices** - Based on actual metal market values from TradingEconomics, Kitco
2. **Oracle Integration** - Live price updates every hour with failover protection
3. **Scarcity Control** - Prevents rapid token inflation
4. **Long-term Sustainability** - Mining remains valuable for years
5. **Economic Balance** - Maintains token value over time
6. **User Engagement** - Encourages strategic gameplay

## 💰 **Tokenomics & Economics**

### **Token Supply Distribution**

```
Total Supply: 21,000,000 CENTA

Distribution:
├── Core Contributors: 4,884,600 CENTA (23.3%)
├── Treasury DAO:     4,901,400 CENTA (23.3%)
├── User Airdrop:     3,213,000 CENTA (15.3%)
├── Partnerships:     1,176,000 CENTA (5.6%)
└── Investors:        6,825,000 CENTA (32.5%)
```

### **Mining Distribution Curve**

Our mining system follows a **bell-shaped distribution curve** that ensures sustainable token economics:

- **Early Phase (1-3)**: Low mining rates to prevent inflation
- **Peak Phase (4-7)**: Optimal mining rates for user engagement
- **Late Phase (8-10)**: Decreasing rates to maintain scarcity

**Peak Mining Rate**: ~1,450,000 CENTA at period 6

### **Spawn Distribution System**

Advanced spawn mechanics based on inverse price power law:

- **Formula**: `p_i = (w_i / (price_usd_i ^ β)) / Sum_j (w_j / (price_usd_j ^ β))`
- **Beta Parameter**: 0.9 (balanced distribution)
- **Session Drift**: Dynamic adjustment every 10 minutes
- **Rare Pity**: Guaranteed gold/silver every 200 events
- **Daily Caps**: Gold max 15%, Silver max 25% of spawns

### **Reward System & Balance**

Our sophisticated reward system ensures fair and sustainable economics:

- **Daily Soft Cap**: 50 CENTA per user
- **Diminishing Returns**: After 30 CENTA, rewards decrease by 50%
- **Device Fairness**:
  - Phone: 1.0x multiplier
  - PC CPU: 1.05x multiplier
  - GPU: 1.10x multiplier (capped at 1.10x)
- **Skill Bonuses**: Hit accuracy rewards up to 1.15x
- **Streak Bonuses**: Up to 1.3x for consistent play

### **Token Price Stability**

**1 CENTA = 1 USDT** - Simple and stable pricing model:

- **No Complex Calculations** - Easy to understand value
- **USDT Peg** - Stable against market volatility
- **Micro-Pricing** - Metal prices in nCENTA (10⁻⁹ precision)
- **Real Market Integration** - Live oracle updates every hour

### **Economic Sustainability**

Our tokenomics are designed to:

- **Prevent Hyperinflation** - Controlled mining rates
- **Maintain Value** - Scarcity-driven economics
- **Encourage Long-term Holding** - Gradual token release
- **Balance Supply & Demand** - Market-driven adjustments

## 🔒 **Security & Trust**

### **Telegram WebApp Security**

- **Built-in Authentication** - No additional accounts needed
- **Secure Transactions** - TON blockchain security
- **Data Privacy** - Minimal data collection
- **Regular Audits** - Code security reviews

### **Blockchain Security**

- **TON Network** - Battle-tested blockchain
- **Smart Contract Audits** - Professional security reviews
- **Multi-signature Wallets** - Enhanced security for large transactions
- **Emergency Pause** - Ability to halt operations if needed

## 📱 **User Experience**

### **Why Telegram?**

1. **Global Reach** - 800+ million active users
2. **Built-in Security** - Telegram's proven security model
3. **Easy Onboarding** - No additional app downloads
4. **Cross-Platform** - Works on all devices
5. **Social Features** - Built-in sharing and community building

### **Accessibility Features**

- **40+ Languages** - Global accessibility
- **Mobile-First Design** - Optimized for mobile devices
- **Offline Capabilities** - Basic functionality without internet
- **Progressive Web App** - Install as native app

### **Why Safe, Modern & In-Demand**

#### **Security Features**

- **Telegram WebApp** - Built-in security from Telegram
- **TON Blockchain** - Battle-tested, high-performance network
- **Multi-Signature Wallets** - Enhanced transaction security
- **Regular Audits** - Professional security reviews
- **Anti-Cheat System** - Advanced bot detection and prevention

#### **Modern Technology Stack**

- **Vue.js 3.x** - Latest progressive framework
- **Vite Build Tool** - Ultra-fast development and build
- **TypeScript Support** - Type-safe development
- **PWA Capabilities** - Native app experience
- **Responsive Design** - Works on all devices

#### **Market Demand Drivers**

- **GameFi Growth** - 300% annual market expansion
- **Crypto Adoption** - Increasing mainstream acceptance
- **Mobile Gaming** - 2.5+ billion mobile gamers
- **Social Gaming** - Growing demand for community features
- **Sustainable Economics** - Unlike most speculative projects

## 🚀 **Development & Deployment**

### **Getting Started**

```bash
# Clone the repository
git clone https://github.com/help100pudov/centavracoin-game.git
cd centavracoin-game

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### **Environment Variables**

```bash
# TON Blockchain
VUE_APP_TON_NETWORK=mainnet
VUE_APP_HOT_WALLET_ADDRESS=your_wallet_address
VUE_APP_CENTA_JETTON_ADDRESS=your_jetton_address

# Game Configuration
VUE_APP_AUTOPILOT_BASE_CENTA=100
VUE_APP_AUTOPILOT_DAY_PRICE=0.1
VUE_APP_AUTOPILOT_MONTH_PRICE=1.0
```

### **Project Structure**

```
src/
├── views/           # Game screens and components
├── components/      # Reusable UI components
├── assets/          # Images, sounds, fonts
├── lang/            # Internationalization files
├── store/           # Vuex state management
├── router/          # Application routing
└── utils/           # Helper functions
```

## 📊 **Market Analysis & Demand**

### **Why This Project Will Succeed**

1. **Market Timing** - GameFi market growing 300% annually
2. **Telegram Integration** - Access to massive user base
3. **Sustainable Economics** - Unlike most GameFi projects

### **Why Space Mining Makes Sense**

#### **Gaming Innovation**

- **Unique Gameplay** - Space shooter + resource mining
- **Strategic Depth** - Multiple autopilot plans with different efficiency
- **Skill-Based Rewards** - Hit accuracy affects mining bonuses
- **Social Features** - Friends system and referral bonuses

#### **Economic Justification**

- **Real Computational Work** - PoUW provides actual value
- **Device Fairness** - Balanced rewards across all platforms
- **Energy Efficiency** - Smart autopilot with battery/thermal protection
- **Scalable Infrastructure** - Can handle millions of concurrent users

#### **Market Demand**

- **3+ Billion Gamers** - Massive global audience
- **Crypto Integration** - Growing demand for GameFi
- **Telegram Ecosystem** - 800M+ potential users
- **Sustainable Model** - Unlike pump-and-dump schemes

4. **Technical Innovation** - Autopilot mining system
5. **Community Focus** - User-driven development

### **Target Market**

- **Gamers** - 3+ billion global gaming population
- **Crypto Enthusiasts** - Growing DeFi community
- **Telegram Users** - 800+ million active users
- **Investors** - Seeking sustainable GameFi projects

## 🎯 **Roadmap & Milestones**

### **Phase 1: Foundation (Q1 2025)**

- [x] Core game mechanics
- [x] TON blockchain integration
- [x] Basic autopilot system
- [x] Multi-language support

### **Phase 2: Growth (Q2 2025)**

- [ ] Advanced autopilot algorithms
- [ ] Governance system
- [ ] Cross-chain bridges
- [ ] Mobile app optimization

### **Phase 3: Expansion (Q3 2025)**

- [ ] Additional game modes
- [ ] NFT integration
- [ ] DeFi partnerships
- [ ] Global marketing campaign

### **Phase 4: Ecosystem (Q4 2025)**

- [ ] Third-party developer tools
- [ ] Cross-game token utility
- [ ] Institutional partnerships
- [ ] Global exchange listings

## 💡 **Technical Innovation**

### **Proof of Useful Work (PoUW) Mining**

Our mining system is based on **Proof of Useful Work**, not just simple calculations:

- **ML Inference Microbatches** - Real AI model training
- **Matrix Multiplication Validation** - Computational mathematics
- **Small ZK-SNARK Proofs** - Advanced cryptography
- **Device Fairness** - Balanced rewards across devices

### **Autopilot Mining Algorithm**

Our autopilot system uses advanced AI algorithms to:

- **Optimize Resource Collection** - Maximize mining efficiency
- **Adapt to Market Conditions** - Dynamic difficulty adjustment
- **Prevent Exploitation** - Anti-cheat mechanisms
- **Balance Economy** - Sustainable token distribution
- **Energy Management** - Battery and thermal protection

### **Autopilot Safety Features**

Built-in protection for device health:

- **Battery Guard**: Stops at 20% battery
- **Thermal Protection**: Stops at 44°C
- **Daily Limits**: Maximum 6 hours per day
- **Reward Multiplier**: 0.6x for AFK farming
- **Route Optimization**: Avoids PvP zones
- **Smart Avoidance**: Prefers common rich fields

### **Anti-Cheat & Fairness System**

Advanced protection mechanisms ensure fair gameplay:

- **Biometric Motion Detection** - Natural player behavior
- **Input Entropy Analysis** - Randomness verification
- **Latency Jitter Monitoring** - Bot detection
- **Hardware Fingerprinting** - Multi-account prevention
- **Pity System** - Guaranteed rare drops every 200 events
- **Session Drift** - Dynamic difficulty adjustment

### **Mining Execution System**

Advanced mining with real computational work:

- **Device Detection**: Phone CPU, PC CPU, GPU
- **Consent Management**: Ask permission for GPU/CPU usage
- **Quota System**:
  - Phone: 200ms per user
  - PC: 400ms per user
  - GPU: 800ms per user
- **Global Rate Limit**: 100,000 operations per second
- **Payout Curve**: `reward ∝ useful_ops ^ 0.6`

### **Blockchain Integration**

- **TON Network** - High TPS, low fees
- **Jetton Standard** - Compliant token implementation
- **Smart Contracts** - Automated game logic
- **Cross-Chain Bridges** - Future expansion possibilities

## 🤝 **Community & Governance**

### **Community Benefits**

- **Early Access** - Beta testing opportunities
- **Governance Rights** - Vote on game features
- **Revenue Sharing** - Earn from platform growth
- **Exclusive Content** - Special game modes and items

### **How to Participate**

1. **Play the Game** - Start mining and earning
2. **Join Community** - Telegram groups and Discord
3. **Provide Feedback** - Help shape development
4. **Spread the Word** - Share with friends and family

## 📈 **Investment Thesis**

### **Why Invest in CentavraCoin?**

1. **Limited Supply** - Only 21 million tokens ever (like Bitcoin)
2. **Growing Demand** - Expanding user base
3. **Real Utility** - Tokens used in active ecosystem
4. **Sustainable Economics** - Long-term value creation
5. **Technical Innovation** - Unique autopilot system

### **Why Better Than Bitcoin?**

- **21M supply как у BTC**, но добыча завязана на реальные полезные вычисления (PoUW)
- **Игровая экономика с реальными ценами** на металлы → понятная редкость и стоимость лута
- **Честность**: авто-баланс по устройствам, анти-фарм, гарантия редкого дропа (pity-система)
- **Простая метрика цен**: 1 CENTA = 1 USDT; микроцены в nCENTA до 1e-9

### **Similar to ether.fi - Why?**

- **Proof of Useful Work** - Real computational value, not just mining
- **Sustainable Tokenomics** - Controlled supply with real utility
- **Professional Architecture** - Enterprise-grade security and scalability
- **Community Governance** - DAO-driven development and decisions
- **Real Market Integration** - Oracle-based pricing, not speculation

### **Funding Goals & Milestones**

#### **Phase 1: Foundation (Q1 2025) - $500K**

- [x] Core game mechanics and TON integration
- [x] Telegram WebApp deployment
- [x] Basic autopilot system
- [x] Multi-language support

#### **Phase 2: Growth (Q2 2025) - $1M**

- [ ] Advanced PoUW algorithms
- [ ] Governance system launch
- [ ] Cross-chain bridge development
- [ ] Mobile app optimization

#### **Phase 3: Expansion (Q3 2025) - $2M**

- [ ] Additional game modes
- [ ] NFT integration
- [ ] DeFi partnerships
- [ ] Global marketing campaign

#### **Phase 4: Ecosystem (Q4 2025) - $5M**

- [ ] Third-party developer tools
- [ ] Cross-game token utility
- [ ] Institutional partnerships
- [ ] Global exchange listings

### **Risk Factors**

- **Market Volatility** - Crypto market fluctuations
- **Regulatory Changes** - Evolving crypto regulations
- **Competition** - Other GameFi projects
- **Technical Risks** - Smart contract vulnerabilities

## 🔗 **Links & Resources**

- **Website**: [centavra.xyz](https://centavra.xyz)
- **Telegram**: [@centavracoin](https://t.me/centavracoin)
- **Documentation**: [docs.centavra.xyz](https://docs.centavra.xyz)
- **Whitepaper**: [whitepaper.centavra.xyz](https://whitepaper.centavra.xyz)

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 **Acknowledgments**

- **Telegram Team** - For the amazing WebApp platform
- **TON Foundation** - For the high-performance blockchain
- **Vue.js Community** - For the excellent frontend framework
- **Our Community** - For believing in the vision

---

**Built with ❤️ by the CentavraCoin Team**

_Join the revolution. Play. Mine. Govern._
