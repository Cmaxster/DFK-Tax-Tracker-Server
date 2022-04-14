/**
 * A collection of utility methods..
 *   
 */

exports.epochToUtc = (utcSeconds) => {
    let d = new Date(0);
    var options = { hour12: false };
    d.setUTCSeconds(utcSeconds);
    return d.toLocaleString('en-US', options);
  }
  