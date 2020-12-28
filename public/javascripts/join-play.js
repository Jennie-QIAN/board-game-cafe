document.addEventListener('DOMContentLoaded', () => {

    console.log('DOM content loaded - join play script');
  
    const joinButton = document.querySelector("button.join-play");

    if (!joinButton) {
        return;
    }

    joinButton.addEventListener('click', () => {
        const playId = joinButton.getAttribute("data-play-id");
        const playersList = document.querySelector("div.list-players");

        if (joinButton.classList.contains("joined")) {
            axios.patch('/api/unjoin-play', {
                playId,
            })
            .then(async user => {
                joinButton.classList.remove("joined");
                const { _id: id } = await user.data;
                playersList.querySelector(`div[data-player-id="${id}"]`).remove();
            })
            .catch(err => console.log(err));
        } else {
            axios.post('/api/join-play', {
                playId,
            })
            .then(async user => {
                const {
                    _id: id, 
                    avatar, 
                    username,
                } = await user.data;

                joinButton.classList.add("joined");
                const newPlayerCard = document.createElement("div");
                newPlayerCard.className = "card-player";
                newPlayerCard.setAttribute("data-player-id", id);
                newPlayerCard.innerHTML = `<img src=${avatar}><a href="/users/${id}"><h5>${username}</h5></a>`;
                playersList.appendChild(newPlayerCard);
            })
            .catch(err => console.log(err));
        }
    });
  
}, false);