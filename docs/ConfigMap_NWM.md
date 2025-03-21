# Ejemplo de un configmap de la NWM

 kubectl edit -n kube-system configmap/aws-auth

```yaml 
apiVersion: v1
data:
  mapRoles: |
    - groups:
      - system:masters
      rolearn: arn:aws:iam::495242821145:role/AWSReservedSSO_BECH_PermiteCreacionRolesIAM_5c11701e97ddb9c8
      username: PermiteCreacionRolesIAM
    - groups:
      - system:masters
      rolearn: arn:aws:iam::495242821145:role/AWSReservedSSO_BECH_PowerUserAccess_60b92e8d16d88f29
      username: PowerUserAccess
    - groups:
      - system:masters
      rolearn: arn:aws:iam::495242821145:role/AWSReservedSSO_AWSPowerUserAccess_e90ab614b5efa259
      username: PowerUserAccess
    - groups:
      - system:masters
      rolearn: arn:aws:iam::495242821145:role/AWSReservedSSO_BECH_Developer_73f9b0dff6de486d
      username: PowerUserAccess
    - groups:
      - system:bootstrappers
      - system:nodes
      rolearn: arn:aws:iam::495242821145:role/eks-instance-role-nwp
      username: system:node:{{EC2PrivateDNSName}}
    - groups:
      - system:masters
      rolearn: arn:aws:iam::495242821145:role/AWSReservedSSO_BECH_PermiteAccesoOperPreProd_91523cd3fc2eb528
      username: PermiteAccesoOperPreProd
    - groups:
      - system:bootstrappers
      - system:nodes
      rolearn: arn:aws:iam::495242821145:role/node-instance-role-nwp
      username: system:node:{{EC2PrivateDNSName}}
    - groups:
      - system:masters
      rolearn: arn:aws:iam::495242821145:role/AWSReservedSSO_BECH_Developer_73f9b0dff6de486d
      username: BECH_Developer
kind: ConfigMap
metadata:
  creationTimestamp: "2021-10-27T14:17:48Z"
  name: aws-auth
  namespace: kube-system
  resourceVersion: "173948745"
  uid: 51442f27-8bac-4179-9974-52ab991b3b65

```