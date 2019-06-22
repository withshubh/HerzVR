function setupAgoraSDKforSubscriber(channel){
    if(!AgoraRTC.checkSystemRequirements()) {
        alert("Your browser does not support WebRTC!");
      }
      
      var client, localStream, camera, microphone;
      client = AgoraRTC.createClient({mode: 'live',codec: "h264"});
      client.init('7041dbc051304a33b10989bedb5a846d', function () {
          console.log("AgoraRTC client initialized");
          var channel_key = null;
          client.join(channel_key, channel, null, function(uid) {
            console.log("User " + uid + " join channel successfully");      
      
        
          }, function(err) {
            console.error("Join channel failed", err);
          });
        }, function (err) {
          console.error("AgoraRTC client init failed", err);
        });
      client.on('stream-added', function (evt) {
      var stream = evt.stream;
      console.log("New stream added: " + stream.getId());
    
      client.subscribe(stream, function (err) {
        console.log("Subscribe stream failed", err);
      });
    });
    client.on('stream-subscribed', function (evt) {
      var remoteStream = evt.stream;
      console.log("Subscribe remote stream successfully: " + remoteStream.getId());
        $(`#${channel}`).html('');
      remoteStream.play(channel);
        var video = $('#video div div video');
        if (video && video.length > 0) {
            video[0].controls = true;
            video[0].play().catch(console.error);
        }

    });
    client.on('peer-leave', function(evt) {
        console.log('Peer Left');
        alert('Event has ended');
    });
        
        channelKey = "";
        client.on('error', function(err) {
          console.log("Got error msg:", err.reason);
          if (err.reason === 'DYNAMIC_KEY_TIMEOUT') {
            client.renewChannelKey(channelKey, function(){
              console.log("Renew channel key successfully");
            }, function(err){
              console.error("Renew channel key failed: ", err);
            });
          }
        });
    
}

function getQueryStringValue (key) {  
  return decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));  
} 