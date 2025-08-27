# Instalación de APISIX Controller y Dashboard

```bash
APISIX_NAMESPACE="ingress-apisix"

helm repo add apisix https://charts.apiseven.com
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo update

#  We use Apisix 3.0 in this example. If you're using Apisix v2.x, please set to v2
ADMIN_API_VERSION=v3
helm pull apisix/apisix

helm install apisix ./apisix-2.11.5.tgz \
  --set service.type=NodePort \
  --set ingress-controller.enabled=true \
  --create-namespace \
  --namespace $APISIX_NAMESPACE \
  --set ingress-controller.config.apisix.serviceNamespace=$APISIX_NAMESPACE \
  --set ingress-controller.config.apisix.adminAPIVersion=$ADMIN_API_VERSION \
  --set ingress-controller.deployment.image.repository=279527989600.dkr.ecr.us-east-1.amazonaws.com/apache/apisix-ingress-controller \
  --set ingress-controller.deployment.image.tag=2.0.0-rc3 \
  --set image.repository=279527989600.dkr.ecr.us-east-1.amazonaws.com/apache/apisix \
  --set image.tag=3.13.0-ubuntu \
  --set initContainer.image=279527989600.dkr.ecr.us-east-1.amazonaws.com/busybox \
  --set initContainer.tag=1.28 \
  --set etcd.image.registry=279527989600.dkr.ecr.us-east-1.amazonaws.com \
  --set etcd.image.repository=bitnami/etcd \
  --set etcd.image.tag=3.5.10-debian-11-r2
 

# Para comprobar los servicios
kubectl get service -n $APISIX_NAMESPACE

# Para comprobar los pods
kubectl get pods -n $APISIX_NAMESPACE


# Para desinstalar, corregir parametros y reinstalar
helm uninstall apisix -n $APISIX_NAMESPACE

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

## Notas para AWS Outposts

Los Pods relacionados al etcd no levantan porque fallan los Persist Volumes. En Outposts hay que tener ciertas consideraciones dadas por el tipo de storage.

```bash

# Obtencion de los PVC
kubectl get pvc -n $APISIX_NAMESPACE

# Descripcion de uno de los pods
kubectl describe pvc data-apisix-etcd-0 -n$APISIX_NAMESPACE | grep "StorageClass"

kubectl get pvc -n $APISIX_NAMESPACE data-apisix-etcd-0 -o yaml

# Revision de los StorageClass
kubectl get storageclass

# Parchamos los PVC
PVC_NAME="data-apisix-etcd-0"
PVC_NAME="data-apisix-etcd-1"
PVC_NAME="data-apisix-etcd-2"

kubectl patch pvc $PVC_NAME \
  -n $APISIX_NAMESPACE \
  --type merge \
  -p '{"spec": {"storageClassName": "ebs-sc"}}'

kubectl patch pvc ${PVC_NAME} -n $APISIX_NAMESPACE \
  --type merge \
  -p '{
    "metadata": {
      "annotations": {
        "volume.beta.kubernetes.io/storage-provisioner": "ebs.csi.aws.com",
        "volume.kubernetes.io/storage-provisioner": "ebs.csi.aws.com"
      }
    }
  }'


# Despues revisar los POD y el StateFullSet y cambiar la imagen
kubectl get statefulsets -n $APISIX_NAMESPACE

kubectl edit statefulset apisix-etcd   -n $APISIX_NAMESPACE 

kubectl patch statefulset apisix-etcd \
  -n $APISIX_NAMESPACE  \
  --type='json' \
  -p='[{"op": "replace", "path": "/spec/template/spec/containers/0/image", "value": "279527989600.dkr.ecr.us-east-1.amazonaws.com/bitnami/etcd:3.5.10-debian-11-r2"}]'


POD_NAME="apisix-etcd-0"
POD_NAME="apisix-etcd-1"
POD_NAME="apisix-etcd-2"

kubectl patch pod  -n $APISIX_NAMESPACE  \
  $POD_NAME \
  --type='json' \
  -p='[{"op": "replace", "path": "/spec/template/spec/containers/0/image", "value": "279527989600.dkr.ecr.us-east-1.amazonaws.com/bitnami/etcd:3.5.10-debian-11-r2"}]'

```