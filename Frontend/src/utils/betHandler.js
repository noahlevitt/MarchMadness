// betHandler.js

// Skeleton async functions to mimic backend/database behavior
// replacing these with actual HTTP requests to the backend API later

// Simulate getting user account balance
export async function getUserBalance(userId) {
  // Replace with actual DB query
  return 100.00; // example value in dollars
}

// Simulate deducting balance from user account
export async function deductBalance(userId, amount) {
  console.log(`Deducting $${amount} from user ${userId}`);
  // Backend update would go here
  return true;
}

// Simulate placing the bet and storing in DB
export async function placeBet(userId, gameId, teamId, amount, spread) {
  const bet = {
    user_id: userId,
    game_id: gameId,
    team_id: teamId,
    amount: amount,
    spread: spread,
    status: 'pending',
  };
  console.log('Placing bet:', bet);
  // Backend insert logic would go here
  return true;
}

// Simulate checking outcome and updating the bet
export async function resolveBet(bet, actualScoreTeam, actualScoreOpponent) {
  let didWin;
  if ((actualScoreTeam + bet.spread) > actualScoreOpponent) {
    didWin = true;
  } else {
    didWin = false;
  }

  const payout = didWin ? (bet.amount * 2) : 0;
  console.log(`Bet ${bet.bet_id} resolved as`, didWin ? 'WIN' : 'LOSS', `Payout: $${payout}`);

  // Update bet in DB to show win/loss and payout
  // Update user balance if won

  return {
    result: didWin ? 'won' : 'lost',
    payout: payout
  };
}

// Example main logic for placing a bet
export async function handleBet(userId, gameId, teamId, amount, spread) {
  const balance = await getUserBalance(userId);
  if (balance < amount) {
    return { success: false, message: 'Insufficient balance' };
  }

  await deductBalance(userId, amount);
  await placeBet(userId, gameId, teamId, amount, spread);

  return { success: true, message: 'Bet placed successfully' };
}
