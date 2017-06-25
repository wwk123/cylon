var socket = io();
  socket.on('news',function(data){
      $('#t').text(data[0]/10+"*C");
      $('#s').text("%"+data[1]/10);
      $('#g').text(data[2]+"lux");
  });
  
  