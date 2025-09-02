export interface Stand {
  name: string;
  power: number;
  speed: number;
  ability: string;
  user: string;
  part: number;
  image: string;
}

export interface GameState {
  playerStand: Stand | null;
  enemyStand: Stand | null;
  playerHP: number;
  enemyHP: number;
  gameStatus: 'selecting' | 'battle' | 'victory' | 'defeat';
  battleLog: string[];
  abilityCooldown: number;
  playerStunned: boolean;
  enemyStunned: boolean;
  playerShield: number;
  enemyShield: number;
  turnCount: number;
  playerBurn: number;
  enemyBurn: number;
  playerPoison: number;
  enemyPoison: number;
  combo: number;
}