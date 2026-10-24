package com.surrealtreasures.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;
import java.net.URI;

/**
 * Cloud and Local Database Configuration.
 * Automatically adapts cloud DATABASE_URL (postgres:// or postgresql://)
 * provided by Render, Railway, Neon, and Supabase into JDBC format.
 */
@Configuration
public class DatabaseConfig {

    private static final Logger log = LoggerFactory.getLogger(DatabaseConfig.class);

    @Bean
    @Primary
    public DataSource dataSource(DataSourceProperties properties) {
        String databaseUrl = System.getenv("DATABASE_URL");
        if (databaseUrl != null && (databaseUrl.startsWith("postgres://") || databaseUrl.startsWith("postgresql://"))) {
            try {
                URI uri = new URI(databaseUrl);
                String userInfo = uri.getUserInfo();
                String username = properties.getUsername();
                String password = properties.getPassword();
                if (userInfo != null && userInfo.contains(":")) {
                    String[] parts = userInfo.split(":", 2);
                    username = parts[0];
                    password = parts[1];
                }
                int port = uri.getPort() != -1 ? uri.getPort() : 5432;
                String host = uri.getHost();
                String path = uri.getPath(); // e.g. /dbname
                String jdbcUrl = "jdbc:postgresql://" + host + ":" + port + path;

                log.info("Successfully adapted cloud DATABASE_URL into JDBC format: jdbc:postgresql://{}:{}{}", host, port, path);
                return properties.initializeDataSourceBuilder()
                        .url(jdbcUrl)
                        .username(username)
                        .password(password)
                        .build();
            } catch (Exception e) {
                log.warn("Could not parse cloud DATABASE_URL URI, falling back to default datasource properties: {}", e.getMessage());
            }
        }
        return properties.initializeDataSourceBuilder().build();
    }
}
