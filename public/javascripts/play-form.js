document.addEventListener('DOMContentLoaded', () => {

    console.log('DOM content loaded for play form');
    const searchBar = document.querySelector(".search-bar-games");
    const form = document.body.querySelector("form");
    const labelMinPlayer = form.querySelector(".label-minplayer");
    const labelGamesForPlay = form.querySelector(".label-games-play");

    searchBar.addEventListener('input', (e) => {
        
        const resultsList = form.querySelector(".games-options");
        if (resultsList) {
            resultsList.remove();
        }

        if (!searchBar.value) {
            return;
        }

        axios.get('/api/search-game', {
            params: {
                gameName: searchBar.value
            }
        })
            .then(results => results.data)
            .then(games => {
                const searchList = form.insertBefore(document.createElement("ul"), labelMinPlayer);
                searchList.classList.add("games-options");
                games.forEach(game => {
                    const option = document.createElement("li");
                    option.textContent = game.name;
                    option.setAttribute("data-game-id", game._id);
                    searchList.appendChild(option);
                });

                let selectedGames = document.querySelector("ul.games-selected");

                searchList.addEventListener('click', (e) => {
                    
                    if (!selectedGames) {
                        selectedGames = form.insertBefore(document.createElement("ul"), labelMinPlayer);
                        selectedGames.classList.add("games-selected");
                    }
                    
                    const selectedGame = document.createElement("li");
                    selectedGame.textContent = e.target.textContent;
                    selectedGame.setAttribute("data-game-id", e.target.getAttribute("data-game-id"));
                    selectedGames.appendChild(selectedGame);

                    const inputGame = labelGamesForPlay.appendChild(document.createElement("input"));
                    inputGame.setAttribute("type", "hidden");
                    inputGame.setAttribute("name", "gamesForPlay");
                    inputGame.setAttribute("value", e.target.getAttribute("data-game-id"));
                });

                if (!selectedGames) {
                    return;
                }

                selectedGames.addEventListener('click', (e) => {
                    const gameId = e.target.getAttribute("data-game-id");
                    if (!gameId) {
                        return;
                    }
                    e.target.remove();
                    document.querySelector(`input[value="${gameId}"]`).remove();
                });
            })
            .catch(err => console.log(err));
    });  
  
  }, false);