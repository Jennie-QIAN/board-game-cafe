# Board Game Café
A responsive web app for board game players community <br>
Built with NodeJs, Express, MongoDB, Mongoose; JavaScript, Handlebars, SCSS <br>
Data of detailed board game info are seeded to the DB with boardgamegeek.com API

## Workflow
<ol>
    <li>Wireframing with mobile-first approach (checkout the wireframes <a href="https://whimsical.com/board-game-cafe-W31oL4sayiTwtv6aG46CGz">here</a>)</li>
    <li>Project architecture planning and configuration</li>
    <li>Data modeling</li>
    <li>Back end logics, routing and views</li>
    <li>Front end logics, user interactions</li>
    <li>Integration</li>

![Image Homepage](https://res.cloudinary.com/zhennisapp/image/upload/v1610404708/bgc-demo/homepage_i2vb2v.png)

## Main functionalities
<ul>
  <li>User registration, login, logout</li>
  <li>Protected routes</li>
  <li>Display of available plays and games (whether user is authenticated or not)</li>
  <li>Display of user profile with his/her organized game plays ; participating plays; created games and favorite games</li>
  <li>An authenticated user can create a new game, make comment on a game, save a game to favorite ; create a new game play and join a game play organized by others</li>
</ul>

![Image Games](https://res.cloudinary.com/zhennisapp/image/upload/v1610406209/bgc-demo/games_fka0wp.png)
![Image Plays](https://res.cloudinary.com/zhennisapp/image/upload/v1610406230/bgc-demo/plays_mktj8f.png)
![Image NewPlay](https://res.cloudinary.com/zhennisapp/image/upload/v1610406299/bgc-demo/play-new_y8gqrr.png)

## Backlog
<ul>
    <li>Add feedback to the user (ex, “you’ve created a new game play”)</li>
    <li>Indexing to boost query speed</li>
    <li>Implement Reset password if forgot password</li>
    <li>Gmap API for display on the detail page of game play (venue)</li>
    <li>users/:id routes</li>
    <li>Add a user as a friend</li>
    <li>Game rating</li>
    <li>Messaging between users</li>
</ul>
