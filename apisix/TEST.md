# Pruebas con Minikube

## Despliegue de una pieza de pruebas

```bash

# Definición del NS para pruebas
NAMESPACE="test-apisix"
kubectl create namespace $NAMESPACE

# Despliegue de la pieza Hello
kubectl apply -n $NAMESPACE -f 01-hello-app-v1.yaml
kubectl get services -n $NAMESPACE

# Prueba de la pieza (cambie el puerto según sea el caso)
SERVICE_PORT=55737
minikube service -n $NAMESPACE hello-v1-svc  --url
curl http://127.0.0.1:$SERVICE_PORT
```

## Despliegue de los Ingress NGINX y APISIX

Con este ejemplo podemos crear 2 ingress diferentes para acceder al mismo servicio

```bash
kubectl apply -n $NAMESPACE -f 02-ingress.yaml
kubectl get ingress -n $NAMESPACE 

# Revision del Ingress NGINX
minikube service list
minikube service -n $NAMESPACE hello-v1-svc --url
INGRESS_NGINX="hello-v1-nginx.minikube.local"
curl -v -H "Host: $INGRESS_NGINX" http://127.0.0.1:$SERVICE_PORT


# Revision del Ingress APISIX
minikube service list
minikube service -n ingress-apisix apisix-gateway --url

APISIX_PORT=56067
INGRESS_APISIX="hello-v1-apisix.minikube.local"
curl -v -H "Host: $INGRESS_APISIX" http://127.0.0.1:$APISIX_PORT
``` 

## Depliegue Ingress customizado reescribiendo Headers

En este caso podemos usar notaciones para agregar headers clave-valor a la respuesta, asi como cambiar el código de
retorno del servicio. Por ejemplo, forzando un 404 para remover el servicio de estado activo

```bash
kubectl apply -n $NAMESPACE -f 03-ingress-plugin.yaml
curl -v -H "Host: $INGRESS_APISIX" http://127.0.0.1:$APISIX_PORT
```

## Instalación del Ruteo con limitacion de llamadas durante una ventana de tiempo (Rate-Limits)

Es este ejamplo creamos una ruta por sobre el servicio para limitar el numero de llamdas a un servicio.
Por ejemplo, con 5 llamadas cada 10 segundos

``` bash
kubectl apply -n $NAMESPACE -f 04-apisixroute-limitcount.yaml
kubectl get apisixroutes -n $NAMESPACE

curl -v -H "Host: hello-v1-apisixroute.minikube.local" http://127.0.0.1:$APISIX_PORT

```

---
## Referencias
- https://apisix.apache.org/docs/ingress-controller/concepts/annotations