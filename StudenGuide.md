# Guía de Estudio: Introducción a Kubernetes

## I. Conceptos Fundamentales

- Docker y Contenedores: Explica qué es Docker y cómo facilita el empaquetamiento y ejecución de aplicaciones.
- Describe el concepto de un contenedor y sus beneficios en comparación con las máquinas virtuales tradicionales.
- ¿Por qué Docker es un prerrequisito importante para entender Kubernetes?
- Orquestación de Contenedores: Define qué es un orquestador de contenedores y cuál es su propósito principal.
- ¿Por qué la orquestación se vuelve esencial al manejar múltiples contenedores en muchos servidores?
- Menciona el problema principal que Kubernetes busca resolver en este contexto.
- Kubernetes: ¿Qué es Kubernetes y quién lo creó originalmente? ¿Cuál es su estado actual en términos de licencia?
- Describe los beneficios clave que ofrece Kubernetes, como la alta disponibilidad y la escalabilidad.
- Explica cómo Kubernetes logra la alta disponibilidad de las aplicaciones.
- ¿Qué significa la capacidad de "escalar" aplicaciones en Kubernetes?
- ¿Cómo aborda Kubernetes la recuperación ante desastres (disaster recovery)?

### Arquitectura de Kubernetes

- Identifica y describe los dos grandes grupos de componentes en la arquitectura de Kubernetes.
- Nodos (Workers): ¿Qué es un "worker" o nodo en Kubernetes?
- ¿Qué es kubelet y cuál es su función en un nodo worker?
- ¿Qué es un "Pod"? Describe su composición y la relación entre contenedores dentro de un Pod.
- ¿Por qué se dice que los Pods son "volátiles"? ¿Qué implicaciones tiene esto?
- ¿Qué es una "overlay network" y qué problema resuelve en Kubernetes?
- Maestros (Masters): Nombra y describe la función de los siguientes componentes del plano de control (Masters):
  - kube-apiserver
  - kube-controller-manager
  - kube-scheduler
  - etcd
- Servicios de Kubernetes: ¿Por qué no es recomendable acceder a los Pods directamente a través de sus IPs?
- ¿Qué es un "Servicio" en Kubernetes y cuál es su propósito principal?
- Describe la característica principal de un servicio de tipo ClusterIP.
- ¿Cómo relaciona un Servicio los Pods que ejecutan una aplicación? ¿Qué concepto se utiliza para esto?
- Menciona y describe brevemente otros tipos de servicios mencionados en el texto (LoadBalancer, Ingress, NodePort).
- Manifestos Declarativos: ¿Cómo se gestiona la configuración y la creación de recursos en Kubernetes?
- ¿Qué es un "Deployment" en Kubernetes?
- ¿Cuál es la función del kube-controller-manager en relación con los Deployments?
- Casos de Uso y Adopción:¿En qué escenarios se vuelve particularmente útil el uso de Kubernetes, según el autor?
- ¿Qué ejemplo práctico proporciona el autor sobre la necesidad de un orquestador como Kubernetes?
- Nombra algunos proveedores de Kubernetes mencionados en el texto.
- ¿Qué se puede utilizar para practicar con Kubernetes de forma local?

## II. Quiz

- Explica brevemente la relación entre Docker y Kubernetes. ¿Por qué el conocimiento de Docker es útil para entender Kubernetes?
- ¿Cuál es el principal problema que Kubernetes busca resolver al gestionar aplicaciones contenerizadas en un entorno con muchos servidores?
- Describe cómo Kubernetes implementa la alta disponibilidad para las aplicaciones en ejecución. ¿Qué sucede cuando una instancia de una aplicación falla?
- ¿Qué es un Pod en Kubernetes? ¿Cuál es la práctica más común en cuanto al número de contenedores que se ejecutan dentro de un Pod?
- Explica la función del kube-apiserver en la arquitectura de Kubernetes. ¿Cómo interactúan los usuarios y otros componentes con él?
- ¿Cuál es el propósito de un "Servicio" de Kubernetes? ¿Por qué es preferible usar Servicios en lugar de las IPs directas de los Pods?
- Describe brevemente qué es un "Deployment" en Kubernetes y cuál es su relación con la creación de Pods.
- Menciona al menos tres componentes principales del plano de control (Masters) de Kubernetes y describe brevemente la función de cada uno.
- ¿Qué significa que Kubernetes utiliza "manifiestos declarativos"? ¿Cómo se aplica esto en la práctica?
- Según el autor, ¿en qué tipo de entornos o con qué escala de infraestructura se vuelve particularmente recomendable el uso de Kubernetes?

