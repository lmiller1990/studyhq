LAMBDA=arn:aws:lambda:ap-southeast-2:897026049633:function:nuxtgithub

aws lambda update-function-code --function-name $LAMBDA --zip-file fileb://lambda.zip
aws lambda publish-version --function-name $LAMBDA

# S3

aws s3 rm s3://lachlannuxttest/_nuxt --recursive
aws s3 cp .output/public/_nuxt/ s3://lachlannuxttest/_nuxt --recursive