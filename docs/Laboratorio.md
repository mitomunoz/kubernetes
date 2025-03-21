# Contenido

- [Contenido](#contenido)
  - [Instalación de Minikube](#instalación-de-minikube)
  - [Comandos para AWS EKS](#comandos-para-aws-eks)
  - [Comandos para administrar clusters](#comandos-para-administrar-clusters)

## Instalación de Minikube

Para desarrollo local es necesario instalar Dockers y activar Kubernetes o en su defecto instalar [Minikube]( https://minikube.sigs.k8s.io/docs/start/ )

- Para iniciar el servicio de Minikube
  
{%i include codeHeader.html %}

```bash
minikube start
```

- Para obtener la version de Minikube:

```bash
minikube version
```

- Para ver todos los PODs incluyendo los que usa minikube

``` bash
kubectl get pods -A
```

``` bash
NAMESPACE              NAME                                         READY   STATUS    RESTARTS   AGE
kube-system            coredns-558bd4d5db-n66wq                     1/1     Running   5          15d
kube-system            etcd-minikube                                1/1     Running   5          15d
kube-system            kube-apiserver-minikube                      1/1     Running   5          15d
kube-system            kube-controller-manager-minikube             1/1     Running   5          15d
kube-system            kube-proxy-h6ntt                             1/1     Running   5          15d
kube-system            kube-scheduler-minikube                      1/1     Running   5          15d
kube-system            storage-provisioner                          1/1     Running   11         15d
kubernetes-dashboard   dashboard-metrics-scraper-7976b667d4-rdpr7   1/1     Running   5          15d
kubernetes-dashboard   kubernetes-dashboard-6fcdf4f6d-6g8kr         1/1     Running   10         15d
```

- Para detener el servicio Minikube:

```bash
minikube stop
```

- Para obetener el estado del servicio:

```bash
minikube status  
```

- Para ver la version de kubectl

```bash
kubectl version
```

- Para obtener información del cluster

```bash
kubectl cluster-info
```

- Para obtener los nodos del cluster

```bash
kubectl get nodes
```

- Para ver el estado de los todos recursos (PODS):

```bash
kubectl get pods -A
```

- Para visualizar el dashboard:

```bash
minikube dashboard
```

- Para ver los addons instalados en tu minikube

```bash
minikube addons list
```

- Para activar los addons

```bash
minikube addons enable metrics-server
minikube addons enable dashboard
````

> Nota:
     Minikube es una implementación de Kubernetes que corre dentro de Dockers. 
     Para ver el contenedor de esta implementación en Dockers usar este comando:  
     docker ps

## Comandos para AWS EKS

- aws eks update-kubeconfig --region region-code --name cluster-name
  
## Comandos para administrar clusters

- kubectl get : lista de recursos
- kubectl describe: muestra información detallada de un recurso
- kubectl logs: muestra los logs para un contenedor en un Pod
- kubectl exec: Ejecuta comandos en un contenedor en un Pod

- Para ver los Pods desplegados

```bash
kubectl get pods
kubectl get pods -o wide
```

- Para obtener mayor información asociada a un Pod

```bash
kubectl get -o yaml  pod <pod-name>
kubectl get -o json  pod <pod-name>
```

- Para describir los Pods

```bash3
kubectl describe pods
```

- Uso de filtros basado en conjuntos
En el siguiente ejemplo se buscaran todos los PODS que tengan la clave environment igual a production
y la capa (tier) sea frontend

```bash
kubectl get pods -l 'environment in (production),tier in (frontend)'
```

- Para ver los Logs de un Pod

```bash
kubectl get logs $POD_NAME  #Donde $POD_NAME es una variable de entorno con el nombre del Pod obtenido en pasos anteriores
```

- Para ejecutar comandos en un Pod

```bash
kubectl exec $POD_NAME -- env  # Ejecuta el comando env para ver las variables de entorno del Pod

kubectl exec $POD_NAME -- bash # Abre una shell dentro del Pod
```

- Para ver los deployments, si desea obtener la salida en formato V1 de la API de Kubernetes, use .v1.apps

``` bash
kubectl get deployments
kubectl get deployments.v1.apps -o json
kubectl get deployments.v1.apps -o yaml
```

- Para eliminar un deployment usando el archivo obetenido arriba

```bash
kubectl delete -f <archivo-deployment>
```

- Para obtener los namespaces y por ejemplo los pods del sistema Kubernetes

```bash
kubectl get namespaces
kubectl --namespace=kube-system get pods
kubectl -n kube-system get pods
```

- Para obtener el **ReplicaSet** de un **deployment**

```bash
kubectl get rs
```

- Para obtener los controladores de replicación y los servicios

```bash
  kubectl get rc,services
```

- Para mas detalles de comando get

```bash
kubectl  get -h
```

- Para ver los valores de configuracion

```bash
kubectl config view
```

- Para forwardear comunicaciones entre el cluster y tu red privada (proxy)

```bash
kubectl proxy
```

-Para buscar nodos/pods que contengan un string especifico "109"

```bash
kubectl get nodes -o wide|grep "109"
```

- Para eliminar un nodo 

```bash
kubectl delete $NODO_NAME      # Donde $NODO_NAME es el nombre del nodo
```

- Para Bajar un deploy y dejarlo en un archivo "archivo.yaml"

```bash
kubectl get deployment $DEPLOY_NAME n- kube-system -o yaml > archivo.yaml
```
