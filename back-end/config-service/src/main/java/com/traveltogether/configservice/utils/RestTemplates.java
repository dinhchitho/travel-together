package com.traveltogether.configservice.utils;

import org.apache.http.client.HttpClient;
import org.apache.http.config.RegistryBuilder;
import org.apache.http.conn.socket.ConnectionSocketFactory;
import org.apache.http.conn.socket.PlainConnectionSocketFactory;
import org.apache.http.conn.ssl.NoopHostnameVerifier;
import org.apache.http.conn.ssl.SSLConnectionSocketFactory;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.impl.conn.PoolingHttpClientConnectionManager;
import org.apache.http.ssl.SSLContextBuilder;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.http.converter.StringHttpMessageConverter;
import org.springframework.web.client.RestTemplate;

import javax.net.ssl.SSLContext;
import java.nio.charset.StandardCharsets;

public class RestTemplates {

    protected static final Logger LOGGER = LogManager.getLogger(RestTemplates.class);
    private static final boolean disableSSL = true;

    public static RestTemplate getRestTemplate() {
        RestTemplate restTemplate = new RestTemplate();
        restTemplate.getMessageConverters().add(0, new StringHttpMessageConverter(StandardCharsets.UTF_8));
        if (disableSSL) {
            try {
                HttpClientBuilder clientBuilder = HttpClientBuilder.create();
                HttpClient httpClient = clientBuilder.build();
                // Disable SSL certificate verification
                final SSLContext sslContext = new SSLContextBuilder()
                        .loadTrustMaterial(null, ((x509Certificates, authType) -> true)).build();
                httpClient = clientBuilder.setSSLContext(sslContext)
                        .setConnectionManager(new PoolingHttpClientConnectionManager(RegistryBuilder
                                .<ConnectionSocketFactory>create()
                                .register("http", PlainConnectionSocketFactory.INSTANCE)
                                .register("https",
                                        new SSLConnectionSocketFactory(sslContext, NoopHostnameVerifier.INSTANCE))
                                .build()))
                        .build();
                int timeout = 10000;
                HttpComponentsClientHttpRequestFactory requestFactory = new HttpComponentsClientHttpRequestFactory();
                requestFactory.setHttpClient(httpClient);
                requestFactory.setConnectTimeout(timeout);
                restTemplate.setRequestFactory(requestFactory);
                return restTemplate;
            } catch (Exception e) {
                LOGGER.error(e.getMessage());
            }
        }
        return restTemplate;
    }
}
