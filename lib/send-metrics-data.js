/* global Services */

const {Cu} = require('chrome');
Cu.import('resource://gre/modules/Services.jsm');

const { getActiveView } = require('sdk/view/core');

module.exports = sendMetricsData;

function sendMetricsData(o, panel) {
  // Note: panel is optional, used to avoid circular refs with panel-utils.js.
  panel = panel || require('./panel-utils.js').getPanel();

  if (!panel) return;

  const coords = getActiveView(panel).getBoundingClientRect();
  // NOTE: this packet follows a predefined data format and cannot be changed
  //       without notifying the data team. See docs/metrics.md for more.
  const data = {
    object: o.object,
    method: o.method,
    domain: o.domain,
    video_x: coords.left,
    video_y: coords.top,
    video_width: coords.width,
    video_height: coords.height
  };

  const subject = {
    wrappedJSObject: {
      observersModuleSubjectWrapper: true,
      object: '@min-vid'
    }
  };
  Services.obs.notifyObservers(subject, 'testpilot::send-metric', JSON.stringify(data));
}
