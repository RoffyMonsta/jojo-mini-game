import React, { useState } from 'react';
import { Grid, Card, CardContent, Typography, Button, Box, Tabs, Tab } from '@mui/material';
import { Stand } from '../types';
import { partNames } from '../stands';

interface StandSelectorProps {
  stands: Stand[];
  onSelectStand: (standName: string) => void;
}

const StandSelector: React.FC<StandSelectorProps> = ({ stands, onSelectStand }) => {
  const [selectedPart, setSelectedPart] = useState<number>(3);
  
  const filteredStands = stands.filter(stand => stand.part === selectedPart);
  
  return (
    <Box>
      <Typography variant="h4" align="center" gutterBottom sx={{ mb: 4 }}>
        Choose Your Stand
      </Typography>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs 
          value={selectedPart} 
          onChange={(_, newValue) => setSelectedPart(newValue)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ '& .MuiTab-root': { minWidth: 120 } }}
        >
          {Object.entries(partNames).map(([part, name]) => (
            <Tab key={part} label={`Part ${part}: ${name}`} value={parseInt(part)} />
          ))}
        </Tabs>
      </Box>
      
      <Grid container spacing={3}>
        {filteredStands.map((stand) => (
          <Grid item xs={12} sm={6} md={4} key={`${stand.name}-${stand.part}`}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box
                component="img"
                sx={{ height: 200, objectFit: 'contain', backgroundColor: '#f5f5f5' }}
                src={stand.image}
                alt={stand.name}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://via.placeholder.com/200x300/333/fff?text=${encodeURIComponent(stand.name)}`;
                }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" component="h2" gutterBottom sx={{ color: 'primary.main' }}>
                  {stand.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  User: {stand.user}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Power: {stand.power}/100
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Speed: {stand.speed}/100
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Ability: {stand.ability}
                </Typography>
                <Button
                  variant="contained"
                  fullWidth
                  sx={{ mt: 2 }}
                  onClick={() => onSelectStand(stand.name)}
                >
                  Select Stand
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default StandSelector;