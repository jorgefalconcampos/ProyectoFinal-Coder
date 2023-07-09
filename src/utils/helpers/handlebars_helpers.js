const ifeq = function (a, b, options) {
    if (a == b) { return options.fn(this); }
    return options.inverse(this);
};

const ifnoteq = function (a, b, options) {
    if (a != b) { return options.fn(this); }
    return options.inverse(this);
};

module.exports = {
    ifeq: ifeq,
    ifnoteq: ifnoteq
};
  