document.addEventListener('DOMContentLoaded', () => {

    console.log('DOM content loaded - play form');

    const searchBar = document.querySelector(".search-bar-games");   
    const labelGamesForPlay = document.querySelector(".label-games-play");
    const gameSelectContainer = document.querySelector(".container--select-games");
    const selectedGamesList = document.querySelector("ul.games-selected");

    searchBar.addEventListener('input', (e) => {
        
        const optionGamesList = document.querySelector(".games-options");
        if (optionGamesList) {
            optionGamesList.remove();
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
                const searchList = document.createElement("ul");
                searchList.classList.add("games-options");
                gameSelectContainer.appendChild(searchList);

                games.forEach(game => {
                    const option = document.createElement("li");
                    option.textContent = game.name;
                    option.setAttribute("data-game-id", game._id);
                    searchList.appendChild(option);
                });

                searchList.addEventListener('click', (e) => {                   
                    const selectedGame = document.createElement("li");
                    selectedGame.textContent = e.target.textContent;
                    selectedGame.setAttribute("data-game-id", e.target.getAttribute("data-game-id"));
                    selectedGamesList.appendChild(selectedGame);

                    const inputGame = labelGamesForPlay.appendChild(document.createElement("input"));
                    inputGame.setAttribute("type", "hidden");
                    inputGame.setAttribute("name", "gamesForPlay");
                    inputGame.setAttribute("value", e.target.getAttribute("data-game-id"));
                });              
            })
            .catch(err => console.log(err));
    }); 

    selectedGamesList.addEventListener('click', (e) => {
        const gameId = e.target.getAttribute("data-game-id");
        if (!gameId) {
            return;
        }
        e.target.remove();
        document.querySelector(`input[value="${gameId}"]`).remove();
    });
  
  }, false);