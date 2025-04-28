#!/usr/bin/env bash
# start.sh – rebuild BrowserQuest image and (re-)deploy the Swarm stack
# Place this file in the project root (same dir as Dockerfile).

set -euo pipefail

STACK=browserquest
IMAGE_TAG=browserquest:latest
COMPOSE_FILE=docker-compose.yml

# ────────────────────────────────────────────────────────────────────
# 1. Remove any previous stack (ignore error if it never existed)
# ────────────────────────────────────────────────────────────────────
echo "Removing old stack (if any)…"
docker stack rm "$STACK" || true

# Wait until Swarm forgets the stack (avoid “name already exists”)
while docker stack ls --format '{{.Name}}' | grep -q "^${STACK}$"; do
  sleep 2
done

# ────────────────────────────────────────────────────────────────────
# 2. Make sure this node is a Swarm manager
# ────────────────────────────────────────────────────────────────────
if ! docker info --format '{{.Swarm.LocalNodeState}}' | grep -q '^active$'; then
  echo "Initialising single-node Docker Swarm…"
  docker swarm init
fi

# ────────────────────────────────────────────────────────────────────
# 3. Build / rebuild the game server image
# ────────────────────────────────────────────────────────────────────
echo "Building image → ${IMAGE_TAG} …"
docker build -t "$IMAGE_TAG" .

# ────────────────────────────────────────────────────────────────────
# 4. Deploy the HA stack
# ────────────────────────────────────────────────────────────────────
echo "Deploying stack from ${COMPOSE_FILE} …"
docker stack deploy -c "$COMPOSE_FILE" "$STACK"

# ────────────────────────────────────────────────────────────────────
# 5. Wait until every service reaches desired replicas
# ────────────────────────────────────────────────────────────────────
echo "Waiting for services to become healthy…"
until docker service ls --filter label=com.docker.stack.namespace="$STACK" \
        --format '{{.Replicas}}' | grep -vqE '0/|[0-9]+/[0-9]+'; do
  sleep 2
done

echo "Stack '${STACK}' is up:"
docker service ls --filter label=com.docker.stack.namespace="$STACK"

echo "Open http://localhost to play!"