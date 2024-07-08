yarn patch-package 
yarn nuxt build 

export LATEST_HASH=$(git rev-parse HEAD)
echo "Latest hash $LATEST_HASH"
echo "Adding to output..."

# add hash for debugging and checking what commit is deployed
find ./.output/server/chunks -type f -exec sh -c '
  for file do
    sed -i "s/LATEST_HASH/$LATEST_HASH/g" "$file"
  done
' find-sh {} +

# make sure it worked!
if [ -z "${LATEST_HASH}" ]; then
  echo "LATEST_HASH is unset or empty; exiting."
  exit 1
fi

echo "🎉 Inserted latest_hash: $LATEST_HASH!"

grep -R $LATEST_HASH ./.output/server/chunks 

aws s3 cp .output/public/_nuxt/ s3://lachlannuxttest/_nuxt --recursive