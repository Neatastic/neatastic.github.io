cd ..
cd _posts
# first, we count how many post we do have
numfiles=$(ls -l | grep -v ^d | wc -l)
# second we detault the date to the current day
now="$(date +'%Y-%m-%d')"
cd ..
# third we copy the new post from the post model
cp ./models/post.markdown ./_posts/"$now""-post""$numfiles"".markdown"
wait 20000
# And finally, we open it with atom. --disable-gpu is related to virtualbox
echo atom --disable-gpu "$now"-post"$numfiles".markdown
cd _posts
atom --disable-gpu -w "./""$now""-post""$numfiles"".markdown"
read test
