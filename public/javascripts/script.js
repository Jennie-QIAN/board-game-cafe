document.addEventListener('DOMContentLoaded', () => {

  console.log('DOM content loaded - index script');

  const likeButtons = document.querySelectorAll("button.like-game");
 
  likeButtons.forEach(btn => btn.addEventListener('click', e => {
    const gameId = btn.getAttribute("data-game-id");
  
    if (btn.classList.contains("favorite")) {
      axios.patch('/api/unlike-game', {
        gameId,
      })
        .then(() => btn.classList.remove("favorite"))
        .catch(err => console.log(err));
    } else {
      axios.post('/api/like-game', {
        gameId,
      })
        .then(() => btn.classList.add("favorite"))
        .catch(err => console.log(err));
    }

  }));

}, false);
