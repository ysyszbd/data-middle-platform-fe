kubectl config use-context dev
current=`date "+%Y-%m-%d %H:%M:%S"`
timeStamp=`date -d "$current" +%s`
BUILD_NUMBER=$timeStamp
rm -rf dist
npm run build
docker build -t 192.168.1.21/data-middle-platform/frontend:$BUILD_NUMBER .
docker push 192.168.1.21/data-middle-platform/frontend:$BUILD_NUMBER
docker rmi 192.168.1.21/data-middle-platform/frontend:$BUILD_NUMBER
cp frontend-dev.yaml frontend-dev-temp.yaml
sed -i "s/BUILD_NUMBER/$BUILD_NUMBER/g"  frontend-dev-temp.yaml
kubectl apply -f frontend-dev-temp.yaml
rm frontend-dev-temp.yaml
