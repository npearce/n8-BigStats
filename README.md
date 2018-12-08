# BigStats: The BIG-IP Telemetry Exporter

<img align="right" width="150px" src="BigStats-300dpi.png" alt="BigStats_Logo"/>

BigStats pushes BIG-IP telemetry to remote logging services/pipelines. It supports HTTP, HTTPS, StatsD, and Apache Kafka destinations.

With BgStats you can insert your valuable BIG-IP stats into your telemetry pipeline solutions, like this:

![BigStats Architecture](BigStats_Arch.png)

Learn more about BigStats [here](https://REDtalks.live/BigStats) (videos and stuff)

## REQUIREMENTS

BIG-IP v13, or newer.

## INSTALL

You can find BigStats installation instructions here: [DOCS/BIGSTATS_INSTALL.md](DOCS/BIGSTATS_INSTALL.md)

## CONFIGURE

Configuring BigStats is as simple as POSTing the appropriate settings to `/mgmt/shared/bigstats_settings`. It requires the following information:

* **protocol:** [none|http|https|statsd|kafka]
* **address** ip address or resolvable domain name
* **port** destination port
* **uri** [OPTIONAL] End-point to post data to. Can be blank. Used only for http or https destinations.
* **interval** - how often, in seconds, to send the stats. Default: 10 seconds.
* **enabled** - enable/disable BigStats as required.
* **debug** - this will put a LOT of data into the BIG-IPs `/var/log/restnoded/restnoded.log`. Remember to turn this off when done.

You can view the full BigStats Configuration Schema here, [bigstats-schema.json](SRC/BigStats/nodejs/bigstats-schema.json), or you can follow the destination-specific instructions below:

Configure BigStats exporter for:

* [Scrapers (no desintation)](DOCS/SETUP_SCRAPER-MODE.md)
* [HTTP(S)](DOCS/SETUP_HTTP.md)
* [StatsD](DOCS/SETUP_STATSD.md)
* [Kafka](DOCS/SETUP_KAFKA.md)

## LEARN

**How does it work?**

Running on the F5 BIG-IP (physical or virtual), BigStats crawls the running configuration collecting statistics every 'n' seconds (see config) to build an object in memory like the following:

**Example BigStats Object:**

```json
{
        "ip-172-31-1-20-us-west-1-compute-internal": {
                "services": {
                        "Tenant_01/App1": {
                                "/Tenant_01/App3/172.31.4.11:80": {
                                        "clientside_curConns": 0,
                                        "clientside_maxConns": 0,
                                        "clientside_bitsIn": 0,
                                        "clientside_bitsOut": 0,
                                        "clientside_pktsIn": 0,
                                        "clientside_pktsOut": 0,
                                        "/Tenant_01/App1/web_pool1": [
                                                {
                                                        "172.31.10.112:80": {
                                                                "serverside_curConns": 0,
                                                                "serverside_maxConns": 0,
                                                                "serverside_bitsIn": 0,
                                                                "serverside_bitsOut": 0,
                                                                "serverside_pktsIn": 0,
                                                                "serverside_pktsOut": 0,
                                                                "monitorStatus": "down"
                                                        }
                                                },
                                                {
                                                        "172.31.10.111:80": {
                                                                "serverside_curConns": 0,
                                                                "serverside_maxConns": 0,
                                                                "serverside_bitsIn": 0,
                                                                "serverside_bitsOut": 0,
                                                                "serverside_pktsIn": 0,
                                                                "serverside_pktsOut": 0,
                                                                "monitorStatus": "down"
                                                        }
                                                },
                                                {
                                                        "172.31.10.113:80": {
                                                                "serverside_curConns": 0,
                                                                "serverside_maxConns": 0,
                                                                "serverside_bitsIn": 0,
                                                                "serverside_bitsOut": 0,
                                                                "serverside_pktsIn": 0,
                                                                "serverside_pktsOut": 0,
                                                                "monitorStatus": "down"
                                                        }
                                                },
                                                {
                                                        "172.31.10.114:80": {
                                                                "serverside_curConns": 0,
                                                                "serverside_maxConns": 0,
                                                                "serverside_bitsIn": 0,
                                                                "serverside_bitsOut": 0,
                                                                "serverside_pktsIn": 0,
                                                                "serverside_pktsOut": 0,
                                                                "monitorStatus": "down"
                                                        }
                                                }
                                        ]
                                }
                        },
                        "Common": {
                                "/Common/172.31.4.200:80": {
                                        "clientside_curConns": 0,
                                        "clientside_maxConns": 0,
                                        "clientside_bitsIn": 0,
                                        "clientside_bitsOut": 0,
                                        "clientside_pktsIn": 0,
                                        "clientside_pktsOut": 0,
                                        "/Common/noAS3_POOL": [
                                                {
                                                        "172.31.10.200:8080": {
                                                                "serverside_curConns": 0,
                                                                "serverside_maxConns": 0,
                                                                "serverside_bitsIn": 0,
                                                                "serverside_bitsOut": 0,
                                                                "serverside_pktsIn": 0,
                                                                "serverside_pktsOut": 0,
                                                                "monitorStatus": "down"
                                                        }
                                                },
                                                {
                                                        "172.31.10.201:8080": {
                                                                "serverside_curConns": 0,
                                                                "serverside_maxConns": 0,
                                                                "serverside_bitsIn": 0,
                                                                "serverside_bitsOut": 0,
                                                                "serverside_pktsIn": 0,
                                                                "serverside_pktsOut": 0,
                                                                "monitorStatus": "down"
                                                        }
                                                },
                                                {
                                                        "172.31.10.202:8080": {
                                                                "serverside_curConns": 0,
                                                                "serverside_maxConns": 0,
                                                                "serverside_bitsIn": 0,
                                                                "serverside_bitsOut": 0,
                                                                "serverside_pktsIn": 0,
                                                                "serverside_pktsOut": 0,
                                                                "monitorStatus": "down"
                                                        }
                                                }
                                        ]
                                }
                        }
                },
                "device": {
                        "memory": {
                                "memoryTotal": 8063365120,
                                "memoryUsed": 1509008040
                        },
                        "cpu0": {
                                "fiveSecAvgIdle": 99,
                                "fiveSecAvgIowait": 0,
                                "fiveSecAvgIrq": 0,
                                "fiveSecAvgNiced": 0,
                                "fiveSecAvgRatio": 1,
                                "fiveSecAvgSoftirq": 0,
                                "fiveSecAvgStolen": 0,
                                "fiveSecAvgSystem": 0,
                                "fiveSecAvgUser": 0
                        },
                        "cpu1": {
                                "fiveSecAvgIdle": 99,
                                "fiveSecAvgIowait": 0,
                                "fiveSecAvgIrq": 0,
                                "fiveSecAvgNiced": 0,
                                "fiveSecAvgRatio": 1,
                                "fiveSecAvgSoftirq": 0,
                                "fiveSecAvgStolen": 0,
                                "fiveSecAvgSystem": 0,
                                "fiveSecAvgUser": 0
                    }
                }
        }
}
```

Then, depending on the configuration, BigStats re-formats the object to match the desired destination (none/http/https/StatsD/Kafka) and sends the data.
