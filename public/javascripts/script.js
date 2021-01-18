document.addEventListener('DOMContentLoaded', () => {

  console.log('DOM content loaded - index script');

  const likeButtons = document.querySelectorAll("button.like-game");
 
  likeButtons.forEach(btn => btn.addEventListener('click', e => {
    const gameId = btn.getAttribute("data-game-id");

    if (btn.classList.contains("favorite")) {
      fetch('/api/unlike-game', {
        method: 'PATCH',
        body: JSON.stringify({ gameId }),
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        }
      })
        .then(() => btn.classList.remove("favorite"))
        .catch(err => console.log(err));
    } else {
      fetch('/api/like-game', {
        method: "POST",
        body: JSON.stringify({ gameId }),
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        }
      })
        .then(() => btn.classList.add("favorite"))
        .catch(err => console.log(err));
    }

  }));

}, false);
