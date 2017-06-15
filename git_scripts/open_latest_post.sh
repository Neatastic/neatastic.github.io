cd ..
cd _posts
latest_post=`ls -t * | head -1`
echo $latest_post

atom --disable-gpu -w "$latest_post"
read test
