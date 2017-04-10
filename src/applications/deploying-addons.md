# Deploying Add-ons

The goal of `deis addons` is to give users the power to provision consumable services such as
a postgres database, a minio bucket, or a logstash connection to their applications. `deis addons`
can work with both common on-premise services such as a local mysql database or a Redis server
for a "private" or on-premise [service broker][broker], or with public SaaS applications such as
MongoLab or Papertrail for a public service offering.

`deis addons` is backed by a project called [service-catalog][]. service-catalog brings integration
with [service brokers][broker] to the Kubernetes ecosystem via the [Open Service Broker API][].

Users of Workflow use `deis addons` to provision an add-on offered by [service brokers][broker] for
their applications. The end-goal is to provide a way for users to consume services from brokers and
have their applications use those services without needing detailed knowledge about how those
services are created or managed.

As an example, most applications deployed by Workflow need a data store of some kind. `deis addons`
allows applications to consume services like databases that exist somewhere via common environment
variables like `DATABASE_URL`.

## Listing Available Add-ons

A user can use `deis addons:list` to see if they have a database provisioned and what plan it
is using.

```
$ deis addons:list | grep -i postgresql
deis-postgresql:m4.large
```

If a user wishes to see all available addons, they can use `deis addons:catalog`.

```
$ deis addons:catalog
name             description
---------------  ----------------------
bonsai           Bonsai Elasticsearch
deis-postgresql  Deis Workflow Postgres
librato          Librato
```

To view what plans are available for a given service, use `deis addons:plans <service>`.

```
$ deis addons:plans deis-postgresql
name         free?  description
------       -----  ------------------------------------------------------------------------
t2.micro     yes    1 vCPU, 1GB memory, poor network performance.
t2.small     no     1 vCPU, 2GB memory, poor network performance.
m4.large     no     2 vCPUs, 8GB memory, PIOPS-Optimized, moderate network performance.
m4.xlarge    no     4 vCPUs, 16GB memory, PIOPS-Optimized, high network performance.
m4.10xlarge  no     40 vCPUs, 160GB memory, PIOPS-Optimized, 10 Gigabit network performance.
```

To see more information about the plans, use the `--raw` flag to dump the raw JSON to stdout for
future parsing with tools like [`jq`](https://stedolan.github.io/jq/). This might be useful when
the plan has more information about pricing in the metadata which cannot be cleanly parsed out in
the CLI.

## Provisioning the Add-on

Most service brokers offers a variety of plans, usually spread across different tiers of service:
hobby, standard, premium, and enterprise. For a detailed breakdown on the available plans, check
the documentation for the applicable service broker to help choose the right service tier for the
application. You can also check `deis addons:plans` for a high-level view of each service plan.

For example, to provision a `m4.large` plan database:

```
$ deis addons:create deis-postgresql:m4.large --app wooden-rowboat
Creating deis-postgresql:m4.large... done
Binding deis-postgresql:m4.large to wooden-rowboat... done, v5
```

Once the instance has been attached to the application, a DATABASE_URL environment variable will be
available in the application's environment and will contain the URL used to access the newly
provisioned service. The environment variables exposed by the instance will be viewable through
`deis config:list`.

## Deprovisioning the Add-on

To deprovision a `m4.large` plan database:

```
$ deis addons:destroy deis-postgresql:m4.large
Un-binding deis-postgresql:m4.large from wooden-rowboat... done, v6
Destroying deis-postgresql:m4.large... done
```


[broker]: ../reference-guide/terms.md#service-broker
[Open Service Broker API]: https://github.com/openservicebrokerapi/servicebroker
[service-catalog]: https://github.com/kubernetes-incubator/service-catalog
