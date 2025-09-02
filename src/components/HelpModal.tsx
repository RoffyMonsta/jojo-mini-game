import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, Divider } from '@mui/material';

interface HelpModalProps {
  open: boolean;
  onClose: () => void;
}

const HelpModal: React.FC<HelpModalProps> = ({ open, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ color: 'primary.main', fontWeight: 'bold' }}>
        🎮 Game Mechanics Guide
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" gutterBottom sx={{ color: 'secondary.main' }}>
            Basic Combat
          </Typography>
          <Typography variant="body2" paragraph>
            • <strong>Attack:</strong> Deal damage based on your Stand's Power stat<br/>
            • <strong>Special Ability:</strong> Powerful move with unique effects (3-turn cooldown)<br/>
            • <strong>HP:</strong> Both players start with 100 HP
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" gutterBottom sx={{ color: 'secondary.main' }}>
            Advanced Mechanics
          </Typography>
          <Typography variant="body2" paragraph>
            <strong>Critical Hits:</strong><br/>
            • Player: 20% chance for 1.5x damage<br/>
            • Enemy: 15% chance for 1.5x damage<br/>
            • Marked with "CRITICAL HIT!" in battle log
          </Typography>
          
          <Typography variant="body2" paragraph>
            <strong>Status Effects:</strong><br/>
            • <strong>Stun:</strong> Skip your next turn (10% chance on attacks)<br/>
            • <strong>Shield:</strong> Absorbs damage before affecting HP
          </Typography>

          <Typography variant="body2" paragraph>
            <strong>Special Ability Effects:</strong><br/>
            • <strong>Time Stop:</strong> Always stuns the enemy<br/>
            • <strong>Restoration:</strong> Heals 20 HP + deals damage<br/>
            • <strong>Defensive abilities:</strong> Grant +15 shield<br/>
            • <strong>Fire/Explosive:</strong> Apply burn (5 damage/turn for 3 turns)<br/>
            • <strong>Calamity/Plunder:</strong> Apply poison (3 damage/turn for 4 turns)<br/>
            • <strong>Other abilities:</strong> 30% chance to stun
          </Typography>
          
          <Typography variant="body2" paragraph>
            <strong>Combo System:</strong><br/>
            • Consecutive attacks build combo (max 5)<br/>
            • Each combo level adds +3 damage<br/>
            • Critical hits boost combo further<br/>
            • Combo resets when stunned or using abilities
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" gutterBottom sx={{ color: 'secondary.main' }}>
            Strategy Tips
          </Typography>
          <Typography variant="body2">
            • <strong>Build combos</strong> with consecutive attacks for extra damage<br/>
            • <strong>Time abilities</strong> carefully - don't waste them when enemy is low HP<br/>
            • <strong>Use healing abilities</strong> when your HP is low<br/>
            • <strong>Apply DoT effects</strong> (burn/poison) for sustained damage<br/>
            • <strong>Defensive Stands</strong> can create protective barriers<br/>
            • <strong>Status effects</strong> can turn the tide of battle
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained">
          Got it!
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default HelpModal;