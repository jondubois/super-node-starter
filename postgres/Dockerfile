FROM postgres:9.4.7

RUN mkdir -p /docker-entrypoint-initdb.d
COPY ./init /docker-entrypoint-initdb.d

# Add VOLUMEs to allow backup of config, logs and databases
VOLUME  ["/etc/postgresql", "/var/log/postgresql", "/var/lib/postgresql"]

EXPOSE 5432
