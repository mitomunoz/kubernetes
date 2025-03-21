# Autoescalado con EKS
Guía de comandos y pasos para activar el autoescalado en EKS.

## Referencias
- [Descripción de Autoscaler](https://docs.aws.amazon.com/eks/latest/userguide/cluster-autoscaler.html)
- [HPA/Horizontal Pod Autoscaler](https://docs.aws.amazon.com/eks/latest/userguide/horizontal-pod-autoscaler.html)
- [VPA/Vertical Pod Autoscaler](https://docs.aws.amazon.com/eks/latest/userguide/vertical-pod-autoscaler.html)

## Amazon EKS Autoscaler
Por defecto ela capacidad de autoescalameinto no viene activada en EKS. Para tales efectos se debe agregar como un deployment.

El Autoscaler se instala como un Deployment en el cluster EKS.

## Prerequisitos 
- Tener instalado un cluster EKS
- Chequear que exista un proveedor de identidad IAM OIDC para **tu cluster**. Si no existe, habilitarlo [Documentación oficial](https://docs.aws.amazon.com/eks/latest/userguide/enable-iam-roles-for-service-accounts.html) (este paso es perentorio, si el proveedor de identidad no existe no se podrá autenticar el cluster contra STS)
- Grupos de nodos con etiquetas de grupos de Auto Scaling: el escalador automático de clúster requiere las siguientes etiquetas en sus grupos de Auto Scaling para que puedan detectarse automáticamente.

```
Key                                         Value
k8s.io/cluster-autoscaler/<cluster-name>    owned
k8s.io/cluster-autoscaler/enabled           true
```


## Pasos

### Crear una Politica IAM y el rol.

1. Crea la Politica

Grabe el siguiente contenido en un archivo llamado cluster-autoscaler-policy.json. Si la politica existe salte a paso siguiente.


```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Action": [
                "autoscaling:DescribeAutoScalingGroups",
                "autoscaling:DescribeAutoScalingInstances",
                "autoscaling:DescribeLaunchConfigurations",
                "autoscaling:DescribeTags",
                "autoscaling:SetDesiredCapacity",
                "autoscaling:TerminateInstanceInAutoScalingGroup",
                "ec2:DescribeLaunchTemplateVersions"
            ],
            "Resource": "*",
            "Effect": "Allow"
        }
    ]
}
```

1.  Generar la politica con el siguiente comando:

```bash
aws iam create-policy \
    --policy-name AmazonEKSClusterAutoscalerPolicy \
    --policy-document file://cluster-autoscaler-policy.json
```

> rescate el ARN (`<ARN-POLITICA>`) de la salida, se usará en el siguiente paso

1. Crear el rol y atacharle la nueva politica. **(si el ROL existe, borrarlo y recrearlo)**

```bash
eksctl create iamserviceaccount \
  --cluster=<my-cluster> \
  --namespace=kube-system \
  --name=cluster-autoscaler \
  --attach-policy-arn=<ARN-POLITICA> \
  --override-existing-serviceaccounts \
  --approve
```

> rescate el ARN (`<ARN-ROL>`) de la salida, se usará en el siguiente paso

### Bajar el Manifiesto y disponibilizar la imagen

Como tenemos un cluster Privado debemos subir la imagen a usar a un ECR que el cluster pueda ver, para esto primero tenemos que crear un repositorio en el ECR de la cuenta AWS, rescatar los comandos de pull y loguearse al repositorio, luego: 

```bash
# bajar el manifiesto
wget https://raw.githubusercontent.com/kubernetes/autoscaler/master/cluster-autoscaler/cloudprovider/aws/examples/cluster-autoscaler-autodiscover.yaml

# rescatar el nombre de la imagen 
grep "image:" cluster-autoscaler-autodiscover.yaml

# hacer un pull de la imagen
docker pull <imagen-original>

# re etiquetar la imagen
docker tag <imagen-original:version> <repositorio-ecr:version>

#subir la imagen 
docker push <repositorio-ecr:version>
```

Editar el archivo `cluster-autoscaler-autodiscover.yaml` para reemplazar la imagen original con el nombre del repositorio.



### Desplega el cluster autoscaler

```bash
kubectl apply -f cluster-autoscaler-autodiscover.yaml

kubectl annotate serviceaccount cluster-autoscaler \
  -n kube-system \
  eks.amazonaws.com/role-arn=<ARN_ROL>
  
kubectl patch deployment cluster-autoscaler \
  -n kube-system \
  -p '{"spec":{"template":{"metadata":{"annotations":{"cluster-autoscaler.kubernetes.io/safe-to-evict": "false"}}}}}'
```

### Editar el deploy 


```bash
kubectl -n kube-system edit deployment cluster-autoscaler
```

Editar la sección del contenedor para que incluya el nombre del clustar y agregar las lineas comentadas

```yaml
    spec:
      containers:
        env:                                                                                                                      # agregar
          - name: AWS_STS_REGIONAL_ENDPOINTS.                                                                                     # agregar
            value: "regional"                                                                                                     # agregar
...
          command:
            - ./cluster-autoscaler
            - --v=4
            - --stderrthreshold=info
            - --cloud-provider=aws
            - --skip-nodes-with-local-storage=false
            - --expander=least-waste
            - --node-group-auto-discovery=asg:tag=k8s.io/cluster-autoscaler/enabled,k8s.io/cluster-autoscaler/<mi-cluster-name>    # cambiar
            - --aws-use-static-instance-list=true                                                                                  # agregar
            - --balance-similar-node-groups                                                                                        # agregar
            - --skip-nodes-with-system-pods=false                                                                                  # agregar 
```


### Ver los logs del Cluster autoscaler

```
$> kubectl -n kube-system logs -f deployment.apps/cluster-autoscaler
```

## Algunas consideraciones

- Ámbito de grupos de nodos en más de una zona de disponibilidad

- Asegurarse que el escalador automático de clúster escala una zona específica para satisfacer las demandas. Asigne varios grupos de Auto Scaling de Amazon EC2, uno para cada zona de disponibilidad, para habilitar la conmutación por error para toda la carga de trabajo coprogramada. 
