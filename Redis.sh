#!/bin/bash
# print inti
echo "      welcome to redis cli example."
echo "^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^"

# Run Redis commands inside the Docker container
# docker exec -it bedf0e03425a redis-cli 
# docker run -d --name redis-stack -p 6379:6379 -p 8001:8001 redis/redis-stack:latest
# Check if the container exists
if [ "$(docker ps -aq -f name=redis-stack)" ]; then
    # Check if the container is running
    if [ "$(docker ps -q -f name=redis-stack)" ]; then
        echo "Container 'redis-stack' is already running."  
    else
        echo "Starting existing container 'redis-stack'."
        docker start redis-stack
    fi
else
    echo "Running a new container 'redis-stack'."
    docker run -d --name redis-stack -p 6379:6379 -p 8001:8001 redis/redis-stack:latest
fi

docker exec -it redis-stack redis-cli 