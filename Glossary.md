# Glosario de Términos Clave

- **Contenedor**: Una unidad de software estandarizada que empaqueta código, dependencias y configuraciones, permitiendo que una aplicación se ejecute de manera rápida y confiable en diferentes entornos.
- **Docker**: Una plataforma de código abierto que permite a los desarrolladores empaquetar aplicaciones en contenedores, facilitando su portabilidad y despliegue.
- **Orquestador de Contenedores**: Una herramienta que automatiza el despliegue, la gestión, la escalabilidad y la interconexión de contenedores en un entorno de clúster.
- **Kubernetes**: Un sistema de orquestación de contenedores de código abierto que automatiza el despliegue, la escalabilidad y la gestión de aplicaciones contenerizadas.
- **Nodo (Worker)**: Una máquina física o virtual en un clúster de Kubernetes donde se ejecutan las cargas de trabajo en forma de Pods.
- **Master (Plano de Control)**: El conjunto de componentes que gestionan y controlan el clúster de Kubernetes. Incluye el API server, el controller manager, el scheduler y etcd.
- **Pod**: La unidad más pequeña y básica desplegable en Kubernetes, que representa un grupo de uno o más contenedores que comparten recursos.
- **kubelet**: Un agente que se ejecuta en cada nodo worker y es responsable de iniciar y gestionar los contenedores en los Pods.
- **kube-apiserver**: El componente del plano de control que expone la API de Kubernetes, permitiendo la interacción con el clúster.
- **kube-controller-manage**r: Un componente del plano de control que ejecuta procesos de controlador, como el ReplicaSet controller y el Deployment controller, para mantener el estado deseado del clúster.
- **kube-scheduler**: Un componente del plano de control que decide en qué nodo ejecutar los nuevos Pods, basándose en la disponibilidad de recursos y otras restricciones.
- **etcd**: Un almacén de valores clave distribuido y de alta disponibilidad utilizado por Kubernetes para almacenar los datos de configuración y estado del clúster.
- **Overlay Network**: Una red virtual que se superpone a la red física subyacente, permitiendo la comunicación entre Pods a través de diferentes nodos.
- **Servicio**: Una abstracción que define un conjunto lógico de Pods y una política para acceder a ellos. Proporciona una IP y un nombre de DNS estables para los Pods, incluso si sus IPs individuales cambian.
- **Deployment**: Un objeto de Kubernetes que proporciona una forma declarativa de gestionar aplicaciones sin estado, definiendo el número deseado de réplicas de un Pod y facilitando las actualizaciones.
- **Manifiesto (Declarativo)**: Un archivo de configuración (generalmente en formato YAML) que define el estado deseado de los objetos de Kubernetes. Kubernetes trabaja para alcanzar y mantener este estado.