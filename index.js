const storage = require("./injector/api/API");
const noGrid = require("./injector/render/noGrid");
if (typeof window !== "undefined") {
    addEventListener("DOMContentLoaded", () => {
        const keysystem = require("./injector/render/keysystem");
        const ct = document.getElementById("gameCanvas");
        ct.addEventListener("mousedown", e => {
            storeEquip(21, 1);
            storeEquip(7);
            storage._state = true;
        });
        ct.addEventListener("mouseup", e => {
            storage._state = false;
            storeEquip(11, 1);
            storeEquip(6);
        });
        ct.addEventListener("touchstart", e => {
            if (e.changedTouches[0].clientX < screen.width / 2) return;
            storage._state = true;
            storeEquip(21);
            storeEquip(7);
        });
        ct.addEventListener("touchend", e => {
            if (e.changedTouches[0].clientX < screen.width / 2) return;
            storage._state = false;
            storeEquip(11, 1);
            storeEquip(6);
        });
    });

    addEventListener("keydown", ({
        keyCode
    }) => {
        storage.events[keyCode] = true;
    });

    addEventListener("keyup", ({
        keyCode
    }) => {
        storage.events[keyCode] = false;
    });

    setInterval(() => {
        storage.hatBuyer();
        storage.onTick.forEach(task => task());
        if (storage.qHoldRunning) storage.heal(1);
    }, 55);
}

/**  WS **/

WebSocket = class {
    constructor(url) {
        storage.wss = new storage.ws(url);
        storage.emit = function(packet) {
            storage.wss.send(msgpack.encode(packet));
        }
        storage.wss.addEventListener("message", function(event) {
            const packet = msgpack.decode(event.data);
            switch (packet[0]) {
                case "1":
                    storage.myPlayer.id = packet[1][0];
                    break;
                case "h":
                    if (packet[1][0] == storage.myPlayer.id && packet[1][1] < 100) {
                        setTimeout(() => {
                            storage.heal(Math.ceil((100 - packet[1][1]) / (storage.__exports._items.hook[0] == 0 ? 20 : 40)));
                        }, 120 - window.pingTime);
                        if (packet[1][1] < 75) storage.qHoldRunning = true;
                        setTimeout(() => storage.qHoldRunning = false, 222 - window.pingTime);
                    }
                    break;
                case "ch":
                    if (packet[1][0] == storage.myPlayer.id && packet[1][1] == "!mill") {
                        if (!storage.events[66]) storage.events[66] = false;
                        storage.events[66] = !storage.events[66];
                    }
                    break;
                case "7":
                    if (packet[1][0] == storage.myPlayer.id) execHold();
                    break;
                case "33":
                    storage.nextTick = 111 - window.pingTime;
                    break;
            }
        });
        storage.wss.send = new Proxy(storage.wss.send, {
            apply(target, that, args) {
                const packet_ = msgpack.decode(args[0]);
                console.log(packet_);
                if (packet_[0] == "33") {
                    storage.moveDir = packet_[1][0];
                }
                return Reflect.apply(...arguments);
            }
        });
        return storage.wss;
    }
}

/** APPLY HOOKS **/
storage.__bundle_export__("checkItemLocation");
storage.__bundle_export__("getDistance");
storage.__bundle_export__("getDirection");
storage.__bundle_export__("items", context => {
    return context.sid == storage.myPlayer.id;
});
storage.__bundle_export__("weaponIndex", context => {
    return context.sid == storage.myPlayer.id;
});
storage.__bundle_export__("list", context => {
    return !context.list.includes("ass");
});

/** AUTOREPLACE **/
storage.__bundle_export__("disableObj", context => {
    return context
}, value => {
    return new Proxy(value, {
        apply(target, that, args) {
            const player = storage.__exports._items.context;
            const item = args[0];
            const dist = Math.hypot(player.x - item.x, player.y - item.y);
            if (dist < 180) {
                const angle = Math.atan2(player.y - item.y, player.x - item.x);
                const itemId = storage.__exports._items.hook[item.group.id];
                storage.emit(["5", [itemId]]);
                storage.emit(["c", [1, angle - Math.PI]]);
                storage.emit(["5", [storage.__exports._weaponIndex, true]]);
                if (storage._state) storage.emit(["c", [1]]);
            }
            return target.apply(that, args);
        }
    });
});

/** BINDS **/
storage.__force_value__("maxPlayers", 50);
storage.__force_value__("turnSpeed", 0);

storage.repeat(86, () => storage.place(storage.__exports._items.hook[2]));
storage.repeat(70, () => storage.place(storage.__exports._items.hook[4]));
storage.repeat(66, () => {
    if (storage.__exports._items.context.itemCounts[storage.__exports._list.hook[storage.__exports._items.hook[3]].group.id] > 95) {
        storage.events[66] = false;
        return;
    }
    const player = storage.__exports._items.context;
    const millPos = [];
    millPos.push({
        x: player.x - 35,
        y: player.y
    });
    millPos.push({
        x: player.x - 45 / 2,
        y: player.y + 45
    });
    millPos.push({
        x: player.x - 45 / 2,
        y: player.y - 45
    });
    millPos.forEach(mill => {
        const angle = Math.atan2(player.y - mill.y, player.x - mill.x);
        storage.place(storage.__exports._items.hook[3], storage.moveDir - angle - Math.PI);
    });
});
const execHold = () => {
    storeEquip(6);
    setTimeout(() => {
        let hat = storage.__exports._items.context.health == 100 ? 7 : 55;
        storeEquip(hat);
        const acc = storage.__exports._items.context.health == 100 ? 21 : 18;
        storeEquip(acc, 1);
    }, storage.speeds[storage.__exports._items.context.weaponIndex] - window.pingTime);
}