cd C:\Users\raghu\Documents\Comorin\RE Project\Development
start/min  start_db.bat
set NODE_ENV=development
set debug=example-server
REM
REM database server ip and port. Also the database name
REM set db_ip=192.168.1.11
set db_ip=localhost
set db_Port=27017
set db_name=recrankcasedb
REM
REM set the web server ip and port
REM set server_ip=127.0.0.1
REM server_ip=192.168.1.11
set server_ip=localhost
set server_port=8080
REM
REM provide the transmitter ip address, port and capcode
set transmitter_ip=192.168.1.37
set transmitter_port=30090
set transmitter_capCode=039
node bin/www