# Deploying an Application

An [Application][] is deployed to Deis using `git push` or the `deis` client.

## Supported Applications

Deis Workflow can deploy any application or service that can run inside a Docker container.  In order to be scaled
horizontally, applications must follow the [Twelve-Factor App][] methodology and store any application state in external
backing services.

For example, if your application persists state to the local filesystem -- common with content management systems like
Wordpress and Drupal -- it cannot be scaled horizontally using `deis scale`.

Fortunately, most modern applications feature a stateless application tier that can scale horizontally inside Deis.

## Login to the Controller

!!! important
  if you haven't yet, now is a good time to [install the client][install client] and [register](../users/registration.md).

Before deploying an application, users must first authenticate against the Deis [Controller][]
using the URL supplied by their Deis administrator.

```
$ deis login http://deis.example.com
username: deis
password:
Logged in as deis
```

## Select a Build Process

Deis Workflow supports three different ways of building applications:

### Buildpacks

Heroku buildpacks are useful if you want to follow Heroku's best practices for building applications or if you are porting an application from Heroku.

Learn how to deploy applications [using Buildpacks](../applications/using-buildpacks.md).


### Dockerfiles

Dockerfiles are a powerful way to define a portable execution environment built on a base OS of your choosing.

Learn how to deploy applications [using Dockerfiles](../applications/using-dockerfiles.md).


### Docker Image

Deploying a Docker image onto Deis allows you to take a Docker image from either a public
or a private registry and copy it over bit-for-bit, ensuring that you are running the same
image in development or in your CI pipeline as you are in production.

Learn how to deploy applications [using Docker images](../applications/using-docker-images.md).

## Tuning Application Settings

It is possible to configure a few of the [globally tunable](../applications/managing-app-configuration.md) settings on per application basis using `config:set`.

Setting                                         | Description
----------------------------------------------- | ---------------------------------
DEIS_DISABLE_CACHE                              | if set, this will disable the [slugbuilder cache][] (default: not set)
DEIS_DEPLOY_BATCHES                             | the number of pods to bring up and take down sequentially during a scale (default: number of available nodes)
DEIS_DEPLOY_TIMEOUT                             | deploy timeout in seconds per deploy batch (default: 120)
DEIS_DEPLOY_NOW                                 | if set to false, this will disable synchronous deployment (default: not set)
IMAGE_PULL_POLICY                               | the kubernetes [image pull policy][pull-policy] for application images (default: "IfNotPresent") (allowed values: "Always", "IfNotPresent")
KUBERNETES_DEPLOYMENTS_REVISION_HISTORY_LIMIT   | how many [revisions][kubernetes-deployment-revision] Kubernetes keeps around of a given Deployment (default: all revisions)
KUBERNETES_POD_TERMINATION_GRACE_PERIOD_SECONDS | how many seconds kubernetes waits for a pod to finish work after a SIGTERM before sending SIGKILL (default: 30)

### Asynchronous Deployment

By default, `git push` and `deis pull` will create a build, a release and proceed to the deployment.
Starting v2.13 version, it's possible to skip the deployment and trigger the deployment of a release later on.

#### Disabling Synchronous Deployment

There are two ways to disable the synchronous deployment:

- Using the command line:
  - The first one which applies for `git push` and `deis pull` is to set `DEIS_DEPLOY_NOW` to `false` in your application settings.
    - Example
    ```bash
    $ deis config:set DEIS_DEPLOY_NOW=false -a <app>
    ```
  - The second one which only applies for `deis pull`, is to pass `--deploy-now false` option to the `deis pull` command.
    - Example
    ```bash
    $ deis pull deis/example-go -a <app> --deploy-now false
    ```
- Using the API:
  - Using the [API](https://deis.com/docs/workflow/reference-guide/controller-api/v2.3/#create-application-build) and passing the `deploy_now: false` parameter.

Note: `DEIS_DEPLOY_NOW` takes precedence over the `--deploy-now` option.

#### Deploying A Release Manually

Deploying a release manually is possible:

- Using the command line with `deis deploy <release-version>`.
  - Example
  ```bash
  $ deis releases -a <app>
  === <app> Releases
  v1	2017-03-31T17:18:43Z	<user> created initial release
  $ deis deploy v1 -a <app>
  ```
- Using the [API](https://deis.com/docs/workflow/reference-guide/controller-api/v2.3/#deploy-release).

### Deploy Timeout

Deploy timeout in seconds - There are 2 deploy methods, Deployments (see below) and RC (versions prior to 2.4) and this setting affects those a bit differently.

#### Deployments

Deployments behave a little bit differently from the RC based deployment strategy.

Kubernetes takes care of the entire deploy, doing rolling updates in the background. As a result, there is only an overall deployment timeout instead of a configurable per-batch timeout.

The base timeout is multiplied with `DEIS_DEPLOY_BATCHES` to create an overall timeout. This would be 240 (timeout) * 4 (batches) = 960 second overall timeout.

#### RC deploy

This deploy timeout defines how long to wait for each batch to complete in `DEIS_DEPLOY_BATCHES`.

#### Additions to the base timeout

The base timeout is extended as well with healthchecks using `initialDelaySeconds` on `liveness` and `readiness` where the bigger of those two is applied.
Additionally the timeout system accounts for slow image pulls by adding an additional 10 minutes when it has seen an image pull take over 1 minute. This allows the timeout values to be reasonable without having to account for image pull slowness in the base deploy timeout.

### Deployments

Workflow uses [Deployments][] for deploys. In prior versions [ReplicationControllers][] were used with the ability to turn on Deployments via `DEIS_KUBERNETES_DEPLOYMENTS=1`.

The advantage of [Deployments][] is that rolling-updates will happen server-side in Kubernetes instead of in Deis Workflow Controller,
along with a few other Pod management related functionality. This allows a deploy to continue even when the CLI connection is interrupted.

Behind the scenes your application deploy will be built up of a Deployment object per process type,
each having multiple ReplicaSets (one per release) which in turn manage the Pods running your application.

Deis Workflow will behave the same way with `DEIS_KUBERNETES_DEPLOYMENTS` enabled or disabled (only applicable to versions prior to 2.4).
The changes are behind the scenes. Where you will see differences while using the CLI is `deis ps:list` will output Pod names differently.

[slugbuilder cache]: ./managing-app-configuration.md#slugbuilder-cache
[install client]: ../users/cli.md#installation
[application]: ../reference-guide/terms.md#application
[controller]: ../understanding-workflow/components.md#controller
[Twelve-Factor App]: http://12factor.net/
[Deployments]: http://kubernetes.io/docs/user-guide/deployments/
[kubernetes-deployment-revision]: http://kubernetes.io/docs/user-guide/deployments/#revision-history-limit
[ReplicationControllers]: http://kubernetes.io/docs/user-guide/replication-controller/
