# Flappy-Bird Fall 2019
> Flappy Bird Game with Local Multiplayer and CPU trained with Neuroevolution


The purpose of this project is to remake the famous mobile game Flappy Bird on a webpage and modify it to add an extra layer of complexity and sociability.
There are 3 different modes: Single-Player, Versus CPU, and Local 2-Player. The CPU's AI was trained to various difficulty levels using a machine learning
technique called Neuroevolution. Additonally, high scores are stored during your local session and your recent score can be uploaded to a leaderboard. *This app has only been tested to work on desktop devices.*

This web app is currently deployed on https://flappy-bird-renzjordan.onrender.com/ (as of Jan. 2023).



![](header.png)

## How to Run on your Local Machine


Install:

```sh
rm -rf node_modules && npm ci
```

Run:

```sh
node app.js
```

## Examples of Features

* Single-Player:

![Single-Player](https://media.giphy.com/media/nARVPwDIpgMNlTMNhq/giphy.gif)




* Versus CPU/2-Player:

![CPU](https://media.giphy.com/media/Fl4T5NC9MKBG86vPWb/giphy.gif)




* Leaderboard (upload last run's score):

![Score](https://media.giphy.com/media/IpBeiaD4xwxBzY75pE/giphy.gif)


## Tech Stack

* JavaScript
* NodeJS
* TensorFlow JS
* MongoDB Atlas
