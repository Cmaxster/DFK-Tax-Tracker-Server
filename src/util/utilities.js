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
  
exports.epochToDDMMYYYY = (utcSeconds) => {
	let d = new Date(0);
	d.setUTCSeconds(utcSeconds);
	let formattedDate = d.getUTCDate() + '-' + (d.getUTCMonth() + 1)+ '-' + d.getUTCFullYear();
	return formattedDate;
}