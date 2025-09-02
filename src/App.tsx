import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Container, Typography, Box, IconButton } from '@mui/material';
import { Help } from '@mui/icons-material';
import StandSelector from './components/StandSelector';
import BattleArena from './components/BattleArena';
import HelpModal from './components/HelpModal';
import { GameState } from './types';
import { stands } from './stands';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#ffd700',
    },
    secondary: {
      main: '#ff6b35',
    },
    background: {
      default: '#1a1a2e',
      paper: '#16213e',
    },
  },
});

function App() {
  const [helpOpen, setHelpOpen] = useState(false);
  const [gameState, setGameState] = useState<GameState>({
    playerStand: null,
    enemyStand: null,
    playerHP: 100,
    enemyHP: 100,
    gameStatus: 'selecting',
    battleLog: [],
    abilityCooldown: 0,
    playerStunned: false,
    enemyStunned: false,
    playerShield: 0,
    enemyShield: 0,
    turnCount: 0,
    playerBurn: 0,
    enemyBurn: 0,
    playerPoison: 0,
    enemyPoison: 0,
    combo: 0,
  });

  const selectStand = (standName: string) => {
    const playerStand = stands.find(s => s.name === standName);
    const enemyStand = stands[Math.floor(Math.random() * stands.length)];
    
    setGameState({
      ...gameState,
      playerStand: playerStand!,
      enemyStand: enemyStand,
      gameStatus: 'battle',
      battleLog: [`You chose ${playerStand?.name}!`, `Enemy summoned ${enemyStand.name}!`],
      abilityCooldown: 0,
      playerStunned: false,
      enemyStunned: false,
      playerShield: 0,
      enemyShield: 0,
      turnCount: 0,
      playerBurn: 0,
      enemyBurn: 0,
      playerPoison: 0,
      enemyPoison: 0,
      combo: 0,
    });
  };

  const resetGame = () => {
    setGameState({
      playerStand: null,
      enemyStand: null,
      playerHP: 100,
      enemyHP: 100,
      gameStatus: 'selecting',
      battleLog: [],
      abilityCooldown: 0,
      playerStunned: false,
      enemyStunned: false,
      playerShield: 0,
      enemyShield: 0,
      turnCount: 0,
      playerBurn: 0,
      enemyBurn: 0,
      playerPoison: 0,
      enemyPoison: 0,
      combo: 0,
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg">
        <Box sx={{ py: 4 }}>
          <Box sx={{ position: 'relative', mb: 2 }}>
            <Typography variant="h2" component="h1" align="center" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
              ⭐ JoJo Stand Battle ⭐
            </Typography>
            <IconButton 
              onClick={() => setHelpOpen(true)} 
              sx={{ 
                position: 'absolute', 
                top: 0, 
                right: 0, 
                color: 'primary.main' 
              }}
            >
              <Help fontSize="large" />
            </IconButton>
          </Box>
          <Typography variant="body2" align="center" sx={{ mb: 3, opacity: 0.7 }}>
            © 2025 Anton Lomovatskyi
          </Typography>
          
          {gameState.gameStatus === 'selecting' ? (
            <StandSelector stands={stands} onSelectStand={selectStand} />
          ) : (
            <BattleArena gameState={gameState} setGameState={setGameState} onReset={resetGame} />
          )}
          
          <HelpModal open={helpOpen} onClose={() => setHelpOpen(false)} />
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;