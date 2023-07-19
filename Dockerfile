FROM node:14.18.3-alpine

# Set Environment variables
ENV appDir /var/www/app

RUN apk --update --no-cache add build-base python3 bash git subversion openssh-client ca-certificates

# Set the work directory
RUN mkdir -p ${appDir}
WORKDIR ${appDir}

# Copy the package.json and yarn.lock files to the working directory
COPY package.json ${appDir}/package.json
COPY yarn.lock ${appDir}/yarn.lock

# Install project dependencies
RUN yarn install

# Copy the entire project directory to the working directory
COPY . ${appDir}

# Build the frontend
RUN yarn build

# Install npm dependencies and install ava globally
RUN yarn global add @vue/cli

RUN yarn cache clean

# Expose port
EXPOSE 8080

# Start the server
CMD ["yarn", "run", "serve"]
