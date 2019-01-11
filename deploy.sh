echo "Pulling from Master" 
pm2 stop all
git pull
pm2 start all
echo "Pulled successfully from master"