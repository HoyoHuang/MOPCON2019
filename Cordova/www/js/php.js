
function showTime(d){
    var r = '';

    if ( date('Y-m-d', strtotime(d)) == date('Y-m-d') ){
        r = date('H:i:s', strtotime(d));
    }
    else if ( date('Y', strtotime(d)) == date('Y') ){
        r = date('m-d', strtotime(d));
    }
    else{
        r = date('Y-m-d', strtotime(d));
    }

    return r;
}

function base64_decode(data) {

    var b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    var o1, o2, o3, h1, h2, h3, h4, bits, i = 0,
        ac = 0,
        dec = '',
        tmp_arr = [];

    if (!data) {
        return data;
    }

    data += '';

    do {
        // unpack four hexets into three octets using index points in b64
        h1 = b64.indexOf(data.charAt(i++));
        h2 = b64.indexOf(data.charAt(i++));
        h3 = b64.indexOf(data.charAt(i++));
        h4 = b64.indexOf(data.charAt(i++));

        bits = h1 << 18 | h2 << 12 | h3 << 6 | h4;

        o1 = bits >> 16 & 0xff;
        o2 = bits >> 8 & 0xff;
        o3 = bits & 0xff;

        if (h3 == 64) {
            tmp_arr[ac++] = String.fromCharCode(o1);
        } else if (h4 == 64) {
            tmp_arr[ac++] = String.fromCharCode(o1, o2);
        } else {
            tmp_arr[ac++] = String.fromCharCode(o1, o2, o3);
        }
    } while (i < data.length);

    dec = tmp_arr.join('');

    return decodeURIComponent(escape(dec.replace(/\0+$/, '')));
}

function bin2hex(s) {
    var i, l, o = '',
        n;

    s += '';

    for (i = 0, l = s.length; i < l; i++) {
        n = s.charCodeAt(i)
            .toString(16);
        o += n.length < 2 ? '0' + n : n;
    }

    return o;
}

function substr(str, start, len) {

    var i = 0,
        allBMP = true,
        es = 0,
        el = 0,
        se = 0,
        ret = '';
    str += '';
    var end = str.length;

    // BEGIN REDUNDANT
    this.php_js = this.php_js || {};
    this.php_js.ini = this.php_js.ini || {};
    // END REDUNDANT
    switch ((this.php_js.ini['unicode.semantics'] && this.php_js.ini['unicode.semantics'].local_value.toLowerCase())) {
        case 'on':
            // Full-blown Unicode including non-Basic-Multilingual-Plane characters
            // strlen()
            for (i = 0; i < str.length; i++) {
                if (/[\uD800-\uDBFF]/.test(str.charAt(i)) && /[\uDC00-\uDFFF]/.test(str.charAt(i + 1))) {
                    allBMP = false;
                    break;
                }
            }

            if (!allBMP) {
                if (start < 0) {
                    for (i = end - 1, es = (start += end); i >= es; i--) {
                        if (/[\uDC00-\uDFFF]/.test(str.charAt(i)) && /[\uD800-\uDBFF]/.test(str.charAt(i - 1))) {
                            start--;
                            es--;
                        }
                    }
                } else {
                    var surrogatePairs = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;
                    while ((surrogatePairs.exec(str)) != null) {
                        var li = surrogatePairs.lastIndex;
                        if (li - 2 < start) {
                            start++;
                        } else {
                            break;
                        }
                    }
                }

                if (start >= end || start < 0) {
                    return false;
                }
                if (len < 0) {
                    for (i = end - 1, el = (end += len); i >= el; i--) {
                        if (/[\uDC00-\uDFFF]/.test(str.charAt(i)) && /[\uD800-\uDBFF]/.test(str.charAt(i - 1))) {
                            end--;
                            el--;
                        }
                    }
                    if (start > end) {
                        return false;
                    }
                    return str.slice(start, end);
                } else {
                    se = start + len;
                    for (i = start; i < se; i++) {
                        ret += str.charAt(i);
                        if (/[\uD800-\uDBFF]/.test(str.charAt(i)) && /[\uDC00-\uDFFF]/.test(str.charAt(i + 1))) {
                            // Go one further, since one of the "characters" is part of a surrogate pair
                            se++;
                        }
                    }
                    return ret;
                }
                break;
            }
        // Fall-through
        case 'off':
        // assumes there are no non-BMP characters;
        //    if there may be such characters, then it is best to turn it on (critical in true XHTML/XML)
        default:
            if (start < 0) {
                start += end;
            }
            end = typeof len === 'undefined' ? end : (len < 0 ? len + end : len + start);
            // PHP returns false if start does not fall within the string.
            // PHP returns false if the calculated end comes before the calculated start.
            // PHP returns an empty string if start and end are the same.
            // Otherwise, PHP returns the portion of the string from start to end.
            return start >= str.length || start < 0 || start > end ? !1 : str.slice(start, end);
    }
    // Please Netbeans
    return undefined;
}

