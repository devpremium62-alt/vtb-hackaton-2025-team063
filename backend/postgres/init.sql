\echo 'Applying MultiBank initial database configuration'

SELECT current_database() AS dbname \gset

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "citext";

SELECT format('ALTER DATABASE %I SET timezone TO %L', :'dbname', 'Europe/Moscow');
\gexec
SELECT format('ALTER DATABASE %I SET client_encoding TO %L', :'dbname', 'UTF8');
\gexec
SELECT format('ALTER DATABASE %I SET default_text_search_config TO %L', :'dbname', 'pg_catalog.simple');
\gexec
SELECT format('ALTER DATABASE %I SET bytea_output TO %L', :'dbname', 'hex');
\gexec

DO
$$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'multibank_app') THEN
        CREATE ROLE multibank_app WITH LOGIN PASSWORD 'multibank_app_pass';
        RAISE NOTICE 'Role "multibank_app" created with default password. Please change it in production.';
    END IF;
END;
$$;

DO
$$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'multibank_readonly') THEN
        CREATE ROLE multibank_readonly WITH LOGIN PASSWORD 'multibank_readonly_pass';
        RAISE NOTICE 'Role "multibank_readonly" created with default password. Please change it in production.';
    END IF;
END;
$$;

SELECT format('GRANT CONNECT ON DATABASE %I TO %I', :'dbname', 'multibank_app');
\gexec
SELECT format('GRANT ALL PRIVILEGES ON DATABASE %I TO %I', :'dbname', 'multibank_app');
\gexec
GRANT USAGE, CREATE ON SCHEMA public TO multibank_app;
ALTER ROLE multibank_app SET search_path = 'public';

SELECT format('GRANT CONNECT ON DATABASE %I TO %I', :'dbname', 'multibank_readonly');
\gexec
GRANT USAGE ON SCHEMA public TO multibank_readonly;
ALTER ROLE multibank_readonly SET search_path = 'public';

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO multibank_readonly;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, USAGE ON SEQUENCES TO multibank_readonly;

REVOKE CREATE ON SCHEMA public FROM PUBLIC;

COMMENT ON ROLE multibank_app IS 'Application role for MultiBank backend (Django). Password must be rotated for production.';
COMMENT ON ROLE multibank_readonly IS 'Read-only role for analytics/reporting. Password must be rotated for production.';