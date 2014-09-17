var connect = require('connect');
var login = require('./login');
var app = connect();

app.use(connect.json()); // Parse JSON request body into `request.body`
app.use(connect.urlencoded()); // Parse form in request body into `request.body`
app.use(connect.cookieParser()); // Parse cookies in the request headers into `request.cookies`
app.use(connect.query()); // Parse query string into `request.query`
app.use('/', main);

function main(request, response, next) {
     switch (request.method) {
          case 'GET': get(request, response); break;
          case 'POST': post(request, response); break;
          case 'DELETE': del(request, response); break;
          case 'PUT': put(request, response); break;
     }
};

function get(request, response) {
     var cookies = request.cookies;
     console.log(cookies);
     
     if ('session_id' in cookies) {
          var sid = cookies['session_id'];
          if ( login.isLoggedIn(sid) ) {
               response.setHeader('Set-Cookie', 'session_id=' + sid);
               response.end(login.hello(sid)); 
          } else {  
               response.end("Invalid session_id! Please login again\n");
          }
     } else {
          response.end("Please login via HTTP POST\n");
     }
};


function post(request, response) {
// TODO: read 'name and email from the request.body'
// var newSessionId = login.login('xxx', 'xxx@gmail.com');
// TODO: set new session id to the 'session_id' cookie in the response
// replace "Logged In" response with response.end(login.hello(newSessionId));

     var cookies = request.body;http:
     console.log(cookies);
     if('name' in cookies){
          var nm = cookies['name'];
     }
     if ('email' in cookies) {
          var em = cookies['email'];
     };
     var newSessionId = login.login(nm, em);
     
    
     response.setHeader('Set-Cookie', 'session_id=' + newSessionId);
     response.end(login.hello(newSessionId)); 
            
};

function del(request, response) {
     console.log("DELETE:: Logout from the server");

     // TODO: remove session id via login.logout(xxx)

     // No need to set session id in the response cookies since you just logged out!
     
     var cookies = request.cookies;
     console.log(cookies);
     
     if ('session_id' in cookies) {
          var del_sid = cookies['session_id'];
          if ( login.isLoggedIn(del_sid) ) {               
               response.end(login.logout(del_sid)); 
          } else {
               response.end("Invalid session_id! Please login again\n");
          }
     } else {
          response.end("Please login via HTTP POST\n");
     }

     response.end('Logged out from the server\n');
};

function put(request, response) {
	console.log("PUT:: Re-generate new seesion_id for the same user");
// TODO: refresh session id; similar to the post() function


     var cookies = request.cookies;
     if('session_id' in cookies){
          var old_sid = cookies['session_id'];

          if (login.isLoggedIn(old_sid)) {
               var refreshed_sid = login.refreshLogin(old_sid);
               response.setHeader('Set-Cookie', 'session_id=' + refreshed_sid);
               response.end(login.hello(refreshed_sid)); 
	       repsonse.end("Session refreshed!"); 	
          }else{
               response.end("Invalid session_id! Please login again\n");
          }
     }else{
          response.end("Please login via HTTP POST\n"); 
     }
};

app.listen(8000);
console.log("Node.JS server running at 8000...");
