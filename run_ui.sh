#!/bin/bash

docker run -d \
  --name public-pool-ui \
  --restart unless-stopped \
  -p 8081:80 \
  -e DOMAIN=blitzpool.yourdevice.ch \
  -v /home/blitzpool/blitzpool_version/commit.txt:/var/www/html/commit.txt:ro \
  public-pool-ui
