FROM docker.dbc.dk/payara5-micro:latest

LABEL ERRORLOG_DB="ERRORLOG_DB database URL (USER:PASSWORD@HOST:PORT/DBNAME) of the underlying errorlog store."

COPY errorlog-web-service/target/errorlog-web-service-*.war app.json deployments/