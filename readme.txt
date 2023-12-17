###########
HOW TO SET UP AND BUILD GUIDE
###########
The following steps are showing how to install the app.

We are choosing the Lubuntu 20.4.1 LTS virtual machine image to host our system. And this guide assumes that is the machine the system is tested on.

###########
PACKAGES AND OTHER DEPENDENCIES ON Lubuntu
###########

1. If the system does not have Curl installed, run the following command in terminal:

sudo apt install curl


2. The system needs to have NodeJS and NPM installed. If it doesn’t, run the following commands:

curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -

sudo apt-get install -y nodejs


##############
RUNNING THE APPLICATION
##############

1. Navigate to root folder of project and open two terminals, one for backend and one for frontend.

2. Go to the backend folder by running the command

cd backend

3. Run the following command to install necessary PACKAGES for backend

npm install 

4. To start the server run the command

node server.js 

5. In the other terminal, go to the frontend folder by running the following command 

cd frontend 

6. Run the following command to install necessary PACKAGES for frontend

npm install 

7. Run the following command to start the frontend application 

npm start