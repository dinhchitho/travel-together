FROM maven:3.5.2-jdk-8-alpine AS MAVEN_BUILD
COPY pom.xml /build/
COPY src /build/src/

WORKDIR /build/
RUN mvn clean package

FROM openjdk:8u111-jdk-alpine

WORKDIR /app

COPY --from=MAVEN_BUILD /build/target/config-service-0.0.1-SNAPSHOT.jar /app/

ENTRYPOINT ["java","-Dspring.profiles.active=prod","-jar","config-service-0.0.1-SNAPSHOT.jar"]