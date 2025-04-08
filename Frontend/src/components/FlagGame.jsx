import { useEffect, useState } from "react";
import { getCountries, saveScore } from "../api";
import {
  Button,
  TextField,
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  Container,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import { styled } from "@mui/material/styles";

const GameContainer = styled(Container)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "100vh",
  padding: "2rem",
  textAlign: "center",
});

const FlagCard = styled(Card)(({ theme }) => ({
  width: "100%",
  maxWidth: 320,
  margin: "0 auto",
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius * 3,
  boxShadow: theme.shadows[6],
  transition: "transform 0.3s ease",
  "&:hover": {
    transform: "scale(1.03)",
  },
}));

const OptionButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(2),
  fontSize: "1rem",
  fontWeight: 600,
  borderRadius: theme.shape.borderRadius * 3,
  textTransform: "none",
  transition: "all 0.2s ease",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: theme.shadows[2],
  },
}));

const ScoreDisplay = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  padding: theme.spacing(1, 4),
  borderRadius: theme.shape.borderRadius * 4,
  boxShadow: theme.shadows[2],
  marginBottom: theme.spacing(4),
}));

export default function FlagGame() {
  const [countries, setCountries] = useState([]);
  const [current, setCurrent] = useState(null);
  const [options, setOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [playerName, setPlayerName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setLoading(true);
        const data = await getCountries();
        setCountries(data);
        pickRandomCountry(data);
      } catch (err) {
        setError("Failed to load countries. Please try again later.");
        console.error("Error fetching countries:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  const pickRandomCountry = (data) => {
    if (data.length === 0) return;
    const selected = data[Math.floor(Math.random() * data.length)];
    setCurrent(selected);
    generateOptions(data, selected);
  };

  const generateOptions = (data, correct) => {
    let choices = new Set();
    choices.add(correct);
    while (choices.size < 4) {
      const randomCountry = data[Math.floor(Math.random() * data.length)];
      if (![...choices].some((c) => c.flagUrl === randomCountry.flagUrl)) {
        choices.add(randomCountry);
      }
    }
    setOptions(Array.from(choices).sort(() => Math.random() - 0.5));
  };

  const handleGuess = (country) => {
    const isCorrect = country.name === current.name;
    
    if (isCorrect) {
      setScore(score + 1);
      setSnackbar({
        open: true,
        message: "Correct! Well done!",
        severity: "success",
      });
    } else {
      setSnackbar({
        open: true,
        message: `Incorrect! The answer was ${current.name}`,
        severity: "error",
      });
    }
    
    setTimeout(() => pickRandomCountry(countries), 1000);
  };

  const handleSaveScore = async () => {
    if (!playerName.trim()) {
      setSnackbar({
        open: true,
        message: "Please enter your name to save the score",
        severity: "warning",
      });
      return;
    }

    try {
      await saveScore(playerName, score);
      setSnackbar({
        open: true,
        message: "Score saved successfully!",
        severity: "success",
      });
      setScore(0);
      setPlayerName("");
    } catch (err) {
      setSnackbar({
        open: true,
        message: "Failed to save score. Please try again.",
        severity: "error",
      });
      console.error("Error saving score:", err);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  if (loading) {
    return (
      <GameContainer>
        <CircularProgress size={60} />
      </GameContainer>
    );
  }

  if (error) {
    return (
      <GameContainer>
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
        <Button variant="contained" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </GameContainer>
    );
  }

  return (
    <GameContainer maxWidth="sm">
      <Box mb={4}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
          🌍 Flag Quiz
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Guess the country by its flag
        </Typography>
      </Box>

      <ScoreDisplay>
        <Typography variant="h5">Score: {score}</Typography>
      </ScoreDisplay>

      <Box mb={6} width="100%">
        {current && (
          <FlagCard>
            <CardContent sx={{ padding: 0 }}>
              <Box
                component="img"
                src={current.flagUrl}
                alt={`Flag of ${current.name}`}
                sx={{
                  width: "100%",
                  height: "auto",
                  maxHeight: 180,
                  objectFit: "contain",
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 2,
                }}
              />
            </CardContent>
          </FlagCard>
        )}
      </Box>

      <Grid container spacing={3} mb={6} width="100%" justifyContent="center">
        {options.map((country) => (
          <Grid item xs={12} sm={6} key={country.id} sx={{ maxWidth: 300 }}>
            <OptionButton
              fullWidth
              variant="contained"
              color="primary"
              onClick={() => handleGuess(country)}
              size="large"
              sx={{
                backgroundColor: "background.paper",
                color: "text.primary",
                "&:hover": {
                  backgroundColor: "primary.main",
                  color: "primary.contrastText",
                },
              }}
            >
              {country.name}
            </OptionButton>
          </Grid>
        ))}
      </Grid>

      <Box
        component="form"
        onSubmit={(e) => {
          e.preventDefault();
          handleSaveScore();
        }}
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: "center",
          gap: 2,
          width: "100%",
          maxWidth: 500,
        }}
      >
        <TextField
          label="Your name"
          variant="outlined"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          fullWidth
          size="medium"
        />
        <Button
          type="submit"
          variant="contained"
          color="secondary"
          size="large"
          sx={{ minWidth: 140, height: 56 }}
        >
          Save Score
        </Button>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </GameContainer>
  );
}