## III. Clave de Respuestas del Quiz

- Docker es una herramienta para crear y ejecutar aplicaciones en contenedores, mientras que Kubernetes es un orquestador que gestiona estos contenedores a gran escala. Conocer Docker es útil porque Kubernetes orquesta contenedores creados con Docker.
- Kubernetes resuelve la complejidad de manejar muchos contenedores distribuidos en múltiples servidores, proporcionando herramientas para automatizar el despliegue, la escalabilidad, la gestión de recursos y la disponibilidad de las aplicaciones.
- Kubernetes logra la alta disponibilidad creando réplicas de las aplicaciones (Pods). Si un Pod falla, Kubernetes automáticamente dirige el tráfico a las réplicas saludables y puede programar nuevas instancias para reemplazar las fallidas.
- Un Pod es la unidad más pequeña y básica en Kubernetes, representando un grupo de uno o más contenedores que comparten recursos de red y almacenamiento. La práctica más común es ejecutar un solo contenedor por Pod.
- El kube-apiserver es el punto de entrada principal para interactuar con el clúster de Kubernetes. Expone una API que permite a los usuarios, la CLI (kubectl) y otros componentes del sistema comunicarse y realizar acciones en el clúster.
- Un Servicio de Kubernetes abstrae un conjunto de Pods que ejecutan una aplicación, proporcionando una IP estable y un punto de acceso único para acceder a ellos. Es preferible usar Servicios porque las IPs de los Pods son efímeras y pueden cambiar.
- Un Deployment es un objeto de Kubernetes que proporciona una forma declarativa de describir cómo deben crearse y actualizarse las instancias de una aplicación (Pods). El kube-controller-manager se encarga de mantener el estado deseado definido en el Deployment, creando o eliminando Pods según sea necesario.
- kube-apiserver: Expone la API de Kubernetes.
- kube-controller-manager: Gestiona los diferentes controladores que regulan el estado del clúster.
- kube-scheduler: Asigna los nuevos Pods a los nodos disponibles en el clúster.
- Utilizar manifiestos declarativos significa que los usuarios definen el estado deseado de su infraestructura y aplicaciones en archivos de configuración. Kubernetes se encarga de alcanzar y mantener ese estado, en lugar de requerir instrucciones paso a paso.
- El uso de Kubernetes se vuelve particularmente recomendable en entornos con un gran número de contenedores y servidores, donde la gestión manual sería inviable, y se requiere alta disponibilidad, escalabilidad y automatización en el despliegue y la operación de las aplicaciones.

## IV. Preguntas para Ensayo

- Describe en detalle la arquitectura de Kubernetes, explicando la función de los componentes principales del plano de control (Masters) y los nodos (Workers), y cómo interactúan entre sí para gestionar aplicaciones contenerizadas.
- Analiza los beneficios clave que Kubernetes ofrece en la gestión de aplicaciones en la nube o en infraestructuras complejas. - - Considera aspectos como la escalabilidad, la alta disponibilidad, la gestión de recursos y la recuperación ante fallos.
- Compara y contrasta el uso de Docker con el uso de Kubernetes. ¿En qué escenarios es más apropiado utilizar Docker solo, y cuándo se vuelve esencial la adopción de un orquestador como Kubernetes?
- Explica el concepto de "Servicio" en Kubernetes y describe los diferentes tipos de servicios mencionados en el texto. Discute la importancia de los servicios para habilitar la comunicación y el acceso a las aplicaciones dentro y fuera del clúster.
- Discute la importancia de la naturaleza declarativa de Kubernetes, utilizando el concepto de "Deployment" como ejemplo. ¿Cómo simplifica este enfoque la gestión y el despliegue de aplicaciones en comparación con enfoques más imperativos?

