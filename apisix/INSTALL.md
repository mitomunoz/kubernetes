# Instalación de APISIX Controller y Dashboard

```bash
APISIX_NAMESPACE="ingress-apisix"

helm repo add apisix https://charts.apiseven.com
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo update

#  We use Apisix 3.0 in this example. If you're using Apisix v2.x, please set to v2
ADMIN_API_VERSION=v3
helm install apisix apisix/apisix \
  --set service.type=NodePort \
  --set ingress-controller.enabled=true \
  --create-namespace \
  --namespace $APISIX_NAMESPACE \
  --set ingress-controller.config.apisix.serviceNamespace=$APISIX_NAMESPACE \
  --set ingress-controller.config.apisix.adminAPIVersion=$ADMIN_API_VERSION \
  --set plugins=[set-header]
  
kubectl get service --namespace $APISIX_NAMESPACE

# Para ver la URL de la API de APISIX
export NODE_PORT=$(kubectl get --namespace $APISIX_NAMESPACE -o jsonpath="{.spec.ports[0].nodePort}" services apisix-gateway)
export NODE_IP=$(kubectl get nodes --namespace $APISIX_NAMESPACE -o jsonpath="{.items[0].status.addresses[0].address}")
echo http://$NODE_IP:$NODE_PORT

```

## Para verificar que haya quedado instalado y funcionando

```bash
minikube service list
minikube service -n $APISIX_NAMESPACE apisix-gateway --url
curl -v --head http://127.0.0.1:64286/ |grep Server

```

## Para agreegar/activar plugins

```bash
helm upgrade apisix apisix/apisix \
  --set service.type=NodePort \
  --set ingress-controller.enabled=true \
  --create-namespace \
  --namespace $APISIX_NAMESPACE \
  --set ingress-controller.config.apisix.serviceNamespace=$APISIX_NAMESPACE \
  --set ingress-controller.config.apisix.adminAPIVersion=$ADMIN_API_VERSION \
  --set plugins={set-header}
```

## Para administrar via API

```bash
export admin_key="edd1c9f034335f136f87ad84b625c8f1"
minikube service -n $APISIX_NAMESPACE apisix-admin --url

# Listado de plugins
curl http://127.0.0.1:58932/apisix/admin/plugins/list -H "X-API-KEY: $admin_key" -X GET
```

## Instalación del dashboard

```bash
helm repo add apisix https://charts.apiseven.com
helm repo update
helm install apisix-dashboard apisix/apisix-dashboard --create-namespace --namespace $APISIX_NAMESPACE

minikube service -n $APISIX_NAMESPACE apisix-dashboard --url
```

## Desinstalación

```bash
helm uninstall -n apisix apisix

```