function hexdec(hex_string) {
    hex_string = (hex_string + '')
        .replace(/[^a-f0-9]/gi, '');
    return parseInt(hex_string, 16);
}

function reverseString(str) { return str.split("").reverse().join(""); }

function str_pad(input, pad_length, pad_string, pad_type) {
    var half = '',
        pad_to_go;

    var str_pad_repeater = function(s, len) {
        var collect = '',
            i;

        while (collect.length < len) {
            collect += s;
        }
        collect = collect.substr(0, len);

        return collect;
    };

    input += '';
    pad_string = pad_string !== undefined ? pad_string : ' ';

    if (pad_type !== 'STR_PAD_LEFT' && pad_type !== 'STR_PAD_RIGHT' && pad_type !== 'STR_PAD_BOTH') {
        pad_type = 'STR_PAD_RIGHT';
    }
    if ((pad_to_go = pad_length - input.length) > 0) {
        if (pad_type === 'STR_PAD_LEFT') {
            input = str_pad_repeater(pad_string, pad_to_go) + input;
        } else if (pad_type === 'STR_PAD_RIGHT') {
            input = input + str_pad_repeater(pad_string, pad_to_go);
        } else if (pad_type === 'STR_PAD_BOTH') {
            half = str_pad_repeater(pad_string, Math.ceil(pad_to_go / 2));
            input = half + input + half;
            input = input.substr(0, pad_length);
        }
    }

    return input;
}

