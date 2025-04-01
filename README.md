# Project Setup

## Starting the Project

To start the project, run the following command:

```bash
npm run dev

```

This command will:

Read the .env file to load the environment variables.

Auto-restart the application whenever the code is updated, similar to nodemon
but without using any external libraries.

Hosting on Firebase Functions

For information on how to deploy this project to Firebase Functions, check out the following video tutorial:

Watch Firebase Functions Hosting Tutorial : https://www.youtube.com/watch?v=VStXlFxQgZg



current Infrastructure:-

Frontend Details:- 
The frontend is a Angular 19 SSR app (standalone component by default) which is hosted on three locations server, as the target audience is distributed all around the world. The location of the three frontend servers are: 
1. dyc-ssr-us-central1-lowa
2. dyc-ssr-asia-east1-taiwan
3. dyc-ssr-europe-west4-nethrland

The front end is hosted on firebase app hosting for next gen apps that is designed for auto detection and handling all the contents of a SSR app. I am using firebase hosting free tier. And inside the firebase app hosting console, I have setup auto deployment to all three of these servers whenever there is a new push to my git repo. All three servers are connected to exact same Git repo.

Database Details:-
The database is Mongodb. I used mongoDb Atlas Free Tier and used GCP as my choice of servers. The server locations are:-
1. Asia-GCP-East1-Taiwan
2. Europe-GCP-West1-Belgium
3. US-GCP-Central1-Lowa

Backend-Api Details :-
I have used firebase functions for deploying my backend express app. I had to make some changes to my express app because firebase functions are serverless. I had
to remove app.listen and instead use firebase syntax. The backend is located on the same region as database region to avoid backend-db latency. However, db uses atlas and backend uses firebase servers but both are GCP and also the same regions.
1. api_dyc_asia_east1_taiwan
2. api_dyc_europe_west1_belgium
3. api_dyc_us_central1_lowa

I have used github actions workflow to auto deploy to firebase functions whenever there is any new push to the github. Also, the taiwan backend api is hardcoded to be always connected with taiwan mongodb atlas. Us central 1 backend api with the us central 1 backend api. And the Belgium backend api always connected with belgium database. The connection between backend api and db servers are made through Mongo URI. 
