#Create a layer from the node:lts Docker image.
FROM node:14-slim

LABEL company="AgroClim"
LABEL aplicacion="API - AgroClim"
LABEL version="1.0.0"
LABEL sector="TI"
LABEL leader="Matheus"
LABEL author="Matheus"
LABEL email="matheus.rdos@souunit.com.br"

#Copying SDK from local to the desired location

#Changing the Working directory
WORKDIR /usr/app


RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    && rm -rf /var/lib/apt/lists/*


#Copying the source code to /usr/app/src from current directory
COPY src/ .

# Create app directory
WORKDIR /app

# App
ADD . /app

# Install app dependencies
RUN cd /app

RUN npm install -g
EXPOSE  3000

CMD [ "npm", "start" ]
