# Installing Deis Workflow

We will use the Helm package manager for Kubernetes to install Deis Workflow onto a Kubernetes cluster. If you don't have Helm installed, see [Helm's own documentation][helm] for more info.

## Check Your Setup

First check that you have `helm` installed and the version is correct.

```
$ helm --version
0.4.0
```

Ensure your kubectl client is installed and ensure it can connect to your Kubernetes cluster. This
is where Helm will attempt to communicate with the cluster. You can test that it is working
properly by running:

```
$ helm target
Kubernetes master is running at https://10.245.1.2
Heapster is running at https://10.245.1.2/api/v1/proxy/namespaces/kube-system/services/heapster
KubeDNS is running at https://10.245.1.2/api/v1/proxy/namespaces/kube-system/services/kube-dns
KubeUI is running at https://10.245.1.2/api/v1/proxy/namespaces/kube-system/services/kube-ui
Grafana is running at https://10.245.1.2/api/v1/proxy/namespaces/kube-system/services/monitoring-grafana
InfluxDB is running at https://10.245.1.2/api/v1/proxy/namespaces/kube-system/services/monitoring-influxdb
```

If you see a list of targets like the one above, 'helm' can communicate with the kubernetes master.

## Add the Deis Chart Repository

The [Deis Chart Repository](https://github.com/deis/charts) contains everything you
need to install Deis onto your Kubernetes cluster, with a single `helm install` command.

Run the following command to add this repository to Helm:

```
$ helm repo add deis https://github.com/deis/charts
```

## Install Deis Workflow

Now that you have Helm installed and have added the Deis Chart Repository, install Workflow by running:

```
$ helm fetch deis/workflow-beta1             # fetches the chart into a
                                             # local workspace
$ helm generate -x manifests workflow-beta1  # generates various secrets
$ helm install workflow-beta1                # injects resources into
                                             # your cluster
```

Helm will install a variety of Kubernetes resources in the `deis` namespace.
You'll need to wait for the pods that it launched to be ready. Monitor their status
by running:

```
$ kubectl get pods --namespace=deis
```

If you would like `kubectl` to automatically update as the pod states change, run (type Ctrl-C to stop the watch):
```
$ kubectl get pods --namespace=deis -w
```

Once you see all of the pods in the `READY` state, Deis Workflow is up and running!

## AWS EC2 Install Notes
For clusters running on AWS EC2 you may need to increase the idle timeout of the loadbalancer that is in front of deis-router, to do that, first describe deis-router service to find out what ELB it is using:
```
$ kubectl describe service deis-router --namespace=deis
```

The load balancer will be described in the field "LoadBalancer Ingress", then, in aws cli tool or through EC2 Management Console, increase the idle timeout of the ELB from 60 seconds to 1200.

Next, [configure dns][] so you can register your first user.

[helm]: http://helm.sh
[using deis]: ../using-workflow/deploying-an-application.md
[configure dns]: ../managing-workflow/configuring-dns.md
