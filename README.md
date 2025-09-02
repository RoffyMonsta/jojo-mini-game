# ⭐ JoJo Stand Battle ⭐

A JoJo's Bizarre Adventure mini game built with React, TypeScript, and Material-UI.

© 2025 Anton Lomovatskyi

## 🎮 Game Mechanics

### Basic Combat
- **Attack**: Deal damage based on your Stand's Power stat
- **Special Ability**: Powerful move with unique effects (3-turn cooldown)
- **HP**: Both players start with 100 HP

### Advanced Mechanics

#### Critical Hits
- **Player**: 20% chance for 1.5x damage
- **Enemy**: 15% chance for 1.5x damage
- Critical hits are marked with "CRITICAL HIT!" in the battle log

#### Status Effects
- **Stun**: Skip your next turn (10% chance on normal attacks)
- **Stunned players** cannot attack or use abilities
- Stun effects last 1 turn

#### Special Ability Effects
- **Time Stop** (Star Platinum, The World): Always stuns the enemy
- **Restoration** (Crazy Diamond): Heals 20 HP + deals damage
- **Other Abilities**: 30% chance to stun the enemy

#### Cooldown System
- Special abilities have a 3-turn cooldown after use
- Button shows remaining cooldown turns
- Plan your strategy around ability timing

### Stand Stats
- **Power**: Affects attack damage
- **Speed**: Affects special ability damage
- **Ability**: Unique special move with different effects

## 🎯 Strategy Tips

1. **Time your abilities** - Don't waste powerful moves when enemy is low HP
2. **Use healing abilities** when your HP is low
3. **Time-based Stands** are great for control with guaranteed stuns
4. **High-speed Stands** deal more ability damage
5. **Save abilities** for critical moments due to cooldown

## 🚀 Getting Started

```bash
npm install
npm start
```

## 📚 Stand Collection

Choose from 27+ iconic Stands across all 9 JoJo parts:
- Part 1: Phantom Blood
- Part 2: Battle Tendency  
- Part 3: Stardust Crusaders
- Part 4: Diamond is Unbreakable
- Part 5: Golden Wind
- Part 6: Stone Ocean
- Part 7: Steel Ball Run
- Part 8: JoJolion
- Part 9: The JOJOLands

Each Stand has unique stats and abilities that affect gameplay strategy!