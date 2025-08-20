# Alertas

- [Alertas](#alertas)
  - [Alertas con Microsoft Teams](#alertas-con-microsoft-teams)
    - [Obtener el WebHooks de MS Teams](#obtener-el-webhooks-de-ms-teams)
    - [Crear un ConfigMap con el template de los mensajes que serán enviados](#crear-un-configmap-con-el-template-de-los-mensajes-que-serán-enviados)
    - [Revisar el estado actual de la APP que se quiere monitorear/alertar](#revisar-el-estado-actual-de-la-app-que-se-quiere-monitorearalertar)
    - [Agregar las anotaciones para que se active la alerta](#agregar-las-anotaciones-para-que-se-active-la-alerta)
    - [Probar la alertas](#probar-la-alertas)
    - [Revisar problemas con las alertas](#revisar-problemas-con-las-alertas)

Para instalar las notificaciones

```bash

# Instala el configMap con templates de mensajes y otras cosas
wget -O install-notifications.yaml https://raw.githubusercontent.com/argoproj/argo-cd/stable/notifications_catalog/install.yaml
kubectl apply -n argocd -f install-notifications.yaml

# Instala el Notification controller, sólo en caso de que no esté instalado
wget -O notification-controller.yaml https://raw.githubusercontent.com/argoproj-labs/argocd-notifications/v1.0.1/manifests/install.yaml
```

## Alertas con Microsoft Teams

### Obtener el WebHooks de MS Teams

Para configurar alertas con MS Teams se debe:

- Obtener el web hook de MS Teams
- Crear un secreto con ese valor

```bash

MS_TEAMS_WEB_HOOK="https://bancoestado.webhook.office.com/webhookb2/b3ad9657-8d6e-4000-b5c7-fce4643ba956@189d9de0-0fef-4050-9094-e7cf9e6b3bb5/IncomingWebhook/08bb057e678e4e9788e58eecd4b86e1a/9ae1ded1-6bc8-446e-8e7e-272734533242/V2yb1qI1KFUVOxUq62bshISuC_j4UqGssUaY_oypdntG41"

# Valida que tengas acceso al Web Hook
curl -X POST -H 'Content-Type: application/json' \
  -d '{"text":"Test desde ArgoCD"}' \
  $MS_TEAMS_WEB_HOOK

# Prueba desde un pod
kubectl exec -n argocd -it \
  $(kubectl get pods -n argocd -l app.kubernetes.io/name=argocd-notifications-controller -o jsonpath='{.items[0].metadata.name}') \
  -- curl -X POST -H 'Content-Type: application/json' \
  -d '{"text":"Test desde ArgoCD"}' \
  $MS_TEAMS_WEB_HOOK


# Crear el secreto
kubectl -n argocd create secret generic argocd-notifications-secret \
  --from-literal=teams-webhook-url="${MS_TEAMS_WEB_HOOK}" --dry-run=client -o yaml | kubectl apply -f -

```

### Crear un ConfigMap con el template de los mensajes que serán enviados

Editar la plantilla de noficicaciones en un ConfigMap y cambiar el contexto según corresponda:

```bash
# Revise el contexto en el archivo argocd-notification-template-cm.yaml
data:
  context: |
    argocdUrl: "https://localhost:8080"


# Aplique el configMap
kubectl apply -f argocd-notification-template-cm.yaml

```

### Revisar el estado actual de la APP que se quiere monitorear/alertar

Revise las anotaciones de la APP

```bash

APP_NAME="rust-app"

kubectl describe app -n argocd ${APP_NAME} | grep Annotations

kubectl get app -n argocd ${APP_NAME} -o json  | jq '.metadata.annotations'  

```

### Agregar las anotaciones para que se active la alerta

```bash

APP_NAME="rust-app"


# Ejempli para agregar outOfSync
kubectl patch app ${APP_NAME} -n argocd \
  --type merge \
  -p '{
    "metadata": {
      "annotations": {
        "notifications.argoproj.io/subscribe.on-outofsync.teams": "GitOps"
        "notifications.argoproj.io/subscribe.on-sync-succeeded.teams": "GitOps"
        
      }
    }
  }'

```

### Probar la alertas

```bash
APP_DEPLOY="rust-ms"
APP_NS="app1"

kubectl scale --replicas=5 deployment/${APP_DEPLOY} -n ${APP_NS}

```

### Revisar problemas con las alertas

```bash
kubectl logs -n argocd -l app.kubernetes.io/name=argocd-notifications-controller

# Cuando se cambie el template es bueno reinicial el controller
kubectl rollout restart deployment argocd-notifications-controller -n argocd  


```


