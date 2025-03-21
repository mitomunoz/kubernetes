# Kubernetes - guía rápida

Este documento busca resumir la arquitectura de  Kubernetes, asi como los objetos y comandos mas comúnmente usados para manejar Kubernetes.

## Contenido

- [Kubernetes - guía rápida](#kubernetes---guía-rápida)
  - [Contenido](#contenido)
  - [Componentes de Kubernetes](#componentes-de-kubernetes)
  - [Control Plane](#control-plane)
    - [Control Manager](#control-manager)
    - [Cloud Control Manager](#cloud-control-manager)
    - [API server](#api-server)
    - [ETCD](#etcd)
    - [Scheduler](#scheduler)
  - [Node](#node)
    - [Kubelete](#kubelete)
    - [Kube Proxy](#kube-proxy)
  - [Addons](#addons)
    - [Addons para Networking y Políticas de Networking](#addons-para-networking-y-políticas-de-networking)
  - [Clusters en Kubernetes](#clusters-en-kubernetes)
  - [Deployments en Kubernetes](#deployments-en-kubernetes)
  - [Pods overview](#pods-overview)
  - [Node overview](#node-overview)
  - [Services overview](#services-overview)
  - [Scaling overview](#scaling-overview)
  - [Actualización continua (Rolling updates)](#actualización-continua-rolling-updates)
  - [Modelo de Objetos de Kubernetes](#modelo-de-objetos-de-kubernetes)
    - [Tipos de objetos](#tipos-de-objetos)
    - [Deployments](#deployments)
    - [Pods](#pods)
  - [Referencias](#referencias)

## Componentes de Kubernetes

![Diagrama de arquitectura de Kubernetes](images/components-of-kubernetes.svg)

- Control Plane
  - c-m   : Controller Manager
  - c-c-m : Cloud controller manager (opcional)
  - api   : API server
  - etcd  : Persistence store
  - sched : Scheduler
- Node
  - kubelet: Agente
  - k-proxy: kube-proxy
- Addons
  - DNS: DNS interno
  - Dashboard: Interfáz web de propósito general
  - Monitor de recursos: Despliega métricas sobre los contenedores
  - Registro del cluster: Centraliza los registros de log del los contenedores
  - Otros: [Visitar documentación oficial de Kubernetes](https://kubernetes.io/docs/concepts/cluster-administration/addons/)

## Control Plane

Componentes que toman decisiones globales sobre el cluster y sus eventos: creación de un pod para que cumpla la propiedad de réplicas.

### Control Manager

Componente encargado de correr los procesos de control

- Controlador de nodos: Notificar cuando se caen
- Controlador de Jobs: Monitorear objetos que representan tareas puntuales
- Controlador de Endpoints: Unión entre servicios y pods
- Controlador de Tokens y cuentas de servicio: Para el acceso a la API

### Cloud Control Manager

Permite enlazar con un proveedor de nube via la API de la nube

- Controlador de nodos: Idem arriba pero en la nube
- Controlador de rutas: Configura rutas en la nube subyacente
- Controlador de servicios: CRUD para balanceadores de carga de la nube
- Controlador de volúmenes: Crea, conecta, monta y orquesta volúmenes en la nube

### API server

Es el frontend de Kubernetes, recibiendo las peticiones y actualiza el estado en **etcd**

### ETCD

Almacenamiento de tipo clave-valor de alta disponibilidad que almacena la informacion de cluster

### Scheduler

Kube-scheduler es el componente de **Control Plane** encargado de crear nuevos Pods sin nodo asignado y seleccionar un **Node** para correrlo.

## Node

Componentes que se ejecutan en cada nodo

### Kubelete

Es el agente que corre en cada nodo del cluster y vela por la ejecución del contenedor en un Pod

### Kube Proxy

Proxy de red que corre en cadad nodo y es parte del concepto de servicio Kubenetes. 
Permite la comunicación entre los Pods dentro y fuera del cluster

## Addons

Addons usa los recursos de Kubernetes (DaemonSet, Deployment, etc) para implementar nuevas funcionalidaded en el cluster.

### Addons para Networking y Políticas de Networking

- Calico: Networking y network policy provider. Soporta opciones de networking mas flexibles y eficientes, incluyendo *non-overlay* y *overlay* networks.
- Para mas Addons, visite sito oficial de [Kubernetes](https://kubernetes.io/docs/concepts/cluster-administration/addons/)

---

## Clusters en Kubernetes

Conjunto de computadores conectados para trabajar como una unidad.
![Diagrama de un cluster](images/cluster.svg)

- Control Plane: Maneja el cluster, escala las applicaciones, despliega updates
- Node: Computador on VM que funciona como **worker** donde corren las applicaciones. Se comunican con Control Plane via API

> **El mínimo de nodos recomendados es 3**

## Deployments en Kubernetes

Un **deployment** es responsable de crear y actualizar las instancias de una applicación

![Deployment de una appicación](images/deployment.svg)

El **Deployment Controller** monitorea las instancias de tu aplicación continuamente.
Si el nodo que aloja la instancia se cae o se borra, el **Deployment Controller** reemplaza la instancia por otra instancia en otro Node en el cluster.
> **self-healing mechamism**

## Pods overview

Cuando se crea un **Deployment**, Kubernetes crea un Pod para alojar tu aplicación.
Un Pod es una abstracción que representa un grupo de uno o mas contenedores de aplicación y sus recursos compartidos tales como:

- Almacenamiento compartido como volúmenes
- Redes, como un único cluster de direcciones IP
- Información de como corre el contenedor, como por ejemplo: versión de la imagen o puertos.

![Pods overview](images/pod_overview.svg)

## Node overview

Un Pod siempre corre en un **Node**. Un Node es un *worker machine* (virtual o físico) dentro del cluster. 
Cada Node es manejado por el **control plane** y puede tener múltiples Pods.
![Node overview](images/node_overview.svg)

## Services overview
Un servicio es una abstracción que define un conjunto de Pods y las políticas para accesarlos.
Aúnque los Pods tienen si IP única, esta no es expuesta fuera del cluster sin un servicio que lo defina, permitiendo a las applicaciones recibir tráfico.

Los diferentes servicios se exponen con el *type* en la sección **ServiceSpec**
Los servicios agrupan lógicamente a los Pods usando **labels** y **selectors**. Aquí los labels se pueden usar por ejemplo, para:

- Designar diferentes objetos para desarrollo, test/qa y producción
- Embeber tags de versión
- Clasificar a los objetos usando tags.

![Service overview](images/service_overview.svg)

En resúmen:

- Exponen los Pods al tráfico externo
- Balancean el tráfico entre múltiples Pods
- Usan tablas

## Scaling overview

El escalamiento se logra cambiando el número de réplicas en la sección **deployment**

![Scaling overview](images/scaling_overview_1.svg)
![Scaling overview](images/scaling_overview_2.svg)

## Actualización continua (Rolling updates)

La actualización continua permite actualizar los **deployments** con *zero-downtime*
Si un **deployment** es público, el **service** balanceará la carga sólo hacia los Pods habilitados durante la actualización

![Rolling update 1](images/rollingupdates1.svg)
![Rolling update 2](images/rollingupdates2.svg)
![Rolling update 3](images/rollingupdates3.svg)
![Rolling update 4](images/rollingupdates4.svg)

Las actualizaciones contínuas permiten las siguientes acciones:

- Promover aplicaciones de un entorno a otro (vía actualización de imágenes)
- Volver a la versión anterior (**rollback**)
- CI/CD de aplicaciones con **zero-downtime**

[Tutorial oficial](https://kubernetes.io/docs/tutorials/kubernetes-basics/update/update-intro/)

## Modelo de Objetos de Kubernetes

Para describir un objeto Kubernetes se debe proveer el **spec** que describe el estado deseado y otra información básica como el nombre

### Tipos de objetos

A continuación se presenta una lista de los objetos mas comunes de Kubernetes

- Namespace
- Deployment : [Tutorial oficial](https://kubernetes.io/docs/tutorials/kubernetes-basics/deploy-app/deploy-intro/)
- Pod
- ReplicaSet : [Tutorial oficial](https://kubernetes.io/docs/tutorials/kubernetes-basics/scale/scale-interactive/)
- Label

### Deployments

Cuando se crea un deployment se require especificar:

- La imagen del contenedor para tu aplicación
- El número de réplicas que quieres que corran

Para crear un deployment usando **kubectl** 

```bash
kubectl create deployment hello-node --image=k8s.gcr.io/echoserver:1.4
kubectl get deployments
```

Ejemplo de un objeto **Deployment**

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
  labels:
    app: nginx
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.15.11
        ports:
        - containerPort: 80
```

### Pods

Ejemplo de un objeto **Pod**

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx-pod
  labels:
    app: nginx
spec:
  containers:
  - name: nginx
    image: nginx:1.15.11
    ports:
    - containerPort: 80
```

---

## Referencias

- [Kubernetes basics - sitio oficial](https://kubernetes.io/docs/tutorials/kubernetes-basics/)
- [Curso ultra-rapido del Pelao Nerd](https://www.youtube.com/watch?v=DCoBcpOA7W4)