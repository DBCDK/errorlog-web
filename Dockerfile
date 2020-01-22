FROM docker.dbc.dk/payara5-micro:latest

LABEL ERRORLOG_DB="ERRORLOG_DB database URL (USER:PASSWORD@HOST:PORT/DBNAME) of the underlying errorlog store."
LABEL TEAM="(Optional) Team to filter logmessages for."
LABEL NAMESPACE="(Optional) Namespace to filter logmessages for."

COPY errorlog-web-service/target/errorlog-web-service-*.war app.json deployments/