function date(format, timestamp) {

    var that = this;
    var jsdate, f;
    // Keep this here (works, but for code commented-out below for file size reasons)
    // var tal= [];
    var txt_words = [
        'Sun', 'Mon', 'Tues', 'Wednes', 'Thurs', 'Fri', 'Satur',
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    // trailing backslash -> (dropped)
    // a backslash followed by any character (including backslash) -> the character
    // empty string -> empty string
    var formatChr = /\\?(.?)/gi;
    var formatChrCb = function(t, s) {
        return f[t] ? f[t]() : s;
    };
    var _pad = function(n, c) {
        n = String(n);
        while (n.length < c) {
            n = '0' + n;
        }
        return n;
    };
    f = {
        // Day
        d : function() {
            // Day of month w/leading 0; 01..31
            return _pad(f.j(), 2);
        },
        D : function() {
            // Shorthand day name; Mon...Sun
            return f.l()
                .slice(0, 3);
        },
        j : function() {
            // Day of month; 1..31
            return jsdate.getDate();
        },
        l : function() {
            // Full day name; Monday...Sunday
            return txt_words[f.w()] + 'day';
        },
        N : function() {
            // ISO-8601 day of week; 1[Mon]..7[Sun]
            return f.w() || 7;
        },
        S : function() {
            // Ordinal suffix for day of month; st, nd, rd, th
            var j = f.j();
            var i = j % 10;
            if (i <= 3 && parseInt((j % 100) / 10, 10) == 1) {
                i = 0;
            }
            return ['st', 'nd', 'rd'][i - 1] || 'th';
        },
        w : function() {
            // Day of week; 0[Sun]..6[Sat]
            return jsdate.getDay();
        },
        z : function() {
            // Day of year; 0..365
            var a = new Date(f.Y(), f.n() - 1, f.j());
            var b = new Date(f.Y(), 0, 1);
            return Math.round((a - b) / 864e5);
        },

        // Week
        W : function() {
            // ISO-8601 week number
            var a = new Date(f.Y(), f.n() - 1, f.j() - f.N() + 3);
            var b = new Date(a.getFullYear(), 0, 4);
            return _pad(1 + Math.round((a - b) / 864e5 / 7), 2);
        },

        // Month
        F : function() {
            // Full month name; January...December
            return txt_words[6 + f.n()];
        },
        m : function() {
            // Month w/leading 0; 01...12
            return _pad(f.n(), 2);
        },
        M : function() {
            // Shorthand month name; Jan...Dec
            return f.F()
                .slice(0, 3);
        },
        n : function() {
            // Month; 1...12
            return jsdate.getMonth() + 1;
        },
        t : function() {
            // Days in month; 28...31
            return (new Date(f.Y(), f.n(), 0))
                .getDate();
        },

        // Year
        L : function() {
            // Is leap year?; 0 or 1
            var j = f.Y();
            return j % 4 === 0 & j % 100 !== 0 | j % 400 === 0;
        },
        o : function() {
            // ISO-8601 year
            var n = f.n();
            var W = f.W();
            var Y = f.Y();
            return Y + (n === 12 && W < 9 ? 1 : n === 1 && W > 9 ? -1 : 0);
        },
        Y : function() {
            // Full year; e.g. 1980...2010
            return jsdate.getFullYear();
        },
        y : function() {
            // Last two digits of year; 00...99
            return f.Y()
                .toString()
                .slice(-2);
        },

        // Time
        a : function() {
            // am or pm
            return jsdate.getHours() > 11 ? 'pm' : 'am';
        },
        A : function() {
            // AM or PM
            return f.a()
                .toUpperCase();
        },
        B : function() {
            // Swatch Internet time; 000..999
            var H = jsdate.getUTCHours() * 36e2;
            // Hours
            var i = jsdate.getUTCMinutes() * 60;
            // Minutes
            // Seconds
            var s = jsdate.getUTCSeconds();
            return _pad(Math.floor((H + i + s + 36e2) / 86.4) % 1e3, 3);
        },
        g : function() {
            // 12-Hours; 1..12
            return f.G() % 12 || 12;
        },
        G : function() {
            // 24-Hours; 0..23
            return jsdate.getHours();
        },
        h : function() {
            // 12-Hours w/leading 0; 01..12
            return _pad(f.g(), 2);
        },
        H : function() {
            // 24-Hours w/leading 0; 00..23
            return _pad(f.G(), 2);
        },
        i : function() {
            // Minutes w/leading 0; 00..59
            return _pad(jsdate.getMinutes(), 2);
        },
        s : function() {
            // Seconds w/leading 0; 00..59
            return _pad(jsdate.getSeconds(), 2);
        },
        u : function() {
            // Microseconds; 000000-999000
            return _pad(jsdate.getMilliseconds() * 1000, 6);
        },

        // Timezone
        e : function() {
            // Timezone identifier; e.g. Atlantic/Azores, ...
            // The following works, but requires inclusion of the very large
            // timezone_abbreviations_list() function.
            /*              return that.date_default_timezone_get();
             */
            throw 'Not supported (see source code of date() for timezone on how to add support)';
        },
        I : function() {
            // DST observed?; 0 or 1
            // Compares Jan 1 minus Jan 1 UTC to Jul 1 minus Jul 1 UTC.
            // If they are not equal, then DST is observed.
            var a = new Date(f.Y(), 0);
            // Jan 1
            var c = Date.UTC(f.Y(), 0);
            // Jan 1 UTC
            var b = new Date(f.Y(), 6);
            // Jul 1
            // Jul 1 UTC
            var d = Date.UTC(f.Y(), 6);
            return ((a - c) !== (b - d)) ? 1 : 0;
        },
        O : function() {
            // Difference to GMT in hour format; e.g. +0200
            var tzo = jsdate.getTimezoneOffset();
            var a = Math.abs(tzo);
            return (tzo > 0 ? '-' : '+') + _pad(Math.floor(a / 60) * 100 + a % 60, 4);
        },
        P : function() {
            // Difference to GMT w/colon; e.g. +02:00
            var O = f.O();
            return (O.substr(0, 3) + ':' + O.substr(3, 2));
        },
        T : function() {
            return 'UTC';
        },
        Z : function() {
            // Timezone offset in seconds (-43200...50400)
            return -jsdate.getTimezoneOffset() * 60;
        },

        // Full Date/Time
        c : function() {
            // ISO-8601 date.
            return 'Y-m-d\\TH:i:sP'.replace(formatChr, formatChrCb);
        },
        r : function() {
            // RFC 2822
            return 'D, d M Y H:i:s O'.replace(formatChr, formatChrCb);
        },
        U : function() {
            // Seconds since UNIX epoch
            return jsdate / 1000 | 0;
        }
    };
    this.date = function(format, timestamp) {
        that = this;
        jsdate = (timestamp === undefined ? new Date() : // Not provided
                (timestamp instanceof Date) ? new Date(timestamp) : // JS Date()
                    new Date(timestamp * 1000) // UNIX timestamp (auto-convert to int)
        );
        return format.replace(formatChr, formatChrCb);
    };
    return this.date(format, timestamp);
}

function strtotime(text, now) {

    var parsed, match, today, year, date, days, ranges, len, times, regex, i, fail = false;

    if (!text) {
        return fail;
    }

    // Unecessary spaces
    text = text.replace(/^\s+|\s+$/g, '')
        .replace(/\s{2,}/g, ' ')
        .replace(/[\t\r\n]/g, '')
        .toLowerCase();

    // in contrast to php, js Date.parse function interprets:
    // dates given as yyyy-mm-dd as in timezone: UTC,
    // dates with "." or "-" as MDY instead of DMY
    // dates with two-digit years differently
    // etc...etc...
    // ...therefore we manually parse lots of common date formats
    match = text.match(
        /^(\d{1,4})([\-\.\/\:])(\d{1,2})([\-\.\/\:])(\d{1,4})(?:\s(\d{1,2}):(\d{2})?:?(\d{2})?)?(?:\s([A-Z]+)?)?$/);

    if (match && match[2] === match[4]) {
        if (match[1] > 1901) {
            switch (match[2]) {
                case '-': {
                    // YYYY-M-D
                    if (match[3] > 12 || match[5] > 31) {
                        return fail;
                    }

                    return new Date(match[1], parseInt(match[3], 10) - 1, match[5],
                            match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000;
                }
                case '.': {
                    // YYYY.M.D is not parsed by strtotime()
                    return fail;
                }
                case '/': {
                    // YYYY/M/D
                    if (match[3] > 12 || match[5] > 31) {
                        return fail;
                    }

                    return new Date(match[1], parseInt(match[3], 10) - 1, match[5],
                            match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000;
                }
            }
        } else if (match[5] > 1901) {
            switch (match[2]) {
                case '-': {
                    // D-M-YYYY
                    if (match[3] > 12 || match[1] > 31) {
                        return fail;
                    }

                    return new Date(match[5], parseInt(match[3], 10) - 1, match[1],
                            match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000;
                }
                case '.': {
                    // D.M.YYYY
                    if (match[3] > 12 || match[1] > 31) {
                        return fail;
                    }

                    return new Date(match[5], parseInt(match[3], 10) - 1, match[1],
                            match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000;
                }
                case '/': {
                    // M/D/YYYY
                    if (match[1] > 12 || match[3] > 31) {
                        return fail;
                    }

                    return new Date(match[5], parseInt(match[1], 10) - 1, match[3],
                            match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000;
                }
            }
        } else {
            switch (match[2]) {
                case '-': {
                    // YY-M-D
                    if (match[3] > 12 || match[5] > 31 || (match[1] < 70 && match[1] > 38)) {
                        return fail;
                    }

                    year = match[1] >= 0 && match[1] <= 38 ? +match[1] + 2000 : match[1];
                    return new Date(year, parseInt(match[3], 10) - 1, match[5],
                            match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000;
                }
                case '.': {
                    // D.M.YY or H.MM.SS
                    if (match[5] >= 70) {
                        // D.M.YY
                        if (match[3] > 12 || match[1] > 31) {
                            return fail;
                        }

                        return new Date(match[5], parseInt(match[3], 10) - 1, match[1],
                                match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000;
                    }
                    if (match[5] < 60 && !match[6]) {
                        // H.MM.SS
                        if (match[1] > 23 || match[3] > 59) {
                            return fail;
                        }

                        today = new Date();
                        return new Date(today.getFullYear(), today.getMonth(), today.getDate(),
                                match[1] || 0, match[3] || 0, match[5] || 0, match[9] || 0) / 1000;
                    }

                    // invalid format, cannot be parsed
                    return fail;
                }
                case '/': {
                    // M/D/YY
                    if (match[1] > 12 || match[3] > 31 || (match[5] < 70 && match[5] > 38)) {
                        return fail;
                    }

                    year = match[5] >= 0 && match[5] <= 38 ? +match[5] + 2000 : match[5];
                    return new Date(year, parseInt(match[1], 10) - 1, match[3],
                            match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000;
                }
                case ':': {
                    // HH:MM:SS
                    if (match[1] > 23 || match[3] > 59 || match[5] > 59) {
                        return fail;
                    }

                    today = new Date();
                    return new Date(today.getFullYear(), today.getMonth(), today.getDate(),
                            match[1] || 0, match[3] || 0, match[5] || 0) / 1000;
                }
            }
        }
    }

    // other formats and "now" should be parsed by Date.parse()
    if (text === 'now') {
        return now === null || isNaN(now) ? new Date()
                .getTime() / 1000 | 0 : now | 0;
    }
    if (!isNaN(parsed = Date.parse(text))) {
        return parsed / 1000 | 0;
    }
    // Browsers != Chrome have problems parsing ISO 8601 date strings, as they do
    // not accept lower case characters, space, or shortened time zones.
    // Therefore, fix these problems and try again.
    // Examples:
    //   2015-04-15 20:33:59+02
    //   2015-04-15 20:33:59z
    //   2015-04-15t20:33:59+02:00
    if (match = text.match(
            /^([0-9]{4}-[0-9]{2}-[0-9]{2})[ t]([0-9]{2}:[0-9]{2}:[0-9]{2}(\.[0-9]+)?)([\+-][0-9]{2}(:[0-9]{2})?|z)/)) {
        // fix time zone information
        if (match[4] == 'z') {
            match[4] = 'Z';
        } else if (match[4].match(/^([\+-][0-9]{2})$/)) {
            match[4] = match[4] + ':00';
        }

        if (!isNaN(parsed = Date.parse(match[1] + 'T' + match[2] + match[4]))) {
            return parsed / 1000 | 0;
        }
    }

    date = now ? new Date(now * 1000) : new Date();
    days = {
        'sun' : 0,
        'mon' : 1,
        'tue' : 2,
        'wed' : 3,
        'thu' : 4,
        'fri' : 5,
        'sat' : 6
    };
    ranges = {
        'yea' : 'FullYear',
        'mon' : 'Month',
        'day' : 'Date',
        'hou' : 'Hours',
        'min' : 'Minutes',
        'sec' : 'Seconds'
    };

    function lastNext(type, range, modifier) {
        var diff, day = days[range];

        if (typeof day !== 'undefined') {
            diff = day - date.getDay();

            if (diff === 0) {
                diff = 7 * modifier;
            } else if (diff > 0 && type === 'last') {
                diff -= 7;
            } else if (diff < 0 && type === 'next') {
                diff += 7;
            }

            date.setDate(date.getDate() + diff);
        }
    }

    function process(val) {
        var splt = val.split(' '), // Todo: Reconcile this with regex using \s, taking into account browser issues with split and regexes
            type = splt[0],
            range = splt[1].substring(0, 3),
            typeIsNumber = /\d+/.test(type),
            ago = splt[2] === 'ago',
            num = (type === 'last' ? -1 : 1) * (ago ? -1 : 1);

        if (typeIsNumber) {
            num *= parseInt(type, 10);
        }

        if (ranges.hasOwnProperty(range) && !splt[1].match(/^mon(day|\.)?$/i)) {
            return date['set' + ranges[range]](date['get' + ranges[range]]() + num);
        }

        if (range === 'wee') {
            return date.setDate(date.getDate() + (num * 7));
        }

        if (type === 'next' || type === 'last') {
            lastNext(type, range, num);
        } else if (!typeIsNumber) {
            return false;
        }

        return true;
    }

    times = '(years?|months?|weeks?|days?|hours?|minutes?|min|seconds?|sec' +
        '|sunday|sun\\.?|monday|mon\\.?|tuesday|tue\\.?|wednesday|wed\\.?' +
        '|thursday|thu\\.?|friday|fri\\.?|saturday|sat\\.?)';
    regex = '([+-]?\\d+\\s' + times + '|' + '(last|next)\\s' + times + ')(\\sago)?';

    match = text.match(new RegExp(regex, 'gi'));
    if (!match) {
        return fail;
    }

    for (i = 0, len = match.length; i < len; i++) {
        if (!process(match[i])) {
            return fail;
        }
    }

    // ECMAScript 5 only
    // if (!match.every(process))
    //    return false;

    return (date.getTime() / 1000);
}

function getDistance($lat1, $lng1, $lat2, $lng2) {
    var $earthRadius = 6367000; //approximate radius of earth in meters

    $lat1 = ($lat1 * pi() ) / 180;
    $lng1 = ($lng1 * pi() ) / 180;

    $lat2 = ($lat2 * pi() ) / 180;
    $lng2 = ($lng2 * pi() ) / 180;

    var $calcLongitude = $lng2 - $lng1;
    var $calcLatitude = $lat2 - $lat1;
    var $stepOne = Math.pow(Math.sin($calcLatitude / 2), 2) + Math.cos($lat1) * Math.cos($lat2) * Math.pow(Math.sin($calcLongitude / 2), 3);
    var $stepTwo = 2 * Math.asin(min(1, Math.sqrt($stepOne)));
    var $calculatedDistance = $earthRadius * $stepTwo;

    return round($calculatedDistance);
}
function pi() {
    return 3.141592653589793; // Math.PI
}
function min() {
    var ar, retVal, i = 0,
        n = 0,
        argv = arguments,
        argc = argv.length,
        _obj2Array = function(obj) {
            if (Object.prototype.toString.call(obj) === '[object Array]') {
                return obj;
            }
            var ar = [];
            for (var i in obj) {
                if (obj.hasOwnProperty(i)) {
                    ar.push(obj[i]);
                }
            }
            return ar;
        }, //function _obj2Array
        _compare = function(current, next) {
            var i = 0,
                n = 0,
                tmp = 0,
                nl = 0,
                cl = 0;

            if (current === next) {
                return 0;
            } else if (typeof current === 'object') {
                if (typeof next === 'object') {
                    current = _obj2Array(current);
                    next = _obj2Array(next);
                    cl = current.length;
                    nl = next.length;
                    if (nl > cl) {
                        return 1;
                    } else if (nl < cl) {
                        return -1;
                    }
                    for (i = 0, n = cl; i < n; ++i) {
                        tmp = _compare(current[i], next[i]);
                        if (tmp == 1) {
                            return 1;
                        } else if (tmp == -1) {
                            return -1;
                        }
                    }
                    return 0;
                }
                return -1;
            } else if (typeof next === 'object') {
                return 1;
            } else if (isNaN(next) && !isNaN(current)) {
                if (current == 0) {
                    return 0;
                }
                return (current < 0 ? 1 : -1);
            } else if (isNaN(current) && !isNaN(next)) {
                if (next == 0) {
                    return 0;
                }
                return (next > 0 ? 1 : -1);
            }

            if (next == current) {
                return 0;
            }
            return (next > current ? 1 : -1);
        }; //function _compare

    if (argc === 0) {
        throw new Error('At least one value should be passed to min()');
    } else if (argc === 1) {
        if (typeof argv[0] === 'object') {
            ar = _obj2Array(argv[0]);
        } else {
            throw new Error('Wrong parameter count for min()');
        }

        if (ar.length === 0) {
            throw new Error('Array must contain at least one element for min()');
        }
    } else {
        ar = argv;
    }

    retVal = ar[0];

    for (i = 1, n = ar.length; i < n; ++i) {
        if (_compare(retVal, ar[i]) == -1) {
            retVal = ar[i];
        }
    }

    return retVal;
}

function round(value, precision, mode) {

    var m, f, isHalf, sgn; // helper variables
    // making sure precision is integer
    precision |= 0;
    m = Math.pow(10, precision);
    value *= m;
    // sign of the number
    sgn = (value > 0) | -(value < 0);
    isHalf = value % 1 === 0.5 * sgn;
    f = Math.floor(value);

    if (isHalf) {
        switch (mode) {
            case 'PHP_ROUND_HALF_DOWN':
                // rounds .5 toward zero
                value = f + (sgn < 0);
                break;
            case 'PHP_ROUND_HALF_EVEN':
                // rouds .5 towards the next even integer
                value = f + (f % 2 * sgn);
                break;
            case 'PHP_ROUND_HALF_ODD':
                // rounds .5 towards the next odd integer
                value = f + !(f % 2);
                break;
            default:
                // rounds .5 away from zero
                value = f + (sgn > 0);
        }
    }

    return (isHalf ? value : formatFloat(value, 3)) / m;
}

function formatFloat(num, pos) {
    var size = Math.pow(10, pos);
    return Math.round(num * size) / size;
}

function number_format(number, decimals, dec_point, thousands_sep) {
    number = (number + '')
        .replace(/[^0-9+\-Ee.]/g, '');
    var n = !isFinite(+number) ? 0 : +number,
        prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
        sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
        dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
        s = '',
        toFixedFix = function(n, prec) {
            var k = Math.pow(10, prec);
            return '' + (Math.round(n * k) / k)
                    .toFixed(prec);
        };
    // Fix for IE parseFloat(0.55).toFixed(0) = 0;
    s = (prec ? toFixedFix(n, prec) : '' + Math.round(n))
        .split('.');
    if (s[0].length > 3) {
        s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
    }
    if ((s[1] || '')
            .length < prec) {
        s[1] = s[1] || '';
        s[1] += new Array(prec - s[1].length + 1)
            .join('0');
    }
    return s.join(dec);
}

function str_replace(search, replace, subject, count) {
    var i = 0,
        j = 0,
        temp = '',
        repl = '',
        sl = 0,
        fl = 0,
        f = [].concat(search),
        r = [].concat(replace),
        s = subject,
        ra = Object.prototype.toString.call(r) === '[object Array]',
        sa = Object.prototype.toString.call(s) === '[object Array]';
    s = [].concat(s);

    if (typeof (search) === 'object' && typeof (replace) === 'string') {
        temp = replace;
        replace = new Array();
        for (i = 0; i < search.length; i += 1) {
            replace[i] = temp;
        }
        temp = '';
        r = [].concat(replace);
        ra = Object.prototype.toString.call(r) === '[object Array]';
    }

    if (count) {
        this.window[count] = 0;
    }

    for (i = 0, sl = s.length; i < sl; i++) {
        if (s[i] === '') {
            continue;
        }
        for (j = 0, fl = f.length; j < fl; j++) {
            temp = s[i] + '';
            repl = ra ? (r[j] !== undefined ? r[j] : '') : r[0];
            s[i] = (temp)
                .split(f[j])
                .join(repl);
            if (count) {
                this.window[count] += ((temp.split(f[j]))
                    .length - 1);
            }
        }
    }
    return sa ? s : s[0];
}
function explode(delimiter, string, limit) {
    if (arguments.length < 2 || typeof delimiter === 'undefined' || typeof string === 'undefined') return null;
    if (delimiter === '' || delimiter === false || delimiter === null) return false;
    if (typeof delimiter === 'function' || typeof delimiter === 'object' || typeof string === 'function' || typeof string ===
        'object') {
        return {
            0 : ''
        };
    }
    if (delimiter === true) delimiter = '1';

    // Here we go...
    delimiter += '';
    string += '';

    var s = string.split(delimiter);

    if (typeof limit === 'undefined') return s;

    // Support for limit
    if (limit === 0) limit = 1;

    // Positive limit
    if (limit > 0) {
        if (limit >= s.length) return s;
        return s.slice(0, limit - 1)
            .concat([s.slice(limit - 1)
                .join(delimiter)
            ]);
    }

    // Negative limit
    if (-limit >= s.length) return [];

    s.splice(s.length + limit);
    return s;
}

function time() {
    return Math.floor(new Date()
            .getTime() / 1000);
}