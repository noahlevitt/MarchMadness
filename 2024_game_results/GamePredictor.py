import pandas as pd

# 1. Read in the csv with each team's advanced statistics using pandas
stats = pd.read_csv('./2025_Team_Adv_Stats.csv')
#stats
# To get and print stats about a team(ex Illinois)
# team_a = "Illinois"
# stats_needed = loaded.loc[0:6, team_a]
# for param, value in zip(stats_needed.index, stats_needed.values):
#     print(f"{loaded.loc[param, 'Parameter']}: {value}")


# 2. Select 2 teams to collect advanced statistics for, team a and teamb, using loc & iloc
# 
# for entering teams, first letter each word capitalized, State is St for all except NC State,
# A&M stays as is, saint is St for peters and marys 
#
# higher or equal seed: team a
team_a = "Auburn"
# lower or equal seed: team b
team_b = "Michigan St" 
# team a stats
team_a_stats = stats.loc[0:6, team_a]
seed_a = team_a_stats.iloc[0]
winp_a = team_a_stats.iloc[1]
sos_a = team_a_stats.iloc[2]
ortg_a = team_a_stats.iloc[3]
drtg_a = team_a_stats.iloc[4]
nrtg_a = team_a_stats.iloc[5]
adjt_a = team_a_stats.iloc[6]
# team b stats
team_b_stats = stats.loc[0:6, team_b]
seed_b = team_b_stats.iloc[0]
winp_b = team_b_stats.iloc[1]
sos_b = team_b_stats.iloc[2]
ortg_b = team_b_stats.iloc[3]
drtg_b = team_b_stats.iloc[4]
nrtg_b = team_b_stats.iloc[5]
adjt_b = team_b_stats.iloc[6]


# 3. Get Impact Factor Coefficients; This will represent how much each element will impact the regression
alpha = [0.5,0.75,0.75,1.0,0.5] # Seed Factor
beta = [0.75,1.0,1.0,1.0,0.5] # Win% * SOS/10
gamma = [1.7,1.0,1.5,1.0,0.25] # ORtg - Opp DRtg (projected points scored)
delta = [1.75,1.0,1.55,1.0,0.25] # DRtg - Opp ORtg (projected points allowed)
epsilon = [1.5,1.75,1.75,1.0,1.5] # Adj Efficiency diff
zeta = [-0.35,-0.25,-0.25,-0.25,0] # Tempo difference


# 4. Use statistical model to predict winner of game based on stats and impact factor coefficients
#    To avoid error in one model, we will use 4 different combinations of factors and average them
#    We get the "line"(how much the favored team is expected to win by) by dividing the avg zscore by 4
seed_a_adjusted = 17 - seed_a
seed_b_adjusted = 17 - seed_b
zscore_total = 0
for i in range(5):
    zscore = (seed_a_adjusted-seed_b_adjusted)*alpha[i] + ((winp_a*sos_a)-(winp_b*sos_b))*beta[i] + \
        (ortg_a-drtg_b)*gamma[i] + (drtg_a-ortg_b)*delta[i] + (nrtg_a-nrtg_b)*epsilon[i] + (adjt_a-adjt_b)*zeta[i]
    zscore_total += zscore
    #print(zscore)
zscore_avg = zscore_total / 5 # 5 total regressions
odds_winner = round(abs(zscore_avg) / 4) # divide by 4 to get close to real lines and round
#print(zscore_avg)
if(zscore_avg>0):
    print(f"{team_a} is favored to win by {odds_winner} points over {team_b} ({team_a} -{odds_winner})")
elif(zscore_avg<0):
    print(f"{team_b} is favored to win by {odds_winner} points over {team_a} ({team_b} -{odds_winner})")
else:
    print(f"{team_a} and {team_b} have even odds to win")


# 5. After calculating the spread for the game, use the conversion table to also output the moneyline for the game
conversion_table = pd.read_csv('./spread_to_moneyline_table.csv')
conversion_table.set_index("Line", inplace=True)
# take in the predicted spread and use it to print the moneyline
# paramater spread calculated from odds calculation above, return none for both lines if spread is too large for table
# if in the table, return the moneyline for both the favorite and the underdog
def get_moneyline(spread):
    if(spread>0):
        spread = spread * -1
    if spread in conversion_table.index:
        fav_ml, dog_ml = conversion_table.loc[spread, "FavML"], conversion_table.loc[spread, "DogML"]
        return fav_ml, dog_ml
    else:
        return None, None  # if spread is missing from table
fav_ml, dog_ml = get_moneyline(odds_winner)
# assess which team is favored for the sake of printing. then print the spread and moneyline for the favorite, followed by a
# new line with the spread and moneyline for the underdog
if(odds_winner>0):
    print(f"{team_a}(Favored): Spread: -{odds_winner}, MoneyLine: {fav_ml}")
    print(f"{team_b}(Underdog): Spread: +{odds_winner}, MoneyLine: +{dog_ml}")
elif(odds_winner<0):
    print(f"Favored({team_b}): Spread: -{odds_winner}, MoneyLine: {fav_ml}")
    print(f"Underdog({team_a}): Spread: +{odds_winner}, MoneyLine: +{dog_ml}")
else:
    print(f"{team_a} and {team_b} have even odds(-110 ML) to win")


# 6. make a dictionary to store the spread and moneyline variables for each team. this allows for the potential to directly access
#    the file and retrieve variables. If we change the game input to be a list, we can input all the games at once and have it spit 
#    out the spread and moneyline for every game in a round at once
# create the dictionary to hold the variables. Also create a function to store the variables with names
storage_dict = {}
def store_var(name, value):
    storage_dict[name] = value
# store the spread and moneyline to each time, assessing whether they are the favorite or underdog before assigning the variables
if(odds_winner>0):
    store_var("favored_team", team_a)
    store_var("favored_team_spread", odds_winner*-1)
    store_var("favored_team_ml", fav_ml)
    store_var("underdog_team", team_b)
    store_var("underdog_team_spread", odds_winner)
    store_var("underdog_team_ml", dog_ml)
elif(odds_winner<0):
    store_var("favored_team", team_b)
    store_var("favored_team_spread", odds_winner*-1)
    store_var("favored_team_ml", fav_ml)
    store_var("underdog_team", team_a)
    store_var("underdog_team_spread", odds_winner)
    store_var("underdog_team_ml", dog_ml)
else:
    if(zscore_avg>0):
        store_var("favored_team", team_a)
        store_var("favored_team_spread", odds_winner)
        store_var("favored_team_ml", -110)
        store_var("underdog_team", team_b)
        store_var("underdog_team_spread", odds_winner)
        store_var("underdog_team_ml", -110)
    elif(zscore_avg<0):
        store_var("favored_team", team_b)
        store_var("favored_team_spread", odds_winner)
        store_var("favored_team_ml", -110)
        store_var("underdog_team", team_a)
        store_var("underdog_team_spread", odds_winner)
        store_var("underdog_team_ml", -110)
# make a funciton to return the dict
def get_vars():
    return storage_dict
print(get_vars())