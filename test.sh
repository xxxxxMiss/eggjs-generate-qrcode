env=$1
echo "env $1"
if [ $env == 'test' ]; then
  echo 'xx.xx.xxx.xx hostname1 hostname2' >>/etc/hosts
elif [ $env == 'prod' ]; then
  echo 'xx.xx.xxx.xx hostname1 hostname2' >>/etc/hosts
fi
