import React from 'react';
import { Grid, Card, Typography, Button, LinearProgress, Box, Paper } from '@mui/material';
import { GameState } from '../types';

interface BattleArenaProps {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  onReset: () => void;
}

const BattleArena: React.FC<BattleArenaProps> = ({ gameState, setGameState, onReset }) => {
  const attack = () => {
    if (gameState.gameStatus !== 'battle' || gameState.playerStunned) return;

    let playerDamage = Math.floor(Math.random() * 30) + Math.floor(gameState.playerStand!.power / 5);
    const playerCrit = Math.random() < 0.2;
    let newCombo = gameState.combo;
    
    // Combo system - consecutive attacks increase damage
    if (newCombo > 0) {
      playerDamage += Math.floor(newCombo * 3);
    }
    newCombo = Math.min(5, newCombo + 1);
    
    if (playerCrit) {
      playerDamage = Math.floor(playerDamage * 1.5);
      newCombo += 1; // Crits boost combo more
    }

    let newEnemyHP = Math.max(0, gameState.enemyHP - playerDamage);
    let newPlayerHP = gameState.playerHP;
    let newPlayerStunned = false;
    let newEnemyStunned = gameState.enemyStunned;

    const newLog = [
      ...gameState.battleLog,
      `${gameState.playerStand!.name} attacks for ${playerDamage} damage!${playerCrit ? ' CRITICAL HIT!' : ''}`
    ];

    // Apply shield damage reduction
    if (gameState.enemyShield > 0) {
      const shieldReduction = Math.min(playerDamage, gameState.enemyShield);
      playerDamage -= shieldReduction;
      newLog.push(`Enemy shield absorbs ${shieldReduction} damage!`);
    }
    newEnemyHP = Math.max(0, gameState.enemyHP - playerDamage);

    // Enemy counter-attack if not stunned and still alive
    let enemyDamage = 0;
    if (!gameState.enemyStunned && newEnemyHP > 0) {
      enemyDamage = Math.floor(Math.random() * 30) + Math.floor(gameState.enemyStand!.power / 5);
      const enemyCrit = Math.random() < 0.15;
      if (enemyCrit) {
        enemyDamage = Math.floor(enemyDamage * 1.5);
      }
      
      // Apply player shield
      let finalDamage = enemyDamage;
      if (gameState.playerShield > 0) {
        const shieldReduction = Math.min(enemyDamage, gameState.playerShield);
        finalDamage -= shieldReduction;
        newLog.push(`Your shield absorbs ${shieldReduction} damage!`);
      }
      
      newPlayerHP = Math.max(0, gameState.playerHP - finalDamage);
      newLog.push(`${gameState.enemyStand!.name} counters for ${finalDamage} damage!${enemyCrit ? ' CRITICAL HIT!' : ''}`);
      
      // Chance to stun player
      if (Math.random() < 0.1) {
        newPlayerStunned = true;
        newLog.push(`${gameState.playerStand!.name} is stunned!`);
      }
    }

    // Apply status effects at turn start
    if (gameState.enemyBurn > 0) {
      newEnemyHP = Math.max(0, newEnemyHP - 5);
      newLog.push(`${gameState.enemyStand!.name} takes 5 burn damage!`);
    }
    if (gameState.playerPoison > 0) {
      newPlayerHP = Math.max(0, newPlayerHP - 3);
      newLog.push(`${gameState.playerStand!.name} takes 3 poison damage!`);
    }
    
    // Reset enemy stun
    if (gameState.enemyStunned) {
      newEnemyStunned = false;
      newLog.push(`${gameState.enemyStand!.name} recovers from stun!`);
      newCombo = 0; // Break combo when enemy recovers
    }

    let newStatus: GameState['gameStatus'] = gameState.gameStatus;
    if (newEnemyHP === 0) {
      newStatus = 'victory';
      newLog.push('Victory! You defeated the enemy Stand!');
    } else if (newPlayerHP === 0) {
      newStatus = 'defeat';
      newLog.push('Defeat! Your Stand has been defeated!');
    }

    setGameState({
      ...gameState,
      playerHP: newPlayerHP,
      enemyHP: newEnemyHP,
      gameStatus: newStatus,
      battleLog: newLog,
      abilityCooldown: Math.max(0, gameState.abilityCooldown - 1),
      playerStunned: newPlayerStunned,
      enemyStunned: newEnemyStunned,
      playerShield: Math.max(0, gameState.playerShield - (gameState.playerShield > 0 ? Math.min(enemyDamage || 0, gameState.playerShield) : 0)),
      enemyShield: Math.max(0, gameState.enemyShield - (gameState.enemyShield > 0 ? Math.min(playerDamage, gameState.enemyShield) : 0)),
      turnCount: gameState.turnCount + 1,
      playerBurn: Math.max(0, gameState.playerBurn - 1),
      enemyBurn: Math.max(0, gameState.enemyBurn - 1),
      playerPoison: Math.max(0, gameState.playerPoison - 1),
      enemyPoison: Math.max(0, gameState.enemyPoison - 1),
      combo: newCombo,
    });
  };

  const useAbility = () => {
    if (gameState.gameStatus !== 'battle' || gameState.abilityCooldown > 0 || gameState.playerStunned) return;

    const abilityDamage = Math.floor(Math.random() * 40) + Math.floor(gameState.playerStand!.speed / 3);
    const newEnemyHP = Math.max(0, gameState.enemyHP - abilityDamage);
    
    // Special ability effects
    let newEnemyStunned = false;
    let healAmount = 0;
    
    const newLog = [
      ...gameState.battleLog,
      `${gameState.playerStand!.name} uses ${gameState.playerStand!.ability} for ${abilityDamage} damage!`
    ];

    // Special ability effects based on stand
    let newPlayerShield = gameState.playerShield;
    let newEnemyBurn = gameState.enemyBurn;
    let newEnemyPoison = gameState.enemyPoison;
    
    if (gameState.playerStand!.ability.includes('Time')) {
      newEnemyStunned = true;
      newLog.push(`${gameState.enemyStand!.name} is frozen in time!`);
    } else if (gameState.playerStand!.ability.includes('Restoration')) {
      healAmount = 20;
      newLog.push(`${gameState.playerStand!.name} heals for ${healAmount} HP!`);
    } else if (gameState.playerStand!.ability.includes('Zipper') || gameState.playerStand!.ability.includes('String')) {
      newPlayerShield += 15;
      newLog.push(`${gameState.playerStand!.name} creates a defensive barrier! (+15 shield)`);
    } else if (gameState.playerStand!.ability.includes('Fire') || gameState.playerStand!.ability.includes('Explosive')) {
      newEnemyBurn = 3;
      newLog.push(`${gameState.enemyStand!.name} is burning! Will take damage for 3 turns.`);
    } else if (gameState.playerStand!.ability.includes('Calamity') || gameState.playerStand!.ability.includes('Plunder')) {
      newEnemyPoison = 4;
      newLog.push(`${gameState.enemyStand!.name} is poisoned! Will take damage for 4 turns.`);
    } else if (Math.random() < 0.3) {
      newEnemyStunned = true;
      newLog.push(`${gameState.enemyStand!.name} is stunned by the ability!`);
    }

    let newStatus: GameState['gameStatus'] = gameState.gameStatus;
    if (newEnemyHP === 0) {
      newStatus = 'victory';
      newLog.push('Victory! You defeated the enemy Stand!');
    }

    setGameState({
      ...gameState,
      playerHP: Math.min(100, gameState.playerHP + healAmount),
      enemyHP: newEnemyHP,
      gameStatus: newStatus,
      battleLog: newLog,
      abilityCooldown: 3,
      enemyStunned: newEnemyStunned,
      playerShield: newPlayerShield,
      enemyBurn: newEnemyBurn,
      enemyPoison: newEnemyPoison,
      combo: 0, // Reset combo after ability use
      turnCount: gameState.turnCount + 1,
    });
  };

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <Box sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
              <Box
                component="img"
                sx={{ width: 80, height: 120, objectFit: 'contain', mr: 2, borderRadius: 1, backgroundColor: '#f5f5f5' }}
                src={gameState.playerStand?.image}
                alt={gameState.playerStand?.name}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://via.placeholder.com/80x120/333/fff?text=${encodeURIComponent(gameState.playerStand?.name || '')}`;
                }}
              />
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h6" sx={{ color: 'primary.main' }}>
                  Your Stand: {gameState.playerStand?.name}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  User: {gameState.playerStand?.user}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2">HP: {gameState.playerHP}/100</Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={gameState.playerHP} 
                    sx={{ mt: 1, height: 10 }}
                    color="primary"
                  />
                  {gameState.playerShield > 0 && (
                    <>
                      <Typography variant="body2" sx={{ mt: 1 }}>Shield: {gameState.playerShield}</Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={Math.min(100, gameState.playerShield * 2)} 
                        sx={{ mt: 1, height: 6 }}
                        color="info"
                      />
                    </>
                  )}
                  {(gameState.playerBurn > 0 || gameState.playerPoison > 0 || gameState.combo > 0) && (
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      {gameState.combo > 0 && <span style={{ color: '#ffd700' }}>⚡ Combo: {gameState.combo}</span>}
                      {gameState.combo > 0 && (gameState.playerBurn > 0 || gameState.playerPoison > 0) && ' | '}
                      <span style={{ color: '#f44336' }}>
                        {gameState.playerBurn > 0 && `🔥 Burn: ${gameState.playerBurn}`}
                        {gameState.playerBurn > 0 && gameState.playerPoison > 0 && ' | '}
                        {gameState.playerPoison > 0 && `☠️ Poison: ${gameState.playerPoison}`}
                      </span>
                    </Typography>
                  )}
                </Box>
              </Box>
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <Box sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
              <Box
                component="img"
                sx={{ width: 80, height: 120, objectFit: 'contain', mr: 2, borderRadius: 1, backgroundColor: '#f5f5f5' }}
                src={gameState.enemyStand?.image}
                alt={gameState.enemyStand?.name}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://via.placeholder.com/80x120/333/fff?text=${encodeURIComponent(gameState.enemyStand?.name || '')}`;
                }}
              />
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h6" sx={{ color: 'secondary.main' }}>
                  Enemy Stand: {gameState.enemyStand?.name}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  User: {gameState.enemyStand?.user}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2">HP: {gameState.enemyHP}/100</Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={gameState.enemyHP} 
                    sx={{ mt: 1, height: 10 }}
                    color="secondary"
                  />
                  {gameState.enemyShield > 0 && (
                    <>
                      <Typography variant="body2" sx={{ mt: 1 }}>Shield: {gameState.enemyShield}</Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={Math.min(100, gameState.enemyShield * 2)} 
                        sx={{ mt: 1, height: 6 }}
                        color="warning"
                      />
                    </>
                  )}
                  {(gameState.enemyBurn > 0 || gameState.enemyPoison > 0) && (
                    <Typography variant="body2" sx={{ mt: 1, color: 'error.main' }}>
                      {gameState.enemyBurn > 0 && `🔥 Burn: ${gameState.enemyBurn}`}
                      {gameState.enemyBurn > 0 && gameState.enemyPoison > 0 && ' | '}
                      {gameState.enemyPoison > 0 && `☠️ Poison: ${gameState.enemyPoison}`}
                    </Typography>
                  )}
                </Box>
              </Box>
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mb: 3 }}>
            {gameState.playerStunned ? (
              <Button 
                variant="contained" 
                color="warning"
                onClick={() => {
                  const newLog = [...gameState.battleLog, `${gameState.playerStand!.name} recovers from stun!`];
                  setGameState({
                    ...gameState,
                    playerStunned: false,
                    abilityCooldown: Math.max(0, gameState.abilityCooldown - 1),
                    battleLog: newLog,
                    turnCount: gameState.turnCount + 1,
                    combo: 0, // Reset combo when stunned
                  });
                }}
                size="large"
              >
                Skip Turn (Stunned)
              </Button>
            ) : (
              <>
                <Button 
                  variant="contained" 
                  onClick={attack}
                  disabled={gameState.gameStatus !== 'battle'}
                  size="large"
                >
                  Attack
                </Button>
                <Button 
                  variant="outlined" 
                  onClick={useAbility}
                  disabled={gameState.gameStatus !== 'battle' || gameState.abilityCooldown > 0}
                  size="large"
                >
                  {gameState.abilityCooldown > 0 ? `Cooldown: ${gameState.abilityCooldown}` : 'Use Ability'}
                </Button>
              </>
            )}
            <Button 
              variant="contained" 
              color="secondary"
              onClick={onReset}
              size="large"
            >
              New Game
            </Button>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2, maxHeight: 300, overflow: 'auto' }}>
            <Typography variant="h6" gutterBottom>
              Battle Log
            </Typography>
            {gameState.battleLog.map((log, index) => (
              <Typography key={index} variant="body2" sx={{ mb: 1 }}>
                {log}
              </Typography>
            ))}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default BattleArena;