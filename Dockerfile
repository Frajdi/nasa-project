# Selecting the latest node version available in linux lts meaning latest, 
# alpine the linux version with the minimal amount of packages needed to run the application.
FROM node:lts-alpine

# Selecting the work directory in the container which in these case we call app (can call it anything).
WORKDIR /app

# This copies everything from the root of our project where the dockerfile is in to 
# the root of app we crated above. The star we put after package means to copy all the files that will
# start with package and end with .json (in our case package.json & package-lock.json)
# But since our app is runing in linux on on node alpine latest it might couse issues with the version of the packages
# if that happens we remove the * so it only copies the package.json and it will create its own lock file.
COPY package*.json /app

# This will install only the packages that needed for the production environement so we are omiting the dev dependecies
# and will copy only the package json for client to client in the container.
COPY client/package*.json client/
RUN npm run client-install --omit=dev

# This is the same as in the client but now for the server
COPY server/package*.json server/
RUN npm run server-install --omit=dev

# Copying everything inside the clients folder in the clients folder since now we have all the packages we need for it. 
COPY client/ client/

# This will run the build command in our front-end.
RUN npm run build-docker --prefix client

# Copying all all the content from server to the container with the same folder name since 
# now we have there also the public folder of the clients build.
COPY server/ server/

# Its safer to give only the user premissions needed to run the app so not tu run as root.
USER node

# This will run the command in the cmd to run our application 
CMD ["npm", "start", "--prefix", "server"]

# This will expose the port 8000 from our container so when we run the app throught
# the container it will run on port 8000 as we sen on our env file in the backend 
# and here we are exposing that port from the container to our machine or any machine 
# it will be runing on so we can access the application runinng in the conatiner
EXPOSE 8000
