#!/bin/bash

PROJECT_ID="you-niverse-447615"
IMAGE_NAME="you-niverse-backend"
SERVICE_NAME="you-niverse-app"
REGION="asia-northeast3"

# Re-create new builder and activate it
# docker-buildx rm multiarch 2>/dev/null
docker-buildx create --name multiarch --use
docker-buildx inspect --bootstrap

# Build multi architecture image
docker buildx build \
    --platform linux/amd64,linux/arm64 \
    -t gcr.io/$PROJECT_ID/$IMAGE_NAME \
    --push .

# Build Docker image
# docker build -t gcr.io/$PROJECT_ID/$IMAGE_NAME .

# Push Docker image
# docker push gcr.io/$PROJECT_ID/$IMAGE_NAME

# Deploy Cloud Run
gcloud run deploy $SERVICE_NAME \
  --image gcr.io/$PROJECT_ID/$IMAGE_NAME \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated
