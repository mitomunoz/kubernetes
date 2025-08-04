# Activación del dashboard en AWS Outposts

Para activar el dashboard se debe crear un ingress. En el caso AWS depende del Load Balancer.

> Hasta el momento, no se ha podido activar el ingress de tipo **internet-facing** en ambiente de Outposts. Queda como alternativa, crear un NLB sobre un ALB Interno
>

En AWS, la subnet debe ser una subred intra-priv con rutas al Local Gateway correspondiente al Outposts donde vive.

- Outposts Kenos  : lgw-04baf7227e545c480 (ID: op-0a472f28ca87bd8ab)
- Outposts Coquena: lgw-073894fb6156ab0e0 (ID: op-04af07f1345f8c4ad)

En Outposts -> LWG route tables, debe existir la asociación con la VPC que estamos usando.
Y de ahi sacamos también el customer-owned-ipv4-pool.
Revisar además las Rutas

Dado que el ALB en AWS no puede llegar a un SVC de tipo ClusterIP, creamos uno de tipo NodePort

```yaml
# argocd-server-alb.yaml
apiVersion: v1
kind: Service
metadata:
  labels:
    app: argocd-server-alb
    app.kubernetes.io/component: server
    app.kubernetes.io/name: argocd-server-alb
    app.kubernetes.io/part-of: argocd
  name: argocd-server-alb
  namespace: argocd
spec:
  type: NodePort
  sessionAffinity: None
  ports:
  - name: http
    port: 80
    protocol: TCP
    targetPort: 8080
  - name: https
    port: 443
    protocol: TCP
    targetPort: 8080
  selector:
    app.kubernetes.io/name: argocd-server
```

Cree el archivo argocd-ingress.yaml con el siguiente contenido apuntando al SVC recién creado

```yaml
# argocd-ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: argocd-ingress
  namespace: argocd
  annotations:
    alb.ingress.kubernetes.io/backend-protocol: HTTP
    alb.ingress.kubernetes.io/listen-ports: '[{"HTTP": 80}]'
    alb.ingress.kubernetes.io/scheme: internet-facing
    alb.ingress.kubernetes.io/ip-address-type: ipv4
    alb.ingress.kubernetes.io/tags: tipo=privado
    alb.ingress.kubernetes.io/subnets: subnet-00466cb725ceb94e6 #Intra-priv Coquena  
    alb.ingress.kubernetes.io/customer-owned-ipv4-pool: ipv4pool-coip-0b9f2b4516b10245f
    alb.ingress.kubernetes.io/target-type: ip
    #alb.ingress.kubernetes.io/certificate-arn: arn:aws:acm:us-east-1:279527989600:certificate/c3bc4666-2862-49e8-8305-4ab685a7f198
spec:
  ingressClassName: alb
  rules:
    - http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: argocd-server-alb
                port:
                  number: 80 #Toma el puerto expuesto en el servicio ArgoCD

```

Asegúrese que la subred donde son creados los nodos de su clúster tengan el tag **kubernetes.io/role/internal-elb=1**