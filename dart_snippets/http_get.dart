import 'package:http/http.dart' as http;

void main() async{
  var params = {'nombre':'rojo'};
  var get_url= Uri.http('localhost:3000', '/buscar_producto', params);
  var x = await http.get(get_url);
  print('${x.body}');
  print(x.statusCode);
}

/// funciona ya que al ver el raw generado se puede ver pone los parametros en from:
/// pero por algun motivo en expressjs no funciona y body siempre esta vacio.
/// al parecer tiene que ver con algo del expressjs llamado bodyparser que no soporta multiforms.
/// todo esto se corroboro con servistate un addon para chrome, el post construido por este codigo de dart
/// parece ser valido. el problema parece ser cosa de expressjs con el post
/// check 
void ejemploPost() async{
  var url = 'https://postman-echo.com/post';
  var response = await http.post(url,
   body: {'nombre': 'doodle', 'razon': 'jajajajajajajajaj xd xd lol lol lol jajajajajaajaj'});
  print('Response status: ${response.statusCode}');
  print('Response body: ${response.body}');
}
