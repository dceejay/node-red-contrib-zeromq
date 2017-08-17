node-red-contrib-zeromq
=======================

<a href="http://nodered.org" target="new">Node-RED</a> nodes that provides
publish subscribe, push pull, request reply and pair nodes for ZeroMQ.

The peer-to-peer publish subscribe capability, while not unlike MQTT, but without a broker, and without many of the same semantics. It works nicely using *localhost* to provide local process separation.

Relies on the <a href="https://www.npmjs.com/package/zeromq" target="new">zeromq</a> npm package to provide pre-build binaries to make installing easier... but can take some time to compile if not available.


### Install

Run the following command in your Node-RED user directory - typically `~/.node-red`

    npm install node-red-contrib-zeromq


#### Input

The **host** should be specified as a ZeroMQ connection string.
This is typically of the form `tcp://ip.address.of.server:port`

When subscribing a **topic** of interest can be specified by a string. The topic matching is purely on first matching characters - i.e. the topic starts with...

**Note**: this is NOT the same as MQTT - please read up on how ZeroMQ handles topics before raising an issue.

ZeroMQ messages can have multiple parts or **fields** - typically two - by default topic and payload,
but you can name more if required depending upon the application you are trying to integrate,
by using the comma separated field property.


#### Output

The **host** should be specified as a ZeroMQ connection string.
This is typically of the form `tcp://*:port`

By default this node expects to publish or push two fields - `msg.topic` and `msg.payload`.
However ZeroMQ can support multipart messages and the `msg` properties
to send can be specified by the comma separated **fields** configuration.

The **topic** to send can be fixed in the configuration if required.


#### Request

A node to handle ZeroMQ pair, request and response messaging modes.

The **host** should be specified as a ZeroMQ connection string.
This is typically of the form 'tcp://ip.address.of.host:port'

ZeroMQ can support multipart messages and extra 'msg' properties
to send can be specified by the comma separated **fields** configuration.
