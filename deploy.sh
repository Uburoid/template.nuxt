echo "Pulling from Master" 

git pull origin master

echo "Pulled successfully from master"

echo "Restarting server..."

pm2 start

echo "Server restarted Successfully"