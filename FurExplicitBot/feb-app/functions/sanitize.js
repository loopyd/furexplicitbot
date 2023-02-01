// sanitize.js: clean my scales and prevent me from being messed up by all kinds of
//              nasty stuff only trolls find funny

// try to clean my scales by sanitizing a key
global.sanitizeKey = async (interaction, key) => {
    if (!key.match(/^[_a-z]\w*$/g)) {
        messageFail(interaction, uwu('Sorry, that\'s not a valid key identifier (must start with A-Z or underscore (\_) and not start with a number)'));
    }
    return key;
}
  
// try to clean my scales by sanitizing a value
global.sanitizeValue = async (interaction, value) => {
    let rvalue;
    if (value.match(/^(true|enabled|yes)$/gi)) {
        // the user wanted to set the value to a "true" condition.
        rvalue = true;
    } else if (value.match(/^(false|disabled|no)$/gi)) {
        // the user wanted to set the value to a "false" condition.
        rvalue = false;
    } else if (value.match(/^([-]?\d*\.?\d+)(?:[eE]([-+]?\d+))?$/gi)) {
        // the user wanted to set the value to a number with an exponent
        rvalue = Number(value);
    } else if (value.match(/^[-]?\d*\.?\d+$/gi)) {
        // the user wanted to set the value to a number with a decimal point.
        rvalue = Number(value);
    } else if (value.match(/^[-]?\d+$/gi)) {
        // the user wanted to set the value to an integer
        rvalue = Number(value) % 1 === 0 ? Number(value) : 0;
    } else if (value != null) {
        if (String(value).trim().toLowerCase() == 'null') {
            // the user actually wanted to set this value to null, so we allow it
            rvalue = null;
        } else {
            // in the last case that we allow, user wanted to set it to a string
            if (value.match(/[\u{0080}-\u{FFFF}]/gu)) {
                // This is likely the case of someone trying to use an emoji,
                // zillcode, or the 'unicode text generator'.  it also happily
                // blocks the iOS springboard bomb and angular.js crashbomb.
                messageFail(interaction, uwu('Invalid value specified:  ASCII characters only, please.'));
            } else {
                rvalue = String(value).trim().length > 0 ? String(value).trim() : '';
            }
        }
    } else {
        messageFail(interaction, uwu(`Invalid value specified: A value required to be specified is missing.`));
    }
    return rvalue;
  }
  
  // try to clean my scales by sanitizing key/value pairs.
  global.sanitizeKvp = async (interaction, params) => {
    const { key, lvalue } = params
    const rkey = await sanitizeKey(interaction, key);
    const rvalue = await sanitizeValue(interaction, lvalue);
    return [ rkey, rvalue ];
  }