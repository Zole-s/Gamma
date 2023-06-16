CanvasRenderingContext2D.prototype.lineTo = new Proxy(CanvasRenderingContext2D.prototype.lineTo, {
    apply(target, that, args) {
        if (args[0] > 1700 || args[1] > 800) {
            return;
        } else {
            return target.apply(that, args);
        }
    }
});