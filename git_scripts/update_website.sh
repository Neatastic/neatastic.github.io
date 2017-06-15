cd ..
git add .
echo "----------------------------------"
echo "Mise à jour du site REMOSCO"
echo "----------------------------------"
echo 'Entrez le nom de la mise à jour:'
read commitMessage

git commit -m "$commitMessage"

git push origin master

read
