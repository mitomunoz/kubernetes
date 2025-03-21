# Pruebas con Minikube

## Despliegue de una pieza de pruebas

```bash

# Definición del NS para pruebas
NAMESPACE="test-apisix"
kubectl create namespace $NAMESPACE

# Despliegue de la pieza Hello
kubectl apply -n $NAMESPACE -f 01-hello-app-v1.yaml
kubectl get services -n $NAMESPACE

```

## Despliegue de los Ingress NGINX y APISIX

```bash
kubectl apply -n $NAMESPACE -f 02-ingress.yaml
kubectl get ingress -n $NAMESPACE 

# Revision del Ingress NGINX
minikube service list
minikube service -n $NAMESPACE hello-v1-svc --url
INGRESS_NGINX="hello-v1-nginx.minikube.local"
curl -v -H "Host: $INGRESS_NGINX" http://127.0.0.1:52875


# Revision del Ingress APISIX
minikube service list
minikube service -n ingress-apisix apisix-gateway --url
INGRESS_APISIX="hello-v1-apisix.minikube.local"
curl -v -H "Host: $INGRESS_APISIX" http://127.0.0.1:59067
``` 

## Depliegue Ingress customizado reescribiendo Headers

```bash
kubectl apply -n $NAMESPACE -f 03-ingress-plugin.yaml
curl -v -H "Host: $INGRESS_APISIX" http://127.0.0.1:5906
```

## Instalación del Ruteo con limitacion de llamadas durante una ventana de tiempo (Rate-Limits)

``` bash
kubectl apply -n $NAMESPACE -f 03-apisixroute.yaml
kubectl get apisixroutes -n $NAMESPACE

curl -v -H "Host: hello-v1-apisixroute.minikube.local" http://127.0.0.1:59067

```

---
## Referencias
- https://apisix.apache.org/docs/ingress-controller/concepts/annotations