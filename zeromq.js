
module.exports = function(RED) {
    "use strict";
    var zmq = require('zeromq');

    function ZmqInNode(n) {
        RED.nodes.createNode(this, n);
        this.server = n.server;
        this.isserver = n.isserver;
        this.intype = n.intype || "sub";
        this.topic = n.topic;
        this.fields = n.fields.split(",").map(function(f) { return f.trim(); });
        if (this.fields.length === 0) { this.fields = ["part0"]; }
        if (this.fields[0] === '') { this.fields = ["part0"]; }
        this.output = n.output;
        var node = this;

        node.sock = zmq.socket(node.intype);

        if (node.isserver === true) {
            node.sock.bindSync(node.server);
            node.status({fill:"green",shape:"dot",text:"bound"});
        }
        else {
            node.sock.connect(node.server);
            node.status({fill:"green",shape:"dot",text:"connected"});
        }

        if (node.intype === "sub") { node.sock.subscribe(node.topic); }

        node.sock.on('message', function() {
            var p = {};
            for (var i=0; i < arguments.length; i++) {
                if (i >= node.fields.length) { node.fields[i] = "part"+i; }
                if (node.output === "string") {
                    try { p[node.fields[i]] = arguments[i].toString(); }
                    catch (e) {}
                }
                else if (node.output === "json") {
                    try {
                        p[node.fields[i]] = arguments[i].toString();
                        p[node.fields[i]] = JSON.parse(p[node.fields[i]]);
                    }
                    catch (e) {}
                }
                else { p[node.fields[i]] = arguments[i]; }
            }
            node.send(p);
        });

        node.on("close", function() {
            node.sock.close();
            node.status({});
        });
    }
    RED.nodes.registerType("zeromq in", ZmqInNode);


    function ZmqOutNode(n) {
        RED.nodes.createNode(this, n);
        this.server = n.server;
        this.isserver = n.isserver;
        this.intype = n.intype || "pub";
        this.topic = n.topic;
        this.fields = n.fields.split(",").map(function(f) { return f.trim(); }) || [];
        var node = this;
        node.sock = zmq.socket(node.intype);

        if (node.isserver === true) {
            node.sock.bindSync(node.server);
            node.status({fill:"green",shape:"dot",text:"bound"});
        }
        else {
            node.sock.connect(node.server);
            node.status({fill:"green",shape:"dot",text:"connected"});
        }

        node.on("input", function(msg) {
            msg.topic = node.topic || msg.topic;
            if (typeof msg.payload === "object" && !Buffer.isBuffer(msg.payload)) {
                msg.payload = JSON.stringify(msg.payload);
            }
            var m = [];
            for (var i=0; i<node.fields.length; i++) {
                m.push(msg[node.fields[i]]);
            }
            node.sock.send(m);
        });

        node.on("close", function() {
            node.sock.close();
            node.status({});
        });
    }
    RED.nodes.registerType("zeromq out", ZmqOutNode);
}
