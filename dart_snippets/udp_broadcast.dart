
import 'package:udp/udp.dart';


void main() async{

  // crea instancia udp para enviar mensajes broadcast desde puerto 65000 de este dispositivo
  var sender = await UDP.bind(Endpoint.any(port: Port(65000)));
  
  // crea instancia udp en el puerto 65002 de este dispositivo para recivir mensajes.
  var receiver = await UDP.bind(Endpoint.loopback(port: Port(4001)));
  
  // receiving\listening
  receiver.listen((datagram) {
    var str = String.fromCharCodes(datagram.data);
    print(str);
  }, timeout: Duration(seconds: 5));

  // send a simple string to a broadcast endpoint on port 65001.
  var dataLength = await sender.send("udp_broadcast from dart app".codeUnits,
    Endpoint.broadcast(port: Port(2100)));
}