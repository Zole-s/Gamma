const boughtHats = [];

class GammaAPI {
    events = [];
    nextTick = 111;
    speeds = [300, 400, 400, 300, 300, 700, 300, 100, 400, 600, 400, 1, 700, 230, 700, 1500];
    moveDir = null;
    qHoldRunning = false;
    onTick = [];
    hatBuyer = function() {
        const hatsList = [
            { acc: 11, cost: 2000, isAcc: 1 },
            { hat: 6,  cost: 4000, isAcc: 0 },
            { hat: 12, cost: 6000, isAcc: 0 },
            { hat: 7, cost: 6300, isAcc: 0 },
            { hat: 53, cost: 10000, isAcc: 0},
            { hat: 13, cost: 15000, isAcc: 1},
            { acc: 21, cost: 20000, isAcc: 1 },  
            { acc: 18, cost: 20500, isAcc: 1},
            { hat: 55, cost: 20700, isAcc: 0}
        ];
        // You need 38k gold in total to finish buying.
        const that = this;
        hatsList.forEach(item => {
            const property = item?.isAcc ? "acc" : "hat";
            if (item.cost < that.__exports._items.context.points && !boughtHats.includes(item[property])) {
                window.storeBuy(item[property], property == "acc" ? 1 : 0);
                boughtHats.push(item[property]);
            }
        });
    };
    repeat = function(key, callback) {
        const that = this;
        this.onTick.push(function() {
            if (that.events[key]) callback();
        });
    };
    myPlayer = {
        id: null,
        x: null,
        y: null
    };
    enemiesNear = [];
    _state = false;
    heal = function(count) {
        if (this.__exports._items.context.health == 100) return;
        while(count--) {
            this.emit(["5", [this.__exports._items.hook[0], false]]);
            this.emit(["c", [1]]);
            if (count % 2 == 0) {
                this.emit(["5", [this.__exports._weaponIndex.hook, true]]);
            }
        }
        if (this._state) this.emit(["c", [1]]);
    };
    place = function(id, dir = this.__exports._items.context.dir) {
        const scale = this.__exports._list.hook[id].scale;
        const checkItemLocation = this.__exports._checkItemLocation;
        const player = this.__exports._items.context;
        const canPlace = checkItemLocation.hook(Math.cos(dir) * scale + player.x,
                                                Math.sin(dir) * scale + player.y,
                                                scale,
                                                0.6,
                                                id,
                                                false,
                                                checkItemLocation.context
                                               );
        if (this.__exports._items.context.itemCounts[this.__exports._list.hook[id].group.id] > 95) return;
        if (!canPlace) return "no";
        this.emit(["5", [id, false]]);
        this.emit(["c", [1, dir]]);
        this.emit(["5", [this.__exports._weaponIndex.hook, true]]);
        if (this._state) this.emit(["c", [1]]);
    };
    ws = WebSocket;
    wss = {
        send: () => { },
        onmessage: () => { }
    };
    __exports = {};
    __bundle_export__ = function(func, checkup = (e => e), setter = e => e) {
        const symbol = Symbol(func);
        const that = this;
        Object.defineProperty(Object.prototype, func, {
            get() {
                return this[symbol];
            },
            set(value) {
                this[symbol] = setter(value);
                if (!checkup(this)) return;
                that.__exports["_" + func] = {
                    hook: this[func],
                    context: this
                }
            }
        });
    };
    __force_value__ = function(func, val) {
        Object.defineProperty(Object.prototype, func, {
            value: val,
            writable: false
        });
    }
};

module.exports = new GammaAPI;
