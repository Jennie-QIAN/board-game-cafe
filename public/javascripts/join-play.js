document.addEventListener('DOMContentLoaded', () => {

    console.log('DOM content loaded - join play script');
  
    const joinButton = document.querySelector("button.join-play");

    if (!joinButton) {
        return;
    }

    joinButton.addEventListener('click', () => {
        const playId = joinButton.getAttribute("data-play-id");
        const playersList = document.querySelector("div.list-players");
        const userInfoEle = document.querySelector("#auth a");
        const userId = userInfoEle.getAttribute("data-user-id");
        const userName = userInfoEle.getAttribute("data-user-name");
        const userImg = document.querySelector("#auth img").getAttribute("src");


        if (joinButton.classList.contains("joined")) {
            axios.patch('/api/unjoin-play', {
                playId,
            })
            .then(() => {
                joinButton.classList.remove("joined");
                playersList.querySelector(`div[data-player-id="${userId}"]`).remove();
            })
            .catch(err => console.log(err));
        } else {
            axios.post('/api/join-play', {
                playId,
            })
            .then(() => {
                joinButton.classList.add("joined");
                const newPlayerCard = document.createElement("div");
                newPlayerCard.className = "card-player";
                newPlayerCard.setAttribute("data-player-id", userId);
                newPlayerCard.innerHTML = `<img src=${userImg}><a href="/users/${userId}"><h5>${userName}</h5></a>`;
                playersList.appendChild(newPlayerCard);
            })
            .catch(err => console.log(err));
        }
    });
  
}, false);