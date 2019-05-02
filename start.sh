env=$1

if [ $env == 'test' ]; then
  echo 'xx.xx.xxx.xx hostname1 hostname2' >>/etc/hosts
elif [ $env == 'prod' ]; then
  echo 'xx.xx.xx.xx hostname1 hostname2' >>/etc/hosts
fi

export EGG_SERVER_ENV=$env

npm run docker-start
