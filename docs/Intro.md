# Introducción

- [Introducción](#introducción)
  - [Dockers](#dockers)
  - [El Problema que Resuelve Kubernetes: La Orquestación de Contenedores a Escala](#el-problema-que-resuelve-kubernetes-la-orquestación-de-contenedores-a-escala)
  - [¿Qué es Kubernetes? Un Orquestador de Contenedores con Beneficios Clave](#qué-es-kubernetes-un-orquestador-de-contenedores-con-beneficios-clave)
  - [Arquitectura Básica de Kubernetes: Masters y Workers](#arquitectura-básica-de-kubernetes-masters-y-workers)
  - [Conceptos Clave: Pods, Servicios y Manifiestos Declarativos](#conceptos-clave-pods-servicios-y-manifiestos-declarativos)
  - [Casos de Uso y Consideraciones para la Adopción](#casos-de-uso-y-consideraciones-para-la-adopción)

## Dockers

Docker es una plataforma de software que permite empaquetar aplicaciones y sus dependencias en "contenedores", que son unidades portátiles y ligeras.

Esto significa que puedes crear un entorno consistente para tu aplicación, independientemente del sistema operativo en el que se ejecute.

Docker simplifica el desarrollo, la implementación y la administración de aplicaciones, ya que elimina las inconsistencias entre los entornos de desarrollo, pruebas y producción.

## El Problema que Resuelve Kubernetes: La Orquestación de Contenedores a Escala

Sin embargo, surge un desafío significativo al manejar un gran número de contenedores distribuidos en múltiples servidores.

¿Qué pasa si tienes que manejar esos contenedores en muchos servidores? Tal vez en decenas, cientos o incluso miles de servidores

Aquí se introduce la necesidad de un orquestador como Kubernetes, cuya función principal es gestionar aplicaciones en contenedores a través de una infraestructura de múltiples servidores (virtuales o físicos).

## ¿Qué es Kubernetes? Un Orquestador de Contenedores con Beneficios Clave

Kubernetes se define como una herramienta de orquestación de contenedores creada por Google y actualmente de código abierto. El principal problema que resuelve es la gestión de muchos contenedores en muchos nodos. Además, proporciona:

- **Alta Disponibilidad (High Availability)**: Mediante la creación de réplicas de las aplicaciones.
"La forma en que kubernetes brinda esa alta disponibilidad es creando réplicas de tu aplicación, así se puede tener varias copias de tu aplicación y si una de esas copias deja de funcionar kubernetes va a mandar el tráfico a la que está funcionando.Todo esto de forma transparente para el usuario que está visitando tu aplicación
- **Escalabilidad**: Permite aumentar o disminuir el número de copias de una aplicación según la demanda.
"también te permite escalar o sea crear copias de tu aplicación en en el caso de que tengas más tráfico o que quieras por alguna razón tener más capacidad para recibir ese tráfico."
- **Recuperación ante Desastres (Disaster Recovery)**: Facilita la recreación de aplicaciones fallidas gracias a su naturaleza basada en manifiestos declarativos. "también se encarga de todo lo que es disaster recovery ya que es muy fácil volver a crear las aplicaciones que se murieron porque todo es basado en manifiestos declarativos."

## Arquitectura Básica de Kubernetes: Masters y Workers

La arquitectura fundamental de Kubernetes está dividida en dos componentes principales:

- **Masters**: El plano de control del clúster. Incluyen componentes clave como:
- **API Server**: Expone una interfaz para interactuar con Kubernetes (a través de la interfaz web, otros clientes o kubectl).
"el Api server la que se encarga de exponer una interfaz para que diferentes clientes puedan interactuar con kubernetes por ejemplo interfaces web eh otros clientes que hacen llamadas a la Api o el cliente de kubernet que se llama kubectl"
- **Controller Manager**: Supervisa el estado del clúster y asegura que se cumpla el estado deseado.
"el controller manager es el que maneja lo que pasa en el clúster sí está todo el tiempo al tanto de los contenedores que están corriendo y los contenedores que tienen que estar corriendo"
- **Scheduler**: Asigna los pods a los nodos disponibles.
"el scheduler lo que hace es recibir las órdenes del controller manager y mueve los pods de lugar en lugar otro"
- **etcd**: Una base de datos distribuida que almacena el estado y la configuración del clúster.
"Todo esto va guardado en una base de datos que se llama etcd. Esa base de datos no solamente tiene el Estado de tu clúster de kubernetes sino que tiene toda la información y todas las configuraciones de tu claster"
- **Workers (Nodos)**: Donde se ejecutan las aplicaciones en contenedores dentro de los Pods. Cada worker ejecuta un agente llamado kubelet. "En los nodos o los workers es donde vamos a correr los pods de tu aplicación. Un Pod es un set de contenedores que tiene un solo IP o mejor dicho comparten el namespace de red lo más normal es correr un solo contenedor en cada Pod, pero hay casos donde corres más de uno ya que podemos dividir algunas tareas"

## Conceptos Clave: Pods, Servicios y Manifiestos Declarativos

Conceptos esenciales para entender cómo funcionan las aplicaciones en Kubernetes:

- **Pods**: La unidad básica de ejecución en Kubernetes, que puede contener uno o más contenedores que comparten recursos de red y almacenamiento. Se enfatiza que los pods son volátiles y se reemplazan durante las actualizaciones.
"lo que hay que tener en cuenta es que estos pods son volátiles o sea cuando haces un deploy por ejemplo para cambiar la versión los pods se destruyen y se crea uno nuevo"
- **Overlay Network**: Una red que permite la comunicación entre pods sin importar en qué nodo se encuentren.
"a través de todos nuestros nodos tenemos algo que se le llama una overlay Network que lo que permite Es compartir una red entre todos los pods no importa en qué nodo estén sí Entonces el pod A puede llegar al pod B, por más que estén en diferentes nodos"
- **Servicios**: Abstracciones que proporcionan una IP estable y un mecanismo para acceder a los pods, ya que las IPs de los pods son efímeras. Existen diferentes tipos de servicios como ClusterIP, LoadBalancer, Ingress y NodePort.
"lo que se hace Generalmente es crear algo que se llama servicio, un servicio de kubernetes hay varios tipos de servicios pero los más comunes son los que se llaman claser IP que se caracterizan por tener un IP que nunca cambia entonces en lugar de ir de pod a pod, vas de un pod a un servicio y ese servicio tiene como backend los pods que corren tu aplicación. El servicio encuentra esos pots basado en un set de reglas o etiquetas que se ponen a tus pods para que el servicio los pueda encontrar"
- **Manifiestos Declarativos**: La forma en que se define el estado deseado de las aplicaciones y la infraestructura en Kubernetes (generalmente en archivos YAML). Por ejemplo, un Deployment es un template para crear pods.
"Kubernetes se maneja con manifiestos declarativos. Así entonces, por ejemplo se peude crear un manifiesto que tenga una un template de tu aplicación y este tipo de template se le dice deployment. Kubernetes y el controller manager se encarga de crear esos pods en todo tu clúster usando esa definición"

## Casos de Uso y Consideraciones para la Adopción

Recomendable en entornos de gran escala (3000 servidores y ~100 pods por servidor, donde existe la necesidad de un orquestador como Kubernetes.
