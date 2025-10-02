# Research Report
## 2025 Team Advanced Statistics
### Summary of Work
The research that was completed was pulling the necessary statistics for each team from the kenpom website and putting them into a CSV file.
This took time to restructure the data to match the line generator, and removing high ranked teams who did not make the tournament.
### Motivation
This research is essential as they are the statistics used in the spread generator regression. Without these stats, we don't have spreads for
the games, which is the whole point of a betting site. Additionally, our moneyline betting is based on a spread converter, so there would be
no betting to be had for this year's tournament without these statistics.
### Time Spent
About 35 minutes of the time was spent removing teams that were not participating in the tournament and unused statistics, and the other 10
was used restructuring the data to match the GamePredictor.py format 
### Results
I was able to pull the 6 advanced statistics used in the regression for all 68 teams participating in the March Madness tournament. These have 
now been added to a CSV and a merge request is in, which will allow us to add new teams to the database for on website compatability.
### Sources
<!--list your sources and link them to a footnote with the source url-->
- Kenpom basketball statistics website[^1]
[^1]: https://kenpom.com/index.php?y=2025
