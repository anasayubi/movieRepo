# MovieRepo
A simple single page application (SPA) that allows a user to add, edit and remove movies from a local database. Created for the purpose of exploring SPAs made with the MEAN stack framework.

The entire project is divided into two directories:
1) Frontend (Angular.js, HTML, CSS) - contains the SPA logic
2) Backend (Node.js, Express.js, MongoDB) - contains the server/database logic executed on HTTP calls

Both frontend and backend will run on their own respective server instances:
1) Frontend will run on port 9006
2) Backend will run on port 9000   

To run the project run the following commands on your linux terminal:
1) git clone https://github.com/anasayubi/movieRepo
2) cd movieRepo/backend
3) npm install
4) node index.js  

Open a new linux terminal in 'movieRepo' and:  
1) cd frontend
2) npm install
3) node server.js
