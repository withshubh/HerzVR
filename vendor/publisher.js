var clicks = 0, total = 7;
AFRAME.registerComponent('cut-heart', {
  schema: {
  },

  init: function () {
    var data = this.data;
    var el = this.el;  // <a-box>

    el.addEventListener('click', function () {
      // el.setAttribute('color', data.color);
           clicks++;
           if(clicks < total){
            $(`#heartCut${clicks}`).attr('position', "0 -1 -2.1");
            $(`#heartCut${clicks-1}`).remove();
           }
      console.log("Clicked",clicks);
    });
  }
});
function setupAgoraSDKforPublisher(channel){
    if(!AgoraRTC.checkSystemRequirements()) {
        alert("Your browser does not support WebRTC!");
      }
      var client, localStream;
      client = AgoraRTC.createClient({mode: 'live',codec: "h264"});
        client.init('7041dbc051304a33b10989bedb5a846d', function () {
          console.log("AgoraRTC client initialized");
          var channel_key = null;
          client.join(channel_key, channel, null, function(uid) {
            console.log("User " + uid + " join channel successfully");      
              localStream = AgoraRTC.createStream({
                    streamID: uid,
                    audio: true,
                    video: false,
                    screen: true,
                    mediaSource: 'screen' // 'screen', 'application', 'window'
                  });
      
              // The user has granted access to the camera and mic.
              localStream.on("accessAllowed", function() {
                console.log("accessAllowed");
              });
      
              // The user has denied access to the camera and mic.
              localStream.on("accessDenied", function() {
                console.log("accessDenied");
              });
      
              localStream.init(function() {
                console.log("getUserMedia successfully");
                client.publish(localStream, function (err) {
                  console.log("Publish local stream error: " + err);
                });
      
                client.on('stream-published', function (evt) {
                  console.log("Publish local stream successfully");
                });
              }, function (err) {
                console.log("getUserMedia failed", err);
              });
        
          }, function(err) {
            console.log("Join channel failed", err);
          });
        }, function (err) {
          console.log("AgoraRTC client init failed", err);
        });
        channelKey = "";
        client.on('error', function(err) {
          console.log("Got error msg:", err.reason);
          if (err.reason === 'DYNAMIC_KEY_TIMEOUT') {
            client.renewChannelKey(channelKey, function(){
              console.log("Renew channel key successfully");
            }, function(err){
              console.log("Renew channel key failed: ", err);
            });
          }
        });
}

function getQueryStringValue (key) {  
  return decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));  
} 